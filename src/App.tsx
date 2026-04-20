import { useState, useMemo, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate, Link } from "react-router-dom";
import { FULL_SURVEY_SCHEMA } from "./constants";
import { Role, Section, SurveyResponse as SurveyResponseType, UserType } from "./types";
import { Card, Button, ProgressBar } from "./components/UI";
import { QuestionRenderer } from "./components/QuestionRenderer";
import { Onboarding } from "./components/Onboarding";
import { SurveyBot } from "./components/SurveyBot";
import { Logo } from "./components/Logo";
import { db, auth } from "./firebase";
import { collection, addDoc, serverTimestamp, getDocFromServer, doc } from "firebase/firestore";
import { signOut } from "firebase/auth";
import { motion, AnimatePresence } from "motion/react";
import { 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle2, 
  RotateCcw, 
  AlertCircle,
  LayoutDashboard,
  Bot
} from "lucide-react";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminLogin from "./pages/admin/Login";
import AdminDashboard from "./pages/admin/Dashboard";

const STORAGE_KEY = "mmm_survey_draft_v2";

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData.map(provider => ({
        providerId: provider.providerId,
        displayName: provider.displayName,
        email: provider.email,
        photoUrl: provider.photoURL
      })) || []
    },
    operationType,
    path
  }
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

function SurveyApp() {
  const { user, isAdmin } = useAuth();
  const [userType, setUserType] = useState<UserType | null>(null);
  const [formData, setFormData] = useState<SurveyResponseType>({});
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(true);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleLogout = async () => {
    await signOut(auth);
  };

  // Test connection
  useEffect(() => {
    async function testConnection() {
      try {
        await getDocFromServer(doc(db, 'test', 'connection'));
      } catch (error) {
        if(error instanceof Error && error.message.includes('the client is offline')) {
          console.error("Please check your Firebase configuration. ");
        }
      }
    }
    testConnection();
  }, []);

  // Load draft
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setFormData(parsed.data || {});
        setCurrentStepIndex(parsed.step || 0);
        setUserType(parsed.userType || null);
        setShowOnboarding(false);
      } catch (e) {
        console.error("Failed to load draft", e);
      }
    }
  }, []);

  // Save draft
  useEffect(() => {
    if (Object.keys(formData).length > 0 && !isSubmitted && userType) {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          data: formData,
          step: currentStepIndex,
          userType
        })
      );
    }
  }, [formData, currentStepIndex, isSubmitted, userType]);

  const steps = useMemo(() => {
    if (!userType) return [];

    if (userType === "Medical Client / Business Client") {
      const selectedRoles = (formData.va_role_feedback as Role[]) || [];
      const allSteps: Section[] = [];

      // 1. Initial Info
      allSteps.push({ ...FULL_SURVEY_SCHEMA.client.initial });

      // 2. Part 2 for all roles
      selectedRoles.forEach((role, index) => {
        const sections = FULL_SURVEY_SCHEMA.client.roleSections[role];
        if (sections && sections[0]) {
          allSteps.push({ ...sections[0], role });
        }
      });

      // 3. Remaining parts for the FIRST role ONLY
      const firstRole = selectedRoles[0];
      if (firstRole) {
        const sections = FULL_SURVEY_SCHEMA.client.roleSections[firstRole];
        if (sections && sections.length > 1) {
          // Add Part 3, 4, 5 (indices 1, 2, 3)
          sections.slice(1).forEach(s => allSteps.push({ ...s, role: firstRole }));
        }
      }

      return allSteps;
    }

    if (userType === "Virtual Assistant") {
      const role = formData.role as Role;
      if (!role) return [{ ...FULL_SURVEY_SCHEMA.va.profile }];
      
      const sections = FULL_SURVEY_SCHEMA.va.roleSections[role] || [];
      return [
        { ...FULL_SURVEY_SCHEMA.va.profile },
        ...sections
      ];
    }

    if (userType === "MMM Support") {
      const role = formData.support_role as string;
      if (!role) return [{ ...FULL_SURVEY_SCHEMA.support.initial }];
      
      const sections = FULL_SURVEY_SCHEMA.support.roleSections[role] || [];
      return [
        { ...FULL_SURVEY_SCHEMA.support.initial },
        ...sections
      ];
    }

    return [];
  }, [userType, formData.va_role_feedback]);

  const currentStep = steps[currentStepIndex];

  const validateStep = () => {
    const newErrors: Record<string, string> = {};
    let isValid = true;

    currentStep.questions.forEach((q) => {
      const val = formData[q.id];
      
      if (q.required) {
        const isEmpty = val === undefined || val === "" || (Array.isArray(val) && val.length === 0);
        const isGridEmpty = q.type === "grid" && (val === undefined || Object.keys(val as Record<string, any>).length === 0);

        if (isEmpty && !isGridEmpty) {
          newErrors[q.id] = "This field is required";
          isValid = false;
        } else if (q.type === "grid") {
          const gridVal = val as Record<string, string>;
          let rows = q.rows || [];
          
          if (q.dynamicRowsFrom) {
            const sources = Array.isArray(q.dynamicRowsFrom) ? q.dynamicRowsFrom : [q.dynamicRowsFrom];
            const allSelectedRows: string[] = [];
            sources.forEach(sourceId => {
              const selectedRows = formData[sourceId];
              if (Array.isArray(selectedRows)) {
                selectedRows.forEach(row => {
                  if (row === "Other") {
                    const otherVal = formData[`${sourceId}_other`];
                    if (otherVal && typeof otherVal === "string" && otherVal.trim() !== "") {
                      allSelectedRows.push(otherVal.trim());
                    }
                  } else {
                    allSelectedRows.push(row);
                  }
                });
              }
            });
            rows = allSelectedRows;
          }

          // Check for required text input in grid rows
          rows.forEach(row => {
            if (row === "Other" || (q.rowsWithInputs?.includes(row))) {
              const otherVal = row === "Other" ? formData[`${q.id}_other`] : (formData[`${q.id}_details`] as Record<string, string>)?.[row];
              if (gridVal[row] && (!otherVal || (otherVal as string).trim() === "")) {
                newErrors[q.id] = `Please specify details for: ${row}`;
                isValid = false;
              }
            }

            // Check for sub-option ratings
            if (q.rateSubOptions && q.rowsWithCheckboxes?.[row] && gridVal[row] && gridVal[row] !== "NA") {
              const selectedSubOptions = (formData[`${q.id}_details`] as Record<string, any>)?.[row] as string[];
              const ratings = (formData[`${q.id}_details`] as Record<string, any>)?.[`${row}_ratings`] as Record<string, string>;
              
              if (selectedSubOptions && selectedSubOptions.length > 0) {
                const missingRatings = selectedSubOptions.filter(opt => !ratings?.[opt]);
                if (missingRatings.length > 0) {
                  newErrors[q.id] = `Please rate all selected tools for: ${row}`;
                  isValid = false;
                }
              }
            }
          });
        } else if (val === "Other" || (Array.isArray(val) && val.includes("Other"))) {
          const otherVal = formData[`${q.id}_other`];
          if (!otherVal || (otherVal as string).trim() === "") {
            newErrors[q.id] = "Please specify the 'Other' option";
            isValid = false;
          }
        }

        // Check options with inputs
        if (q.optionsWithInputs && Array.isArray(val)) {
          const details = (formData[`${q.id}_details`] as Record<string, string>) || {};
          const missingDetails = q.optionsWithInputs.filter(opt => 
            val.includes(opt) && (!details[opt] || details[opt].trim() === "")
          );
          if (missingDetails.length > 0) {
            newErrors[q.id] = `Please specify details for: ${missingDetails.join(", ")}`;
            isValid = false;
          }
        }

        // Check for sub-option ratings in checkbox type
        if (q.rateSubOptions && q.optionsWithCheckboxes && Array.isArray(val)) {
          val.forEach(option => {
            if (q.optionsWithCheckboxes?.[option]) {
              const selectedSubOptions = (formData[`${q.id}_details`] as Record<string, any>)?.[option] as string[];
              const ratings = (formData[`${q.id}_details`] as Record<string, any>)?.[`${option}_ratings`] as Record<string, string>;
              
              if (selectedSubOptions && selectedSubOptions.length > 0) {
                const missingRatings = selectedSubOptions.filter(opt => !ratings?.[opt]);
                if (missingRatings.length > 0) {
                  newErrors[q.id] = `Please rate all selected modules for: ${option}`;
                  isValid = false;
                }
              }
            }
          });
        }
      }

      if (q.maxSelections && Array.isArray(val) && val.length > q.maxSelections) {
        newErrors[q.id] = `Please select at most ${q.maxSelections} options`;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const handleNext = async () => {
    if (validateStep()) {
      if (currentStepIndex < steps.length - 1) {
        setCurrentStepIndex(prev => prev + 1);
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        await handleSubmit();
      }
    }
  };

  const sanitizeData = (data: any): any => {
    if (Array.isArray(data)) {
      return data.map(sanitizeData);
    } else if (data !== null && typeof data === 'object') {
      const sanitized: any = {};
      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined) {
          sanitized[key] = sanitizeData(value);
        }
      });
      return sanitized;
    }
    return data;
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      const sanitizedResponses = sanitizeData(formData);
      
      if (userType === "Medical Client / Business Client") {
        const selectedRoles = (formData.va_role_feedback as Role[]) || [];
        
        // We will submit one document per role
        for (let i = 0; i < selectedRoles.length; i++) {
          const role = selectedRoles[i];
          const roleSections: Record<string, any> = {};
          
          steps.forEach(step => {
            const stepRole = (step as any).role;
            if (step.id === "client-initial" || stepRole === role) {
              const sectionData: Record<string, any> = {};
              step.questions.forEach(q => {
                if (sanitizedResponses[q.id] !== undefined) {
                  sectionData[q.id] = sanitizedResponses[q.id];
                  
                  const otherKey = `${q.id}_other`;
                  if (sanitizedResponses[otherKey] !== undefined) sectionData[otherKey] = sanitizedResponses[otherKey];

                  const detailsKey = `${q.id}_details`;
                  if (sanitizedResponses[detailsKey] !== undefined) sectionData[detailsKey] = sanitizedResponses[detailsKey];
                }
              });
              if (Object.keys(sectionData).length > 0) {
                roleSections[step.id] = sectionData;
              }
            }
          });

          const submission = {
            user_type: userType,
            full_name: (sanitizedResponses.full_name as string) || user?.displayName || "Client",
            email: (sanitizedResponses.email as string) || user?.email || "no-email@provided.com",
            roleByClient: role,
            role: role,
            practice_type: (sanitizedResponses.practice_type as string) || "N/A",
            va_count: (sanitizedResponses.va_count as string) || "N/A",
            sections: roleSections,
            submitted_at: serverTimestamp(),
            is_additional_role: i > 0
          };

          await addDoc(collection(db, "responses"), submission);
        }
      } else {
        // Handle VA and Support (Single submission)
        const roleSections: Record<string, any> = {};
        steps.forEach(step => {
          const sectionData: Record<string, any> = {};
          step.questions.forEach(q => {
            if (sanitizedResponses[q.id] !== undefined) {
              sectionData[q.id] = sanitizedResponses[q.id];
              const otherKey = `${q.id}_other`;
              if (sanitizedResponses[otherKey] !== undefined) sectionData[otherKey] = sanitizedResponses[otherKey];
              const detailsKey = `${q.id}_details`;
              if (sanitizedResponses[detailsKey] !== undefined) sectionData[detailsKey] = sanitizedResponses[detailsKey];
            }
          });
          if (Object.keys(sectionData).length > 0) {
            roleSections[step.id] = sectionData;
          }
        });

        const submission = {
          user_type: userType,
          full_name: (sanitizedResponses.full_name as string) || (sanitizedResponses.support_name as string) || user?.displayName || userType,
          email: (sanitizedResponses.email as string) || user?.email || "no-email@provided.com",
          role: (sanitizedResponses.role as string) || (sanitizedResponses.support_role as string) || "N/A",
          sections: roleSections,
          submitted_at: serverTimestamp(),
        };

        await addDoc(collection(db, "responses"), submission);
      }
      
      setIsSubmitted(true);
      localStorage.removeItem(STORAGE_KEY);
    } catch (error: any) {
      if (error.message?.includes("insufficient permissions")) {
        try {
          handleFirestoreError(error, OperationType.CREATE, "responses");
        } catch (e: any) {
          setSubmitError(`Submission failed: ${e.message}`);
          return;
        }
      }
      console.error("Submission error:", error);
      setSubmitError(`Submission failed: ${error.message}. Please contact support if this persists.`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(prev => prev - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const updateFormData = (questionId: string, value: any) => {
    setFormData(prev => ({ ...prev, [questionId]: value }));
    if (errors[questionId]) {
      setErrors(prev => {
        const next = { ...prev };
        delete next[questionId];
        return next;
      });
    }
  };

  const updateOptionDetail = (questionId: string, option: string, value: any) => {
    setFormData(prev => {
      const details = (prev[`${questionId}_details`] as Record<string, any>) || {};
      return {
        ...prev,
        [`${questionId}_details`]: {
          ...details,
          [option]: value
        }
      };
    });
  };

  const handleReset = () => {
    setFormData({});
    setCurrentStepIndex(0);
    setIsSubmitted(false);
    setShowOnboarding(true);
    setUserType(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  const handleStart = (type: UserType) => {
    setUserType(type);
    setShowOnboarding(false);
  };

  const activeRole = useMemo(() => {
    return (currentStep as any)?.role || null;
  }, [currentStep]);

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <Card className="max-w-2xl w-full text-center space-y-6 py-12">
          <div className="flex justify-center relative">
            <div className="w-20 h-20 bg-brand-teal/10 rounded-full flex items-center justify-center">
              <CheckCircle2 className="w-10 h-10 text-brand-teal" />
            </div>
            <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-white rounded-xl shadow-lg border border-slate-100 flex items-center justify-center">
              <Bot className="w-6 h-6 text-brand-teal" />
            </div>
          </div>
          <div className="space-y-4">
            <div className="inline-block px-4 py-2 bg-slate-50 rounded-2xl border border-slate-100 mb-4">
              <p className="text-sm text-slate-600 font-medium italic">"We did it! Your responses have been saved. Thank you!" — Survey Bot</p>
            </div>
            <h1 className="text-3xl font-bold text-slate-900">Thank you for your feedback!</h1>
            <p className="text-slate-600 text-lg leading-relaxed">
              Your input helps us tailor the VA Upskilling Program to strengthen the skills that matter most for your team, so your VAs can perform at their best and drive real impact.
            </p>
            <p className="text-slate-600 text-lg leading-relaxed">
              We’ll keep you posted when the program launches. Your VAs are now set to excel and make your team even stronger!
            </p>
          </div>
          <div className="pt-6 flex flex-col sm:flex-row gap-4 justify-center">
            <Button onClick={handleReset} variant="primary" className="w-full sm:w-auto">
              <RotateCcw className="w-4 h-4" />
              Start New Survey
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Logo size="sm" />
            <div>
              <h1 className="font-bold text-brand-dark leading-tight">My Mountain Mover</h1>
              <p className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold">Strategic Assessment</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            {isAdmin && (
              <Link to="/admin/dashboard">
                <Button variant="outline" className="px-3 py-1.5 text-xs h-8 border-brand-teal text-brand-teal hover:bg-brand-teal/5">
                  <LayoutDashboard className="w-3 h-3" />
                  Admin Dashboard
                </Button>
              </Link>
            )}
            {user && (
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-slate-500 font-medium hidden sm:block">{user.email}</span>
                <Button onClick={handleLogout} variant="outline" className="px-3 py-1.5 text-xs h-8 text-red-600 border-red-100 hover:bg-red-50">
                  Logout
                </Button>
              </div>
            )}
            <Button onClick={handleReset} variant="outline" className="px-3 py-1.5 text-xs h-8">
              <RotateCcw className="w-3 h-3" />
              Reset
            </Button>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 pb-4">
          {!showOnboarding && <ProgressBar current={currentStepIndex} total={steps.length} />}
        </div>
      </header>

      {showOnboarding ? (
        <Onboarding onStart={handleStart} />
      ) : (
        <div className="flex-1 flex flex-col lg:flex-row max-w-7xl mx-auto w-full">
        <aside className="hidden lg:block w-72 border-r border-slate-200 bg-white p-6 sticky top-16 h-[calc(100vh-64px)] overflow-y-auto">
          <nav className="space-y-1">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 px-3">{userType} Survey</p>
            {steps.map((step, idx) => {
              const isCompleted = idx < currentStepIndex;
              const isActive = idx === currentStepIndex;
              
              return (
                <div
                  key={step.id}
                  className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all ${
                    isActive 
                      ? "bg-brand-teal/10 text-brand-teal shadow-sm ring-1 ring-brand-teal/20" 
                      : isCompleted 
                        ? "text-slate-500" 
                        : "text-slate-400 opacity-60"
                  }`}
                >
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold border-2 ${
                    isActive 
                      ? "border-brand-teal bg-brand-teal text-white" 
                      : isCompleted 
                        ? "border-green-500 bg-green-500 text-white" 
                        : "border-slate-200"
                  }`}>
                    {isCompleted ? <CheckCircle2 className="w-3.5 h-3.5" /> : idx + 1}
                  </div>
                  <span className="text-sm font-medium truncate">
                    {step.title}
                    {step.role && step.title.includes("PART II") && ` (${step.role})`}
                  </span>
                </div>
              );
            })}
          </nav>
        </aside>

        <main className="flex-1 px-4 py-8 lg:px-12 lg:py-12 bg-slate-50/50 overflow-y-auto">
          <SurveyBot 
            stepIndex={currentStepIndex} 
            totalSteps={steps.length}
            sectionTitle={currentStep?.title || ""}
            userType={userType}
            role={activeRole || ""}
          />
          <AnimatePresence mode="wait">
            {currentStep && (
              <motion.div
                key={currentStep.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="max-w-3xl mx-auto"
              >
                <div className="mb-10 space-y-3">
                  <div className="flex items-center gap-2 text-brand-teal font-bold text-xs uppercase tracking-widest">
                    <div className="w-1.5 h-1.5 bg-brand-teal rounded-full" />
                    Section {currentStepIndex + 1} of {steps.length}
                  </div>
                  <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight">
                    {currentStep.title}
                    {activeRole && currentStep.title.includes("PART II") && (
                      <span className="text-brand-teal ml-3 text-2xl">({activeRole})</span>
                    )}
                  </h2>
                  {currentStep.description && (
                    <p className="text-slate-500 text-lg leading-relaxed whitespace-pre-line">{currentStep.description}</p>
                  )}
                </div>

                <Card className="space-y-12 shadow-xl shadow-slate-200/50 border-slate-100">
                  {currentStep.questions.map((q) => (
                    <QuestionRenderer
                      key={q.id}
                      question={q}
                      value={formData[q.id]}
                      otherValue={formData[`${q.id}_other`] as string}
                      optionDetails={(formData[`${q.id}_details`] as Record<string, string>) || {}}
                      onChange={(val) => updateFormData(q.id, val)}
                      onOtherChange={(val) => updateFormData(`${q.id}_other`, val)}
                      onOptionDetailChange={(option, val) => updateOptionDetail(q.id, option, val)}
                      fullResponse={formData}
                      error={errors[q.id]}
                    />
                  ))}

                  {submitError && (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3 text-red-700">
                      <AlertCircle className="w-5 h-5 shrink-0" />
                      <p className="text-sm">{submitError}</p>
                    </div>
                  )}

                  <div className="pt-8 border-t border-slate-100 flex items-center justify-between">
                    <Button
                      onClick={handleBack}
                      variant="secondary"
                      disabled={currentStepIndex === 0 || isSubmitting}
                      className={currentStepIndex === 0 ? "invisible" : "h-12 px-8"}
                    >
                      <ChevronLeft className="w-5 h-5" />
                      Previous
                    </Button>
                    
                    <Button 
                      onClick={handleNext} 
                      variant="primary" 
                      className="h-12 px-10 shadow-lg shadow-brand-orange/20"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <>
                          {currentStepIndex === steps.length - 1 ? "Submit Survey" : "Continue"}
                          <ChevronRight className="w-5 h-5" />
                        </>
                      )}
                    </Button>
                  </div>
                </Card>
                
                <p className="text-center text-slate-400 text-[10px] mt-8 uppercase tracking-widest font-medium">
                  © 2026 Internal Operations • Strategic Assessment • <Link to="/admin/login" className="hover:text-slate-600 transition-colors">Admin Access</Link>
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
      )}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Survey Route */}
          <Route path="/" element={<SurveyApp />} />
          
          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route 
            path="/admin/dashboard" 
            element={
              <ProtectedRoute adminOnly>
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />
          
          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
