const state = {
  view: "home",
  lesson: null,
  completed: new Set(loadCompleted())
};

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];

function loadCompleted() {
  try {
    const raw = localStorage.getItem("als-completed");
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.filter(Boolean) : [];
  } catch {
    return [];
  }
}

function save() {
  localStorage.setItem(
    "als-completed",
    JSON.stringify([...state.completed])
  );
}

function toast(message) {
  const element = $("#toast");
  if (!element) return;

  element.textContent = message;
  element.classList.add("show");

  window.setTimeout(() => {
    element.classList.remove("show");
  }, 1800);
}

function progress() {
  if (!LESSONS.length) return 0;
  return Math.round((state.completed.size / LESSONS.length) * 100);
}

function moduleLessons(moduleId) {
  return LESSONS.filter((lesson) => lesson.module === moduleId);
}

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"]/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;"
  })[character]);
}

function escapeAttribute(value) {
  return escapeHtml(value).replace(/'/g, "&#39;");
}

function layout(title, subtitle, body) {
  const main = $("#main");
  if (!main) return;

  main.innerHTML = `
    <div class="section-head">
      <div>
        <div class="kicker">${escapeHtml(title)}</div>
        <p>${escapeHtml(subtitle)}</p>
      </div>
    </div>
    ${body}
  `;
}

function home() {
  const next =
    LESSONS.find((lesson) => !state.completed.has(lesson.id)) ||
    LESSONS[0];

  if (!next) {
    layout("Today", "Your learning workspace.", `
      <section class="card">
        <h2>Curriculum is ready</h2>
        <p>No learning objects are currently available.</p>
      </section>
    `);
    return;
  }

  const percentage = progress();

  layout(
    "Today",
    "A calm workspace for deliberate learning.",
    `
      <section class="hero">
        <div class="hero-card">
          <div class="kicker">Continue learning</div>
          <h1>${escapeHtml(next.title)}</h1>
          <p>${escapeHtml(next.objective)}</p>
          <button class="action" id="continueLesson">
            Continue lesson
          </button>
        </div>

        <div class="metric-card card">
          <div>
            <div class="metric-label">Curriculum progress</div>
            <div class="metric-value">${percentage}%</div>
          </div>

          <div>
            <div class="progress">
              <i style="width:${percentage}%"></i>
            </div>
            <div class="metric-label" style="margin-top:9px">
              ${state.completed.size} of ${LESSONS.length} learning objects completed
            </div>
          </div>
        </div>
      </section>

      <div class="section-head">
        <div>
          <h2>Curriculum</h2>
          <p>
            Six connected domains. Experiences will increasingly adapt to
            capability rather than force a fixed sequence.
          </p>
        </div>
      </div>

      <div class="grid">
        ${CURRICULUM.modules.map(moduleCard).join("")}
      </div>
    `
  );

  $("#continueLesson")?.addEventListener("click", () => {
    openLesson(next.id);
  });

  $$("[data-open-module]").forEach((button) => {
    button.addEventListener("click", () => {
      showModule(button.dataset.openModule);
    });
  });
}

function moduleCard(module) {
  return `
    <article class="card module-card">
      <div>
        <div class="module-num">MODULE ${module.number}</div>
        <h3>${escapeHtml(module.title)}</h3>
        <p>${escapeHtml(module.desc)}</p>
      </div>

      <div>
        <div class="pill-row">
          ${module.tags
            .map((tag) => `<span class="pill">${escapeHtml(tag)}</span>`)
            .join("")}
        </div>

        <button
          class="action secondary"
          data-open-module="${escapeAttribute(module.id)}"
        >
          Open module
        </button>
      </div>
    </article>
  `;
}

function showModule(moduleId) {
  const module = CURRICULUM.modules.find((item) => item.id === moduleId);

  if (!module) {
    toast("Module not found");
    return;
  }

  const lessons = moduleLessons(moduleId);

  layout(
    `Module ${module.number}`,
    module.title,
    `
      <div class="card" style="margin-bottom:16px">
        <h2 style="margin:0 0 8px">${escapeHtml(module.title)}</h2>
        <p style="color:var(--muted)">
          ${escapeHtml(module.desc)}
        </p>

        <div class="pill-row">
          ${module.units
            .map(
              ([unit]) =>
                `<span class="pill">${escapeHtml(unit)}</span>`
            )
            .join("")}
        </div>
      </div>

      ${module.masteryGate ? `
        <section class="card" style="margin-bottom:16px">
          <div class="module-num">MASTERY GATE</div>
          <h3 style="margin:6px 0 8px">${escapeHtml(module.masteryGate.title)}</h3>
          <p style="color:var(--muted);margin-top:0">${escapeHtml(module.masteryGate.deliverable)}</p>
          <div class="dossier-section" style="margin-top:14px">
            <h4 style="margin:0 0 8px">Mastery criteria</h4>
            <ol class="checkpoint-list">
              ${module.masteryGate.criteria.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}
            </ol>
          </div>
          <div class="pill-row">
            ${module.masteryGate.capabilities.map((item) => `<span class="pill">${escapeHtml(item)}</span>`).join("")}
          </div>
        </section>
      ` : ""}

      <div class="lesson-list">
        ${lessons.map(lessonRow).join("")}
      </div>
    `
  );

  bindLessonRows();
}

function lessonRow(lesson) {
  const done = state.completed.has(lesson.id);

  return `
    <button
      class="lesson-row ${done ? "done" : ""}"
      data-open-lesson="${escapeAttribute(lesson.id)}"
    >
      <span class="check">${done ? "✓" : ""}</span>
      <span>
        <strong>${escapeHtml(lesson.id)} · ${escapeHtml(lesson.title)}</strong>
        <small>${escapeHtml(lesson.unit)} · ${escapeHtml(lesson.stage)}</small>
      </span>
    </button>
  `;
}

function bindLessonRows() {
  $$("[data-open-lesson]").forEach((button) => {
    button.addEventListener("click", () => {
      openLesson(button.dataset.openLesson);
    });
  });
}

function module02Interaction(lesson) {
  if (lesson.module !== "m2") return "";

  const unit = lesson.unit;
  const configs = {
    "Regression & Classification": {
      title: "Prediction Playground",
      prompt: "Move the regularization strength and predict what happens before applying it.",
      control: "Regularization λ",
      min: 0, max: 10, step: 0.1, value: 1,
      compute: (v) => {
        const fit = 0.92 - 0.055 * Math.log1p(v);
        const complexity = 1 / (1 + v);
        const calibration = Math.min(0.98, 0.68 + 0.24 * Math.exp(-0.45 * Math.abs(v - 1.8)));
        return {primary: fit, secondary: complexity, tertiary: calibration, labels:["Validation quality","Model flexibility","Calibration"]};
      },
      note: "This is a conceptual simulator. Its purpose is to make the regularization trade-off visible before you work with a real dataset."
    },
    "Trees & Ensembles": {
      title: "Tree Split Playground",
      prompt: "Change tree depth and predict how training fit and generalization will move.",
      control: "Tree depth",
      min: 1, max: 12, step: 1, value: 4,
      compute: (v) => {
        const train = Math.min(.995, .55 + .42 * (1 - Math.exp(-v / 2.4)));
        const general = Math.max(.58, .91 - .018 * Math.max(0, v - 4) - .025 * Math.max(0, 2 - v));
        return {primary: train, secondary: general, tertiary: Math.max(0.05, 1 - Math.abs(v-5)/10), labels:["Training fit","Validation fit","Useful complexity"]};
      },
      note: "The curves are illustrative, not a claim about a universal optimum. Your real dataset determines the measured behavior."
    },
    "Unsupervised Learning": {
      title: "Clustering Assumption Lab",
      prompt: "Increase feature scale and predict whether the cluster assignments should change.",
      control: "Scale of feature 2",
      min: 0.2, max: 5, step: 0.1, value: 1,
      compute: (v) => {
        const stability = Math.max(.08, 1 - Math.abs(Math.log(v)) * .38);
        const separation = Math.min(.98, .72 + .25 * Math.exp(-Math.abs(v-1)));
        const distortion = Math.min(.98, .2 + .16 * Math.abs(v-1));
        return {primary: stability, secondary: separation, tertiary: distortion, labels:["Assignment stability","Separation signal","Geometry distortion"]};
      },
      note: "The interaction illustrates why distance-based methods depend on representation and feature scale."
    },
    "Evaluation & Validation": {
      title: "Evaluation Protocol Lab",
      prompt: "Increase the number of validation folds and observe the trade-off between estimate stability and compute.",
      control: "CV folds",
      min: 2, max: 10, step: 1, value: 5,
      compute: (v) => {
        const stability = .55 + .42 * (1 - Math.exp(-v / 3));
        const compute = Math.max(.1, 1 - (v-2)/10);
        const leakage = 1;
        return {primary: stability, secondary: compute, tertiary: leakage, labels:["Estimate stability","Relative compute efficiency","Protocol validity"]};
      },
      note: "More folds do not automatically make an evaluation valid. Split boundaries and preprocessing scope still matter."
    },
    "ML Engineering Patterns": {
      title: "Baseline vs Complexity Lab",
      prompt: "Increase model complexity and predict whether it actually improves the measured workflow.",
      control: "Model complexity",
      min: 1, max: 10, step: 1, value: 3,
      compute: (v) => {
        const performance = .62 + .28 * (1 - Math.exp(-v / 2.8));
        const reproducibility = Math.max(.55, .94 - .025 * v);
        const diagnostic = Math.max(.2, .92 - .04 * Math.max(0, v-5));
        return {primary: performance, secondary: reproducibility, tertiary: diagnostic, labels:["Measured performance","Workflow reproducibility","Diagnostic clarity"]};
      },
      note: "Complexity is not a goal by itself. A candidate model must beat the baseline under the same protocol."
    }
  };
  const cfg = configs[unit];
  if (!cfg) return "";
  const id = "m2lab-" + lesson.id.replace(/[^a-zA-Z0-9_-]/g,"");
  return `
    <section class="interactive-card" data-m2-interactive data-unit="${escapeAttribute(unit)}">
      <div class="interactive-head">
        <div>
          <div class="module-num">INTERACTIVE LAB</div>
          <h3>${escapeHtml(cfg.title)}</h3>
          <p>${escapeHtml(cfg.prompt)}</p>
        </div>
        <span class="interactive-state" id="${id}-state">Prediction first</span>
      </div>
      <div class="interactive-control">
        <label for="${id}">${escapeHtml(cfg.control)} <strong id="${id}-value">${cfg.value}</strong></label>
        <input id="${id}" type="range" min="${cfg.min}" max="${cfg.max}" step="${cfg.step}" value="${cfg.value}">
      </div>
      <div class="interactive-metrics" id="${id}-metrics"></div>
      <div class="interactive-actions">
        <button class="action secondary" type="button" data-m2-predict="${id}">Reveal measured behavior</button>
        <button class="action secondary" type="button" data-m2-reset="${id}">Reset</button>
      </div>
      <p class="interactive-note">${escapeHtml(cfg.note)}</p>
    </section>
  `;
}

function bindModule02Interaction() {
  $("[data-m2-interactive]").forEach((card) => {
    const input = card.querySelector('input[type="range"]');
    const metrics = card.querySelector(".interactive-metrics");
    const stateLabel = card.querySelector(".interactive-state");
    const predictButton = card.querySelector("[data-m2-predict]");
    const resetButton = card.querySelector("[data-m2-reset]");
    const unit = card.dataset.unit;
    const configs = {
      "Regression & Classification": {compute:(v)=>{const fit=.92-.055*Math.log1p(v), complexity=1/(1+v), calibration=Math.min(.98,.68+.24*Math.exp(-.45*Math.abs(v-1.8)));return {primary:fit,secondary:complexity,tertiary:calibration,labels:["Validation quality","Model flexibility","Calibration"]};}},
      "Trees & Ensembles": {compute:(v)=>{const train=Math.min(.995,.55+.42*(1-Math.exp(-v/2.4))),general=Math.max(.58,.91-.018*Math.max(0,v-4)-.025*Math.max(0,2-v));return {primary:train,secondary:general,tertiary:Math.max(.05,1-Math.abs(v-5)/10),labels:["Training fit","Validation fit","Useful complexity"]};}},
      "Unsupervised Learning": {compute:(v)=>{const stability=Math.max(.08,1-Math.abs(Math.log(v))*.38),separation=Math.min(.98,.72+.25*Math.exp(-Math.abs(v-1))),distortion=Math.min(.98,.2+.16*Math.abs(v-1));return {primary:stability,secondary:separation,tertiary:distortion,labels:["Assignment stability","Separation signal","Geometry distortion"]};}},
      "Evaluation & Validation": {compute:(v)=>{const stability=.55+.42*(1-Math.exp(-v/3)),compute=Math.max(.1,1-(v-2)/10);return {primary:stability,secondary:compute,tertiary:1,labels:["Estimate stability","Relative compute efficiency","Protocol validity"]};}},
      "ML Engineering Patterns": {compute:(v)=>{const performance=.62+.28*(1-Math.exp(-v/2.8)),reproducibility=Math.max(.55,.94-.025*v),diagnostic=Math.max(.2,.92-.04*Math.max(0,v-5));return {primary:performance,secondary:reproducibility,tertiary:diagnostic,labels:["Measured performance","Workflow reproducibility","Diagnostic clarity"]};}}
    };
    const cfg = configs[unit];
    if (!cfg || !input || !metrics) return;
    const render = (reveal=false) => {
      const v = Number(input.value);
      card.querySelector("#"+CSS.escape(input.id)+"-value").textContent = Number.isInteger(v) ? v : v.toFixed(1);
      const result = cfg.compute(v);
      metrics.innerHTML = result.labels.map((label,index) => {
        const val = [result.primary,result.secondary,result.tertiary][index];
        return '<div class="interactive-metric"><span>'+escapeHtml(label)+'</span><strong>'+Math.round(val*100)+'%</strong><i><b style="width:'+Math.round(val*100)+'%"></b></i></div>';
      }).join("");
      stateLabel.textContent = reveal ? "Measured behavior revealed" : "Prediction first";
    };
    input.addEventListener("input", () => render(false));
    predictButton?.addEventListener("click", () => render(true));
    resetButton?.addEventListener("click", () => { input.value = input.defaultValue; render(false); });
    render(false);
  });
}

function openLesson(lessonId) {
  const lesson = LESSONS.find((item) => item.id === lessonId);

  if (!lesson) {
    toast("Learning object not found");
    return;
  }

  state.lesson = lessonId;

  $("#main").innerHTML = `
    <div class="lesson-layout">
      <article class="card reader">
        <div class="kicker">
          ${escapeHtml(lesson.id)} · ${escapeHtml(lesson.moduleTitle)}
        </div>

        <h1>${escapeHtml(lesson.title)}</h1>
        <div class="pill-row"><span class="pill">${escapeHtml(lesson.type)}</span><span class="pill">${escapeHtml(lesson.minutes)} min</span></div>
        <p class="lead">${escapeHtml(lesson.objective)}</p>

        <div class="dossier">
          ${dossierSection("Prerequisites", lesson.prerequisite)}
          ${lesson.whyItMatters ? dossierSection("Why this matters", lesson.whyItMatters) : ""}
          ${lesson.lessonBody ? dossierSection("Start here", lesson.lessonBody) : ""}
          ${dossierListSection("Mental model", lesson.mentalModel)}
          ${dossierListSection("Beginner vocabulary", lesson.vocabulary)}
          ${dossierSection("Mathematical model", lesson.math)}
          ${dossierSection("Mechanism", lesson.mechanism)}
          ${lesson.workedExample ? dossierSection(lesson.workedExample.title, lesson.workedExample.text + " " + lesson.workedExample.steps.join(" ")) : ""}
          ${lesson.secondExample ? dossierSection(lesson.secondExample.title, lesson.secondExample.text + " " + lesson.secondExample.steps.join(" ")) : ""}\n          ${module02Interaction(lesson)}

          <section class="dossier-section">
            <h3>Implementation</h3>
            <p>${escapeHtml(lesson.implementation)}</p>
            <pre class="code">${escapeHtml(lesson.code)}</pre>
          </section>

          ${dossierListSection("Practice before you code", lesson.practice, true)}
          ${dossierListSection("Beginner warnings", lesson.beginnerWarnings)}
          ${dossierSection("Experiment", lesson.experiment)}
          ${lesson.lab ? dossierSection(lesson.lab.title, lesson.lab.objective + " " + lesson.lab.steps.join(" ") + " Success condition: " + lesson.lab.success) : ""}
          ${dossierSection("Failure analysis", lesson.failure)}
          ${dossierListSection("Common misconceptions", lesson.misconceptions)}
          ${dossierSection("What demonstrates mastery", lesson.evidence)}
          ${dossierSection("Expected output", lesson.deliverable)}
          ${lesson.takeaway ? dossierSection("Takeaway", lesson.takeaway) : ""}
          ${lesson.lessonBodyExtra ? dossierSection("Connecting to later ML", lesson.lessonBodyExtra) : ""}

          <section class="dossier-section">
            <h3>Checkpoint</h3>
            <ol class="checkpoint-list">
              ${lesson.checkpoint
                .map((item) => `<li>${escapeHtml(item)}</li>`)
                .join("")}
            </ol>
          </section>

          <details class="dossier-section checkpoint-answers">
            <summary>Reveal checkpoint answers</summary>
            ${dossierListSection("Checkpoint answers", lesson.checkpointAnswers, true)}
          </details>
          ${dossierListSection("Highlights", lesson.highlights)}
          ${dossierListSection("Key notes", lesson.keyNotes)}
        </div>
      </article>

      <aside class="card side-card">
        <div class="kicker">${escapeHtml(lesson.stage)}</div>
        <h3>${escapeHtml(lesson.unit)}</h3>

        <p style="color:var(--muted);font-size:12px;line-height:1.6">
          Completion is only a progress signal. Capability progression will be based on demonstrated work.
        </p>

        <button class="action" id="completeBtn">
          ${state.completed.has(lesson.id) ? "Completed ✓" : "Mark complete"}
        </button>

        <button class="action secondary" id="backToModule">
          Back to module
        </button>
      </aside>
    </div>
  `;

  bindModule02Interaction();\n\n  $("#completeBtn")?.addEventListener("click", () => {
    if (state.completed.has(lessonId)) {
      state.completed.delete(lessonId);
      save();
      openLesson(lessonId);
      toast("Completion reset");
      return;
    }

    state.completed.add(lessonId);
    save();
    openLesson(lessonId);
    toast("Learning object completed");
  });

  $("#backToModule")?.addEventListener("click", () => {
    showModule(lesson.module);
  });

  window.scrollTo({ top: 0, behavior: "smooth" });
}

function dossierListSection(title, items, ordered = false) {
  if (!Array.isArray(items) || !items.length) return "";
  const tag = ordered ? "ol" : "ul";
  const list = items.map((item) => "<li>" + escapeHtml(item) + "</li>").join("");
  return "<section class=\"dossier-section\"><h3>" + escapeHtml(title) + "</h3><" + tag + ">" + list + "</" + tag + "></section>";
}

function dossierSection(title, content) {
  return `
    <section class="dossier-section">
      <h3>${escapeHtml(title)}</h3>
      <p>${escapeHtml(content)}</p>
    </section>
  `;
}

function learn() {
  layout(
    "Explore",
    "Browse the current curriculum map.",
    `
      <div class="grid">
        ${CURRICULUM.modules
          .map(
            (module) => `
              <article class="card module-card">
                <div>
                  <div class="module-num">MODULE ${module.number}</div>
                  <h3>${escapeHtml(module.title)}</h3>
                  <p>${escapeHtml(module.desc)}</p>
                </div>

                <button
                  class="action secondary"
                  data-open-module="${escapeAttribute(module.id)}"
                >
                  Browse ${moduleLessons(module.id).length} learning objects
                </button>
              </article>
            `
          )
          .join("")}
      </div>
    `
  );

  $$("[data-open-module]").forEach((button) => {
    button.addEventListener("click", () => {
      showModule(button.dataset.openModule);
    });
  });
}

function progressView() {
  const percentage = progress();

  layout(
    "Progress",
    "Progress is a signal. Demonstrated work will become the primary mastery record.",
    `
      <div class="card" style="padding:28px">
        <div class="metric-value">${percentage}%</div>
        <p style="color:var(--muted)">
          ${state.completed.size} completed of ${LESSONS.length} learning objects.
        </p>

        <div class="progress">
          <i style="width:${percentage}%"></i>
        </div>
      </div>

      <div class="grid" style="margin-top:16px">
        ${CURRICULUM.modules
          .map((module) => {
            const lessons = moduleLessons(module.id);
            const completed = lessons.filter((lesson) =>
              state.completed.has(lesson.id)
            ).length;
            const moduleProgress = lessons.length
              ? Math.round((completed / lessons.length) * 100)
              : 0;

            return `
              <div class="card">
                <div class="module-num">M${module.number}</div>
                <h3>${escapeHtml(module.title)}</h3>
                <p style="color:var(--muted)">
                  ${completed}/${lessons.length} learning objects
                </p>
                <div class="progress">
                  <i style="width:${moduleProgress}%"></i>
                </div>
              </div>
            `;
          })
          .join("")}
      </div>
    `
  );
}

function labs() {
  const labNames = [
    "Numerical stability",
    "Gradient checking",
    "Evaluation harness",
    "Attention visualization",
    "Retrieval evaluation",
    "Inference benchmarking"
  ];

  layout(
    "Labs",
    "Experiments are first-class learning objects.",
    `
      <div class="grid">
        ${labNames
          .map(
            (name, index) => `
              <article class="card">
                <div class="module-num">
                  LAB ${String(index + 1).padStart(2, "0")}
                </div>
                <h3>${escapeHtml(name)}</h3>
                <p style="color:var(--muted)">
                  Run a controlled experiment, change one variable and preserve
                  the evidence.
                </p>
                <button class="action secondary" data-lab>
                  Open lab
                </button>
              </article>
            `
          )
          .join("")}
      </div>
    `
  );

  $$("[data-lab]").forEach((button) => {
    button.addEventListener("click", () => {
      toast("Lab workspace is the next vertical slice");
    });
  });
}

function projects() {
  const projectNames = [
    "From-scratch ML baseline",
    "Neural network + debugging log",
    "Minimal GPT + tokenizer",
    "Distributed training benchmark",
    "Agent + red-team report",
    "Research ablation"
  ];

  layout(
    "Projects",
    "Portfolio artifacts built from the curriculum.",
    `
      <div class="grid">
        ${projectNames
          .map(
            (name, index) => `
              <article class="card">
                <div class="module-num">
                  PROJECT ${String(index + 1).padStart(2, "0")}
                </div>
                <h3>${escapeHtml(name)}</h3>
                <p style="color:var(--muted)">
                  Artifact-driven work with code, measurements, limitations and
                  reproducibility notes.
                </p>
              </article>
            `
          )
          .join("")}
      </div>
    `
  );
}

function route(view) {
  state.view = view;

  const routes = {
    home,
    learn,
    labs,
    projects,
    progress: progressView
  };

  (routes[view] || home)();
}

function openSearch() {
  $("#searchSheet")?.classList.add("open");
  $("#sheetBackdrop")?.classList.add("open");
  $("#searchInput")?.focus();
}

function closeSearch() {
  $("#searchSheet")?.classList.remove("open");
  $("#sheetBackdrop")?.classList.remove("open");
}

function updateActiveNavigation(activeButton) {
  $$(".nav-item").forEach((button) => {
    button.classList.toggle("active", button === activeButton);
  });
}

function bindGlobalEvents() {
  const sidebar = $("#sidebar");
  const menuButton = $("#menuBtn");
  const menuBackdrop = $("#menuBackdrop");

  const setMenuOpen = (open) => {
    sidebar?.classList.toggle("open", open);
    menuBackdrop?.classList.toggle("open", open);
    menuButton?.setAttribute("aria-expanded", String(open));
    menuButton?.setAttribute("aria-label", open ? "Close navigation" : "Open navigation");
  };

  $$(".nav-item").forEach((button) => {
    button.addEventListener("click", () => {
      route(button.dataset.view);
      setMenuOpen(false);
      updateActiveNavigation(button);
    });
  });

  menuButton?.addEventListener("click", () => {
    setMenuOpen(!sidebar?.classList.contains("open"));
  });

  menuBackdrop?.addEventListener("click", () => setMenuOpen(false));

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      setMenuOpen(false);
      closeSearch();
    }
  });

  $("#searchBtn")?.addEventListener("click", openSearch);
  $("#closeSearch")?.addEventListener("click", closeSearch);
  $("#sheetBackdrop")?.addEventListener("click", closeSearch);

  $("#searchInput")?.addEventListener("input", (event) => {
    const query = event.target.value.trim().toLowerCase();
    const results = $("#searchResults");

    if (!results) return;

    if (!query) {
      results.innerHTML =
        '<p style="color:var(--muted);font-size:12px">Type a concept, unit or learning object.</p>';
      return;
    }

    const matches = LESSONS.filter((lesson) =>
      [
        lesson.title,
        lesson.unit,
        lesson.moduleTitle,
        lesson.scope
      ]
        .join(" ")
        .toLowerCase()
        .includes(query)
    ).slice(0, 30);

    if (!matches.length) {
      results.innerHTML =
        '<p style="color:var(--muted);font-size:12px">No matching learning object.</p>';
      return;
    }

    results.innerHTML = matches
      .map(
        (lesson) => `
          <div class="search-result">
            <button data-search-lesson="${escapeAttribute(lesson.id)}">
              <strong>
                ${escapeHtml(lesson.id)} · ${escapeHtml(lesson.title)}
              </strong>
              <div style="font-size:11px;color:var(--muted);margin-top:3px">
                ${escapeHtml(lesson.moduleTitle)} · ${escapeHtml(lesson.unit)}
              </div>
            </button>
          </div>
        `
      )
      .join("");

    $$("[data-search-lesson]").forEach((button) => {
      button.addEventListener("click", () => {
        closeSearch();
        openLesson(button.dataset.searchLesson);
      });
    });
  });
}

function initialize() {
  bindGlobalEvents();
  home();
}

initialize();
