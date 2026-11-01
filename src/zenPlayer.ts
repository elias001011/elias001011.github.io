import { useCallback, useEffect, useRef, useState } from "react";

// Catálogo local: public/music/tracks.json. Nada toca de fora do site.
// Cada faixa precisa de licença e página de origem registradas; sem isso ela é ignorada.
export type ZenTrack = {
  title: string;
  artist: string;
  file: string;
  license: string;
  source: string;
};

const safeFile = /^[\w.-]+$/;

const isTrack = (value: unknown): value is ZenTrack => {
  if (!value || typeof value !== "object") return false;
  const track = value as Record<string, unknown>;
  return (
    ["title", "artist", "file", "license", "source"].every((key) => typeof track[key] === "string" && track[key]) &&
    safeFile.test(track.file as string)
  );
};

const musicUrl = (name: string) => `${import.meta.env.BASE_URL}music/${name}`;

// O player começa mudo e parado. Ligar o som toca; silenciar pausa.
export function useZenPlayer() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const barRef = useRef<HTMLSpanElement | null>(null);
  const [tracks, setTracks] = useState<ZenTrack[]>([]);
  const [index, setIndex] = useState(0);
  const [on, setOn] = useState(false);

  useEffect(() => {
    let alive = true;
    fetch(musicUrl("tracks.json"))
      .then((response) => (response.ok ? response.json() : []))
      .then((list: unknown) => {
        if (alive && Array.isArray(list)) setTracks(list.filter(isTrack));
      })
      .catch(() => {});
    return () => {
      alive = false;
      audioRef.current?.pause();
    };
  }, []);

  const load = useCallback(
    (audio: HTMLAudioElement, next: number) => {
      const track = tracks[next];
      if (!track) return false;
      const url = new URL(musicUrl(track.file), window.location.href).href;
      if (audio.src !== url) audio.src = url;
      return true;
    },
    [tracks],
  );

  const toggle = useCallback(() => {
    const audio = audioRef.current;
    if (!audio || tracks.length === 0) return;

    if (on) {
      audio.pause();
      audio.muted = true;
      setOn(false);
      return;
    }

    if (!load(audio, index)) return;
    audio.muted = false;
    setOn(true);
    audio.play().catch(() => {
      audio.muted = true;
      setOn(false);
    });
  }, [index, load, on, tracks.length]);

  // terminou: segue para a próxima faixa da lista (a lista de uma faixa só repete)
  const onEnded = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const next = (index + 1) % tracks.length;
    setIndex(next);
    if (load(audio, next)) audio.play().catch(() => setOn(false));
  }, [index, load, tracks.length]);

  const onTime = useCallback(() => {
    const audio = audioRef.current;
    const bar = barRef.current;
    if (!audio || !bar || !audio.duration) return;
    bar.style.setProperty("--progress", `${((audio.currentTime / audio.duration) * 100).toFixed(2)}%`);
  }, []);

  return { audioRef, barRef, on, ready: tracks.length > 0, track: tracks[index], toggle, onEnded, onTime, onFail: () => setOn(false) };
}
