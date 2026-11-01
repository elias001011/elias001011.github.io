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

export const profileImage = new URL("../me.webp", import.meta.url).href;

export const profile = {
  name: "Elias J. R. Nunes",
  birthDate: new Date(2010, 1, 9),
  email: "elias.juriatti@outlook.com",
  github: "https://github.com/elias001011",
  instagram: "https://www.instagram.com/elias_jrnunes",
  linkedin:
    "https://www.linkedin.com/in/elias-nunes-b695ba406?utm_source=share_via&utm_content=profile&utm_medium=member_android",
  connectaPortfolio: "https://connectabr.digital/portfolio/",
};

export const zenify = {
  repo: "https://github.com/elias001011/Zenify",
  download: "https://github.com/elias001011/Zenify/releases/latest",
  fallbackVersion: "v0.2.0",
  desktop: {
    home: shot("zenify", "desktop-home"),
    moods: shot("zenify", "desktop-moods"),
    player: shot("zenify", "desktop-player-lyrics"),
    playlist: shot("zenify", "desktop-playlist"),
    library: shot("zenify", "desktop-library"),
  },
  mobile: [
    { key: "home", src: shot("zenify", "mobile-home") },
    { key: "moods", src: shot("zenify", "mobile-moods") },
    { key: "library", src: shot("zenify", "mobile-library") },
    { key: "playlist", src: shot("zenify", "mobile-playlist") },
    { key: "player", src: shot("zenify", "mobile-player") },
  ],
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
  hero: {
    primary: "Ver o Zenify",
    secondary: "Falar comigo",
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
  zen: {
    tagline: "Um app de música calmo e moderno.",
    lead: "Nasceu de um fork do Musify, o app em que eu já contribuía, e foi além no desktop, no visual e no sync entre aparelhos.",
    download: "Baixar o Zenify",
    code: "Código no GitHub",
    latest: "Versão",
    platforms: ["Android", "Linux", "Windows"],
    showcaseAlt: "Tela inicial do Zenify no desktop",
    originTitle: "De contribuidor a criador.",
    origin: [
      {
        date: "Mar 2026",
        title: "Contribuidor do Musify",
        text: "{prs} PRs mergeados no app original: Time Machine, páginas de artista, mini player flutuante, importação do Spotify.",
      },
      {
        date: "Mai 2026",
        title: "Musify Desktop Port",
        text: "Onde o suporte a Windows e Linux, o Local Sync e o empacotamento nasceram e foram testados.",
      },
      {
        date: "Out 2026",
        title: "Zenify",
        text: "Fork com identidade própria, releases para três plataformas e updater embutido.",
      },
    ],
    featuresTitle: "O que o Zenify faz diferente.",
    features: [
      {
        title: "Visual novo",
        text: "Ilha flutuante, dock e trilho no desktop. Sólido, translúcido ou desfocado, com um fundo dinâmico nas cores dos seus álbuns.",
      },
      {
        title: "Player novo",
        text: "Letras e fila ao lado da capa, ondas sonoras que seguem a música e uma barra de ações flutuante.",
      },
      {
        title: "Moods e Mix",
        text: "Mix pessoal, moods e playlists feitas para você, com ajuste de gosto, gêneros excluídos e artistas bloqueados.",
      },
      {
        title: "Local Sync",
        text: "Android, Linux e Windows sincronizados pelo Wi-Fi, com PIN e criptografia. Sem conta e sem servidor.",
      },
      {
        title: "Downloads de verdade",
        text: "Uma fila só, três por vez, com progresso, falhas explicadas e tentar de novo.",
      },
      {
        title: "Desktop de primeira",
        text: "Escala da interface, barra de título nas cores do app, atalhos remapeáveis e pasta de downloads.",
      },
    ],
    phonesTitle: "No celular, o mesmo app.",
    phones: {
      home: "Início",
      moods: "Moods",
      library: "Biblioteca",
      playlist: "Playlist",
      player: "Player",
    } as Record<string, string>,
    marquee: ["Moods", "Mix pessoal", "Local Sync", "Letras sincronizadas", "Ondas sonoras", "Fundo dinâmico", "Gerenciador de downloads", "Atalhos remapeáveis", "Time Machine", "Rádios"],
    nowPlaying: "Tocando agora",
    compareTitle: "Musify × Zenify",
    compare: [
      ["Plataformas", "Android e builds desktop", "Android, Linux e Windows com .deb, instalador e portátil"],
      ["Interface", "App bars e navegação inferior", "Ilha flutuante, dock e trilho; fundo dinâmico"],
      ["Player", "Cartão que vira para as letras", "Letras e fila integradas, ondas sonoras"],
      ["Aparelhos", "Backup e restauração", "Local Sync pelo Wi-Fi entre os três sistemas"],
      ["Biblioteca", "Seções", "Filtros, busca própria e seleção múltipla"],
    ],
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
    ],
    feed: "Commits recentes",
    loading: "Carregando atividade recente...",
    error: "O GitHub limitou as chamadas anônimas agora. Os PRs estão no link abaixo.",
    prs: "Ver meus PRs",
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
  hero: {
    primary: "See Zenify",
    secondary: "Contact me",
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
  zen: {
    tagline: "A calm, modern music app.",
    lead: "Born as a fork of Musify, the app I was already contributing to, and taken further on desktop, design and syncing between devices.",
    download: "Download Zenify",
    code: "Code on GitHub",
    latest: "Version",
    platforms: ["Android", "Linux", "Windows"],
    showcaseAlt: "Zenify home screen on desktop",
    originTitle: "From contributor to creator.",
    origin: [
      {
        date: "Mar 2026",
        title: "Musify contributor",
        text: "{prs} merged PRs in the original app: Time Machine, artist pages, floating mini player, Spotify import.",
      },
      {
        date: "May 2026",
        title: "Musify Desktop Port",
        text: "Where Windows and Linux support, Local Sync and packaging were first built and tested.",
      },
      {
        date: "Oct 2026",
        title: "Zenify",
        text: "A fork with its own identity, releases for three platforms and a built-in updater.",
      },
    ],
    featuresTitle: "What Zenify does differently.",
    features: [
      {
        title: "A new look",
        text: "Floating island, dock and desktop rail. Solid, translucent or blurred, with a dynamic background in your albums' colours.",
      },
      {
        title: "A new player",
        text: "Lyrics and queue beside the artwork, sound waves that follow the music and a floating action bar.",
      },
      {
        title: "Moods and Mix",
        text: "A personal Mix, moods and playlists made for you, with taste tuning, excluded genres and blocked artists.",
      },
      {
        title: "Local Sync",
        text: "Android, Linux and Windows in sync over Wi-Fi, with a PIN and encryption. No account, no server.",
      },
      {
        title: "Real downloads",
        text: "One queue, three at a time, with progress, explained failures and retry.",
      },
      {
        title: "First-class desktop",
        text: "Interface scale, a title bar in the app's colours, remappable shortcuts and a downloads folder.",
      },
    ],
    phonesTitle: "On a phone, the same app.",
    phones: {
      home: "Home",
      moods: "Moods",
      library: "Library",
      playlist: "Playlist",
      player: "Player",
    },
    marquee: ["Moods", "Personal Mix", "Local Sync", "Synced lyrics", "Sound waves", "Dynamic background", "Download manager", "Remappable shortcuts", "Time Machine", "Radios"],
    nowPlaying: "Now playing",
    compareTitle: "Musify × Zenify",
    compare: [
      ["Platforms", "Android, desktop builds", "Android, Linux and Windows with .deb, installer and portable"],
      ["Interface", "App bars and bottom navigation", "Floating island, dock and rail; dynamic background"],
      ["Player", "Flip card with lyrics", "Integrated lyrics and queue, sound waves"],
      ["Devices", "Backup and restore", "Local Sync over Wi-Fi across all three systems"],
      ["Library", "Sections", "Filters, its own search and multi-selection"],
    ],
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
    ],
    feed: "Recent commits",
    loading: "Loading recent activity...",
    error: "GitHub is rate-limiting anonymous calls right now. The PRs are at the link below.",
    prs: "See my PRs",
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
  hero: {
    primary: "Ver Zenify",
    secondary: "Contactarme",
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
  zen: {
    tagline: "Una app de música tranquila y moderna.",
    lead: "Nació como un fork de Musify, la app en la que ya contribuía, y fue más allá en escritorio, diseño y sincronización entre dispositivos.",
    download: "Descargar Zenify",
    code: "Código en GitHub",
    latest: "Versión",
    platforms: ["Android", "Linux", "Windows"],
    showcaseAlt: "Pantalla de inicio de Zenify en escritorio",
    originTitle: "De colaborador a creador.",
    origin: [
      {
        date: "Mar 2026",
        title: "Colaborador de Musify",
        text: "{prs} PRs aceptados en la app original: Time Machine, páginas de artista, mini player flotante, importación de Spotify.",
      },
      {
        date: "May 2026",
        title: "Musify Desktop Port",
        text: "Donde el soporte para Windows y Linux, Local Sync y el empaquetado nacieron y se probaron.",
      },
      {
        date: "Oct 2026",
        title: "Zenify",
        text: "Un fork con identidad propia, releases para tres plataformas y actualizador integrado.",
      },
    ],
    featuresTitle: "Lo que Zenify hace diferente.",
    features: [
      {
        title: "Nuevo diseño",
        text: "Isla flotante, dock y riel en escritorio. Sólido, translúcido o desenfocado, con un fondo dinámico en los colores de tus álbumes.",
      },
      {
        title: "Nuevo reproductor",
        text: "Letras y cola junto a la portada, ondas sonoras que siguen la música y una barra de acciones flotante.",
      },
      {
        title: "Moods y Mix",
        text: "Mix personal, moods y playlists hechas para ti, con ajuste de gustos, géneros excluidos y artistas bloqueados.",
      },
      {
        title: "Local Sync",
        text: "Android, Linux y Windows sincronizados por Wi-Fi, con PIN y cifrado. Sin cuenta y sin servidor.",
      },
      {
        title: "Descargas de verdad",
        text: "Una sola cola, tres a la vez, con progreso, fallos explicados y reintentar.",
      },
      {
        title: "Escritorio de primera",
        text: "Escala de la interfaz, barra de título en los colores de la app, atajos configurables y carpeta de descargas.",
      },
    ],
    phonesTitle: "En el celular, la misma app.",
    phones: {
      home: "Inicio",
      moods: "Moods",
      library: "Biblioteca",
      playlist: "Playlist",
      player: "Reproductor",
    },
    marquee: ["Moods", "Mix personal", "Local Sync", "Letras sincronizadas", "Ondas sonoras", "Fondo dinámico", "Gestor de descargas", "Atajos configurables", "Time Machine", "Radios"],
    nowPlaying: "Sonando ahora",
    compareTitle: "Musify × Zenify",
    compare: [
      ["Plataformas", "Android y builds de escritorio", "Android, Linux y Windows con .deb, instalador y portable"],
      ["Interfaz", "App bars y navegación inferior", "Isla flotante, dock y riel; fondo dinámico"],
      ["Reproductor", "Tarjeta que gira a las letras", "Letras y cola integradas, ondas sonoras"],
      ["Dispositivos", "Copia y restauración", "Local Sync por Wi-Fi entre los tres sistemas"],
      ["Biblioteca", "Secciones", "Filtros, búsqueda propia y selección múltiple"],
    ],
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
    ],
    feed: "Commits recientes",
    loading: "Cargando actividad reciente...",
    error: "GitHub está limitando las llamadas anónimas ahora. Los PRs están en el enlace de abajo.",
    prs: "Ver mis PRs",
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
