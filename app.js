// Shared documentation shell, navigation, table of contents, and page utilities.
(function () {
  const header = document.querySelector(".site-header");
  const main = document.querySelector("main.page");
  if (!header || !main) return;

  const icons = {
    menu: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16"/></svg>',
    close: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18"/></svg>',
    search: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></svg>',
    moon: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 15.2A8.5 8.5 0 0 1 8.8 4 8.5 8.5 0 1 0 20 15.2Z"/></svg>',
    sun: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.42 1.42M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.42-1.42M17.66 6.34l1.41-1.41"/></svg>',
    github: '<svg viewBox="0 0 24 24" aria-hidden="true" class="github-icon"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12Z"/></svg>',
    copy: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="8" y="8" width="11" height="11" rx="2"/><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2"/></svg>',
    check: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m5 12 4 4L19 6"/></svg>',
    arrow: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m9 5 7 7-7 7"/></svg>'
  };

  const currentPath = window.location.pathname.split("/").pop() || "index.html";
  const currentPage = currentPath.endsWith(".html") ? currentPath : `${currentPath}.html`;
  const navigation = [
    { label: "FPU", links: [["index.html", "Overview"], ["architecture.html", "Architecture"]] },
    { label: "Develop", links: [["quickstart.html", "Quickstart"], ["programming.html", "Programming with FlowKit"]] },
    { label: "Optimize", links: [["performance.html", "Performance analysis"]] },
    { label: "Reference", links: [["faq.html", "FAQ"]] }
  ];

  header.innerHTML = `
    <button class="icon-btn nav-toggle" id="nav-toggle" aria-label="Open navigation" aria-controls="docs-sidebar" aria-expanded="false">${icons.menu}</button>
    <a class="brand" href="index.html" aria-label="GonidonCloud FPU documentation home">
      <img src="logo.png" alt="" class="brand-logo">
      <span class="brand-company">GonidonCloud</span>
      <span class="brand-divider"></span>
      <span class="brand-product">FPU</span>
      <span class="brand-documentation">Documentation</span>
    </a>
    <button class="search-trigger" id="search-trigger" aria-label="Search documentation" aria-haspopup="dialog">
      ${icons.search}<span>Search documentation</span>
      <span class="search-shortcut"><kbd>${/Mac|iPhone|iPad/.test(navigator.platform) ? "⌘" : "Ctrl"}</kbd><kbd>K</kbd></span>
    </button>
    <div class="header-actions">
      <a class="icon-btn" href="https://github.com/GonidonCloud/REPLACE_ME" target="_blank" rel="noopener" aria-label="GitHub repository" title="GitHub repository">${icons.github}</a>
      <button id="theme-toggle" class="icon-btn" aria-label="Switch theme" title="Switch theme"><span id="theme-icon" class="theme-icon" aria-hidden="true">${icons.moon}${icons.sun}</span></button>
    </div>
    <div class="reading-progress" id="reading-progress" aria-hidden="true"></div>`;

  const shell = document.createElement("div");
  shell.className = "docs-shell";
  main.parentNode.insertBefore(shell, main);

  const sidebar = document.createElement("aside");
  sidebar.className = "docs-sidebar";
  sidebar.id = "docs-sidebar";
  sidebar.setAttribute("aria-label", "Documentation navigation");
  sidebar.innerHTML = `<nav class="sidebar-nav">${navigation.map((group) => `
    <section class="nav-group">
      <h2>${group.label}</h2>
      ${group.links.map(([href, label]) => `<a href="${href}" class="nav-link${href === currentPage ? " active" : ""}"${href === currentPage ? ' aria-current="page"' : ""}>${label}</a>`).join("")}
    </section>`).join("")}
    <div class="sidebar-version"><span class="status-dot"></span><span>FPU tools</span><strong>2.4.1</strong></div>
  </nav>`;

  const toc = document.createElement("aside");
  toc.className = "page-toc";
  toc.setAttribute("aria-label", "On this page");
  shell.append(sidebar, main, toc);

  const slugCounts = new Map();
  const headings = [...main.querySelectorAll("h2, h3")].filter((heading) => !heading.closest(".nav-group"));
  headings.forEach((heading) => {
    if (!heading.id) {
      const base = heading.textContent.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "section";
      const count = slugCounts.get(base) || 0;
      slugCounts.set(base, count + 1);
      heading.id = count ? `${base}-${count + 1}` : base;
    }
  });

  toc.innerHTML = `<div class="toc-inner"><p class="toc-title">On this page</p><nav class="toc-links">${headings.map((heading) => `<a href="#${heading.id}" data-heading="${heading.id}" class="${heading.tagName === "H3" ? "toc-subheading" : ""}">${heading.textContent}</a>`).join("")}</nav><a class="back-to-top" href="#main-content">Back to top <span aria-hidden="true">↑</span></a></div>`;

  const scrim = document.createElement("button");
  scrim.className = "nav-scrim";
  scrim.setAttribute("aria-label", "Close navigation");
  document.body.appendChild(scrim);

  const navToggle = document.getElementById("nav-toggle");
  function setNavigation(open) {
    document.body.classList.toggle("nav-open", open);
    navToggle.setAttribute("aria-expanded", String(open));
    navToggle.setAttribute("aria-label", open ? "Close navigation" : "Open navigation");
    navToggle.innerHTML = open ? icons.close : icons.menu;
  }
  navToggle.addEventListener("click", () => setNavigation(!document.body.classList.contains("nav-open")));
  scrim.addEventListener("click", () => setNavigation(false));
  sidebar.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => setNavigation(false)));

  const tocLinks = [...toc.querySelectorAll("[data-heading]")];
  const progress = document.getElementById("reading-progress");
  let scrollQueued = false;
  function updateScrollState() {
    const marker = window.scrollY + 130;
    let active = headings[0];
    headings.forEach((heading) => {
      if (heading.getBoundingClientRect().top + window.scrollY <= marker) active = heading;
    });
    tocLinks.forEach((link) => link.classList.toggle("active", active && link.dataset.heading === active.id));
    const available = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.transform = `scaleX(${available > 0 ? Math.min(window.scrollY / available, 1) : 0})`;
    scrollQueued = false;
  }
  window.addEventListener("scroll", () => {
    if (!scrollQueued) {
      scrollQueued = true;
      requestAnimationFrame(updateScrollState);
    }
  }, { passive: true });
  updateScrollState();

  main.querySelectorAll("pre").forEach((block) => {
    const button = document.createElement("button");
    button.className = "code-copy";
    button.type = "button";
    button.setAttribute("aria-label", "Copy code");
    button.innerHTML = `${icons.copy}<span>Copy</span>`;
    block.appendChild(button);
    button.addEventListener("click", async () => {
      const code = block.querySelector("code")?.innerText || "";
      try {
        await navigator.clipboard.writeText(code);
        button.innerHTML = `${icons.check}<span>Copied</span>`;
        button.classList.add("copied");
        setTimeout(() => {
          button.innerHTML = `${icons.copy}<span>Copy</span>`;
          button.classList.remove("copied");
        }, 1800);
      } catch {
        button.querySelector("span").textContent = "Select code";
      }
    });
  });

  const feedback = document.createElement("section");
  feedback.className = "page-feedback";
  feedback.innerHTML = `<span>Was this page helpful?</span><div><button type="button" data-feedback="yes">Yes</button><button type="button" data-feedback="no">No</button></div>`;
  const pagination = main.querySelector(".pagination");
  main.insertBefore(feedback, pagination || null);
  feedback.querySelectorAll("button").forEach((button) => {
    button.addEventListener("click", () => {
      feedback.innerHTML = '<span class="feedback-thanks">Thanks for your feedback.</span>';
    });
  });

  const footer = document.querySelector(".site-footer");
  if (footer) {
    footer.innerHTML = `<div class="footer-inner"><span>© 2026 GonidonCloud</span><nav aria-label="Footer"><a href="https://www.gonidon.cloud/REPLACE_ME">GonidonCloud home</a><a href="faq.html#support">Support</a><a href="https://github.com/GonidonCloud/REPLACE_ME" target="_blank" rel="noopener">GitHub</a></nav></div>`;
  }

  const searchModal = document.createElement("div");
  searchModal.className = "search-modal";
  searchModal.id = "search-modal";
  searchModal.hidden = true;
  searchModal.innerHTML = `
    <div class="search-backdrop" data-search-close></div>
    <section class="search-dialog" role="dialog" aria-modal="true" aria-label="Search FPU documentation">
      <div class="search-input-row">${icons.search}<input id="doc-search" type="search" placeholder="Search FPU documentation" autocomplete="off" aria-label="Search documentation" aria-controls="search-results"><button class="search-close" type="button" aria-label="Close search" data-search-close>${icons.close}</button></div>
      <div id="search-results" class="search-results" role="listbox" aria-label="Search results"></div>
      <footer class="search-footer"><span><kbd>↑</kbd><kbd>↓</kbd> to navigate</span><span><kbd>↵</kbd> to select</span><span><kbd>esc</kbd> to close</span></footer>
    </section>`;
  document.body.appendChild(searchModal);

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && document.body.classList.contains("nav-open")) setNavigation(false);
  });
})();
