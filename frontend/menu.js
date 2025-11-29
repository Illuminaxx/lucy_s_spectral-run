// menu.js - Menu avec disposition finale corrigée

export class GameMenu {
  constructor() {
    this.selectedMode = 'classic';
    this.cursorBlink = 0;
  }

  update(dt) {
    this.cursorBlink += dt;
  }

  switchMode() {
    this.selectedMode = this.selectedMode === 'classic' ? 'timeattack' : 'classic';
  }

  getSelectedMode() {
    return this.selectedMode;
  }

  render(ctx, canvas, state, particles) {
    // Étoiles en arrière-plan
    if (Math.random() < 0.3) {
      particles.emitStar(Math.random() * canvas.width, -10);
    }
    
    // Titre principal
    ctx.save();
    ctx.shadowBlur = 40;
    ctx.shadowColor = "#ff00ff";
    ctx.fillStyle = "#fff";
    ctx.font = "bold 64px 'Arial', sans-serif";
    ctx.textAlign = "center";
    
    const titleY = 90;
    ctx.fillText("Lucy's", canvas.width / 2, titleY);
    
    ctx.shadowColor = "#00ffff";
    ctx.font = "bold 72px 'Arial', sans-serif";
    ctx.fillText("Spectral Run", canvas.width / 2, titleY + 80);
    ctx.restore();
    
    // Sous-titre
    ctx.fillStyle = "rgba(255, 255, 255, 0.6)";
    ctx.font = "italic 20px 'Arial', sans-serif";
    ctx.fillText("A Psychedelic Runner", canvas.width / 2, titleY + 115);
    
    // SELECT MODE
    const selectModeY = titleY + 170;
    ctx.textAlign = "left";
    ctx.font = "bold 28px 'Arial', sans-serif";
    ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
    const selectModeText = "SELECT MODE";
    const selectModeWidth = ctx.measureText(selectModeText).width;
    const selectModeX = (canvas.width - selectModeWidth) / 2;
    ctx.fillText(selectModeText, selectModeX, selectModeY);
    
    // Cartes de mode
    const cardsY = selectModeY + 100;
    const cardSpacing = 280;
    
    // Mode Classic
    this.renderModeOption(
      ctx,
      canvas.width / 2 - cardSpacing / 2,
      cardsY,
      "CLASSIC",
      "Endless runner",
      "Go as far as you can!",
      this.selectedMode === 'classic',
      state.time
    );
    
    // Mode Time Attack
    this.renderModeOption(
      ctx,
      canvas.width / 2 + cardSpacing / 2,
      cardsY,
      "TIME ATTACK",
      "60 seconds",
      "Maximum score!",
      this.selectedMode === 'timeattack',
      state.time
    );
    
    // Instructions (bien espacées en bas)
    const instructY = cardsY + 150;
    
    // Flèches pour changer de mode
    const arrowAlpha = Math.sin(this.cursorBlink * 3) * 0.3 + 0.7;
    ctx.fillStyle = `rgba(255, 215, 0, ${arrowAlpha})`;
    ctx.font = "bold 24px 'Arial', sans-serif";
    const arrowsText = "←  →";
    const arrowsWidth = ctx.measureText(arrowsText).width;
    const arrowsX = (canvas.width - arrowsWidth) / 2;
    ctx.fillText(arrowsText, arrowsX, instructY);
    
    ctx.fillStyle = "rgba(255, 215, 0, 0.8)";
    ctx.font = "18px 'Arial', sans-serif";
    const changeModeText = "Change Mode";
    const changeModeWidth = ctx.measureText(changeModeText).width;
    const changeModeX = (canvas.width - changeModeWidth) / 2;
    ctx.fillText(changeModeText, changeModeX, instructY + 28);
    
    // Bouton start qui pulse
    const startAlpha = Math.sin(state.time * 3) * 0.5 + 0.5;
    ctx.fillStyle = `rgba(0, 255, 127, ${startAlpha})`;
    ctx.font = "bold 32px 'Arial', sans-serif";
    ctx.shadowBlur = 20;
    ctx.shadowColor = "rgba(0, 255, 127, 0.8)";
    const startText = "PRESS ENTER TO START";
    const startWidth = ctx.measureText(startText).width;
    const startX = (canvas.width - startWidth) / 2;
    ctx.fillText(startText, startX, instructY + 75);
    ctx.shadowBlur = 0;
    
    // Contrôles
    ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
    ctx.font = "16px 'Arial', sans-serif";
    const controlsText = "← → or Q D to move  |  SPACE to switch color";
    const controlsWidth = ctx.measureText(controlsText).width;
    const controlsX = (canvas.width - controlsWidth) / 2;
    ctx.fillText(controlsText, controlsX, instructY + 115);
  }

  renderModeOption(ctx, x, y, title, subtitle, description, selected, time) {
    ctx.save();
    ctx.translate(x, y);
    
    const cardWidth = 240;
    const cardHeight = 160;
    
    // Bordure qui pulse si sélectionné
    if (selected) {
      const pulse = Math.sin(time * 4) * 5 + 5;
      ctx.shadowBlur = pulse * 2;
      ctx.shadowColor = "#00ffff";
      ctx.strokeStyle = "#00ffff";
      ctx.lineWidth = 4;
    } else {
      ctx.strokeStyle = "rgba(255, 255, 255, 0.3)";
      ctx.lineWidth = 2;
    }
    
    // Fond de carte
    const cardGradient = ctx.createLinearGradient(0, -cardHeight/2, 0, cardHeight/2);
    if (selected) {
      cardGradient.addColorStop(0, "rgba(0, 255, 255, 0.25)");
      cardGradient.addColorStop(1, "rgba(0, 100, 255, 0.15)");
    } else {
      cardGradient.addColorStop(0, "rgba(100, 100, 100, 0.15)");
      cardGradient.addColorStop(1, "rgba(50, 50, 50, 0.1)");
    }
    
    ctx.fillStyle = cardGradient;
    roundRect(ctx, -cardWidth/2, -cardHeight/2, cardWidth, cardHeight, 12);
    ctx.fill();
    ctx.stroke();
    
    // Icône en haut
    if (selected) {
      ctx.fillStyle = "#ffdd00";
      ctx.font = "40px 'Arial', sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("★", 0, -cardHeight/2 + 50);
    } else {
      ctx.fillStyle = "rgba(255, 255, 255, 0.3)";
      ctx.font = "36px 'Arial', sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("☆", 0, -cardHeight/2 + 50);
    }
    
    // Titre du mode
    ctx.shadowBlur = 0;
    ctx.fillStyle = selected ? "#00ffff" : "rgba(255, 255, 255, 0.8)";
    ctx.font = selected ? "bold 26px 'Arial', sans-serif" : "bold 24px 'Arial', sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(title, 0, -10);
    
    // Sous-titre
    ctx.fillStyle = selected ? "rgba(255, 255, 255, 0.9)" : "rgba(255, 255, 255, 0.6)";
    ctx.font = "18px 'Arial', sans-serif";
    ctx.fillText(subtitle, 0, 18);
    
    // Description
    ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
    ctx.font = "14px 'Arial', sans-serif";
    ctx.fillText(description, 0, 42);
    
    ctx.restore();
  }
}

function roundRect(ctx, x, y, width, height, radius) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}