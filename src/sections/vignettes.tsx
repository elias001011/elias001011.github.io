import { Moon, Sun } from "lucide-react";
import { useMemo, type CSSProperties } from "react";
import type { SectionCopy } from "./copy";

/* ---- Este site: os cinco livros da prateleira trocam a paleta ---- */
const BOOKS = [
  { id: "green", color: "#5cc487", h: 62 },
  { id: "blue", color: "#7fb0f5", h: 70 },
  { id: "black", color: "#26272d", h: 56 },
  { id: "graphite", color: "#9aa5b5", h: 66 },
  { id: "cafeteria", color: "#a9764a", h: 60 },
];

export function ShelfVig({
  palette,
  onPalette,
  theme,
  onTheme,
  names,
  copy,
}: {
  palette: string;
  onPalette: (id: string) => void;
  theme: "light" | "dark";
  onTheme: () => void;
  names: Record<string, { label: string }>;
  copy: SectionCopy["site"];
}) {
  return (
    <div className="vig vig-shelf">
      <div className="shelf">
        <div className="shelf-books">
          {BOOKS.map((book) => (
            <button
              key={book.id}
              type="button"
              className={palette === book.id ? "is-picked" : ""}
              style={{ "--book": book.color, height: book.h } as CSSProperties}
              aria-pressed={palette === book.id}
              aria-label={names[book.id]?.label}
              title={names[book.id]?.label}
              onClick={() => onPalette(book.id)}
            />
          ))}
          <button type="button" className="shelf-theme" aria-label={copy.theme} title={copy.theme} onClick={onTheme}>
            {theme === "dark" ? <Moon size={18} /> : <Sun size={18} />}
          </button>
        </div>
        <span className="shelf-board" />
      </div>
      <p className="mono vig-hint">
        {copy.pick} · <b>{names[palette]?.label}</b>
      </p>
    </div>
  );
}

/* ---- Rodapé: a cidade da janela do quarto, de ponta a ponta ---- */
function seeded(seed: number) {
  let state = seed;
  return () => {
    state = (state * 1664525 + 1013904223) % 4294967296;
    return state / 4294967296;
  };
}

export function Skyline() {
  const buildings = useMemo(() => {
    const random = seeded(1011);
    const list: { x: number; w: number; h: number; tone: number; windows: { x: number; y: number; on: boolean }[] }[] = [];
    let x = -10;
    while (x < 1610) {
      const w = 44 + Math.floor(random() * 5) * 12;
      const h = 60 + Math.floor(random() * 130);
      const windows = [];
      for (let wy = 14; wy < h - 14; wy += 20) {
        for (let wx = 10; wx <= w - 18; wx += 16) {
          const on = random() < 0.24;
          windows.push({ x: x + wx, y: 220 - h + wy, on });
        }
      }
      list.push({ x, w, h, tone: Math.floor(random() * 3), windows });
      x += w + (random() < 0.3 ? 10 : 0);
    }
    return list;
  }, []);

  const flip = (target: EventTarget, force?: boolean) => {
    const node = target as SVGElement;
    if (!node.classList?.contains("sky-win")) return;
    const before = node.classList.contains("is-on");
    const after = force ?? !before;
    if (before === after) return;
    node.classList.toggle("is-on", after);
  };

  return (
    <div className="skyline">
      <svg
        viewBox="0 0 1600 220"
        preserveAspectRatio="xMidYMax slice"
        aria-hidden="true"
        onClick={(event) => flip(event.target)}
        onPointerOver={(event) => event.pointerType === "mouse" && flip(event.target, true)}
      >
        <circle className="sky-orb" cx="1290" cy="46" r="22" />
        <circle className="sky-orb-cut" cx="1300" cy="40" r="19" />
        {buildings.map((building) => (
          <g key={building.x}>
            <rect className="sky-b" data-tone={building.tone} x={building.x} y={220 - building.h} width={building.w} height={building.h + 2} />
            {building.windows.map((win) => (
              <rect key={`${win.x}-${win.y}`} className={`sky-win ${win.on ? "is-on" : ""}`} x={win.x} y={win.y} width="8" height="10" />
            ))}
          </g>
        ))}
      </svg>
    </div>
  );
}
