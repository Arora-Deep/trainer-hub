import { useEffect, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  useWizardStore,
  getWizardSuggestions,
  type WizardSuggestion,
} from "@/stores/wizardStore";
import { useBatchStore } from "@/stores/batchStore";
import { useLabStore } from "@/stores/labStore";
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
} from "lucide-react";

const iconMap: Record<string, React.FC<{ className?: string }>> = {
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
};

function SuggestionIcon({ name, className }: { name: string; className?: string }) {
  const Icon = iconMap[name] || Sparkles;
  return <Icon className={className} />;
}

export function WizardPanel() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { isOpen, dismissed, toggle, close, dismiss } = useWizardStore();
  const { batches } = useBatchStore();
  const { templates } = useLabStore();

  // Get the current batch from URL if on batch details
  const batchId = pathname.match(/^\/batches\/([^/]+)$/)?.[1];
  const batch = batchId && batchId !== "create" ? batches.find((b) => b.id === batchId) : undefined;

  const context = useMemo(
    () => ({
      hasBatches: batches.length > 0,
      hasLabs: false, // can be enhanced
      hasTemplates: templates.length > 0,
      batchHasVMs: !!batch?.vmConfig,
      batchHasStudents: (batch?.students.length || 0) > 0,
      batchHasCourse: !!batch?.courseId,
      batchStatus: batch?.status,
      trainerVMStatus: batch?.vmConfig?.trainerVM.status,
      cloneStatus: batch?.vmConfig?.cloneStatus,
      vmEntryCount: batch?.vmConfig?.vmEntries.length || 0,
    }),
    [batches, templates, batch]
  );

  const allSuggestions = useMemo(
    () => getWizardSuggestions(pathname, context),
    [pathname, context]
  );

  const suggestions = allSuggestions.filter((s) => !dismissed.includes(s.id));

  const handleAction = (suggestion: WizardSuggestion) => {
    if (suggestion.action === "none") {
      dismiss(suggestion.id);
      return;
    }
    if (suggestion.action.startsWith("tab:")) {
      // This is a tab action on batch details — we just need to be on the page
      // The user will click the tab. We navigate if not already there.
      if (batchId && !pathname.includes(batchId)) {
        navigate(`/batches/${batchId}`);
      }
      dismiss(suggestion.id);
      return;
    }
    // Navigate to route
    navigate(suggestion.action);
    dismiss(suggestion.id);
  };

  // Don't render if no suggestions
  if (suggestions.length === 0 && !isOpen) return null;

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
        {suggestions.length > 0 && (
          <span className="flex items-center justify-center h-5 w-5 rounded-full bg-primary-foreground text-primary text-xs font-bold">
            {suggestions.length}
          </span>
        )}
      </motion.button>

      {/* Panel */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/20 backdrop-blur-sm"
              onClick={close}
            />

            {/* Slide-in panel */}
            <motion.div
              initial={{ x: "100%", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "100%", opacity: 0 }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed top-0 right-0 bottom-0 z-50 w-[380px] bg-card border-l border-border shadow-2xl flex flex-col"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-5 border-b border-border">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-primary/10">
                    <Wand2 className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h2 className="font-semibold text-foreground">Setup Wizard</h2>
                    <p className="text-xs text-muted-foreground">
                      {suggestions.length > 0
                        ? `${suggestions.length} suggestion${suggestions.length > 1 ? "s" : ""} for you`
                        : "All caught up!"}
                    </p>
                  </div>
                </div>
                <Button variant="ghost" size="icon" onClick={close} className="h-8 w-8">
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3">
                {suggestions.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center py-12">
                    <div className="p-4 rounded-2xl bg-primary/5 mb-4">
                      <CheckCircle2 className="h-10 w-10 text-primary/60" />
                    </div>
                    <h3 className="font-semibold text-foreground">You're all set!</h3>
                    <p className="text-sm text-muted-foreground mt-1.5 max-w-[240px]">
                      No more suggestions for this page. Navigate around and I'll help when I can.
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
                      onClick={() => handleAction(suggestion)}
                    >
                      <div className="flex gap-3">
                        <div className="shrink-0 mt-0.5">
                          <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/15 transition-colors">
                            <SuggestionIcon
                              name={suggestion.icon}
                              className="h-4 w-4 text-primary"
                            />
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <h4 className="text-sm font-medium text-foreground">
                              {suggestion.title}
                            </h4>
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

                      {/* Dismiss button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          dismiss(suggestion.id);
                        }}
                        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-md hover:bg-muted"
                      >
                        <X className="h-3 w-3 text-muted-foreground" />
                      </button>
                    </motion.div>
                  ))
                )}
              </div>

              {/* Footer */}
              <div className="px-6 py-4 border-t border-border">
                <p className="text-[11px] text-muted-foreground text-center">
                  Suggestions update as you navigate. Dismiss what you don't need.
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
