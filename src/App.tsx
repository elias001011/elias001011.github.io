import {
  Accessibility,
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  AudioLines,
  Building2,
  Check,
  ChevronDown,
  Disc3,
  Download,
  Github,
  Globe2,
  History,
  House,
  Images,
  Instagram,
  Keyboard,
  LayoutGrid,
  Linkedin,
  ListMusic,
  Mail,
  MicVocal,
  MonitorSmartphone,
  Palette,
  PictureInPicture2,
  Play,
  RotateCcw,
  Sparkles,
  Wifi,
  X,
  type LucideIcon,
} from "lucide-react";
import { Fragment, useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import connectaWordmark from "./assets/brand/connecta-logo-branca.svg";
import hostingerBadge from "./assets/brand/hostinger-partner-badge-dark.svg";
import {
  languages,
  musify,
  profile,
  profileImage,
  projectLinks,
  projectText,
  siteCopy,
  zenify,
  type Copy,
  type LanguageId,
  type ProjectId,
} from "./content";
import { useScrollMotion } from "./motion";
import { ParticleShape } from "./ParticleShape";
import { NowPlayingBar, ZenMusicPanel, useZenPlayer, type ZenPlayer } from "./ZenMusic";

const palettes = [
  { id: "green", label: "Verde", hint: "Connecta", swatch: "#67d390" },
  { id: "blue", label: "Azul", hint: "Meteor", swatch: "#8bbcff" },
  { id: "black", label: "Preto", hint: "Clean", swatch: "#f3f3ee" },
  { id: "graphite", label: "Grafite", hint: "Neutro", swatch: "#bcc6d4" },
  { id: "cafeteria", label: "Cafeteria", hint: "Quente", swatch: "#a9c98a" },
] as const;

type PaletteId = (typeof palettes)[number]["id"];

type Project = {
  id: ProjectId;
  title: string;
  tag: string;
  subtitle: string;
  description: string;
  stack: string[];
  liveLabel?: string;
  images: string[];
  live?: string;
  repo?: string;
  phone?: boolean;
};

type GalleryState = { project: Project; index: number };

type GithubCommit = {
  sha: string;
  html_url: string;
  commit: { message: string };
};

type LiveStats = {
  prs: number;
  commits: number;
  stars: number;
  version: string;
};

const navIcons: LucideIcon[] = [House, Building2, AudioLines, LayoutGrid, Mail];
const highlightIcons: LucideIcon[] = [History, MicVocal, PictureInPicture2, ListMusic, MonitorSmartphone, RotateCcw, Accessibility];
const featureIcons: LucideIcon[] = [Sparkles, AudioLines, Disc3, Wifi, Download, Keyboard];
const techMarquee = ["Flutter", "Dart", "React", "TypeScript", "Node.js", "Netlify Functions", "Firebase", "Android", "Linux", "Windows", "GitHub Actions", "Python", "media_kit", "Vite"];

const HOSTINGER = "https://www.hostinger.com/br?REFERRALCODE=HNWPKDASIGKR";

function readStored(key: string) {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function writeStored(key: string, value: string) {
  try {
    window.localStorage.setItem(key, value);
  } catch {
    /* modo privado: segue sem lembrar */
  }
}

function initialLanguage(): LanguageId {
  const stored = readStored("elias-language");
  if (languages.some((option) => option.id === stored)) return stored as LanguageId;
  const browser = navigator.language.slice(0, 2);
  return languages.some((option) => option.id === browser) ? (browser as LanguageId) : "pt";
}

function initialPalette(): PaletteId {
  // "meraki" era o nome antigo da paleta Cafeteria
  const stored = readStored("elias-palette")?.replace("meraki", "cafeteria");
  return palettes.some((palette) => palette.id === stored) ? (stored as PaletteId) : "green";
}

const fill = (text: string, stats: LiveStats) =>
  text.replace("{prs}", String(stats.prs)).replace("{stars}", String(stats.stars));

/* Números ao vivo do GitHub, com cache de 30 min para não gastar o limite
   anônimo da API. Se algo falhar, fica o valor mínimo já conferido. */
function useLiveStats() {
  const [stats, setStats] = useState<LiveStats>(() => {
    const base: LiveStats = { ...musify.fallback, version: zenify.fallbackVersion };
    try {
      const cached = JSON.parse(readStored("elias-gh-stats") ?? "null") as { at: number; stats: LiveStats } | null;
      if (cached && Date.now() - cached.at < 30 * 60 * 1000) return { ...base, ...cached.stats };
    } catch {
      /* cache inválido: ignora */
    }
    return base;
  });

  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;
    const api = "https://api.github.com";
    const json = (url: string) => fetch(url, { signal }).then((r) => (r.ok ? r.json() : Promise.reject(r.status)));

    const prs = json(`${api}/search/issues?q=repo:gokadzev/Musify+author:elias001011+is:pr+is:merged&per_page=1`).then(
      (data: { total_count?: number }) => data.total_count,
    );
    const commits = fetch(`${api}/repos/gokadzev/Musify/commits?author=elias001011&per_page=1`, { signal }).then((r) => {
      if (!r.ok) return Promise.reject(r.status);
      const last = r.headers.get("link")?.match(/[?&]page=(\d+)>; rel="last"/);
      return last ? Number(last[1]) : undefined;
    });
    const stars = json(`${api}/repos/gokadzev/Musify`).then((data: { stargazers_count?: number }) =>
      data.stargazers_count ? Math.floor(data.stargazers_count / 1000) : undefined,
    );
    const version = json(`${api}/repos/elias001011/Zenify/releases/latest`).then((data: { tag_name?: string }) => data.tag_name);

    Promise.allSettled([prs, commits, stars, version]).then(([p, c, s, v]) => {
      if (signal.aborted) return;
      setStats((current) => {
        const next = { ...current };
        if (p.status === "fulfilled" && p.value) next.prs = Math.max(p.value, musify.fallback.prs);
        if (c.status === "fulfilled" && c.value) next.commits = Math.max(c.value, musify.fallback.commits);
        if (s.status === "fulfilled" && s.value) next.stars = s.value;
        if (v.status === "fulfilled" && v.value) next.version = v.value;
        writeStored("elias-gh-stats", JSON.stringify({ at: Date.now(), stats: next }));
        return next;
      });
    });

    return () => controller.abort();
  }, []);

  return stats;
}

function App() {
  const [language, setLanguage] = useState<LanguageId>(initialLanguage);
  const [paletteId, setPaletteId] = useState<PaletteId>(initialPalette);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [gallery, setGallery] = useState<GalleryState | null>(null);
  const [commits, setCommits] = useState<GithubCommit[]>([]);
  const [commitStatus, setCommitStatus] = useState<"loading" | "ready" | "error">("loading");
  const paletteRef = useRef<HTMLDivElement>(null);
  const stats = useLiveStats();

  const copy = siteCopy[language];
  const activePalette = palettes.find((palette) => palette.id === paletteId) ?? palettes[0];

  const projects = useMemo(() => {
    const build = (id: ProjectId): Project => ({ id, ...projectLinks[id], ...projectText[language][id] });
    return Object.fromEntries(
      (Object.keys(projectLinks) as ProjectId[]).map((id) => [id, build(id)]),
    ) as Record<ProjectId, Project>;
  }, [language]);

  useScrollMotion(language);

  const player = useZenPlayer();

  // sem tela de carregamento: as entradas do topo começam assim que monta
  useEffect(() => {
    const start = () => {
      document.body.classList.add("ready");
      const target = window.location.hash && document.getElementById(window.location.hash.slice(1));
      if (target) target.scrollIntoView({ behavior: "auto" });
    };
    const timer = window.setTimeout(start, 60);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    document.documentElement.lang = copy.locale;
    writeStored("elias-language", language);
  }, [copy.locale, language]);

  useEffect(() => {
    document.documentElement.dataset.theme = paletteId;
    writeStored("elias-palette", paletteId);
  }, [paletteId]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.classList.toggle("menu-locked", menuOpen);
  }, [menuOpen]);

  useEffect(() => {
    if (!paletteOpen) return;
    const onPointer = (event: PointerEvent) => {
      if (!paletteRef.current?.contains(event.target as Node)) setPaletteOpen(false);
    };
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && setPaletteOpen(false);
    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [paletteOpen]);

  useEffect(() => {
    const controller = new AbortController();
    fetch("https://api.github.com/repos/gokadzev/Musify/commits?author=elias001011&per_page=5", {
      signal: controller.signal,
    })
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
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setGallery(null);
      if (event.key === "ArrowRight") moveGallery(1);
      if (event.key === "ArrowLeft") moveGallery(-1);
    };
    document.body.classList.add("menu-locked");
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.classList.remove("menu-locked");
      window.removeEventListener("keydown", onKey);
    };
  }, [gallery]);

  function moveGallery(direction: number) {
    setGallery((current) => {
      if (!current) return current;
      const length = current.project.images.length;
      return { project: current.project, index: (current.index + direction + length) % length };
    });
  }

  const openGallery = (project: Project, index: number) => setGallery({ project, index });

  return (
    <>
      <Cursor />
      <header className={`navbar ${scrolled ? "scrolled" : ""} ${menuOpen ? "menu-open" : ""}`}>
        <nav className="navbar-inner" aria-label={copy.navLabel}>
          <a className="brand" href="#inicio" onClick={() => setMenuOpen(false)}>
            <span className="brand-avatar">
              <img src={profileImage} alt="" decoding="async" />
            </span>
            <span className="brand-word mono" aria-label="Elias">
              {"ELIAS".split("").map((letter, index) => (
                <i key={index} style={{ "--i": index } as CSSProperties}>
                  {letter}
                </i>
              ))}
            </span>
          </a>

          <div className="navbar-links">
            {copy.nav.map((item) => (
              <a key={item.href} href={item.href}>
                {item.label}
              </a>
            ))}
          </div>

          <div className="navbar-actions">
            <div className="palette-menu" ref={paletteRef}>
              <button
                type="button"
                className="palette-trigger"
                aria-label={copy.paletteAria}
                aria-expanded={paletteOpen}
                onClick={() => setPaletteOpen((current) => !current)}
              >
                <Palette size={16} />
                <span className="palette-trigger-label">{activePalette.label}</span>
                <ChevronDown size={14} className="chevron" />
              </button>

              <div className={`palette-popover ${paletteOpen ? "is-open" : ""}`} aria-hidden={!paletteOpen}>
                <span className="popover-label mono">{copy.palette}</span>
                <div className="palette-options">
                  {palettes.map((palette) => (
                    <button
                      key={palette.id}
                      type="button"
                      tabIndex={paletteOpen ? 0 : -1}
                      className={palette.id === paletteId ? "is-active" : ""}
                      onClick={() => {
                        setPaletteId(palette.id);
                        setPaletteOpen(false);
                      }}
                    >
                      <span className="palette-swatch" style={{ backgroundColor: palette.swatch }} />
                      <span className="palette-name">
                        <strong>{palette.label}</strong>
                        <small>{palette.hint}</small>
                      </span>
                      {palette.id === paletteId && <Check size={15} />}
                    </button>
                  ))}
                </div>
                <span className="popover-label mono">
                  <Globe2 size={13} /> {copy.language}
                </span>
                <div className="language-options">
                  {languages.map((option) => (
                    <button
                      key={option.id}
                      type="button"
                      tabIndex={paletteOpen ? 0 : -1}
                      title={option.name}
                      aria-pressed={option.id === language}
                      className={option.id === language ? "is-active" : ""}
                      onClick={() => setLanguage(option.id)}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <a className="btn btn-primary nav-cta" href={`mailto:${profile.email}`}>
              {copy.contact}
            </a>
            <button
              type="button"
              className="nav-icon-btn menu-btn"
              aria-label={menuOpen ? copy.menuClose : copy.menuOpen}
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((current) => !current)}
            >
              <span className="menu-bars" aria-hidden="true">
                <i />
                <i />
                <i />
              </span>
            </button>
          </div>
        </nav>

        <div className="mobile-panel" aria-hidden={!menuOpen}>
          <div className="mobile-panel-inner">
            <div className="mobile-links">
              {copy.nav.map((item, index) => {
                const Icon = navIcons[index];
                return (
                  <a
                    key={item.href}
                    href={item.href}
                    tabIndex={menuOpen ? 0 : -1}
                    style={{ "--i": index } as CSSProperties}
                    onClick={() => setMenuOpen(false)}
                  >
                    <Icon size={18} />
                    {item.label}
                  </a>
                );
              })}
            </div>
          </div>
        </div>
        <span className="scroll-progress" />
      </header>

      <main>
        {/* ============ HERO ============ */}
        <section className="hero" id="inicio">
          <div className="container hero-grid">
            <div className="hero-copy">
              <h1 className="hero-title">
                <span className="line-mask">
                  <span className="line">Elias J. R.</span>
                </span>
                <span className="line-mask">
                  <span className="line">Nunes</span>
                </span>
              </h1>
              <div className="hero-actions reveal-line">
                <a className="btn btn-primary btn-lg" href="#zenify" data-magnetic>
                  {copy.hero.primary}
                  <ArrowRight size={16} />
                </a>
                <a className="btn btn-secondary btn-lg" href={`mailto:${profile.email}`} data-magnetic>
                  {copy.hero.secondary}
                </a>
              </div>
              <div className="social-row mono reveal-line">
                <a href={profile.github} target="_blank" rel="noreferrer">
                  <Github size={15} /> GitHub
                </a>
                <a href={profile.linkedin} target="_blank" rel="noreferrer">
                  <Linkedin size={15} /> LinkedIn
                </a>
                <a href={profile.instagram} target="_blank" rel="noreferrer">
                  <Instagram size={15} /> Instagram
                </a>
              </div>
            </div>

            <div className="hero-visual reveal-photo">
              <ParticleShape />
            </div>
          </div>
        </section>

        <Marquee items={techMarquee} className="tech-marquee" />

        {/* ============ MANIFESTO ============ */}
        <section className="manifesto section">
          <div className="container">
            <p className="manifesto-text" data-scroll-lit>
              {copy.manifesto.map(([text, strong], index) => {
                const words = text.split(" ").map((word, wordIndex) => (
                  <span className="lw" key={wordIndex}>
                    {word}{" "}
                  </span>
                ));
                return strong ? <em key={index}>{words}</em> : <span key={index}>{words}</span>;
              })}
            </p>
          </div>
        </section>

        {/* ============ CONNECTA ============ */}
        <section className="section section-line connecta-section" id="connecta">
          <div className="container">
            <div className="connecta-grid">
              <a
                className="connecta-card"
                href={profile.connectaPortfolio}
                target="_blank"
                rel="noreferrer"
                data-reveal
                data-spotlight
              >
                <ConnectaLogo />
                <h2 className="split-reveal" data-reveal>
                  <SplitWords text={copy.connecta.partner} />
                </h2>
                <span className="connecta-link mono">
                  {copy.connecta.link}
                  <ArrowUpRight size={16} />
                </span>
              </a>

              <ProjectCard
                project={projects.apice}
                copy={copy}
                tagOverride={copy.connecta.apiceTag}
                onOpen={openGallery}
              />
            </div>
          </div>
        </section>

        {/* ============ ZENIFY ============ */}
        <ZenifySection copy={copy} stats={stats} player={player} />

        {/* ============ MUSIFY ============ */}
        <section className="section section-line musify-section" id="musify">
          <div className="container">
            <div className="section-heading section-heading-wide">
              <h2 className="split-reveal" data-reveal>
                <SplitWords text={fill(copy.musify.title, stats)} />
              </h2>
              <p data-reveal>{fill(copy.musify.lead, stats)}</p>
            </div>

            <div className="musify-stats">
              <Stat value={stats.prs} label={copy.musify.stats[0]} />
              <Stat value={stats.commits} label={copy.musify.stats[1]} />
              <Stat value={musify.fallback.lines} prefix="+" label={copy.musify.stats[2]} />
            </div>

            <div className="musify-grid">
              <div className="musify-highlights" data-reveal>
                <span className="works-label mono">{copy.musify.highlightsTitle}</span>
                <ul>
                  {copy.musify.highlights.map((item, index) => {
                    const Icon = highlightIcons[index];
                    return (
                      <li key={item} style={{ "--i": index } as CSSProperties}>
                        <span className="highlight-icon">
                          <Icon size={17} />
                        </span>
                        {item}
                      </li>
                    );
                  })}
                </ul>
                <div className="row-actions">
                  <a className="btn btn-primary" href={musify.prs} target="_blank" rel="noreferrer">
                    <Github size={16} />
                    {copy.musify.prs}
                  </a>
                  <a className="btn btn-secondary" href={musify.repo} target="_blank" rel="noreferrer">
                    {copy.musify.repo}
                    <ArrowUpRight size={15} />
                  </a>
                </div>
              </div>

              <div className="terminal" data-reveal>
                <div className="terminal-bar mono">
                  <span className="dots">
                    <i />
                    <i />
                    <i />
                  </span>
                  gokadzev/Musify
                </div>
                <div className="terminal-body mono">
                  <p className="terminal-cmd">
                    <span>$</span> git log --author=elias001011 --oneline
                  </p>
                  {commitStatus === "loading" && <p className="terminal-muted">{copy.musify.loading}</p>}
                  {commitStatus === "error" && <p className="terminal-muted">{copy.musify.error}</p>}
                  {commitStatus === "ready" &&
                    commits.map((commit, index) => (
                      <a
                        key={commit.sha}
                        href={commit.html_url}
                        target="_blank"
                        rel="noreferrer"
                        style={{ "--i": index } as CSSProperties}
                      >
                        <span className="sha">{commit.sha.slice(0, 7)}</span>
                        <span className="msg">{commit.commit.message.split("\n")[0]}</span>
                      </a>
                    ))}
                  <p className="terminal-cursor">
                    <span>$</span> <i />
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ============ PROJETOS ============ */}
        <section className="section projects-section" id="projetos">
          <div className="container">
            <div className="section-heading">
              <h2 className="split-reveal" data-reveal>
                <SplitWords text={copy.projects.title} />
              </h2>
            </div>

            <div className="project-pair">
              <ProjectCard project={projects["musify-desktop-port"]} copy={copy} onOpen={openGallery} />
              <ProjectCard project={projects["youtube-music-explode-dart"]} copy={copy} onOpen={openGallery} />
            </div>

            <ProjectCard project={projects["sepia-reader"]} copy={copy} onOpen={openGallery} wide />

            <div className="meteor-block">
              <div className="meteor-heading" data-reveal>
                <h3>
                  <MeteorMark /> {copy.projects.meteorTitle}
                </h3>
                <p>{copy.projects.meteorText}</p>
              </div>
              <div className="project-trio">
                <ProjectCard project={projects["meteor-landing"]} copy={copy} onOpen={openGallery} />
                <ProjectCard project={projects["meteor-flutter"]} copy={copy} onOpen={openGallery} />
                <ProjectCard project={projects.meteor} copy={copy} onOpen={openGallery} />
              </div>
            </div>

            <div className="works">
              <span className="works-label mono" data-reveal>
                {copy.projects.moreTitle}
              </span>
              <a
                className="work-row"
                href={projects["my-computer"].repo}
                target="_blank"
                rel="noreferrer"
                data-reveal
              >
                <span className="work-title">{projects["my-computer"].title}</span>
                <span className="work-sub">{projects["my-computer"].subtitle}</span>
                <span className="work-arrow">
                  <ArrowUpRight size={20} />
                </span>
              </a>
            </div>
          </div>
        </section>

        {/* ============ CONTATO ============ */}
        <section className="contact-section" id="contato">
          <div className="container contact-inner">
            <div className="contact-title-wrap">
              <span className="contact-rings" aria-hidden="true">
                <i />
                <i />
                <i />
              </span>
              <h2 className="contact-title split-reveal" data-reveal>
                <SplitWords text={copy.contactSection.title} />
              </h2>
            </div>
            <p data-reveal>{copy.contactSection.text}</p>
            <a className="btn btn-primary btn-lg contact-mail" href={`mailto:${profile.email}`} data-reveal data-magnetic>
              <Mail size={17} />
              {profile.email}
            </a>
            <div className="contact-links mono" data-reveal>
              <a href={profile.github} target="_blank" rel="noreferrer">
                <Github size={16} /> github.com/elias001011
              </a>
              <a href={profile.linkedin} target="_blank" rel="noreferrer">
                <Linkedin size={16} /> LinkedIn
              </a>
              <a href={profile.instagram} target="_blank" rel="noreferrer">
                <Instagram size={16} /> @elias_jrnunes
              </a>
            </div>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="footer-marks" aria-label="Connecta Digital e Hostinger Partner">
          <a href={profile.connectaPortfolio} target="_blank" rel="noreferrer" className="footer-connecta">
            <img src={connectaWordmark} width="220" height="37" alt="Connecta Digital" loading="lazy" decoding="async" />
          </a>
          <span className="footer-marks-divider" aria-hidden="true" />
          <a className="footer-hostinger" href={HOSTINGER} target="_blank" rel="sponsored noopener noreferrer" aria-label="Hostinger Partner">
            <img src={hostingerBadge} width="120" height="45" alt="Hostinger Partner" loading="lazy" decoding="async" />
          </a>
        </div>
        <div className="container footer-inner mono">
          <span>
            © {new Date().getFullYear()} {profile.name}. {copy.footer.rights}
          </span>
          <a href="#inicio">{copy.footer.top} ↑</a>
        </div>
      </footer>

      <NowPlayingBar player={player} copy={copy} />

      {gallery && (
        <GalleryModal
          gallery={gallery}
          copy={copy}
          onClose={() => setGallery(null)}
          onMove={moveGallery}
          onSelect={(index) => setGallery({ project: gallery.project, index })}
        />
      )}
    </>
  );
}

/* ============================================================
   ZENIFY — a seção de destaque
   ============================================================ */

function ZenifySection({ copy, stats, player }: { copy: Copy; stats: LiveStats; player: ZenPlayer }) {
  const zen = copy.zen;
  return (
    <section className="zen" id="zenify">
      <div className="zen-eq" aria-hidden="true">
        {Array.from({ length: 48 }, (_, index) => (
          <i key={index} style={{ "--i": index } as CSSProperties} />
        ))}
      </div>

      <div className="container zen-intro">
        <div data-reveal>
          <ZenIcon />
        </div>
        <h2 className="zen-title" data-reveal aria-label="Zenify">
          {"Zenify".split("").map((letter, index) => (
            <span key={index} style={{ "--i": index } as CSSProperties} aria-hidden="true">
              <b>{letter}</b>
            </span>
          ))}
        </h2>
        <p className="zen-tagline split-reveal" data-reveal>
          <SplitWords text={zen.tagline} />
        </p>
        <p className="zen-lead" data-reveal>
          {zen.lead}
        </p>
        <div className="zen-actions" data-reveal>
          <a className="btn btn-zen btn-lg" href={zenify.download} target="_blank" rel="noreferrer" data-magnetic>
            <Download size={17} />
            {zen.download}
          </a>
          <a className="btn btn-secondary btn-lg" href={zenify.repo} target="_blank" rel="noreferrer" data-magnetic>
            <Github size={17} />
            {zen.code}
          </a>
        </div>
        <div className="zen-meta mono" data-reveal>
          <span className="status-chip zen-chip">
            <span className="eyebrow-dot" />
            {zen.latest} {stats.version}
          </span>
          {zen.platforms.map((platform) => (
            <span className="status-chip" key={platform}>
              {platform}
            </span>
          ))}
        </div>
      </div>

      {/* vitrine: a janela levanta com a rolagem, os celulares flutuam */}
      <div className="zen-showcase" data-scroll>
        <div className="container zen-showcase-inner">
          <div className="zen-window">
            <div className="zen-window-bar mono">
              <span className="dots">
                <i />
                <i />
                <i />
              </span>
              Zenify — Linux
            </div>
            <img src={zenify.desktop.home} alt={zen.showcaseAlt} loading="lazy" decoding="async" />
          </div>
          <div className="zen-phone phone-left">
            <img src={zenify.mobile[4].src} alt="" loading="lazy" decoding="async" />
          </div>
          <div className="zen-phone phone-right">
            <img src={zenify.mobile[1].src} alt="" loading="lazy" decoding="async" />
          </div>
          <div className="now-playing mono" aria-hidden="true">
            <span className="now-playing-cover">
              <img src={zenify.mobile[4].src} alt="" loading="lazy" decoding="async" />
            </span>
            <span className="now-playing-body">
              <span className="now-playing-label">{zen.nowPlaying}</span>
              <span className="now-playing-bar">
                <i />
              </span>
            </span>
            <span className="now-playing-wave">
              {Array.from({ length: 9 }, (_, index) => (
                <i key={index} style={{ "--i": index } as CSSProperties} />
              ))}
            </span>
            <span className="now-playing-play">
              <Play size={13} />
            </span>
          </div>
        </div>
      </div>

      <Marquee items={zen.marquee} className="zen-marquee" />
      <Marquee items={[...zen.marquee].reverse()} className="zen-marquee is-reverse" />

      <div className="container">
        <h3 className="zen-subtitle split-reveal" data-reveal>
          <SplitWords text={zen.player.title} />
        </h3>
        <ZenMusicPanel player={player} copy={copy} />

        <div className="zen-origin">
          <h3 className="split-reveal" data-reveal>
            <SplitWords text={zen.originTitle} />
          </h3>
          <ol className="timeline" data-reveal>
            {zen.origin.map((step, index) => (
              <li key={step.title} style={{ "--i": index } as CSSProperties}>
                <span className="timeline-date mono">{step.date}</span>
                <strong>{step.title}</strong>
                <p>{fill(step.text, stats)}</p>
              </li>
            ))}
          </ol>
        </div>

        <h3 className="zen-subtitle split-reveal" data-reveal>
          <SplitWords text={zen.featuresTitle} />
        </h3>
        <div className="zen-features">
          {zen.features.map((feature, index) => {
            const Icon = featureIcons[index];
            return (
              // o wrapper entra na tela; o card de dentro inclina em 3D com o mouse
              <div key={feature.title} className="zen-feature-wrap" data-reveal style={{ "--i": index } as CSSProperties}>
                <article className={`zen-feature f${index + 1}`} data-tilt data-spotlight>
                  <span className="zen-feature-icon">
                    <Icon size={20} />
                  </span>
                  <h4>{feature.title}</h4>
                  <p>{feature.text}</p>
                  {index === 1 && <Waveform />}
                  {index === 3 && <SyncDots />}
                </article>
              </div>
            );
          })}
        </div>

        <div className="zen-shots">
          <figure className="zen-shot" data-reveal>
            <img src={zenify.desktop.player} alt="" loading="lazy" decoding="async" />
          </figure>
          <figure className="zen-shot" data-reveal style={{ "--i": 1 } as CSSProperties}>
            <img src={zenify.desktop.moods} alt="" loading="lazy" decoding="async" />
          </figure>
        </div>
      </div>

      <div className="zen-phones" data-scroll>
        <div className="container">
          <h3 className="zen-subtitle split-reveal" data-reveal>
            <SplitWords text={zen.phonesTitle} />
          </h3>
        </div>
        <div className="zen-phones-track">
          {zenify.mobile.map((phone, index) => (
            <figure key={phone.key} className="zen-phone-card" style={{ "--i": index } as CSSProperties}>
              <img src={phone.src} alt={zen.phones[phone.key]} loading="lazy" decoding="async" />
              <figcaption className="mono">{zen.phones[phone.key]}</figcaption>
            </figure>
          ))}
        </div>
      </div>

      <div className="container">
        <span className="works-label mono zen-compare-label" data-reveal>
          {zen.compareTitle}
        </span>
        <div className="zen-compare" data-reveal>
          <div className="zen-compare-head mono">
            <span />
            <span>Musify</span>
            <span>Zenify</span>
          </div>
          {zen.compare.map(([label, before, after], index) => (
            <div className="zen-compare-row" key={label} style={{ "--i": index } as CSSProperties}>
              <span className="mono">{label}</span>
              <span>{before}</span>
              <span>{after}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ZenIcon() {
  return (
    <span className="zen-icon" aria-hidden="true">
      {[0, 1, 2, 3, 4].map((bar) => (
        <i key={bar} style={{ "--i": bar } as CSSProperties} />
      ))}
    </span>
  );
}

function Waveform() {
  return (
    <span className="waveform" aria-hidden="true">
      {Array.from({ length: 28 }, (_, index) => (
        <i key={index} style={{ "--i": index } as CSSProperties} />
      ))}
    </span>
  );
}

function SyncDots() {
  return (
    <span className="sync-dots mono" aria-hidden="true">
      <b>Android</b>
      <i />
      <b>Linux</b>
      <i />
      <b>Windows</b>
    </span>
  );
}

/* ============================================================
   PEÇAS COMPARTILHADAS
   ============================================================ */

function Marquee({ items, className = "" }: { items: string[]; className?: string }) {
  // duas cópias lado a lado: a faixa anda metade da largura e recomeça sem emenda
  const row = items.map((item, index) => (
    <Fragment key={index}>
      <span>{item}</span>
      <i aria-hidden="true">✦</i>
    </Fragment>
  ));
  return (
    <div className={`marquee ${className}`} aria-hidden="true">
      <div className="marquee-inner">
        <div className="marquee-group">{row}</div>
        <div className="marquee-group">{row}</div>
      </div>
    </div>
  );
}

function SplitWords({ text }: { text: string }) {
  return (
    <>
      {text.split(" ").map((word, index) => (
        <Fragment key={index}>
          {index > 0 && " "}
          <span className="w">
            <i style={{ transitionDelay: `${index * 55}ms` }}>{word}</i>
          </span>
        </Fragment>
      ))}
    </>
  );
}

function Stat({ value, label, prefix = "" }: { value: number; label: string; prefix?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(0);
  const started = useRef(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setShown(value);
      return;
    }
    let frame = 0;
    const run = (from: number) => {
      const start = performance.now();
      const tick = (now: number) => {
        const t = Math.min((now - start) / 1400, 1);
        setShown(Math.round(from + (value - from) * (1 - Math.pow(1 - t, 3))));
        if (t < 1) frame = requestAnimationFrame(tick);
      };
      frame = requestAnimationFrame(tick);
    };
    // se o número muda depois (veio do GitHub), conta a partir do que já mostra
    if (started.current) {
      setShown((current) => {
        run(current);
        return current;
      });
      return () => cancelAnimationFrame(frame);
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        started.current = true;
        run(0);
      },
      { threshold: 0.5 },
    );
    observer.observe(node);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [value]);

  return (
    <div className="stat" ref={ref} data-reveal>
      <strong>
        {prefix}
        {shown}
      </strong>
      <span className="mono">{label}</span>
    </div>
  );
}

function ProjectCard({
  project,
  copy,
  onOpen,
  wide = false,
  tagOverride,
}: {
  project: Project;
  copy: Copy;
  onOpen: (project: Project, index: number) => void;
  wide?: boolean;
  tagOverride?: string;
}) {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const count = project.images.length;

  useEffect(() => {
    if (count < 2 || paused) return;
    const interval = window.setInterval(() => setCurrent((index) => (index + 1) % count), 3800);
    return () => window.clearInterval(interval);
  }, [count, paused]);

  const host = project.live ? new URL(project.live).host : project.repo ? "github.com" : "";

  return (
    <article
      className={`project-card ${wide ? "is-wide" : ""} ${project.phone ? "is-phone" : ""}`}
      data-reveal
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="project-media">
        <div className="project-media-bar mono">
          <span className="dots">
            <i />
            <i />
            <i />
          </span>
          <span className="host">{host}</span>
          {count > 1 && (
            <span className="counter">
              {current + 1}/{count}
            </span>
          )}
        </div>
        <button
          type="button"
          className="project-media-button"
          aria-label={`${copy.gallery.open} ${project.title}`}
          onClick={() => onOpen(project, current)}
        >
          {project.images.map((image, index) => (
            <img
              key={image}
              src={image}
              alt=""
              loading="lazy"
              decoding="async"
              className={
                index === current
                  ? "is-active"
                  : project.phone && index === (current + count - 1) % count
                    ? "is-prev"
                    : project.phone && index === (current + 1) % count
                      ? "is-next"
                      : ""
              }
            />
          ))}
          <span className="media-badge mono">
            <Images size={14} />
            {count}
          </span>
        </button>
        {count > 1 && (
          <div className="media-progress" aria-hidden="true">
            {project.images.map((image, index) => (
              <i key={image} className={index === current ? "is-active" : index < current ? "is-done" : ""} />
            ))}
          </div>
        )}
      </div>

      <div className="project-info">
        <span className="project-tag mono">{tagOverride ?? project.tag}</span>
        <h3>{project.title}</h3>
        <p className="project-subtitle">{project.subtitle}</p>
        {project.description && <p className="project-description">{project.description}</p>}
        <div className="stack-row mono">
          {project.stack.map((tech) => (
            <span key={tech}>{tech}</span>
          ))}
        </div>
        <div className="row-actions">
          {project.live && (
            <a className="btn btn-primary" href={project.live} target="_blank" rel="noreferrer">
              {project.liveLabel ?? copy.projects.live}
              <ArrowUpRight size={15} />
            </a>
          )}
          {project.repo && (
            <a
              className={`btn ${project.live ? "btn-secondary" : "btn-primary"}`}
              href={project.repo}
              target="_blank"
              rel="noreferrer"
            >
              <Github size={15} />
              {copy.projects.repo}
            </a>
          )}
        </div>
      </div>
    </article>
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
  copy: Copy;
  onClose: () => void;
  onMove: (direction: number) => void;
  onSelect: (index: number) => void;
}) {
  const { project, index } = gallery;
  const image = project.images[index];

  return (
    <div className="gallery" role="dialog" aria-modal="true" aria-label={project.title}>
      <button className="gallery-backdrop" type="button" aria-label={copy.gallery.close} onClick={onClose} />
      <div className={`gallery-panel ${project.phone ? "is-phone" : ""}`}>
        <div className="gallery-head">
          <div>
            <span className="mono">{project.tag}</span>
            <strong>{project.title}</strong>
          </div>
          <span className="mono gallery-count">
            {index + 1} / {project.images.length}
          </span>
          <button className="nav-icon-btn" type="button" aria-label={copy.gallery.close} onClick={onClose}>
            <X size={18} />
          </button>
        </div>
        <div className="gallery-stage">
          <button className="gallery-nav prev" type="button" aria-label={copy.gallery.previous} onClick={() => onMove(-1)}>
            <ArrowLeft size={18} />
          </button>
          <img key={image} src={image} alt={`${project.title} — ${copy.gallery.image} ${index + 1}`} decoding="async" />
          <button className="gallery-nav next" type="button" aria-label={copy.gallery.next} onClick={() => onMove(1)}>
            <ArrowRight size={18} />
          </button>
        </div>
        <div className="gallery-thumbs">
          {project.images.map((thumb, thumbIndex) => (
            <button
              key={thumb}
              type="button"
              className={thumbIndex === index ? "is-active" : ""}
              aria-label={`${copy.gallery.image} ${thumbIndex + 1}`}
              onClick={() => onSelect(thumbIndex)}
            >
              <img src={thumb} alt="" loading="lazy" decoding="async" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

/* Cursor da landing do Meteor: bola branca com mix-blend-mode difference, que
   segue o mouse numa mola (mesmos parâmetros do framer-motion de lá: damping 20,
   stiffness 300, mass 0.5) e cresce sobre o que é clicável. Só no desktop. */
function Cursor() {
  const outer = useRef<HTMLDivElement>(null);
  const ball = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 1024px) and (hover: hover) and (pointer: fine)");
    if (!desktop.matches) return;

    document.documentElement.classList.add("has-cursor");
    let tx = -100;
    let ty = -100;
    let x = -100;
    let y = -100;
    let vx = 0;
    let vy = 0;
    let last = performance.now();
    let frame = 0;
    const stiffness = 300;
    const damping = 20;
    const mass = 0.5;

    const loop = (now: number) => {
      const dt = Math.min((now - last) / 1000, 1 / 30);
      last = now;
      vx += ((-stiffness * (x - tx) - damping * vx) / mass) * dt;
      vy += ((-stiffness * (y - ty) - damping * vy) / mass) * dt;
      x += vx * dt;
      y += vy * dt;
      if (outer.current) outer.current.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      frame = requestAnimationFrame(loop);
    };

    const onMove = (event: MouseEvent) => {
      tx = event.clientX;
      ty = event.clientY;
      outer.current?.classList.add("is-visible");
      const target = event.target as HTMLElement | null;
      const hovering = Boolean(
        target?.closest("a, button, input, textarea, [data-hover], .zen-feature, .particle-shape"),
      );
      ball.current?.classList.toggle("is-hover", hovering);
    };
    const onLeave = () => outer.current?.classList.remove("is-visible");

    frame = requestAnimationFrame(loop);
    window.addEventListener("mousemove", onMove, { passive: true });
    document.body.addEventListener("mouseleave", onLeave);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("mousemove", onMove);
      document.body.removeEventListener("mouseleave", onLeave);
      document.documentElement.classList.remove("has-cursor");
    };
  }, []);

  return (
    <div className="cursor" ref={outer} aria-hidden="true">
      <div className="cursor-ball" ref={ball} />
    </div>
  );
}

function ConnectaLogo() {
  return (
    <svg className="connecta-logo" viewBox="0 0 215.31 189.81" aria-label="Connecta" role="img">
      <path d="M32.34,157.47h55.71l32.34,32.34H16.38c-9.05,0-16.38-7.33-16.38-16.38V16.43C0,7.35,7.35,0,16.43,0h55.27l32.34,32.34,56.6,56.59v45.37L58.68,32.34h-26.34v125.14Z" />
      <path d="M215.31,16.52v156.81c0,9.1-7.38,16.48-16.48,16.48h-58.6l-32.34-32.34-53.07-53.07v-45.9l95.96,95.96,2.77,3.01h29.56V32.34h-59.24L91.55,0h107.24c9.12,0,16.52,7.4,16.52,16.52Z" />
    </svg>
  );
}

function MeteorMark() {
  return (
    <svg className="meteor-mark" viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="16" cy="8" r="3.2" />
      <path d="M13.6 10.4 4 20M11 8.6 5.5 14M15.4 13 10 18.5" />
    </svg>
  );
}

export default App;
