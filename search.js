// Keyboard-accessible documentation search shown in a command-palette dialog.
(function () {
  const modal = document.getElementById("search-modal");
  const trigger = document.getElementById("search-trigger");
  const input = document.getElementById("doc-search");
  const results = document.getElementById("search-results");
  if (!modal || !trigger || !input || !results) return;

  const INDEX = [
    { page: "index.html#what-is-fpu", crumb: "Overview", title: "What an FPU does", keywords: "Flow Processing Unit tensor machine learning" },
    { page: "index.html#features", crumb: "Overview", title: "Platform building blocks", keywords: "tiles memory compiler workgroup collectives" },
    { page: "index.html#platform-fit", crumb: "Overview", title: "Where FPU fits in a system", keywords: "CPU host accelerator" },
    { page: "index.html#models", crumb: "Overview", title: "FPU device family: E1, M2, M4", keywords: "models targets HBM hardware" },
    { page: "index.html#workflow", crumb: "Overview", title: "From source to execution", keywords: "compile load classifier" },
    { page: "architecture.html#execution", crumb: "Architecture", title: "Execution model", keywords: "command stream flb graph compiler" },
    { page: "architecture.html#tensor-engine", crumb: "Architecture", title: "Clusters and tensor engines", keywords: "matrix vector scalar DMA SRAM" },
    { page: "architecture.html#memory", crumb: "Architecture", title: "Memory hierarchy", keywords: "HBM SRAM registers buffers lifetime" },
    { page: "architecture.html#numerics", crumb: "Architecture", title: "Numeric formats", keywords: "float32 bfloat16 float16 int8 int4 float8 quantization" },
    { page: "architecture.html#interconnect", crumb: "Architecture", title: "FlowMesh interconnect", keywords: "all_sum all_gather reduce_scatter collective mesh" },
    { page: "architecture.html#isolation", crumb: "Architecture", title: "Isolation and reliability", keywords: "security queues signed binary health recovery" },
    { page: "quickstart.html#prerequisites", crumb: "Quickstart", title: "Prerequisites", keywords: "Linux Python pip requirements" },
    { page: "quickstart.html#install", crumb: "Quickstart", title: "Install the toolchain", keywords: "flowkit flowc fputool fpu-sim numpy" },
    { page: "quickstart.html#discover", crumb: "Quickstart", title: "Discover a target", keywords: "fputool status simulator FLOW_TARGET" },
    { page: "quickstart.html#program", crumb: "Quickstart", title: "Compile and run a tensor program", keywords: "vector_add TensorSpec to_device from_device" },
    { page: "quickstart.html#save", crumb: "Quickstart", title: "Save and reload a binary", keywords: "flb save load target" },
    { page: "quickstart.html#troubleshooting", crumb: "Quickstart", title: "Quickstart troubleshooting", keywords: "shape mismatch HBM allocation doctor" },
    { page: "programming.html#model", crumb: "Programming", title: "Programs and device arrays", keywords: "asynchronous immutable FlowKit" },
    { page: "programming.html#compilation", crumb: "Programming", title: "Graph compilation", keywords: "matmul relu fusion resource report" },
    { page: "programming.html#shapes", crumb: "Programming", title: "Shapes and layouts", keywords: "dynamic batch buckets padding TensorSpec" },
    { page: "programming.html#precision", crumb: "Programming", title: "Precision control", keywords: "bfloat16 accumulator CompileOptions quantization" },
    { page: "programming.html#parallel", crumb: "Programming", title: "Multi-device programs", keywords: "mesh shard data tensor pipeline parallel collectives" },
    { page: "programming.html#import", crumb: "Programming", title: "Importing a model", keywords: "ONNX FlowModel flm flowc unsupported operators" },
    { page: "programming.html#debugging", crumb: "Programming", title: "Debugging", keywords: "FLOW_SYNC FLOW_CHECK_NUMERICS NaN fusion" },
    { page: "performance.html#benchmark", crumb: "Performance", title: "A reliable benchmark", keywords: "warmup synchronize block_until_ready throughput" },
    { page: "performance.html#metrics", crumb: "Performance", title: "Metrics that matter", keywords: "latency occupancy HBM arithmetic intensity" },
    { page: "performance.html#profile", crumb: "Performance", title: "Profiler workflow", keywords: "fputool profile report timeline" },
    { page: "performance.html#bottlenecks", crumb: "Performance", title: "Reading bottlenecks", keywords: "memory compute idle HBM fusion batching" },
    { page: "performance.html#distributed", crumb: "Performance", title: "Workgroup scaling", keywords: "efficiency collective FlowMesh links" },
    { page: "performance.html#checklist", crumb: "Performance", title: "Optimization checklist", keywords: "correctness measurement profile rollout" },
    { page: "faq.html#name", crumb: "FAQ", title: "What does FPU stand for?", keywords: "Flow Processing Unit floating point" },
    { page: "faq.html#gpu", crumb: "FAQ", title: "Is an FPU a GPU?", keywords: "comparison accelerator" },
    { page: "faq.html#frameworks", crumb: "FAQ", title: "Model formats and framework support", keywords: "ONNX FlowModel exporter" },
    { page: "faq.html#training", crumb: "FAQ", title: "Training and inference", keywords: "gradients optimizer" },
    { page: "faq.html#dynamic-shapes", crumb: "FAQ", title: "Variable batch sizes and sequence lengths", keywords: "dynamic padding" },
    { page: "faq.html#precision", crumb: "FAQ", title: "Accuracy with bfloat16 and int8", keywords: "quantization precision" },
    { page: "faq.html#memory", crumb: "FAQ", title: "Why compilation can fail when a model fits in HBM", keywords: "SRAM resources memory" },
    { page: "faq.html#sharing", crumb: "FAQ", title: "Sharing one FPU between applications", keywords: "contexts isolation multi tenancy" },
    { page: "faq.html#simulator", crumb: "FAQ", title: "Simulator and performance testing", keywords: "fpu-sim functional timing" },
    { page: "faq.html#determinism", crumb: "FAQ", title: "Deterministic results", keywords: "reproducibility collectives atomics" },
    { page: "faq.html#binaries", crumb: "FAQ", title: "Flow binary portability", keywords: "flb target compatibility" },
    { page: "faq.html#errors", crumb: "FAQ", title: "Locating a failing operation", keywords: "NaN debugging FLOW_SYNC" },
    { page: "faq.html#support", crumb: "FAQ", title: "Getting help", keywords: "Discord email support@gonidoncloud.com doctor diagnostics support" }
  ];

  const quickLinks = [
    "index.html#what-is-fpu",
    "quickstart.html#install",
    "quickstart.html#program",
    "programming.html#compilation",
    "architecture.html#tensor-engine",
    "performance.html#profile"
  ];
  let selected = 0;

  function matchingItems() {
    const query = input.value.trim().toLowerCase();
    if (!query) return quickLinks.map((page) => INDEX.find((item) => item.page === page)).filter(Boolean);
    const terms = query.split(/\s+/);
    return INDEX.filter((item) => {
      const haystack = `${item.title} ${item.crumb} ${item.keywords}`.toLowerCase();
      return terms.every((term) => haystack.includes(term));
    }).sort((a, b) => {
      const aTitle = a.title.toLowerCase();
      const bTitle = b.title.toLowerCase();
      return Number(bTitle.startsWith(query)) - Number(aTitle.startsWith(query)) || aTitle.localeCompare(bTitle);
    }).slice(0, 9);
  }

  function updateSelection() {
    const links = results.querySelectorAll("a");
    links.forEach((link, index) => {
      const active = index === selected;
      link.classList.toggle("selected", active);
      link.setAttribute("aria-selected", String(active));
      if (active) {
        input.setAttribute("aria-activedescendant", link.id);
        link.scrollIntoView({ block: "nearest" });
      }
    });
  }

  function render() {
    const items = matchingItems();
    const query = input.value.trim();
    results.replaceChildren();
    selected = Math.min(selected, Math.max(items.length - 1, 0));

    const label = document.createElement("div");
    label.className = "search-section-label";
    label.textContent = query ? `${items.length} result${items.length === 1 ? "" : "s"}` : "Quick links";
    results.appendChild(label);

    if (items.length === 0) {
      const empty = document.createElement("div");
      empty.className = "no-results";
      empty.textContent = `No results for “${query}”`;
      results.appendChild(empty);
      input.removeAttribute("aria-activedescendant");
      return;
    }

    items.forEach((item, index) => {
      const link = document.createElement("a");
      const text = document.createElement("span");
      const crumb = document.createElement("span");
      const title = document.createElement("span");
      link.href = item.page;
      link.id = `search-result-${index}`;
      link.setAttribute("role", "option");
      text.className = "search-result-text";
      crumb.className = "crumb";
      crumb.textContent = item.crumb;
      title.className = "search-result-title";
      title.textContent = item.title;
      text.append(crumb, title);
      link.appendChild(text);
      link.insertAdjacentHTML("beforeend", '<svg class="search-result-arrow" viewBox="0 0 24 24" aria-hidden="true"><path d="m9 5 7 7-7 7"/></svg>');
      link.addEventListener("mouseenter", () => {
        selected = index;
        updateSelection();
      });
      results.appendChild(link);
    });
    updateSelection();
  }

  function openSearch() {
    modal.hidden = false;
    document.body.classList.add("search-open");
    input.value = "";
    selected = 0;
    render();
    input.focus();
  }

  function closeSearch(returnFocus = true) {
    if (modal.hidden) return;
    modal.hidden = true;
    document.body.classList.remove("search-open");
    if (returnFocus) trigger.focus();
  }

  trigger.addEventListener("click", openSearch);
  modal.querySelectorAll("[data-search-close]").forEach((element) => element.addEventListener("click", () => closeSearch()));
  results.addEventListener("click", (event) => {
    if (event.target.closest("a")) closeSearch(false);
  });
  input.addEventListener("input", () => {
    selected = 0;
    render();
  });

  input.addEventListener("keydown", (event) => {
    const links = results.querySelectorAll("a");
    if (event.key === "ArrowDown" && links.length) {
      event.preventDefault();
      selected = (selected + 1) % links.length;
      updateSelection();
    } else if (event.key === "ArrowUp" && links.length) {
      event.preventDefault();
      selected = selected <= 0 ? links.length - 1 : selected - 1;
      updateSelection();
    } else if (event.key === "Enter" && links[selected]) {
      event.preventDefault();
      window.location.href = links[selected].href;
    } else if (event.key === "Escape") {
      event.preventDefault();
      closeSearch();
    }
  });

  modal.addEventListener("keydown", (event) => {
    if (event.key !== "Tab") return;
    const focusable = [...modal.querySelectorAll('input, button, a[href]')].filter((element) => !element.hidden);
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last?.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first?.focus();
    }
  });

  document.addEventListener("keydown", (event) => {
    const active = document.activeElement;
    const editing = active && (active.matches("input, textarea, select") || active.isContentEditable);
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
      event.preventDefault();
      modal.hidden ? openSearch() : closeSearch();
    } else if (event.key === "/" && !editing && modal.hidden && !event.ctrlKey && !event.metaKey && !event.altKey) {
      event.preventDefault();
      openSearch();
    } else if (event.key === "Escape" && !modal.hidden) {
      closeSearch();
    }
  });
})();
