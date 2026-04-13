import React, { useEffect, useState, useMemo } from 'react';
import { 
  collection, 
  query, 
  orderBy, 
  onSnapshot, 
  Timestamp, 
  deleteDoc, 
  doc, 
  writeBatch, 
  getDocs 
} from 'firebase/firestore';
import { db, auth } from '../../firebase';
import { signOut } from 'firebase/auth';
import { useNavigate, Link } from 'react-router-dom';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend 
} from 'recharts';
import { 
  Download, Filter, Search, LogOut, LayoutDashboard, Database, 
  Users, Calendar, ChevronRight, FileText, TrendingUp, AlertCircle,
  ArrowUpRight, ArrowDownRight, Clock, ArrowLeft, X, Printer, Copy, Check, Zap, BarChart3, ClipboardList, Star,
  Trash2, AlertTriangle
} from 'lucide-react';
import { format, startOfWeek, startOfMonth, isWithinInterval, subDays } from 'date-fns';
import { json2csv } from 'json-2-csv';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

import { 
  EXPERIENCE_OPTIONS,
  CLIENT_SURVEY_SCHEMA,
  FULL_SURVEY_SCHEMA
} from '../../constants';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface SurveyResponse {
  id: string;
  full_name: string;
  email: string;
  role: string;
  user_type: string;
  experience_years?: string;
  practice_type?: string;
  va_count?: string;
  submitted_at: Timestamp;
  sections: any;
  summary?: {
    biggest_challenge: string;
    top_training_needs: string[];
    preferred_training_method: string[];
  };
}

const USER_TYPE_COLORS: Record<string, string> = {
  'Medical Client / Business Client': '#0072B2'
};

const COLORS = [
  '#0072B2', // Blue
  '#009E73', // Bluish Green
  '#D55E00', // Vermillion
  '#CC79A7', // Reddish Purple
  '#E69F00', // Orange
  '#56B4E9', // Sky Blue
  '#F0E442', // Yellow
  '#000000', // Black
  '#7c3aed', // Violet
  '#db2777', // Pink
  '#0891b2', // Cyan
  '#16a34a', // Green
];

// Helper to extract summary from sections
const extractSummary = (res: SurveyResponse) => {
  if (res.summary) return res.summary;

  let biggestChallenge = 'N/A';
  let trainingNeeds: string[] = [];
  let trainingMethods: string[] = [];

  if (res.sections) {
    Object.values(res.sections).forEach((section: any) => {
      // Biggest Challenge
      if (section.biggest_challenge) biggestChallenge = section.biggest_challenge;
      else if (section.priority_role_reason) biggestChallenge = section.priority_role_reason;
      else if (section.readiness_improvement_suggestions) biggestChallenge = section.readiness_improvement_suggestions;
      else if (section.common_client_pain_points && Array.isArray(section.common_client_pain_points)) {
        if (biggestChallenge === 'N/A') biggestChallenge = section.common_client_pain_points.join(', ');
      }
      
      // Training Needs
      const needsKeys = [
        'role_specific_training_needs',
        'micro_modules',
        'biller_micro_modules',
        'receptionist_micro_modules',
        'admin_micro_modules',
        'scribe_micro_modules',
        'health_educator_micro_modules',
        'dental_receptionist_micro_modules',
        'dental_biller_micro_modules',
        'ea_micro_modules',
        'gb_micro_modules',
        'biller_core_skills_upskill',
        'biller_specialized_skills_upskill',
        'receptionist_core_skills_upskill',
        'receptionist_specialized_skills_upskill',
        'admin_core_skills_upskill',
        'admin_specialized_skills_upskill',
        'scribe_core_skills_upskill',
        'scribe_specialized_skills_upskill',
        'health_educator_core_skills_upskill',
        'health_educator_specialized_skills_upskill',
        'dental_receptionist_core_skills_upskill',
        'dental_receptionist_specialized_skills_upskill',
        'dental_biller_core_skills_upskill',
        'dental_biller_specialized_skills_upskill'
      ];
      
      needsKeys.forEach(key => {
        if (section[key]) {
          if (Array.isArray(section[key])) {
            trainingNeeds.push(...section[key]);
          } else if (typeof section[key] === 'object') {
             // Handle grid
             Object.entries(section[key]).forEach(([row, val]) => {
               if (val === 'High training priority' || val === 'Moderate training needed' || val === '4' || val === '3') {
                 trainingNeeds.push(row.split('→')[0].trim());
               }
             });
          }
        }
      });

      // Training Methods
      if (section.training_preference) {
        if (Array.isArray(section.training_preference)) {
          trainingMethods.push(...section.training_preference);
        } else {
          trainingMethods.push(section.training_preference);
        }
      }
    });
  }

  return {
    biggest_challenge: biggestChallenge,
    top_training_needs: Array.from(new Set(trainingNeeds)).slice(0, 3),
    preferred_training_method: Array.from(new Set(trainingMethods))
  };
};

const AdminDashboard: React.FC = () => {
  const [responses, setResponses] = useState<SurveyResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [expFilter, setExpFilter] = useState('All');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedResponse, setSelectedResponse] = useState<SurveyResponse | null>(null);

  const responseSummary = useMemo(() => {
    if (!selectedResponse) return null;
    return extractSummary(selectedResponse);
  }, [selectedResponse]);

  const [isExporting, setIsExporting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [selectedResponseIds, setSelectedResponseIds] = useState<string[]>([]);
  const [deleteTarget, setDeleteTarget] = useState<'all' | 'selected' | string | null>(null);

  const handleDeleteResponses = async (ids: string[]) => {
    setIsDeleting(true);
    try {
      const batch = writeBatch(db);
      ids.forEach((id) => {
        batch.delete(doc(db, 'responses', id));
      });
      await batch.commit();
      setSelectedResponseIds([]);
      setDeleteTarget(null);
      setShowDeleteConfirm(false);
      if (typeof deleteTarget === 'string' && selectedResponse?.id === deleteTarget) {
        setSelectedResponse(null);
      }
    } catch (error) {
      console.error("Error deleting responses:", error);
      alert("Failed to delete responses. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleClearAllResponses = () => {
    setDeleteTarget('all');
    setShowDeleteConfirm(true);
  };

  const handleDeleteSelected = () => {
    if (selectedResponseIds.length === 0) return;
    setDeleteTarget('selected');
    setShowDeleteConfirm(true);
  };

  const handleDeleteIndividual = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setDeleteTarget(id);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    if (deleteTarget === 'all') {
      const q = query(collection(db, 'responses'));
      const snapshot = await getDocs(q);
      const ids = snapshot.docs.map(doc => doc.id);
      await handleDeleteResponses(ids);
    } else if (deleteTarget === 'selected') {
      await handleDeleteResponses(selectedResponseIds);
    } else if (typeof deleteTarget === 'string') {
      await handleDeleteResponses([deleteTarget]);
    }
  };

  const toggleSelectAll = () => {
    if (selectedResponseIds.length === filteredResponses.length) {
      setSelectedResponseIds([]);
    } else {
      setSelectedResponseIds(filteredResponses.map(r => r.id));
    }
  };

  const toggleSelectResponse = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedResponseIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };
  const [activeTab, setActiveTab] = useState<'overview' | 'responses' | 'reports' | 'survey-analysis'>('overview');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [reportRoleFilter, setReportRoleFilter] = useState('All');
  const [reportExpFilter, setReportExpFilter] = useState('All');
  const [reportStartDate, setReportStartDate] = useState('');
  const [reportEndDate, setReportEndDate] = useState('');
  const [analysisRole, setAnalysisRole] = useState('All');
  const navigate = useNavigate();

  useEffect(() => {
    const q = query(collection(db, 'responses'), orderBy('submitted_at', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const allData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as SurveyResponse[];
      
      // Filter to only show Medical Client / Business Client responses
      const medicalData = allData.filter(res => res.user_type === 'Medical Client / Business Client');
      setResponses(medicalData);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching responses:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const practiceTypeChartData = useMemo(() => {
    const practiceMap = responses.reduce((acc: any, curr) => {
      const type = curr.practice_type || curr.sections?.['client-initial']?.practice_type || 'N/A';
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {});
    return Object.entries(practiceMap).map(([name, value]) => ({ name, value }));
  }, [responses]);

  const filteredResponses = useMemo(() => {
    return responses.filter(res => {
      const matchesSearch = res.full_name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           res.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRole = roleFilter === 'All' || res.role === roleFilter;
      const matchesExp = expFilter === 'All' || res.experience_years === expFilter;
      
      const submittedDate = res.submitted_at.toDate();
      const matchesStartDate = !startDate || submittedDate >= new Date(startDate);
      const matchesEndDate = !endDate || submittedDate <= new Date(new Date(endDate).setHours(23, 59, 59, 999));
      
      return matchesSearch && matchesRole && matchesExp && matchesStartDate && matchesEndDate;
    });
  }, [responses, searchTerm, roleFilter, expFilter, startDate, endDate]);

  const stats = useMemo(() => {
    const now = new Date();
    const weekStart = startOfWeek(now);
    const monthStart = startOfMonth(now);

    let totalExp = 0;
    let expCount = 0;

    responses.forEach(res => {
      if (res.experience_years) {
        const match = res.experience_years.match(/(\d+)/);
        if (match) {
          totalExp += parseInt(match[1]);
          expCount++;
        }
      }
    });

    return {
      total: responses.length,
      thisWeek: responses.filter(r => r.submitted_at.toDate() >= weekStart).length,
      thisMonth: responses.filter(r => r.submitted_at.toDate() >= monthStart).length,
      avgExp: expCount > 0 ? (totalExp / expCount).toFixed(1) : '0',
      byRole: responses.reduce((acc: any, curr) => {
        const role = curr.role || 'N/A';
        acc[role] = (acc[role] || 0) + 1;
        return acc;
      }, {})
    };
  }, [responses]);

  const roleChartData = useMemo(() => {
    return Object.entries(stats.byRole).map(([name, value]) => ({ name, value }));
  }, [stats]);

  const experienceChartData = useMemo(() => {
    const expMap = responses.reduce((acc: any, curr) => {
      acc[curr.experience_years] = (acc[curr.experience_years] || 0) + 1;
      return acc;
    }, {});
    return Object.entries(expMap).map(([name, value]) => ({ name, value }));
  }, [responses]);

  const trainingNeedsData = useMemo(() => {
    const counts = responses.reduce((acc: any, curr) => {
      const needs = curr.summary?.top_training_needs || [];
      needs.forEach(need => {
        acc[need] = (acc[need] || 0) + 1;
      });
      return acc;
    }, {});
    return Object.entries(counts)
      .sort((a: any, b: any) => b[1] - a[1])
      .map(([name, value]) => ({ name, value: value as number }));
  }, [responses]);

  const trainingMethodsData = useMemo(() => {
    const counts = responses.reduce((acc: any, curr) => {
      const methods = curr.summary?.preferred_training_method || [];
      methods.forEach(method => {
        acc[method] = (acc[method] || 0) + 1;
      });
      return acc;
    }, {});
    return Object.entries(counts).map(([name, value]) => ({ name, value: value as number }));
  }, [responses]);

  const topRole = useMemo(() => {
    if (roleChartData.length === 0) return 'N/A';
    return [...roleChartData].sort((a, b) => b.value - a.value)[0]?.name || 'N/A';
  }, [roleChartData]);

  const getQuestionLabel = (category: string, userType: string, role: string) => {
    if (userType === 'Medical Client / Business Client') {
      const mapping: Record<string, Record<string, string>> = {
        'Medical Biller': {
          challenges: "Business Impacting Tasks",
          trainingNeeds: "Biller Training Needs",
          systemRequirements: "Most Used Billing Systems",
          tasksWorkflowOperations: "Billing Tasks & Operations",
          workflowSystemEfficiency: "Billing Systems & Efficiency",
          aiEssentials: "AI Adoption & Importance",
          performance: "Client Performance Rating"
        },
        'Medical Receptionist': {
          challenges: "Business Impacting Tasks",
          trainingNeeds: "Receptionist Training Needs",
          systemRequirements: "Most Used Scheduling Systems",
          tasksWorkflowOperations: "Reception Tasks & Operations",
          workflowSystemEfficiency: "Scheduling Systems & Efficiency",
          communicationCoordination: "Patient Interaction & Etiquette",
          aiEssentials: "AI Adoption & Importance",
          performance: "Client Performance Rating"
        },
        'Medical Administrative Assistant': {
          challenges: "Business Impacting Tasks",
          trainingNeeds: "Admin Training Needs",
          systemRequirements: "Most Used Admin Systems",
          tasksWorkflowOperations: "Admin Tasks & Operations",
          workflowSystemEfficiency: "Admin Systems & Efficiency",
          communicationCoordination: "Communication & Coordination",
          aiEssentials: "AI Adoption & Importance",
          performance: "Client Performance Rating"
        },
        'Medical Scribe': {
          challenges: "Business Impacting Tasks",
          trainingNeeds: "Scribe Training Needs",
          systemRequirements: "Most Used EMR Systems",
          tasksWorkflowOperations: "Scribe Tasks & Operations",
          workflowSystemEfficiency: "EMR Systems & Efficiency",
          aiEssentials: "AI Adoption & Importance",
          performance: "Client Performance Rating"
        },
        'Health Educator': {
          challenges: "Business Impacting Tasks",
          trainingNeeds: "Health Educator Training Needs",
          systemRequirements: "Most Used Coaching Platforms",
          tasksWorkflowOperations: "Coaching Tasks & Operations",
          workflowSystemEfficiency: "Coaching Systems & Efficiency",
          aiEssentials: "AI Adoption & Importance",
          performance: "Client Performance Rating"
        },
        'Dental Receptionist': {
          challenges: "Business Impacting Tasks",
          trainingNeeds: "Receptionist Training Needs",
          systemRequirements: "Most Used Dental Software",
          tasksWorkflowOperations: "Dental Reception Tasks & Operations",
          workflowSystemEfficiency: "Dental Software & Efficiency",
          aiEssentials: "AI Adoption & Importance",
          performance: "Client Performance Rating"
        },
        'Dental Biller': {
          challenges: "Business Impacting Tasks",
          trainingNeeds: "Biller Training Needs",
          systemRequirements: "Most Used Dental Billing Software",
          tasksWorkflowOperations: "Dental Billing Tasks & Operations",
          workflowSystemEfficiency: "Dental Billing Systems & Efficiency",
          aiEssentials: "AI Adoption & Importance",
          performance: "Client Performance Rating"
        },
        'Executive Assistant VA': {
          challenges: "Business Impacting Tasks",
          trainingNeeds: "EA Training Needs",
          systemRequirements: "Most Used Admin & Planning Tools",
          tasksWorkflowOperations: "EA Tasks & Operations",
          workflowSystemEfficiency: "Admin Systems & Efficiency",
          communicationCoordination: "Communication & Executive Support",
          aiEssentials: "AI Adoption & Importance",
          performance: "Client Performance Rating"
        },
        'General Business VA': {
          challenges: "Business Impacting Tasks",
          trainingNeeds: "General VA Training Needs",
          systemRequirements: "Most Used Business Tools",
          tasksWorkflowOperations: "Business Tasks & Operations",
          workflowSystemEfficiency: "Business Systems & Efficiency",
          communicationCoordination: "Communication & Support",
          aiEssentials: "AI Adoption & Importance",
          performance: "Client Performance Rating"
        }
      };
      return mapping[role]?.[category] || null;
    }

    return null;
  };

  const roleReportData = useMemo(() => {
    const roleResponses = responses.filter(res => {
      const matchesRole = reportRoleFilter === 'All' || res.role.split(', ').map(r => r.trim()).includes(reportRoleFilter);
      const matchesExp = reportExpFilter === 'All' || res.experience_years === reportExpFilter;
      const date = res.submitted_at.toDate();
      const matchesStart = !reportStartDate || date >= new Date(reportStartDate);
      const matchesEnd = !reportEndDate || date <= new Date(reportEndDate + 'T23:59:59');
      return matchesRole && matchesExp && matchesStart && matchesEnd;
    });

    const reportUserType = 'Medical Client / Business Client';
    
    const aggregateGenericSection = (sectionKey: string, fields: string | string[], isArray = false) => {
      const counts: any = {};
      const fieldList = Array.isArray(fields) ? fields : [fields];
      roleResponses.forEach(res => {
        fieldList.forEach(field => {
          const val = res.sections?.[sectionKey]?.[field];
          if (isArray && Array.isArray(val)) {
            val.forEach(v => { counts[v] = (counts[v] || 0) + 1; });
          } else if (val && typeof val === 'object' && !Array.isArray(val)) {
            // Handle grid: count rows that are not "NA"
            Object.entries(val).forEach(([row, col]) => {
              if (col !== 'NA') {
                counts[row] = (counts[row] || 0) + 1;
              }
            });
          } else if (val) {
            counts[val] = (counts[val] || 0) + 1;
          }
        });
      });
      return Object.entries(counts)
        .sort((a: any, b: any) => b[1] - a[1])
        .map(([name, value]) => ({ name, value: value as number }));
    };

    const mergeAggregates = (arrays: { name: string, value: number }[][]) => {
      const merged: any = {};
      arrays.forEach(arr => {
        arr.forEach(item => {
          merged[item.name] = (merged[item.name] || 0) + item.value;
        });
      });
      return Object.entries(merged)
        .sort((a: any, b: any) => b[1] - a[1])
        .map(([name, value]) => ({ name, value: value as number }));
    };

    return {
      challenges: mergeAggregates([
        aggregateGenericSection('biller-tasks-workflow', 'biller_crucial_tasks', true),
        aggregateGenericSection('receptionist-tasks-workflow', 'receptionist_crucial_tasks', true),
        aggregateGenericSection('admin-tasks-workflow', 'admin_crucial_tasks', true),
        aggregateGenericSection('scribe-tasks-workflow', 'scribe_crucial_tasks', true),
        aggregateGenericSection('health-educator-tasks-workflow', 'health_educator_crucial_tasks', true),
        aggregateGenericSection('dental-receptionist-tasks-workflow', 'dental_receptionist_crucial_tasks', true),
        aggregateGenericSection('dental-biller-tasks-workflow', 'dental_biller_crucial_tasks', true),
        aggregateGenericSection('ea-tasks-workflow', 'ea_crucial_tasks', true),
        aggregateGenericSection('gb-tasks-workflow', 'gb_crucial_tasks', true),
      ]).slice(0, 10),
      
      trainingNeeds: mergeAggregates([
        aggregateGenericSection('biller-competencies-skills', ['biller_core_skills_upskill', 'biller_specialized_skills_upskill'], true),
        aggregateGenericSection('receptionist-competencies-skills', ['receptionist_core_skills_upskill', 'receptionist_specialized_skills_upskill'], true),
        aggregateGenericSection('admin-competencies-skills', ['admin_core_skills_upskill', 'admin_specialized_skills_upskill'], true),
        aggregateGenericSection('scribe-competencies-skills', ['scribe_core_skills_upskill', 'scribe_specialized_skills_upskill'], true),
        aggregateGenericSection('health-educator-competencies-skills', ['health_educator_core_skills_upskill', 'health_educator_specialized_skills_upskill'], true),
        aggregateGenericSection('dental-receptionist-competencies-skills', ['dental_receptionist_core_skills_upskill', 'dental_receptionist_specialized_skills_upskill'], true),
        aggregateGenericSection('dental-biller-competencies-skills', ['dental_biller_core_skills_upskill', 'dental_biller_specialized_skills_upskill'], true),
        aggregateGenericSection('ea-competencies-skills', ['ea_core_skills_upskill', 'ea_specialized_skills_upskill'], true),
        aggregateGenericSection('gb-competencies-skills', ['gb_core_skills_upskill', 'gb_specialized_skills_upskill'], true),
      ]).slice(0, 15),
      
      systemRequirements: mergeAggregates([
        aggregateGenericSection('biller-tasks-workflow', ['biller_tool_proficiency'], false),
        aggregateGenericSection('receptionist-tasks-workflow', ['receptionist_tool_proficiency'], false),
        aggregateGenericSection('admin-tasks-workflow', ['admin_tool_proficiency'], false),
        aggregateGenericSection('scribe-tasks-workflow', ['scribe_tool_proficiency'], false),
        aggregateGenericSection('health-educator-tasks-workflow', ['health_educator_tool_proficiency'], false),
        aggregateGenericSection('dental-receptionist-tasks-workflow', ['dental_receptionist_tool_proficiency'], false),
        aggregateGenericSection('dental-biller-tasks-workflow', ['dental_biller_tool_proficiency'], false),
        aggregateGenericSection('ea-tasks-workflow', ['ea_tool_proficiency'], false),
        aggregateGenericSection('gb-tasks-workflow', ['gb_tool_proficiency'], false),
      ]).slice(0, 10),
      
      tasksWorkflowOperations: mergeAggregates([
        aggregateGenericSection('biller-tasks-workflow', 'biller_proficiency_grid', false),
        aggregateGenericSection('receptionist-tasks-workflow', 'receptionist_proficiency_grid', false),
        aggregateGenericSection('admin-tasks-workflow', 'admin_proficiency_grid', false),
        aggregateGenericSection('scribe-tasks-workflow', 'scribe_proficiency_grid', false),
        aggregateGenericSection('health-educator-tasks-workflow', 'health_educator_proficiency_grid', false),
        aggregateGenericSection('dental-receptionist-tasks-workflow', 'dental_receptionist_proficiency_grid', false),
        aggregateGenericSection('dental-biller-tasks-workflow', 'dental_biller_proficiency_grid', false),
        aggregateGenericSection('ea-tasks-workflow', 'ea_proficiency_grid', false),
        aggregateGenericSection('gb-tasks-workflow', 'gb_proficiency_grid', false),
      ]).slice(0, 10),
 
      workflowSystemEfficiency: mergeAggregates([
        aggregateGenericSection('biller-tasks-workflow', 'biller_other_tools', true),
        aggregateGenericSection('receptionist-tasks-workflow', 'receptionist_other_tools', true),
        aggregateGenericSection('admin-tasks-workflow', 'admin_other_tools', true),
        aggregateGenericSection('scribe-tasks-workflow', 'scribe_other_tools', true),
        aggregateGenericSection('health-educator-tasks-workflow', 'health_educator_other_tools', true),
        aggregateGenericSection('dental-receptionist-tasks-workflow', 'dental_receptionist_other_tools', true),
        aggregateGenericSection('dental-biller-tasks-workflow', 'dental_biller_other_tools', true),
        aggregateGenericSection('ea-tasks-workflow', 'ea_other_tools', true),
        aggregateGenericSection('gb-tasks-workflow', 'gb_other_tools', true),
      ]).slice(0, 10),
 
      communicationCoordination: mergeAggregates([
        aggregateGenericSection('biller-communication-skills', 'biller_comm_proficiency', false),
        aggregateGenericSection('receptionist-communication-skills', 'receptionist_comm_proficiency', false),
        aggregateGenericSection('admin-communication-skills', 'admin_comm_proficiency', false),
        aggregateGenericSection('scribe-communication-skills', 'scribe_comm_proficiency', false),
        aggregateGenericSection('health-educator-communication-skills', 'health_educator_comm_proficiency', false),
        aggregateGenericSection('dental-receptionist-communication-skills', 'dental_receptionist_comm_proficiency', false),
        aggregateGenericSection('dental-biller-communication-skills', 'dental_biller_comm_proficiency', false),
        aggregateGenericSection('ea-communication-skills', 'ea_comm_proficiency', false),
        aggregateGenericSection('gb-communication-skills', 'gb_comm_proficiency', false),
      ]).slice(0, 10),
 
      aiEssentials: mergeAggregates([
        aggregateGenericSection('biller-ai-essentials', ['biller_ai_automation_level', 'biller_ai_tool_proficiency'], false),
        aggregateGenericSection('receptionist-ai-essentials', ['receptionist_ai_automation_level', 'receptionist_ai_tool_proficiency'], false),
        aggregateGenericSection('admin-ai-essentials', ['admin_ai_automation_level', 'admin_ai_tool_proficiency'], false),
        aggregateGenericSection('scribe-ai-essentials', ['scribe_ai_automation_level', 'scribe_ai_tool_proficiency'], false),
        aggregateGenericSection('health-educator-ai-essentials', ['health_educator_ai_automation_level', 'health_educator_ai_tool_proficiency'], false),
        aggregateGenericSection('dental-receptionist-ai-essentials', ['dental_receptionist_ai_automation_level', 'dental_receptionist_ai_tool_proficiency'], false),
        aggregateGenericSection('dental-biller-ai-essentials', ['dental_biller_ai_automation_level', 'dental_biller_ai_tool_proficiency'], false),
        aggregateGenericSection('ea-ai-essentials', ['ea_ai_automation_level', 'ea_ai_tool_proficiency'], false),
        aggregateGenericSection('gb-ai-essentials', ['gb_ai_automation_level', 'gb_ai_tool_proficiency'], false),
      ]).slice(0, 10),
 
      confidence: [],
      total: roleResponses.length,
      clientPerformanceByRole: (() => {
        const roleData: Record<string, { total: number, count: number }> = {};
        const ratingMap: Record<string, string[]> = {
          'Medical Biller': ['biller_proficiency_grid', 'biller_comm_proficiency'],
          'Medical Receptionist': ['receptionist_proficiency_grid', 'receptionist_comm_proficiency'],
          'Medical Administrative Assistant': ['admin_proficiency_grid', 'admin_comm_proficiency'],
          'Medical Scribe': ['scribe_proficiency_grid', 'scribe_comm_proficiency'],
          'Health Educator': ['health_educator_proficiency_grid', 'health_educator_comm_proficiency'],
          'Dental Receptionist': ['dental_receptionist_proficiency_grid', 'dental_receptionist_comm_proficiency'],
          'Dental Biller': ['dental_biller_proficiency_grid', 'dental_biller_comm_proficiency'],
          'Executive Assistant VA': ['ea_proficiency_grid', 'ea_comm_proficiency'],
          'General Business VA': ['gb_proficiency_grid', 'gb_comm_proficiency'],
        };
 
        responses.forEach(res => {
          if (res.user_type !== 'Medical Client / Business Client') return;
          
          // Handle multiple roles in one response
          const roles = res.role.split(', ').map(r => r.trim());
          
          roles.forEach(vaRole => {
            const ratingIds = ratingMap[vaRole];
            if (!ratingIds) return;

            let totalScore = 0;
            let totalCount = 0;

            ratingIds.forEach(ratingId => {
              Object.values(res.sections || {}).forEach((section: any) => {
                const grid = section[ratingId];
                if (grid && typeof grid === 'object') {
                  Object.values(grid).forEach((val: any) => {
                    if (val && !isNaN(Number(val))) {
                      totalScore += Number(val);
                      totalCount++;
                    }
                  });
                }
              });
            });

            if (totalCount > 0) {
              if (!roleData[vaRole]) roleData[vaRole] = { total: 0, count: 0 };
              roleData[vaRole].total += (totalScore / totalCount);
              roleData[vaRole].count += 1;
            }
          });
        });
        return Object.entries(roleData)
          .map(([name, data]) => ({ name, value: Number((data.total / data.count).toFixed(2)) }))
          .sort((a, b) => a.value - b.value);
      })(),
    };
  }, [responses, reportRoleFilter, reportExpFilter, reportStartDate, reportEndDate]);

  const surveyAnalysisData = useMemo(() => {
    let schema: any = CLIENT_SURVEY_SCHEMA;

    if (!schema) return [];

    const filteredResponses = responses.filter(res => {
      if (res.user_type !== 'Medical Client / Business Client') return false;
      if (analysisRole !== 'All') {
        const roles = res.role.split(', ').map(r => r.trim());
        if (!roles.includes(analysisRole)) return false;
      }
      return true;
    });

    const allQuestions: any[] = [];
    
    if (schema.initial && schema.initial.questions) {
      allQuestions.push(...schema.initial.questions.map((q: any) => ({ ...q, sectionId: 'initial' })));
    }

    if (schema.roleSections) {
      Object.entries(schema.roleSections).forEach(([roleName, sections]: [string, any]) => {
        if (analysisRole === 'All' || analysisRole === roleName) {
          sections.forEach((section: any) => {
            if (section.questions) {
              allQuestions.push(...section.questions.map((q: any) => ({ ...q, sectionId: section.id, roleName })));
            }
          });
        }
      });
    }

    const results = allQuestions.map(question => {
      const aggregation: any = {
        id: question.id,
        label: question.label,
        type: question.type,
        options: question.options || [],
        totalResponses: 0,
        data: {},
        average: 0,
        responses: []
      };

      filteredResponses.forEach(res => {
        const answer = res.sections?.[question.sectionId]?.[question.id];
        if (answer !== undefined && answer !== null) {
          aggregation.totalResponses++;
          
          if (question.type === 'radio' || question.type === 'select') {
            aggregation.data[answer] = (aggregation.data[answer] || 0) + 1;
          } else if (question.type === 'checkbox') {
            if (Array.isArray(answer)) {
              answer.forEach((val: any) => {
                aggregation.data[val] = (aggregation.data[val] || 0) + 1;
              });
            }
          } else if (question.type === 'scale') {
            aggregation.data[answer] = (aggregation.data[answer] || 0) + 1;
            aggregation.average += Number(answer);
          } else if (question.type === 'grid') {
            Object.entries(answer).forEach(([row, col]: [string, any]) => {
              if (!aggregation.data[row]) aggregation.data[row] = {};
              aggregation.data[row][col] = (aggregation.data[row][col] || 0) + 1;
            });
          } else if (question.type === 'textarea' || question.type === 'text') {
            aggregation.responses.push(answer);
          }
        }
      });

      if (aggregation.totalResponses > 0 && question.type === 'scale') {
        aggregation.average = Number((aggregation.average / aggregation.totalResponses).toFixed(2));
      }

      return aggregation;
    });

    return results.filter(r => r.totalResponses > 0);
  }, [responses, analysisRole]);

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const exportData = responses.map(res => {
        const baseData: any = {
          ID: res.id,
          Timestamp: format(res.submitted_at.toDate(), 'yyyy-MM-dd HH:mm:ss'),
          FullName: res.full_name,
          Email: res.email,
          Role: res.role,
          UserType: res.user_type,
          Experience: res.experience_years || 'N/A',
          PracticeType: res.practice_type || 'N/A',
          VACount: res.va_count || 'N/A',
        };

        // Flatten all sections dynamically to capture ALL data
        if (res.sections) {
          Object.entries(res.sections).forEach(([sectionId, sectionData]: [string, any]) => {
            Object.entries(sectionData).forEach(([questionId, value]: [string, any]) => {
              const key = `${sectionId}_${questionId}`;
              if (Array.isArray(value)) {
                baseData[key] = value.join(', ');
              } else if (typeof value === 'object' && value !== null) {
                // For grids, flatten them into separate columns
                Object.entries(value).forEach(([row, col]) => {
                  baseData[`${key}_${row}`] = col;
                });
              } else {
                baseData[key] = value;
              }
            });
          });
        }

        return baseData;
      });

      const csv = json2csv(exportData);
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `mmm_survey_responses_${format(new Date(), 'yyyy-MM-dd')}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error("Export error:", err);
    } finally {
      setIsExporting(false);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/admin/login');
  };

  const handleCopyEmail = (email: string) => {
    navigator.clipboard.writeText(email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col lg:flex-row">
      {/* Mobile Header */}
      <div className="lg:hidden bg-white border-b border-gray-200 p-4 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-2 text-blue-600">
          <LayoutDashboard className="h-6 w-6" />
          <span className="font-bold text-lg tracking-tight text-gray-900">Admin Panel</span>
        </div>
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          {isMobileMenuOpen ? <LogOut className="h-6 w-6 rotate-180" /> : <Filter className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
            />
            <motion.div 
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              className="fixed inset-y-0 left-0 w-64 bg-white z-50 lg:hidden shadow-2xl"
            >
              <div className="p-6">
                <div className="flex items-center gap-3 text-blue-600 mb-8">
                  <LayoutDashboard className="h-8 w-8" />
                  <span className="font-bold text-xl tracking-tight text-gray-900">Admin Panel</span>
                </div>
                <nav className="space-y-1">
                  {[
                    { id: 'overview', label: 'Overview', icon: TrendingUp },
                    { id: 'responses', label: 'All Responses', icon: Database },
                    { id: 'reports', label: 'Reports', icon: FileText },
                    { id: 'survey-analysis', label: 'Survey Insights', icon: ClipboardList }
                  ].map((tab) => (
                    <button 
                      key={tab.id}
                      onClick={() => {
                        setActiveTab(tab.id as any);
                        setIsMobileMenuOpen(false);
                      }}
                      className={cn(
                        "w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors",
                        activeTab === tab.id ? "text-blue-600 bg-blue-50" : "text-gray-600 hover:bg-gray-50"
                      )}
                    >
                      <tab.icon className="h-5 w-5" />
                      {tab.label}
                    </button>
                  ))}
                  <Link 
                    to="/" 
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    <ArrowLeft className="h-5 w-5" />
                    Back to Survey
                  </Link>
                </nav>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Sidebar (Desktop) */}
      <div className="w-64 bg-white border-r border-gray-200 fixed h-full hidden lg:block">
        <div className="p-6">
          <div className="flex items-center gap-3 text-blue-600 mb-8">
            <LayoutDashboard className="h-8 w-8" />
            <span className="font-bold text-xl tracking-tight text-gray-900">Admin Panel</span>
          </div>
          
          <nav className="space-y-1">
            <button 
              onClick={() => setActiveTab('overview')}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors",
                activeTab === 'overview' ? "text-blue-600 bg-blue-50" : "text-gray-600 hover:bg-gray-50"
              )}
            >
              <TrendingUp className="h-5 w-5" />
              Overview
            </button>
            <button 
              onClick={() => setActiveTab('responses')}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors",
                activeTab === 'responses' ? "text-blue-600 bg-blue-50" : "text-gray-600 hover:bg-gray-50"
              )}
            >
              <Database className="h-5 w-5" />
              All Responses
            </button>
            <button 
              onClick={() => setActiveTab('reports')}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors",
                activeTab === 'reports' ? "text-blue-600 bg-blue-50" : "text-gray-600 hover:bg-gray-50"
              )}
            >
              <FileText className="h-5 w-5" />
              Reports
            </button>
            <button 
              onClick={() => setActiveTab('survey-analysis')}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors",
                activeTab === 'survey-analysis' ? "text-blue-600 bg-blue-50" : "text-gray-600 hover:bg-gray-50"
              )}
            >
              <ClipboardList className="h-5 w-5" />
              Survey Insights
            </button>
            <Link 
              to="/" 
              className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
              Back to Survey
            </Link>
          </nav>
        </div>
        
        <div className="absolute bottom-0 w-full p-6 border-t border-gray-100">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <LogOut className="h-5 w-5" />
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 lg:ml-64 p-8">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {activeTab === 'overview' && 'Dashboard Overview'}
              {activeTab === 'responses' && 'All Survey Responses'}
              {activeTab === 'reports' && 'Survey Reports'}
            </h1>
            <p className="text-gray-500 mt-1">
              {activeTab === 'overview' && `Welcome back, ${auth.currentUser?.email}`}
              {activeTab === 'responses' && `Managing ${responses.length} total submissions`}
              {activeTab === 'reports' && 'Aggregate insights and data analysis'}
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <button 
              onClick={handleExport}
              disabled={isExporting}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all shadow-sm disabled:opacity-50"
            >
              <Download className="h-4 w-4" />
              {isExporting ? 'Exporting...' : 'Export CSV'}
            </button>
          </div>
        </header>

        {activeTab === 'overview' && (
          <>
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <StatCard title="Total Responses" value={stats.total} icon={Users} color="blue" />
              <StatCard title="This Week" value={stats.thisWeek} icon={Calendar} color="green" trend="+12%" />
              <StatCard title="This Month" value={stats.thisMonth} icon={Clock} color="purple" />
              <StatCard title="Avg. Experience" value={`${stats.avgExp}y`} icon={TrendingUp} color="orange" />
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <h3 className="text-lg font-bold text-gray-900 mb-6">Responses by Role</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={roleChartData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 8, fill: '#6b7280' }} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#6b7280' }} />
                      <Tooltip 
                        cursor={{ fill: '#f9fafb' }}
                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                        formatter={(value: number) => {
                          const percentage = ((value / stats.total) * 100).toFixed(1);
                          return [`${value} (${percentage}%)`, 'Responses'];
                        }}
                      />
                      <Bar dataKey="value" fill={COLORS[0]} radius={[4, 4, 0, 0]} barSize={30} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <h3 className="text-lg font-bold text-gray-900 mb-6">Responses by Practice Type</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={practiceTypeChartData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 8, fill: '#6b7280' }} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#6b7280' }} />
                      <Tooltip 
                        cursor={{ fill: '#f9fafb' }}
                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                        formatter={(value: number) => {
                          const percentage = ((value / stats.total) * 100).toFixed(1);
                          return [`${value} (${percentage}%)`, 'Responses'];
                        }}
                      />
                      <Bar dataKey="value" fill={COLORS[1]} radius={[4, 4, 0, 0]} barSize={30} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Recent Table Section */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                <h3 className="text-lg font-bold text-gray-900">Recent Submissions</h3>
                <button 
                  onClick={() => setActiveTab('responses')}
                  className="text-sm font-medium text-blue-600 hover:text-blue-700"
                >
                  View All
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50/50">
                      <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Respondent</th>
                      <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Role</th>
                      <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Submitted</th>
                      <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {responses.slice(0, 5).map((res) => (
                      <tr 
                        key={res.id} 
                        onClick={() => setSelectedResponse(res)}
                        className="hover:bg-gray-50 cursor-pointer transition-colors group"
                      >
                        <td className="px-6 py-4">
                          <div className="flex flex-col">
                            <span className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">{res.full_name}</span>
                            <span className="text-sm text-gray-500">{res.email}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {res.role}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {format(res.submitted_at.toDate(), 'MMM d, yyyy')}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <span className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
                            View Details <ChevronRight className="h-4 w-4" />
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {activeTab === 'responses' && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <h3 className="text-lg font-bold text-gray-900">All Submissions</h3>
              
              <div className="flex flex-wrap items-center gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input 
                    type="text" 
                    placeholder="Search name or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all w-full md:w-64"
                  />
                </div>
                
                <select 
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  <option value="All">All Roles</option>
                  <option value="Medical Receptionist">Medical Receptionist</option>
                  <option value="Medical Administrative Assistant">Medical Administrative Assistant</option>
                  <option value="Medical Biller">Medical Biller</option>
                  <option value="Medical Scribe">Medical Scribe</option>
                  <option value="Health Educator">Health Educator</option>
                  <option value="Dental Receptionist">Dental Receptionist</option>
                  <option value="Dental Biller">Dental Biller</option>
                  <option value="Executive Assistant VA">Executive Assistant VA</option>
                  <option value="General Business VA">General Business VA</option>
                  <option value="Other">Other</option>
                </select>

                <select 
                  value={expFilter}
                  onChange={(e) => setExpFilter(e.target.value)}
                  className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  <option value="All">All Experience</option>
                  {EXPERIENCE_OPTIONS.filter(opt => {
                    if (roleFilter === "General Business VA" || roleFilter === "Executive Assistant VA") {
                      return opt !== "No prior healthcare experience";
                    } else if (roleFilter !== "All") {
                      return opt !== "No prior Business VA experience";
                    }
                    return true;
                  }).map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>

                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">From:</span>
                    <input 
                      type="date" 
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="px-2 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">To:</span>
                    <input 
                      type="date" 
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="px-2 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                  {(startDate || endDate) && (
                    <button 
                      onClick={() => { setStartDate(''); setEndDate(''); }}
                      className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-gray-600 transition-colors"
                      title="Clear date filter"
                    >
                      <AlertCircle className="h-4 w-4" />
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-2 border-l border-gray-200 pl-3">
                  {selectedResponseIds.length > 0 && (
                    <button
                      onClick={handleDeleteSelected}
                      className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg text-sm font-bold transition-all border border-red-100"
                    >
                      <Trash2 className="h-4 w-4" />
                      Delete Selected ({selectedResponseIds.length})
                    </button>
                  )}
                  <button
                    onClick={handleClearAllResponses}
                    className="flex items-center gap-2 px-4 py-2 bg-white text-gray-600 hover:bg-gray-50 rounded-lg text-sm font-medium transition-all border border-gray-200"
                  >
                    <Trash2 className="h-4 w-4" />
                    Clear All
                  </button>
                </div>
              </div>
            </div>

            {/* Delete Confirmation Modal */}
            <AnimatePresence>
              {showDeleteConfirm && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl border border-red-100"
                  >
                    <div className="flex items-center justify-center w-16 h-16 bg-red-100 text-red-600 rounded-2xl mb-6 mx-auto">
                      <AlertTriangle className="h-8 w-8" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 text-center mb-2">
                      {deleteTarget === 'all' ? 'Clear All Responses?' : 
                       deleteTarget === 'selected' ? `Delete ${selectedResponseIds.length} Responses?` : 
                       'Delete Response?'}
                    </h3>
                    <p className="text-gray-500 text-center mb-8">
                      {deleteTarget === 'all' ? 'This action will permanently delete all survey responses from the database. This cannot be undone.' : 
                       deleteTarget === 'selected' ? `This action will permanently delete the ${selectedResponseIds.length} selected responses. This cannot be undone.` : 
                       'This action will permanently delete this survey response. This cannot be undone.'}
                    </p>
                    <div className="flex gap-3">
                      <button
                        onClick={() => {
                          setShowDeleteConfirm(false);
                          setDeleteTarget(null);
                        }}
                        className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-200 transition-all"
                        disabled={isDeleting}
                      >
                        Cancel
                      </button>
                      <button
                        onClick={confirmDelete}
                        className="flex-1 px-6 py-3 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition-all shadow-lg shadow-red-200 flex items-center justify-center gap-2"
                        disabled={isDeleting}
                      >
                        {isDeleting ? (
                          <>
                            <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            Deleting...
                          </>
                        ) : (
                          deleteTarget === 'all' ? 'Yes, Delete All' : 'Yes, Delete'
                        )}
                      </button>
                    </div>
                  </motion.div>
                </div>
              )}
            </AnimatePresence>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50/50">
                    <th className="px-6 py-4 w-10">
                      <input 
                        type="checkbox"
                        checked={filteredResponses.length > 0 && selectedResponseIds.length === filteredResponses.length}
                        onChange={toggleSelectAll}
                        className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                      />
                    </th>
                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Respondent</th>
                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Role</th>
                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Submitted</th>
                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredResponses.map((res) => (
                    <tr 
                      key={res.id} 
                      onClick={() => setSelectedResponse(res)}
                      className={cn(
                        "hover:bg-gray-50 cursor-pointer transition-colors group",
                        selectedResponseIds.includes(res.id) && "bg-blue-50/30"
                      )}
                    >
                      <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                        <input 
                          type="checkbox"
                          checked={selectedResponseIds.includes(res.id)}
                          onChange={(e) => toggleSelectResponse(res.id, e as any)}
                          className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="font-medium text-gray-900">{res.full_name}</span>
                          <span className="text-sm text-gray-500">{res.email}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-600">
                          {res.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {format(res.submitted_at.toDate(), 'MMM d, yyyy HH:mm')}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={(e) => handleDeleteIndividual(res.id, e)}
                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                            title="Delete response"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                          <span className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
                            View <ChevronRight className="h-4 w-4" />
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              {filteredResponses.length === 0 && (
                <div className="p-12 text-center">
                  <div className="mx-auto h-12 w-12 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <AlertCircle className="h-6 w-6 text-gray-400" />
                  </div>
                  <h4 className="text-gray-900 font-medium">No responses found</h4>
                  <p className="text-gray-500 text-sm">Try adjusting your filters or search term.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'reports' && (
          <div className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Aggregate Analysis</h2>
                <p className="text-sm text-gray-500">Insights for filtered data</p>
              </div>
              <div className="flex flex-wrap items-center gap-4">
                {/* User Type filter removed as it's now client-only */}
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-gray-500">Role:</span>
                  <select 
                    value={reportRoleFilter}
                    onChange={(e) => setReportRoleFilter(e.target.value)}
                    className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  >
                    <option value="All">All Roles</option>
                    <option value="Medical Receptionist">Medical Receptionist</option>
                    <option value="Medical Administrative Assistant">Medical Administrative Assistant</option>
                    <option value="Medical Biller">Medical Biller</option>
                    <option value="Medical Scribe">Medical Scribe</option>
                    <option value="Health Educator">Health Educator</option>
                    <option value="Dental Receptionist">Dental Receptionist</option>
                    <option value="Dental Biller">Dental Biller</option>
                    <option value="Executive Assistant VA">Executive Assistant VA</option>
                    <option value="General Business VA">General Business VA</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-gray-500">Exp:</span>
                  <select 
                    value={reportExpFilter}
                    onChange={(e) => setReportExpFilter(e.target.value)}
                    className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  >
                    <option value="All">All Experience</option>
                    {EXPERIENCE_OPTIONS.filter(opt => {
                      if (reportRoleFilter === "General Business VA" || reportRoleFilter === "Executive Assistant VA") {
                        return opt !== "No prior healthcare experience";
                      } else if (reportRoleFilter !== "All") {
                        return opt !== "No prior Business VA experience";
                      }
                      return true;
                    }).map(opt => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center gap-2 border-l border-gray-200 pl-4">
                  <div className="flex items-center gap-1">
                    <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">From:</span>
                    <input 
                      type="date" 
                      value={reportStartDate}
                      onChange={(e) => setReportStartDate(e.target.value)}
                      className="px-2 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">To:</span>
                    <input 
                      type="date" 
                      value={reportEndDate}
                      onChange={(e) => setReportEndDate(e.target.value)}
                      className="px-2 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Client Performance Rating */}
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 lg:col-span-2">
                <div className="flex items-center gap-2 mb-6">
                  <Star className="h-5 w-5 text-yellow-500" />
                  <h3 className="text-lg font-bold text-gray-900">
                    {getQuestionLabel('performance', 'Medical Client / Business Client', reportRoleFilter) || "Client Performance Rating by Role"}
                  </h3>
                </div>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={roleReportData.clientPerformanceByRole} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                      <XAxis type="number" domain={[0, 4]} hide />
                      <YAxis 
                        dataKey="name" 
                        type="category" 
                        width={180} 
                        tick={{ fontSize: 10, fill: '#64748b' }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <Tooltip 
                        cursor={{ fill: '#f8fafc' }}
                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                        formatter={(value: number) => [`${value} / 4.0`, 'Avg. Rating']}
                      />
                      <Bar dataKey="value" fill="#fbbf24" radius={[0, 4, 4, 0]} barSize={20}>
                        {roleReportData.clientPerformanceByRole.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.value >= 3.5 ? '#10b981' : entry.value >= 3.0 ? '#3b82f6' : entry.value >= 2.5 ? '#fbbf24' : '#ef4444'} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4 flex items-center justify-center gap-6 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                  <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-[#10b981]"></div> Advanced (3.5+)</div>
                  <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-[#3b82f6]"></div> Proficient (3.0+)</div>
                  <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-[#fbbf24]"></div> Developing (2.5+)</div>
                  <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-[#ef4444]"></div> Basic (&lt;2.5)</div>
                </div>
              </div>

              {/* Challenges & Pain Points */}
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex items-center gap-2 mb-6">
                  <AlertCircle className="h-5 w-5 text-red-500" />
                  <h3 className="text-lg font-bold text-gray-900">
                    {getQuestionLabel('challenges', 'Medical Client / Business Client', reportRoleFilter) || "Business Impacting Tasks"}
                  </h3>
                </div>
                <div className="space-y-4">
                  {roleReportData.challenges.slice(0, 5).map((item, idx) => (
                    <div key={idx} className="flex items-start gap-3 p-3 bg-red-50/50 rounded-xl border border-red-100">
                      <span className="flex-shrink-0 w-6 h-6 bg-red-100 text-red-600 rounded-full flex items-center justify-center text-xs font-bold">
                        {idx + 1}
                      </span>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-red-900">{item.name}</p>
                        <p className="text-xs text-red-600 mt-1">{item.value} mentions</p>
                      </div>
                    </div>
                  ))}
                  {roleReportData.challenges.length === 0 && (
                    <p className="text-sm text-gray-500 italic">No data available for this role.</p>
                  )}
                </div>
              </div>

              {/* AI Essentials */}
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex items-center gap-2 mb-6">
                  <Zap className="h-5 w-5 text-purple-500" />
                  <h3 className="text-lg font-bold text-gray-900">
                    {getQuestionLabel('aiEssentials', 'Medical Client / Business Client', reportRoleFilter) || "AI Adoption & Importance"}
                  </h3>
                </div>
                <div className="space-y-4">
                  {roleReportData.aiEssentials.slice(0, 5).map((item, idx) => (
                    <div key={idx} className="flex items-start gap-3 p-3 bg-purple-50/50 rounded-xl border border-purple-100">
                      <span className="flex-shrink-0 w-6 h-6 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center text-xs font-bold">
                        {idx + 1}
                      </span>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-purple-900">{item.name}</p>
                        <p className="text-xs text-purple-600 mt-1">{item.value} mentions</p>
                      </div>
                    </div>
                  ))}
                  {roleReportData.aiEssentials.length === 0 && (
                    <p className="text-sm text-gray-500 italic">No AI data available for this role.</p>
                  )}
                </div>
              </div>

              {/* System Requirements */}
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 lg:col-span-2">
                <h3 className="text-lg font-bold text-gray-900 mb-6">
                  {getQuestionLabel('systemRequirements', 'Medical Client / Business Client', reportRoleFilter) || "Most Used Systems"}
                </h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={roleReportData.systemRequirements.slice(0, 8)} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                      <XAxis type="number" hide />
                      <YAxis 
                        dataKey="name" 
                        type="category" 
                        width={180} 
                        tick={{ fontSize: 10, fill: '#64748b' }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <Tooltip 
                        cursor={{ fill: '#f8fafc' }}
                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                      />
                      <Bar dataKey="value" fill={COLORS[6]} radius={[0, 4, 4, 0]} barSize={20} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Medical Client / Business Client Specific Reports */}
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <h3 className="text-lg font-bold text-gray-900 mb-6">
                  {getQuestionLabel('tasksWorkflowOperations', 'Medical Client / Business Client', reportRoleFilter) || "Tasks, Workflow & Operations"}
                </h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={roleReportData.tasksWorkflowOperations.slice(0, 5)} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                      <XAxis type="number" hide />
                      <YAxis dataKey="name" type="category" width={150} tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} />
                      <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                      <Bar dataKey="value" fill={COLORS[0]} radius={[0, 4, 4, 0]} barSize={20} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <h3 className="text-lg font-bold text-gray-900 mb-6">
                  {getQuestionLabel('workflowSystemEfficiency', 'Medical Client / Business Client', reportRoleFilter) || "Workflow & System Efficiency"}
                </h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={roleReportData.workflowSystemEfficiency.slice(0, 5)} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                      <XAxis type="number" hide />
                      <YAxis dataKey="name" type="category" width={150} tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} />
                      <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                      <Bar dataKey="value" fill={COLORS[1]} radius={[0, 4, 4, 0]} barSize={20} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 lg:col-span-2">
                <h3 className="text-lg font-bold text-gray-900 mb-6">
                  {getQuestionLabel('communicationCoordination', 'Medical Client / Business Client', reportRoleFilter) || "Communication & Coordination"}
                </h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={roleReportData.communicationCoordination.slice(0, 8)} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                      <XAxis type="number" hide />
                      <YAxis dataKey="name" type="category" width={180} tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} />
                      <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                      <Bar dataKey="value" fill={COLORS[2]} radius={[0, 4, 4, 0]} barSize={20} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Specialized Training Needs */}
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 lg:col-span-2">
                <h3 className="text-lg font-bold text-gray-900 mb-6">
                  {getQuestionLabel('trainingNeeds', 'Medical Client / Business Client', reportRoleFilter) || "Specialized Training Needs"}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {roleReportData.trainingNeeds.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between p-4 bg-blue-50/50 rounded-2xl border border-blue-100">
                      <span className="text-sm font-bold text-blue-900">{item.name}</span>
                      <span className="px-3 py-1 bg-blue-600 text-white text-xs font-bold rounded-lg">
                        {item.value} requests
                      </span>
                    </div>
                  ))}
                  {roleReportData.trainingNeeds.length === 0 && (
                    <p className="text-sm text-gray-500 italic col-span-3">No specialized training data available.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'survey-analysis' && (
          <div className="space-y-8">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 tracking-tight">Survey Insights</h2>
                  <p className="text-sm text-gray-500">Question-by-question aggregate analysis</p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <select
                    value={analysisRole}
                    onChange={(e) => setAnalysisRole(e.target.value)}
                    className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                  >
                    <option value="All">All Client Roles</option>
                    {Object.keys(CLIENT_SURVEY_SCHEMA.roleSections).map(role => (
                      <option key={role} value={role}>{role}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-8">
                {surveyAnalysisData.map((question, idx) => (
                  <div key={idx} className="bg-gray-50/50 rounded-2xl p-6 border border-gray-100">
                    <div className="flex items-start justify-between gap-4 mb-6">
                      <div className="flex-1">
                        <h3 className="text-base font-bold text-gray-900 leading-snug">{question.label}</h3>
                        <div className="flex items-center gap-3 mt-2">
                          <span className="text-xs font-medium text-gray-500 bg-white px-2 py-1 rounded-md border border-gray-200">
                            {question.type.toUpperCase()}
                          </span>
                          <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-md border border-blue-100">
                            {question.totalResponses} Responses
                          </span>
                          {question.type === 'scale' && (
                            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md border border-emerald-100">
                              Avg: {question.average}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {(question.type === 'radio' || question.type === 'checkbox' || question.type === 'scale' || question.type === 'select') && (
                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart 
                            layout="vertical" 
                            data={Object.entries(question.data).map(([name, value]) => ({ 
                              name: name.length > 40 ? name.substring(0, 37) + '...' : name, 
                              fullName: name,
                              value 
                            })).sort((a, b) => (b.value as number) - (a.value as number))}
                            margin={{ left: 100, right: 40 }}
                          >
                            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
                            <XAxis type="number" hide />
                            <YAxis 
                              type="category" 
                              dataKey="name" 
                              width={100}
                              tick={{ fontSize: 10, fill: '#64748b', fontWeight: 500 }}
                              axisLine={false}
                              tickLine={false}
                            />
                            <Tooltip 
                              cursor={{ fill: '#f1f5f9' }}
                              content={({ active, payload }) => {
                                if (active && payload && payload.length) {
                                  const data = payload[0].payload;
                                  const percentage = ((data.value / question.totalResponses) * 100).toFixed(1);
                                  return (
                                    <div className="bg-white p-3 rounded-xl shadow-xl border border-gray-100">
                                      <p className="text-xs font-bold text-gray-900 mb-1 max-w-xs">{data.fullName}</p>
                                      <div className="flex items-center gap-2">
                                        <span className="text-lg font-black text-blue-600">{data.value}</span>
                                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">({percentage}%)</span>
                                      </div>
                                    </div>
                                  );
                                }
                                return null;
                              }}
                            />
                            <Bar dataKey="value" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={20} />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    )}

                    {question.type === 'grid' && (
                      <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse bg-white rounded-xl overflow-hidden border border-gray-200">
                          <thead>
                            <tr className="bg-gray-50">
                              <th className="px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider border-b border-gray-200">Task / Skill</th>
                              {Object.values(question.data)[0] && Object.keys(Object.values(question.data)[0] as any).map(col => (
                                <th key={col} className="px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider border-b border-gray-200 text-center">{col}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100">
                            {Object.entries(question.data).map(([row, cols]: [string, any]) => (
                              <tr key={row}>
                                <td className="px-4 py-3 text-sm font-medium text-gray-900 border-r border-gray-100">{row}</td>
                                {Object.entries(cols).map(([col, count]: [string, any]) => (
                                  <td key={col} className="px-4 py-3 text-center">
                                    <div className="flex flex-col items-center">
                                      <span className="text-sm font-bold text-blue-600">{count}</span>
                                      <span className="text-[10px] text-gray-400 font-medium">({((count / question.totalResponses) * 100).toFixed(0)}%)</span>
                                    </div>
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}

                    {(question.type === 'textarea' || question.type === 'text') && (
                      <div className="space-y-3 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
                        {question.responses.slice(0, 10).map((resp: string, rIdx: number) => (
                          <div key={rIdx} className="p-4 bg-white rounded-xl border border-gray-200 text-sm text-gray-600 italic">
                            "{resp}"
                          </div>
                        ))}
                        {question.responses.length > 10 && (
                          <p className="text-xs text-gray-400 text-center italic">Showing top 10 of {question.responses.length} responses</p>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedResponse && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm print:p-0 print:bg-white">
            <motion.div 
              initial={{ opacity: 0, y: 20, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.98 }}
              className="bg-white w-full max-w-5xl max-h-[90vh] overflow-hidden rounded-3xl shadow-2xl flex flex-col print:max-h-none print:shadow-none print:rounded-none"
            >
              {/* Modal Header */}
              <div className="bg-white border-b border-slate-100 p-6 flex items-center justify-between sticky top-0 z-10 print:static">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-blue-200">
                    {selectedResponse.full_name.charAt(0)}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900 leading-tight">{selectedResponse.full_name}</h2>
                    <div className="flex items-center gap-3 text-sm text-slate-500">
                      <button 
                        onClick={() => handleCopyEmail(selectedResponse.email)}
                        className="flex items-center gap-1.5 hover:text-blue-600 transition-colors group"
                      >
                        {selectedResponse.email}
                        {copiedEmail ? <Check className="h-3.5 w-3.5 text-green-500" /> : <Copy className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />}
                      </button>
                      <span>•</span>
                      <span className="font-medium text-slate-700">{selectedResponse.role}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 print:hidden">
                  <button 
                    onClick={(e) => handleDeleteIndividual(selectedResponse.id, e)}
                    className="p-2.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                    title="Delete Response"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                  <button 
                    onClick={handlePrint}
                    className="p-2.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                    title="Print Response"
                  >
                    <Printer className="h-5 w-5" />
                  </button>
                  <button 
                    onClick={() => setSelectedResponse(null)}
                    className="p-2.5 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>
              </div>
              
              <div className="flex-1 overflow-y-auto p-8 print:p-0 print:overflow-visible">
                <div id="printable-response" className="space-y-12 max-w-4xl mx-auto">
                  {/* Quick Stats Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">User Type</p>
                      <p className="text-blue-600 font-bold text-lg">{selectedResponse.user_type}</p>
                    </div>
                    <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Role/VA Role</p>
                      <p className="text-slate-900 font-bold text-lg">{selectedResponse.role}</p>
                    </div>
                    <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Submitted</p>
                      <p className="text-slate-600 font-medium">{format(selectedResponse.submitted_at.toDate(), 'MMM d, yyyy')}</p>
                    </div>
                    <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Email</p>
                      <p className="text-slate-600 font-medium truncate" title={selectedResponse.email}>{selectedResponse.email}</p>
                    </div>
                  </div>

                  {/* Summary Section */}
                  <div className="bg-gradient-to-br from-indigo-600 to-blue-700 rounded-3xl p-6 text-white shadow-lg relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-6 opacity-10">
                      <Zap className="w-24 h-24" />
                    </div>
                    <div className="relative z-10">
                      <div className="flex items-center gap-2 mb-6">
                        <Zap className="w-5 h-5 text-yellow-300 fill-yellow-300" />
                        <h3 className="text-lg font-bold">Response Summary</h3>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-2">
                          <p className="text-indigo-100 text-[10px] font-bold uppercase tracking-wider">Biggest Challenge</p>
                          <p className="text-sm font-medium leading-relaxed line-clamp-3">
                            {responseSummary?.biggest_challenge || 'No challenge specified'}
                          </p>
                        </div>
                        
                        <div className="space-y-2">
                          <p className="text-indigo-100 text-[10px] font-bold uppercase tracking-wider">Top 3 Training Needs</p>
                          <div className="flex flex-wrap gap-1.5">
                            {responseSummary?.top_training_needs.length ? responseSummary.top_training_needs.map((need, i) => (
                              <span key={i} className="px-2 py-0.5 bg-white/10 backdrop-blur-md rounded-md text-[11px] font-medium border border-white/10">
                                {need}
                              </span>
                            )) : <span className="text-indigo-200 text-xs italic">None identified</span>}
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <p className="text-indigo-100 text-[10px] font-bold uppercase tracking-wider">Preferred Methods</p>
                          <div className="flex flex-wrap gap-1.5">
                            {responseSummary?.preferred_training_method.length ? responseSummary.preferred_training_method.map((method, i) => (
                              <span key={i} className="px-2 py-0.5 bg-white/10 backdrop-blur-md rounded-md text-[11px] font-medium border border-white/10">
                                {method}
                              </span>
                            )) : <span className="text-indigo-200 text-xs italic">None identified</span>}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Detailed Sections */}
                  <div className="space-y-16">
                    {selectedResponse.user_type === 'Medical Client / Business Client' && (
                      <>
                        <section className="space-y-6">
                          <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
                            <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
                              <Database className="w-5 h-5" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900">Practice & Client Information</h3>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                            <div>
                              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Practice Type</h4>
                              <p className="text-slate-700 bg-slate-50 p-4 rounded-xl border border-slate-100 text-sm">
                                {selectedResponse.sections?.['client-initial']?.practice_type === 'Other' 
                                  ? `Other: ${selectedResponse.sections?.['client-initial']?.practice_type_other || 'N/A'}`
                                  : (selectedResponse.sections?.['client-initial']?.practice_type || 'N/A')}
                              </p>
                            </div>
                            <div>
                              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">VA Count</h4>
                              <p className="text-slate-700 bg-slate-50 p-4 rounded-xl border border-slate-100 text-sm">
                                {selectedResponse.sections?.['client-initial']?.va_count || 'N/A'}
                              </p>
                            </div>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                            <div>
                              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">VA Role Feedback</h4>
                              <p className="text-slate-700 bg-slate-50 p-4 rounded-xl border border-slate-100 text-sm">
                                {selectedResponse.sections?.['client-initial']?.va_role_feedback || 'N/A'}
                              </p>
                            </div>
                          </div>
                        </section>

                        {/* Display role-specific sections if they exist */}
                        {Object.entries(selectedResponse.sections || {}).map(([sectionId, data]: [string, any]) => {
                          if (sectionId === 'client-initial') return null;
                          
                          // Find section title from schema
                          let sectionTitle = sectionId.replace(/-/g, ' ');
                          const roleSections = CLIENT_SURVEY_SCHEMA.roleSections[selectedResponse.role as keyof typeof CLIENT_SURVEY_SCHEMA.roleSections] || [];
                          const schemaSection = roleSections.find(s => s.id === sectionId);
                          if (schemaSection) {
                            sectionTitle = schemaSection.title;
                          }

                          return (
                            <section key={sectionId} className="space-y-6">
                              <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
                                <div className="p-2.5 bg-slate-50 text-slate-600 rounded-xl">
                                  <FileText className="w-5 h-5" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 capitalize">{sectionTitle}</h3>
                              </div>
                              <div className="grid grid-cols-1 gap-6">
                                {Object.entries(data).map(([key, value]: [string, any]) => {
                                  // Find question label from schema
                                  let questionLabel = key.replace(/_/g, ' ');
                                  if (schemaSection) {
                                    const question = schemaSection.questions.find(q => q.id === key);
                                    if (question) {
                                      questionLabel = question.label;
                                    }
                                  }

                                  return (
                                    <div key={key}>
                                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">{questionLabel}</h4>
                                      <div className="text-slate-700 bg-slate-50 p-4 rounded-xl border border-slate-100 text-sm">
                                        {Array.isArray(value) ? value.join(', ') : typeof value === 'object' ? JSON.stringify(value) : String(value)}
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            </section>
                          );
                        })}
                      </>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

const StatCard: React.FC<{ 
  title: string; 
  value: string | number; 
  icon: any; 
  color: string;
  trend?: string;
}> = ({ title, value, icon: Icon, color, trend }) => {
  const colorClasses: any = {
    blue: "bg-blue-50 text-blue-600",
    green: "bg-green-50 text-green-600",
    purple: "bg-purple-50 text-purple-600",
    orange: "bg-orange-50 text-orange-600",
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-start justify-between">
      <div>
        <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
        <div className="flex items-baseline gap-2">
          <h4 className="text-2xl font-bold text-gray-900">{value}</h4>
          {trend && (
            <span className="text-xs font-medium text-green-600 flex items-center">
              <ArrowUpRight className="h-3 w-3" />
              {trend}
            </span>
          )}
        </div>
      </div>
      <div className={cn("p-3 rounded-xl", colorClasses[color])}>
        <Icon className="h-6 w-6" />
      </div>
    </div>
  );
};

export default AdminDashboard;
