(() => {
  const projects = [
    {
      id: "my-computer",
      title: "My Computer",
      eyebrow: "Projeto solo",
      subtitle: "Painel local para conversar com IA e executar tools no computador.",
      description:
        "App self-hosted para usar modelos de IA com contexto persistente, anexos, terminal local, aprovação de tools, providers configuráveis e acesso pela rede local.",
      role: "Produto, UX, arquitetura local-first, integração com providers e camada de tools.",
      stack: ["Node.js", "JavaScript", "HTML", "CSS", "Groq", "Ollama"],
      metrics: ["Local-first", "Tools", "Multi-provider"],
      image: "/MyComputer/image.svg",
      repo: "https://github.com/elias001011/my-computer",
      reverse: false,
    },
    {
      id: "musify-desktop-port",
      title: "Musify Desktop Port",
      eyebrow: "Port desktop",
      subtitle: "Port/empacotamento desktop não oficial do Musify.",
      description:
        "Meu trabalho aqui é adaptar e distribuir builds para Windows e Linux, mantendo o Musify upstream intacto sempre que possível. O app original é mantido pelo projeto gokadzev/Musify.",
      role: "Compatibilidade desktop, áudio via media_kit, empacotamento Linux/Windows, updater e sync com upstream.",
      stack: ["Flutter", "Dart", "Linux", "Windows", "media_kit", "GitHub Actions"],
      metrics: [".deb", "Windows setup", "Sync upstream"],
      image: "/MusifyDesktop/image.svg",
      repo: "https://github.com/elias001011/Musify-Desktop-Port",
      live: "https://github.com/elias001011/Musify-Desktop-Port/releases",
      reverse: true,
    },
  ];

  const icon = {
    images: '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>',
    repo: '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.4 5.4 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65S8.93 17.38 9 18v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>',
    live: '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>',
  };

  function makeProject(project, number) {
    const section = document.createElement("section");
    section.className = `project-slide motion-slide ${project.reverse ? "is-reverse" : ""}`;
    section.dataset.extraProject = project.id;
    section.innerHTML = `
      <div class="project-layout" data-project="${String(number).padStart(2, "0")} / ${project.eyebrow}">
        <div class="project-visual">
          <a class="project-image-button" href="${project.repo}" target="_blank" rel="noreferrer" aria-label="Abrir ${project.title}">
            <img src="${project.image}" alt="Screenshot do projeto ${project.title}" loading="lazy" decoding="async" />
            <span class="gallery-badge">${icon.images} Ver projeto</span>
          </a>
        </div>
        <div class="project-copy">
          <span class="project-eyebrow">${String(number).padStart(2, "0")} / ${project.eyebrow}</span>
          <h2>${project.title}</h2>
          <p class="project-subtitle">${project.subtitle}</p>
          <p class="project-description">${project.description}</p>
          <div class="project-role"><span>${project.role}</span></div>
          <div class="metric-row">${project.metrics.map((metric) => `<span>${metric}</span>`).join("")}</div>
          <div class="stack-row">${project.stack.map((tech) => `<span>${tech}</span>`).join("")}</div>
          <div class="project-actions">
            ${project.live ? `<a class="primary-button small" href="${project.live}" target="_blank" rel="noreferrer">${icon.live} Downloads</a>` : ""}
            <a class="ghost-button small" href="${project.repo}" target="_blank" rel="noreferrer">${icon.repo} Repositório</a>
          </div>
        </div>
      </div>`;
    return section;
  }

  function mount() {
    const stack = document.querySelector(".projects-stack");
    if (!stack || document.querySelector('[data-extra-project="my-computer"]')) return false;

    const count = stack.querySelectorAll(".project-slide").length;
    projects.forEach((project, index) => stack.appendChild(makeProject(project, count + index + 1)));
    return true;
  }

  const timer = window.setInterval(() => {
    if (mount()) window.clearInterval(timer);
  }, 150);
  window.setTimeout(() => window.clearInterval(timer), 8000);
})();
