import { Search, SkipBack, SkipForward, VolumeX } from "lucide-react";
import { useEffect, useCallback, useRef, useState, type CSSProperties } from "react";
import type { Copy } from "./content";

/* ============================================================
   Player local da seção Zenify.
   Toca só arquivos de public/music/, listados em tracks.json.
   Nada é buscado nem transmitido de serviços de terceiros.
   ============================================================ */

export type Track = {
  title: string;
  artist: string;
  /** caminho relativo a public/music/, ex.: "faixa.mp3" */
  file: string;
  license: string;
  source: string;
};

type CatalogStatus = "loading" | "ready" | "error";

const MUSIC_BASE = `${import.meta.env.BASE_URL}music/`;
const SEARCH_ID = "zen-music-search";

function parseCatalog(data: unknown): Track[] {
  if (!Array.isArray(data)) return [];
  const tracks: Track[] = [];
  for (const item of data) {
    if (!item || typeof item !== "object") continue;
    const { title, artist, file, license, source } = item as Record<string, unknown>;
    if (typeof title !== "string" || typeof file !== "string") continue;
    // só caminhos relativos dentro de public/music/
    if (!file.trim() || file.startsWith("/") || file.includes("..") || file.includes(":") || file.includes("\\")) continue;
    tracks.push({
      title,
      artist: typeof artist === "string" ? artist : "",
      file,
      license: typeof license === "string" ? license : "",
      source: typeof source === "string" ? source : "",
    });
  }
  return tracks;
}

const trackUrl = (file: string) => MUSIC_BASE + file.split("/").map(encodeURIComponent).join("/");

// minúsculas e sem acento, para a busca
const fold = (text: string) => text.normalize("NFD").replace(/\p{M}/gu, "").toLowerCase();

export type ZenPlayer = {
  audio: HTMLAudioElement;
  tracks: Track[];
  catalog: CatalogStatus;
  index: number;
  playing: boolean;
  missing: Record<string, true>;
  playIndex: (index: number) => void;
  toggleSound: () => void;
  move: (step: 1 | -1) => void;
};

/**
 * Estado do player. Mudo e pausado são a mesma coisa: o ícone (ondas ou
 * alto-falante mudo) reflete sempre o estado real do <audio>.
 */
export function useZenPlayer(): ZenPlayer {
  const [audio] = useState(() => {
    const element = new Audio();
    element.preload = "none";
    return element;
  });
  const [tracks, setTracks] = useState<Track[]>([]);
  const [catalog, setCatalog] = useState<CatalogStatus>("loading");
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [missing, setMissing] = useState<Record<string, true>>({});

  // espelhos dos valores para os eventos do <audio> não lerem estado antigo
  const tracksRef = useRef<Track[]>([]);
  const indexRef = useRef(0);
  const missingRef = useRef<Record<string, true>>({});
  const loadedRef = useRef<string | null>(null);

  useEffect(() => {
    let alive = true;
    fetch(`${MUSIC_BASE}tracks.json`)
      .then((response) => {
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return response.json() as Promise<unknown>;
      })
      .then((data) => {
        if (!alive) return;
        const list = parseCatalog(data);
        tracksRef.current = list;
        setTracks(list);
        setCatalog("ready");
      })
      .catch(() => {
        if (alive) setCatalog("error");
      });
    return () => {
      alive = false;
    };
  }, []);

  const isPlayable = useCallback((i: number) => {
    const track = tracksRef.current[i];
    return track !== undefined && !missingRef.current[track.file];
  }, []);

  // próxima faixa disponível na direção do passo, dando a volta na lista
  const findPlayable = useCallback(
    (from: number, step: 1 | -1) => {
      const total = tracksRef.current.length;
      for (let k = 1; k <= total; k++) {
        const i = (((from + step * k) % total) + total) % total;
        if (isPlayable(i)) return i;
      }
      return -1;
    },
    [isPlayable],
  );

  const playIndex = useCallback(
    (i: number) => {
      if (!isPlayable(i)) return;
      const track = tracksRef.current[i];
      indexRef.current = i;
      setIndex(i);
      if (loadedRef.current !== track.file) {
        loadedRef.current = track.file;
        audio.src = trackUrl(track.file);
      }
      audio.play().catch((error: unknown) => {
        // AbortError: trocou de faixa no meio; o evento "error" trata arquivo ausente
        if (error instanceof DOMException && error.name === "AbortError") return;
        setPlaying(false);
      });
    },
    [audio, isPlayable],
  );

  const toggleSound = useCallback(() => {
    if (!audio.paused) {
      audio.pause();
      return;
    }
    // se a faixa atual está indisponível, toca a próxima que estiver
    const target = isPlayable(indexRef.current) ? indexRef.current : findPlayable(indexRef.current, 1);
    if (target >= 0) playIndex(target);
  }, [audio, findPlayable, isPlayable, playIndex]);

  const move = useCallback(
    (step: 1 | -1) => {
      const target = findPlayable(indexRef.current, step);
      if (target < 0) return;
      if (!audio.paused) {
        playIndex(target);
      } else {
        // pausado: só troca a faixa selecionada; toca ao clicar no som
        indexRef.current = target;
        setIndex(target);
      }
    },
    [audio, findPlayable, playIndex],
  );

  useEffect(() => {
    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);
    const onEnded = () => {
      const next = findPlayable(indexRef.current, 1);
      if (next >= 0) playIndex(next);
      else setPlaying(false);
    };
    const onError = () => {
      const file = loadedRef.current;
      // após uma falha o <audio> pode continuar com paused === false; pausa para o estado bater com o ícone
      audio.pause();
      if (!file) return;
      if (!missingRef.current[file]) {
        missingRef.current = { ...missingRef.current, [file]: true };
        setMissing(missingRef.current);
      }
      setPlaying(false);
    };
    audio.addEventListener("play", onPlay);
    audio.addEventListener("pause", onPause);
    audio.addEventListener("ended", onEnded);
    audio.addEventListener("error", onError);
    return () => {
      audio.removeEventListener("play", onPlay);
      audio.removeEventListener("pause", onPause);
      audio.removeEventListener("ended", onEnded);
      audio.removeEventListener("error", onError);
    };
  }, [audio, findPlayable, playIndex]);

  return { audio, tracks, catalog, index, playing, missing, playIndex, toggleSound, move };
}

/* ---------- barra fixa "Tocando agora" ---------- */

export function NowPlayingBar({ player, copy }: { player: ZenPlayer; copy: Copy }) {
  const { audio, tracks, catalog, index, playing, missing, toggleSound, move } = player;
  const t = copy.zen.player;
  const current = tracks[index];
  const currentMissing = current ? Boolean(missing[current.file]) : false;
  const hasPlayable = tracks.some((track) => !missing[track.file]);

  let title = t.empty;
  let subtitle = "";
  if (catalog === "loading") {
    title = t.loading;
  } else if (current) {
    title = current.title;
    subtitle = currentMissing ? t.unavailable : current.artist;
  }

  const openSearch = () => {
    const input = document.getElementById(SEARCH_ID);
    if (!input) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    input.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "center" });
    input.focus({ preventScroll: true });
  };

  return (
    <div className="np-bar">
      <button type="button" className="np-info" onClick={openSearch} title={copy.zen.nowPlaying}>
        <span className="np-label mono">{copy.zen.nowPlaying}</span>
        <strong className="np-title">{title}</strong>
        <span className={`np-artist${currentMissing ? " is-off" : ""}`}>{subtitle}</span>
      </button>
      <div className="np-controls">
        <button type="button" className="np-skip" onClick={() => move(-1)} disabled={!hasPlayable} aria-label={t.previous}>
          <SkipBack size={16} />
        </button>
        <button
          type="button"
          className={`np-sound${playing ? " is-on" : ""}`}
          onClick={toggleSound}
          disabled={!hasPlayable}
          aria-label={playing ? t.mute : t.unmute}
        >
          {playing ? (
            <span className="np-wave" aria-hidden="true">
              {Array.from({ length: 5 }, (_, bar) => (
                <i key={bar} style={{ "--i": bar } as CSSProperties} />
              ))}
            </span>
          ) : (
            <VolumeX size={18} aria-hidden="true" />
          )}
        </button>
        <button type="button" className="np-skip" onClick={() => move(1)} disabled={!hasPlayable} aria-label={t.next}>
          <SkipForward size={16} />
        </button>
      </div>
      <span className="np-progress" aria-hidden="true">
        <ProgressFill audio={audio} />
      </span>
    </div>
  );
}

// a barra de progresso é atualizada direto no DOM, sem re-renderizar a página a cada tique
function ProgressFill({ audio }: { audio: HTMLAudioElement }) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const paint = () => {
      const node = ref.current;
      if (!node) return;
      const ratio = Number.isFinite(audio.duration) && audio.duration > 0 ? audio.currentTime / audio.duration : 0;
      node.style.transform = `scaleX(${Math.min(Math.max(ratio, 0), 1)})`;
    };
    const events = ["loadstart", "loadedmetadata", "timeupdate", "ended"] as const;
    events.forEach((name) => audio.addEventListener(name, paint));
    return () => events.forEach((name) => audio.removeEventListener(name, paint));
  }, [audio]);

  return <i ref={ref} />;
}

/* ---------- busca e lista de faixas (dentro da seção Zenify) ---------- */

export function ZenMusicPanel({ player, copy }: { player: ZenPlayer; copy: Copy }) {
  const t = copy.zen.player;
  const { tracks, catalog, index, playing, missing, playIndex } = player;
  const [query, setQuery] = useState("");
  const needle = fold(query.trim());
  const results = tracks
    .map((track, i) => ({ track, i }))
    .filter(({ track }) => !needle || fold(`${track.title} ${track.artist}`).includes(needle));

  let message = "";
  if (catalog === "loading") message = t.loading;
  else if (catalog === "error" || tracks.length === 0) message = t.empty;
  else if (results.length === 0) message = t.noResults;

  return (
    <div className="zen-player" data-reveal>
      <div className="zen-player-head">
        <label className="zen-player-search">
          <Search size={16} aria-hidden="true" />
          <input
            id={SEARCH_ID}
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={t.search}
            aria-label={t.searchLabel}
            autoComplete="off"
            spellCheck={false}
          />
        </label>
      </div>

      {results.length > 0 && (
        <ul className="zen-player-list">
          {results.map(({ track, i }) => {
            const off = Boolean(missing[track.file]);
            const current = i === index;
            return (
              <li key={`${track.file}-${i}`}>
                <button
                  type="button"
                  className={`zen-track${current ? " is-current" : ""}`}
                  onClick={() => playIndex(i)}
                  disabled={off}
                  aria-current={current ? "true" : undefined}
                >
                  <span className="zen-track-main">
                    <span className="zen-track-title">{track.title}</span>
                    <span className="zen-track-artist mono">{track.artist}</span>
                  </span>
                  <span className="zen-track-tag mono">{off ? t.unavailable : current && playing ? t.current : ""}</span>
                </button>
              </li>
            );
          })}
        </ul>
      )}

      {message && <p className="zen-player-empty mono">{message}</p>}
      <p className="zen-player-note mono">{t.note}</p>
    </div>
  );
}
