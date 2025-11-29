export function drawLucy(ctx, x, y, color, time) {
  ctx.save();
  ctx.translate(x, y);
  const bobbing = Math.sin(time * 4) * 3;
  ctx.translate(0, bobbing);
  const scale = 1.2;
  ctx.scale(scale, scale);
  const glowIntensity = Math.sin(time * 2) * 10 + 20;
  ctx.shadowBlur = glowIntensity;
  ctx.shadowColor = color;
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(0, -25);
  ctx.bezierCurveTo(-15, -20, -18, -5, -15, 10);
  ctx.lineTo(-12, 20);
  ctx.lineTo(12, 20);
  ctx.lineTo(15, 10);
  ctx.bezierCurveTo(18, -5, 15, -20, 0, -25);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = "rgba(255, 255, 255, 0.8)";
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.shadowBlur = 0;
  ctx.fillStyle = "#FFD4A3";
  ctx.beginPath();
  ctx.arc(0, -30, 8, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "rgba(255, 255, 255, 0.5)";
  ctx.lineWidth = 1;
  ctx.stroke();
  const hairAnimation = Math.sin(time * 3) * 0.3;
  ctx.fillStyle = "#edc96cff";
  ctx.beginPath();
  ctx.arc(-6, -32, 5, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(6, -32, 5, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(0, -37, 6, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#000000ff";
  ctx.beginPath();
  ctx.arc(-3, -30, 1.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(3, -30, 1.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#fff";
  ctx.beginPath();
  ctx.arc(-2.5, -30.5, 0.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(3.5, -30.5, 0.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "#000";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.arc(0, -28, 3, 0.2, Math.PI - 0.2);
  ctx.stroke();
  ctx.strokeStyle = color;
  ctx.lineWidth = 3;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(-15, -5);
  const armSwing = Math.sin(time * 5) * 5;
  ctx.lineTo(-22 + armSwing, 5);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(15, -5);
  ctx.lineTo(22 - armSwing, 5);
  ctx.stroke();
  ctx.strokeStyle = color;
  ctx.lineWidth = 4;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(-8, 20);
  const legMove = Math.sin(time * 6) * 3;
  ctx.lineTo(-10 + legMove, 30);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(8, 20);
  ctx.lineTo(10 - legMove, 30);
  ctx.stroke();
  ctx.fillStyle = color;
  const starCount = 3;
  for (let i = 0; i < starCount; i++) {
    const angle = (time * 2 + i * (Math.PI * 2 / starCount));
    const starX = Math.cos(angle) * 25;
    const starY = Math.sin(angle) * 25 - 10;
    const starSize = 2 + Math.sin(time * 4 + i) * 1;
    ctx.shadowBlur = 10;
    ctx.shadowColor = color;
    drawStar(ctx, starX, starY, starSize);
  }
  ctx.restore();
}

function drawStar(ctx, x, y, size) {
  ctx.save();
  ctx.translate(x, y);
  ctx.beginPath();
  for (let i = 0; i < 5; i++) {
    const angle = (i * 4 * Math.PI) / 5 - Math.PI / 2;
    const r = i % 2 === 0 ? size : size / 2;
    const px = Math.cos(angle) * r;
    const py = Math.sin(angle) * r;
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

export function drawLucySimple(ctx, x, y, color, time) {
  ctx.save();
  ctx.translate(x, y);
  const bobbing = Math.sin(time * 4) * 3;
  ctx.translate(0, bobbing);
  ctx.shadowBlur = 20;
  ctx.shadowColor = color;
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(0, -15, 12, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#f8d6b0ff";
  ctx.beginPath();
  ctx.arc(0, -30, 7, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#a4ebdfff";
  ctx.fillRect(-3, -31, 2, 2);
  ctx.fillRect(1, -31, 2, 2);
  ctx.restore();
}


