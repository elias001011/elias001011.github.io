import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  AudioLines,
  Download,
  Github,
  Images,
  Instagram,
  Keyboard,
  Linkedin,
  Mail,
  Moon,
  Sparkles,
  Sun,
  Wifi,
  X,
  Disc3,
} from "lucide-react";
import { Fragment, useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
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

type Theme = "dark" | "light";

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
  commit: { message: string; author?: { date?: string } };
};

function calculateAge(birthDate: Date) {
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const hasBirthdayPassed =
    today.getMonth() > birthDate.getMonth() ||
    (today.getMonth() === birthDate.getMonth() && today.getDate() >= birthDate.getDate());
  if (!hasBirthdayPassed) age -= 1;
  return age;
}

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

function App() {
  const age = useMemo(() => calculateAge(profile.birthDate), []);
  const [language, setLanguage] = useState<LanguageId>(initialLanguage);
  const [theme, setTheme] = useState<Theme>(() =>
    document.documentElement.dataset.theme === "light" ? "light" : "dark",
  );
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [gallery, setGallery] = useState<GalleryState | null>(null);
  const [commits, setCommits] = useState<GithubCommit[]>([]);
  const [commitStatus, setCommitStatus] = useState<"loading" | "ready" | "error">("loading");
  const [zenVersion, setZenVersion] = useState(zenify.fallbackVersion);

  const copy = siteCopy[language];

  const projects = useMemo(() => {
    const build = (id: ProjectId): Project => ({ id, ...projectLinks[id], ...projectText[language][id] });
    return Object.fromEntries(
      (Object.keys(projectLinks) as ProjectId[]).map((id) => [id, build(id)]),
    ) as Record<ProjectId, Project>;
  }, [language]);

  useScrollMotion(language);

  useEffect(() => {
    document.documentElement.lang = copy.locale;
    writeStored("elias-language", language);
  }, [copy.locale, language]);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute("content", theme === "light" ? "#f0efec" : "#060607");
    writeStored("elias-theme", theme);
  }, [theme]);

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
    const controller = new AbortController();
    const { signal } = controller;

    fetch("https://api.github.com/repos/gokadzev/Musify/commits?author=elias001011&per_page=5", { signal })
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

    fetch("https://api.github.com/repos/elias001011/Zenify/releases/latest", { signal })
      .then((response) => (response.ok ? response.json() : null))
      .then((data: { tag_name?: string } | null) => {
        if (data?.tag_name) setZenVersion(data.tag_name);
      })
      .catch(() => undefined);

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

  function cycleLanguage() {
    const index = languages.findIndex((option) => option.id === language);
    setLanguage(languages[(index + 1) % languages.length].id);
  }

  const openGallery = (project: Project, index: number) => setGallery({ project, index });
  const currentLanguage = languages.find((option) => option.id === language)!;

  return (
    <>
      <Preloader />
      <Cursor />

      <header className={`navbar ${scrolled ? "scrolled" : ""} ${menuOpen ? "menu-open" : ""}`}>
        <nav className="container navbar-inner" aria-label={copy.navLabel}>
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
              <a key={item.href} href={item.href} className={item.href === "#zenify" ? "is-zen" : ""}>
                {item.label}
              </a>
            ))}
          </div>

          <div className="navbar-actions">
            <button
              type="button"
              className="nav-icon-btn mono lang-btn"
              onClick={cycleLanguage}
              aria-label={`${copy.language}: ${currentLanguage.name}`}
              title={currentLanguage.name}
            >
              {currentLanguage.label}
            </button>
            <button
              type="button"
              className="nav-icon-btn"
              onClick={() => setTheme((current) => (current === "dark" ? "light" : "dark"))}
              aria-label={copy.theme}
            >
              <span className="theme-icon" aria-hidden="true">
                <Sun className="icon-sun" />
                <Moon className="icon-moon" />
              </span>
            </button>
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
            <div className="container">
              {copy.nav.map((item, index) => (
                <a
                  key={item.href}
                  href={item.href}
                  tabIndex={menuOpen ? 0 : -1}
                  style={{ "--i": index } as CSSProperties}
                  onClick={() => setMenuOpen(false)}
                >
                  <span className="mono">{String(index + 1).padStart(2, "0")}</span>
                  {item.label}
                </a>
              ))}
            </div>
          </div>
        </div>
        <span className="scroll-progress" />
      </header>

      <main>
        {/* ============ HERO ============ */}
        <section className="hero noise" id="inicio">
          <Starfield />
          <div className="container hero-grid">
            <div className="hero-copy">
              <span className="eyebrow mono reveal-line">
                <span className="eyebrow-dot" />
                {copy.hero.eyebrow(age)}
              </span>
              <h1 className="hero-title">
                <span className="line-mask">
                  <span className="line">Elias J. R.</span>
                </span>
                <span className="line-mask">
                  <span className="line">Nunes</span>
                </span>
              </h1>
              <p className="hero-sub reveal-line">{copy.hero.lead}</p>
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

            <div className="hero-photo reveal-photo" data-tilt>
              <div className="hero-photo-frame">
                <img src={profileImage} alt={copy.hero.avatarAlt} fetchPriority="high" decoding="async" />
              </div>
              <span className="hero-photo-tag mono">
                <span className="eyebrow-dot" /> elias001011
              </span>
            </div>
          </div>
          <div className="hero-footer">
            <span className="hero-scroll-cue mono">
              {copy.hero.scroll} <i />
            </span>
          </div>
        </section>

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
            <span className="section-index mono" data-reveal>
              {copy.connecta.index}
            </span>
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
        <ZenifySection copy={copy} version={zenVersion} />

        {/* ============ MUSIFY ============ */}
        <section className="section section-line musify-section" id="musify">
          <div className="container">
            <div className="section-heading section-heading-wide">
              <span className="section-index mono" data-reveal>
                {copy.musify.index}
              </span>
              <h2 className="split-reveal" data-reveal>
                <SplitWords text={copy.musify.title} />
              </h2>
              <p data-reveal>{copy.musify.lead}</p>
            </div>

            <div className="musify-stats">
              <Stat value={musify.stats.prs} label={copy.musify.stats[0]} />
              <Stat value={musify.stats.commits} label={copy.musify.stats[1]} />
              <Stat value={musify.stats.lines} prefix="+" label={copy.musify.stats[2]} />
            </div>

            <div className="musify-grid">
              <div className="musify-highlights" data-reveal>
                <span className="works-label mono">{copy.musify.highlightsTitle}</span>
                <ul>
                  {copy.musify.highlights.map((item, index) => (
                    <li key={item}>
                      <span className="mono">{String(index + 1).padStart(2, "0")}</span>
                      {item}
                    </li>
                  ))}
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
                    commits.map((commit) => (
                      <a key={commit.sha} href={commit.html_url} target="_blank" rel="noreferrer">
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
              <span className="section-index mono" data-reveal>
                {copy.projects.index}
              </span>
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
              {(["my-computer", "sync-my-music"] as ProjectId[]).map((id) => {
                const project = projects[id];
                return (
                  <a
                    key={id}
                    className="work-row"
                    href={project.repo}
                    target="_blank"
                    rel="noreferrer"
                    data-reveal
                  >
                    <span className="work-title">
                      {project.title}
                      {project.images.length === 0 && (
                        <span className="status-chip mono">{copy.projects.soon}</span>
                      )}
                    </span>
                    <span className="work-sub">{project.subtitle}</span>
                    <span className="work-arrow">
                      <ArrowUpRight size={20} />
                    </span>
                  </a>
                );
              })}
            </div>
          </div>
        </section>

        {/* ============ CONTATO ============ */}
        <section className="contact-section noise" id="contato">
          <div className="contact-glow" aria-hidden="true" />
          <div className="container contact-inner">
            <span className="section-index mono" data-reveal>
              {copy.contactSection.index}
            </span>
            <h2 className="contact-title split-reveal" data-reveal>
              <SplitWords text={copy.contactSection.title} />
            </h2>
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
        <div className="container footer-inner mono">
          <span>
            © {new Date().getFullYear()} {profile.name}. {copy.footer.rights}
          </span>
          <a href="#inicio">{copy.footer.top} ↑</a>
        </div>
      </footer>

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

const featureIcons = [Sparkles, AudioLines, Disc3, Wifi, Download, Keyboard];

function ZenifySection({ copy, version }: { copy: Copy; version: string }) {
  const zen = copy.zen;
  return (
    <section className="zen" id="zenify">
      <div className="zen-bg" aria-hidden="true">
        <i className="blob b1" />
        <i className="blob b2" />
        <i className="blob b3" />
        <i className="blob b4" />
      </div>

      <div className="container zen-intro">
        <span className="section-index mono" data-reveal>
          {zen.index}
        </span>
        <div className="zen-badge" data-reveal>
          <ZenIcon />
          <span className="mono">{zen.kicker}</span>
        </div>
        <h2 className="zen-title" data-reveal>
          {"Zenify".split("").map((letter, index) => (
            <span key={index} style={{ "--i": index } as CSSProperties}>
              {letter}
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
            {zen.latest} {version}
          </span>
          {zen.platforms.map((platform) => (
            <span className="status-chip" key={platform}>
              {platform}
            </span>
          ))}
        </div>
      </div>

      {/* vitrine: a janela do desktop deita e levanta com a rolagem, os celulares flutuam */}
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
        </div>
      </div>

      <div className="container">
        <div className="zen-origin">
          <h3 className="split-reveal" data-reveal>
            <SplitWords text={zen.originTitle} />
          </h3>
          <ol className="timeline" data-reveal>
            {zen.origin.map((step, index) => (
              <li key={step.title} style={{ "--i": index } as CSSProperties}>
                <span className="timeline-date mono">{step.date}</span>
                <strong>{step.title}</strong>
                <p>{step.text}</p>
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
              <article
                key={feature.title}
                className={`zen-feature f${index + 1}`}
                data-reveal
                data-spotlight
                style={{ "--i": index } as CSSProperties}
              >
                <span className="zen-feature-icon">
                  <Icon size={20} />
                </span>
                <h4>{feature.title}</h4>
                <p>{feature.text}</p>
                {index === 1 && <Waveform />}
                {index === 3 && <SyncDots />}
              </article>
            );
          })}
        </div>

        <div className="zen-shots">
          <figure className="zen-shot" data-reveal>
            <img src={zenify.desktop.player} alt="" loading="lazy" decoding="async" />
          </figure>
          <figure className="zen-shot" data-reveal>
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
          {zenify.mobile.map((phone) => (
            <figure key={phone.key} className="zen-phone-card">
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
          {zen.compare.map(([label, before, after]) => (
            <div className="zen-compare-row" key={label}>
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

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setShown(value);
      return;
    }
    let frame = 0;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        const start = performance.now();
        const tick = (now: number) => {
          const t = Math.min((now - start) / 1400, 1);
          setShown(Math.round(value * (1 - Math.pow(1 - t, 3))));
          if (t < 1) frame = requestAnimationFrame(tick);
        };
        frame = requestAnimationFrame(tick);
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
          data-cursor={copy.projects.view}
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

/* ============ PRELOADER, CURSOR, ESTRELAS ============ */

function Preloader() {
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const start = performance.now();
    let frame = 0;
    let finished = false;

    const finish = () => {
      if (finished) return;
      finished = true;
      setProgress(100);
      window.setTimeout(() => {
        setDone(true);
        document.body.classList.add("ready");
        // link direto (/#zenify): a seção só existe depois do React montar
        const target = window.location.hash && document.getElementById(window.location.hash.slice(1));
        if (target) target.scrollIntoView({ behavior: "auto" });
      }, 260);
    };

    const tick = (now: number) => {
      const elapsed = now - start;
      setProgress(Math.min(92, (elapsed / 900) * 92));
      if (elapsed > 750 && document.readyState === "complete") return finish();
      if (elapsed > 2200) return finish();
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    // aba em segundo plano não roda requestAnimationFrame: o timer garante a saída
    const fallback = window.setTimeout(finish, 2400);
    return () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(fallback);
    };
  }, []);

  return (
    <div className={`preloader ${done ? "done" : ""}`} aria-hidden="true">
      <span className="preloader-word mono">ELIAS</span>
      <span className="preloader-bar">
        <i style={{ width: `${progress}%` }} />
      </span>
    </div>
  );
}

function Cursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const [label, setLabel] = useState("");

  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!fine.matches || reduced.matches) return;

    document.body.classList.add("has-cursor");
    let x = -100;
    let y = -100;
    let rx = -100;
    let ry = -100;
    let frame = 0;

    const loop = () => {
      rx += (x - rx) * 0.18;
      ry += (y - ry) * 0.18;
      if (dot.current) dot.current.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      if (ring.current) ring.current.style.transform = `translate3d(${rx}px, ${ry}px, 0)`;
      frame = requestAnimationFrame(loop);
    };

    const onMove = (event: PointerEvent) => {
      x = event.clientX;
      y = event.clientY;
      document.body.classList.add("cursor-live");
      const target = event.target as HTMLElement | null;
      const labelled = target?.closest<HTMLElement>("[data-cursor]");
      const interactive = target?.closest("a, button");
      setLabel(labelled?.dataset.cursor ?? "");
      ring.current?.classList.toggle("is-label", Boolean(labelled));
      ring.current?.classList.toggle("is-hover", Boolean(interactive) && !labelled);
    };

    const onLeave = () => document.body.classList.remove("cursor-live");

    frame = requestAnimationFrame(loop);
    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      document.body.classList.remove("has-cursor", "cursor-live");
    };
  }, []);

  return (
    <>
      <div className="cursor-dot" ref={dot} aria-hidden="true" />
      <div className="cursor-ring" ref={ring} aria-hidden="true">
        <span className="mono">{label}</span>
      </div>
    </>
  );
}

function Starfield() {
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const node = canvas.current;
    const context = node?.getContext("2d");
    if (!node || !context) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    type Star = { x: number; y: number; z: number; r: number; t: number };
    let stars: Star[] = [];
    let width = 0;
    let height = 0;
    let frame = 0;
    let mouseX = 0;
    let mouseY = 0;
    let visible = true;

    const resize = () => {
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      width = node.clientWidth;
      height = node.clientHeight;
      node.width = width * ratio;
      node.height = height * ratio;
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      const amount = Math.round((width * height) / 5200);
      stars = Array.from({ length: amount }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        z: Math.random() * 0.8 + 0.2,
        r: Math.random() * 1.1 + 0.25,
        t: Math.random() * Math.PI * 2,
      }));
    };

    const draw = (time: number) => {
      const ink = getComputedStyle(document.documentElement).getPropertyValue("--ink-rgb").trim() || "240,239,236";
      context.clearRect(0, 0, width, height);
      for (const star of stars) {
        const twinkle = reduced ? 1 : 0.55 + Math.sin(time / 900 + star.t) * 0.45;
        const drift = reduced ? 0 : (time / 60) * star.z * 0.35;
        const x = (star.x + mouseX * star.z * 18 + width) % width;
        const y = (star.y - drift + mouseY * star.z * 18 + height * 4) % height;
        context.fillStyle = `rgba(${ink}, ${0.18 + star.z * 0.6 * twinkle})`;
        context.beginPath();
        context.arc(x, y, star.r * star.z, 0, Math.PI * 2);
        context.fill();
      }
    };

    const loop = (time: number) => {
      if (visible) draw(time);
      if (!reduced) frame = requestAnimationFrame(loop);
    };

    const onMove = (event: PointerEvent) => {
      mouseX = event.clientX / window.innerWidth - 0.5;
      mouseY = event.clientY / window.innerHeight - 0.5;
    };

    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
    });

    resize();
    observer.observe(node);
    frame = requestAnimationFrame(loop);
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
    };
  }, []);

  return <canvas className="hero-canvas" ref={canvas} aria-hidden="true" />;
}

export default App;
