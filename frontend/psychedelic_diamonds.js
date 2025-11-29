

export function drawStarDiamond(ctx, x, y, time, seed = 0) {
  ctx.save();
  ctx.translate(x, y);

  const bobbing = Math.sin(time * 3 + seed) * 5;
  ctx.translate(0, bobbing);

  const rotation = time * 1 + seed;
  ctx.rotate(rotation);

  const pulse = 1 + Math.sin(time * 4 + seed) * 0.2;
  ctx.scale(pulse, pulse);

  const hue = (time * 100 + seed * 50) % 360;

  const glowGradient = ctx.createRadialGradient(0, 0, 0, 0, 0, 50);
  glowGradient.addColorStop(0, `hsla(${hue}, 100%, 70%, 0.6)`);
  glowGradient.addColorStop(0.5, `hsla(${hue + 60}, 100%, 60%, 0.3)`);
  glowGradient.addColorStop(1, `hsla(${hue + 120}, 100%, 50%, 0)`);
  
  ctx.fillStyle = glowGradient;
  ctx.beginPath();
  ctx.arc(0, 0, 50, 0, Math.PI * 2);
  ctx.fill();

  ctx.shadowBlur = 30;
  ctx.shadowColor = `hsl(${hue}, 100%, 70%)`;
  
  const starGradient = ctx.createRadialGradient(0, 0, 0, 0, 0, 20);
  starGradient.addColorStop(0, '#ffffff');
  starGradient.addColorStop(0.3, `hsl(${hue}, 100%, 80%)`);
  starGradient.addColorStop(1, `hsl(${hue}, 100%, 50%)`);
  
  ctx.fillStyle = starGradient;
  drawStar5(ctx, 0, 0, 20, 10);

  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 2;
  ctx.shadowBlur = 15;
  ctx.shadowColor = '#ffffff';
  drawStar5(ctx, 0, 0, 20, 10, true);

  const orbitStars = 4;
  for (let i = 0; i < orbitStars; i++) {
    const angle = (time * 2 + i * Math.PI / 2 + seed) % (Math.PI * 2);
    const dist = 25 + Math.sin(time * 4 + i) * 3;
    const sx = Math.cos(angle) * dist;
    const sy = Math.sin(angle) * dist;
    const size = 4 + Math.sin(time * 5 + i) * 2;
    
    ctx.shadowBlur = 10;
    ctx.shadowColor = `hsl(${(hue + i * 90) % 360}, 100%, 70%)`;
    ctx.fillStyle = `hsl(${(hue + i * 90) % 360}, 100%, 80%)`;
    drawStar5(ctx, sx, sy, size, size / 2);
  }

  ctx.shadowBlur = 40;
  ctx.shadowColor = '#ffffff';
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(0, 0, 5, 0, Math.PI * 2);
  ctx.fill();

  ctx.shadowBlur = 20;
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
  ctx.lineWidth = 2;
  ctx.lineCap = 'round';
  
  const sparkleLength = 15 + Math.sin(time * 6) * 5;

  ctx.beginPath();
  ctx.moveTo(-sparkleLength, 0);
  ctx.lineTo(sparkleLength, 0);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(0, -sparkleLength);
  ctx.lineTo(0, sparkleLength);
  ctx.stroke();

  const diagLength = sparkleLength * 0.7;
  ctx.beginPath();
  ctx.moveTo(-diagLength, -diagLength);
  ctx.lineTo(diagLength, diagLength);
  ctx.stroke();
  
  ctx.beginPath();
  ctx.moveTo(diagLength, -diagLength);
  ctx.lineTo(-diagLength, diagLength);
  ctx.stroke();
  
  ctx.restore();
}

export function drawMagicStar(ctx, x, y, time, seed = 0) {
  ctx.save();
  ctx.translate(x, y);
  
  const bobbing = Math.sin(time * 3 + seed) * 5;
  ctx.translate(0, bobbing);
  
  const rotation = time * 0.5 + seed;
  ctx.rotate(rotation);
  
  const pulse = 0.9 + Math.sin(time * 4 + seed) * 0.3;
  ctx.scale(pulse, pulse);
  
  const hue = (time * 120 + seed * 60) % 360;

  for (let layer = 3; layer > 0; layer--) {
    const layerSize = 25 * layer;
    const layerAlpha = 0.3 / layer;
    
    ctx.shadowBlur = 20 * layer;
    ctx.shadowColor = `hsla(${hue + layer * 20}, 100%, 60%, ${layerAlpha})`;
    ctx.fillStyle = `hsla(${hue + layer * 20}, 100%, 60%, ${layerAlpha})`;
    
    drawStar8(ctx, 0, 0, layerSize, layerSize * 0.6);
  }

  ctx.shadowBlur = 25;
  ctx.shadowColor = `hsl(${hue}, 100%, 70%)`;
  
  const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, 18);
  gradient.addColorStop(0, '#ffffff');
  gradient.addColorStop(0.4, `hsl(${hue}, 100%, 85%)`);
  gradient.addColorStop(1, `hsl(${hue}, 100%, 60%)`);
  
  ctx.fillStyle = gradient;
  drawStar8(ctx, 0, 0, 18, 10);

  ctx.strokeStyle = `hsl(${hue}, 100%, 90%)`;
  ctx.lineWidth = 1.5;
  ctx.shadowBlur = 10;
  drawStar8(ctx, 0, 0, 18, 10, true);

  const pointCount = 6;
  for (let i = 0; i < pointCount; i++) {
    const angle = (time * 3 - i * Math.PI / 3 + seed) % (Math.PI * 2);
    const dist = 22;
    const px = Math.cos(angle) * dist;
    const py = Math.sin(angle) * dist;
    
    ctx.shadowBlur = 15;
    ctx.shadowColor = '#ffffff';
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(px, py, 2, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.shadowBlur = 30;
  ctx.shadowColor = '#ffffff';
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(0, 0, 6, 0, Math.PI * 2);
  ctx.fill();
  
  ctx.restore();
}

export function drawTwinkleStar(ctx, x, y, time, seed = 0) {
  ctx.save();
  ctx.translate(x, y);
  
  const bobbing = Math.sin(time * 3 + seed) * 5;
  ctx.translate(0, bobbing);

  const rotation = Math.sin(time * 2 + seed) * 0.5;
  ctx.rotate(rotation);

  const twinkle = 0.7 + Math.sin(time * 6 + seed) * 0.3;
  ctx.globalAlpha = twinkle;
  
  const hue = (time * 150 + seed * 75) % 360;

  const haloSize = 40 + Math.sin(time * 3) * 10;
  const haloGradient = ctx.createRadialGradient(0, 0, 0, 0, 0, haloSize);
  haloGradient.addColorStop(0, `hsla(${hue}, 100%, 80%, 0.5)`);
  haloGradient.addColorStop(0.5, `hsla(${hue + 60}, 100%, 70%, 0.3)`);
  haloGradient.addColorStop(1, 'transparent');
  
  ctx.fillStyle = haloGradient;
  ctx.beginPath();
  ctx.arc(0, 0, haloSize, 0, Math.PI * 2);
  ctx.fill();

  ctx.shadowBlur = 35;
  ctx.shadowColor = `hsl(${hue}, 100%, 80%)`;
  ctx.fillStyle = `hsl(${hue}, 100%, 90%)`;
  drawStar5(ctx, 0, 0, 16, 8);

  ctx.strokeStyle = 'rgba(255, 255, 255, 0.9)';
  ctx.lineWidth = 3;
  ctx.lineCap = 'round';
  ctx.shadowBlur = 25;
  ctx.shadowColor = '#ffffff';
  
  const flareLength = 20 + Math.sin(time * 8 + seed) * 8;

  ctx.beginPath();
  ctx.moveTo(-flareLength, 0);
  ctx.lineTo(flareLength, 0);
  ctx.moveTo(0, -flareLength);
  ctx.lineTo(0, flareLength);
  ctx.stroke();

  ctx.shadowBlur = 40;
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(0, 0, 4, 0, Math.PI * 2);
  ctx.fill();
  
  ctx.restore();
}

function drawStar5(ctx, x, y, outerRadius, innerRadius, strokeOnly = false) {
  ctx.save();
  ctx.translate(x, y);
  ctx.beginPath();
  
  for (let i = 0; i < 5; i++) {
    const angle = (i * 2 * Math.PI) / 5 - Math.PI / 2;
    const r = i % 2 === 0 ? outerRadius : innerRadius;
    const px = Math.cos(angle) * r;
    const py = Math.sin(angle) * r;
    
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }

  const firstAngle = -Math.PI / 2;
  ctx.lineTo(Math.cos(firstAngle) * outerRadius, Math.sin(firstAngle) * outerRadius);
  
  if (strokeOnly) {
    ctx.stroke();
  } else {
    ctx.fill();
  }
  
  ctx.restore();
}

function drawStar8(ctx, x, y, outerRadius, innerRadius, strokeOnly = false) {
  ctx.save();
  ctx.translate(x, y);
  ctx.beginPath();
  
  for (let i = 0; i < 16; i++) {
    const angle = (i * Math.PI) / 8 - Math.PI / 2;
    const r = i % 2 === 0 ? outerRadius : innerRadius;
    const px = Math.cos(angle) * r;
    const py = Math.sin(angle) * r;
    
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  
  ctx.closePath();
  
  if (strokeOnly) {
    ctx.stroke();
  } else {
    ctx.fill();
  }
  
  ctx.restore();
}

