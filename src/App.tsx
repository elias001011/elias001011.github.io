import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  BriefcaseBusiness,
  Building2,
  CheckCircle2,
  ChevronDown,
  Code2,
  ExternalLink,
  Github,
  Globe2,
  Images,
  Instagram,
  Linkedin,
  Mail,
  Menu,
  Palette,
  Rocket,
  ServerCog,
  X,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

const profileImage = new URL("../me.jpg", import.meta.url).href;

const profile = {
  name: "Elias J. R. Nunes",
  birthDate: new Date(2010, 1, 9),
  email: "elias.juriatti@outlook.com",
  github: "https://github.com/elias001011",
  instagram: "https://www.instagram.com/elias_jrnunes",
  linkedin:
    "https://www.linkedin.com/in/elias-nunes-b695ba406?utm_source=share_via&utm_content=profile&utm_medium=member_android",
  connecta: "https://connectabr.digital/",
  avatar: profileImage,
};

const palettes = [
  { id: "green", label: "Verde", hint: "Connecta", swatch: "#67d390" },
  { id: "blue", label: "Azul", hint: "Meteor", swatch: "#8bbcff" },
  { id: "black", label: "Preto", hint: "Clean", swatch: "#f3f3ee" },
  { id: "graphite", label: "Grafite", hint: "Neutro", swatch: "#bcc6d4" },
  { id: "meraki", label: "Meraki", hint: "Café", swatch: "#a9c98a" },
] as const;

const languages = [
  { id: "pt", label: "PT", name: "Português" },
  { id: "en", label: "EN", name: "English" },
  { id: "es", label: "ES", name: "Español" },
] as const;

type PaletteId = (typeof palettes)[number]["id"];
type LanguageId = (typeof languages)[number]["id"];

const siteCopy = {
  pt: {
    locale: "pt-BR",
    brandRole: "Portfólio",
    navLabel: "Navegação principal",
    nav: [
      { label: "Início", href: "#inicio" },
      { label: "Projetos", href: "#projetos" },
      { label: "Sobre", href: "#sobre" },
      { label: "Contato", href: "#contato" },
    ],
    paletteAria: "Selecionar paleta de cores",
    language: {
      aria: "Selecionar idioma",
      label: "Idioma",
    },
    contact: "Contato",
    menu: {
      open: "Abrir menu",
      github: "GitHub",
    },
    hero: {
      status: "Disponível para vagas",
      lead: (age: number) =>
        `Desenvolvedor full stack de ${age} anos, sócio da Connecta e focado em transformar ideias em produtos web completos, do front ao backend serverless.`,
      primary: "Conhecer projetos",
      secondary: "Falar comigo",
      socialLabel: "Links sociais",
      avatarLabel: "Foto de Elias",
      avatarAlt: "Elias J. R. Nunes com seu gato",
    },
    about: {
      eyebrow: "Sobre",
      title: "Simples no visual, direto no que importa.",
      cardTitle: "Quem eu sou",
      text: "Eu construo interfaces, landings e produtos web com atenção à experiência, performance, backend serverless e deploy. Minha base passa por React, TypeScript, APIs, Netlify Functions e projetos reais publicados.",
      bullets: [
        "Aberto para oportunidades e projetos.",
        "Projetos solo com app, landing, APIs, funções e deploy.",
        "Contribuições open-source em app usado por outras pessoas.",
      ],
      connectaTitle: "Connecta",
      connectaText:
        "A Connecta é uma empresa digital brasileira com CNPJ, criada com foco em sites, sistemas e experiências digitais para negócios locais. Eu faço parte como sócio e desenvolvedor.",
      connectaLink: "Visitar site da Connecta",
    },
    projectsIntro: {
      eyebrow: "Projetos",
      title: "Trabalhos publicados, com contexto e link real.",
      scope: "Na prática",
      skills: ["Interfaces React", "APIs e Functions", "Deploy real"],
    },
    more: {
      eyebrow: "Em construção",
      title: "Vem mais por aí.",
      text: "Novos produtos, melhorias nos projetos atuais e mais contribuições open-source devem aparecer por aqui conforme forem ficando prontos.",
      cta: "Acompanhar no GitHub",
    },
    contactSection: {
      eyebrow: "Contato",
      title: "Vamos conversar.",
      text: "Para vagas, freelas, parceria pela Connecta ou feedback nos projetos, esses são os melhores caminhos.",
    },
    footer: {
      rights: "Todos os direitos reservados.",
      credit: "Desenvolvido por @elias_jrnunes",
    },
    projectCard: {
      openGallery: "Abrir galeria do projeto",
      screenshotAlt: "Screenshot do projeto",
      galleryBadgeSingle: "Ver projeto",
      slideshow: "Slideshow",
      previousImage: "Imagem anterior",
      nextImage: "Próxima imagem",
      showImage: "Mostrar imagem",
      live: "Site ao vivo",
      repo: "Repositório",
    },
    commitFeed: {
      heading: "Commits recentes",
      stats: ["25+ commits", "1500+ linhas", "Open source"],
      loading: "Carregando atividade recente...",
      error:
        "25+ commits confirmados no projeto. O GitHub pode limitar chamadas anônimas.",
    },
    gallery: {
      modalLabel: "Galeria",
      closeBackdrop: "Fechar galeria",
      close: "Fechar",
      previous: "Imagem anterior",
      next: "Próxima imagem",
      imageAlt: "imagem",
      viewImage: "Ver imagem",
    },
  },
  en: {
    locale: "en",
    brandRole: "Portfolio",
    navLabel: "Main navigation",
    nav: [
      { label: "Home", href: "#inicio" },
      { label: "Projects", href: "#projetos" },
      { label: "About", href: "#sobre" },
      { label: "Contact", href: "#contato" },
    ],
    paletteAria: "Select color palette",
    language: {
      aria: "Select language",
      label: "Language",
    },
    contact: "Contact",
    menu: {
      open: "Open menu",
      github: "GitHub",
    },
    hero: {
      status: "Available for roles",
      lead: (age: number) =>
        `${age}-year-old full stack developer, Connecta partner, focused on turning ideas into complete web products from frontend to serverless backend.`,
      primary: "Explore projects",
      secondary: "Contact me",
      socialLabel: "Social links",
      avatarLabel: "Photo of Elias",
      avatarAlt: "Elias J. R. Nunes with his cat",
    },
    about: {
      eyebrow: "About",
      title: "Clean visuals, focused on what matters.",
      cardTitle: "Who I am",
      text: "I build interfaces, landing pages and web products with care for experience, performance, serverless backend work and deployment. My foundation includes React, TypeScript, APIs, Netlify Functions and published real-world projects.",
      bullets: [
        "Open to roles and projects.",
        "Solo projects with apps, landing pages, APIs, functions and deployment.",
        "Open-source contributions to an app used by real people.",
      ],
      connectaTitle: "Connecta",
      connectaText:
        "Connecta is a registered Brazilian digital company focused on websites, systems and digital experiences for local businesses. I am a partner and developer there.",
      connectaLink: "Visit Connecta website",
    },
    projectsIntro: {
      eyebrow: "Projects",
      title: "Published work, with context and real links.",
      scope: "In practice",
      skills: ["React interfaces", "APIs and Functions", "Real deployment"],
    },
    more: {
      eyebrow: "In progress",
      title: "More is on the way.",
      text: "New products, improvements to current projects and more open-source contributions will appear here as they become ready.",
      cta: "Follow on GitHub",
    },
    contactSection: {
      eyebrow: "Contact",
      title: "Let's talk.",
      text: "For roles, freelance work, Connecta partnerships or feedback on the projects, these are the best ways to reach me.",
    },
    footer: {
      rights: "All rights reserved.",
      credit: "Developed by @elias_jrnunes",
    },
    projectCard: {
      openGallery: "Open project gallery for",
      screenshotAlt: "Screenshot of",
      galleryBadgeSingle: "View project",
      slideshow: "Slideshow",
      previousImage: "Previous image",
      nextImage: "Next image",
      showImage: "Show image",
      live: "Live site",
      repo: "Repository",
    },
    commitFeed: {
      heading: "Recent commits",
      stats: ["25+ commits", "1500+ lines", "Open source"],
      loading: "Loading recent activity...",
      error:
        "25+ commits confirmed in the project. GitHub may rate-limit anonymous requests.",
    },
    gallery: {
      modalLabel: "Gallery",
      closeBackdrop: "Close gallery",
      close: "Close",
      previous: "Previous image",
      next: "Next image",
      imageAlt: "image",
      viewImage: "View image",
    },
  },
  es: {
    locale: "es",
    brandRole: "Portafolio",
    navLabel: "Navegación principal",
    nav: [
      { label: "Inicio", href: "#inicio" },
      { label: "Proyectos", href: "#projetos" },
      { label: "Sobre mí", href: "#sobre" },
      { label: "Contacto", href: "#contato" },
    ],
    paletteAria: "Seleccionar paleta de colores",
    language: {
      aria: "Seleccionar idioma",
      label: "Idioma",
    },
    contact: "Contacto",
    menu: {
      open: "Abrir menú",
      github: "GitHub",
    },
    hero: {
      status: "Disponible para oportunidades",
      lead: (age: number) =>
        `Desarrollador full stack de ${age} años, socio de Connecta y enfocado en transformar ideas en productos web completos, del frontend al backend serverless.`,
      primary: "Ver proyectos",
      secondary: "Contactarme",
      socialLabel: "Enlaces sociales",
      avatarLabel: "Foto de Elias",
      avatarAlt: "Elias J. R. Nunes con su gato",
    },
    about: {
      eyebrow: "Sobre mí",
      title: "Visual simple, foco en lo importante.",
      cardTitle: "Quién soy",
      text: "Construyo interfaces, landing pages y productos web cuidando experiencia, rendimiento, backend serverless y despliegue. Mi base incluye React, TypeScript, APIs, Netlify Functions y proyectos reales publicados.",
      bullets: [
        "Abierto a oportunidades y proyectos.",
        "Proyectos propios con app, landing, APIs, funciones y deploy.",
        "Contribuciones open-source en una app usada por otras personas.",
      ],
      connectaTitle: "Connecta",
      connectaText:
        "Connecta es una empresa digital brasileña registrada, enfocada en sitios, sistemas y experiencias digitales para negocios locales. Participo como socio y desarrollador.",
      connectaLink: "Visitar el sitio de Connecta",
    },
    projectsIntro: {
      eyebrow: "Proyectos",
      title: "Trabajos publicados, con contexto y enlaces reales.",
      scope: "En la práctica",
      skills: ["Interfaces React", "APIs y Functions", "Deploy real"],
    },
    more: {
      eyebrow: "En desarrollo",
      title: "Hay más en camino.",
      text: "Nuevos productos, mejoras en los proyectos actuales y más contribuciones open-source aparecerán aquí cuando estén listos.",
      cta: "Seguir en GitHub",
    },
    contactSection: {
      eyebrow: "Contacto",
      title: "Hablemos.",
      text: "Para oportunidades, freelas, alianzas por Connecta o feedback sobre los proyectos, estos son los mejores canales.",
    },
    footer: {
      rights: "Todos los derechos reservados.",
      credit: "Desarrollado por @elias_jrnunes",
    },
    projectCard: {
      openGallery: "Abrir galería del proyecto",
      screenshotAlt: "Captura del proyecto",
      galleryBadgeSingle: "Ver proyecto",
      slideshow: "Presentación",
      previousImage: "Imagen anterior",
      nextImage: "Siguiente imagen",
      showImage: "Mostrar imagen",
      live: "Sitio activo",
      repo: "Repositorio",
    },
    commitFeed: {
      heading: "Commits recientes",
      stats: ["25+ commits", "1500+ líneas", "Open source"],
      loading: "Cargando actividad reciente...",
      error:
        "25+ commits confirmados en el proyecto. GitHub puede limitar llamadas anónimas.",
    },
    gallery: {
      modalLabel: "Galería",
      closeBackdrop: "Cerrar galería",
      close: "Cerrar",
      previous: "Imagen anterior",
      next: "Siguiente imagen",
      imageAlt: "imagen",
      viewImage: "Ver imagen",
    },
  },
};

type ProjectCardCopy = (typeof siteCopy)["pt"]["projectCard"];
type CommitFeedCopy = (typeof siteCopy)["pt"]["commitFeed"];
type GalleryCopy = (typeof siteCopy)["pt"]["gallery"];

const meteorImages = [
  new URL("../Meteor/image.png", import.meta.url).href,
  new URL("../Meteor/image copy.png", import.meta.url).href,
  new URL("../Meteor/image copy 2.png", import.meta.url).href,
  new URL("../Meteor/image copy 3.png", import.meta.url).href,
  new URL("../Meteor/image copy 4.png", import.meta.url).href,
  new URL("../Meteor/image copy 5.png", import.meta.url).href,
  new URL("../Meteor/image copy 6.png", import.meta.url).href,
  new URL("../Meteor/image copy 7.png", import.meta.url).href,
  new URL("../Meteor/image copy 8.png", import.meta.url).href,
];

const meteorLandingImages = [
  new URL("../Meteor-landing/image.png", import.meta.url).href,
  new URL("../Meteor-landing/image copy.png", import.meta.url).href,
  new URL("../Meteor-landing/image copy 2.png", import.meta.url).href,
  new URL("../Meteor-landing/image copy 3.png", import.meta.url).href,
  new URL("../Meteor-landing/image copy 4.png", import.meta.url).href,
  new URL("../Meteor-landing/image copy 5.png", import.meta.url).href,
  new URL("../Meteor-landing/image copy 6.png", import.meta.url).href,
  new URL("../Meteor-landing/image copy 7.png", import.meta.url).href,
];

const apiceImages = [
  new URL("../Apice/image.png", import.meta.url).href,
  new URL("../Apice/image copy.png", import.meta.url).href,
  new URL("../Apice/image copy 2.png", import.meta.url).href,
  new URL("../Apice/image copy 3.png", import.meta.url).href,
  new URL("../Apice/image copy 4.png", import.meta.url).href,
  new URL("../Apice/image copy 5.png", import.meta.url).href,
  new URL("../Apice/image copy 6.png", import.meta.url).href,
  new URL("../Apice/image copy 7.png", import.meta.url).href,
  new URL("../Apice/image copy 8.png", import.meta.url).href,
  new URL("../Apice/image copy 9.png", import.meta.url).href,
  new URL("../Apice/image copy 10.png", import.meta.url).href,
  new URL("../Apice/image copy 11.png", import.meta.url).href,
];

const myComputerImages = [
  new URL("../MyComputer/image.png", import.meta.url).href,
  new URL("../MyComputer/image copy.png", import.meta.url).href,
  new URL("../MyComputer/image copy 2.png", import.meta.url).href,
  new URL("../MyComputer/image copy 3.png", import.meta.url).href,
  new URL("../MyComputer/image copy 4.png", import.meta.url).href,
  new URL("../MyComputer/image copy 5.png", import.meta.url).href,
];

const musifyDesktopImages = [
  new URL("../MusifyDesktop/image.png", import.meta.url).href,
  new URL("../MusifyDesktop/image copy.png", import.meta.url).href,
  new URL("../MusifyDesktop/image copy 2.png", import.meta.url).href,
  new URL("../MusifyDesktop/image copy 3.png", import.meta.url).href,
  new URL("../MusifyDesktop/image copy 4.png", import.meta.url).href,
  new URL("../MusifyDesktop/image copy 5.png", import.meta.url).href,
];

const syncMyMusicImages: string[] = [];

const meteorFlutterImages: string[] = [];

const youtubeMusicExplodeImages: string[] = [];

const projectOrder = [
  "meteor",
  "apice",
  "my-computer",
  "musify-desktop-port",
  "meteor-landing",
  "sync-my-music",
  "meteor-flutter",
  "youtube-music-explode-dart",
] as const;

type ProjectId = (typeof projectOrder)[number];

type Project = {
  id: ProjectId;
  title: string;
  eyebrow: string;
  subtitle: string;
  description: string;
  role: string;
  stack: string[];
  metrics: string[];
  images: string[];
  live?: string;
  liveLabel?: string;
  repo?: string;
  reverse?: boolean;
  openSource?: boolean;
};

type ProjectText = Omit<Project, "id" | "images" | "live" | "repo" | "reverse" | "openSource">;

const projectAssets: Record<
  ProjectId,
  {
    images: string[];
    live?: string;
    repo?: string;
    reverse?: boolean;
    openSource?: boolean;
  }
> = {
  apice: {
    images: apiceImages,
    live: "https://apice-ai.netlify.app",
    repo: "https://github.com/elias001011/Apice",
  },
  "meteor-landing": {
    images: meteorLandingImages,
    live: "https://lp--meteor-ai.netlify.app/",
    repo: "https://github.com/elias001011/Meteor-LandingPage",
    reverse: true,
  },
  meteor: {
    images: meteorImages,
    live: "https://meteor-ai.netlify.app",
    repo: "https://github.com/elias001011/Meteor",
  },
  "my-computer": {
    images: myComputerImages,
    repo: "https://github.com/elias001011/my-computer",
    reverse: true,
  },
  "sync-my-music": {
    images: syncMyMusicImages,
    repo: "https://github.com/elias001011/sync-my-music",
    reverse: true,
  },
  "meteor-flutter": {
    images: meteorFlutterImages,
    repo: "https://github.com/elias001011/Meteor/tree/android",
    reverse: true,
  },
  "musify-desktop-port": {
    images: musifyDesktopImages,
    live: "https://github.com/elias001011/Musify-Desktop-Port/releases",
    repo: "https://github.com/elias001011/Musify-Desktop-Port",
    reverse: true,
  },
  "youtube-music-explode-dart": {
    images: youtubeMusicExplodeImages,
    repo: "https://github.com/elias001011/youtube_music_explode_dart",
  },
};

const projectContent: Record<LanguageId, Record<ProjectId, ProjectText>> = {
  pt: {
    meteor: {
      title: "Meteor",
      eyebrow: "Projeto solo",
      subtitle: "Inteligência climática com IA generativa.",
      description:
        "PWA de clima em tempo real com assistente contextual, alertas, dados de múltiplas fontes e BFF em Netlify Functions para proteger chaves de API.",
      role: "Produto, interface, arquitetura full stack e integrações serverless.",
      stack: ["React", "TypeScript", "Vite", "Tailwind", "Gemini", "Netlify"],
      metrics: ["PWA", "IA contextual", "BFF seguro"],
    },
    apice: {
      title: "Ápice",
      eyebrow: "Connecta",
      subtitle: "Plataforma de estudos para o ENEM 100% movida por IA.",
      description:
        "Projeto do ecossistema Connecta criado para apoiar a preparação para o ENEM com recursos inteligentes, geração de conteúdo e fluxos personalizados de estudo.",
      role: "Desenvolvimento full stack, experiência de estudo, IA e integrações do app.",
      stack: ["React", "Vite", "tldraw", "jsPDF", "Netlify Identity"],
      metrics: ["Connecta", "Canvas", "Exportação"],
    },
    "meteor-landing": {
      title: "Meteor Landing Page",
      eyebrow: "Projeto solo",
      subtitle: "Apresentação oficial do ecossistema Meteor.",
      description:
        "Landing page com narrativa em slides, scroll pinning, galerias e contexto sobre alertas climáticos no Rio Grande do Sul.",
      role: "Design visual, copy, animações de scroll e implementação completa.",
      stack: ["React", "TypeScript", "GSAP", "Framer Motion", "Lucide"],
      metrics: ["8 slides", "ScrollTrigger", "Responsivo"],
    },
    meteor: {
      title: "Meteor",
      eyebrow: "Projeto solo",
      subtitle: "Inteligência climática com IA generativa.",
      description:
        "PWA de clima em tempo real com assistente contextual, alertas, dados de múltiplas fontes e BFF em Netlify Functions para proteger chaves de API.",
      role: "Produto, interface, arquitetura full stack e integrações serverless.",
      stack: ["React", "TypeScript", "Vite", "Tailwind", "Gemini", "Netlify"],
      metrics: ["PWA", "IA contextual", "BFF seguro"],
    },
    "my-computer": {
      title: "My Computer",
      eyebrow: "Projeto solo",
      subtitle: "Painel self-hosted para conversar com IA e usar tools locais.",
      description:
        "Aplicação local em Node.js com painel HTML/CSS/JS puro, chats com IA, memória persistente, anexos, múltiplos providers, tools de terminal com aprovação e runtime separado em ~/.my-computer.",
      role: "Produto, arquitetura local-first, UI do painel, servidor Node/CLI, storage local e integração com providers e tools.",
      stack: ["Node.js", "JavaScript", "HTML", "CSS", "CLI", "Ollama"],
      metrics: ["Self-hosted", "Tools aprovadas", "Multi-provider"],
    },
    "sync-my-music": {
      title: "Sync My Music",
      eyebrow: "Projeto solo",
      subtitle: "Central de música self-hosted.",
      description:
        "Biblioteca canônica de música com sincronização de playlists entre serviços, recaps de escuta unificados, integrações com Musify e Sonora, e dashboard LAN com Docker.",
      role: "Produto, backend Python/FastAPI, engine de sync, UI React e deploy.",
      stack: ["Python", "FastAPI", "React", "SQLite", "Docker", "Netlify"],
      metrics: ["Self-hosted", "N-way sync", "Multi-account"],
    },
    "meteor-flutter": {
      title: "Meteor Flutter",
      eyebrow: "Projeto solo",
      subtitle: "App Android nativo do Meteor em Flutter.",
      description:
        "Aplicativo Android com Home em cards, mapa, notícias, assistente IA, tema AMOLED preto real, push via FCM e cache local — compartilha o mesmo BFF serverless da web.",
      role: "Produto mobile, UI Flutter/Material 3, Firebase Auth, App Check, FCM e integração com o BFF.",
      stack: ["Flutter", "Dart", "Material 3", "Firebase", "FCM", "GitHub Actions"],
      metrics: ["Android", "Material You", "Push nativo"],
    },
    "musify-desktop-port": {
      title: "Musify Desktop Port",
      eyebrow: "Port desktop",
      subtitle: "Port desktop não oficial do Musify para Windows e Linux.",
      description:
        "Downstream do gokadzev/Musify que mantém o app upstream o mais intacto possível e adiciona suporte desktop: targets Flutter para Windows/Linux, playback via media_kit, pacotes instaláveis e updater pelas releases deste repo.",
      role: "Compatibilidade desktop, empacotamento Linux/Windows, workflows de release e guards para APIs Android-only.",
      stack: ["Flutter", "Dart", "media_kit", "Windows", "Linux", "GitHub Actions"],
      metrics: ["v10.0.8", "Windows/Linux", "Sync upstream"],
      liveLabel: "Downloads",
    },
    "youtube-music-explode-dart": {
      title: "youtube_music_explode_dart",
      eyebrow: "Open source",
      subtitle: "Client Dart para a API InnerTube do YouTube Music.",
      description:
        "Biblioteca Dart minimalista para acessar artistas, discografia, top songs e busca no YouTube Music — usada pelo Musify para páginas de artistas e importação de playlists do Spotify.",
      role: "API reverse-engineered, matching por word-set, sem scraping de HTML.",
      stack: ["Dart", "YouTube Music", "InnerTube", "youtube_explode_dart"],
      metrics: ["WEB_REMIX", "Browse + Search", "Usado pelo Musify"],
    },
  },
  en: {
    meteor: {
      title: "Meteor",
      eyebrow: "Solo project",
      subtitle: "Climate intelligence with generative AI.",
      description:
        "Real-time weather PWA with a contextual assistant, alerts, data from multiple sources and a Netlify Functions BFF to protect API keys.",
      role: "Product, interface, full stack architecture and serverless integrations.",
      stack: ["React", "TypeScript", "Vite", "Tailwind", "Gemini", "Netlify"],
      metrics: ["PWA", "Contextual AI", "Secure BFF"],
    },
    apice: {
      title: "Ápice",
      eyebrow: "Connecta",
      subtitle: "AI-powered study platform for Brazil's ENEM exam.",
      description:
        "A Connecta ecosystem project created to support ENEM preparation with intelligent resources, content generation and personalized study flows.",
      role: "Full stack development, study experience, AI features and app integrations.",
      stack: ["React", "Vite", "tldraw", "jsPDF", "Netlify Identity"],
      metrics: ["Connecta", "Canvas", "Export"],
    },
    "meteor-landing": {
      title: "Meteor Landing Page",
      eyebrow: "Solo project",
      subtitle: "Official presentation for the Meteor ecosystem.",
      description:
        "Landing page with slide-based storytelling, scroll pinning, galleries and context around climate alerts in Rio Grande do Sul.",
      role: "Visual design, copy, scroll animations and full implementation.",
      stack: ["React", "TypeScript", "GSAP", "Framer Motion", "Lucide"],
      metrics: ["8 slides", "ScrollTrigger", "Responsive"],
    },
    meteor: {
      title: "Meteor",
      eyebrow: "Solo project",
      subtitle: "Climate intelligence with generative AI.",
      description:
        "Real-time weather PWA with a contextual assistant, alerts, data from multiple sources and a Netlify Functions BFF to protect API keys.",
      role: "Product, interface, full stack architecture and serverless integrations.",
      stack: ["React", "TypeScript", "Vite", "Tailwind", "Gemini", "Netlify"],
      metrics: ["PWA", "Contextual AI", "Secure BFF"],
    },
    "my-computer": {
      title: "My Computer",
      eyebrow: "Solo project",
      subtitle: "Self-hosted panel for AI chats and local tools.",
      description:
        "Local Node.js app with a plain HTML/CSS/JS dashboard, AI chats, persistent memory, attachments, multiple providers, approval-based terminal tools and a separate runtime in ~/.my-computer.",
      role: "Product, local-first architecture, dashboard UI, Node/CLI server, local storage and provider/tool integrations.",
      stack: ["Node.js", "JavaScript", "HTML", "CSS", "CLI", "Ollama"],
      metrics: ["Self-hosted", "Approved tools", "Multi-provider"],
    },
    "sync-my-music": {
      title: "Sync My Music",
      eyebrow: "Solo project",
      subtitle: "Self-hosted music control center.",
      description:
        "Canonical music library with cross-service playlist sync, unified listening recaps, Musify and Sonora integrations, and a LAN dashboard with Docker.",
      role: "Product, Python/FastAPI backend, sync engine, React UI and deployment.",
      stack: ["Python", "FastAPI", "React", "SQLite", "Docker", "Netlify"],
      metrics: ["Self-hosted", "N-way sync", "Multi-account"],
    },
    "meteor-flutter": {
      title: "Meteor Flutter",
      eyebrow: "Solo project",
      subtitle: "Native Android Meteor app in Flutter.",
      description:
        "Android app with card-based Home, map, news, AI assistant, true-black AMOLED theme, FCM push and local cache — sharing the same serverless BFF as the web.",
      role: "Mobile product, Flutter/Material 3 UI, Firebase Auth, App Check, FCM and BFF integration.",
      stack: ["Flutter", "Dart", "Material 3", "Firebase", "FCM", "GitHub Actions"],
      metrics: ["Android", "Material You", "Native push"],
    },
    "musify-desktop-port": {
      title: "Musify Desktop Port",
      eyebrow: "Desktop port",
      subtitle: "Unofficial Musify desktop port for Windows and Linux.",
      description:
        "A downstream of gokadzev/Musify that keeps the upstream app as intact as possible while adding desktop support: Flutter targets for Windows/Linux, media_kit playback, installable packages and release-based updates.",
      role: "Desktop compatibility, Linux/Windows packaging, release workflows and guards for Android-only APIs.",
      stack: ["Flutter", "Dart", "media_kit", "Windows", "Linux", "GitHub Actions"],
      metrics: ["v10.0.8", "Windows/Linux", "Upstream sync"],
      liveLabel: "Downloads",
    },
    "youtube-music-explode-dart": {
      title: "youtube_music_explode_dart",
      eyebrow: "Open source",
      subtitle: "Dart client for YouTube Music's InnerTube API.",
      description:
        "Minimal Dart library to access artists, discography, top songs and search on YouTube Music — used by Musify for artist pages and Spotify playlist import.",
      role: "Reverse-engineered API, word-set matching, no HTML scraping.",
      stack: ["Dart", "YouTube Music", "InnerTube", "youtube_explode_dart"],
      metrics: ["WEB_REMIX", "Browse + Search", "Used by Musify"],
    },
  },
  es: {
    meteor: {
      title: "Meteor",
      eyebrow: "Proyecto propio",
      subtitle: "Inteligencia climática con IA generativa.",
      description:
        "PWA de clima en tiempo real con asistente contextual, alertas, datos de múltiples fuentes y BFF en Netlify Functions para proteger claves de API.",
      role: "Producto, interfaz, arquitectura full stack e integraciones serverless.",
      stack: ["React", "TypeScript", "Vite", "Tailwind", "Gemini", "Netlify"],
      metrics: ["PWA", "IA contextual", "BFF seguro"],
    },
    apice: {
      title: "Ápice",
      eyebrow: "Connecta",
      subtitle: "Plataforma de estudios para ENEM impulsada por IA.",
      description:
        "Proyecto del ecosistema Connecta creado para apoyar la preparación para ENEM con recursos inteligentes, generación de contenido y flujos personalizados de estudio.",
      role: "Desarrollo full stack, experiencia de estudio, IA e integraciones de la app.",
      stack: ["React", "Vite", "tldraw", "jsPDF", "Netlify Identity"],
      metrics: ["Connecta", "Canvas", "Exportación"],
    },
    "meteor-landing": {
      title: "Meteor Landing Page",
      eyebrow: "Proyecto propio",
      subtitle: "Presentación oficial del ecosistema Meteor.",
      description:
        "Landing page con narrativa en slides, scroll pinning, galerías y contexto sobre alertas climáticas en Rio Grande do Sul.",
      role: "Diseño visual, copy, animaciones de scroll e implementación completa.",
      stack: ["React", "TypeScript", "GSAP", "Framer Motion", "Lucide"],
      metrics: ["8 slides", "ScrollTrigger", "Responsivo"],
    },
    meteor: {
      title: "Meteor",
      eyebrow: "Proyecto propio",
      subtitle: "Inteligencia climática con IA generativa.",
      description:
        "PWA de clima en tiempo real con asistente contextual, alertas, datos de múltiples fuentes y BFF en Netlify Functions para proteger claves de API.",
      role: "Producto, interfaz, arquitectura full stack e integraciones serverless.",
      stack: ["React", "TypeScript", "Vite", "Tailwind", "Gemini", "Netlify"],
      metrics: ["PWA", "IA contextual", "BFF seguro"],
    },
    "my-computer": {
      title: "My Computer",
      eyebrow: "Proyecto propio",
      subtitle: "Panel self-hosted para conversar con IA y usar herramientas locales.",
      description:
        "Aplicación local en Node.js con panel HTML/CSS/JS puro, chats con IA, memoria persistente, anexos, múltiples providers, herramientas de terminal con aprobación y runtime separado en ~/.my-computer.",
      role: "Producto, arquitectura local-first, UI del panel, servidor Node/CLI, storage local e integración con providers y herramientas.",
      stack: ["Node.js", "JavaScript", "HTML", "CSS", "CLI", "Ollama"],
      metrics: ["Self-hosted", "Herramientas aprobadas", "Multi-provider"],
    },
    "sync-my-music": {
      title: "Sync My Music",
      eyebrow: "Proyecto propio",
      subtitle: "Central de música self-hosted.",
      description:
        "Biblioteca canónica de música con sincronización de playlists entre servicios, recaps de escucha unificados, integraciones con Musify y Sonora, y dashboard LAN con Docker.",
      role: "Producto, backend Python/FastAPI, motor de sync, UI React y despliegue.",
      stack: ["Python", "FastAPI", "React", "SQLite", "Docker", "Netlify"],
      metrics: ["Self-hosted", "N-way sync", "Multi-account"],
    },
    "meteor-flutter": {
      title: "Meteor Flutter",
      eyebrow: "Proyecto propio",
      subtitle: "App Android nativa de Meteor en Flutter.",
      description:
        "App Android con Home en cards, mapa, noticias, asistente IA, tema AMOLED negro real, push vía FCM y caché local — comparte el mismo BFF serverless que la web.",
      role: "Producto mobile, UI Flutter/Material 3, Firebase Auth, App Check, FCM e integración con el BFF.",
      stack: ["Flutter", "Dart", "Material 3", "Firebase", "FCM", "GitHub Actions"],
      metrics: ["Android", "Material You", "Push nativo"],
    },
    "musify-desktop-port": {
      title: "Musify Desktop Port",
      eyebrow: "Port desktop",
      subtitle: "Port desktop no oficial de Musify para Windows y Linux.",
      description:
        "Downstream de gokadzev/Musify que mantiene la app upstream lo más intacta posible y suma soporte desktop: targets Flutter para Windows/Linux, reproducción con media_kit, paquetes instalables y updater por releases.",
      role: "Compatibilidad desktop, empaquetado Linux/Windows, workflows de release y protecciones para APIs solo de Android.",
      stack: ["Flutter", "Dart", "media_kit", "Windows", "Linux", "GitHub Actions"],
      metrics: ["v10.0.8", "Windows/Linux", "Sync upstream"],
      liveLabel: "Descargas",
    },
    "youtube-music-explode-dart": {
      title: "youtube_music_explode_dart",
      eyebrow: "Open source",
      subtitle: "Client Dart para la API InnerTube de YouTube Music.",
      description:
        "Biblioteca Dart minimalista para acceder a artistas, discografía, top songs y búsqueda en YouTube Music — usada por Musify para páginas de artistas e importación de playlists de Spotify.",
      role: "API reverse-engineered, matching por word-set, sin scraping de HTML.",
      stack: ["Dart", "YouTube Music", "InnerTube", "youtube_explode_dart"],
      metrics: ["WEB_REMIX", "Browse + Search", "Usado por Musify"],
    },
  },
};

type GalleryState = {
  project: Project;
  index: number;
};

type GithubCommit = {
  sha: string;
  html_url: string;
  commit: {
    message: string;
    author?: {
      date?: string;
    };
  };
};

function calculateAge(birthDate: Date) {
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const hasBirthdayPassed =
    today.getMonth() > birthDate.getMonth() ||
    (today.getMonth() === birthDate.getMonth() &&
      today.getDate() >= birthDate.getDate());

  if (!hasBirthdayPassed) age -= 1;
  return age;
}

function App() {
  const age = useMemo(() => calculateAge(profile.birthDate), []);
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [themePulse, setThemePulse] = useState(false);
  const [paletteId, setPaletteId] = useState<PaletteId>("green");
  const [language, setLanguage] = useState<LanguageId>("pt");
  const [gallery, setGallery] = useState<GalleryState | null>(null);
  const [commits, setCommits] = useState<GithubCommit[]>([]);
  const [commitStatus, setCommitStatus] = useState<"loading" | "ready" | "error">(
    "loading",
  );

  const copy = siteCopy[language];
  const activePalette = palettes.find((palette) => palette.id === paletteId)!;

  const projects = useMemo<Project[]>(
    () =>
      projectOrder.map((id) => ({
        id,
        ...projectAssets[id],
        ...projectContent[language][id],
      })),
    [language],
  );

  useEffect(() => {
    const storedPalette = window.localStorage.getItem("elias-palette") as
      | PaletteId
      | null;
    if (storedPalette && palettes.some((palette) => palette.id === storedPalette)) {
      setPaletteId(storedPalette);
    }

    const storedLanguage = window.localStorage.getItem("elias-language") as
      | LanguageId
      | null;
    if (storedLanguage && languages.some((option) => option.id === storedLanguage)) {
      setLanguage(storedLanguage);
    }
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = paletteId;
    window.localStorage.setItem("elias-palette", paletteId);
  }, [paletteId]);

  useEffect(() => {
    document.documentElement.lang = copy.locale;
    window.localStorage.setItem("elias-language", language);
  }, [copy.locale, language]);

  useEffect(() => {
    const controller = new AbortController();

    fetch(
      "https://api.github.com/repos/gokadzev/Musify/commits?author=elias001011&per_page=4",
      { signal: controller.signal },
    )
      .then((response) => {
        if (!response.ok) throw new Error("GitHub API unavailable");
        return response.json() as Promise<GithubCommit[]>;
      })
      .then((data) => {
        setCommits(data);
        setCommitStatus("ready");
      })
      .catch((error: Error) => {
        if (error.name !== "AbortError") setCommitStatus("error");
      });

    return () => controller.abort();
  }, []);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 18);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    let frame: number | null = null;

    const clamp = (value: number, min: number, max: number) =>
      Math.min(Math.max(value, min), max);

    const updateMotion = () => {
      frame = null;
      const viewportHeight = window.innerHeight || 1;
      const viewportCenter = viewportHeight / 2;

      document.querySelectorAll<HTMLElement>(".motion-track").forEach((section) => {
        const rect = section.getBoundingClientRect();
        const sectionCenter = rect.top + rect.height / 2;
        const progress = clamp((viewportCenter - sectionCenter) / viewportHeight, -1.25, 1.25);
        const distance = Math.abs(progress);
        const presence = clamp(1 - distance / 1.08, 0, 1);

        section.style.setProperty("--scroll-progress", progress.toFixed(3));
        section.style.setProperty("--scroll-abs", distance.toFixed(3));
        section.style.setProperty("--scroll-presence", presence.toFixed(3));
      });
    };

    const requestUpdate = () => {
      if (frame === null) {
        frame = window.requestAnimationFrame(updateMotion);
      }
    };

    updateMotion();
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);
    window.addEventListener("load", requestUpdate);

    return () => {
      if (frame !== null) window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
      window.removeEventListener("load", requestUpdate);
    };
  }, []);

  useEffect(() => {
    if (!gallery) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setGallery(null);
      if (event.key === "ArrowRight") moveGallery(1);
      if (event.key === "ArrowLeft") moveGallery(-1);
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [gallery]);

  function choosePalette(nextPalette: PaletteId) {
    setPaletteId(nextPalette);
    setPaletteOpen(false);
    setThemePulse(false);
    window.setTimeout(() => setThemePulse(true), 0);
    window.setTimeout(() => setThemePulse(false), 520);
  }

  function chooseLanguage(nextLanguage: LanguageId) {
    setLanguage(nextLanguage);
    setMenuOpen(false);
  }

  function moveGallery(direction: number) {
    setGallery((current) => {
      if (!current) return current;
      const length = current.project.images.length;
      return {
        project: current.project,
        index: (current.index + direction + length) % length,
      };
    });
  }

  const languageSwitch = (
    <div className="language-switch" aria-label={copy.language.aria}>
      <Globe2 size={15} aria-hidden="true" />
      {languages.map((option) => (
        <button
          key={option.id}
          type="button"
          className={option.id === language ? "is-active" : ""}
          aria-pressed={option.id === language}
          title={option.name}
          onClick={() => chooseLanguage(option.id)}
        >
          {option.label}
        </button>
      ))}
    </div>
  );

  return (
    <>
      <header className={`site-header ${isScrolled ? "is-scrolled" : ""}`}>
        <nav className="nav-shell" aria-label={copy.navLabel}>
          <a className="brand" href="#inicio" onClick={() => setMenuOpen(false)}>
            <span className="brand-mark">E</span>
            <span>
              <strong>Elias</strong>
              <small>{copy.brandRole}</small>
            </span>
          </a>

          <div className="nav-links">
            {copy.nav.map((item) => (
              <a key={item.href} href={item.href}>
                {item.label}
              </a>
            ))}
          </div>

          <div className="nav-actions">
            <div className="palette-menu">
              <button
                className="icon-button palette-trigger"
                type="button"
                aria-label={copy.paletteAria}
                aria-expanded={paletteOpen}
                onClick={() => setPaletteOpen((current) => !current)}
              >
                <Palette size={18} />
                <span>{activePalette.label}</span>
                <ChevronDown size={14} />
              </button>

              {paletteOpen && (
                <div className="palette-popover">
                  {palettes.map((palette) => (
                    <button
                      key={palette.id}
                      type="button"
                      className={palette.id === paletteId ? "is-active" : ""}
                      onClick={() => choosePalette(palette.id)}
                    >
                      <span
                        className="palette-swatch"
                        style={{ backgroundColor: palette.swatch }}
                      />
                      <span>
                        <strong>{palette.label}</strong>
                        <small>{palette.hint}</small>
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {languageSwitch}

            <a className="nav-cta" href={`mailto:${profile.email}`}>
              <Mail size={16} />
              {copy.contact}
            </a>

            <button
              className="icon-button mobile-menu-button"
              type="button"
              aria-label={copy.menu.open}
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((current) => !current)}
            >
              {menuOpen ? <X size={19} /> : <Menu size={19} />}
            </button>
          </div>
        </nav>

        {menuOpen && (
          <div className="mobile-menu">
            {copy.nav.map((item) => (
              <a key={item.href} href={item.href} onClick={() => setMenuOpen(false)}>
                {item.label}
              </a>
            ))}
            <a href={profile.github} target="_blank" rel="noreferrer">
              {copy.menu.github} <ExternalLink size={15} />
            </a>
          </div>
        )}
      </header>
      <div className={`theme-wipe ${themePulse ? "is-active" : ""}`} />

      <main>
        <section className="hero snap-section motion-track motion-hero" id="inicio">
          <div className="hero-grid">
            <div className="hero-copy">
              <span className="status-pill">
                <span />
                {copy.hero.status}
              </span>
              <h1>{profile.name}</h1>
              <p className="hero-lead">{copy.hero.lead(age)}</p>

              <div className="hero-actions">
                <a className="primary-button" href="#projetos">
                  <ArrowDown size={18} />
                  {copy.hero.primary}
                </a>
                <a className="ghost-button" href={`mailto:${profile.email}`}>
                  <Mail size={18} />
                  {copy.hero.secondary}
                </a>
              </div>

              <div className="social-row" aria-label={copy.hero.socialLabel}>
                <a href={profile.github} target="_blank" rel="noreferrer">
                  <Github size={17} />
                  GitHub
                </a>
                <a href={profile.linkedin} target="_blank" rel="noreferrer">
                  <Linkedin size={17} />
                  LinkedIn
                </a>
                <a href={profile.instagram} target="_blank" rel="noreferrer">
                  <Instagram size={17} />
                  Instagram
                </a>
              </div>
            </div>

            <div className="hero-visual" aria-label={copy.hero.avatarLabel}>
              <div className="avatar-frame">
                <img
                  src={profile.avatar}
                  alt={copy.hero.avatarAlt}
                  fetchPriority="high"
                  decoding="async"
                />
              </div>
            </div>
          </div>
        </section>

        <section className="about-section snap-section motion-track motion-about" id="sobre">
          <div className="section-heading">
            <span>{copy.about.eyebrow}</span>
            <h2>{copy.about.title}</h2>
          </div>

          <div className="about-grid">
            <article className="about-panel">
              <h3>{copy.about.cardTitle}</h3>
              <p>{copy.about.text}</p>
              <ul>
                {copy.about.bullets.map((item) => (
                  <li key={item}>
                    <CheckCircle2 size={18} />
                    {item}
                  </li>
                ))}
              </ul>
            </article>

            <article className="connecta-panel">
              <span className="panel-icon">
                <Building2 size={22} />
              </span>
              <h3>{copy.about.connectaTitle}</h3>
              <p>{copy.about.connectaText}</p>
              <a className="text-link" href={profile.connecta} target="_blank" rel="noreferrer">
                {copy.about.connectaLink}
                <ExternalLink size={16} />
              </a>
            </article>
          </div>
        </section>

        <section className="projects-intro snap-section motion-track motion-intro" id="projetos">
          <div className="projects-intro-copy">
            <span>{copy.projectsIntro.eyebrow}</span>
            <h2>{copy.projectsIntro.title}</h2>
          </div>
          <div className="projects-intro-side">
            <div className="hero-scope-card" aria-label={copy.projectsIntro.scope}>
              <span className="scope-kicker">{copy.projectsIntro.scope}</span>
              <div>
                <span>
                  <Code2 size={17} />
                  {copy.projectsIntro.skills[0]}
                </span>
                <span>
                  <ServerCog size={17} />
                  {copy.projectsIntro.skills[1]}
                </span>
                <span>
                  <Rocket size={17} />
                  {copy.projectsIntro.skills[2]}
                </span>
              </div>
            </div>
          </div>
        </section>

        <div className="projects-stack">
          {projects.map((project, index) => (
            <ProjectSlide
              key={project.id}
              project={project}
              index={index}
              copy={copy.projectCard}
              commitCopy={copy.commitFeed}
              commits={commits}
              commitStatus={commitStatus}
              onOpenGallery={(imageIndex) =>
                setGallery({ project, index: imageIndex })
              }
            />
          ))}
        </div>

        <section className="more-banner snap-section motion-track motion-more">
          <div>
            <span>{copy.more.eyebrow}</span>
            <h2>{copy.more.title}</h2>
            <p>{copy.more.text}</p>
          </div>
          <a className="ghost-button" href={profile.github} target="_blank" rel="noreferrer">
            <Github size={18} />
            {copy.more.cta}
          </a>
        </section>

        <section className="contact-section snap-section motion-track motion-contact" id="contato">
          <div className="contact-copy">
            <span>{copy.contactSection.eyebrow}</span>
            <h2>{copy.contactSection.title}</h2>
            <p>{copy.contactSection.text}</p>
          </div>

          <div className="contact-links">
            <a href={`mailto:${profile.email}`}>
              <Mail size={20} />
              {profile.email}
            </a>
            <a href={profile.instagram} target="_blank" rel="noreferrer">
              <Instagram size={20} />
              @elias_jrnunes
            </a>
            <a href={profile.github} target="_blank" rel="noreferrer">
              <Github size={20} />
              github.com/elias001011
            </a>
            <a href={profile.linkedin} target="_blank" rel="noreferrer">
              <Linkedin size={20} />
              LinkedIn
            </a>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div>
          <strong>{profile.name}</strong>
          <span>{copy.footer.rights}</span>
        </div>
        <a href={profile.instagram} target="_blank" rel="noreferrer">
          {copy.footer.credit}
        </a>
      </footer>

      {gallery && (
        <GalleryModal
          gallery={gallery}
          copy={copy.gallery}
          onClose={() => setGallery(null)}
          onMove={moveGallery}
          onSelect={(index) => setGallery({ project: gallery.project, index })}
        />
      )}
    </>
  );
}

function ProjectSlide({
  project,
  index,
  copy,
  commitCopy,
  commits,
  commitStatus,
  onOpenGallery,
}: {
  project: Project;
  index: number;
  copy: ProjectCardCopy;
  commitCopy: CommitFeedCopy;
  commits: GithubCommit[];
  commitStatus: "loading" | "ready" | "error";
  onOpenGallery: (imageIndex: number) => void;
}) {
  const isReverse = project.reverse;
  const [currentImage, setCurrentImage] = useState(0);
  const hasSlideshow = project.images.length > 1;

  useEffect(() => {
    setCurrentImage(0);
  }, [project.id]);

  useEffect(() => {
    if (!hasSlideshow) return;

    const interval = window.setInterval(() => {
      setCurrentImage((current) => (current + 1) % project.images.length);
    }, 3600);

    return () => window.clearInterval(interval);
  }, [hasSlideshow, project.images.length]);

  const showPreviousImage = () => {
    setCurrentImage((current) =>
      (current - 1 + project.images.length) % project.images.length,
    );
  };

  const showNextImage = () => {
    setCurrentImage((current) => (current + 1) % project.images.length);
  };

  return (
    <section
      className={`project-slide motion-slide motion-track ${isReverse ? "is-reverse" : ""}`}
    >
      <div
        className="project-layout"
        data-project={`${String(index + 1).padStart(2, "0")} / ${project.eyebrow}`}
      >
        {project.openSource ? (
          <CommitFeed
            commits={commits}
            status={commitStatus}
            copy={commitCopy}
            variant="panel"
          />
        ) : (
          <div className="project-visual">
            <button
              type="button"
              className="project-image-button"
              onClick={() => onOpenGallery(currentImage)}
              aria-label={`${copy.openGallery} ${project.title}`}
            >
              <img
                key={project.images[currentImage]}
                src={project.images[currentImage]}
                alt={`${copy.screenshotAlt} ${project.title}`}
                loading="lazy"
                decoding="async"
              />
              <span className="gallery-badge">
                <Images size={17} />
                {project.images.length > 1
                  ? `${currentImage + 1} / ${project.images.length}`
                  : copy.galleryBadgeSingle}
              </span>
            </button>

            {hasSlideshow && (
              <div className="slideshow-controls" aria-label={`${copy.slideshow} ${project.title}`}>
                <button type="button" aria-label={copy.previousImage} onClick={showPreviousImage}>
                  <ArrowLeft size={17} />
                </button>
                <div className="slide-dots">
                  {project.images.map((image, imageIndex) => (
                    <button
                      key={image}
                      type="button"
                      className={imageIndex === currentImage ? "is-active" : ""}
                      aria-label={`${copy.showImage} ${imageIndex + 1}`}
                      onClick={() => setCurrentImage(imageIndex)}
                    />
                  ))}
                </div>
                <button type="button" aria-label={copy.nextImage} onClick={showNextImage}>
                  <ArrowRight size={17} />
                </button>
              </div>
            )}
          </div>
        )}

        <div className="project-copy">
          <span className="project-eyebrow">
            {String(index + 1).padStart(2, "0")} / {project.eyebrow}
          </span>
          <h2>{project.title}</h2>
          <p className="project-subtitle">{project.subtitle}</p>
          <p className="project-description">{project.description}</p>

          <div className="project-role">
            <BriefcaseBusiness size={18} />
            <span>{project.role}</span>
          </div>

          <div className="metric-row">
            {project.metrics.map((metric) => (
              <span key={metric}>{metric}</span>
            ))}
          </div>

          <div className="stack-row">
            {project.stack.map((tech) => (
              <span key={tech}>{tech}</span>
            ))}
          </div>

          <div className="project-actions">
            {project.live && (
              <a className="primary-button small" href={project.live} target="_blank" rel="noreferrer">
                <Globe2 size={17} />
                {project.liveLabel ?? copy.live}
              </a>
            )}
            {project.repo && (
              <a className="ghost-button small" href={project.repo} target="_blank" rel="noreferrer">
                <Github size={17} />
                {copy.repo}
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function CommitFeed({
  commits,
  status,
  copy,
  variant = "inline",
}: {
  commits: GithubCommit[];
  status: "loading" | "ready" | "error";
  copy: CommitFeedCopy;
  variant?: "inline" | "panel";
}) {
  return (
    <div className={`commit-feed ${variant === "panel" ? "commit-feed-panel" : ""}`}>
      <div className="commit-feed-heading">
        <Github size={16} />
        <span>{copy.heading}</span>
      </div>
      {variant === "panel" && (
        <div className="commit-feed-stats">
          {copy.stats.map((stat) => (
            <span key={stat}>{stat}</span>
          ))}
        </div>
      )}

      {status === "loading" && <p>{copy.loading}</p>}
      {status === "error" && <p>{copy.error}</p>}
      {status === "ready" &&
        commits.map((commit) => {
          const message = commit.commit.message.split("\n")[0];
          return (
            <a key={commit.sha} href={commit.html_url} target="_blank" rel="noreferrer">
              <span>{message}</span>
              <small>{commit.sha.slice(0, 7)}</small>
            </a>
          );
        })}
    </div>
  );
}

function GalleryModal({
  gallery,
  copy,
  onClose,
  onMove,
  onSelect,
}: {
  gallery: GalleryState;
  copy: GalleryCopy;
  onClose: () => void;
  onMove: (direction: number) => void;
  onSelect: (index: number) => void;
}) {
  const { project, index } = gallery;
  const image = project.images[index];

  return (
    <div className="gallery-modal" role="dialog" aria-modal="true" aria-label={`${copy.modalLabel} ${project.title}`}>
      <button className="gallery-backdrop" type="button" aria-label={copy.closeBackdrop} onClick={onClose} />
      <div className="gallery-panel">
        <div className="gallery-header">
          <div>
            <span>{project.eyebrow}</span>
            <strong>{project.title}</strong>
          </div>
          <button className="icon-button" type="button" aria-label={copy.close} onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="gallery-stage">
          <button className="gallery-nav previous" type="button" aria-label={copy.previous} onClick={() => onMove(-1)}>
            <ArrowLeft size={20} />
          </button>
          <img
            key={image}
            src={image}
            alt={`${project.title} - ${copy.imageAlt} ${index + 1}`}
            decoding="async"
          />
          <button className="gallery-nav next" type="button" aria-label={copy.next} onClick={() => onMove(1)}>
            <ArrowRight size={20} />
          </button>
        </div>

        <div className="gallery-thumbs">
          {project.images.map((thumb, thumbIndex) => (
            <button
              key={thumb}
              type="button"
              className={thumbIndex === index ? "is-active" : ""}
              onClick={() => onSelect(thumbIndex)}
              aria-label={`${copy.viewImage} ${thumbIndex + 1}`}
            >
              <img src={thumb} alt="" loading="lazy" decoding="async" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
