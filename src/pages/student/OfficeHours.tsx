import { useMemo, useState } from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Clock, Users, CheckCircle2, Calendar as CalIcon } from "lucide-react";
import { useOfficeHoursStore } from "@/stores/officeHoursStore";
import { CURRENT_STUDENT_ID } from "@/stores/meetingStore";
import { toast } from "sonner";

export default function StudentOfficeHours() {
  const slots = useOfficeHoursStore((s) => s.slots);
  const book = useOfficeHoursStore((s) => s.book);
  const cancel = useOfficeHoursStore((s) => s.cancelBooking);

  const [trainer, setTrainer] = useState<string>("all");

  const trainers = useMemo(() => {
    const seen = new Map<string, string>();
    slots.forEach((s) => seen.set(s.trainerId, s.trainerName));
    return Array.from(seen.entries()).map(([id, name]) => ({ id, name }));
  }, [slots]);

  const upcoming = slots
    .filter((s) => +new Date(s.startAt) > Date.now())
    .filter((s) => trainer === "all" || s.trainerId === trainer)
    .sort((a, b) => +new Date(a.startAt) - +new Date(b.startAt));

  const mine = slots
    .filter((s) => s.bookedBy.includes(CURRENT_STUDENT_ID) && +new Date(s.startAt) > Date.now())
    .sort((a, b) => +new Date(a.startAt) - +new Date(b.startAt));

  // Group by date
  const grouped = useMemo(() => {
    const map = new Map<string, typeof upcoming>();
    upcoming.forEach((s) => {
      const d = new Date(s.startAt);
      const key = d.toDateString();
      const arr = map.get(key) || [];
      arr.push(s);
      map.set(key, arr);
    });
    return Array.from(map.entries());
  }, [upcoming]);

  const onBook = (id: string) => {
    if (book(id, CURRENT_STUDENT_ID)) toast.success("Slot booked");
    else toast.error("Slot is full or already booked");
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Office Hours"
        description="Book 1-on-few sessions with your trainers."
        actions={
          <Select value={trainer} onValueChange={setTrainer}>
            <SelectTrigger className="h-9 w-[200px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All trainers</SelectItem>
              {trainers.map((t) => <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>)}
            </SelectContent>
          </Select>
        }
      />

      {mine.length > 0 && (
        <section className="space-y-2">
          <h2 className="text-sm font-semibold tracking-tight">Your bookings</h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {mine.map((s) => (
              <Card key={s.id} className="border-success/30">
                <CardContent className="p-4 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-sm font-semibold">{s.topic}</p>
                      <p className="text-xs text-muted-foreground">{s.trainerName}</p>
                    </div>
                    <Badge className="bg-success/10 text-success border-0 text-[10px] gap-1"><CheckCircle2 className="h-3 w-3" /> Booked</Badge>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><CalIcon className="h-3 w-3" /> {new Date(s.startAt).toLocaleString([], { dateStyle: "medium", timeStyle: "short" })}</span>
                    <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {s.durationMins}m</span>
                  </div>
                  <Button size="sm" variant="outline" className="w-full h-8 text-xs" onClick={() => { cancel(s.id, CURRENT_STUDENT_ID); toast.success("Booking cancelled"); }}>Cancel booking</Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      )}

      <section className="space-y-3">
        <h2 className="text-sm font-semibold tracking-tight">Available slots</h2>
        {grouped.length === 0 ? (
          <Card><CardContent className="py-12 text-center text-sm text-muted-foreground">No upcoming slots.</CardContent></Card>
        ) : grouped.map(([day, daySlots]) => (
          <div key={day} className="space-y-2">
            <p className="text-[11px] uppercase tracking-wider text-muted-foreground font-medium">
              {new Date(day).toLocaleDateString([], { weekday: "long", month: "short", day: "numeric" })}
            </p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2">
              {daySlots.map((s) => {
                const booked = s.bookedBy.includes(CURRENT_STUDENT_ID);
                const full = s.bookedBy.length >= s.capacity;
                return (
                  <Card key={s.id} className="hover:border-primary/40 transition-colors">
                    <CardContent className="p-3 space-y-2">
                      <div>
                        <p className="text-sm font-semibold truncate">{s.topic}</p>
                        <p className="text-[11px] text-muted-foreground">{s.trainerName}</p>
                      </div>
                      <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                        <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {new Date(s.startAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} · {s.durationMins}m</span>
                        <span className="flex items-center gap-1"><Users className="h-3 w-3" /> {s.bookedBy.length}/{s.capacity}</span>
                      </div>
                      {booked ? (
                        <Button size="sm" variant="outline" disabled className="w-full h-7 text-xs">Booked</Button>
                      ) : full ? (
                        <Button size="sm" variant="outline" disabled className="w-full h-7 text-xs">Full</Button>
                      ) : (
                        <Button size="sm" className="w-full h-7 text-xs" onClick={() => onBook(s.id)}>Book slot</Button>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
