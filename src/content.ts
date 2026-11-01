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
  stats: { prs: 65, commits: 71, lines: 17 },
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
  | "my-computer"
  | "sync-my-music";

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
  "sync-my-music": {
    images: [],
    repo: "https://github.com/elias001011/sync-my-music",
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
  theme: "Alternar tema claro e escuro",
  language: "Trocar idioma",
  hero: {
    eyebrow: (age: number) => `Sarandi, RS · ${age} anos · Full stack`,
    lead: "Construo produtos inteiros: interface, backend, apps em Flutter, empacotamento e deploy. Sócio da Connecta e criador do Zenify.",
    primary: "Ver o Zenify",
    secondary: "Falar comigo",
    scroll: "role",
    avatarAlt: "Elias J. R. Nunes com seu gato",
  },
  manifesto: [
    ["Gosto de levar uma ideia até o fim: do primeiro esboço"],
    ["ao app instalado no aparelho de alguém.", true],
    ["Com clientes, isso acontece pela Connecta."],
    ["Nos meus projetos, o maior deles é o Zenify.", true],
  ] as LitPart[],
  connecta: {
    index: "01 — Connecta",
    partner: "Sócio da Connecta BR Digital",
    link: "connectabr.digital/portfolio",
    apiceTag: "Projeto · Ápice",
  },
  zen: {
    index: "02 — O projeto",
    kicker: "Meu projeto principal",
    tagline: "Um app de música calmo e moderno.",
    lead: "O Zenify nasceu de um fork do Musify, o app open source em que eu já contribuía. Virou uma community edition: mantém o código, os recursos e a licença do original, e vai além no desktop, no visual e no sync entre aparelhos.",
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
        text: "65 PRs mergeados no app original: Time Machine, páginas de artista, mini player flutuante, importação do Spotify.",
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
    index: "03 — Open source",
    title: "Antes do Zenify, 65 PRs no Musify.",
    lead: "O Musify é um app de streaming de música open source para Android, com mais de 4 mil estrelas no GitHub. Lá eu aprendi o código por dentro, corrigindo e criando recursos que todo mundo usa.",
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
    index: "04 — Projetos",
    title: "Outros projetos meus.",
    meteorTitle: "Meteor",
    meteorText: "Um ecossistema de clima com IA: landing, app Android em Flutter e a versão web.",
    moreTitle: "E mais",
    live: "Ao vivo",
    repo: "Código",
    view: "Ver",
    soon: "Em desenvolvimento",
  },
  contactSection: {
    index: "05 — Contato",
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
  theme: "Toggle light and dark theme",
  language: "Change language",
  hero: {
    eyebrow: (age: number) => `Sarandi, Brazil · ${age} years old · Full stack`,
    lead: "I build whole products: interface, backend, Flutter apps, packaging and deployment. Partner at Connecta and creator of Zenify.",
    primary: "See Zenify",
    secondary: "Contact me",
    scroll: "scroll",
    avatarAlt: "Elias J. R. Nunes with his cat",
  },
  manifesto: [
    ["I like taking an idea all the way: from the first sketch"],
    ["to the app installed on someone's device.", true],
    ["With clients, that happens through Connecta."],
    ["Among my own projects, the biggest is Zenify.", true],
  ],
  connecta: {
    index: "01 — Connecta",
    partner: "Partner at Connecta BR Digital",
    link: "connectabr.digital/portfolio",
    apiceTag: "Project · Ápice",
  },
  zen: {
    index: "02 — The project",
    kicker: "My main project",
    tagline: "A calm, modern music app.",
    lead: "Zenify started as a fork of Musify, the open-source app I was already contributing to. It became a community edition: it keeps the original's code, features and license, and goes further on desktop, design and syncing between devices.",
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
        text: "65 merged PRs in the original app: Time Machine, artist pages, floating mini player, Spotify import.",
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
    index: "03 — Open source",
    title: "Before Zenify, 65 PRs in Musify.",
    lead: "Musify is an open-source music streaming app for Android with over 4,000 stars on GitHub. That's where I learned the codebase inside out, fixing and building features everyone uses.",
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
    index: "04 — Projects",
    title: "More of my projects.",
    meteorTitle: "Meteor",
    meteorText: "An AI weather ecosystem: landing page, Android app in Flutter and the web version.",
    moreTitle: "And more",
    live: "Live",
    repo: "Code",
    view: "View",
    soon: "In development",
  },
  contactSection: {
    index: "05 — Contact",
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
  theme: "Cambiar entre tema claro y oscuro",
  language: "Cambiar idioma",
  hero: {
    eyebrow: (age: number) => `Sarandi, Brasil · ${age} años · Full stack`,
    lead: "Construyo productos completos: interfaz, backend, apps en Flutter, empaquetado y despliegue. Socio de Connecta y creador de Zenify.",
    primary: "Ver Zenify",
    secondary: "Contactarme",
    scroll: "desliza",
    avatarAlt: "Elias J. R. Nunes con su gato",
  },
  manifesto: [
    ["Me gusta llevar una idea hasta el final: del primer boceto"],
    ["a la app instalada en el dispositivo de alguien.", true],
    ["Con clientes, eso pasa por Connecta."],
    ["En mis proyectos, el más grande es Zenify.", true],
  ],
  connecta: {
    index: "01 — Connecta",
    partner: "Socio de Connecta BR Digital",
    link: "connectabr.digital/portfolio",
    apiceTag: "Proyecto · Ápice",
  },
  zen: {
    index: "02 — El proyecto",
    kicker: "Mi proyecto principal",
    tagline: "Una app de música tranquila y moderna.",
    lead: "Zenify nació como un fork de Musify, la app open source en la que ya contribuía. Se volvió una community edition: mantiene el código, las funciones y la licencia del original, y va más allá en escritorio, diseño y sincronización entre dispositivos.",
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
        text: "65 PRs aceptados en la app original: Time Machine, páginas de artista, mini player flotante, importación de Spotify.",
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
    index: "03 — Open source",
    title: "Antes de Zenify, 65 PRs en Musify.",
    lead: "Musify es una app open source de streaming de música para Android, con más de 4 mil estrellas en GitHub. Ahí aprendí el código por dentro, corrigiendo y creando funciones que todos usan.",
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
    index: "04 — Proyectos",
    title: "Otros proyectos míos.",
    meteorTitle: "Meteor",
    meteorText: "Un ecosistema de clima con IA: landing, app Android en Flutter y la versión web.",
    moreTitle: "Y más",
    live: "En vivo",
    repo: "Código",
    view: "Ver",
    soon: "En desarrollo",
  },
  contactSection: {
    index: "05 — Contacto",
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
      description: "Corretor de redação, simulados, radar de temas e um professor IA, com canvas e exportação em PDF.",
      stack: ["React", "Vite", "tldraw", "jsPDF", "Netlify"],
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
    "sync-my-music": {
      title: "Sync My Music",
      tag: "Self-hosted",
      subtitle: "Central de música com sync de playlists entre serviços e recaps unificados.",
      description: "",
      stack: ["Python", "FastAPI", "React", "Docker"],
    },
  },
  en: {
    apice: {
      title: "Ápice",
      tag: "Study platform",
      subtitle: "AI-powered study for Brazil's ENEM exam.",
      description: "Essay grader, mock exams, a topic radar and an AI tutor, with a canvas and PDF export.",
      stack: ["React", "Vite", "tldraw", "jsPDF", "Netlify"],
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
    "sync-my-music": {
      title: "Sync My Music",
      tag: "Self-hosted",
      subtitle: "A music hub with cross-service playlist sync and unified recaps.",
      description: "",
      stack: ["Python", "FastAPI", "React", "Docker"],
    },
  },
  es: {
    apice: {
      title: "Ápice",
      tag: "Plataforma de estudio",
      subtitle: "Estudio para el ENEM impulsado por IA.",
      description: "Corrector de redacción, simulacros, radar de temas y un profesor IA, con canvas y exportación a PDF.",
      stack: ["React", "Vite", "tldraw", "jsPDF", "Netlify"],
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
    "sync-my-music": {
      title: "Sync My Music",
      tag: "Self-hosted",
      subtitle: "Central de música con sync de playlists entre servicios y resúmenes unificados.",
      description: "",
      stack: ["Python", "FastAPI", "React", "Docker"],
    },
  },
};
