/**
 * The Field: Fluid, organic, realistic moving web
 * Directly inspired by the two reference images.
 * The living background: the web of signals, constraints, and hidden structures.
 * Efficient Canvas. Mouse interaction = the Eye observing.
 */

class OrganicWeb {
  constructor(canvas) {
    this.c = canvas;
    this.ctx = canvas.getContext('2d', { alpha: true, desynchronized: true });
    this.w = 0; this.h = 0;
    this.nodes = [];
    this.num = 225;
    this.mouse = { x: -9999, y: -9999 };
    this.t = 0;
    this.mode = 'cinema';

    this.resize();
    this.init();
    this.bind();
    this.loop = this.loop.bind(this);
    requestAnimationFrame(this.loop);
  }

  resize() {
    this.w = this.c.width = window.innerWidth;
    this.h = this.c.height = window.innerHeight;
  }

  init() {
    this.nodes = [];
    for (let i = 0; i < this.num; i++) {
      this.nodes.push({
        x: Math.random() * this.w,
        y: Math.random() * this.h,
        vx: (Math.random() - 0.5) * 0.28,
        vy: (Math.random() - 0.5) * 0.28,
        r: Math.random() * 2.5 + 1.2,
        ph: Math.random() * Math.PI * 2.5,
        layer: Math.random() * 3
      });
    }
  }

  bind() {
    window.addEventListener('resize', () => this.resize());
    window.addEventListener('mousemove', e => {
      this.mouse.x = e.clientX;
      this.mouse.y = e.clientY;
    });
    window.addEventListener('mouseleave', () => {
      this.mouse.x = this.mouse.y = -9999;
    });
  }

  setMode(m) { this.mode = m; }

  update() {
    for (let n of this.nodes) {
      const l = n.layer + 1;
      // Organic, curl-like flow for realistic movement
      n.vx += Math.sin(this.t * 0.82 + n.ph) * 0.012 * l;
      n.vy += Math.cos(this.t * 0.71 + n.ph * 1.22) * 0.012 * l;

      // Slow breathing toward drifting center (cosmic feel)
      const cx = this.w * 0.5 + Math.sin(this.t * 0.07) * 48;
      const cy = this.h * 0.5 + Math.cos(this.t * 0.09) * 35;
      const dx = n.x - cx, dy = n.y - cy;
      const d = Math.hypot(dx, dy) + 5;
      n.vx -= dx / d * 0.0058;
      n.vy -= dy / d * 0.0058;

      // Mouse = focused observation (the Eye)
      const mx = n.x - this.mouse.x;
      const my = n.y - this.mouse.y;
      const md = Math.hypot(mx, my);
      if (md < 210 && md > 1) {
        const f = (1 - md / 210) * 1.3;
        n.vx += mx / md * f * 0.58;
        n.vy += my / md * f * 0.58;
      }

      n.x += n.vx; n.y += n.vy;
      n.vx *= 0.958; n.vy *= 0.958;

      // Soft infinite field wrap
      if (n.x < 0) n.x = this.w;
      if (n.x > this.w) n.x = 0;
      if (n.y < 0) n.y = this.h;
      if (n.y > this.h) n.y = 0;
    }
    this.t += 0.0102;
  }

  draw() {
    const ctx = this.ctx;
    ctx.fillStyle = this.mode === 'cinema' ? 'rgba(5,7,10,0.52)' : 'rgba(4,6,9,0.58)';
    ctx.fillRect(0, 0, this.w, this.h);

    const isC = this.mode === 'cinema';
    const hue = isC ? 26 : 197;
    const la = isC ? 0.28 : 0.34;

    // Long, flowing, branching connections: the web
    ctx.lineCap = 'round';
    for (let i = 0; i < this.nodes.length; i++) {
      const a = this.nodes[i];
      for (let j = i + 1; j < this.nodes.length; j++) {
        const b = this.nodes[j];
        const d = Math.hypot(a.x - b.x, a.y - b.y);
        const maxD = 152 + (a.layer + b.layer) * 6;
        if (d < maxD) {
          const t = 1 - d / maxD;
          const alpha = t * la * (0.48 + Math.sin(this.t * 1.6 + a.ph) * 0.52);
          const mx = (a.x + b.x) / 2 + Math.sin((a.ph + b.ph) * 0.82) * (d * 0.16);
          const my = (a.y + b.y) / 2 + Math.cos((a.ph + b.ph) * 0.78) * (d * 0.12);

          ctx.strokeStyle = `hsla(${hue}, 76%, 77%, ${alpha})`;
          ctx.lineWidth = 1.05 * t;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.quadraticCurveTo(mx, my, b.x, b.y);
          ctx.stroke();
        }
      }
    }

    // Deep glowing nodes
    for (let n of this.nodes) {
      const p = Math.sin(this.t * 2.0 + n.ph) * 0.5 + 0.5;
      const r = n.r * (1 + p * 0.9);

      // Outer bloom for cosmic depth
      const g = ctx.createRadialGradient(n.x, n.y, 0.6, n.x, n.y, r * 4.8);
      g.addColorStop(0, `hsla(${hue}, 85%, 83%, ${0.45 * p})`);
      g.addColorStop(1, `hsla(${hue}, 85%, 83%, 0)`);
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(n.x, n.y, r * 4.8, 0, Math.PI * 2);
      ctx.fill();

      // Bright core
      ctx.fillStyle = `hsla(${hue}, 35%, 97%, ${0.88 + p * 0.12})`;
      ctx.beginPath();
      ctx.arc(n.x, n.y, r, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  loop() {
    this.update();
    this.draw();
    requestAnimationFrame(this.loop);
  }
}
window.OrganicWeb = OrganicWeb;
