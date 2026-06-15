// Lightweight CSV export helper. Browser-only.
export function exportToCsv<T extends Record<string, any>>(
  filename: string,
  rows: T[],
  columns?: { key: keyof T; label: string }[]
) {
  if (!rows.length) return;
  const cols =
    columns ||
    (Object.keys(rows[0]).map((k) => ({ key: k as keyof T, label: k })) as {
      key: keyof T;
      label: string;
    }[]);
  const esc = (v: any) => {
    if (v === null || v === undefined) return "";
    const s = typeof v === "object" ? JSON.stringify(v) : String(v);
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const header = cols.map((c) => esc(c.label)).join(",");
  const body = rows
    .map((r) => cols.map((c) => esc(r[c.key])).join(","))
    .join("\n");
  const blob = new Blob([header + "\n" + body], {
    type: "text/csv;charset=utf-8;",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename.endsWith(".csv") ? filename : `${filename}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
