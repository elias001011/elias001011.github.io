import { useEffect, useId, useLayoutEffect, useMemo, useRef, useState, type CSSProperties, type ReactNode } from "react";

export type Theme = "light" | "dark";
type Phase = "day" | "dusk" | "night";

export type SceneLabels = {
  toDark: string;
  toLight: string;
  curtain: string;
  lamp: string;
  pencils: string;
  computer: string;
  door: string;
  bed: string;
  robot: string;
};

type Props = {
  theme: Theme;
  onToggleTheme: () => void;
  lampOn: boolean;
  onToggleLamp: () => void;
  curtainClosed: boolean;
  onToggleCurtain: () => void;
  /** qual dos cinco livros da prateleira está escolhido (a paleta do site) */
  paletteIndex: number;
  paletteLabel: string;
  onNextPalette: () => void;
  labels: SceneLabels;
  children: ReactNode;
};

/* A cena é desenhada numa grade fixa (a referência, 887 x 443, vezes 1,8).
   O que fica à direita (janela, mesa, cama) e à esquerda (porta, interruptor)
   mantém o tamanho; a parede entre os dois estica com a largura da tela. */
const BASE_H = 800;
const BASE_FLOOR = 733;
const RIGHT_EDGE = 1597;
const CLUSTER_LEFT = 747;
const SIDE_QUERY = "(min-width: 960px)";

type Layout = {
  side: boolean;
  s: number;
  W: number;
  H: number;
  ceilY: number;
  floorY: number;
  k: number;
};

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

function computeLayout(w: number, h: number, side: boolean): Layout {
  if (side) {
    const free = clamp(w * 0.4, 440, 760);
    const s = Math.min(h / BASE_H, (w - free) / (RIGHT_EDGE - CLUSTER_LEFT + 200));
    const H = h / s;
    const extra = H - BASE_H;
    const ceilY = Math.min(140 + extra * 0.35, 270);
    const floorH = Math.min(64 + extra * 0.3, 230);
    return { side, s, W: w / s, H, ceilY, floorY: H - floorH, k: 1 };
  }
  // empilhado: a parede esquerda encolhe e o conteúdo sobe para cima dos móveis
  const k = 0.75;
  const s = Math.min(w / (200 * k + 30 + RIGHT_EDGE - CLUSTER_LEFT), 0.6);
  const H = h / s;
  return { side, s, W: w / s, H, ceilY: 300, floorY: H - 90, k };
}

/* ---------- cores: uma paleta "acesa" multiplicada pela luz do momento ---------- */

const PALETTE = {
  wall: "#d6d7dc",
  wallL: "#c9cad0",
  ceil: "#c2c3ca",
  floor: "#b6b7bf",
  floorLine: "#a5a6af",
  base: "#abacb4",
  edge: "#9b9ca6",
  line: "#25262d",
  doorFrame: "#a6a7af",
  door: "#bbbcc3",
  metal: "#e9eaed",
  plate: "#f2f2f4",
  rocker: "#dcdde1",
  frame: "#4c4d56",
  sash: "#3b3c44",
  curtain: "#7e7f89",
  fold: "#6b6c76",
  rod: "#cfd0d4",
  shelf: "#33343b",
  shelfTop: "#41424a",
  bookA: "#5cc487",
  bookB: "#7fb0f5",
  bookC: "#26272d",
  bookD: "#9aa5b5",
  bookE: "#a9764a",
  hall: "#1d1e24",
  sheet: "#dcdde2",
  toy: "#e4e5e8",
  toyDark: "#4a5670",
  red: "#c4574e",
  pot: "#2c2d33",
  leaf: "#62aa5c",
  leaf2: "#4b9150",
  vine: "#3f7a45",
  deskTop: "#4d4e57",
  desk: "#3a3b43",
  deskPanel: "#2f3037",
  bezel: "#1b1c21",
  cup: "#25262c",
  pencilA: "#d6a546",
  pencilB: "#5d8ec4",
  chair: "#212228",
  chairIn: "#2c2d34",
  hair: "#6d4b36",
  hairDark: "#543826",
  skin: "#e2b594",
  hood: "#e4e5e9",
  jacket: "#3d4762",
  sleeve: "#d9dadf",
  phones: "#1c1d22",
  headboard: "#3b3c44",
  pillow: "#c6c7ce",
  blanket: "#8b8c96",
  blanketFold: "#777882",
  lampBody: "#8d8e97",
  lampOff: "#a9aab2",
} as const;

type RGB = [number, number, number];

const TINT: Record<Phase, { on: RGB; off: RGB }> = {
  day: { on: [1, 1, 1], off: [0.82, 0.84, 0.9] },
  dusk: { on: [0.78, 0.7, 0.72], off: [0.56, 0.5, 0.6] },
  night: { on: [0.4, 0.4, 0.44], off: [0.18, 0.2, 0.25] },
};

const SKY: Record<Phase, Record<string, string>> = {
  day: { far: "#9db3cf", near: "#8499b8", tree: "#74b262", sun: "#ffd45e", halo: "#fff0b8", cloud: "0.95", stars: "0", lit: "0", dusk: "0", night: "0", sunY: "0px", moonY: "300px" },
  dusk: { far: "#7a5f86", near: "#4f4266", tree: "#3d4a4c", sun: "#ff9a5a", halo: "#ffc48a", cloud: "0.35", stars: "0", lit: "0.45", dusk: "1", night: "0", sunY: "132px", moonY: "230px" },
  night: { far: "#18223f", near: "#0f1730", tree: "#12262a", sun: "#ff9a5a", halo: "#ffc48a", cloud: "0", stars: "1", lit: "0.95", dusk: "1", night: "1", sunY: "300px", moonY: "0px" },
};

function shade(hex: string, [r, g, b]: RGB, lift: number) {
  const n = parseInt(hex.slice(1), 16);
  const mix = (channel: number, t: number, add: number) => Math.round(Math.min(255, channel * t + add));
  return `rgb(${mix(n >> 16, r, lift * 3)} ${mix((n >> 8) & 255, g, lift * 4)} ${mix(n & 255, b, lift * 8)})`;
}

function sceneVars(phase: Phase, lampOn: boolean): CSSProperties {
  const tint = TINT[phase][lampOn ? "on" : "off"];
  const lift = phase === "night" && !lampOn ? 1 : 0;
  const vars: Record<string, string> = {};
  for (const [name, hex] of Object.entries(PALETTE)) vars[`--c-${name}`] = shade(hex, tint, lift);
  for (const [name, value] of Object.entries(SKY[phase])) vars[`--k-${name}`] = value;
  vars["--k-lamp"] = lampOn ? "1" : "0";
  vars["--k-dark"] = lampOn ? (phase === "night" ? "0.25" : "0") : phase === "night" ? "1" : phase === "dusk" ? "0.6" : "0.2";
  return vars as CSSProperties;
}

const v = (name: keyof typeof PALETTE) => `var(--c-${name})`;

/* ---------- peças geradas ---------- */

// contorno em gomos, como cabelo cacheado visto de trás
function curlyPath(cx: number, cy: number, r: number, lobes: number) {
  const points = Array.from({ length: lobes }, (_, i) => {
    const angle = (i / lobes) * Math.PI * 2 - Math.PI / 2;
    const radius = r + (((i * 37) % 7) - 3) * 1.3;
    return [cx + Math.cos(angle) * radius, cy + Math.sin(angle) * radius * 1.04];
  });
  let d = `M${points[0][0].toFixed(1)} ${points[0][1].toFixed(1)}`;
  for (let i = 1; i <= lobes; i++) {
    const [x, y] = points[i % lobes];
    const [px, py] = points[i - 1];
    const bump = Math.hypot(x - px, y - py) * 0.6;
    d += `A${bump.toFixed(1)} ${bump.toFixed(1)} 0 0 1 ${x.toFixed(1)} ${y.toFixed(1)}`;
  }
  return `${d}Z`;
}

type Leaf = { x: number; y: number; rot: number; size: number; alt: boolean };

// cipós nascem no meio da copa, passam por cima do vaso e descem pela frente da prateleira
const VINES = [
  { d: [[1244, 212], [1196, 218], [1214, 300], [1204, 376]], n: 8, seed: 1 },
  { d: [[1254, 214], [1258, 252], [1264, 300], [1256, 346]], n: 4, seed: 2 },
  { d: [[1258, 212], [1306, 218], [1290, 290], [1300, 340]], n: 6, seed: 3 },
];

const bezier = ([p0, p1, p2, p3]: number[][], t: number) => {
  const u = 1 - t;
  return [0, 1].map((k) => u ** 3 * p0[k] + 3 * u * u * t * p1[k] + 3 * u * t * t * p2[k] + t ** 3 * p3[k]);
};

// folhas só abaixo da prateleira (ela termina em y 279), cada uma presa ao caule
const VINE_LEAVES: Leaf[] = VINES.flatMap((vine) =>
  Array.from({ length: vine.n }, (_, i) => {
    const t = 0.5 + ((i + 0.5) / vine.n) * 0.48;
    const [x, y] = bezier(vine.d, t);
    const side = (i + vine.seed) % 2 === 0 ? 1 : -1;
    return { x, y, rot: side * (46 + ((i * 53 + vine.seed * 17) % 22)), size: 1 + ((i * 29 + vine.seed * 7) % 4) * 0.08, alt: (i + vine.seed) % 3 === 0 };
  }),
).filter((leaf) => leaf.y > 286);
const LEAF_AT_BASE = "M0 0C6 -3 6 -14 0 -19C-6 -14 -6 -3 0 0Z";

// a copa: duas camadas de folhas em leque, saindo do meio do vaso
const CROWN: Leaf[] = [
  [-72, 1.25], [-48, 1.5], [-22, 1.7], [4, 1.8], [30, 1.65], [54, 1.45], [76, 1.2],
  [-60, 0.95], [-34, 1.1], [-10, 1.15], [16, 1.15], [42, 1.05], [64, 0.9],
].map(([rot, size], i) => ({ x: 1251 + (i % 2 ? 3 : -3), y: 226, rot, size, alt: i > 6 ? i % 2 === 0 : i % 2 === 1 }));

const HAIR = curlyPath(1350, 449, 62, 15);

const CURLS = [
  "M1322 418q10 -12 22 -2q6 8 -4 13",
  "M1362 410q14 -6 20 6q0 10 -10 10",
  "M1312 452q6 -14 20 -8q8 8 -2 16",
  "M1350 440q12 -8 22 2q4 12 -8 14",
  "M1384 448q10 -4 14 8q-2 10 -12 8",
  "M1326 482q10 -10 22 -2q4 10 -6 12",
  "M1364 478q12 -6 20 4q0 10 -10 10",
  "M1338 396q8 -8 18 -2",
];

const BUILDINGS_FAR = [
  [852, 405, 24], [884, 372, 20], [930, 392, 26], [972, 410, 22], [1046, 380, 28],
];
const BUILDINGS_NEAR = [
  [847, 432, 28], [874, 384, 30], [906, 404, 22], [928, 440, 30], [968, 398, 26], [1004, 350, 48], [1052, 420, 24],
];
const LIT = BUILDINGS_NEAR.flatMap(([x, y, w], b) => {
  const out: number[][] = [];
  for (let row = 0; y + 9 + row * 12 < 470; row++) {
    for (let col = 0; 5 + col * 9 + 5 <= w - 3; col++) {
      if ((row * 5 + col * 3 + b * 7) % 4 !== 0) out.push([x + 5 + col * 9, y + 9 + row * 12]);
    }
  }
  return out;
});

const STARS = [[862, 226, 1.3], [893, 300, 1], [924, 232, 1.1], [946, 286, 1.4], [872, 352, 1], [982, 222, 1.2], [1000, 318, 1], [1050, 232, 1], [1062, 296, 1.3], [1038, 340, 1.1], [912, 340, 1]];

const CODE = [
  [1226, 448, 46, "#7aa2d6"], [1278, 448, 30, "#9aa3b2"],
  [1236, 462, 34, "#8fbf8f"],
  [1246, 476, 58, "#d6b36a"], [1310, 476, 22, "#9aa3b2"],
  [1246, 490, 40, "#7aa2d6"], [1292, 490, 52, "#c98d8d"],
  [1236, 504, 26, "#8fbf8f"],
  [1246, 518, 44, "#d6b36a"],
  [1236, 532, 30, "#7aa2d6"],
] as const;

export function RoomScene({ theme, onToggleTheme, lampOn, onToggleLamp, curtainClosed, onToggleCurtain, paletteIndex, paletteLabel, onNextPalette, labels, children }: Props) {
  const ref = useRef<HTMLElement>(null);
  const uid = useId().replace(/:/g, "");
  const [layout, setLayout] = useState<Layout | null>(null);
  const [phase, setPhase] = useState<Phase>(theme === "dark" ? "night" : "day");
  // a luz troca rápido; o céu, devagar
  const [pace, setPace] = useState<"slow" | "fast">("slow");
  const shown = useRef(theme);
  // brincadeiras da cena: não são salvas nem mexem no resto do site
  const [pencilsDown, setPencilsDown] = useState(false);
  const [pcOn, setPcOn] = useState(true);
  const [boot, setBoot] = useState(0);
  const [doorOpen, setDoorOpen] = useState(false);
  const [bedMessy, setBedMessy] = useState(false);
  const [robotUp, setRobotUp] = useState(false);

  useLayoutEffect(() => {
    const node = ref.current;
    if (!node) return;
    const query = window.matchMedia(SIDE_QUERY);
    const measure = () => {
      const w = node.clientWidth;
      const h = node.clientHeight;
      if (w > 0 && h > 0) setLayout(computeLayout(w, h, query.matches));
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  // dia <-> noite sempre passa pelo crepúsculo
  useEffect(() => {
    const target: Phase = theme === "dark" ? "night" : "day";
    if (shown.current === theme) return;
    shown.current = theme;
    setPace("slow");
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setPhase(target);
      return;
    }
    setPhase("dusk");
    const timer = window.setTimeout(() => setPhase(target), 850);
    return () => window.clearTimeout(timer);
  }, [theme]);

  const vars = useMemo(() => sceneVars(phase, lampOn), [phase, lampOn]);

  const s = layout?.s ?? 0;
  const k = layout?.k ?? 1;
  const cornerX = 200 * k;
  const dx = layout ? layout.W - RIGHT_EDGE : 0;
  const fy = layout ? layout.floorY - BASE_FLOOR : 0;

  const sectionStyle = {
    ...vars,
    "--scene-t": pace === "fast" ? "320ms" : "850ms",
    ...(layout
      ? {
          "--s": s,
          "--wall-x": `${(cornerX + (layout.side ? 64 : 36)) * s}px`,
          "--wall-w": `${(layout.W - (RIGHT_EDGE - CLUSTER_LEFT) - cornerX - (layout.side ? 64 + 48 : 0)) * s}px`,
          "--wall-y": `${layout.ceilY * s}px`,
          "--wall-h": `${(layout.floorY - 17 - layout.ceilY) * s}px`,
          "--pad-top": `${layout.ceilY * s}px`,
          "--pad-bottom": `${(90 + 575 + 70) * s}px`,
        }
      : {}),
  } as CSSProperties;

  // alvos em px, por cima do desenho
  const box = (x: number, y: number, w: number, h: number, min = 44): CSSProperties => {
    const width = Math.max(min, w * s);
    const height = Math.max(min, h * s);
    return { left: (x + w / 2) * s - width / 2, top: (y + h / 2) * s - height / 2, width, height };
  };
  const themeLabel = theme === "dark" ? labels.toLight : labels.toDark;

  return (
    <section
      className="hero"
      id="inicio"
      ref={ref}
      style={sectionStyle}
      data-phase={phase}
      data-lamp={lampOn ? "on" : "off"}
      data-curtain={curtainClosed ? "closed" : "open"}
      data-pencils={pencilsDown ? "down" : "up"}
      data-pc={pcOn ? "on" : "off"}
      data-door={doorOpen ? "open" : "closed"}
      data-bed={bedMessy ? "messy" : "tidy"}
      data-robot={robotUp ? "up" : "down"}
      data-ready={layout ? "" : undefined}
    >
      {layout && <Drawing layout={layout} uid={uid} boot={boot} paletteIndex={paletteIndex} />}

      <div className="hero-content">{children}</div>

      {layout && (
        <div className="scene-controls">
          {/* a janela inteira troca o tema; com a cortina fechada, ela fica coberta */}
          {!curtainClosed && (
            <button
              type="button"
              className="scene-hit"
              style={box(843 + dx, 166 + fy, 235, 342, 0)}
              aria-label={themeLabel}
              title={themeLabel}
              onClick={onToggleTheme}
            />
          )}
          {curtainClosed ? (
            <button
              type="button"
              className="scene-hit"
              style={box(752 + dx, 158 + fy, 398, 398, 0)}
              aria-label={labels.curtain}
              aria-pressed="true"
              title={labels.curtain}
              onClick={onToggleCurtain}
            />
          ) : (
            <>
              <button
                type="button"
                className="scene-hit"
                style={box(752 + dx, 158 + fy, 90, 398)}
                aria-label={labels.curtain}
                aria-pressed="false"
                title={labels.curtain}
                onClick={onToggleCurtain}
              />
              <button
                type="button"
                className="scene-hit"
                style={box(1079 + dx, 158 + fy, 71, 398)}
                tabIndex={-1}
                aria-hidden="true"
                title={labels.curtain}
                onClick={onToggleCurtain}
              />
            </>
          )}
          <button type="button" className="scene-hit" style={box(-4, layout.floorY - 538, 95 * k, 560, 40)} aria-label={labels.door} aria-pressed={doorOpen} title={labels.door} onClick={() => setDoorOpen((current) => !current)} />
          <button type="button" className="scene-hit hit-books" style={box(1289 + dx, 172 + fy, 84, 84, 36)} aria-label={paletteLabel} title={paletteLabel} onClick={onNextPalette} />
          <button type="button" className="scene-hit" style={box(1412 + dx, 188 + fy, 42, 68, 36)} aria-label={labels.robot} aria-pressed={robotUp} title={labels.robot} onClick={() => setRobotUp((current) => !current)} />
          <button type="button" className="scene-hit" style={box(1082 + dx, 518 + fy, 46, 80, 40)} aria-label={labels.pencils} aria-pressed={pencilsDown} title={labels.pencils} onClick={() => setPencilsDown((current) => !current)} />
          <button
            type="button"
            className="scene-hit"
            style={box(1150 + dx, 414 + fy, 128, 156, 40)}
            aria-label={labels.computer}
            aria-pressed={pcOn}
            title={labels.computer}
            onClick={() => {
              if (!pcOn) setBoot((current) => current + 1);
              setPcOn((current) => !current);
            }}
          />
          <button type="button" className="scene-hit" style={box(1300 + dx, 724 + fy, 297, 73, 44)} aria-label={labels.bed} aria-pressed={bedMessy} title={labels.bed} onClick={() => setBedMessy((current) => !current)} />
          <button
            type="button"
            className="scene-hit"
            style={box(126 * k, layout.floorY - 298, 32 * k, 56)}
            aria-label={labels.lamp}
            aria-pressed={lampOn}
            title={labels.lamp}
            onClick={() => {
              setPace("fast");
              onToggleLamp();
            }}
          />
        </div>
      )}
    </section>
  );
}

function Drawing({ layout, uid, boot, paletteIndex }: { layout: Layout; uid: string; boot: number; paletteIndex: number }) {
  const { W, H, ceilY, floorY, k } = layout;
  const dx = W - RIGHT_EDGE;
  const fy = floorY - BASE_FLOOR;
  const id = (name: string) => `${uid}-${name}`;
  const url = (name: string) => `url(#${id(name)})`;

  // perspectiva da parede esquerda: tudo converge para o mesmo ponto de fuga
  const cx = 200 * k;
  const vx = Math.max(W / 2, cx + 300);
  const vy = floorY - 300;
  const toward = (x0: number, y0: number, x: number) => y0 + ((x - x0) * (vy - y0)) / (vx - x0);
  const floorEdge = (x: number) => toward(cx, floorY, x);
  const pts = (...list: number[][]) => list.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(" ");

  const doorR = 103 * k;
  const doorTop = floorY - 553;
  const leafR = 91 * k;
  const leafTop = doorTop + 15;
  // a nav flutua por cima do teto: a luminária fica logo abaixo dela
  const lampY = ceilY * (layout.side ? 0.52 : 0.7);
  const lampH = clamp(ceilY * 0.19, 18, 34);
  const lampX = 738 + dx;

  const tiles: number[] = [];
  for (let x = vx - 190 * 9; x <= vx + 190 * 9; x += 190) tiles.push(x);
  const fall = (H + 20 - vy) / (floorY - vy);
  const floorH = H - floorY;

  return (
    <svg className="room" viewBox={`0 0 ${W.toFixed(2)} ${H.toFixed(2)}`} aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id={id("sky-day")} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#62b1ec" />
          <stop offset="1" stopColor="#bfe1f6" />
        </linearGradient>
        <linearGradient id={id("sky-dusk")} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#4d4b7a" />
          <stop offset="0.5" stopColor="#c56b7c" />
          <stop offset="0.78" stopColor="#f0a56c" />
          <stop offset="1" stopColor="#f7cf8d" />
        </linearGradient>
        <linearGradient id={id("sky-night")} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#0c1330" />
          <stop offset="1" stopColor="#1b2a55" />
        </linearGradient>
        <radialGradient id={id("glow")}>
          <stop offset="0" stopColor="#fff" stopOpacity="0.5" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </radialGradient>
        <radialGradient id={id("screen-glow")}>
          <stop offset="0" stopColor="#8fb0e6" stopOpacity="0.34" />
          <stop offset="1" stopColor="#8fb0e6" stopOpacity="0" />
        </radialGradient>
        <clipPath id={id("glass")}>
          <rect x="847" y="204" width="227" height="287" />
        </clipPath>
        <clipPath id={id("floor")}>
          <polygon points={pts([-10, floorEdge(-10)], [cx, floorY], [W + 10, floorY], [W + 10, H + 10], [-10, H + 10])} />
        </clipPath>
        <clipPath id={id("wall")}>
          <rect x={cx} y={ceilY} width={W - cx} height={floorY - ceilY} />
        </clipPath>
        <clipPath id={id("screen")}>
          <rect x="1158" y="422" width="269" height="134" rx="2" />
        </clipPath>
      </defs>

      {/* ---- o cômodo ---- */}
      <rect x="-10" y="-10" width={W + 20} height={ceilY + 10} fill={v("ceil")} />
      <rect x={cx} y={ceilY} width={W - cx + 10} height={floorY - ceilY} fill={v("wall")} />
      <polygon points={pts([cx, ceilY], [-10, toward(cx, ceilY, -10)], [-10, floorEdge(-10)], [cx, floorY])} fill={v("wallL")} />
      <polygon points={pts([-10, floorEdge(-10)], [cx, floorY], [W + 10, floorY], [W + 10, H + 10], [-10, H + 10])} fill={v("floor")} />

      <g clipPath={url("floor")} stroke={v("floorLine")} strokeWidth="1.5" fill="none">
        {tiles.map((x) => (
          <line key={x} x1={x} y1={floorY} x2={vx + (x - vx) * fall} y2={H + 20} />
        ))}
        <line x1="-10" y1={floorY + floorH * 0.42} x2={W + 10} y2={floorY + floorH * 0.42} />
        {floorH > 150 && <line x1="-10" y1={floorY + floorH * 0.9} x2={W + 10} y2={floorY + floorH * 0.9} />}
      </g>

      {/* luz da luminária na parede e no teto */}
      <g className="lamp-light">
        <ellipse cx={940 + dx} cy={ceilY} rx="760" ry={Math.min(460, (floorY - ceilY) * 0.8)} fill={url("glow")} clipPath={url("wall")} opacity="0.5" />
        <ellipse cx={940 + dx} cy={lampY + lampH / 2} rx="330" ry={ceilY * 0.5} fill={url("glow")} opacity="0.7" />
      </g>

      <rect x={cx} y={floorY - 17} width={W - cx + 10} height="17" fill={v("base")} />
      <polygon points={pts([doorR, toward(cx, floorY - 17, doorR)], [cx, floorY - 17], [cx, floorY], [doorR, floorEdge(doorR)])} fill={v("base")} />

      <g stroke={v("edge")} strokeWidth="1.5" fill="none" strokeLinecap="round">
        <line x1={cx} y1={ceilY} x2={W + 10} y2={ceilY} />
        <line x1={cx} y1={ceilY} x2={-10} y2={toward(cx, ceilY, -10)} />
        <line x1={cx} y1={ceilY} x2={cx} y2={floorY} />
        <line x1={cx} y1={floorY} x2={W + 10} y2={floorY} />
        <line x1={cx} y1={floorY} x2={-10} y2={floorEdge(-10)} />
        <line x1={cx} y1={floorY - 17} x2={W + 10} y2={floorY - 17} />
      </g>

      {/* ---- luminária ---- */}
      <polygon points={pts([lampX - 10, lampY], [lampX + 415, lampY], [lampX + 405, lampY + lampH], [lampX, lampY + lampH])} fill={v("lampBody")} stroke={v("line")} strokeWidth="2" strokeLinejoin="round" />
      <polygon className="lamp-tube" points={pts([lampX - 2, lampY + 4], [lampX + 407, lampY + 4], [lampX + 399, lampY + lampH - 4], [lampX + 6, lampY + lampH - 4])} />

      {/* ---- porta e interruptor ---- */}
      <polygon points={pts([-10, toward(doorR, doorTop, -10)], [doorR, doorTop], [doorR, floorEdge(doorR)], [-10, floorEdge(-10)])} fill={v("doorFrame")} stroke={v("line")} strokeWidth="2" strokeLinejoin="round" />
      <polygon points={pts([-10, toward(leafR, leafTop, -10)], [leafR, leafTop], [leafR, floorEdge(leafR)], [-10, floorEdge(-10)])} fill={v("hall")} />
      <g className="door-leaf">
        <polygon points={pts([-10, toward(leafR, leafTop, -10)], [leafR, leafTop], [leafR, floorEdge(leafR)], [-10, floorEdge(-10)])} fill={v("door")} stroke={v("line")} strokeWidth="1.5" strokeLinejoin="round" />
        <g stroke={v("line")} strokeWidth="1.5" fill={v("metal")}>
          <rect x={69 * k} y={floorY - 244} width={12 * k + 2} height="50" rx="3" />
          <rect x={42 * k} y={floorY - 224} width={40 * k} height="9" rx="4.5" />
        </g>
      </g>
      <g className="switch">
        <rect x={129 * k} y={floorY - 295} width={26 * k} height="50" rx="3.5" fill={v("plate")} stroke={v("line")} strokeWidth="1.5" />
        <rect x={135 * k} y={floorY - 287} width={14 * k} height="34" rx="2" fill={v("rocker")} stroke={v("line")} strokeWidth="1.2" />
        <rect className="switch-press" x={135 * k + 1.2} y={floorY - 286} width={14 * k - 2.4} height="15" rx="1.2" fill={v("line")} opacity="0.2" />
        {/* luz-piloto: mostra onde está o interruptor no escuro */}
        <circle className="switch-pilot" cx={142 * k} cy={floorY - 249.5} r="1.8" fill="#ffd9a0" />
      </g>

      {/* ---- tudo que fica à direita, ancorado no chão ---- */}
      <g transform={`translate(${dx.toFixed(2)} ${fy.toFixed(2)})`}>
        {/* janela */}
        <rect x="839" y="166" width="243" height="342" rx="2" fill={v("frame")} stroke={v("line")} strokeWidth="2" />
        <g clipPath={url("glass")}>
          <rect x="847" y="204" width="227" height="287" fill={url("sky-day")} />
          <rect className="sky-dusk" x="847" y="204" width="227" height="287" fill={url("sky-dusk")} />
          <rect className="sky-night" x="847" y="204" width="227" height="287" fill={url("sky-night")} />
          <g className="stars" fill="#fff">
            {STARS.map(([x, y, r]) => (
              <circle key={`${x}-${y}`} cx={x} cy={y} r={r} />
            ))}
          </g>
          <g className="clouds" fill="#fff">
            <path d="M866 330a9 9 0 0 1 14-8a12 12 0 0 1 22 2a8 8 0 0 1 4 15h-36a8 8 0 0 1-4-9z" />
            <path d="M1002 300a8 8 0 0 1 12-7a11 11 0 0 1 20 1a8 8 0 0 1 6 14h-34a7 7 0 0 1-4-8z" />
            <path d="M1040 356a6 6 0 0 1 10-5a8 8 0 0 1 14 2a6 6 0 0 1 2 10h-24a5 5 0 0 1-2-7z" opacity="0.8" />
          </g>
          <g className="sun">
            <circle cx="903" cy="262" r="31" fill="var(--k-halo)" opacity="0.45" />
            <circle cx="903" cy="262" r="21" fill="var(--k-sun)" />
          </g>
          <g className="moon">
            <g transform="translate(1018 262)">
              <circle r="30" fill="#dfe6ff" opacity="0.12" />
              <path d="M6 -18A19 19 0 1 0 6 18A19.5 19.5 0 0 1 6 -18Z" fill="#f3f0e2" />
            </g>
          </g>
          <g fill="var(--k-far)">
            {BUILDINGS_FAR.map(([x, y, w]) => (
              <rect key={x} x={x} y={y} width={w} height={495 - y} />
            ))}
            <rect x="893" y="356" width="2" height="18" />
          </g>
          <g fill="var(--k-near)">
            {BUILDINGS_NEAR.map(([x, y, w]) => (
              <rect key={x} x={x} y={y} width={w} height={495 - y} />
            ))}
            <rect x="1027" y="334" width="2" height="18" />
          </g>
          <g className="lit" fill="#f6d67a">
            {LIT.map(([x, y]) => (
              <rect key={`${x}-${y}`} x={x} y={y} width="5" height="6" />
            ))}
          </g>
          <path d="M847 478q10-10 22-4q8-10 20-2q10-6 18 4q14-8 24 2q12-8 24 0q10-8 22-2q10-8 22 0q12-8 22 0q12-6 22 2q8-6 14-2v20h-232z" fill="var(--k-tree)" />
        </g>
        {/* folhas de vidro */}
        <g className="sash">
          <rect x="961" y="204" width="113" height="287" fill="#fff" fillOpacity="0.05" />
          <path d="M1036 204h18l-52 287h-18z" fill="#fff" fillOpacity="0.04" />
          <rect x="964.5" y="207.5" width="106" height="280" fill="none" stroke={v("sash")} strokeWidth="7" />
        </g>
        <g className="sash">
          <rect x="847" y="204" width="113" height="287" fill="#fff" fillOpacity="0.05" />
          <path d="M916 204h18l-52 287h-18z" fill="#fff" fillOpacity="0.04" />
          <rect x="850.5" y="207.5" width="106" height="280" fill="none" stroke={v("sash")} strokeWidth="7" />
          <rect x="945" y="336" width="4" height="24" rx="2" fill={v("rod")} />
        </g>
        <rect x="839" y="166" width="243" height="38" fill={v("frame")} />
        <rect x="839" y="491" width="243" height="17" fill={v("frame")} />
        <rect x="839" y="166" width="243" height="342" rx="2" fill="none" stroke={v("line")} strokeWidth="2" />
        <line x1="839" y1="204" x2="1082" y2="204" stroke={v("line")} strokeWidth="1.5" />

        {/* cortinas */}
        <path d="M750 162v318a6 14 0 1 0 0.1 0" fill="none" stroke={v("rod")} strokeWidth="2" strokeLinecap="round" />
        <g className="curtain curtain-a">
          <path d="M756 160h86v390q-11 7-21 0q-11 7-22 0q-11 7-22 0q-11 7-21 0z" fill={v("curtain")} stroke={v("line")} strokeWidth="2" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
          <path d="M770 162v386M784 162v388M799 162v386M813 162v388M828 162v386" stroke={v("fold")} strokeWidth="3" fill="none" vectorEffect="non-scaling-stroke" />
        </g>
        <g className="curtain curtain-b">
          <path d="M1080 160h66v390q-11 7-22 0q-11 7-22 0q-11 7-22 0z" fill={v("curtain")} stroke={v("line")} strokeWidth="2" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
          <path d="M1093 162v386M1107 162v388M1120 162v386M1134 162v388" stroke={v("fold")} strokeWidth="3" fill="none" vectorEffect="non-scaling-stroke" />
        </g>
        <line x1="744" y1="158" x2="1154" y2="158" stroke={v("rod")} strokeWidth="5" strokeLinecap="round" />

        {/* prateleira */}
        <rect x="1212" y="279" width="270" height="9" fill="#000" opacity="0.07" />
        <path d="M1236 222h30l-4 33h-22z" fill={v("pot")} stroke={v("line")} strokeWidth="1.5" strokeLinejoin="round" />
        {/* cinco livros, cinco paletas: o escolhido fica puxado para cima */}
        <g stroke={v("line")} strokeWidth="1.5" strokeLinejoin="round">
          {(
            [
              [1291, 178, 16, "bookA"],
              [1307, 190, 15, "bookB"],
              [1322, 184, 17, "bookC"],
              [1339, 188, 14, "bookD"],
              [1353, 176, 18, "bookE"],
            ] as const
          ).map(([x, y, w, color], i) => (
            <g key={color} className={i === paletteIndex ? "book is-picked" : "book"}>
              <rect x={x} y={y} width={w} height={255 - y} fill={v(color)} />
              <line x1={x + 3} y1={y + 14} x2={x + w - 3} y2={y + 14} stroke={v("line")} strokeWidth="1.2" opacity="0.45" />
            </g>
          ))}
        </g>
        {/* bonequinho */}
        <g stroke={v("line")} strokeWidth="1.3" strokeLinejoin="round">
          <line x1="1433" y1="196" x2="1433" y2="190" />
          <rect x="1427" y="196" width="12" height="10" rx="2" fill={v("toy")} />
          <rect x="1422" y="208" width="22" height="20" rx="2" fill={v("toy")} />
          <rect className="robot-arm" x="1416" y="209" width="6" height="18" rx="2" fill={v("toyDark")} />
          <rect x="1444" y="209" width="6" height="18" rx="2" fill={v("toyDark")} />
          <rect x="1424" y="228" width="8" height="27" rx="1.5" fill={v("toy")} />
          <rect x="1434" y="228" width="8" height="27" rx="1.5" fill={v("toy")} />
          <rect x="1430" y="213" width="6" height="5" fill={v("red")} stroke="none" />
        </g>
        <rect x="1204" y="255" width="281" height="24" rx="1.5" fill={v("shelf")} stroke={v("line")} strokeWidth="2" />
        <rect x="1205" y="256" width="279" height="7" fill={v("shelfTop")} />
        {/* cipós: por cima da prateleira, descendo do vaso pela frente dela */}
        <g fill="none" stroke={v("vine")} strokeWidth="2.2" strokeLinecap="round">
          {VINES.map((vine) => (
            <path key={vine.seed} d={`M${vine.d[0].join(" ")}C${vine.d[1].join(" ")} ${vine.d[2].join(" ")} ${vine.d[3].join(" ")}`} />
          ))}
        </g>
        {VINE_LEAVES.map((leaf, i) => (
          <path key={`v${i}`} d={LEAF_AT_BASE} transform={`translate(${leaf.x.toFixed(1)} ${leaf.y.toFixed(1)}) rotate(${leaf.rot}) scale(${leaf.size.toFixed(2)})`} fill={leaf.alt ? v("leaf2") : v("leaf")} />
        ))}
        {/* a copa por cima, escondendo o começo dos cipós */}
        {CROWN.map((leaf, i) => (
          <path key={i} d={LEAF_AT_BASE} transform={`translate(${leaf.x} ${leaf.y}) rotate(${leaf.rot}) scale(${leaf.size})`} fill={leaf.alt ? v("leaf2") : v("leaf")} />
        ))}

        {/* mesa e computador */}
        <ellipse className="screen-glow" cx="1292" cy="500" rx="330" ry="240" fill={url("screen-glow")} />
        <rect x="1078" y="620" width="440" height="152" fill={v("deskPanel")} />
        <rect x="1056" y="604" width="22" height="180" fill={v("desk")} stroke={v("line")} strokeWidth="2" />
        <rect x="1280" y="566" width="24" height="24" fill={v("bezel")} />
        <rect x="1150" y="414" width="285" height="156" rx="6" fill={v("bezel")} stroke={v("line")} strokeWidth="2" />
        <g clipPath={url("screen")} className="screen" key={boot}>
          <rect className="screen-bg" x="1158" y="422" width="269" height="134" />
          <g className="boot">
            <circle cx="1292" cy="478" r="9" fill="none" stroke="#c9d3e4" strokeWidth="2.4" />
            <line x1="1292" y1="465" x2="1292" y2="477" stroke="#c9d3e4" strokeWidth="2.4" strokeLinecap="round" />
            <rect x="1262" y="502" width="60" height="3" rx="1.5" fill="#39404d" />
            <rect className="boot-bar" x="1262" y="502" width="60" height="3" rx="1.5" fill="#c9d3e4" />
          </g>
          <g className="desktop">
            <rect x="1158" y="422" width="56" height="134" fill="#222630" />
            <rect x="1158" y="422" width="269" height="13" fill="#262b35" />
            <circle cx="1167" cy="428.5" r="2.6" fill="#d9695f" />
            <circle cx="1176" cy="428.5" r="2.6" fill="#d9b04f" />
            <circle cx="1185" cy="428.5" r="2.6" fill="#6fb873" />
            {[448, 462, 476, 490, 504].map((y, i) => (
              <rect key={y} x={i === 0 ? 1166 : 1172} y={y} width={i === 0 ? 34 : 28} height="4" rx="2" fill={i === 2 ? "#c9d3e4" : "#586173"} />
            ))}
            {CODE.map(([x, y, w, color], i) => (
              <rect key={`${x}-${y}`} className="code" style={{ "--i": i } as CSSProperties} x={x} y={y} width={w} height="4" rx="2" fill={color} />
            ))}
          </g>
        </g>
        <rect className="screen-off" x="1158" y="422" width="269" height="134" rx="2" fill="#07080a" />
        <rect x="1048" y="588" width="470" height="14" rx="2" fill={v("deskTop")} stroke={v("line")} strokeWidth="2" />
        <rect x="1048" y="602" width="470" height="19" rx="1" fill={v("desk")} stroke={v("line")} strokeWidth="2" />
        <rect x="1180" y="583" width="72" height="8" rx="2.5" fill={v("bezel")} stroke={v("line")} strokeWidth="1.2" />
        <g strokeWidth="4" strokeLinecap="round">
          <line className="pencil pencil-a" x1="1097" y1="552" x2="1092" y2="526" stroke={v("pencilA")} />
          <line className="pencil pencil-b" x1="1104" y1="552" x2="1106" y2="521" stroke={v("pencilB")} />
          <line className="pencil pencil-c" x1="1112" y1="552" x2="1119" y2="528" stroke={v("red")} />
        </g>
        <path d="M1087 548h35l-3 46h-29z" fill={v("cup")} stroke={v("line")} strokeWidth="1.8" strokeLinejoin="round" />

        {/* personagem, de costas */}
        <path d="M1264 552Q1246 580 1249 632h30l2-74z" fill={v("sleeve")} stroke={v("line")} strokeWidth="2" strokeLinejoin="round" />
        <path d="M1436 552Q1454 580 1451 632h-30l-2-74z" fill={v("sleeve")} stroke={v("line")} strokeWidth="2" strokeLinejoin="round" />
        <path d="M1266 552Q1288 522 1326 517h48Q1412 522 1434 552l8 56h-184z" fill={v("jacket")} stroke={v("line")} strokeWidth="2" strokeLinejoin="round" />
        <rect x="1254" y="574" width="9" height="17" rx="2" transform="rotate(8 1258 582)" fill={v("red")} />
        <rect x="1437" y="574" width="9" height="17" rx="2" transform="rotate(-8 1441 582)" fill={v("red")} />
        <path d="M1298 532Q1300 502 1350 500Q1400 502 1402 532Q1394 554 1350 556Q1306 554 1298 532Z" fill={v("hood")} stroke={v("line")} strokeWidth="2" strokeLinejoin="round" />
        <path d="M1318 536Q1350 548 1382 536" fill="none" stroke={v("edge")} strokeWidth="1.5" strokeLinecap="round" />
        <ellipse cx="1289" cy="466" rx="7" ry="11" fill={v("skin")} stroke={v("line")} strokeWidth="1.5" />
        <ellipse cx="1411" cy="466" rx="7" ry="11" fill={v("skin")} stroke={v("line")} strokeWidth="1.5" />
        <path d={HAIR} fill={v("hair")} stroke={v("line")} strokeWidth="2" strokeLinejoin="round" />
        <g fill="none" stroke={v("hairDark")} strokeWidth="2.6" strokeLinecap="round">
          {CURLS.map((d) => (
            <path key={d} d={d} />
          ))}
        </g>
        {/* fones */}
        <path d="M1286 452Q1284 376 1350 376Q1416 376 1414 452" fill="none" stroke={v("line")} strokeWidth="10" strokeLinecap="round" />
        <path d="M1286 452Q1284 376 1350 376Q1416 376 1414 452" fill="none" stroke={v("phones")} strokeWidth="6" strokeLinecap="round" />
        <rect x="1274" y="440" width="20" height="46" rx="9" fill={v("phones")} stroke={v("line")} strokeWidth="2" />
        <rect x="1406" y="440" width="20" height="46" rx="9" fill={v("phones")} stroke={v("line")} strokeWidth="2" />

        {/* cadeira */}
        <rect x="1343" y="716" width="14" height="50" fill={v("chair")} />
        <rect x="1256" y="650" width="9" height="46" fill={v("chair")} stroke={v("line")} strokeWidth="1.5" />
        <rect x="1435" y="650" width="9" height="46" fill={v("chair")} stroke={v("line")} strokeWidth="1.5" />
        <rect x="1244" y="638" width="34" height="13" rx="6" fill={v("chair")} stroke={v("line")} strokeWidth="2" />
        <rect x="1422" y="638" width="34" height="13" rx="6" fill={v("chair")} stroke={v("line")} strokeWidth="2" />
        <rect x="1262" y="700" width="176" height="24" rx="10" fill={v("chair")} stroke={v("line")} strokeWidth="2" />
        <rect x="1273" y="549" width="154" height="166" rx="24" fill={v("chair")} stroke={v("line")} strokeWidth="2" />
        <rect x="1290" y="566" width="120" height="132" rx="14" fill={v("chairIn")} />

        {/* cama */}
        <path d="M1465 900V592q0-22 22-22h140v330z" fill={v("headboard")} stroke={v("line")} strokeWidth="2" strokeLinejoin="round" />
        <path d="M1478 700l8-62q2-14 18-14h124v76z" fill={v("pillow")} stroke={v("line")} strokeWidth="2" strokeLinejoin="round" />
        <rect x="1250" y="880" width="380" height="14" fill="#000" opacity="0.12" />
        <path d="M1239 884V800q4-56 46-72q20-6 45-6h300v162z" fill={v("sheet")} stroke={v("line")} strokeWidth="2" strokeLinejoin="round" />
        <g className="blanket">
          <path d="M1239 900V800q4-56 46-72q20-6 45-6h330v178z" fill={v("blanket")} stroke={v("line")} strokeWidth="2" strokeLinejoin="round" />
          <path d="M1284 900v-86q6-46 44-52q12-2 28-2h304" fill="none" stroke={v("blanketFold")} strokeWidth="2.5" />
        </g>
      </g>
    </svg>
  );
}
