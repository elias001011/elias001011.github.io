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
  connecta: "https://connectadigital.netlify.app/",
  avatar: profileImage,
};

const palettes = [
  { id: "green", label: "Verde", hint: "Connecta", swatch: "#67d390" },
  { id: "blue", label: "Azul", hint: "Meteor", swatch: "#8bbcff" },
  { id: "black", label: "Preto", hint: "Clean", swatch: "#f3f3ee" },
  { id: "graphite", label: "Grafite", hint: "Neutro", swatch: "#bcc6d4" },
  { id: "meraki", label: "Meraki", hint: "Café", swatch: "#a9c98a" },
] as const;

type PaletteId = (typeof palettes)[number]["id"];

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

const sonarImages = [
  new URL("../Sonar/image.png", import.meta.url).href,
  new URL("../Sonar/image copy.png", import.meta.url).href,
  new URL("../Sonar/image copy 2.png", import.meta.url).href,
];

const climovaImages = [
  new URL("../Climova/image.png", import.meta.url).href,
  new URL("../Climova/image copy.png", import.meta.url).href,
  new URL("../Climova/image copy 2.png", import.meta.url).href,
  new URL("../Climova/image copy 3.png", import.meta.url).href,
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

const merakiImages = [
  new URL("../Meraki/image.png", import.meta.url).href,
  new URL("../Meraki/image copy.png", import.meta.url).href,
  new URL("../Meraki/image copy 2.png", import.meta.url).href,
  new URL("../Meraki/image copy 3.png", import.meta.url).href,
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

type Project = {
  id: string;
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

const projects: Project[] = [
  {
    id: "meteor",
    title: "Meteor",
    eyebrow: "Projeto solo",
    subtitle: "Inteligência climática com IA generativa.",
    description:
      "PWA de clima em tempo real com assistente contextual, alertas, dados de múltiplas fontes e BFF em Netlify Functions para proteger chaves de API.",
    role: "Produto, interface, arquitetura full stack e integrações serverless.",
    stack: ["React", "TypeScript", "Vite", "Tailwind", "Gemini", "Netlify"],
    metrics: ["PWA", "IA contextual", "BFF seguro"],
    images: meteorImages,
    live: "https://meteor-ai.netlify.app",
    repo: "https://github.com/elias001011/Meteor",
  },
  {
    id: "meteor-landing",
    title: "Meteor Landing Page",
    eyebrow: "Projeto solo",
    subtitle: "Apresentação oficial do ecossistema Meteor.",
    description:
      "Landing page com narrativa em slides, scroll pinning, galerias e contexto sobre alertas climáticos no Rio Grande do Sul.",
    role: "Design visual, copy, animações de scroll e implementação completa.",
    stack: ["React", "TypeScript", "GSAP", "Framer Motion", "Lucide"],
    metrics: ["8 slides", "ScrollTrigger", "Responsivo"],
    images: meteorLandingImages,
    live: "https://sobre-meteor-ai.netlify.app",
    repo: "https://github.com/elias001011/Meteor-LandingPage",
    reverse: true,
  },
  {
    id: "sonar",
    title: "SonarCloud",
    eyebrow: "Projeto solo",
    subtitle: "Player minimalista de paisagens sonoras.",
    description:
      "Aplicação para relaxar, focar ou dormir com sons ambientes, timer com fade out, temas visuais e integração com SoundCloud.",
    role: "Interface, experiência de áudio, temas e fluxo principal do player.",
    stack: ["React", "TypeScript", "Vite", "Tailwind", "SoundCloud API"],
    metrics: ["Timer", "Temas", "Player fixo"],
    images: sonarImages,
    live: "https://sonar-cloud.netlify.app",
    repo: "https://github.com/elias001011/SonarCloud",
  },
  {
    id: "climova",
    title: "Climova",
    eyebrow: "Projeto solo",
    subtitle: "Clima simples, visual moderno e mini IA.",
    description:
      "Um dos primeiros projetos: dashboard de previsão do tempo com glassmorphism, recomendações automáticas e funções serverless para APIs externas.",
    role: "Primeira base sólida em interface, API de clima e deploy serverless.",
    stack: ["HTML", "CSS", "JavaScript", "Netlify Functions", "OpenWeather"],
    metrics: ["5 dias", "Mini IA", "Unsplash"],
    images: climovaImages,
    live: "https://climova.netlify.app",
    repo: "https://github.com/elias001011/Climova",
    reverse: true,
  },
  {
    id: "apice",
    title: "Ápice",
    eyebrow: "Connecta",
    subtitle: "Plataforma de estudos para o ENEM 100% movida por IA.",
    description:
      "Projeto do ecossistema Connecta criado para apoiar a preparação para o ENEM com recursos inteligentes, geração de conteúdo e fluxos personalizados de estudo.",
    role: "Desenvolvimento full stack, experiência de estudo, IA e integrações do app.",
    stack: ["React", "Vite", "tldraw", "jsPDF", "Netlify Identity"],
    metrics: ["Connecta", "Canvas", "Exportação"],
    images: apiceImages,
    live: "https://apice-ai.netlify.app",
    repo: "https://github.com/elias001011/Apice",
  },
  {
    id: "meraki",
    title: "Meraki",
    eyebrow: "Connecta",
    subtitle: "Landing page para cafeteria local.",
    description:
      "Site feito inteiramente por mim para uma cafeteria de Sarandi, com galeria, SEO básico, newsletter, Google Analytics e uma experiência visual acolhedora.",
    role: "Design, desenvolvimento, SEO inicial e publicação dentro da Connecta.",
    stack: ["React", "SEO", "Analytics", "Newsletter", "Netlify"],
    metrics: ["Cafeteria", "SEO básico", "Analytics"],
    images: merakiImages,
    live: "https://merakisarandi.netlify.app/",
    repo: "https://github.com/elias001011/meraki-landing",
    reverse: true,
  },
  {
    id: "my-computer",
    title: "My Computer",
    eyebrow: "Projeto solo",
    subtitle: "Painel self-hosted para conversar com IA e usar tools locais.",
    description:
      "Aplicação local em Node.js com painel HTML/CSS/JS puro, chats com IA, memória persistente, anexos, múltiplos providers, tools de terminal com aprovação e runtime separado em ~/.my-computer.",
    role: "Produto, arquitetura local-first, UI do painel, servidor Node/CLI, storage local e integração com providers e tools.",
    stack: ["Node.js", "JavaScript", "HTML", "CSS", "CLI", "Ollama"],
    metrics: ["Self-hosted", "Tools aprovadas", "Multi-provider"],
    images: myComputerImages,
    repo: "https://github.com/elias001011/my-computer",
  },
  {
    id: "musify-desktop-port",
    title: "Musify Desktop Port",
    eyebrow: "Port desktop",
    subtitle: "Port desktop não oficial do Musify para Windows e Linux.",
    description:
      "Downstream do gokadzev/Musify que mantém o app upstream o mais intacto possível e adiciona suporte desktop: targets Flutter para Windows/Linux, playback via media_kit, pacotes instaláveis e updater pelas releases deste repo.",
    role: "Compatibilidade desktop, empacotamento Linux/Windows, workflows de release e guards para APIs Android-only.",
    stack: ["Flutter", "Dart", "media_kit", "Windows", "Linux", "GitHub Actions"],
    metrics: ["v10.0.8", "Windows/Linux", "Sync upstream"],
    images: musifyDesktopImages,
    live: "https://github.com/elias001011/Musify-Desktop-Port/releases",
    liveLabel: "Downloads",
    repo: "https://github.com/elias001011/Musify-Desktop-Port",
    reverse: true,
  },
  {
    id: "musify",
    title: "Musify",
    eyebrow: "Open source",
    subtitle: "Streaming de música open source para Android.",
    description:
      "Mais de 25 commits e 1500+ linhas em um projeto de streaming de música open-source, incluindo correções de playback, fila, offline, acessibilidade e localização pt-BR.",
    role: "Correções reais em produto usado por outras pessoas, com PRs revisados e mergeados.",
    stack: ["Flutter", "Dart", "Android", "i18n", "Acessibilidade"],
    metrics: ["25+ commits", "1500+ linhas", "Projeto usado"],
    images: [],
    live: "https://gokadzev.github.io/Musify/",
    repo: "https://github.com/gokadzev/Musify",
    openSource: true,
  },
];

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
  const [gallery, setGallery] = useState<GalleryState | null>(null);
  const [commits, setCommits] = useState<GithubCommit[]>([]);
  const [commitStatus, setCommitStatus] = useState<"loading" | "ready" | "error">(
    "loading",
  );

  useEffect(() => {
    const storedPalette = window.localStorage.getItem("elias-palette") as
      | PaletteId
      | null;
    if (storedPalette && palettes.some((palette) => palette.id === storedPalette)) {
      setPaletteId(storedPalette);
    }
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = paletteId;
    window.localStorage.setItem("elias-palette", paletteId);
  }, [paletteId]);

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

  const navItems = [
    { label: "Início", href: "#inicio" },
    { label: "Projetos", href: "#projetos" },
    { label: "Sobre", href: "#sobre" },
    { label: "Contato", href: "#contato" },
  ];

  const activePalette = palettes.find((palette) => palette.id === paletteId)!;

  function choosePalette(nextPalette: PaletteId) {
    setPaletteId(nextPalette);
    setPaletteOpen(false);
    setThemePulse(false);
    window.setTimeout(() => setThemePulse(true), 0);
    window.setTimeout(() => setThemePulse(false), 520);
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

  return (
    <>
      <header className={`site-header ${isScrolled ? "is-scrolled" : ""}`}>
        <nav className="nav-shell" aria-label="Navegação principal">
          <a className="brand" href="#inicio" onClick={() => setMenuOpen(false)}>
            <span className="brand-mark">E</span>
            <span>
              <strong>Elias</strong>
              <small>Portfólio</small>
            </span>
          </a>

          <div className="nav-links">
            {navItems.map((item) => (
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
                aria-label="Selecionar paleta de cores"
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

            <a className="nav-cta" href={`mailto:${profile.email}`}>
              <Mail size={16} />
              Contato
            </a>

            <button
              className="icon-button mobile-menu-button"
              type="button"
              aria-label="Abrir menu"
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((current) => !current)}
            >
              {menuOpen ? <X size={19} /> : <Menu size={19} />}
            </button>
          </div>
        </nav>

        {menuOpen && (
          <div className="mobile-menu">
            {navItems.map((item) => (
              <a key={item.href} href={item.href} onClick={() => setMenuOpen(false)}>
                {item.label}
              </a>
            ))}
            <a href={profile.github} target="_blank" rel="noreferrer">
              GitHub <ExternalLink size={15} />
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
                Disponível para vagas
              </span>
              <h1>{profile.name}</h1>
              <p className="hero-lead">
                Desenvolvedor full stack de {age} anos, sócio da Connecta e focado
                em transformar ideias em produtos web completos, do front ao backend
                serverless.
              </p>

              <div className="hero-actions">
                <a className="primary-button" href="#projetos">
                  <ArrowDown size={18} />
                  Conhecer projetos
                </a>
                <a className="ghost-button" href={`mailto:${profile.email}`}>
                  <Mail size={18} />
                  Falar comigo
                </a>
              </div>

              <div className="social-row" aria-label="Links sociais">
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

            <div className="hero-visual" aria-label="Foto de Elias">
              <div className="avatar-frame">
                <img
                  src={profile.avatar}
                  alt="Elias J. R. Nunes"
                  fetchPriority="high"
                  decoding="async"
                />
              </div>
            </div>
          </div>
        </section>

        <section className="about-section snap-section motion-track motion-about" id="sobre">
          <div className="section-heading">
            <span>Sobre</span>
            <h2>Simples no visual, direto no que importa.</h2>
          </div>

          <div className="about-grid">
            <article className="about-panel">
              <h3>Quem eu sou</h3>
              <p>
                Eu construo interfaces, landings e produtos web com atenção à
                experiência, performance, backend serverless e deploy. Minha base
                passa por React, TypeScript, APIs, Netlify Functions e projetos
                reais publicados.
              </p>
              <ul>
                <li>
                  <CheckCircle2 size={18} />
                  Aberto para oportunidades e projetos.
                </li>
                <li>
                  <CheckCircle2 size={18} />
                  Projetos solo com app, landing, APIs, funções e deploy.
                </li>
                <li>
                  <CheckCircle2 size={18} />
                  Contribuições open-source em app usado por outras pessoas.
                </li>
              </ul>
            </article>

            <article className="connecta-panel">
              <span className="panel-icon">
                <Building2 size={22} />
              </span>
              <h3>Connecta</h3>
              <p>
                A Connecta é uma empresa digital brasileira com CNPJ, criada com
                foco em sites, sistemas e experiências digitais para negócios
                locais. Eu faço parte como sócio e desenvolvedor.
              </p>
              <a className="text-link" href={profile.connecta} target="_blank" rel="noreferrer">
                Visitar site da Connecta
                <ExternalLink size={16} />
              </a>
            </article>
          </div>
        </section>

        <section className="projects-intro snap-section motion-track motion-intro" id="projetos">
          <div className="projects-intro-copy">
            <span>Projetos</span>
            <h2>Trabalhos publicados, com contexto e link real.</h2>
          </div>
          <div className="projects-intro-side">
            <div className="hero-scope-card" aria-label="Resumo técnico">
              <span className="scope-kicker">Na prática</span>
              <div>
                <span>
                  <Code2 size={17} />
                  Interfaces React
                </span>
                <span>
                  <ServerCog size={17} />
                  APIs e Functions
                </span>
                <span>
                  <Rocket size={17} />
                  Deploy real
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
            <span>Em construção</span>
            <h2>Vem mais por aí.</h2>
            <p>
              Novos produtos, melhorias nos projetos atuais e mais contribuições
              open-source devem aparecer por aqui conforme forem ficando prontos.
            </p>
          </div>
          <a className="ghost-button" href={profile.github} target="_blank" rel="noreferrer">
            <Github size={18} />
            Acompanhar no GitHub
          </a>
        </section>

        <section className="contact-section snap-section motion-track motion-contact" id="contato">
          <div className="contact-copy">
            <span>Contato</span>
            <h2>Vamos conversar.</h2>
            <p>
              Para vagas, freelas, parceria pela Connecta ou feedback nos
              projetos, esses são os melhores caminhos.
            </p>
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
          <span>Todos os direitos reservados.</span>
        </div>
        <a href={profile.instagram} target="_blank" rel="noreferrer">
          Desenvolvido por @elias_jrnunes
        </a>
      </footer>

      {gallery && (
        <GalleryModal
          gallery={gallery}
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
  commits,
  commitStatus,
  onOpenGallery,
}: {
  project: Project;
  index: number;
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
          <CommitFeed commits={commits} status={commitStatus} variant="panel" />
        ) : (
          <div className="project-visual">
            <button
              type="button"
              className="project-image-button"
              onClick={() => onOpenGallery(currentImage)}
              aria-label={`Abrir galeria do projeto ${project.title}`}
            >
              <img
                key={project.images[currentImage]}
                src={project.images[currentImage]}
                alt={`Screenshot do projeto ${project.title}`}
                loading="lazy"
                decoding="async"
              />
              <span className="gallery-badge">
                <Images size={17} />
                {project.images.length > 1
                  ? `${currentImage + 1} / ${project.images.length}`
                  : "Ver projeto"}
              </span>
            </button>

            {hasSlideshow && (
              <div className="slideshow-controls" aria-label={`Slideshow ${project.title}`}>
                <button type="button" aria-label="Imagem anterior" onClick={showPreviousImage}>
                  <ArrowLeft size={17} />
                </button>
                <div className="slide-dots">
                  {project.images.map((image, imageIndex) => (
                    <button
                      key={image}
                      type="button"
                      className={imageIndex === currentImage ? "is-active" : ""}
                      aria-label={`Mostrar imagem ${imageIndex + 1}`}
                      onClick={() => setCurrentImage(imageIndex)}
                    />
                  ))}
                </div>
                <button type="button" aria-label="Próxima imagem" onClick={showNextImage}>
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
                {project.liveLabel ?? "Site ao vivo"}
              </a>
            )}
            {project.repo && (
              <a className="ghost-button small" href={project.repo} target="_blank" rel="noreferrer">
                <Github size={17} />
                Repositório
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
  variant = "inline",
}: {
  commits: GithubCommit[];
  status: "loading" | "ready" | "error";
  variant?: "inline" | "panel";
}) {
  return (
    <div className={`commit-feed ${variant === "panel" ? "commit-feed-panel" : ""}`}>
      <div className="commit-feed-heading">
        <Github size={16} />
        <span>Commits recentes</span>
      </div>
      {variant === "panel" && (
        <div className="commit-feed-stats">
          <span>25+ commits</span>
          <span>1500+ linhas</span>
          <span>Open source</span>
        </div>
      )}

      {status === "loading" && <p>Carregando atividade recente...</p>}
      {status === "error" && (
        <p>25+ commits confirmados no projeto. O GitHub pode limitar chamadas anônimas.</p>
      )}
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
  onClose,
  onMove,
  onSelect,
}: {
  gallery: GalleryState;
  onClose: () => void;
  onMove: (direction: number) => void;
  onSelect: (index: number) => void;
}) {
  const { project, index } = gallery;
  const image = project.images[index];

  return (
    <div className="gallery-modal" role="dialog" aria-modal="true" aria-label={`Galeria ${project.title}`}>
      <button className="gallery-backdrop" type="button" aria-label="Fechar galeria" onClick={onClose} />
      <div className="gallery-panel">
        <div className="gallery-header">
          <div>
            <span>{project.eyebrow}</span>
            <strong>{project.title}</strong>
          </div>
          <button className="icon-button" type="button" aria-label="Fechar" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="gallery-stage">
          <button className="gallery-nav previous" type="button" aria-label="Imagem anterior" onClick={() => onMove(-1)}>
            <ArrowLeft size={20} />
          </button>
          <img
            key={image}
            src={image}
            alt={`${project.title} - imagem ${index + 1}`}
            decoding="async"
          />
          <button className="gallery-nav next" type="button" aria-label="Próxima imagem" onClick={() => onMove(1)}>
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
              aria-label={`Ver imagem ${thumbIndex + 1}`}
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
