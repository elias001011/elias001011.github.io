import { Download, Maximize2 } from "lucide-react";
import { useState, type CSSProperties, type PointerEvent } from "react";
import { zenify, type LanguageId } from "../content";
import { zenifyCopy } from "./zenify-copy";
import "./zenify.css";

const views = ["player", "lyrics", "queue", "home", "recap", "sync"] as const;
type View = (typeof views)[number];
type Screenshot = { src: string; alt: string; height?: number };

function reflectPointer(event: PointerEvent<HTMLElement>) {
  if (event.pointerType !== "mouse") return;
  const art = event.currentTarget;
  const bounds = art.getBoundingClientRect();
  art.style.setProperty("--reflection-x", `${event.clientX - bounds.left}px`);
  art.style.setProperty("--reflection-y", `${event.clientY - bounds.top}px`);
}

export function ZenifyCase({ language, openLabel, onExpand }: {
  language: LanguageId;
  openLabel: string;
  onExpand: (shot: Screenshot, label: string) => void;
}) {
  const copy = zenifyCopy[language];
  const [view, setView] = useState<View>("player");
  const [label, detail, alt] = copy.screens[view];
  const compact = view === "player" || view === "lyrics" ? zenify.compact[view] : null;
  const shot = { src: compact?.src ?? zenify.desktop[view], height: compact?.height, alt };
  const artStyle = { "--record-angle": `${views.indexOf(view) * 38}deg` } as CSSProperties;

  return (
    <section className="zen-case" id="zenify" aria-labelledby="zenify-title">
      <div className="zen-layout">
        <header className="zen-intro">
          <h2 id="zenify-title">Zenify</h2>
          <p className="zen-tag">{copy.tagline}</p>
          <p className="zen-intro-text">{copy.intro}</p>
          <div className="zen-actions">
            <a className="zen-download" href={zenify.download}><Download size={16} />{copy.download}</a>
            <a className="zen-source" href={zenify.repo}>{copy.code}</a>
          </div>
        </header>
        <figure className="zen-art" id="zen-preview" data-format={compact ? "compact" : "wide"} style={artStyle} onPointerMove={reflectPointer}>
          <div className="zen-record" aria-hidden="true"><i /></div>
          <button className="zen-screen" type="button" aria-label={openLabel + " · " + label} onClick={() => onExpand(shot, label)}>
            <img key={shot.src} src={shot.src} alt={alt} width={compact ? 389 : 1600} height={compact?.height ?? 874} loading="lazy" decoding="async" />
            <span><Maximize2 size={16} /></span>
          </button>
        </figure>
        <div className="zen-tracklist">
          <div className="zen-views" role="group" aria-label={copy.views}>
            {views.map(item => (
              <button type="button" key={item} aria-controls="zen-preview" aria-pressed={view === item} onClick={() => setView(item)}>
                {copy.screens[item][0]}
              </button>
            ))}
          </div>
          <div className="zen-caption">
            <p aria-live="polite">{detail}</p>
            {compact && <button type="button" onClick={() => onExpand({ src: zenify.desktop[view], alt: label + " · Zenify / Desktop" }, label + " · Desktop")}>{copy.desktop}</button>}
          </div>
        </div>
      </div>
    </section>
  );
}
