// Material light/dark theme with saved and operating-system preferences.
(function () {
  const root = document.documentElement;
  const toggle = document.getElementById("theme-toggle");
  const media = window.matchMedia ? window.matchMedia("(prefers-color-scheme: dark)") : null;

  function savedTheme() {
    try {
      const value = localStorage.getItem("gdc-theme");
      return value === "dark" || value === "light" ? value : null;
    } catch {
      return null;
    }
  }

  function apply(theme, persist = true) {
    root.setAttribute("data-theme", theme);
    if (persist) {
      try { localStorage.setItem("gdc-theme", theme); } catch {}
    }
    if (toggle) {
      const label = theme === "dark" ? "Switch to light theme" : "Switch to dark theme";
      toggle.setAttribute("aria-label", label);
      toggle.title = label;
    }
  }

  apply(savedTheme() || (media?.matches ? "dark" : "light"), false);
  toggle?.addEventListener("click", () => {
    apply(root.getAttribute("data-theme") === "dark" ? "light" : "dark");
  });
  media?.addEventListener?.("change", (event) => {
    if (!savedTheme()) apply(event.matches ? "dark" : "light", false);
  });
})();
