import { useGamificationStore, type Tier } from "@/stores/gamificationStore";

interface RankCardData {
  name: string; handle: string; title: string; level: number; tier: Tier;
  skill: string; seasonRank: number; streak: number; totalXp: number;
}

const tierHex: Record<Tier, [string, string]> = {
  bronze:    ["#b97132", "#7a4a1f"],
  silver:    ["#a4adba", "#6b727d"],
  gold:      ["#f0b429", "#b8870a"],
  platinum:  ["#5cbdc9", "#2b6e8f"],
  diamond:   ["#5cd2e8", "#3b6fd6"],
  architect: ["#a86df2", "#7a2dbf"],
};

export async function drawRankCard(d: RankCardData): Promise<Blob> {
  const w = 1200, h = 630;
  const canvas = document.createElement("canvas");
  canvas.width = w; canvas.height = h;
  const ctx = canvas.getContext("2d")!;

  // Background
  ctx.fillStyle = "#0a0a0f";
  ctx.fillRect(0, 0, w, h);

  // Tier gradient banner
  const [c1, c2] = tierHex[d.tier];
  const grad = ctx.createLinearGradient(0, 0, w, 0);
  grad.addColorStop(0, c1); grad.addColorStop(1, c2);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, 180);

  // Soft glow
  const glow = ctx.createRadialGradient(w - 200, 90, 0, w - 200, 90, 300);
  glow.addColorStop(0, "rgba(255,255,255,0.25)");
  glow.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = glow; ctx.fillRect(0, 0, w, 200);

  // Level pill
  ctx.fillStyle = "#0a0a0f";
  ctx.beginPath();
  (ctx as any).roundRect(80, 110, 160, 160, 24);
  ctx.fill();
  ctx.strokeStyle = c1; ctx.lineWidth = 4; ctx.stroke();
  ctx.fillStyle = c1;
  ctx.font = "bold 92px -apple-system, Inter, sans-serif";
  ctx.textAlign = "center"; ctx.textBaseline = "middle";
  ctx.fillText(String(d.level), 160, 195);
  ctx.fillStyle = "#9ca3af";
  ctx.font = "600 14px -apple-system, Inter, sans-serif";
  ctx.fillText("LEVEL", 160, 248);

  // Name + title
  ctx.textAlign = "left"; ctx.textBaseline = "alphabetic";
  ctx.fillStyle = "#ffffff";
  ctx.font = "700 52px -apple-system, Inter, sans-serif";
  ctx.fillText(d.name, 280, 200);
  ctx.fillStyle = c1;
  ctx.font = "600 24px -apple-system, Inter, sans-serif";
  ctx.fillText(d.title, 280, 240);
  ctx.fillStyle = "#9ca3af";
  ctx.font = "500 20px -apple-system, Inter, sans-serif";
  ctx.fillText(`${d.handle} · ${d.skill} specialist`, 280, 270);

  // Stats row
  const stats = [
    ["SEASON RANK", `#${d.seasonRank}`],
    ["TOTAL XP", d.totalXp.toLocaleString()],
    ["STREAK", `${d.streak} days`],
    ["TIER", d.tier.toUpperCase()],
  ];
  const startY = 380;
  stats.forEach(([label, value], i) => {
    const x = 80 + i * 270;
    ctx.fillStyle = "#1a1a22";
    (ctx as any).roundRect(x, startY, 240, 130, 20);
    ctx.fill();
    ctx.fillStyle = "#6b7280";
    ctx.font = "600 14px -apple-system, Inter, sans-serif";
    ctx.fillText(label, x + 24, startY + 40);
    ctx.fillStyle = "#ffffff";
    ctx.font = "700 38px -apple-system, Inter, sans-serif";
    ctx.fillText(value, x + 24, startY + 90);
  });

  // Footer
  ctx.fillStyle = "#6b7280";
  ctx.font = "500 18px -apple-system, Inter, sans-serif";
  ctx.fillText("CloudAdda · Technical Learning OS", 80, 590);
  ctx.textAlign = "right";
  ctx.fillStyle = c1;
  ctx.fillText("cloudadda.com", w - 80, 590);

  return new Promise((resolve) => canvas.toBlob((b) => resolve(b!), "image/png"));
}

export function downloadCard(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = filename;
  document.body.appendChild(a); a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
