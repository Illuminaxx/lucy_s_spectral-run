export class ParticleSystem {
  constructor() {
    this.particles = [];
  }

  
  emitDiamondCollect(x, y) {
    const count = 15;
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count;
      const speed = 100 + Math.random() * 100;
      this.particles.push({
        x: x,
        y: y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 1.0,
        maxLife: 1.0,
        size: 4 + Math.random() * 4,
        color: '#ffdd00',
        type: 'diamond'
      });
    }
  }

  
  emitExplosion(x, y, color) {
    const count = 30;
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 50 + Math.random() * 200;
      this.particles.push({
        x: x,
        y: y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 1.0,
        maxLife: 1.0,
        size: 3 + Math.random() * 6,
        color: color,
        type: 'explosion'
      });
    }
  }

  
  emitColorSwitch(x, y, newColor) {
    const count = 20;
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count;
      const speed = 150;
      this.particles.push({
        x: x,
        y: y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 0.6,
        maxLife: 0.6,
        size: 6,
        color: newColor,
        type: 'colorswitch'
      });
    }
  }

  
  emitTrail(x, y, color) {
    this.particles.push({
      x: x + (Math.random() - 0.5) * 20,
      y: y + (Math.random() - 0.5) * 20,
      vx: (Math.random() - 0.5) * 20,
      vy: 30 + Math.random() * 20,
      life: 0.5,
      maxLife: 0.5,
      size: 3 + Math.random() * 3,
      color: color,
      type: 'trail'
    });
  }

  
  emitStar(x, y) {
    this.particles.push({
      x: x,
      y: y,
      vx: 0,
      vy: 100 + Math.random() * 100,
      life: 3.0,
      maxLife: 3.0,
      size: 1 + Math.random() * 2,
      color: 'rgba(255, 255, 255, 0.6)',
      type: 'star'
    });
  }

  update(dt) {
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      if (p.type === 'diamond' || p.type === 'explosion') {
        p.vy += 300 * dt;
      }
      p.vx *= 0.98;
      p.vy *= 0.98;
      p.life -= dt;
      if (p.life <= 0) {
        this.particles.splice(i, 1);
      }
    }
  }

  render(ctx) {
    this.particles.forEach(p => {
      const alpha = p.life / p.maxLife;
      ctx.save();
      ctx.globalAlpha = alpha;
      if (p.type === 'star') {
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      } else if (p.type === 'trail') {
        ctx.fillStyle = p.color;
        ctx.shadowBlur = 10;
        ctx.shadowColor = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      } else if (p.type === 'diamond') {
        ctx.fillStyle = p.color;
        ctx.shadowBlur = 15;
        ctx.shadowColor = p.color;
        ctx.translate(p.x, p.y);
        ctx.rotate(p.life * 5);
        ctx.fillRect(-p.size/2, -p.size/2, p.size, p.size);
        ctx.shadowBlur = 0;
      } else if (p.type === 'explosion') {
        const size = p.size * (1 + (1 - alpha));
        ctx.fillStyle = p.color;
        ctx.shadowBlur = 20;
        ctx.shadowColor = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, size, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      } else if (p.type === 'colorswitch') {
        const size = p.size * (1.5 - alpha);
        ctx.strokeStyle = p.color;
        ctx.lineWidth = 2;
        ctx.shadowBlur = 15;
        ctx.shadowColor = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, size, 0, Math.PI * 2);
        ctx.stroke();
        ctx.shadowBlur = 0;
      }
      ctx.restore();
    });
  }

  clear() {
    this.particles = [];
  }
}

