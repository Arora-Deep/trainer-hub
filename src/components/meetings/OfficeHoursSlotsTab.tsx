import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Plus, Clock, Users, Trash2, CalendarPlus } from "lucide-react";
import { useOfficeHoursStore } from "@/stores/officeHoursStore";
import { useTrainerStore } from "@/stores/trainerStore";
import { toast } from "sonner";

const CURRENT_TRAINER_ID = "t-1"; // mock: matches seeded trainer

export function OfficeHoursSlotsTab() {
  const slots = useOfficeHoursStore((s) => s.slots);
  const addSlot = useOfficeHoursStore((s) => s.addSlot);
  const removeSlot = useOfficeHoursStore((s) => s.removeSlot);
  const trainers = useTrainerStore((s) => s.trainers);

  const [open, setOpen] = useState(false);
  const [filterTrainer, setFilterTrainer] = useState<string>(CURRENT_TRAINER_ID);

  const [topic, setTopic] = useState("Office hours");
  const [trainerId, setTrainerId] = useState<string>(CURRENT_TRAINER_ID);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("16:00");
  const [duration, setDuration] = useState(30);
  const [capacity, setCapacity] = useState(3);

  const visible = slots
    .filter((s) => filterTrainer === "all" || s.trainerId === filterTrainer)
    .sort((a, b) => +new Date(a.startAt) - +new Date(b.startAt));

  const save = () => {
    if (!date || !time || !topic) {
      toast.error("Fill in topic, date and time");
      return;
    }
    const trainer = trainers.find((t) => t.id === trainerId);
    const startAt = new Date(`${date}T${time}:00`).toISOString();
    addSlot({
      trainerId,
      trainerName: trainer?.name || "Trainer",
      topic,
      startAt,
      durationMins: duration,
      capacity,
    });
    toast.success("Slot added");
    setOpen(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 flex-wrap">
        <Select value={filterTrainer} onValueChange={setFilterTrainer}>
          <SelectTrigger className="h-9 w-[200px]"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All trainers</SelectItem>
            {trainers.map((t) => <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>)}
          </SelectContent>
        </Select>
        <p className="text-xs text-muted-foreground">{visible.length} slot(s)</p>
        <div className="ml-auto">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button size="sm" className="gap-1.5"><Plus className="h-4 w-4" /> Add slot</Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader><SheetTitle>Add office-hour slot</SheetTitle></SheetHeader>
              <div className="space-y-4 mt-6">
                <div className="space-y-1.5">
                  <Label>Topic</Label>
                  <Input value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="e.g. AWS Q&A" />
                </div>
                <div className="space-y-1.5">
                  <Label>Trainer</Label>
                  <Select value={trainerId} onValueChange={setTrainerId}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {trainers.map((t) => <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label>Date</Label>
                    <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Time</Label>
                    <Input type="time" value={time} onChange={(e) => setTime(e.target.value)} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label>Duration (min)</Label>
                    <Input type="number" min={15} step={15} value={duration} onChange={(e) => setDuration(+e.target.value)} />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Capacity</Label>
                    <Input type="number" min={1} value={capacity} onChange={(e) => setCapacity(+e.target.value)} />
                  </div>
                </div>
                <Button onClick={save} className="w-full gap-1.5"><CalendarPlus className="h-4 w-4" /> Save slot</Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {visible.length === 0 ? (
        <Card><CardContent className="py-10 text-center text-sm text-muted-foreground">No slots yet. Add one to let students book time with you.</CardContent></Card>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {visible.map((s) => {
            const past = +new Date(s.startAt) < Date.now();
            const full = s.bookedBy.length >= s.capacity;
            return (
              <Card key={s.id} className={past ? "opacity-60" : ""}>
                <CardContent className="p-3 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold truncate">{s.topic}</p>
                      <p className="text-[11px] text-muted-foreground">{s.trainerName}</p>
                    </div>
                    <Badge className={full ? "bg-destructive/10 text-destructive border-0 text-[10px]" : "bg-success/10 text-success border-0 text-[10px]"}>
                      {full ? "Full" : "Open"}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                    <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{new Date(s.startAt).toLocaleString([], { dateStyle: "short", timeStyle: "short" })}</span>
                    <span className="flex items-center gap-1"><Users className="h-3 w-3" /> {s.bookedBy.length}/{s.capacity}</span>
                  </div>
                  <Button size="sm" variant="ghost" className="w-full h-7 text-xs text-destructive hover:text-destructive" onClick={() => { removeSlot(s.id); toast.success("Slot removed"); }}>
                    <Trash2 className="h-3 w-3 mr-1" /> Remove
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
