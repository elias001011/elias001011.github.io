// Textos e dados do portfólio. Tudo que muda por idioma fica aqui; o App.tsx
// só monta as seções.

const shots = import.meta.glob("./assets/projects/*/*.webp", {
  eager: true,
  query: "?url",
  import: "default",
}) as Record<string, string>;

function imagesOf(folder: string) {
  return Object.keys(shots)
    .filter((path) => path.includes(`/projects/${folder}/`))
    .sort()
    .map((path) => shots[path]);
}

function shot(folder: string, name: string) {
  return shots[`./assets/projects/${folder}/${name}.webp`];
}

export const realEstateImages = imagesOf("imobiliaria");

export const profileImage = new URL("../me.webp", import.meta.url).href;

export const profile = {
  name: "Elias J. R. Nunes",
  birthDate: new Date(2010, 1, 9),
  email: "elias.juriatti@outlook.com",
  github: "https://github.com/elias001011",
  instagram: "https://www.instagram.com/elias_jrnunes",
  linkedin:
    "https://www.linkedin.com/in/elias-nunes-b695ba406",
  connectaPortfolio: "https://connectabr.digital/portfolio/",
};

export const zenify = {
  repo: "https://github.com/elias001011/Zenify",
  download: "https://github.com/elias001011/Zenify/releases/latest",
  fallbackVersion: "v0.3.4",
  upstreamSync: "https://github.com/gokadzev/Musify/pull/1005",
  desktop: {
    home: shot("zenify", "desktop-home"),
    player: shot("zenify", "desktop-player"),
    lyrics: shot("zenify", "desktop-player-lyrics"),
    queue: shot("zenify", "desktop-queue"),
    sync: shot("zenify", "desktop-local-sync"),
    recap: shot("zenify", "desktop-recap"),
  },
  compact: {
    player: { src: shot("zenify", "narrow-player"), height: 791 },
    lyrics: { src: shot("zenify", "narrow-lyrics"), height: 761 },
  },
};

export const musify = {
  repo: "https://github.com/gokadzev/Musify",
  prs: "https://github.com/gokadzev/Musify/pulls?q=is%3Apr+author%3Aelias001011+is%3Amerged",
  // valores mínimos conferidos em 31/10/2026; o App troca pelos do GitHub quando responde
  fallback: { prs: 65, commits: 71, lines: 17, stars: 4 },
};

export const languages = [
  { id: "pt", label: "PT", name: "Português" },
  { id: "en", label: "EN", name: "English" },
  { id: "es", label: "ES", name: "Español" },
] as const;

export type LanguageId = (typeof languages)[number]["id"];

export type ProjectId =
  | "apice"
  | "musify-desktop-port"
  | "youtube-music-explode-dart"
  | "sepia-reader"
  | "meteor-landing"
  | "meteor-flutter"
  | "meteor"
  | "my-computer";

type ProjectLinks = {
  images: string[];
  live?: string;
  repo?: string;
  phone?: boolean;
};

export const projectLinks: Record<ProjectId, ProjectLinks> = {
  apice: {
    images: imagesOf("apice"),
    live: "https://apice-ai.netlify.app",
    repo: "https://github.com/elias001011/Apice",
  },
  "musify-desktop-port": {
    images: imagesOf("musify-desktop-port"),
    live: "https://github.com/elias001011/Musify-Desktop-Port/releases",
    repo: "https://github.com/elias001011/Musify-Desktop-Port",
  },
  "youtube-music-explode-dart": {
    images: imagesOf("youtube-music-explode-dart"),
    repo: "https://github.com/elias001011/youtube_music_explode_dart",
  },
  "sepia-reader": {
    images: imagesOf("sepia-reader"),
    live: "https://sepia-md.netlify.app/",
    repo: "https://github.com/elias001011/sepia-reader",
  },
  "meteor-landing": {
    images: imagesOf("meteor-landing"),
    live: "https://lp--meteor-ai.netlify.app/",
    repo: "https://github.com/elias001011/Meteor/tree/LP",
  },
  "meteor-flutter": {
    images: imagesOf("meteor-flutter"),
    repo: "https://github.com/elias001011/Meteor/tree/android",
    phone: true,
  },
  meteor: {
    images: imagesOf("meteor"),
    live: "https://meteor-ai.netlify.app",
    repo: "https://github.com/elias001011/Meteor",
  },
  "my-computer": {
    images: imagesOf("my-computer"),
    repo: "https://github.com/elias001011/my-computer",
  },
};

export type ProjectText = {
  title: string;
  tag: string;
  subtitle: string;
  description: string;
  stack: string[];
  liveLabel?: string;
};

// [texto, destaque?]: o manifesto acende palavra a palavra na rolagem.
type LitPart = [string, boolean?];

const pt = {
  locale: "pt-BR",
  nav: [
    { label: "Início", href: "#inicio" },
    { label: "Connecta", href: "#connecta" },
    { label: "Zenify", href: "#zenify" },
    { label: "Projetos", href: "#projetos" },
    { label: "Contato", href: "#contato" },
  ],
  navLabel: "Navegação principal",
  contact: "Contato",
  menuOpen: "Abrir menu",
  menuClose: "Fechar menu",
  language: "Idioma",
  palette: "Paleta",
  paletteAria: "Escolher paleta de cores e idioma",
  paletteNames: {
    green: { label: "Verde", hint: "Connecta" },
    blue: { label: "Azul", hint: "Meteor" },
    black: { label: "Preto", hint: "Limpo" },
    graphite: { label: "Grafite", hint: "Neutro" },
    cafeteria: { label: "Cafeteria", hint: "Quente" },
  } as Record<string, { label: string; hint: string }>,
  hero: {
    primary: "Ver o Zenify",
    secondary: "Falar comigo",
  },
  scene: {
    toDark: "Mudar para o tema escuro",
    toLight: "Mudar para o tema claro",
    curtain: "Cortina fechada",
    lamp: "Luz do quarto",
    stack: "Tecnologias",
    hint: "Interaja com o ambiente",
    pencils: "Lápis derrubados",
    computer: "Computador ligado",
    door: "Porta aberta",
    bed: "Cama desarrumada",
    robot: "Braço do robô levantado",
    phones: "Fone no pescoço",
  },
  manifesto: [
    ["Gosto de levar uma ideia até o fim: do primeiro esboço"],
    ["ao app instalado no aparelho de alguém.", true],
    ["Com clientes, isso acontece pela Connecta."],
    ["Nos meus projetos, o maior deles é o Zenify.", true],
  ] as LitPart[],
  connecta: {
    partner: "Sócio da Connecta BR Digital",
    link: "connectabr.digital/portfolio",
    apiceTag: "Projeto · Ápice",
  },
  musify: {
    title: "Antes do Zenify, {prs} PRs no Musify.",
    lead: "App de música open source para Android, com mais de {stars} mil estrelas no GitHub.",
    stats: ["PRs mergeados", "commits", "mil linhas"],
    highlightsTitle: "Algumas contribuições",
    highlights: [
      "Time Machine: recaps de escuta",
      "Páginas de artista do YouTube Music",
      "Mini player flutuante",
      "Importação do Spotify rápida e confiável",
      "Controles de mídia nativos no Windows e no Linux",
      "Retomada de mídia no Android",
      "Acessibilidade e tradução pt-BR",
      "Local Sync: sincronização entre aparelhos pela rede local (criado no Musify Desktop Port)",
    ],
    feed: "Commits recentes",
    loading: "Carregando atividade recente...",
    error: "O GitHub limitou as chamadas anônimas agora. Os PRs estão no link abaixo.",
    prs: "Ver meus PRs",
    prsTitle: "PRs recentes",
    prsLoading: "Carregando PRs...",
    prsError: "Não foi possível carregar os PRs agora. Veja todos no GitHub.",
    prsAll: "Ver todos no GitHub",
    repo: "Repositório do Musify",
  },
  projects: {
    title: "Outros projetos meus.",
    meteorTitle: "Meteor",
    meteorText: "Um ecossistema de clima com IA: landing, app Android em Flutter e a versão web.",
    moreTitle: "E mais",
    live: "Ao vivo",
    repo: "Código",
    view: "Ver",
  },
  contactSection: {
    title: "Vamos conversar.",
    text: "Para vagas, freelas, parcerias ou feedback nos projetos.",
  },
  footer: {
    rights: "Todos os direitos reservados.",
    top: "Voltar ao topo",
  },
  gallery: {
    open: "Abrir galeria de",
    close: "Fechar",
    previous: "Imagem anterior",
    next: "Próxima imagem",
    image: "imagem",
  },
};

export type Copy = typeof pt;

const en: Copy = {
  locale: "en",
  nav: [
    { label: "Home", href: "#inicio" },
    { label: "Connecta", href: "#connecta" },
    { label: "Zenify", href: "#zenify" },
    { label: "Projects", href: "#projetos" },
    { label: "Contact", href: "#contato" },
  ],
  navLabel: "Main navigation",
  contact: "Contact",
  menuOpen: "Open menu",
  menuClose: "Close menu",
  language: "Language",
  palette: "Palette",
  paletteAria: "Choose colour palette and language",
  paletteNames: {
    green: { label: "Green", hint: "Connecta" },
    blue: { label: "Blue", hint: "Meteor" },
    black: { label: "Black", hint: "Clean" },
    graphite: { label: "Graphite", hint: "Neutral" },
    cafeteria: { label: "Cafeteria", hint: "Warm" },
  },
  hero: {
    primary: "See Zenify",
    secondary: "Contact me",
  },
  scene: {
    toDark: "Switch to the dark theme",
    toLight: "Switch to the light theme",
    curtain: "Curtains closed",
    lamp: "Room light",
    stack: "Technologies",
    hint: "Interact with the room",
    pencils: "Pencils knocked over",
    computer: "Computer on",
    door: "Door open",
    bed: "Bed unmade",
    robot: "Robot arm raised",
    phones: "Headphones around the neck",
  },
  manifesto: [
    ["I like taking an idea all the way: from the first sketch"],
    ["to the app installed on someone's device.", true],
    ["With clients, that happens through Connecta."],
    ["Among my own projects, the biggest is Zenify.", true],
  ],
  connecta: {
    partner: "Partner at Connecta BR Digital",
    link: "connectabr.digital/portfolio",
    apiceTag: "Project · Ápice",
  },
  musify: {
    title: "Before Zenify, {prs} PRs in Musify.",
    lead: "An open-source music app for Android with over {stars},000 stars on GitHub.",
    stats: ["merged PRs", "commits", "k lines"],
    highlightsTitle: "Some contributions",
    highlights: [
      "Time Machine listening recaps",
      "YouTube Music artist pages",
      "Floating mini player",
      "Fast, reliable Spotify import",
      "Native media controls on Windows and Linux",
      "Android media resumption",
      "Accessibility and pt-BR translation",
      "Local Sync: syncing between devices over the local network (created in Musify Desktop Port)",
    ],
    feed: "Recent commits",
    loading: "Loading recent activity...",
    error: "GitHub is rate-limiting anonymous calls right now. The PRs are at the link below.",
    prs: "See my PRs",
    prsTitle: "Recent PRs",
    prsLoading: "Loading PRs...",
    prsError: "Couldn't load PRs right now. See all on GitHub.",
    prsAll: "See all on GitHub",
    repo: "Musify repository",
  },
  projects: {
    title: "More of my projects.",
    meteorTitle: "Meteor",
    meteorText: "An AI weather ecosystem: landing page, Android app in Flutter and the web version.",
    moreTitle: "And more",
    live: "Live",
    repo: "Code",
    view: "View",
  },
  contactSection: {
    title: "Let's talk.",
    text: "For roles, freelance work, partnerships or feedback on the projects.",
  },
  footer: {
    rights: "All rights reserved.",
    top: "Back to top",
  },
  gallery: {
    open: "Open gallery for",
    close: "Close",
    previous: "Previous image",
    next: "Next image",
    image: "image",
  },
};

const es: Copy = {
  locale: "es",
  nav: [
    { label: "Inicio", href: "#inicio" },
    { label: "Connecta", href: "#connecta" },
    { label: "Zenify", href: "#zenify" },
    { label: "Proyectos", href: "#projetos" },
    { label: "Contacto", href: "#contato" },
  ],
  navLabel: "Navegación principal",
  contact: "Contacto",
  menuOpen: "Abrir menú",
  menuClose: "Cerrar menú",
  language: "Idioma",
  palette: "Paleta",
  paletteAria: "Elegir paleta de colores e idioma",
  paletteNames: {
    green: { label: "Verde", hint: "Connecta" },
    blue: { label: "Azul", hint: "Meteor" },
    black: { label: "Negro", hint: "Limpio" },
    graphite: { label: "Grafito", hint: "Neutro" },
    cafeteria: { label: "Cafetería", hint: "Cálido" },
  },
  hero: {
    primary: "Ver Zenify",
    secondary: "Contactarme",
  },
  scene: {
    toDark: "Cambiar al tema oscuro",
    toLight: "Cambiar al tema claro",
    curtain: "Cortina cerrada",
    lamp: "Luz del cuarto",
    stack: "Tecnologías",
    hint: "Interactúa con el ambiente",
    pencils: "Lápices caídos",
    computer: "Computadora encendida",
    door: "Puerta abierta",
    bed: "Cama deshecha",
    robot: "Brazo del robot levantado",
    phones: "Auriculares en el cuello",
  },
  manifesto: [
    ["Me gusta llevar una idea hasta el final: del primer boceto"],
    ["a la app instalada en el dispositivo de alguien.", true],
    ["Con clientes, eso pasa por Connecta."],
    ["En mis proyectos, el más grande es Zenify.", true],
  ],
  connecta: {
    partner: "Socio de Connecta BR Digital",
    link: "connectabr.digital/portfolio",
    apiceTag: "Proyecto · Ápice",
  },
  musify: {
    title: "Antes de Zenify, {prs} PRs en Musify.",
    lead: "App de música open source para Android, con más de {stars} mil estrellas en GitHub.",
    stats: ["PRs aceptados", "commits", "mil líneas"],
    highlightsTitle: "Algunas contribuciones",
    highlights: [
      "Time Machine: resúmenes de escucha",
      "Páginas de artista de YouTube Music",
      "Mini player flotante",
      "Importación de Spotify rápida y confiable",
      "Controles multimedia nativos en Windows y Linux",
      "Reanudación multimedia en Android",
      "Accesibilidad y traducción pt-BR",
      "Local Sync: sincronización entre dispositivos por la red local (creado en Musify Desktop Port)",
    ],
    feed: "Commits recientes",
    loading: "Cargando actividad reciente...",
    error: "GitHub está limitando las llamadas anónimas ahora. Los PRs están en el enlace de abajo.",
    prs: "Ver mis PRs",
    prsTitle: "PRs recientes",
    prsLoading: "Cargando PRs...",
    prsError: "No se pudieron cargar los PRs ahora. Míralos todos en GitHub.",
    prsAll: "Ver todos en GitHub",
    repo: "Repositorio de Musify",
  },
  projects: {
    title: "Otros proyectos míos.",
    meteorTitle: "Meteor",
    meteorText: "Un ecosistema de clima con IA: landing, app Android en Flutter y la versión web.",
    moreTitle: "Y más",
    live: "En vivo",
    repo: "Código",
    view: "Ver",
  },
  contactSection: {
    title: "Hablemos.",
    text: "Para oportunidades, freelas, alianzas o feedback sobre los proyectos.",
  },
  footer: {
    rights: "Todos los derechos reservados.",
    top: "Volver arriba",
  },
  gallery: {
    open: "Abrir galería de",
    close: "Cerrar",
    previous: "Imagen anterior",
    next: "Siguiente imagen",
    image: "imagen",
  },
};

export const siteCopy: Record<LanguageId, Copy> = { pt, en, es };

export const projectText: Record<LanguageId, Record<ProjectId, ProjectText>> = {
  pt: {
    apice: {
      title: "Ápice",
      tag: "Plataforma de estudos",
      subtitle: "Estudos para o ENEM movidos por IA.",
      description: "Corretor de redação, simulados, radar de temas e um professor IA, com contas e conquistas.",
      stack: ["React", "Vite", "Netlify Functions", "Gemini", "Groq"],
    },
    "musify-desktop-port": {
      title: "Musify Desktop Port",
      tag: "Port desktop",
      subtitle: "O Musify no Windows e no Linux.",
      description: "Downstream que mantém o app original intacto e adiciona targets desktop, playback com media_kit, pacotes instaláveis e updater pelas releases.",
      stack: ["Flutter", "media_kit", "Windows", "Linux", "GitHub Actions"],
      liveLabel: "Downloads",
    },
    "youtube-music-explode-dart": {
      title: "youtube_music_explode_dart",
      tag: "Biblioteca Dart",
      subtitle: "Client para a API InnerTube do YouTube Music.",
      description: "Artistas, discografia, top songs e busca sem scraping de HTML. Usada em produção pelo Musify e pelo Zenify.",
      stack: ["Dart", "InnerTube", "WEB_REMIX"],
    },
    "sepia-reader": {
      title: "Sépia",
      tag: "App Flutter",
      subtitle: "Leitor, biblioteca e editor de Markdown sem distrações.",
      description: "Modo leitura com marcadores presos ao texto, leitura em voz alta com vozes neurais offline (Piper e Kokoro), editor com atalhos e biblioteca local com pastas e busca. Android, iOS, Linux e Web na mesma base.",
      stack: ["Flutter", "Dart", "sherpa-onnx", "Markdown", "Material 3"],
    },
    "meteor-landing": {
      title: "Landing page",
      tag: "Meteor · Web",
      subtitle: "A apresentação do ecossistema.",
      description: "Narrativa em slides com scroll pinning, galerias e contexto sobre alertas climáticos no RS.",
      stack: ["React", "GSAP", "Framer Motion"],
    },
    "meteor-flutter": {
      title: "App Flutter",
      tag: "Meteor · Android",
      subtitle: "O Meteor nativo no Android.",
      description: "Home em cards, mapa, notícias, assistente IA, tema AMOLED e push via FCM, usando o mesmo BFF da web.",
      stack: ["Flutter", "Firebase", "FCM"],
    },
    meteor: {
      title: "Versão web",
      tag: "Meteor · PWA",
      subtitle: "Clima em tempo real com IA.",
      description: "PWA com assistente contextual, alertas, várias fontes de dados e BFF em Netlify Functions protegendo as chaves.",
      stack: ["React", "TypeScript", "Gemini", "Netlify"],
    },
    "my-computer": {
      title: "My Computer",
      tag: "Self-hosted",
      subtitle: "Painel local para conversar com IA e usar tools do terminal com aprovação.",
      description: "",
      stack: ["Node.js", "CLI", "Ollama"],
    },
  },
  en: {
    apice: {
      title: "Ápice",
      tag: "Study platform",
      subtitle: "AI-powered study for Brazil's ENEM exam.",
      description: "Essay grader, mock exams, a topic radar and an AI tutor, with accounts and achievements.",
      stack: ["React", "Vite", "Netlify Functions", "Gemini", "Groq"],
    },
    "musify-desktop-port": {
      title: "Musify Desktop Port",
      tag: "Desktop port",
      subtitle: "Musify on Windows and Linux.",
      description: "A downstream that keeps the original app intact and adds desktop targets, media_kit playback, installable packages and release-based updates.",
      stack: ["Flutter", "media_kit", "Windows", "Linux", "GitHub Actions"],
      liveLabel: "Downloads",
    },
    "youtube-music-explode-dart": {
      title: "youtube_music_explode_dart",
      tag: "Dart library",
      subtitle: "A client for YouTube Music's InnerTube API.",
      description: "Artists, discography, top songs and search with no HTML scraping. Used in production by Musify and Zenify.",
      stack: ["Dart", "InnerTube", "WEB_REMIX"],
    },
    "sepia-reader": {
      title: "Sépia",
      tag: "Flutter app",
      subtitle: "A distraction-free Markdown reader, library and editor.",
      description: "Reading mode with text-anchored bookmarks, read-aloud with offline neural voices (Piper and Kokoro), a shortcut-driven editor and a local library with folders and search. Android, iOS, Linux and Web from one codebase.",
      stack: ["Flutter", "Dart", "sherpa-onnx", "Markdown", "Material 3"],
    },
    "meteor-landing": {
      title: "Landing page",
      tag: "Meteor · Web",
      subtitle: "The ecosystem's presentation.",
      description: "Slide-based storytelling with scroll pinning, galleries and context on climate alerts in southern Brazil.",
      stack: ["React", "GSAP", "Framer Motion"],
    },
    "meteor-flutter": {
      title: "Flutter app",
      tag: "Meteor · Android",
      subtitle: "Meteor, native on Android.",
      description: "Card-based home, map, news, AI assistant, AMOLED theme and FCM push, sharing the web's BFF.",
      stack: ["Flutter", "Firebase", "FCM"],
    },
    meteor: {
      title: "Web version",
      tag: "Meteor · PWA",
      subtitle: "Real-time weather with AI.",
      description: "A PWA with a contextual assistant, alerts, multiple data sources and a Netlify Functions BFF guarding the keys.",
      stack: ["React", "TypeScript", "Gemini", "Netlify"],
    },
    "my-computer": {
      title: "My Computer",
      tag: "Self-hosted",
      subtitle: "A local panel to chat with AI and run terminal tools with approval.",
      description: "",
      stack: ["Node.js", "CLI", "Ollama"],
    },
  },
  es: {
    apice: {
      title: "Ápice",
      tag: "Plataforma de estudio",
      subtitle: "Estudio para el ENEM impulsado por IA.",
      description: "Corrector de redacción, simulacros, radar de temas y un profesor IA, con cuentas y logros.",
      stack: ["React", "Vite", "Netlify Functions", "Gemini", "Groq"],
    },
    "musify-desktop-port": {
      title: "Musify Desktop Port",
      tag: "Port de escritorio",
      subtitle: "Musify en Windows y Linux.",
      description: "Un downstream que mantiene intacta la app original y suma targets de escritorio, reproducción con media_kit, paquetes instalables y actualizaciones por releases.",
      stack: ["Flutter", "media_kit", "Windows", "Linux", "GitHub Actions"],
      liveLabel: "Descargas",
    },
    "youtube-music-explode-dart": {
      title: "youtube_music_explode_dart",
      tag: "Biblioteca Dart",
      subtitle: "Client para la API InnerTube de YouTube Music.",
      description: "Artistas, discografía, top songs y búsqueda sin scraping de HTML. Usada en producción por Musify y Zenify.",
      stack: ["Dart", "InnerTube", "WEB_REMIX"],
    },
    "sepia-reader": {
      title: "Sépia",
      tag: "App Flutter",
      subtitle: "Lector, biblioteca y editor de Markdown sin distracciones.",
      description: "Modo lectura con marcadores anclados al texto, lectura en voz alta con voces neuronales offline (Piper y Kokoro), editor con atajos y biblioteca local con carpetas y búsqueda. Android, iOS, Linux y Web con la misma base.",
      stack: ["Flutter", "Dart", "sherpa-onnx", "Markdown", "Material 3"],
    },
    "meteor-landing": {
      title: "Landing page",
      tag: "Meteor · Web",
      subtitle: "La presentación del ecosistema.",
      description: "Narrativa en slides con scroll pinning, galerías y contexto sobre alertas climáticas en el sur de Brasil.",
      stack: ["React", "GSAP", "Framer Motion"],
    },
    "meteor-flutter": {
      title: "App Flutter",
      tag: "Meteor · Android",
      subtitle: "Meteor nativo en Android.",
      description: "Home en tarjetas, mapa, noticias, asistente IA, tema AMOLED y push vía FCM, con el mismo BFF de la web.",
      stack: ["Flutter", "Firebase", "FCM"],
    },
    meteor: {
      title: "Versión web",
      tag: "Meteor · PWA",
      subtitle: "Clima en tiempo real con IA.",
      description: "PWA con asistente contextual, alertas, varias fuentes de datos y BFF en Netlify Functions que protege las claves.",
      stack: ["React", "TypeScript", "Gemini", "Netlify"],
    },
    "my-computer": {
      title: "My Computer",
      tag: "Self-hosted",
      subtitle: "Panel local para conversar con IA y usar herramientas del terminal con aprobación.",
      description: "",
      stack: ["Node.js", "CLI", "Ollama"],
    },
  },
};
