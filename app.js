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

      <div class="module-card-meta">
        <span class="lesson-count">${moduleLessons(module.id).length} lessons</span>
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
  if (lesson.module !== "m2" || !window.Module02Labs) return "";
  return window.Module02Labs.render(lesson);
}

function bindModule02Interaction() {
  if (window.Module02Labs) window.Module02Labs.bind();
}

function beginnerMathBridge(lesson) {
  if (!window.BeginnerMathBridge || lesson.module !== "m3") return "";
  return window.BeginnerMathBridge.render(lesson.unit);
}

function module03Interaction(lesson) {
  if (lesson.module !== "m3" || !window.Module03Labs) return "";
  return window.Module03Labs.render(lesson);
}

function bindModule03Interaction() {
  if (window.Module03Labs) window.Module03Labs.bind();
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
          ${module03Interaction(lesson)}
          ${beginnerMathBridge(lesson)}

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

  bindModule02Interaction();
  bindModule03Interaction();

  $("#completeBtn")?.addEventListener("click", () => {
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
    {
      id: "numerical-stability",
      name: "Numerical stability",
      objective: "Compare a naive computation with a numerically stable formulation and explain the error.",
      steps: ["Create the baseline computation.", "Increase the conditioning challenge.", "Measure absolute error.", "Explain the stability boundary."]
    },
    {
      id: "gradient-checking",
      name: "Gradient checking",
      objective: "Validate an analytical gradient against finite differences before trusting a training implementation.",
      steps: ["Implement the analytical gradient.", "Compute finite-difference estimates.", "Sweep epsilon.", "Investigate the largest disagreement."]
    },
    {
      id: "evaluation-harness",
      name: "Evaluation harness",
      objective: "Build a repeatable evaluation protocol that separates data, metric, model and reporting errors.",
      steps: ["Freeze the dataset split.", "Define metrics before running.", "Execute the baseline.", "Record failures and regression checks."]
    },
    {
      id: "attention-visualization",
      name: "Attention visualization",
      objective: "Inspect attention weights and test whether the visualization supports the claimed mechanism.",
      steps: ["Select a fixed input.", "Inspect attention weights.", "Change one token or mask condition.", "Compare behavior with the prediction."]
    },
    {
      id: "retrieval-evaluation",
      name: "Retrieval evaluation",
      objective: "Measure whether a retrieval system finds useful evidence before optimizing generation.",
      steps: ["Create a small query set.", "Define relevant documents.", "Measure recall@k.", "Inspect misses and latency."]
    },
    {
      id: "inference-benchmarking",
      name: "Inference benchmarking",
      objective: "Measure latency and throughput under controlled serving conditions.",
      steps: ["Warm the runtime.", "Run repeated measurements.", "Report p50/p95 and throughput.", "Explain the dominant bottleneck."]
    }
  ];

  layout(
    "Labs",
    "Controlled experiments with a baseline, intervention, measurement and conclusion.",
    `
      <section class="card" style="margin-bottom:16px">
        <div class="module-num">EXPERIMENT PROTOCOL</div>
        <h2 style="margin:6px 0 8px">Build → break → measure → explain</h2>
        <p style="color:var(--muted);max-width:850px">
          These labs are functional learning workspaces. Each one gives you a controlled protocol rather than a passive article.
        </p>
      </section>
      <div class="grid">
        ${labNames.map((lab, index) => `
          <article class="card">
            <div class="module-num">LAB ${String(index + 1).padStart(2, "0")}</div>
            <h3>${escapeHtml(lab.name)}</h3>
            <p style="color:var(--muted)">${escapeHtml(lab.objective)}</p>
            <button class="action secondary" data-lab-id="${escapeAttribute(lab.id)}">Open lab</button>
          </article>
        `).join("")}
      </div>
    `
  );

  $$("[data-lab-id]").forEach((button) => {
    button.addEventListener("click", () => {
      const lab = labNames.find((item) => item.id === button.dataset.labId);
      if (!lab) return;
      layout(
        lab.name,
        "Controlled lab",
        `
          <div class="lesson-layout">
            <article class="card reader">
              <div class="kicker">LAB WORKSPACE</div>
              <h1>${escapeHtml(lab.name)}</h1>
              <p class="lead">${escapeHtml(lab.objective)}</p>
              <section class="dossier-section">
                <h3>Protocol</h3>
                <ol class="checkpoint-list">
                  ${lab.steps.map((step) => `<li>${escapeHtml(step)}</li>`).join("")}
                </ol>
              </section>
              <section class="dossier-section">
                <h3>Evidence record</h3>
                <label style="display:block;font-size:12px;color:var(--muted);margin-bottom:8px" for="labObservation">Observation</label>
                <textarea id="labObservation" rows="7" style="width:100%;resize:vertical;padding:12px;border:1px solid var(--line);border-radius:14px;background:white;outline:none" placeholder="Record measurements, failures and what changed."></textarea>
                <button class="action" id="saveLabEvidence">Save local evidence</button>
                <p id="labEvidenceStatus" style="font-size:12px;color:var(--muted);margin-bottom:0"></p>
              </section>
            </article>
            <aside class="card side-card">
              <div class="kicker">SUCCESS CONDITION</div>
              <h3>Reproducible evidence</h3>
              <p style="color:var(--muted);font-size:12px;line-height:1.6">A useful result includes the baseline, changed variable, measurements, interpretation and limitations.</p>
              <button class="action secondary" id="backToLabs">Back to Labs</button>
            </aside>
          </div>
        `
      );
      const key = "als-lab-" + lab.id;
      const observation = localStorage.getItem(key) || "";
      const input = $("#labObservation");
      const status = $("#labEvidenceStatus");
      if (input) input.value = observation;
      $("#saveLabEvidence")?.addEventListener("click", () => {
        localStorage.setItem(key, input?.value || "");
        if (status) status.textContent = "Evidence saved locally.";
        toast("Lab evidence saved");
      });
      $("#backToLabs")?.addEventListener("click", labs);
    });
  });
}

function aiTools() {
  const tools = Array.isArray(window.AI_TOOLS) ? window.AI_TOOLS : [];
  const categories = [...new Set(tools.map((tool) => tool.category))];
  layout(
    "AI Tools",
    "Learn the modern AI toolchain by workflow, not by memorizing product names.",
    `
      <section class="card" style="margin-bottom:16px">
        <div class="module-num">TOOL FLUENCY</div>
        <h2 style="margin:6px 0 8px">From prompting to production</h2>
        <p style="color:var(--muted);max-width:850px">
          Every tool is taught through a real task, verification step, failure mode and evidence requirement.
          Tools change quickly; the transferable skill is knowing how to select, operate, evaluate and secure them.
        </p>
        <div class="pill-row">
          <span class="pill">${tools.length} tools</span>
          <span class="pill">${categories.length} categories</span>
          <span class="pill">Hands-on missions</span>
        </div>
      </section>
      <div class="grid">
        ${tools.map((tool) => `
          <article class="card">
            <div class="module-num">${escapeHtml(tool.category)}</div>
            <h3>${escapeHtml(tool.name)}</h3>
            <div class="pill-row">${tool.skills.map((skill) => `<span class="pill">${escapeHtml(skill)}</span>`).join("")}</div>
            <p style="color:var(--muted);margin:14px 0">${escapeHtml(tool.mission)}</p>
            <button class="action secondary" data-tool-id="${escapeAttribute(tool.id)}">Open mission</button>
          </article>
        `).join("")}
      </div>
    `
  );
  $$("[data-tool-id]").forEach((button) => {
    button.addEventListener("click", () => {
      const tool = tools.find((item) => item.id === button.dataset.toolId);
      if (!tool) return;
      layout(
        tool.name,
        tool.category,
        `
          <div class="lesson-layout">
            <article class="card reader">
              <div class="kicker">APPLIED AI TOOL MISSION</div>
              <h1>${escapeHtml(tool.name)}</h1>
              <div class="pill-row">${tool.skills.map((skill) => `<span class="pill">${escapeHtml(skill)}</span>`).join("")}</div>
              <section class="dossier-section">
                <h3>Mission</h3>
                <p>${escapeHtml(tool.mission)}</p>
              </section>
              <section class="dossier-section">
                <h3>Operating protocol</h3>
                <ol class="checkpoint-list">
                  <li>Define the task and acceptance criteria before opening the tool.</li>
                  <li>Use the smallest permissions and context needed.</li>
                  <li>Inspect generated output, sources, tool calls and assumptions.</li>
                  <li>Run an independent test or comparison before trusting the result.</li>
                  <li>Record what failed, what changed and what evidence supports the final result.</li>
                </ol>
              </section>
              <section class="dossier-section">
                <h3>Mastery evidence</h3>
                <p>A completed artifact, verification record, failure analysis and short reflection on where the tool should and should not be trusted.</p>
              </section>
            </article>
            <aside class="card side-card">
              <div class="kicker">CATEGORY</div>
              <h3>${escapeHtml(tool.category)}</h3>
              <button class="action" id="backToTools">Back to AI Tools</button>
            </aside>
          </div>
        `
      );
      $("#backToTools")?.addEventListener("click", aiTools);
    });
  });
}

function projects() {
  const projectNames = [
    {id:"ml-baseline",name:"From-scratch ML baseline",domain:"Classical ML",deliverable:"A tested baseline with metric report, error analysis and reproducibility notes."},
    {id:"nn-debugging",name:"Neural network + debugging log",domain:"Deep Learning",deliverable:"A working model plus gradient/activation diagnostics and a failure narrative."},
    {id:"minimal-gpt",name:"Minimal GPT + tokenizer",domain:"Generative AI",deliverable:"A small autoregressive model with tokenizer, training trace and evaluation."},
    {id:"distributed-benchmark",name:"Distributed training benchmark",domain:"AI Systems",deliverable:"A scaling report covering throughput, communication cost and bottlenecks."},
    {id:"agent-redteam",name:"Agent + red-team report",domain:"Agentic AI",deliverable:"A bounded agent, adversarial test suite and safety findings."},
    {id:"research-ablation",name:"Research ablation",domain:"Research Engineering",deliverable:"A hypothesis-driven experiment with baselines, ablations, uncertainty and limitations."}
  ];

  layout(
    "Projects",
    "Portfolio-grade artifacts built from concepts, labs and evidence.",
    `
      <section class="card" style="margin-bottom:16px">
        <div class="module-num">PROJECT WORKSPACE</div>
        <h2 style="margin:6px 0 8px">Build something you can defend</h2>
        <p style="color:var(--muted);max-width:850px">Each project is defined by a deliverable, evaluation evidence and a technical explanation—not by a title alone.</p>
      </section>
      <div class="grid">
        ${projectNames.map((project, index) => `
          <article class="card">
            <div class="module-num">PROJECT ${String(index + 1).padStart(2, "0")} · ${escapeHtml(project.domain)}</div>
            <h3>${escapeHtml(project.name)}</h3>
            <p style="color:var(--muted)">${escapeHtml(project.deliverable)}</p>
            <button class="action secondary" data-project-id="${escapeAttribute(project.id)}">Open project</button>
          </article>
        `).join("")}
      </div>
    `
  );

  $$("[data-project-id]").forEach((button) => {
    button.addEventListener("click", () => {
      const project = projectNames.find((item) => item.id === button.dataset.projectId);
      if (!project) return;
      layout(
        project.name,
        project.domain,
        `
          <div class="lesson-layout">
            <article class="card reader">
              <div class="kicker">PROJECT WORKSPACE</div>
              <h1>${escapeHtml(project.name)}</h1>
              <section class="dossier-section">
                <h3>Deliverable</h3>
                <p>${escapeHtml(project.deliverable)}</p>
              </section>
              <section class="dossier-section">
                <h3>Build plan</h3>
                <ol class="checkpoint-list">
                  <li>Write the problem statement and acceptance criteria.</li>
                  <li>Establish a reproducible baseline.</li>
                  <li>Implement the smallest useful system.</li>
                  <li>Test normal, boundary and adversarial cases.</li>
                  <li>Measure performance and explain failure modes.</li>
                  <li>Package the artifact with limitations and reproduction steps.</li>
                </ol>
              </section>
              <section class="dossier-section">
                <h3>Project notes</h3>
                <textarea id="projectNotes" rows="9" style="width:100%;resize:vertical;padding:12px;border:1px solid var(--line);border-radius:14px;background:white;outline:none" placeholder="Track decisions, experiments, evidence and open questions."></textarea>
                <button class="action" id="saveProjectNotes">Save local notes</button>
              </section>
            </article>
            <aside class="card side-card">
              <div class="kicker">EVIDENCE</div>
              <h3>Artifact + tests + explanation</h3>
              <p style="color:var(--muted);font-size:12px;line-height:1.6">A finished project should be reproducible by another engineer and honest about limitations.</p>
              <button class="action secondary" id="backToProjects">Back to Projects</button>
            </aside>
          </div>
        `
      );
      const key = "als-project-" + project.id;
      const notes = $("#projectNotes");
      if (notes) notes.value = localStorage.getItem(key) || "";
      $("#saveProjectNotes")?.addEventListener("click", () => {
        localStorage.setItem(key, notes?.value || "");
        toast("Project notes saved");
      });
      $("#backToProjects")?.addEventListener("click", projects);
    });
  });
}

function route(view) {
  state.view = view;

  const routes = {
    home,
    learn,
    labs,
    tools: aiTools,
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

  const nav = $(".sidebar nav");
  if (!nav || !activeButton) return;

  nav.style.setProperty("--liquid-x", activeButton.offsetLeft + "px");
  nav.style.setProperty("--liquid-y", activeButton.offsetTop + "px");
  nav.style.setProperty("--liquid-w", activeButton.offsetWidth + "px");
  nav.style.setProperty("--liquid-h", activeButton.offsetHeight + "px");
}

function syncActiveNavigation(view) {
  const activeButton = $$(".nav-item").find(
    (button) => button.dataset.view === view
  );
  updateActiveNavigation(activeButton);
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

function renderBootFailure(error) {
  const main = $("#main");
  if (!main) return;
  const message = error instanceof Error ? error.message : String(error);
  main.innerHTML = `
    <section class="card" style="max-width:760px;margin:40px auto;padding:28px">
      <div class="kicker">STARTUP DIAGNOSTIC</div>
      <h1 style="margin:8px 0">Learning workspace could not start</h1>
      <p style="color:var(--muted);line-height:1.6">The page loaded, but one runtime component failed during startup. Refresh once; if the problem persists, the diagnostic below identifies the failing path.</p>
      <pre class="code" style="white-space:pre-wrap">${escapeHtml(message)}</pre>
      <button class="action" id="retryBoot">Retry workspace</button>
    </section>
  `;
  $("#retryBoot")?.addEventListener("click", () => window.location.reload());
}

function initialize() {
  try {
    bindGlobalEvents();
    home();
    requestAnimationFrame(() => syncActiveNavigation(state.view));
    window.addEventListener("resize", () => syncActiveNavigation(state.view));
    document.documentElement.dataset.appReady = "true";
  } catch (error) {
    console.error("AI Learning Studio startup failure", error);
    renderBootFailure(error);
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initialize, { once: true });
} else {
  initialize();
}
