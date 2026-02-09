import { useEffect, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import {
  useWizardStore,
  getWizardSuggestions,
  onboardingChecklist,
  getChecklistCompletion,
  type WizardSuggestion,
  type OnboardingContext,
} from "@/stores/wizardStore";
import { useBatchStore } from "@/stores/batchStore";
import { useLabStore } from "@/stores/labStore";
import { useCourseStore } from "@/stores/courseStore";
import {
  Wand2,
  X,
  ArrowRight,
  Plus,
  Server,
  Calendar,
  FlaskConical,
  Monitor,
  UserPlus,
  BookOpen,
  Terminal,
  CheckCircle2,
  Copy,
  Megaphone,
  FileText,
  Sparkles,
  ListChecks,
  Lightbulb,
  Check,
  Circle,
} from "lucide-react";

const iconMap: Record<string, React.FC<{ className?: string }>> = {
  Plus, Server, Calendar, FlaskConical, Monitor, UserPlus,
  BookOpen, Terminal, CheckCircle2, Copy, Megaphone, FileText, Sparkles,
};

function SuggestionIcon({ name, className }: { name: string; className?: string }) {
  const Icon = iconMap[name] || Sparkles;
  return <Icon className={className} />;
}

export function WizardPanel() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const {
    isOpen, hasAutoOpened, dismissed, activeTab,
    toggle, close, dismiss, open, setAutoOpened, setActiveTab,
  } = useWizardStore();
  const { batches } = useBatchStore();
  const { templates } = useLabStore();
  const { courses } = useCourseStore();

  const batchId = pathname.match(/^\/batches\/([^/]+)$/)?.[1];
  const batch = batchId && batchId !== "create" ? batches.find((b) => b.id === batchId) : undefined;

  // Onboarding context
  const onboardingCtx: OnboardingContext = useMemo(() => ({
    hasBatches: batches.length > 0,
    hasTemplates: templates.length > 0,
    hasLabs: false, // extend when lab store tracks labs
    hasCourses: courses.length > 0,
    hasStudentsInAnyBatch: batches.some((b) => b.students.length > 0),
    hasVMsInAnyBatch: batches.some((b) => !!b.vmConfig),
  }), [batches, templates, courses]);

  const checklistCompletion = useMemo(() => getChecklistCompletion(onboardingCtx), [onboardingCtx]);
  const completedCount = Object.values(checklistCompletion).filter(Boolean).length;
  const totalCount = onboardingChecklist.length;
  const progressPct = Math.round((completedCount / totalCount) * 100);

  // Suggestion context
  const suggestionCtx = useMemo(() => ({
    hasBatches: batches.length > 0,
    hasLabs: false,
    hasTemplates: templates.length > 0,
    batchHasVMs: !!batch?.vmConfig,
    batchHasStudents: (batch?.students.length || 0) > 0,
    batchHasCourse: !!batch?.courseId,
    batchStatus: batch?.status,
    trainerVMStatus: batch?.vmConfig?.trainerVM.status,
    cloneStatus: batch?.vmConfig?.cloneStatus,
    vmEntryCount: batch?.vmConfig?.vmEntries.length || 0,
  }), [batches, templates, batch]);

  const allSuggestions = useMemo(() => getWizardSuggestions(pathname, suggestionCtx), [pathname, suggestionCtx]);
  const suggestions = allSuggestions.filter((s) => !dismissed.includes(s.id));

  // Auto-open on first visit
  useEffect(() => {
    if (!hasAutoOpened && completedCount < totalCount) {
      const timer = setTimeout(() => {
        open();
        setAutoOpened();
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [hasAutoOpened, completedCount, totalCount, open, setAutoOpened]);

  const handleSuggestionAction = (suggestion: WizardSuggestion) => {
    if (suggestion.action === "none") {
      dismiss(suggestion.id);
      return;
    }
    if (suggestion.action.startsWith("tab:")) {
      if (batchId && !pathname.includes(batchId)) {
        navigate(`/batches/${batchId}`);
      }
      dismiss(suggestion.id);
      return;
    }
    navigate(suggestion.action);
    dismiss(suggestion.id);
  };

  const handleChecklistAction = (action: string) => {
    navigate(action);
    close();
  };

  return (
    <>
      {/* Floating button */}
      <motion.button
        onClick={toggle}
        className={cn(
          "fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-full shadow-lg transition-colors",
          "bg-primary text-primary-foreground hover:bg-primary/90",
          "px-4 py-3"
        )}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        layout
      >
        <Wand2 className="h-5 w-5" />
        <span className="text-sm font-medium">Wizard</span>
        {completedCount < totalCount && (
          <span className="flex items-center justify-center h-5 min-w-[20px] rounded-full bg-primary-foreground text-primary text-xs font-bold px-1">
            {totalCount - completedCount}
          </span>
        )}
      </motion.button>

      {/* Panel */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/20 backdrop-blur-sm"
              onClick={close}
            />

            <motion.div
              initial={{ x: "100%", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "100%", opacity: 0 }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed top-0 right-0 bottom-0 z-50 w-[400px] bg-card border-l border-border shadow-2xl flex flex-col"
            >
              {/* Header */}
              <div className="px-6 py-5 border-b border-border">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-primary/10">
                      <Wand2 className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h2 className="font-semibold text-foreground">Setup Wizard</h2>
                      <p className="text-xs text-muted-foreground">
                        {completedCount === totalCount
                          ? "All set! You're ready to go."
                          : `${completedCount} of ${totalCount} steps complete`}
                      </p>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" onClick={close} className="h-8 w-8">
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                {/* Progress bar */}
                <div className="mt-4">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[11px] font-medium text-muted-foreground">
                      Onboarding Progress
                    </span>
                    <span className="text-[11px] font-bold text-primary tabular-nums">
                      {progressPct}%
                    </span>
                  </div>
                  <Progress value={progressPct} className="h-2" />
                </div>

                {/* Tab switcher */}
                <div className="mt-4 flex gap-1 p-1 rounded-lg bg-muted/50">
                  <button
                    onClick={() => setActiveTab("checklist")}
                    className={cn(
                      "flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all",
                      activeTab === "checklist"
                        ? "bg-background shadow-sm text-foreground"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    <ListChecks className="h-3.5 w-3.5" />
                    Checklist
                  </button>
                  <button
                    onClick={() => setActiveTab("suggestions")}
                    className={cn(
                      "flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all",
                      activeTab === "suggestions"
                        ? "bg-background shadow-sm text-foreground"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    <Lightbulb className="h-3.5 w-3.5" />
                    Suggestions
                    {suggestions.length > 0 && (
                      <span className="flex items-center justify-center h-4 min-w-[16px] rounded-full bg-primary text-primary-foreground text-[10px] font-bold px-1">
                        {suggestions.length}
                      </span>
                    )}
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto scrollbar-thin">
                <AnimatePresence mode="wait">
                  {activeTab === "checklist" ? (
                    <motion.div
                      key="checklist"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      className="px-6 py-4 space-y-2"
                    >
                      {onboardingChecklist.map((item, index) => {
                        const done = checklistCompletion[item.id];
                        return (
                          <motion.div
                            key={item.id}
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.04 }}
                            className={cn(
                              "group relative flex items-start gap-3 p-3.5 rounded-xl border transition-all",
                              done
                                ? "border-success/20 bg-success/5"
                                : "border-border hover:border-primary/20 hover:bg-muted/20 cursor-pointer"
                            )}
                            onClick={() => !done && handleChecklistAction(item.action)}
                          >
                            {/* Status indicator */}
                            <div className="shrink-0 mt-0.5">
                              {done ? (
                                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-success/15">
                                  <Check className="h-4 w-4 text-success" />
                                </div>
                              ) : (
                                <div className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-muted-foreground/20 group-hover:border-primary/40 transition-colors">
                                  <span className="text-[11px] font-bold text-muted-foreground/50 group-hover:text-primary/60 transition-colors">
                                    {index + 1}
                                  </span>
                                </div>
                              )}
                            </div>

                            <div className="flex-1 min-w-0">
                              <h4 className={cn(
                                "text-sm font-medium",
                                done ? "text-success line-through" : "text-foreground"
                              )}>
                                {item.title}
                              </h4>
                              <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                                {item.description}
                              </p>
                            </div>

                            {!done && (
                              <ArrowRight className="h-4 w-4 text-muted-foreground/40 group-hover:text-primary shrink-0 mt-1.5 transition-colors" />
                            )}
                          </motion.div>
                        );
                      })}

                      {completedCount === totalCount && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="flex flex-col items-center text-center py-8"
                        >
                          <div className="p-4 rounded-2xl bg-success/10 mb-3">
                            <CheckCircle2 className="h-10 w-10 text-success" />
                          </div>
                          <h3 className="font-semibold text-foreground">
                            Onboarding complete! 🎉
                          </h3>
                          <p className="text-sm text-muted-foreground mt-1 max-w-[260px]">
                            You've set everything up. Check the Suggestions tab for context-specific tips.
                          </p>
                        </motion.div>
                      )}
                    </motion.div>
                  ) : (
                    <motion.div
                      key="suggestions"
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 10 }}
                      className="px-6 py-4 space-y-3"
                    >
                      {suggestions.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-center py-12">
                          <div className="p-4 rounded-2xl bg-primary/5 mb-4">
                            <CheckCircle2 className="h-10 w-10 text-primary/60" />
                          </div>
                          <h3 className="font-semibold text-foreground">You're all set!</h3>
                          <p className="text-sm text-muted-foreground mt-1.5 max-w-[240px]">
                            No suggestions for this page. Navigate around and I'll help when I can.
                          </p>
                        </div>
                      ) : (
                        suggestions.map((suggestion, index) => (
                          <motion.div
                            key={suggestion.id}
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="group relative p-4 rounded-xl border border-border bg-muted/10 hover:bg-muted/30 hover:border-primary/20 transition-all cursor-pointer"
                            onClick={() => handleSuggestionAction(suggestion)}
                          >
                            <div className="flex gap-3">
                              <div className="shrink-0 mt-0.5">
                                <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/15 transition-colors">
                                  <SuggestionIcon name={suggestion.icon} className="h-4 w-4 text-primary" />
                                </div>
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                  <h4 className="text-sm font-medium text-foreground">{suggestion.title}</h4>
                                  {index === 0 && (
                                    <span className="text-[10px] font-medium uppercase tracking-wider text-primary bg-primary/10 px-1.5 py-0.5 rounded">
                                      Next
                                    </span>
                                  )}
                                </div>
                                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                                  {suggestion.description}
                                </p>
                              </div>
                              {suggestion.action !== "none" && (
                                <ArrowRight className="h-4 w-4 text-muted-foreground/50 group-hover:text-primary shrink-0 mt-2 transition-colors" />
                              )}
                            </div>
                            <button
                              onClick={(e) => { e.stopPropagation(); dismiss(suggestion.id); }}
                              className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-md hover:bg-muted"
                            >
                              <X className="h-3 w-3 text-muted-foreground" />
                            </button>
                          </motion.div>
                        ))
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Footer */}
              <div className="px-6 py-4 border-t border-border">
                <p className="text-[11px] text-muted-foreground text-center">
                  Complete all steps to get your training portal fully set up.
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
