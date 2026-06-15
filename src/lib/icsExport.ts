// Minimal .ics generator for student schedule export.
export interface IcsEvent {
  uid: string;
  title: string;
  description?: string;
  location?: string;
  start: Date;
  end: Date;
}

const pad = (n: number) => n.toString().padStart(2, "0");
const fmt = (d: Date) =>
  `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}T${pad(
    d.getUTCHours()
  )}${pad(d.getUTCMinutes())}${pad(d.getUTCSeconds())}Z`;

const esc = (s = "") =>
  s.replace(/\\/g, "\\\\").replace(/\n/g, "\\n").replace(/,/g, "\\,").replace(/;/g, "\\;");

export function downloadIcs(filename: string, events: IcsEvent[]) {
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//CloudAdda//Student Schedule//EN",
    "CALSCALE:GREGORIAN",
  ];
  const now = fmt(new Date());
  for (const e of events) {
    lines.push(
      "BEGIN:VEVENT",
      `UID:${e.uid}`,
      `DTSTAMP:${now}`,
      `DTSTART:${fmt(e.start)}`,
      `DTEND:${fmt(e.end)}`,
      `SUMMARY:${esc(e.title)}`,
      e.description ? `DESCRIPTION:${esc(e.description)}` : "",
      e.location ? `LOCATION:${esc(e.location)}` : "",
      "END:VEVENT"
    );
  }
  lines.push("END:VCALENDAR");
  const blob = new Blob([lines.filter(Boolean).join("\r\n")], {
    type: "text/calendar;charset=utf-8",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename.endsWith(".ics") ? filename : `${filename}.ics`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
