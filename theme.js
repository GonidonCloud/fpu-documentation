// GonidonCloud FPU docs — theme switcher (light/dark, persisted)
(function () {
  const root = document.documentElement;
  const toggle = document.getElementById("theme-toggle");
  const icon = document.getElementById("theme-icon");

  function apply(theme) {
    root.setAttribute("data-theme", theme);
    try { localStorage.setItem("gdc-theme", theme); } catch (e) {}
    if (icon) {
      // Material Symbols ligatures
      icon.textContent = theme === "dark" ? "light_mode" : "dark_mode";
    }
    if (toggle) {
      toggle.setAttribute(
        "aria-label",
        theme === "dark" ? "Switch to light theme" : "Switch to dark theme"
      );
      toggle.title = theme === "dark" ? "Switch to light theme" : "Switch to dark theme";
    }
  }

  let stored = null;
  try { stored = localStorage.getItem("gdc-theme"); } catch (e) {}
  const prefersDark =
    window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
  apply(stored || (prefersDark ? "dark" : "light"));

  if (toggle) {
    toggle.addEventListener("click", function () {
      apply(root.getAttribute("data-theme") === "dark" ? "light" : "dark");
    });
  }
})();
