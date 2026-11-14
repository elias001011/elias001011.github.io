import { useEffect, useRef } from "react";

// Partículas que se montam em formas, no mesmo espírito do ícone em partículas
// do hero da Connecta: </> → ícone do Zenify → ícone da Connecta, em ciclo.
// Arrastar gira; com mouse, o cursor desfaz as partículas e elas voltam sozinhas.

const CONNECTA_PATHS = [
  "M32.34,157.47h55.71l32.34,32.34H16.38c-9.05,0-16.38-7.33-16.38-16.38V16.43C0,7.35,7.35,0,16.43,0h55.27l32.34,32.34,56.6,56.59v45.37L58.68,32.34h-26.34v125.14Z",
  "M215.31,16.52v156.81c0,9.1-7.38,16.48-16.48,16.48h-58.6l-32.34-32.34-53.07-53.07v-45.9l95.96,95.96,2.77,3.01h29.56V32.34h-59.24L91.55,0h107.24c9.12,0,16.52,7.4,16.52,16.52Z",
];

const S = 150;

type Draw = (ctx: CanvasRenderingContext2D) => void;

const shapes: Draw[] = [
  // </> desenhado em traços grossos de ponta redonda
  (ctx) => {
    ctx.strokeStyle = "#fff";
    ctx.lineWidth = S * 0.085;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.beginPath();
    ctx.moveTo(S * 0.3, S * 0.3);
    ctx.lineTo(S * 0.1, S * 0.5);
    ctx.lineTo(S * 0.3, S * 0.7);
    ctx.moveTo(S * 0.7, S * 0.3);
    ctx.lineTo(S * 0.9, S * 0.5);
    ctx.lineTo(S * 0.7, S * 0.7);
    ctx.moveTo(S * 0.57, S * 0.22);
    ctx.lineTo(S * 0.43, S * 0.78);
    ctx.stroke();
  },
  (ctx) => {
    const heights = [0.36, 0.6, 0.84, 0.6, 0.36];
    const width = S * 0.1;
    const gap = S * 0.07;
    const total = heights.length * width + (heights.length - 1) * gap;
    heights.forEach((h, index) => {
      const x = (S - total) / 2 + index * (width + gap);
      const height = S * h;
      ctx.beginPath();
      ctx.roundRect(x, (S - height) / 2, width, height, width / 2);
      ctx.fill();
    });
  },
  (ctx) => {
    const scale = (S * 0.82) / 215.31;
    ctx.translate((S - 215.31 * scale) / 2, (S - 189.81 * scale) / 2);
    ctx.scale(scale, scale);
    CONNECTA_PATHS.forEach((d) => ctx.fill(new Path2D(d)));
  },
];

function sample(draw: Draw) {
  const canvas = document.createElement("canvas");
  canvas.width = S;
  canvas.height = S;
  const ctx = canvas.getContext("2d", { willReadFrequently: true })!;
  ctx.fillStyle = "#fff";
  draw(ctx);
  const data = ctx.getImageData(0, 0, S, S).data;
  const filled = (x: number, y: number) =>
    x >= 0 && x < S && y >= 0 && y < S && data[(y * S + x) * 4 + 3] > 128;
  const points: [number, number][] = [];
  for (let y = 0; y < S; y++) {
    for (let x = 0; x < S; x++) {
      const f = filled(x, y);
      // contorno inteiro + um pouco do miolo, para a forma ter corpo
      const edge = f !== filled(x - 1, y) || f !== filled(x + 1, y) || f !== filled(x, y - 1) || f !== filled(x, y + 1);
      if ((f && edge) || (f && (x * 7 + y * 13) % 23 === 0)) points.push([(x / S) * 2 - 1, (y / S) * 2 - 1]);
    }
  }
  return points;
}

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

export function ParticleShape() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const N = window.innerWidth < 720 ? 620 : 980;

    let W = 0;
    let H = 0;
    let R = 0;
    const resize = () => {
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      W = canvas.clientWidth;
      H = canvas.clientHeight;
      canvas.width = W * ratio;
      canvas.height = H * ratio;
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
      R = Math.min(W, H) * 0.4;
    };
    resize();

    let ink = "240,239,236";
    let accent = "103,211,144";
    const readColors = () => {
      const style = getComputedStyle(document.documentElement);
      ink = style.getPropertyValue("--ink-rgb").trim() || ink;
      accent = style.getPropertyValue("--accent-rgb").trim() || accent;
    };
    readColors();
    const themeObserver = new MutationObserver(readColors);
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });

    const targets = shapes.map(sample);

    const pts = new Float32Array(N * 3);
    const tgt = new Float32Array(N * 3);
    const tint = new Uint8Array(N);
    for (let i = 0; i < N; i++) {
      pts[i * 3] = (Math.random() * 2 - 1) * 2.2;
      pts[i * 3 + 1] = (Math.random() * 2 - 1) * 2.2;
      pts[i * 3 + 2] = (Math.random() * 2 - 1) * 2.2;
      tint[i] = i % 7 === 0 ? 1 : 0;
    }

    let current = 0;
    function build(index: number) {
      const list = targets[index];
      if (!list.length) return;
      for (let i = 0; i < N; i++) {
        const p = list[(i * 7919) % list.length];
        tgt[i * 3] = p[0];
        tgt[i * 3 + 1] = p[1];
        tgt[i * 3 + 2] = (((i * 12.9898) % 1) - 0.5) * 0.22;
      }
    }
    build(current);

    // ciclo das formas, com um "sopro" entre uma e outra
    const cycle = reduced
      ? 0
      : window.setInterval(() => {
          current = (current + 1) % shapes.length;
          for (let i = 0; i < N * 3; i++) pts[i] += (Math.random() - 0.5) * 0.5;
          build(current);
        }, 5200);

    const ox = new Float32Array(N);
    const oy = new Float32Array(N);
    const vx = new Float32Array(N);
    const vy = new Float32Array(N);
    const swirl = new Float32Array(N).map(() => (Math.random() * 2 - 1) * 0.9);
    const RAD = 110;
    let mouseX = -9999;
    let mouseY = -9999;
    let settled = true;

    let rotY = -0.35;
    let rotX = -0.12;
    let velY = 0;
    let dragging = false;
    let lastX = 0;
    let time = 0;

    const onDown = (event: PointerEvent) => {
      dragging = true;
      lastX = event.clientX;
      canvas.setPointerCapture(event.pointerId);
    };
    const onMove = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseX = event.clientX - rect.left;
      mouseY = event.clientY - rect.top;
      if (dragging) {
        velY = (event.clientX - lastX) * 0.004;
        lastX = event.clientX;
      }
    };
    const onUp = () => {
      dragging = false;
    };
    const onLeave = () => {
      mouseX = -9999;
      mouseY = -9999;
    };
    canvas.addEventListener("pointerdown", onDown);
    canvas.addEventListener("pointermove", onMove);
    canvas.addEventListener("pointerup", onUp);
    canvas.addEventListener("pointercancel", onUp);
    canvas.addEventListener("pointerleave", onLeave);

    let visible = true;
    const visibility = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
    });
    visibility.observe(canvas);

    let frame = 0;
    const MORPH = reduced ? 1 : 0.06;

    const draw = () => {
      if (visible) {
        time += 1;
        if (!reduced) {
          // balança em vez de girar inteiro: a forma nunca some de lado
          rotY += velY;
          velY *= 0.94;
          rotY += (Math.sin(time / 160) * 0.55 - rotY) * 0.012;
          rotX = -0.12 + Math.sin(time / 210) * 0.12;
        }
        const cy = Math.cos(rotY);
        const sy = Math.sin(rotY);
        const cx = Math.cos(rotX);
        const sx = Math.sin(rotX);
        const physics = fine && !reduced && (mouseX > -999 || !settled);
        let moving = false;

        ctx.clearRect(0, 0, W, H);
        for (let i = 0; i < N; i++) {
          const j = i * 3;
          pts[j] += (tgt[j] - pts[j]) * MORPH;
          pts[j + 1] += (tgt[j + 1] - pts[j + 1]) * MORPH;
          pts[j + 2] += (tgt[j + 2] - pts[j + 2]) * MORPH;

          let x = pts[j] * cy - pts[j + 2] * sy;
          let z = pts[j] * sy + pts[j + 2] * cy;
          const y = pts[j + 1] * cx - z * sx;
          z = pts[j + 1] * sx + z * cx;

          const persp = 3.4 / (3.4 + z);
          let px = W / 2 + x * R * persp;
          let py = H / 2 + y * R * persp;
          let alpha = clamp(0.95 * persp - 0.12, 0.08, 0.92);

          if (physics) {
            const dx = px + ox[i] - mouseX;
            const dy = py + oy[i] - mouseY;
            const d2 = dx * dx + dy * dy;
            if (d2 < RAD * RAD && d2 > 0.01) {
              const d = Math.sqrt(d2);
              const f = 1 - d / RAD;
              const k = (f * f * 5.2) / d;
              vx[i] += dx * k - dy * k * swirl[i];
              vy[i] += dy * k + dx * k * swirl[i];
            }
            vx[i] = (vx[i] - ox[i] * 0.04) * 0.86;
            vy[i] = (vy[i] - oy[i] * 0.04) * 0.86;
            ox[i] += vx[i];
            oy[i] += vy[i];
            if (!moving && (Math.abs(ox[i]) > 0.3 || Math.abs(oy[i]) > 0.3)) moving = true;
            px += ox[i];
            py += oy[i];
            const off = Math.abs(ox[i]) + Math.abs(oy[i]);
            if (off > 2) alpha *= clamp(1 - off / 160, 0.25, 1);
          }

          const size = clamp(2.1 * persp, 0.7, 2.8);
          ctx.fillStyle = `rgba(${tint[i] ? accent : ink}, ${alpha})`;
          ctx.fillRect(px - size / 2, py - size / 2, size, size);
        }
        if (physics) {
          settled = mouseX < -999 && !moving;
          if (settled) {
            ox.fill(0);
            oy.fill(0);
            vx.fill(0);
            vy.fill(0);
          }
        }
      }
      if (!reduced) frame = requestAnimationFrame(draw);
    };
    frame = requestAnimationFrame(draw);
    window.addEventListener("resize", resize);

    return () => {
      cancelAnimationFrame(frame);
      window.clearInterval(cycle);
      themeObserver.disconnect();
      visibility.disconnect();
      window.removeEventListener("resize", resize);
      canvas.removeEventListener("pointerdown", onDown);
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerup", onUp);
      canvas.removeEventListener("pointercancel", onUp);
      canvas.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return <canvas className="particle-shape" ref={canvasRef} aria-hidden="true" />;
}
