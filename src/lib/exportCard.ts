import type { Fortune, FortuneCard } from "./fortunes";

function wrap(ctx: CanvasRenderingContext2D, text: string, max: number) {
  const words = text.split(" ");
  const lines: string[] = [];
  let line = "";
  for (const w of words) {
    const t = line ? line + " " + w : w;
    if (ctx.measureText(t).width > max && line) {
      lines.push(line);
      line = w;
    } else line = t;
  }
  if (line) lines.push(line);
  return lines;
}

export async function renderFortunePng(card: FortuneCard, fortune: Fortune): Promise<Blob> {
  await document.fonts?.ready;
  const W = 1080, H = 1350;
  const c = document.createElement("canvas");
  c.width = W;
  c.height = H;
  const x = c.getContext("2d")!;

  const bg = x.createRadialGradient(W / 2, H * 0.42, 50, W / 2, H / 2, H * 0.8);
  bg.addColorStop(0, "#701F2D");
  bg.addColorStop(0.6, "#4B101D");
  bg.addColorStop(1, "#281915");
  x.fillStyle = bg;
  x.fillRect(0, 0, W, H);

  const gold = x.createLinearGradient(0, 0, W, H);
  gold.addColorStop(0, "#8a6a32");
  gold.addColorStop(0.3, "#E8D5A5");
  gold.addColorStop(0.5, "#C6A15B");
  gold.addColorStop(0.7, "#F3E6C2");
  gold.addColorStop(1, "#9c7a3c");

  x.strokeStyle = gold;
  x.lineWidth = 3;
  x.strokeRect(54, 54, W - 108, H - 108);
  x.lineWidth = 1;
  x.strokeRect(72, 72, W - 144, H - 144);
  // corner diamonds
  for (const [cx, cy] of [[72, 72], [W - 72, 72], [72, H - 72], [W - 72, H - 72]]) {
    x.save();
    x.translate(cx, cy);
    x.rotate(Math.PI / 4);
    x.fillStyle = gold;
    x.fillRect(-9, -9, 18, 18);
    x.restore();
  }

  // halo
  const halo = x.createRadialGradient(W / 2, 330, 10, W / 2, 330, 230);
  halo.addColorStop(0, "rgba(232,213,165,0.55)");
  halo.addColorStop(1, "rgba(232,213,165,0)");
  x.fillStyle = halo;
  x.fillRect(0, 80, W, 500);
  x.strokeStyle = gold;
  x.lineWidth = 1.5;
  x.beginPath();
  x.arc(W / 2, 330, 130, 0, Math.PI * 2);
  x.stroke();
  x.beginPath();
  x.arc(W / 2, 330, 150, 0, Math.PI * 2);
  x.setLineDash([2, 8]);
  x.stroke();
  x.setLineDash([]);
  // flame
  x.fillStyle = "#D88A32";
  x.beginPath();
  x.moveTo(W / 2, 250);
  x.bezierCurveTo(W / 2 + 45, 310, W / 2 + 40, 370, W / 2, 380);
  x.bezierCurveTo(W / 2 - 40, 370, W / 2 - 45, 310, W / 2, 250);
  x.fill();
  x.fillStyle = "#FFF7E9";
  x.beginPath();
  x.ellipse(W / 2, 350, 14, 26, 0, 0, Math.PI * 2);
  x.fill();
  x.fillStyle = gold;
  x.beginPath();
  x.moveTo(W / 2 - 90, 390);
  x.quadraticCurveTo(W / 2, 450, W / 2 + 90, 390);
  x.closePath();
  x.fill();

  x.textAlign = "center";
  x.fillStyle = "#C6A15B";
  x.font = "600 24px Manrope, sans-serif";
  (x as any).letterSpacing = "8px";
  x.fillText(`${card.numeral} · ${card.name.toUpperCase()}`, W / 2, 560);

  x.fillStyle = gold;
  x.font = "500 76px 'Cormorant Garamond', serif";
  (x as any).letterSpacing = "2px";
  const cat = fortune.category.toUpperCase().split(" & ");
  cat.forEach((l, i) => x.fillText(i === 0 && cat.length > 1 ? l + " &" : l, W / 2, 650 + i * 78));

  x.fillStyle = "#FFF7E9";
  x.font = "italic 400 46px 'Cormorant Garamond', serif";
  (x as any).letterSpacing = "0px";
  const lines = wrap(x, `“${fortune.text}”`, W - 260);
  const startY = 650 + cat.length * 78 + 60;
  lines.forEach((l, i) => x.fillText(l, W / 2, startY + i * 60));

  x.fillStyle = "#C6A15B";
  x.font = "600 20px Manrope, sans-serif";
  (x as any).letterSpacing = "6px";
  x.fillText("A LITTLE LIGHT. A WORLD OF POSSIBILITIES.", W / 2, H - 150);
  x.fillStyle = "#E8D5A5";
  x.font = "500 18px Manrope, sans-serif";
  x.fillText("HAPPY DIWALI · SYNERGOS", W / 2, H - 112);

  return new Promise((res) => c.toBlob((b) => res(b!), "image/png"));
}
