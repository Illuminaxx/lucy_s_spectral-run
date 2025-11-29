

export function drawPowerUp(ctx, x, y, type, time) {
  switch(type) {
    case 'invincibility':
      drawInvincibilityPowerUp(ctx, x, y, time);
      break;
    case 'magnet':
      drawMagnetPowerUp(ctx, x, y, time);
      break;
    case 'slowmotion':
      drawSlowMotionPowerUp(ctx, x, y, time);
      break;
  }
}

function drawInvincibilityPowerUp(ctx, x, y, time) {
  ctx.save();
  ctx.translate(x, y);
  
  const bobbing = Math.sin(time * 3) * 5;
  ctx.translate(0, bobbing);
  
  const rotation = time * 2;
  ctx.rotate(rotation);
  
  const pulse = 1 + Math.sin(time * 5) * 0.15;
  ctx.scale(pulse, pulse);

  const auraGradient = ctx.createRadialGradient(0, 0, 0, 0, 0, 40);
  auraGradient.addColorStop(0, 'rgba(255, 215, 0, 0.6)');
  auraGradient.addColorStop(0.5, 'rgba(255, 165, 0, 0.3)');
  auraGradient.addColorStop(1, 'rgba(255, 215, 0, 0)');
  
  ctx.fillStyle = auraGradient;
  ctx.beginPath();
  ctx.arc(0, 0, 40, 0, Math.PI * 2);
  ctx.fill();

  ctx.shadowBlur = 20;
  ctx.shadowColor = '#FFD700';
  
  const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, 18);
  gradient.addColorStop(0, '#FFFACD');
  gradient.addColorStop(0.5, '#FFD700');
  gradient.addColorStop(1, '#FFA500');
  
  ctx.fillStyle = gradient;
  drawHexagon(ctx, 0, 0, 18);

  ctx.strokeStyle = '#FFFFFF';
  ctx.lineWidth = 2;
  ctx.shadowBlur = 15;
  drawHexagon(ctx, 0, 0, 18, true);

  ctx.shadowBlur = 0;
  ctx.fillStyle = '#FFFFFF';
  ctx.beginPath();
  ctx.moveTo(0, -10);
  ctx.lineTo(-8, -3);
  ctx.lineTo(-8, 8);
  ctx.lineTo(0, 12);
  ctx.lineTo(8, 8);
  ctx.lineTo(8, -3);
  ctx.closePath();
  ctx.fill();

  for (let i = 0; i < 4; i++) {
    const angle = time * 3 + i * Math.PI / 2;
    const dist = 25;
    const sx = Math.cos(angle) * dist;
    const sy = Math.sin(angle) * dist;
    
    ctx.fillStyle = '#FFD700';
    ctx.shadowBlur = 10;
    ctx.shadowColor = '#FFD700';
    drawSmallStar(ctx, sx, sy, 3);
  }
  
  ctx.restore();
}

function drawMagnetPowerUp(ctx, x, y, time) {
  ctx.save();
  ctx.translate(x, y);
  
  const bobbing = Math.sin(time * 3) * 5;
  ctx.translate(0, bobbing);
  
  const rotation = Math.sin(time * 2) * 0.2;
  ctx.rotate(rotation);
  
  const pulse = 1 + Math.sin(time * 5) * 0.15;
  ctx.scale(pulse, pulse);

  const auraGradient = ctx.createRadialGradient(0, 0, 0, 0, 0, 40);
  auraGradient.addColorStop(0, 'rgba(255, 0, 100, 0.4)');
  auraGradient.addColorStop(0.5, 'rgba(0, 100, 255, 0.3)');
  auraGradient.addColorStop(1, 'rgba(255, 0, 100, 0)');
  
  ctx.fillStyle = auraGradient;
  ctx.beginPath();
  ctx.arc(0, 0, 40, 0, Math.PI * 2);
  ctx.fill();

  ctx.shadowBlur = 20;

  ctx.shadowColor = '#FF0066';
  const gradientRed = ctx.createLinearGradient(-10, -15, -10, 15);
  gradientRed.addColorStop(0, '#FF3366');
  gradientRed.addColorStop(1, '#CC0033');
  ctx.fillStyle = gradientRed;
  ctx.fillRect(-18, -15, 8, 30);

  ctx.shadowColor = '#0066FF';
  const gradientBlue = ctx.createLinearGradient(10, -15, 10, 15);
  gradientBlue.addColorStop(0, '#3366FF');
  gradientBlue.addColorStop(1, '#0033CC');
  ctx.fillStyle = gradientBlue;
  ctx.fillRect(10, -15, 8, 30);

  ctx.shadowColor = '#888888';
  ctx.fillStyle = '#CCCCCC';
  ctx.fillRect(-18, -18, 36, 6);

  ctx.shadowBlur = 10;
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
  ctx.lineWidth = 2;
  
  for (let i = 0; i < 3; i++) {
    const offset = Math.sin(time * 4 + i) * 5;
    ctx.beginPath();
    ctx.arc(-14, 0 + offset, 20 + i * 5, -Math.PI / 2, Math.PI / 2);
    ctx.stroke();
    
    ctx.beginPath();
    ctx.arc(14, 0 + offset, 20 + i * 5, Math.PI / 2, -Math.PI / 2);
    ctx.stroke();
  }
  
  ctx.restore();
}

function drawSlowMotionPowerUp(ctx, x, y, time) {
  ctx.save();
  ctx.translate(x, y);
  
  const bobbing = Math.sin(time * 3) * 5;
  ctx.translate(0, bobbing);
  
  const pulse = 1 + Math.sin(time * 5) * 0.15;
  ctx.scale(pulse, pulse);

  const auraGradient = ctx.createRadialGradient(0, 0, 0, 0, 0, 40);
  auraGradient.addColorStop(0, 'rgba(0, 255, 255, 0.5)');
  auraGradient.addColorStop(0.5, 'rgba(0, 200, 255, 0.3)');
  auraGradient.addColorStop(1, 'rgba(0, 255, 255, 0)');
  
  ctx.fillStyle = auraGradient;
  ctx.beginPath();
  ctx.arc(0, 0, 40, 0, Math.PI * 2);
  ctx.fill();

  ctx.shadowBlur = 20;
  ctx.shadowColor = '#00FFFF';
  
  const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, 18);
  gradient.addColorStop(0, '#E0FFFF');
  gradient.addColorStop(0.5, '#00FFFF');
  gradient.addColorStop(1, '#00CCCC');
  
  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.arc(0, 0, 18, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = '#FFFFFF';
  ctx.lineWidth = 2;
  ctx.shadowBlur = 15;
  ctx.beginPath();
  ctx.arc(0, 0, 18, 0, Math.PI * 2);
  ctx.stroke();

  ctx.shadowBlur = 0;
  ctx.fillStyle = '#003366';
  for (let i = 0; i < 12; i++) {
    const angle = (i * Math.PI * 2) / 12;
    const x1 = Math.cos(angle) * 14;
    const y1 = Math.sin(angle) * 14;
    ctx.beginPath();
    ctx.arc(x1, y1, 1.5, 0, Math.PI * 2);
    ctx.fill();
  }

  const slowTime = time * 0.3;

  ctx.strokeStyle = '#003366';
  ctx.lineWidth = 2;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(0, 0);
  const minuteAngle = slowTime * 0.5;
  ctx.lineTo(Math.cos(minuteAngle) * 12, Math.sin(minuteAngle) * 12);
  ctx.stroke();

  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(0, 0);
  const hourAngle = slowTime * 0.1;
  ctx.lineTo(Math.cos(hourAngle) * 8, Math.sin(hourAngle) * 8);
  ctx.stroke();

  ctx.fillStyle = '#003366';
  ctx.beginPath();
  ctx.arc(0, 0, 3, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = 'rgba(0, 255, 255, 0.4)';
  ctx.lineWidth = 2;
  for (let i = 0; i < 3; i++) {
    const radius = 20 + i * 8 + (time * 20) % 24;
    ctx.beginPath();
    ctx.arc(0, 0, radius, 0, Math.PI * 2);
    ctx.globalAlpha = 1 - ((time * 20) % 24) / 24;
    ctx.stroke();
  }
  
  ctx.restore();
}

function drawHexagon(ctx, x, y, size, strokeOnly = false) {
  ctx.save();
  ctx.translate(x, y);
  ctx.beginPath();
  for (let i = 0; i < 6; i++) {
    const angle = (i * Math.PI * 2) / 6;
    const px = Math.cos(angle) * size;
    const py = Math.sin(angle) * size;
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.closePath();
  if (strokeOnly) ctx.stroke();
  else ctx.fill();
  ctx.restore();
}

function drawSmallStar(ctx, x, y, size) {
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

