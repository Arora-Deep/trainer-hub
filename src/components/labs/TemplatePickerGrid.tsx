import { motion } from "framer-motion";
import {
  Monitor,
  Cpu,
  HardDrive,
  Clock,
  Cloud,
  Server,
  Terminal,
  Check,
  Layers,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { LabTemplate } from "@/stores/labStore";

interface TemplatePickerGridProps {
  templates: LabTemplate[];
  selectedId?: string;
  onSelect: (template: LabTemplate) => void;
  className?: string;
}

const cloudProviderIcons: Record<string, { icon: React.ReactNode; color: string }> = {
  aws: { icon: <Cloud className="h-3.5 w-3.5" />, color: "text-orange-500" },
  azure: { icon: <Cloud className="h-3.5 w-3.5" />, color: "text-blue-500" },
  gcp: { icon: <Cloud className="h-3.5 w-3.5" />, color: "text-red-500" },
  digitalocean: { icon: <Cloud className="h-3.5 w-3.5" />, color: "text-blue-400" },
};

const osIcons: Record<string, React.ReactNode> = {
  Linux: <Terminal className="h-5 w-5" />,
  Windows: <Monitor className="h-5 w-5" />,
};

export function TemplatePickerGrid({
  templates,
  selectedId,
  onSelect,
  className,
}: TemplatePickerGridProps) {
  return (
    <div className={cn("grid gap-3 sm:grid-cols-2", className)}>
      {templates.map((template, index) => {
        const isSelected = selectedId === template.id;
        const provider = cloudProviderIcons[template.cloudProvider];

        return (
          <motion.button
            key={template.id}
            type="button"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            onClick={() => onSelect(template)}
            className={cn(
              "relative p-4 rounded-xl border-2 text-left transition-all duration-200",
              "hover:shadow-lg hover:shadow-primary/10",
              isSelected
                ? "border-primary bg-primary/5 shadow-lg shadow-primary/20"
                : "border-border/50 bg-card hover:border-primary/40"
            )}
          >
            {/* Selection indicator */}
            {isSelected && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute top-3 right-3 w-6 h-6 rounded-full bg-primary flex items-center justify-center"
              >
                <Check className="h-3.5 w-3.5 text-primary-foreground" />
              </motion.div>
            )}

            {/* Header */}
            <div className="flex items-start gap-3 mb-3">
              <div className={cn(
                "p-2.5 rounded-xl transition-colors",
                isSelected ? "bg-primary/20 text-primary" : "bg-muted/50 text-muted-foreground"
              )}>
                {osIcons[template.type] || <Server className="h-5 w-5" />}
              </div>
              <div className="min-w-0 flex-1">
                <h4 className={cn(
                  "font-semibold truncate transition-colors",
                  isSelected && "text-primary"
                )}>
                  {template.name}
                </h4>
                <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                  {template.os} {template.osVersion}
                </p>
              </div>
            </div>

            {/* Specs */}
            <div className="flex flex-wrap gap-2 mb-3">
              <span className={cn(
                "inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium",
                isSelected ? "bg-primary/10 text-primary" : "bg-muted/50 text-muted-foreground"
              )}>
                <Cpu className="h-3 w-3" />
                {template.vcpus} vCPU
              </span>
              <span className={cn(
                "inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium",
                isSelected ? "bg-primary/10 text-primary" : "bg-muted/50 text-muted-foreground"
              )}>
                <Layers className="h-3 w-3" />
                {template.memory}GB
              </span>
              <span className={cn(
                "inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium",
                isSelected ? "bg-primary/10 text-primary" : "bg-muted/50 text-muted-foreground"
              )}>
                <HardDrive className="h-3 w-3" />
                {template.storage}GB
              </span>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between text-xs">
              <div className={cn(
                "flex items-center gap-1",
                provider?.color || "text-muted-foreground"
              )}>
                {provider?.icon}
                <span className="uppercase font-medium">{template.cloudProvider}</span>
              </div>
              <div className="flex items-center gap-1 text-muted-foreground">
                <Clock className="h-3 w-3" />
                {template.runtimeLimit}min
              </div>
            </div>
          </motion.button>
        );
      })}
    </div>
  );
}
