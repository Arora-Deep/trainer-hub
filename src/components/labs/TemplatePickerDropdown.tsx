import { useState, useMemo } from "react";
import { Monitor, Cpu, HardDrive, Clock, Cloud, Server, Terminal, Layers, Filter, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { LabTemplate } from "@/stores/labStore";

interface TemplatePickerDropdownProps {
  templates: LabTemplate[];
  selectedId?: string;
  onSelect: (template: LabTemplate) => void;
  className?: string;
}

const osOptions = ["All", "Linux", "Windows"] as const;
const providerOptions = ["All", "platform", "aws", "azure", "gcp"] as const;
const providerLabels: Record<string, string> = {
  all: "All Providers",
  platform: "Platform",
  aws: "AWS",
  azure: "Azure",
  gcp: "GCP",
};

export function TemplatePickerDropdown({
  templates,
  selectedId,
  onSelect,
  className,
}: TemplatePickerDropdownProps) {
  const [osFilter, setOsFilter] = useState<string>("All");
  const [providerFilter, setProviderFilter] = useState<string>("All");
  const [categoryFilter, setCategoryFilter] = useState<string>("All");

  const categories = useMemo(() => {
    const cats = new Set(templates.map(t => t.category).filter(Boolean));
    return ["All", ...Array.from(cats)];
  }, [templates]);

  const filtered = useMemo(() => {
    return templates.filter(t => {
      if (osFilter !== "All" && t.type !== osFilter) return false;
      if (providerFilter !== "All" && t.cloudProvider !== providerFilter) return false;
      if (categoryFilter !== "All" && t.category !== categoryFilter) return false;
      return true;
    });
  }, [templates, osFilter, providerFilter, categoryFilter]);

  const selected = templates.find(t => t.id === selectedId);
  const hasFilters = osFilter !== "All" || providerFilter !== "All" || categoryFilter !== "All";

  const clearFilters = () => {
    setOsFilter("All");
    setProviderFilter("All");
    setCategoryFilter("All");
  };

  return (
    <div className={cn("space-y-3", className)}>
      {/* Filter Row */}
      <div className="flex items-center gap-2 flex-wrap">
        <Filter className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
        <Select value={osFilter} onValueChange={setOsFilter}>
          <SelectTrigger className="h-8 w-[120px] text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {osOptions.map(os => (
              <SelectItem key={os} value={os}>
                <div className="flex items-center gap-1.5">
                  {os === "Linux" ? <Terminal className="h-3 w-3" /> : os === "Windows" ? <Monitor className="h-3 w-3" /> : null}
                  {os === "All" ? "All OS" : os}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={providerFilter} onValueChange={setProviderFilter}>
          <SelectTrigger className="h-8 w-[140px] text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {providerOptions.map(p => (
              <SelectItem key={p} value={p}>
                <div className="flex items-center gap-1.5">
                  {p !== "All" && <Cloud className="h-3 w-3" />}
                  {providerLabels[p] || p}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {categories.length > 2 && (
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="h-8 w-[140px] text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {categories.map(c => (
                <SelectItem key={c} value={c}>{c === "All" ? "All Categories" : c}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        {hasFilters && (
          <Button variant="ghost" size="sm" className="h-8 px-2 text-xs text-muted-foreground" onClick={clearFilters}>
            <X className="h-3 w-3 mr-1" />Clear
          </Button>
        )}

        <span className="text-xs text-muted-foreground ml-auto">{filtered.length} template{filtered.length !== 1 ? "s" : ""}</span>
      </div>

      {/* Template Select Dropdown */}
      <Select
        value={selectedId || ""}
        onValueChange={(val) => {
          const tpl = templates.find(t => t.id === val);
          if (tpl) onSelect(tpl);
        }}
      >
        <SelectTrigger className="h-11">
          <SelectValue placeholder="Select a VM template...">
            {selected && (
              <div className="flex items-center gap-2 text-sm">
                {selected.type === "Linux" ? <Terminal className="h-3.5 w-3.5 text-primary shrink-0" /> : <Monitor className="h-3.5 w-3.5 text-primary shrink-0" />}
                <span className="font-medium truncate">{selected.name}</span>
                <span className="text-muted-foreground text-xs">·</span>
                <span className="text-xs text-muted-foreground">{selected.vcpus} vCPU / {selected.memory}GB / {selected.storage}GB</span>
              </div>
            )}
          </SelectValue>
        </SelectTrigger>
        <SelectContent className="max-h-[280px]">
          {filtered.length === 0 ? (
            <div className="p-4 text-center text-sm text-muted-foreground">No templates match filters</div>
          ) : (
            filtered.map(t => (
              <SelectItem key={t.id} value={t.id}>
                <div className="flex items-center gap-2">
                  {t.type === "Linux" ? <Terminal className="h-3.5 w-3.5 shrink-0" /> : <Monitor className="h-3.5 w-3.5 shrink-0" />}
                  <div className="min-w-0">
                    <span className="font-medium">{t.name}</span>
                    <span className="text-muted-foreground ml-2 text-xs">{t.os} {t.osVersion} · {t.vcpus}vCPU · {t.memory}GB · {t.cloudProvider.toUpperCase()}</span>
                  </div>
                </div>
              </SelectItem>
            ))
          )}
        </SelectContent>
      </Select>

      {/* Selected Template Summary */}
      {selected && (
        <div className="rounded-lg border border-border/50 bg-muted/30 p-3">
          <div className="flex items-center gap-2 mb-2">
            {selected.type === "Linux" ? <Terminal className="h-4 w-4 text-primary" /> : <Monitor className="h-4 w-4 text-primary" />}
            <span className="font-semibold text-sm">{selected.name}</span>
            <Badge variant="secondary" className="text-[10px] uppercase">{selected.cloudProvider}</Badge>
          </div>
          <div className="flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium bg-muted/50 text-muted-foreground">
              <Cpu className="h-3 w-3" />{selected.vcpus} vCPU
            </span>
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium bg-muted/50 text-muted-foreground">
              <Layers className="h-3 w-3" />{selected.memory}GB RAM
            </span>
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium bg-muted/50 text-muted-foreground">
              <HardDrive className="h-3 w-3" />{selected.storage}GB Disk
            </span>
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium bg-muted/50 text-muted-foreground">
              <Clock className="h-3 w-3" />{selected.runtimeLimit}min
            </span>
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium bg-muted/50 text-muted-foreground">
              {selected.os} {selected.osVersion}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
