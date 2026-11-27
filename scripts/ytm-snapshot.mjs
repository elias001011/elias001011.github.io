// Grava uma amostra da busca do YouTube Music (InnerTube WEB_REMIX, a mesma API
// que o youtube_music_explode_dart usa) em src/data/ytm-sample.json.
// O navegador não pode chamar o InnerTube de outra origem, então a demo do site
// busca nesta amostra. Rodar: node scripts/ytm-snapshot.mjs
import { writeFile, mkdir } from "node:fs/promises";

const QUERIES = [
  "Daft Punk", "Tame Impala", "Arctic Monkeys", "The Weeknd", "Radiohead", "Gorillaz",
  "Djavan", "Jorge Ben Jor", "Tim Maia", "Legião Urbana", "Marisa Monte", "Racionais MC's",
  "Kendrick Lamar", "Billie Eilish", "Queen", "Pink Floyd",
];

const KINDS = { Song: "song", Artist: "artist", Album: "album", Single: "album", EP: "album" };
const text = (runs) => (runs ?? []).map((run) => run.text).join("");

async function search(query) {
  const response = await fetch("https://music.youtube.com/youtubei/v1/search?prettyPrint=false", {
    method: "POST",
    headers: { "Content-Type": "application/json", "User-Agent": "Mozilla/5.0" },
    body: JSON.stringify({
      context: { client: { clientName: "WEB_REMIX", clientVersion: "1.20240101.01.00", hl: "en", gl: "US" } },
      query,
    }),
  });
  if (!response.ok) throw new Error(`${query}: HTTP ${response.status}`);
  const data = await response.json();
  const found = [];
  const walk = (node) => {
    if (!node || typeof node !== "object") return;
    if (Array.isArray(node)) return node.forEach(walk);
    const top = node.musicCardShelfRenderer;
    if (top) {
      const parts = text(top.subtitle?.runs).split(" • ");
      if (KINDS[parts[0]]) found.push({ kind: KINDS[parts[0]], title: text(top.title?.runs), parts: parts.slice(1) });
    }
    const item = node.musicResponsiveListItemRenderer;
    if (item) {
      const columns = (item.flexColumns ?? []).map((column) => text(column.musicResponsiveListItemFlexColumnRenderer?.text?.runs));
      const parts = (columns[1] ?? "").split(" • ");
      if (KINDS[parts[0]] && columns[0]) found.push({ kind: KINDS[parts[0]], title: columns[0], parts: parts.slice(1) });
    }
    Object.values(node).forEach(walk);
  };
  walk(data);
  return found;
}

const seen = new Set();
const items = [];
for (const query of QUERIES) {
  const results = await search(query);
  const quota = { artist: 1, song: 5, album: 3 };
  for (const result of results) {
    if (!quota[result.kind]) continue;
    const by = result.kind === "artist" ? "" : (result.parts[0] ?? "");
    // só o que é do próprio artista buscado, para a amostra ficar coerente
    if (result.kind === "artist" ? result.title.toLowerCase() !== query.toLowerCase() : !by.toLowerCase().includes(query.toLowerCase())) continue;
    const key = `${result.kind}|${result.title}|${by}`.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    quota[result.kind] -= 1;
    const last = result.parts[result.parts.length - 1] ?? "";
    items.push({
      kind: result.kind,
      title: result.title,
      artist: result.kind === "artist" ? result.title : by,
      detail: result.kind === "artist" ? last : result.kind === "song" ? result.parts.slice(1).join(" · ") : last,
    });
  }
  console.log(query, "→", items.length);
}

await mkdir(new URL("../src/data/", import.meta.url), { recursive: true });
await writeFile(
  new URL("../src/data/ytm-sample.json", import.meta.url),
  JSON.stringify({ capturedAt: new Date().toISOString().slice(0, 10), items }, null, 1) + "\n",
);
console.log("ok:", items.length, "itens");
