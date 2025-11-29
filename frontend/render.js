import { ParticleSystem } from './particles.js';
import { drawLucy } from './lucy_sprite.js';
import { drawPowerUp } from './powerups_visual.js';
import { PsychedelicBackground } from './background.js';
import { GameMenu } from './menu.js';
import { audioSystem } from './audio.js';

const LANES = 3;

const particles = new ParticleSystem();
const background = new PsychedelicBackground();
const menu = new GameMenu();

let prevState = null;

export function render(canvas, stateJson, dt, selectedMode) {
  const ctx = canvas.getContext("2d");
  const state = JSON.parse(stateJson);

  background.update(dt, state.speed);
  menu.update(dt);

  if (state.screen === "menu") {
    menu.selectedMode = selectedMode;
  }

  detectEvents(state, canvas);

  particles.update(dt);

  background.render(ctx, canvas, state.time);

  switch(state.screen) {
    case "menu":
      drawMenu(ctx, canvas, state);
      break;
    case "playing":
      drawGame(ctx, canvas, state, dt);
      break;
    case "gameover":
      drawGameOver(ctx, canvas, state);
      break;
  }

  prevState = state;
}

function detectEvents(state, canvas) {
  if (!prevState) return;
  
  const laneWidth = canvas.width / LANES;
  const playerX = (state.player.lane - 1) * laneWidth + laneWidth / 2;
  const playerY = canvas.height - 100;

  if (state.score > prevState.score) {
    particles.emitDiamondCollect(playerX, playerY);
    audioSystem.playDiamondCollect();

    if (state.combo >= 3) {
      const multiplier = getComboMultiplier(state.combo);
      audioSystem.playCombo(multiplier);
    }
  }

  if (state.player.spectre !== prevState.player.spectre) {
    const color = getSpectreColor(state.player.spectre);
    particles.emitColorSwitch(playerX, playerY, color);
    audioSystem.playColorSwitch();
  }

  if (state.screen === "gameover" && prevState.screen === "playing") {
    const color = getSpectreColor(state.player.spectre);
    particles.emitExplosion(playerX, playerY, color);
    audioSystem.playGameOver();
    audioSystem.stopMusic();
  }

  if (state.active_powerups.invincibility > prevState.active_powerups.invincibility) {
    particles.emitColorSwitch(playerX, playerY, "#FFD700");
    audioSystem.playPowerUp();
  }
  if (state.active_powerups.magnet > prevState.active_powerups.magnet) {
    particles.emitColorSwitch(playerX, playerY, "#FF66FF");
    audioSystem.playPowerUp();
  }
  if (state.active_powerups.slowmotion > prevState.active_powerups.slowmotion) {
    particles.emitColorSwitch(playerX, playerY, "#00FFFF");
    audioSystem.playPowerUp();
  }

  if (state.screen === "playing" && prevState.screen === "menu") {
    audioSystem.startMusic();
  }
}

function drawMenu(ctx, canvas, state) {

  particles.render(ctx);

  menu.render(ctx, canvas, state, particles);
}

function drawGame(ctx, canvas, state, dt) {

  if (Math.random() < 0.5) {
    particles.emitStar(Math.random() * canvas.width, -10);
  }

  const laneWidth = canvas.width / LANES;
  const playerX = (state.player.lane - 1) * laneWidth + laneWidth / 2;
  const playerY = canvas.height - 100;
  const playerColor = getSpectreColor(state.player.spectre);
  
  if (Math.random() < 0.7) {
    particles.emitTrail(playerX, playerY + 10, playerColor);
  }

  drawLanes(ctx, canvas);

  ctx.globalAlpha = 0.5;
  particles.render(ctx);
  ctx.globalAlpha = 1.0;

  state.obstacles.forEach(obstacle => {
    drawObstacle(ctx, canvas, obstacle, state);
  });

  state.diamonds.forEach(diamond => {
    drawDiamond(ctx, canvas, diamond, state);
  });

  state.powerups.forEach(powerup => {
    drawPowerUpOnScreen(ctx, canvas, powerup, state);
  });

  drawPlayer(ctx, canvas, state.player, state);

  particles.render(ctx);

  drawEnhancedHUD(ctx, canvas, state);
}

function drawGameOver(ctx, canvas, state) {

  ctx.globalAlpha = 0.3;
  drawGame(ctx, canvas, state, 0);
  ctx.globalAlpha = 1.0;

  particles.render(ctx);

  ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.save();
  ctx.shadowBlur = 40;
  ctx.shadowColor = "#ff0000";
  ctx.fillStyle = "#ff4444";
  ctx.font = "bold 64px system-ui";
  ctx.textAlign = "center";
  ctx.fillText("GAME OVER", canvas.width / 2, canvas.height / 2 - 80);
  ctx.restore();

  ctx.fillStyle = "#ffdd00";
  ctx.font = "20px system-ui";
  const modeText = state.mode === "classic" ? "CLASSIC MODE" : "TIME ATTACK";
  ctx.fillText(modeText, canvas.width / 2, canvas.height / 2 - 40);

  ctx.fillStyle = "#fff";
  ctx.font = "32px system-ui";
  ctx.fillText(`Score: ${state.score}`, canvas.width / 2, canvas.height / 2 - 5);

  if (state.mode === "classic") {
    ctx.font = "24px system-ui";
    ctx.fillText(`Distance: ${Math.floor(state.distance)}m`, canvas.width / 2, canvas.height / 2 + 30);
  }

  if (state.combo > 0) {
    ctx.fillStyle = "#ff00ff";
    ctx.font = "20px system-ui";
    ctx.fillText(`Best Combo: x${getComboMultiplier(state.combo)} (${state.combo} stars)`, canvas.width / 2, canvas.height / 2 + 65);
  }

  const alpha = Math.sin(state.time * 3) * 0.5 + 0.5;
  ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
  ctx.font = "20px system-ui";
  ctx.fillText("Press R to restart", canvas.width / 2, canvas.height / 2 + 110);
}

function drawLanes(ctx, canvas) {
  ctx.strokeStyle = "rgba(255, 255, 255, 0.1)";
  ctx.lineWidth = 2;
  
  for (let i = 1; i < LANES; i++) {
    const x = (canvas.width / LANES) * i;
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, canvas.height);
    ctx.stroke();
  }
}

function drawPlayer(ctx, canvas, player, state) {
  const laneWidth = canvas.width / LANES;
  const x = (player.lane - 1) * laneWidth + laneWidth / 2;
  const y = canvas.height - 100;

  ctx.fillStyle = "rgba(0, 0, 0, 0.3)";
  ctx.beginPath();
  ctx.ellipse(x, y + 45, 20, 8, 0, 0, Math.PI * 2);
  ctx.fill();

  if (state.active_powerups && state.active_powerups.invincibility > 0) {
    const shieldPulse = 1 + Math.sin(state.time * 10) * 0.2;
    ctx.save();
    ctx.globalAlpha = 0.4;
    ctx.strokeStyle = "#FFD700";
    ctx.lineWidth = 3;
    ctx.shadowBlur = 20;
    ctx.shadowColor = "#FFD700";
    ctx.beginPath();
    ctx.arc(x, y, 40 * shieldPulse, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }

  const color = getSpectreColor(player.spectre);
  drawLucy(ctx, x, y, color, state.time);

  ctx.fillStyle = color;
  ctx.font = "bold 14px system-ui";
  ctx.textAlign = "center";
  ctx.shadowBlur = 5;
  ctx.shadowColor = color;
  ctx.fillText(player.spectre.toUpperCase(), x, y - 55);
  ctx.shadowBlur = 0;
}

function drawObstacle(ctx, canvas, obstacle, state) {
  const laneWidth = canvas.width / LANES;
  const x = (obstacle.lane - 1) * laneWidth + laneWidth / 2;
  const y = canvas.height - (obstacle.x - state.distance);
  
  if (y < -50 || y > canvas.height + 50) return;
  
  const color = getSpectreColor(obstacle.color);

  ctx.fillStyle = "rgba(0, 0, 0, 0.3)";
  ctx.beginPath();
  ctx.ellipse(x, y + 35, 25, 8, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(state.time * 2);

  ctx.fillStyle = color;
  ctx.shadowBlur = 15;
  ctx.shadowColor = color;
  ctx.fillRect(-25, -25, 50, 50);
  ctx.shadowBlur = 0;

  ctx.strokeStyle = "rgba(255, 255, 255, 0.5)";
  ctx.lineWidth = 2;
  ctx.strokeRect(-25, -25, 50, 50);
  
  ctx.restore();
}

function drawDiamond(ctx, canvas, diamond, state) {
  const laneWidth = canvas.width / LANES;
  const x = (diamond.lane - 1) * laneWidth + laneWidth / 2;
  const y = canvas.height - (diamond.x - state.distance);
  
  if (y < -50 || y > canvas.height + 50) return;
  
  drawColoredStar(ctx, x, y, state.time, diamond.x, diamond.color);
}

function drawPowerUpOnScreen(ctx, canvas, powerup, state) {
  const laneWidth = canvas.width / LANES;
  const x = (powerup.lane - 1) * laneWidth + laneWidth / 2;
  const y = canvas.height - (powerup.x - state.distance);
  
  if (y < -50 || y > canvas.height + 50) return;
  
  drawPowerUp(ctx, x, y, powerup.type, state.time);
}

function drawColoredStar(ctx, x, y, time, seed, colorName) {
  ctx.save();
  ctx.translate(x, y);
  
  const bobbing = Math.sin(time * 3 + seed) * 5;
  ctx.translate(0, bobbing);
  
  const rotation = time * 1 + seed;
  ctx.rotate(rotation);
  
  const pulse = 1 + Math.sin(time * 4 + seed) * 0.2;
  ctx.scale(pulse, pulse);
  
  let baseColor;
  switch(colorName) {
    case 'red':
      baseColor = { h: 0, s: 100, l: 60 };
      break;
    case 'green':
      baseColor = { h: 120, s: 100, l: 60 };
      break;
    case 'blue':
      baseColor = { h: 240, s: 100, l: 60 };
      break;
    default:
      baseColor = { h: 50, s: 100, l: 60 };
  }

  const glowGradient = ctx.createRadialGradient(0, 0, 0, 0, 0, 50);
  glowGradient.addColorStop(0, `hsla(${baseColor.h}, ${baseColor.s}%, ${baseColor.l + 10}%, 0.6)`);
  glowGradient.addColorStop(0.5, `hsla(${baseColor.h}, ${baseColor.s}%, ${baseColor.l}%, 0.3)`);
  glowGradient.addColorStop(1, `hsla(${baseColor.h}, ${baseColor.s}%, ${baseColor.l - 10}%, 0)`);
  
  ctx.fillStyle = glowGradient;
  ctx.beginPath();
  ctx.arc(0, 0, 50, 0, Math.PI * 2);
  ctx.fill();

  ctx.shadowBlur = 30;
  ctx.shadowColor = `hsl(${baseColor.h}, ${baseColor.s}%, ${baseColor.l + 10}%)`;
  
  const starGradient = ctx.createRadialGradient(0, 0, 0, 0, 0, 20);
  starGradient.addColorStop(0, '#ffffff');
  starGradient.addColorStop(0.3, `hsl(${baseColor.h}, ${baseColor.s}%, ${baseColor.l + 20}%)`);
  starGradient.addColorStop(1, `hsl(${baseColor.h}, ${baseColor.s}%, ${baseColor.l}%)`);
  
  ctx.fillStyle = starGradient;
  drawStar5Points(ctx, 0, 0, 20, 10);

  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 2;
  ctx.shadowBlur = 15;
  drawStar5Points(ctx, 0, 0, 20, 10, true);

  const orbitStars = 4;
  for (let i = 0; i < orbitStars; i++) {
    const angle = (time * 2 + i * Math.PI / 2 + seed) % (Math.PI * 2);
    const dist = 25 + Math.sin(time * 4 + i) * 3;
    const sx = Math.cos(angle) * dist;
    const sy = Math.sin(angle) * dist;
    const size = 4 + Math.sin(time * 5 + i) * 2;
    
    ctx.shadowBlur = 10;
    ctx.shadowColor = `hsl(${baseColor.h}, ${baseColor.s}%, ${baseColor.l}%)`;
    ctx.fillStyle = `hsl(${baseColor.h}, ${baseColor.s}%, ${baseColor.l + 20}%)`;
    drawStar5Points(ctx, sx, sy, size, size / 2);
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

function drawStar5Points(ctx, x, y, outerRadius, innerRadius, strokeOnly = false) {
  ctx.save();
  ctx.translate(x, y);
  ctx.beginPath();
  
  for (let i = 0; i < 10; i++) {
    const angle = (i * Math.PI) / 5 - Math.PI / 2;
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

function drawEnhancedHUD(ctx, canvas, state) {

  ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
  ctx.fillRect(10, 10, 280, 220);

  ctx.save();
  ctx.shadowBlur = 10;
  ctx.shadowColor = "#ffdd00";
  ctx.fillStyle = "#fff";
  ctx.font = "bold 24px system-ui";
  ctx.textAlign = "left";
  ctx.fillText(`Score: ${state.score}`, 20, 40);
  ctx.restore();

  if (state.mode === "timeattack") {
    const seconds = Math.max(0, Math.ceil(state.timer));
    const timerColor = seconds <= 10 ? "#ff4444" : "#00ffff";
    
    ctx.save();
    ctx.shadowBlur = 15;
    ctx.shadowColor = timerColor;
    ctx.fillStyle = timerColor;
    ctx.font = "bold 28px system-ui";
    ctx.fillText(`⏱️ ${seconds}s`, 20, 75);
    ctx.restore();
  }

  const comboY = state.mode === "timeattack" ? 110 : 80;
  if (state.combo > 0) {
    const comboMultiplier = getComboMultiplier(state.combo);
    const comboAlpha = Math.min(state.combo_timer / 2.0, 1.0);
    
    ctx.save();
    ctx.globalAlpha = comboAlpha;
    ctx.shadowBlur = 20;
    ctx.shadowColor = "#ff00ff";
    ctx.fillStyle = "#ff00ff";
    ctx.font = "bold 32px system-ui";
    ctx.fillText(`COMBO x${comboMultiplier}`, 20, comboY);
    
    ctx.font = "18px system-ui";
    ctx.fillStyle = "#ffdd00";
    ctx.fillText(`${state.combo} étoiles!`, 20, comboY + 25);
    ctx.restore();
  } else {

    if (state.mode === "classic") {
      ctx.fillStyle = "#fff";
      ctx.font = "bold 20px system-ui";
      ctx.fillText(`Distance: ${Math.floor(state.distance)}m`, 20, 75);
      ctx.fillText(`Speed: ${Math.floor(state.speed)}`, 20, 105);
    }
  }

  let yOffset = state.mode === "timeattack" ? 150 : 135;
  
  if (state.active_powerups.invincibility > 0) {
    ctx.fillStyle = "#FFD700";
    ctx.shadowBlur = 10;
    ctx.shadowColor = "#FFD700";
    ctx.font = "bold 16px system-ui";
    ctx.fillText(`⭐ Invincible: ${Math.ceil(state.active_powerups.invincibility)}s`, 20, yOffset);
    ctx.shadowBlur = 0;
    yOffset += 25;
  }
  
  if (state.active_powerups.magnet > 0) {
    ctx.fillStyle = "#FF66FF";
    ctx.shadowBlur = 10;
    ctx.shadowColor = "#FF66FF";
    ctx.font = "bold 16px system-ui";
    ctx.fillText(`🧲 Aimant: ${Math.ceil(state.active_powerups.magnet)}s`, 20, yOffset);
    ctx.shadowBlur = 0;
    yOffset += 25;
  }
  
  if (state.active_powerups.slowmotion > 0) {
    ctx.fillStyle = "#00FFFF";
    ctx.shadowBlur = 10;
    ctx.shadowColor = "#00FFFF";
    ctx.font = "bold 16px system-ui";
    ctx.fillText(`⏱️ Slow-Mo: ${Math.ceil(state.active_powerups.slowmotion)}s`, 20, yOffset);
    ctx.shadowBlur = 0;
  }
}

function getComboMultiplier(combo) {
  if (combo >= 10) return 5;
  if (combo >= 5) return 3;
  if (combo >= 3) return 2;
  return 1;
}

function getSpectreColor(spectre) {
  switch(spectre) {
    case "red": return "#ff4444";
    case "green": return "#44ff44";
    case "blue": return "#4444ff";
    default: return "#ffffff";
  }
}




