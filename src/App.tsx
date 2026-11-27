import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  AudioLines,
  Building2,
  Check,
  Copy as CopyIcon,
  GitPullRequest,
  Github,
  Images,
  Instagram,
  LayoutGrid,
  Linkedin,
  Mail,
  User,
  X,
  type LucideIcon,
} from "lucide-react";
import { Fragment, useEffect, useLayoutEffect, useMemo, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { createPortal } from "react-dom";
import connectaWordmark from "./assets/brand/connecta-logo-branca.svg";
import hostingerBadge from "./assets/brand/hostinger-partner-badge-dark.svg";
import {
  languages,
  musify,
  profile,
  profileImage,
  projectLinks,
  projectText,
  realEstateImages,
  siteCopy,
  zenify,
  type Copy,
  type LanguageId,
  type ProjectId,
} from "./content";
import { useScrollMotion } from "./motion";
import { RoomScene, type Theme } from "@/components/hero/RoomScene";
import { stackIcons } from "@/components/hero/stack-icons";
import { ToolDock, ToolDockTile, type ToolDockItem } from "@/components/ui/techstack";
import { links, sectionCopy } from "./sections/copy";
import { YtmDemo } from "./sections/YtmDemo";
import { ShelfVig, Skyline } from "./sections/vignettes";
import { ZenifyCase } from "./sections/ZenifyCase";

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

type GalleryMedia = Pick<Project, "title" | "tag" | "images" | "phone"> & { imageAlts?: string[] };
type ProjectPreview = GalleryMedia & Pick<Project, "live" | "repo">;
type GalleryState = { project: GalleryMedia; index: number };

const navIcons: Record<string, LucideIcon> = {
  "#sobre": User,
  "#connecta": Building2,
  "#projetos": LayoutGrid,
  "#zenify": AudioLines,
  "#musify": GitPullRequest,
  "#contato": Mail,
};
// as stacks do dock: marcas em cópia local, cada uma no seu azulejo
const stackItems: ToolDockItem[] = stackIcons.map(({ label, path, tile, ink }) => ({
  label,
  icon: (
    <ToolDockTile style={{ backgroundColor: tile, color: ink }}>
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path d={path} />
      </svg>
    </ToolDockTile>
  ),
}));

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

const palettes = ["green", "blue", "black", "graphite", "cafeteria"] as const;
type PaletteId = (typeof palettes)[number];

function initialPalette(): PaletteId {
  // "meraki" era o nome antigo da paleta Cafeteria
  const stored = readStored("elias-palette")?.replace("meraki", "cafeteria");
  return palettes.includes(stored as PaletteId) ? (stored as PaletteId) : "green";
}

function initialTheme(): Theme {
  const stored = readStored("elias-theme");
  if (stored === "light" || stored === "dark") return stored;
  return window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
}

function App() {
  const [language, setLanguage] = useState<LanguageId>(initialLanguage);
  const [theme, setTheme] = useState<Theme>(initialTheme);
  const [paletteId, setPaletteId] = useState<PaletteId>(initialPalette);
  // luz e cortina são da cena: não mexem no tema nem uma na outra
  const [lampOn, setLampOn] = useState(() => readStored("elias-lamp") !== "off");
  const [curtainClosed, setCurtainClosed] = useState(() => readStored("elias-curtain") === "closed");
  const [copied, setCopied] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [gallery, setGallery] = useState<GalleryState | null>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const [activeSection, setActiveSection] = useState("");

  const copy = siteCopy[language];
  const sc = sectionCopy[language];
  const toggleTheme = () => setTheme((current) => (current === "dark" ? "light" : "dark"));

  const projects = useMemo(() => {
    const build = (id: ProjectId): Project => ({ id, ...projectLinks[id], ...projectText[language][id] });
    return Object.fromEntries(
      (Object.keys(projectLinks) as ProjectId[]).map((id) => [id, build(id)]),
    ) as Record<ProjectId, Project>;
  }, [language]);

  useScrollMotion(language);

  // sem tela de carregamento: as entradas do topo começam assim que monta
  useEffect(() => {
    const start = () => {
      document.body.classList.add("ready");
      const target = window.location.hash && document.getElementById(window.location.hash.slice(1));
      if (target) target.scrollIntoView({ behavior: "instant" });
    };
    const timer = window.setTimeout(start, 60);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    document.documentElement.lang = copy.locale;
    writeStored("elias-language", language);
  }, [copy.locale, language]);

  useEffect(() => {
    const root = document.documentElement;
    root.dataset.theme = theme;
    root.dataset.palette = paletteId;
    const fundo = getComputedStyle(root).getPropertyValue("--void").trim();
    if (fundo) document.querySelector('meta[name="theme-color"]')?.setAttribute("content", fundo);
    writeStored("elias-theme", theme);
    writeStored("elias-palette", paletteId);
  }, [theme, paletteId]);

  useEffect(() => writeStored("elias-lamp", lampOn ? "on" : "off"), [lampOn]);
  useEffect(() => writeStored("elias-curtain", curtainClosed ? "closed" : "open"), [curtainClosed]);

  useEffect(() => {
    const sections = Array.from(document.querySelectorAll<HTMLElement>("main > section[id]"));
    let frame = 0;
    const update = () => {
      frame = 0;
      const hero = document.getElementById("inicio");
      setScrolled(window.scrollY > Math.min(160, (hero?.offsetHeight ?? window.innerHeight) * 0.2));
      const current = sections.filter(section => section.getBoundingClientRect().top <= 110).at(-1);
      setActiveSection(current?.id ?? "");
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, []);

  useEffect(() => {
    document.body.classList.toggle("menu-locked", menuOpen || gallery !== null);
    return () => document.body.classList.remove("menu-locked");
  }, [menuOpen, gallery]);

  useEffect(() => {
    if (!menuOpen) return;
    const desktop = window.matchMedia("(min-width: 1021px)");
    const onResize = () => {
      if (desktop.matches) setMenuOpen(false);
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setMenuOpen(false);
      menuButtonRef.current?.focus();
    };
    onResize();
    desktop.addEventListener("change", onResize);
    window.addEventListener("keydown", onKey);
    return () => {
      desktop.removeEventListener("change", onResize);
      window.removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);

  function moveGallery(direction: number) {
    setGallery((current) => {
      if (!current) return current;
      const length = current.project.images.length;
      return { project: current.project, index: (current.index + direction + length) % length };
    });
  }

  const openGallery = (project: GalleryMedia, index: number) => setGallery({ project, index });

  const copyEmail = () => {
    navigator.clipboard?.writeText(profile.email).then(
      () => {
        setCopied(true);
        window.setTimeout(() => setCopied(false), 1800);
      },
      () => {
        window.location.href = `mailto:${profile.email}`;
      },
    );
  };

  return (
    <>
      <Cursor galleryOpen={gallery !== null} />
      <header className={`navbar ${scrolled ? "scrolled" : ""} ${menuOpen ? "menu-open" : ""}`}>
        <nav className="navbar-inner" aria-label={copy.navLabel}>
          <a className="brand" href="#inicio" aria-label="Elias" onClick={() => setMenuOpen(false)}>
            <span className="brand-avatar">
              <img src={profileImage} alt="" decoding="async" />
            </span>
            <span className="brand-word" aria-hidden="true">
              elias
            </span>
          </a>

          <div className="navbar-links">
            {sc.nav.map((item) => (
              <a key={item.href} href={item.href} aria-current={item.href === "#" + activeSection ? "location" : undefined}>
                {item.label}
              </a>
            ))}
          </div>

          <div className="navbar-actions">
            <div className="seg lang-seg" role="group" aria-label={copy.language}>
              {languages.map((option) => (
                <button key={option.id} type="button" title={option.name} aria-pressed={option.id === language} onClick={() => setLanguage(option.id)}>
                  {option.label}
                </button>
              ))}
            </div>
            <a className="btn btn-primary nav-cta" href={profile.github} target="_blank" rel="noreferrer">
              <Github size={15} />
              GitHub
            </a>
            <button
              type="button"
              className="nav-icon-btn menu-btn"
              ref={menuButtonRef}
              aria-label={menuOpen ? copy.menuClose : copy.menuOpen}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
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

        <div className="mobile-panel" id="mobile-menu" aria-hidden={!menuOpen} inert={!menuOpen}>
          <div className="mobile-panel-inner">
            <div className="mobile-links">
              {sc.nav.map((item, index) => {
                const Icon = navIcons[item.href];
                return (
                  <a key={item.href} href={item.href} aria-current={item.href === "#" + activeSection ? "location" : undefined} style={{ "--i": index } as CSSProperties} onClick={() => setMenuOpen(false)}>
                    <Icon size={17} />
                    {item.label}
                  </a>
                );
              })}
            </div>
          </div>
        </div>
      </header>

      <main inert={menuOpen}>
        {/* ============ HERO ============ */}
        <RoomScene
          theme={theme}
          onToggleTheme={toggleTheme}
          lampOn={lampOn}
          onToggleLamp={() => setLampOn((current) => !current)}
          curtainClosed={curtainClosed}
          onToggleCurtain={() => setCurtainClosed((current) => !current)}
          paletteIndex={palettes.indexOf(paletteId)}
          paletteLabel={`${copy.palette}: ${copy.paletteNames[paletteId].label}`}
          onNextPalette={() => setPaletteId((current) => palettes[(palettes.indexOf(current) + 1) % palettes.length])}
          labels={copy.scene}
        >
          <h1 className="hero-name">elias001011</h1>
          <p className="hero-hint mono">{copy.scene.hint}</p>
          <div className="hero-buttons">
            <a className="btn btn-primary btn-lg" href="#zenify">
              {copy.hero.primary}
              <ArrowRight size={16} />
            </a>
            <a className="btn btn-secondary btn-lg" href="#contato">
              {copy.hero.secondary}
            </a>
          </div>
          <div className="hero-social mono">
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
          <ToolDock items={stackItems} label={copy.scene.stack} size={54} delay={1.75} />
        </RoomScene>

        <ZenifyCase
          language={language}
          openLabel={copy.gallery.open}
          onExpand={(shot, label) => openGallery({
            title: "Zenify",
            tag: label,
            images: [shot.src],
            imageAlts: [shot.alt],
            phone: Boolean(shot.height),
          }, 0)}
        />

        {/* ============ 01 SOBRE ============ */}
        <section className="block" id="sobre">
          <div className="frame">
            <BlockHead title={sc.heads.about} />
            <p className="about-line" data-reveal>{sc.bio}</p>
          </div>
        </section>

        {/* ============ 02 CONNECTA ============ */}
        <section className="block" id="connecta">
          <div className="frame">
            <BlockHead title={sc.heads.connecta} meta="connectabr.digital" />
            <div className="cells">
              <div className="cell span-4 connecta-cell" data-reveal>
                <ConnectaLogo />
                <div>
                  <h2>{copy.connecta.partner}</h2>
                  <p className="cell-text">{sc.connecta.text}</p>
                  <div className="row-actions">
                    <a className="btn btn-primary" href={links.connectaSite} target="_blank" rel="noreferrer">
                      {sc.connecta.site}
                      <ArrowUpRight size={15} />
                    </a>
                    <a className="btn btn-secondary" href={profile.connectaPortfolio} target="_blank" rel="noreferrer">
                      {sc.connecta.portfolio}
                    </a>
                  </div>
                </div>
              </div>

              <ProjectCell
                className="span-4"
                tag={sc.connecta.project}
                title={projects.apice.title}
                subtitle={projects.apice.subtitle}
                description={projects.apice.description}
                stack={projects.apice.stack}
                media={<ProjectMedia project={projects.apice} copy={copy} onOpen={openGallery} />}
                actions={
                  <>
                    <a className="btn btn-primary" href={links.apiceLive} target="_blank" rel="noreferrer">
                      {sc.connecta.visit}
                      <ArrowUpRight size={15} />
                    </a>
                    <a className="btn btn-secondary" href={projects.apice.repo} target="_blank" rel="noreferrer">
                      <Github size={15} />
                      {copy.projects.repo}
                    </a>
                  </>
                }
              />

              <ProjectCell
                className="span-4"
                tag={sc.connecta.project}
                title={sc.connecta.imob.title}
                subtitle={sc.connecta.imob.subtitle}
                stack={sc.connecta.imob.stack}
                media={
                  <ProjectMedia
                    copy={copy}
                    project={{
                      title: sc.connecta.imob.title,
                      tag: sc.connecta.project,
                      live: links.imobLive,
                      images: realEstateImages,
                      imageAlts: sc.connecta.imob.imageAlts,
                    }}
                    onOpen={openGallery}
                  />
                }
                actions={
                  <>
                    <a className="btn btn-primary" href={links.imobLive} target="_blank" rel="noreferrer">
                      {sc.connecta.visit}
                      <ArrowUpRight size={15} />
                    </a>
                    <a className="btn btn-secondary" href={links.imobRepo} target="_blank" rel="noreferrer">
                      <Github size={15} />
                      {copy.projects.repo}
                    </a>
                  </>
                }
              />
            </div>
          </div>
        </section>

        {/* ============ 03 PROJETOS ATIVOS ============ */}
        <section className="block" id="projetos">
          <div className="frame">
            <BlockHead title={sc.heads.active} />



            {/* ---- youtube_music_explode_dart ---- */}
            <div className="cells">
              <ProjectCell
                media={<YtmDemo copy={sc.ytm} locale={copy.locale} />}
                tag={projects["youtube-music-explode-dart"].tag}
                title={projects["youtube-music-explode-dart"].title}
                subtitle={projects["youtube-music-explode-dart"].subtitle}
                description={projects["youtube-music-explode-dart"].description}
                stack={projects["youtube-music-explode-dart"].stack}
                actions={
                  <a className="btn btn-primary" href={projects["youtube-music-explode-dart"].repo} target="_blank" rel="noreferrer">
                    <Github size={15} />
                    {copy.projects.repo}
                  </a>
                }
              />
            </div>

            {/* ---- Sépia + este site ---- */}
            <div className="cells">
              <ProjectCell
                className="span-6"
                tag={projects["sepia-reader"].tag}
                title={projects["sepia-reader"].title}
                subtitle={projects["sepia-reader"].subtitle}
                description={projects["sepia-reader"].description}
                stack={projects["sepia-reader"].stack}
                media={<ProjectMedia project={projects["sepia-reader"]} copy={copy} onOpen={openGallery} />}
                actions={
                  <>
                    <a className="btn btn-primary" href={projects["sepia-reader"].live} target="_blank" rel="noreferrer">
                      {copy.projects.live}
                      <ArrowUpRight size={15} />
                    </a>
                    <a className="btn btn-secondary" href={projects["sepia-reader"].repo} target="_blank" rel="noreferrer">
                      <Github size={15} />
                      {copy.projects.repo}
                    </a>
                  </>
                }
              />
              <ProjectCell
                className="span-6"
                tag="elias001011.github.io"
                title={sc.site.title}
                subtitle={sc.site.subtitle}
                stack={sc.site.stack}
                media={
                  <VigFrame host="elias001011.github.io">
                  <ShelfVig
                    palette={paletteId}
                    onPalette={(id) => setPaletteId(id as PaletteId)}
                    theme={theme}
                    onTheme={toggleTheme}
                    names={copy.paletteNames}
                    copy={sc.site}
                  />
                  </VigFrame>
                }
                actions={
                  <a className="btn btn-primary" href={links.siteRepo} target="_blank" rel="noreferrer">
                    <Github size={15} />
                    {copy.projects.repo}
                  </a>
                }
              />
            </div>
          </div>
        </section>

        {/* ============ 04 OPEN SOURCE (Musify) ============ */}
        <section className="block" id="musify">
          <div className="frame">
            <BlockHead title={sc.heads.oss} meta="gokadzev/Musify" />
            <div className="oss-note">
              <p>{sc.upstream}</p>
              <div className="row-actions">
                <a className="btn btn-secondary" href={musify.prs}>{copy.musify.prs}</a>
                <a className="btn btn-secondary" href={zenify.upstreamSync}>Local Sync</a>
              </div>
            </div>
          </div>
        </section>

        {/* ============ 05 ARQUIVADOS ============ */}
        <section className="block block-quiet" id="arquivados">
          <div className="frame">
            <BlockHead title={sc.heads.archived} meta={sc.archivedNote} />
            <ul className="archive">
              {sc.archived.map((item) => (
                <li key={item.name}>
                  <a href={item.href} target="_blank" rel="noreferrer">
                    <span className="archive-name">{item.name}</span>
                    <span className="archive-text">{item.text}</span>
                    <span className="mono archive-lang">{item.lang}</span>
                    <ArrowUpRight size={16} />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ============ 06 CONTATO ============ */}
        <section className="block" id="contato">
          <div className="frame">
            <BlockHead title={sc.heads.contact} />
            <div className="cells">
              <div className="cell span-8 contact-main">
                <h2 className="split-reveal" data-reveal>
                  <SplitWords text={copy.contactSection.title} />
                </h2>
                <div className="contact-mail" data-reveal>
                  <span className="mono">{profile.email}</span>
                  <button type="button" className="btn btn-primary" onClick={copyEmail}>
                    {copied ? <Check size={15} /> : <CopyIcon size={15} />}
                    {copied ? sc.contact.copied : sc.contact.copy}
                  </button>
                  <a className="btn btn-secondary" href={`mailto:${profile.email}`}>
                    <Mail size={15} />
                    {sc.contact.write}
                  </a>
                </div>
              </div>
              <div className="cell span-4 contact-links">
                <a href={profile.github} target="_blank" rel="noreferrer">
                  <Github size={18} />
                  <span>
                    GitHub <em className="mono">elias001011</em>
                  </span>
                  <ArrowUpRight size={16} />
                </a>
                <a href={profile.linkedin} target="_blank" rel="noreferrer">
                  <Linkedin size={18} />
                  <span>
                    LinkedIn <em className="mono">Elias Nunes</em>
                  </span>
                  <ArrowUpRight size={16} />
                </a>
                <a href={profile.instagram} target="_blank" rel="noreferrer">
                  <Instagram size={18} />
                  <span>
                    Instagram <em className="mono">@elias_jrnunes</em>
                  </span>
                  <ArrowUpRight size={16} />
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="site-footer" inert={menuOpen}>
        <Skyline />
        <div className="frame footer-frame">
          <div className="footer-marks" aria-label="Connecta Digital e Hostinger Partner">
            <a href={links.connectaSite} target="_blank" rel="noreferrer" className="footer-connecta">
              <img src={connectaWordmark} width="220" height="37" alt="Connecta Digital" loading="lazy" decoding="async" />
            </a>
            <span className="footer-marks-divider" aria-hidden="true" />
            <a className="footer-hostinger" href={HOSTINGER} target="_blank" rel="sponsored noopener noreferrer" aria-label="Hostinger Partner">
              <img src={hostingerBadge} width="120" height="45" alt="Hostinger Partner" loading="lazy" decoding="async" />
            </a>
          </div>
          <div className="footer-inner mono">
            <span>
              © {new Date().getFullYear()} {profile.name}. {copy.footer.rights}
            </span>
            <a href="#inicio">{copy.footer.top} ↑</a>
          </div>
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
   PEÇAS DA GRADE
   ============================================================ */

function BlockHead({ title, meta }: { title: string; meta?: string }) {
  return (
    <header className="block-head mono">
      <h2>{title}</h2>
      {meta && <span className="block-meta">{meta}</span>}
    </header>
  );
}

function VigFrame({ host, children }: { host: string; children: ReactNode }) {
  return (
    <div className="project-media">
      <div className="project-media-bar mono">
        <span className="dots">
          <i />
          <i />
          <i />
        </span>
        <span className="host">{host}</span>
      </div>
      {children}
    </div>
  );
}

function ProjectCell({
  className = "",
  tag,
  title,
  subtitle,
  description,
  stack,
  media,
  actions,
}: {
  className?: string;
  tag: string;
  title: string;
  subtitle: string;
  description?: string;
  stack: string[];
  media?: ReactNode;
  actions: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  return (
    <details className={`work-row ${className}`} onToggle={event => setOpen(event.currentTarget.open)}>
      <summary><span>{title}</span><small className="mono">{tag}</small><i aria-hidden="true" /></summary>
      <div className="work-body">
        {open && media}
        <div className="project-info">
          <p className="project-subtitle">{subtitle}</p>
          {description && <p className="cell-text">{description}</p>}
          <div className="stack-row mono">
            {stack.map(tech => <span key={tech}>{tech}</span>)}
          </div>
          <div className="row-actions">{actions}</div>
        </div>
      </div>
    </details>
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

function ProjectMedia({ project, copy, onOpen }: { project: ProjectPreview; copy: Copy; onOpen: (project: GalleryMedia, index: number) => void }) {
  const host = project.live ? new URL(project.live).host : project.repo ? "github.com" : "";

  return (
    <div className="project-media">
      <div className="project-media-bar mono">
        <span className="dots">
          <i />
          <i />
          <i />
        </span>
        <span className="host">{host}</span>
      </div>
      <button type="button" className="project-media-button" aria-label={`${copy.gallery.open} ${project.title}`} onClick={() => onOpen(project, 0)}>
        <img src={project.images[0]} alt="" loading="lazy" decoding="async" />
        <span className="media-badge mono">
          <Images size={14} />
        </span>
      </button>
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
  copy: Copy;
  onClose: () => void;
  onMove: (direction: number) => void;
  onSelect: (index: number) => void;
}) {
  const { project, index } = gallery;
  const image = project.images[index];
  const hasMultipleImages = project.images.length > 1;
  const dialogRef = useRef<HTMLDialogElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const opener = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const dialog = dialogRef.current;
    dialog?.showModal();
    closeButtonRef.current?.focus();
    return () => {
      dialog?.close();
      opener?.focus({ preventScroll: true });
    };
  }, []);

  return (
    <dialog
      className="gallery"
      ref={dialogRef}
      aria-label={project.title}
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onKeyDown={(event) => {
        if (!hasMultipleImages || (event.key !== "ArrowRight" && event.key !== "ArrowLeft")) return;
        event.preventDefault();
        onMove(event.key === "ArrowRight" ? 1 : -1);
      }}
    >
      <button className="gallery-backdrop" type="button" tabIndex={-1} aria-label={copy.gallery.close} onClick={onClose} />
      <div className={`gallery-panel ${project.phone ? "is-phone" : ""}`}>
        <div className="gallery-head">
          <div>
            <span className="mono">{project.tag}</span>
            <strong>{project.title}</strong>
          </div>
          <button className="nav-icon-btn" type="button" aria-label={copy.gallery.close} onClick={onClose} ref={closeButtonRef}>
            <X size={18} />
          </button>
        </div>
        <div className="gallery-stage">
          {hasMultipleImages && (
            <button className="gallery-nav prev" type="button" aria-label={copy.gallery.previous} onClick={() => onMove(-1)}>
              <ArrowLeft size={18} />
            </button>
          )}
          <img key={image} src={image} alt={project.imageAlts?.[index] ?? `${project.title} — ${copy.gallery.image} ${index + 1}`} decoding="async" />
          {hasMultipleImages && (
            <button className="gallery-nav next" type="button" aria-label={copy.gallery.next} onClick={() => onMove(1)}>
              <ArrowRight size={18} />
            </button>
          )}
        </div>
        {hasMultipleImages && (
          <div className="gallery-thumbs">
            {project.images.map((thumb, thumbIndex) => (
              <button
                key={thumb}
                type="button"
                className={thumbIndex === index ? "is-active" : ""}
                aria-pressed={thumbIndex === index}
                aria-label={project.imageAlts?.[thumbIndex] ?? `${copy.gallery.image} ${thumbIndex + 1}`}
                onClick={() => onSelect(thumbIndex)}
              >
                <img src={thumb} alt="" loading="lazy" decoding="async" />
              </button>
            ))}
          </div>
        )}
      </div>
    </dialog>
  );
}

/* Cursor da landing do Meteor: bola branca com mix-blend-mode difference, que
   segue o mouse numa mola (mesmos parâmetros do framer-motion de lá: damping 20,
   stiffness 300, mass 0.5) e cresce sobre o que é clicável. Só no desktop. */
function Cursor({ galleryOpen }: { galleryOpen: boolean }) {
  const [host] = useState(() => {
    const node = document.createElement("div");
    node.className = "cursor-host";
    return node;
  });

  // O dialog modal fica na top layer. Mover o mesmo host preserva a posição da mola.
  useLayoutEffect(() => {
    const dialog = galleryOpen ? document.querySelector<HTMLDialogElement>("dialog.gallery") : null;
    (dialog ?? document.body).append(host);
    return () => host.remove();
  }, [galleryOpen, host]);
  const outer = useRef<HTMLDivElement>(null);
  const ball = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 1024px) and (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)");
    let tx = -100;
    let ty = -100;
    let x = -100;
    let y = -100;
    let vx = 0;
    let vy = 0;
    let last = 0;
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
      const settled = Math.abs(x - tx) + Math.abs(y - ty) + Math.abs(vx) + Math.abs(vy) < 0.5;
      if (outer.current) outer.current.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      frame = settled ? 0 : requestAnimationFrame(loop);
    };

    const onMove = (event: PointerEvent) => {
      if (!desktop.matches || event.pointerType !== "mouse") return;
      tx = event.clientX;
      ty = event.clientY;
      if (!outer.current?.classList.contains("is-visible")) {
        x = tx;
        y = ty;
        vx = 0;
        vy = 0;
      }
      document.documentElement.classList.add("has-cursor");
      outer.current?.classList.add("is-visible");
      const target = event.target as HTMLElement | null;
      const hovering = Boolean(
        target?.closest("a, button, input, textarea, [data-hover], summary, .sky-win"),
      );
      ball.current?.classList.toggle("is-hover", hovering);
      if (!frame) {
        last = performance.now();
        frame = requestAnimationFrame(loop);
      }
    };
    const onLeave = () => {
      cancelAnimationFrame(frame);
      frame = 0;
      outer.current?.classList.remove("is-visible");
      document.documentElement.classList.remove("has-cursor");
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    document.body.addEventListener("mouseleave", onLeave);
    desktop.addEventListener("change", onLeave);
    return () => {
      onLeave();
      window.removeEventListener("pointermove", onMove);
      document.body.removeEventListener("mouseleave", onLeave);
      desktop.removeEventListener("change", onLeave);
    };
  }, []);

  return createPortal(
    <div className="cursor" ref={outer} aria-hidden="true">
      <div className="cursor-ball" ref={ball} />
    </div>,
    host,
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

export default App;
