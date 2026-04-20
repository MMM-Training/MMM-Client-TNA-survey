import { motion } from "motion/react";
import { Button, Card } from "./UI";
import { Logo } from "./Logo";
import { 
  Target, 
  Users, 
  TrendingUp, 
  ArrowRight,
  UserCircle,
  Stethoscope,
  ShieldCheck,
  LayoutDashboard,
  LogIn,
  BarChart3,
  Briefcase,
  Bot
} from "lucide-react";

import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { UserType } from "../types";

interface OnboardingProps {
  onStart: (userType: UserType) => void;
}

export function Onboarding({ onStart }: OnboardingProps) {
  const { isAdmin } = useAuth();
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const roles = [
    {
      type: "Medical Client / Business Client" as UserType,
      icons: [Stethoscope, BarChart3],
      color: "bg-blue-600",
      cta: "Start Client Survey"
    }
  ];

  return (
    <div className="min-h-screen bg-brand-teal flex items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-10 right-10 w-64 h-32 bg-white/20 rounded-full blur-2xl" />
      <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-brand-orange/10 rounded-full blur-3xl opacity-50" />
      
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-5xl w-full relative z-10"
      >
        <Card className="p-8 md:p-16 shadow-2xl shadow-brand-teal/10 border-slate-100 overflow-hidden relative bg-white/95 backdrop-blur-sm rounded-[3rem]">
          {/* Admin shortcut button */}
          <div className="absolute top-6 right-6 z-20">
            {isAdmin ? (
              <Link to="/admin/dashboard">
                <Button variant="outline" className="h-10 px-4 text-xs border-brand-teal/30 text-brand-teal hover:bg-brand-teal/5 rounded-xl">
                  <LayoutDashboard className="w-4 h-4" />
                  Go to Dashboard
                </Button>
              </Link>
            ) : (
              <Link to="/admin/login">
                <Button variant="outline" className="h-10 px-4 text-xs border-slate-200 text-slate-400 hover:text-brand-teal hover:border-brand-teal/30 rounded-xl">
                  <LogIn className="w-4 h-4" />
                  Admin Login
                </Button>
              </Link>
            )}
          </div>

          <div className="relative z-10 space-y-16">
            <motion.div variants={itemVariants} className="flex flex-col items-center gap-6 text-center">
              <Logo size="lg" />
              <div className="space-y-2">
                <h1 className="text-4xl md:text-6xl font-black text-brand-dark tracking-tight">
                  My Mountain Mover
                </h1>
                <div className="h-1.5 w-24 bg-brand-orange mx-auto rounded-full" />
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="text-center max-w-2xl mx-auto space-y-6">
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="w-12 h-12 bg-brand-teal/10 rounded-2xl flex items-center justify-center">
                  <Bot className="w-7 h-7 text-brand-teal" />
                </div>
                <div className="text-left">
                  <p className="text-[10px] font-bold text-brand-teal uppercase tracking-widest">Survey Bot</p>
                  <p className="text-sm text-slate-600 font-medium italic">"Hi! I'm here to help you through the survey."</p>
                </div>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-slate-800 leading-tight">
                VA Upskilling Program Survey
              </h2>
              <p className="text-slate-600 text-xl leading-relaxed font-medium">
                Your feedback will help us tailor task-specific training that fits your workflow and identify VA skills that matter most for your team’s success.
              </p>
            </motion.div>

            <motion.div variants={itemVariants} className="flex flex-col md:flex-row justify-center gap-8">
              {roles.map((role) => (
                <button
                  key={role.type}
                  onClick={() => onStart(role.type)}
                  className="group relative w-full md:w-[420px] p-10 bg-white rounded-[2.5rem] border-2 border-slate-100 hover:border-brand-teal hover:shadow-2xl hover:shadow-brand-teal/10 transition-all duration-500 text-center flex flex-col items-center gap-8"
                >
                  <div className={`w-24 h-24 ${role.color} rounded-[2rem] flex items-center justify-center text-white shadow-xl group-hover:scale-110 transition-transform duration-500 relative`}>
                    {role.icons.map((Icon, idx) => (
                      <Icon 
                        key={idx} 
                        className={`w-10 h-10 absolute ${idx === 0 ? '-translate-x-2 -translate-y-2' : 'translate-x-2 translate-y-2 opacity-80'}`} 
                      />
                    ))}
                  </div>
                  <div className="mt-4 w-full">
                    <div className="w-full py-5 bg-brand-teal text-white rounded-2xl font-bold text-sm uppercase tracking-widest flex items-center justify-center gap-3 group-hover:bg-brand-teal/90 transition-all shadow-lg shadow-brand-teal/20 active:scale-95">
                      {role.cta}
                      <ArrowRight className="w-5 h-5" />
                    </div>
                  </div>
                </button>
              ))}
            </motion.div>

            <motion.div variants={itemVariants} className="pt-12 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="flex items-center gap-12">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center">
                    <Target className="w-5 h-5 text-slate-400" />
                  </div>
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Identify Gaps</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-slate-400" />
                  </div>
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Growth Path</span>
                </div>
              </div>
              <p className="text-[10px] text-slate-400 font-medium uppercase tracking-widest text-center md:text-right">
                © 2026 Internal Operations • My Mountain Mover
              </p>
            </motion.div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
