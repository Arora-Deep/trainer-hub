import { format, eachDayOfInterval } from "date-fns";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Clock, Copy } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

export interface DaySchedule {
  date: string; // ISO date string
  startTime: string;
  endTime: string;
}

const TIME_OPTIONS = Array.from({ length: 48 }, (_, i) => {
  const hours = Math.floor(i / 2);
  const minutes = i % 2 === 0 ? "00" : "30";
  const time = `${hours.toString().padStart(2, "0")}:${minutes}`;
  const label = `${hours === 0 ? 12 : hours > 12 ? hours - 12 : hours}:${minutes} ${hours < 12 ? "AM" : "PM"}`;
  return { value: time, label };
});

interface VMDayScheduleProps {
  dateRange: { from: Date; to: Date };
  dailySchedules: DaySchedule[];
  onChange: (schedules: DaySchedule[]) => void;
}

export function VMDaySchedule({ dateRange, dailySchedules, onChange }: VMDayScheduleProps) {
  const days = eachDayOfInterval({ start: dateRange.from, end: dateRange.to });

  const getScheduleForDate = (date: Date): DaySchedule => {
    const dateStr = format(date, "yyyy-MM-dd");
    return dailySchedules.find(s => s.date === dateStr) || {
      date: dateStr,
      startTime: "09:00",
      endTime: "18:00",
    };
  };

  const updateDay = (date: Date, field: "startTime" | "endTime", value: string) => {
    const dateStr = format(date, "yyyy-MM-dd");
    const existing = dailySchedules.find(s => s.date === dateStr);
    const updated = existing
      ? { ...existing, [field]: value }
      : { date: dateStr, startTime: "09:00", endTime: "18:00", [field]: value };

    const newSchedules = dailySchedules.filter(s => s.date !== dateStr);
    newSchedules.push(updated);
    onChange(newSchedules);
  };

  const applyToAll = (sourceDate: Date) => {
    const source = getScheduleForDate(sourceDate);
    const newSchedules = days.map(day => ({
      date: format(day, "yyyy-MM-dd"),
      startTime: source.startTime,
      endTime: source.endTime,
    }));
    onChange(newSchedules);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <Clock className="h-4 w-4 text-primary" />
          Daily VM Availability
        </CardTitle>
        <CardDescription>Set the time window for each day when VMs are accessible</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 max-h-[420px] overflow-y-auto pr-1">
          {days.map((day, index) => {
            const schedule = getScheduleForDate(day);
            const isWeekend = day.getDay() === 0 || day.getDay() === 6;

            return (
              <div
                key={format(day, "yyyy-MM-dd")}
                className={cn(
                  "flex items-center gap-3 p-3 rounded-lg border transition-colors",
                  isWeekend
                    ? "bg-muted/50 border-border/30"
                    : "bg-muted/10 border-border/50"
                )}
              >
                {/* Day label */}
                <div className="w-[120px] shrink-0">
                  <p className="text-sm font-medium">{format(day, "EEE, MMM d")}</p>
                  {isWeekend && (
                    <p className="text-[10px] text-muted-foreground">Weekend</p>
                  )}
                </div>

                {/* Start time */}
                <div className="flex-1 min-w-[110px]">
                  <Select value={schedule.startTime} onValueChange={(v) => updateDay(day, "startTime", v)}>
                    <SelectTrigger className="h-8 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="max-h-60">
                      {TIME_OPTIONS.map(opt => (
                        <SelectItem key={opt.value} value={opt.value} className="text-xs">{opt.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <span className="text-xs text-muted-foreground">to</span>

                {/* End time */}
                <div className="flex-1 min-w-[110px]">
                  <Select value={schedule.endTime} onValueChange={(v) => updateDay(day, "endTime", v)}>
                    <SelectTrigger className="h-8 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="max-h-60">
                      {TIME_OPTIONS.map(opt => (
                        <SelectItem key={opt.value} value={opt.value} className="text-xs">{opt.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Apply to all button - only show on first day */}
                {index === 0 && days.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-8 text-xs shrink-0 text-muted-foreground hover:text-primary"
                    onClick={() => applyToAll(day)}
                    title="Apply this timing to all days"
                  >
                    <Copy className="h-3 w-3 mr-1" />
                    Apply all
                  </Button>
                )}
                {index !== 0 && days.length > 1 && (
                  <div className="w-[85px] shrink-0" />
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
