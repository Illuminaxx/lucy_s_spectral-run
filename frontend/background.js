

export class PsychedelicBackground {
  constructor() {
    this.offset = 0;
    this.waveOffset = 0;
  }

  update(dt, speed) {
    this.offset += speed * dt * 0.1;
    this.waveOffset += dt * 2;
  }

  render(ctx, canvas, time) {

    const pulse = Math.sin(time * 0.5) * 0.1 + 0.9;
    
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, `rgba(27, 0, 64, ${pulse})`); // Violet foncé
    gradient.addColorStop(0.5, `rgba(64, 0, 128, ${pulse * 0.8})`); // Violet
    gradient.addColorStop(1, `rgba(0, 0, 32, ${pulse})`); // Bleu très foncé
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    this.renderWaves(ctx, canvas, time);

    this.renderDistantStars(ctx, canvas, time);
  }

  renderWaves(ctx, canvas, time) {
    const waveCount = 5;
    
    for (let i = 0; i < waveCount; i++) {
      ctx.save();
      
      const hue = (time * 30 + i * 60) % 360;
      const alpha = 0.05 + (i * 0.01);
      
      ctx.strokeStyle = `hsla(${hue}, 80%, 60%, ${alpha})`;
      ctx.lineWidth = 3;
      ctx.shadowBlur = 20;
      ctx.shadowColor = `hsla(${hue}, 80%, 60%, 0.5)`;
      
      ctx.beginPath();
      
      for (let x = 0; x < canvas.width; x += 5) {
        const waveFreq = 0.02 + i * 0.005;
        const waveAmp = 30 + i * 10;
        const waveSpeed = this.waveOffset + i * 0.5;
        
        const y = canvas.height * 0.3 + 
                  Math.sin(x * waveFreq + waveSpeed) * waveAmp +
                  Math.sin(time * 0.5 + i) * 20;
        
        if (x === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      
      ctx.stroke();
      ctx.restore();
    }
  }

  renderDistantStars(ctx, canvas, time) {
    ctx.save();

    const starCount = 50;
    
    for (let i = 0; i < starCount; i++) {

      const x = (i * 137.5) % canvas.width;
      const y = (i * 89.3) % (canvas.height * 0.6);

      const twinkle = Math.sin(time * (2 + i * 0.1)) * 0.5 + 0.5;
      const alpha = 0.2 + twinkle * 0.3;
      
      ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
      ctx.shadowBlur = 5;
      ctx.shadowColor = 'white';
      
      ctx.beginPath();
      ctx.arc(x, y, 1 + twinkle, 0, Math.PI * 2);
      ctx.fill();
    }
    
    ctx.restore();
  }
}





