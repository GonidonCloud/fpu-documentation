// GonidonCloud FPU docs — client-side doc search with dropdown suggestions
(function () {
  const input = document.getElementById("doc-search");
  const results = document.getElementById("search-results");
  if (!input || !results) return;

  // Small static index of sections across the documentation
  const INDEX = [
    { page: "index.html", crumb: "Overview", title: "What is the FPU?" },
    { page: "index.html", crumb: "Overview", title: "Key features" },
    { page: "index.html", crumb: "Overview", title: "How the FPU is different: CPU vs GPU vs FPU" },
    { page: "index.html", crumb: "Overview", title: "FPU generations: Ister, Tisza, Danube" },

    { page: "architecture.html", crumb: "Architecture", title: "Chip topology" },
    { page: "architecture.html", crumb: "Architecture", title: "Flow cores and stages" },
    { page: "architecture.html", crumb: "Architecture", title: "FlowFabric interconnect" },
    { page: "architecture.html", crumb: "Architecture", title: "Flow memory hierarchy" },
    { page: "architecture.html", crumb: "Architecture", title: "Backpressure and flow control" },
    { page: "architecture.html", crumb: "Architecture", title: "Security model and namespaces" },

    { page: "quickstart.html", crumb: "Quickstart", title: "Before you begin" },
    { page: "quickstart.html", crumb: "Quickstart", title: "Install the toolchain: fputool, fpu-sim" },
    { page: "quickstart.html", crumb: "Quickstart", title: "Verify the device: fputool probe" },
    { page: "quickstart.html", crumb: "Quickstart", title: "Write a pipeline: hello.flow" },
    { page: "quickstart.html", crumb: "Quickstart", title: "Compile and run" },

    { page: "programming.html", crumb: "Programming", title: "The programming model" },
    { page: "programming.html", crumb: "Programming", title: "FlowLang basics" },
    { page: "programming.html", crumb: "Programming", title: "Kernels and GDK-C" },
    { page: "programming.html", crumb: "Programming", title: "Host runtime API: fpu-python" },
    { page: "programming.html", crumb: "Programming", title: "Placement and constraints" },

    { page: "performance.html", crumb: "Performance", title: "Measuring performance: Ttok/s and latency" },
    { page: "performance.html", crumb: "Performance", title: "Profiling with fputool stats" },
    { page: "performance.html", crumb: "Performance", title: "Common bottlenecks" },
    { page: "performance.html", crumb: "Performance", title: "Tuning checklist" },

    { page: "faq.html", crumb: "FAQ", title: "Is an FPU a GPU?" },
    { page: "faq.html", crumb: "FAQ", title: "Can the FPU do general-purpose computing?" },
    { page: "faq.html", crumb: "FAQ", title: "Does FPU support floating point?" },
    { page: "faq.html", crumb: "FAQ", title: "Stopping a pipeline gracefully" },
    { page: "faq.html", crumb: "FAQ", title: "Multiple pipelines on one device" },
    { page: "faq.html", crumb: "FAQ", title: "Is the simulator accurate?" },
    { page: "faq.html", crumb: "FAQ", title: "Where can I get help?" }
  ];

  let selected = -1;

  function close() {
    results.classList.remove("open");
    results.innerHTML = "";
    selected = -1;
  }

  function render(query) {
    const q = query.trim().toLowerCase();
    if (!q) { close(); return; }
    const matches = INDEX.filter(function (item) {
      return (item.title + " " + item.crumb).toLowerCase().indexOf(q) !== -1;
    }).slice(0, 8);

    results.innerHTML = "";
    if (matches.length === 0) {
      results.innerHTML = '<div class="no-results">No results for "' +
        query.replace(/[<>&]/g, "") + '"</div>';
    } else {
      matches.forEach(function (item, i) {
        const link = document.createElement("a");
        link.href = item.page;
        link.innerHTML =
          '<span class="crumb">' + item.crumb + "</span>" + item.title;
        if (i === selected) link.classList.add("selected");
        results.appendChild(link);
      });
    }
    results.classList.add("open");
  }

  input.addEventListener("input", function () {
    selected = -1;
    render(input.value);
  });

  input.addEventListener("keydown", function (e) {
    const items = results.querySelectorAll("a");
    if (e.key === "Enter") {
      const target = items[selected >= 0 ? selected : 0];
      if (target) window.location.href = target.href;
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      selected = Math.min(selected + 1, items.length - 1);
      render(input.value);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      selected = Math.max(selected - 1, -1);
      render(input.value);
    } else if (e.key === "Escape") {
      close();
      input.blur();
    }
  });

  document.addEventListener("click", function (e) {
    if (!results.contains(e.target) && e.target !== input) close();
  });

  // "/" focuses the search box, like on most doc sites
  document.addEventListener("keydown", function (e) {
    if (e.key === "/" && document.activeElement !== input) {
      e.preventDefault();
      input.focus();
    }
  });
})();
