import { motion, AnimatePresence } from "motion/react";
import { MessageSquare, X, Bot, Sparkles } from "lucide-react";
import { useState, useEffect } from "react";
import { generateSurveyBotMessage } from "../services/geminiService";

interface SurveyBotProps {
  stepIndex: number;
  totalSteps: number;
  sectionTitle: string;
  userType: string | null;
  role?: string;
}

export function SurveyBot({ stepIndex, totalSteps, sectionTitle, userType, role }: SurveyBotProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [message, setMessage] = useState("");
  const [isAiPowered, setIsAiPowered] = useState(false);

  useEffect(() => {
    const getMessage = async () => {
      // Try AI first
      const aiMessage = await generateSurveyBotMessage(stepIndex, totalSteps, sectionTitle, userType, role);
      
      if (aiMessage) {
        setMessage(aiMessage);
        setIsAiPowered(true);
        setIsOpen(true);
        return;
      }

      // Fallback to static logic
      setIsAiPowered(false);
      const getStaticMessage = () => {
        if (stepIndex === 0) {
          return `Hi! I'm Survey Bot. I'll be guiding you through this ${userType || "survey"}. Let's start with some basic info!`;
        }

        const roleLabel = role?.includes(',') ? "VAs" : (role || "VA");

        if (sectionTitle.toLowerCase().includes("tasks and workflow")) {
          return `This section is crucial! We want to understand exactly what your ${roleLabel} does daily so we can optimize their training.`;
        }

        if (sectionTitle.toLowerCase().includes("competencies")) {
          return `Great progress! Now, let's look at specific skills. This helps us identify where upskilling will have the biggest impact.`;
        }

        if (sectionTitle.toLowerCase().includes("communication")) {
          return `Communication is key to a successful partnership. Tell us how your ${roleLabel} is doing in this area.`;
        }

        if (sectionTitle.toLowerCase().includes("ai essentials")) {
          return `Almost there! We're excited about AI. Let us know how you see AI supporting your workflow.`;
        }

        if (stepIndex === totalSteps - 1) {
          return "Last step! Thank you for your time. Your feedback is incredibly valuable to us.";
        }

        return `You're doing great! We're on section ${stepIndex + 1} of ${totalSteps}.`;
      };

      setMessage(getStaticMessage());
      setIsOpen(true);
    };

    getMessage();
  }, [stepIndex, sectionTitle, userType, role, totalSteps]);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3 pointer-events-none">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9, x: 20 }}
            animate={{ opacity: 1, y: 0, scale: 1, x: 0 }}
            exit={{ opacity: 0, y: 20, scale: 0.9, x: 20 }}
            className="bg-white rounded-2xl shadow-2xl border border-slate-100 p-4 max-w-[280px] pointer-events-auto relative overflow-hidden group"
          >
            <div className="absolute top-0 left-0 w-1 h-full bg-brand-teal" />
            <button 
              onClick={() => setIsOpen(false)}
              className="absolute top-2 right-2 text-slate-400 hover:text-slate-600 transition-colors p-1"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="flex gap-3">
              <div className="w-10 h-10 bg-brand-teal/10 rounded-xl flex items-center justify-center shrink-0">
                <Bot className="w-6 h-6 text-brand-teal" />
              </div>
              <div className="space-y-1 pr-4">
                <div className="flex items-center gap-1.5">
                  <p className="text-[10px] font-bold text-brand-teal uppercase tracking-widest">Survey Bot</p>
                  {isAiPowered && (
                    <div className="flex items-center gap-0.5 bg-brand-teal/10 px-1 rounded text-[8px] font-extrabold text-brand-teal animate-pulse uppercase">
                      <Sparkles className="w-2 h-2" />
                      AI
                    </div>
                  )}
                </div>
                <p className="text-sm text-slate-600 leading-relaxed font-medium">
                  {message}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all pointer-events-auto active:scale-95 ${
          isOpen ? "bg-slate-800 text-white" : "bg-brand-teal text-white hover:bg-brand-teal/90"
        }`}
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageSquare className="w-6 h-6" />}
      </button>
    </div>
  );
}
