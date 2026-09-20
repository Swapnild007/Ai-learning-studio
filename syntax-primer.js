(() => {
  const lessons = [
    {
      id: "S01",
      title: "Variables, Types & Expressions",
      purpose: "Learn the minimum Python syntax needed to turn a mathematical statement into an executable calculation.",
      concept: "A variable is a named reference to a value. In mathematics you write x = 3; in Python you write x = 3. Expressions combine values with operators and produce new values.",
      syntax: [
        "Assignment: x = 3",
        "Arithmetic: total = a + b * 2",
        "Comparison: error < tolerance",
        "Boolean logic: valid and finite",
        "Type inspection: type(x)"
      ],
      example: `x = 3
w = 2.5
score = x * w
print(score)`,
      practice: [
        "Create variables for three features and calculate a weighted score.",
        "Change one input and predict the output before running the code.",
        "Inspect the types of an integer, float, string and boolean.",
        "Write a condition that checks whether an error is below a tolerance."
      ],
      warning: "Do not treat assignment as an algebraic equality. Python's x = x + 1 is an update, not a mathematical identity.",
      bridge: "This is enough syntax to start implementing scalar equations from Module 01."
    },
    {
      id: "S02",
      title: "Lists, Arrays & Indexing",
      purpose: "Move from one number to collections of numbers, then connect indexing to vector and matrix notation.",
      concept: "Python lists are general containers. NumPy arrays are numerical objects designed for vectorized computation. Indexing selects a specific element or slice.",
      syntax: [
        "List: values = [2, 4, 6]",
        "Index: values[0]",
        "Slice: values[1:3]",
        "NumPy array: np.array(values)",
        "Shape: x.shape"
      ],
      example: `import numpy as np

x = np.array([2.0, 4.0, 6.0])
print(x[0])
print(x.shape)`,
      practice: [
        "Predict the first and last valid index of a vector.",
        "Create a 3x2 matrix and state its shape before running it.",
        "Extract one row and one column and explain their shapes.",
        "Trigger an index error deliberately and explain why it occurs."
      ],
      warning: "A list's nesting structure is not automatically the same thing as a mathematically valid matrix. Inspect shape and dimensions explicitly.",
      bridge: "This directly supports vectors, matrices, dot products and shape contracts."
    },
    {
      id: "S03",
      title: "if, for & while",
      purpose: "Control execution so mathematical procedures can be expressed as repeated or conditional operations.",
      concept: "Conditionals choose a path. Loops repeat a procedure. Many first-principles implementations in Module 01 are simply mathematical definitions translated into these control structures.",
      syntax: [
        "if condition:",
        "for item in items:",
        "for i in range(n):",
        "while condition:",
        "break / continue"
      ],
      example: `total = 0
for value in [2, 4, 6]:
    total += value

if total > 10:
    print("above threshold")`,
      practice: [
        "Compute a vector sum with a for loop.",
        "Count how many values exceed a threshold.",
        "Write a loop that stops when an error is below tolerance.",
        "Explain the loop invariant in plain language."
      ],
      warning: "Loops are not just syntax drills. Always state what remains true after each iteration.",
      bridge: "These constructs let you implement sums, searches, statistics and iterative optimization from definitions."
    },
    {
      id: "S04",
      title: "Functions & Parameters",
      purpose: "Turn repeated mathematical operations into small, testable units with explicit inputs and outputs.",
      concept: "A function gives a name to a transformation. This mirrors mathematics closely: f(x) maps an input to an output, while parameters make the transformation reusable.",
      syntax: [
        "def dot(x, w):",
        "return result",
        "default parameters",
        "keyword arguments",
        "small single-purpose functions"
      ],
      example: `def weighted_score(x, w):
    result = 0.0
    for i in range(len(x)):
        result += x[i] * w[i]
    return result

print(weighted_score([2, 3], [0.5, 2]))`,
      practice: [
        "Write a function for mean(values).",
        "Add a shape or length validation check.",
        "Call the function with two different inputs.",
        "Write one test that should pass and one that should fail."
      ],
      warning: "Keep first-principles functions small. A short function is easier to compare with the mathematical definition and debug.",
      bridge: "Functions become the basic unit for dot products, gradients, metrics and data-processing stages."
    },
    {
      id: "S05",
      title: "Dictionaries, Sets & Data Structures",
      purpose: "Use the right basic container for metadata, lookup tables, unique values and algorithmic work.",
      concept: "Lists preserve order, dictionaries map keys to values, and sets represent unique membership. Choosing the container is part of algorithm design.",
      syntax: [
        "Dictionary: counts = {'cat': 3}",
        "Lookup: counts['cat']",
        "Set: seen = set()",
        "Membership: item in seen",
        "Safe lookup: counts.get(key, 0)"
      ],
      example: `counts = {}
for label in ["A", "B", "A"]:
    counts[label] = counts.get(label, 0) + 1

unique = set(counts)
print(counts)
print(unique)`,
      practice: [
        "Build a frequency table from a small dataset.",
        "Use a set to detect duplicate identifiers.",
        "Explain why repeated linear scans can become expensive.",
        "Choose a list, dictionary or set for three ML data tasks and justify each choice."
      ],
      warning: "Do not choose a data structure because it is familiar. State the access pattern and expected complexity first.",
      bridge: "This is the syntax foundation for the Algorithms & Data Structures unit and later ML data pipelines."
    },
    {
      id: "S06",
      title: "Modules, Errors, Testing & Debugging",
      purpose: "Make small numerical programs reproducible, diagnosable and safe to change.",
      concept: "Real engineering requires more than code that runs. Modules separate concerns, exceptions make failures explicit, and tests turn assumptions into executable checks.",
      syntax: [
        "import module",
        "try / except",
        "raise ValueError(...)",
        "assert condition",
        "test functions with expected outputs"
      ],
      example: `def mean(values):
    if not values:
        raise ValueError("values must not be empty")
    return sum(values) / len(values)

assert mean([2, 4, 6]) == 4
`,
      practice: [
        "Add an explicit error for an invalid input.",
        "Write a regression test for a bug you intentionally introduce.",
        "Separate a calculation into a reusable module.",
        "Record the symptom, hypothesis, test and root cause for one failure."
      ],
      warning: "Catching every exception and continuing is not robust debugging. Preserve the failure signal and diagnose the actual cause.",
      bridge: "This connects syntax directly to the Engineering stage of Module 01."
    }
  ];

  const styles = `
    .syntax-bridge{margin:0 0 16px;padding:20px;border:1px solid var(--line,#dfe5ef);border-radius:20px;background:linear-gradient(135deg,rgba(255,255,255,.88),rgba(242,247,255,.82));box-shadow:0 12px 35px rgba(34,54,90,.08)}
    .syntax-bridge-head{display:flex;align-items:flex-start;justify-content:space-between;gap:16px;margin-bottom:14px}
    .syntax-bridge-kicker{font-size:11px;font-weight:800;letter-spacing:.12em;text-transform:uppercase;color:var(--accent,#1769ff)}
    .syntax-bridge h3{margin:5px 0 6px;font-size:19px}
    .syntax-bridge p{margin:0;color:var(--muted,#64748b);font-size:13px;line-height:1.55}
    .syntax-bridge-badge{padding:7px 10px;border-radius:999px;background:rgba(23,105,255,.08);color:var(--accent,#1769ff);font-size:11px;font-weight:700;white-space:nowrap}
    .syntax-bridge-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px}
    .syntax-topic{border:1px solid var(--line,#dfe5ef);background:rgba(255,255,255,.72);border-radius:15px;padding:13px;text-align:left;cursor:pointer;transition:transform .18s ease,box-shadow .18s ease,border-color .18s ease}
    .syntax-topic:hover{transform:translateY(-2px);box-shadow:0 8px 22px rgba(34,54,90,.08);border-color:rgba(23,105,255,.28)}
    .syntax-topic strong{display:block;font-size:13px;margin-bottom:4px;color:var(--text,#172033)}
    .syntax-topic span{display:block;font-size:11px;line-height:1.45;color:var(--muted,#64748b)}
    .syntax-modal-backdrop{position:fixed;inset:0;background:rgba(20,31,52,.22);backdrop-filter:blur(8px);z-index:80;display:none}
    .syntax-modal-backdrop.open{display:block}
    .syntax-modal{position:fixed;z-index:81;left:50%;top:50%;transform:translate(-50%,-50%);width:min(760px,calc(100vw - 28px));max-height:min(86vh,820px);overflow:auto;background:rgba(255,255,255,.97);border:1px solid var(--line,#dfe5ef);border-radius:24px;box-shadow:0 30px 80px rgba(20,35,65,.2);padding:24px}
    .syntax-modal-head{display:flex;justify-content:space-between;gap:16px;align-items:flex-start}
    .syntax-modal h2{margin:4px 0 7px;font-size:23px}
    .syntax-modal .close{border:0;background:#f2f5fa;border-radius:12px;width:38px;height:38px;font-size:20px;cursor:pointer}
    .syntax-section{margin-top:20px}
    .syntax-section h4{margin:0 0 8px;font-size:13px}
    .syntax-section p,.syntax-section li{font-size:13px;line-height:1.65;color:var(--muted,#64748b)}
    .syntax-section ul{margin:0;padding-left:19px}
    .syntax-code{margin:10px 0 0;padding:14px;border-radius:14px;background:#f5f7fb;border:1px solid #e5eaf2;overflow:auto;font:12px/1.6 ui-monospace,SFMono-Regular,Menlo,monospace;color:#1d2939;white-space:pre}
    @media (max-width:760px){.syntax-bridge-head{flex-direction:column}.syntax-bridge-grid{grid-template-columns:1fr 1fr}.syntax-modal{padding:18px;border-radius:20px}}
    @media (max-width:430px){.syntax-bridge-grid{grid-template-columns:1fr}.syntax-bridge{padding:16px}.syntax-modal{width:calc(100vw - 18px);max-height:90vh}}
    @media (prefers-reduced-motion:reduce){.syntax-topic{transition:none}}
  `;

  function installStyles(){
    if(document.getElementById("syntaxPrimerStyles")) return;
    const style=document.createElement("style");
    style.id="syntaxPrimerStyles";
    style.textContent=styles;
    document.head.appendChild(style);
  }

  function escape(value){
    return String(value ?? "").replace(/[&<>"]/g, c => ({ "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;" }[c]));
  }

  function openTopic(index){
    const item=lessons[index];
    if(!item) return;
    let backdrop=document.getElementById("syntaxModalBackdrop");
    if(!backdrop){
      backdrop=document.createElement("div");
      backdrop.id="syntaxModalBackdrop";
      backdrop.className="syntax-modal-backdrop";
      document.body.appendChild(backdrop);
    }
    backdrop.innerHTML=`
      <article class="syntax-modal" role="dialog" aria-modal="true" aria-labelledby="syntaxTitle">
        <div class="syntax-modal-head">
          <div>
            <div class="syntax-bridge-kicker">Programming Syntax Bridge · ${escape(item.id)}</div>
            <h2 id="syntaxTitle">${escape(item.title)}</h2>
            <p>${escape(item.purpose)}</p>
          </div>
          <button class="close" id="syntaxClose" aria-label="Close syntax lesson">×</button>
        </div>
        <div class="syntax-section"><h4>Core idea</h4><p>${escape(item.concept)}</p></div>
        <div class="syntax-section"><h4>Syntax to know</h4><ul>${item.syntax.map(x=>`<li>${escape(x)}</li>`).join("")}</ul></div>
        <div class="syntax-section"><h4>Worked example</h4><pre class="syntax-code">${escape(item.example)}</pre></div>
        <div class="syntax-section"><h4>Practice</h4><ul>${item.practice.map(x=>`<li>${escape(x)}</li>`).join("")}</ul></div>
        <div class="syntax-section"><h4>Beginner warning</h4><p>${escape(item.warning)}</p></div>
        <div class="syntax-section"><h4>Module 01 connection</h4><p>${escape(item.bridge)}</p></div>
      </article>`;
    backdrop.classList.add("open");
    const close=()=>backdrop.classList.remove("open");
    backdrop.querySelector("#syntaxClose")?.addEventListener("click",close,{once:true});
    backdrop.addEventListener("click",event=>{if(event.target===backdrop) close();},{once:true});
  }

  function renderBridge(){
    const main=document.getElementById("main");
    if(!main) return;
    const lessonList=main.querySelector(".lesson-list");
    if(!lessonList || main.querySelector("#syntaxBridge")) return;
    const head=main.querySelector(".section-head");
    const moduleOneTitle=main.textContent.includes("Mathematics & Computational Foundations");
    if(!moduleOneTitle) return;

    const bridge=document.createElement("section");
    bridge.id="syntaxBridge";
    bridge.className="syntax-bridge";
    bridge.innerHTML=`
      <div class="syntax-bridge-head">
        <div>
          <div class="syntax-bridge-kicker">Module 01 · Foundation Bridge</div>
          <h3>Programming Syntax Primer</h3>
          <p>Six short syntax lessons are embedded here so you can turn the mathematics into executable work without turning Module 01 into a generic Python course.</p>
        </div>
        <div class="syntax-bridge-badge">6 focused lessons</div>
      </div>
      <div class="syntax-bridge-grid">
        ${lessons.map((item,index)=>`<button class="syntax-topic" data-syntax-topic="${index}"><strong>${escape(item.title)}</strong><span>${escape(item.purpose)}</span></button>`).join("")}
      </div>`;
    if(head) head.insertAdjacentElement("afterend",bridge);
    else lessonList.insertAdjacentElement("beforebegin",bridge);

    bridge.querySelectorAll("[data-syntax-topic]").forEach(button=>{
      button.addEventListener("click",()=>openTopic(Number(button.dataset.syntaxTopic)));
    });
  }

  function boot(){
    installStyles();
    renderBridge();
    const main=document.getElementById("main");
    if(!main) return;
    const observer=new MutationObserver(()=>renderBridge());
    observer.observe(main,{childList:true,subtree:true});
    window.addEventListener("keydown",event=>{
      if(event.key==="Escape") document.getElementById("syntaxModalBackdrop")?.classList.remove("open");
    });
  }

  if(document.readyState==="loading") document.addEventListener("DOMContentLoaded",boot,{once:true});
  else boot();
})();