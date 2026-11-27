import { Search, X } from "lucide-react";
import { useMemo, useState } from "react";
import sample from "../data/ytm-sample.json";
import type { SectionCopy } from "./copy";

type Kind = "artist" | "song" | "album";
type Item = { kind: Kind; title: string; artist: string; detail: string };

const items = sample.items as Item[];
const artists = items.filter((item) => item.kind === "artist").map((item) => item.title);
const kinds = ["all", "artist", "song", "album"] as const;

const fold = (text: string) => text.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
const index = items.map((item) => fold(`${item.title} ${item.artist}`));

// cada artista ganha sempre a mesma cor de etiqueta (as dos livros do quarto)
const tagOf = (name: string) => [...name].reduce((sum, char) => sum + char.charCodeAt(0), 0) % 5;

export function YtmDemo({ copy, locale }: { copy: SectionCopy["ytm"]; locale: string }) {
  const [query, setQuery] = useState("Daft Punk");
  const [kind, setKind] = useState<(typeof kinds)[number]>("all");

  const results = useMemo(() => {
    const tokens = fold(query).split(/\s+/).filter(Boolean);
    return items.filter((item, i) => (kind === "all" || item.kind === kind) && tokens.every((token) => index[i].includes(token)));
  }, [query, kind]);

  const trimmed = query.trim();
  const call =
    kind === "song"
      ? `yt.music.searchSong('${trimmed}')`
      : kind === "album"
        ? `yt.music.getArtistProfile(id).releases`
        : `yt.music.searchArtists('${trimmed}')`;
  const date = new Intl.DateTimeFormat(locale, { day: "numeric", month: "short", year: "numeric" }).format(new Date(`${sample.capturedAt}T00:00`));

  return (
    <div className="ytm">
      <label className="ytm-search">
        <Search size={17} aria-hidden="true" />
        <input
          type="search"
          value={query}
          placeholder={copy.placeholder}
          aria-label={copy.placeholder}
          spellCheck={false}
          autoComplete="off"
          onChange={(event) => setQuery(event.target.value)}
        />
        {query && (
          <button type="button" aria-label="×" onClick={() => setQuery("")}>
            <X size={15} />
          </button>
        )}
      </label>

      <div className="ytm-bar">
        <div className="seg" role="group">
          {kinds.map((option) => (
            <button key={option} type="button" aria-pressed={kind === option} onClick={() => setKind(option)}>
              {copy.kinds[option]}
            </button>
          ))}
        </div>
      </div>

      <pre className="ytm-code mono" aria-hidden="true">
        <span className="c-dim">final</span> yt = <span className="c-fn">YoutubeMusicExplode</span>();{"\n"}
        <span className="c-dim">await</span> <span className="c-call">{call}</span>;
      </pre>

      {results.length > 0 ? (
        <ul className="ytm-results">
          {results.slice(0, 7).map((item, i) => (
            <li key={`${item.kind}-${item.title}-${item.artist}`} style={{ animationDelay: `${i * 28}ms` }}>
              <span className="mono ytm-kind">{copy.kind[item.kind]}</span>
              <span className="mono ytm-tag" data-tag={tagOf(item.artist.split(",")[0])}>
                {item.artist.split(",")[0]}
              </span>
              <span className="ytm-title">{item.kind === "artist" ? item.detail : item.title}</span>
              {item.kind !== "artist" && item.detail && <span className="mono ytm-detail">{item.detail}</span>}
            </li>
          ))}
        </ul>
      ) : (
        <div className="ytm-empty">
          <p>{copy.empty}</p>
          <div className="chips">
            {artists.slice(0, 8).map((artist) => (
              <button key={artist} type="button" className="chip" onClick={() => { setQuery(artist); setKind("all"); }}>
                {artist}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="chips ytm-suggest">
        {artists.filter((artist) => fold(artist) !== fold(trimmed)).slice(0, 6).map((artist) => (
          <button key={artist} type="button" className="chip" onClick={() => { setQuery(artist); setKind("all"); }}>
            {artist}
          </button>
        ))}
      </div>

      <p className="ytm-note mono">{copy.note.replace("{date}", date)}</p>
    </div>
  );
}
