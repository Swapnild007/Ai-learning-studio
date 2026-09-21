/* Beginner Mathematics Bridge
   Non-counted support layer for ALL 520 lessons.
   It teaches notation from plain language before formal manipulation.
*/
(() => {
  const UNIT_GUIDES = {
    "Linear Algebra":["numbers in rows/columns","vectors as lists of numbers","matrix multiplication as repeated dot products","dimensions must agree before multiplication"],
    "Probability & Statistics":["probability as a number from 0 to 1","mean as an average","variance as squared distance from the mean","samples are observations, not the whole population"],
    "Calculus & Optimization":["a function maps input to output","a derivative measures local change","a gradient contains many partial derivatives","optimization repeatedly changes parameters to reduce an objective"],
    "Algorithms & Data Structures":["an algorithm is a repeatable procedure","input size controls computational cost","data structures organize information for operations","complexity describes how cost grows"],
    "Systems Foundations":["memory is finite storage","latency is time per operation","throughput is work per unit time","concurrency means multiple activities can make progress"],
    "Regression & Classification":["features are inputs","the target is what we predict","a model is a rule with parameters","loss measures prediction error"],
    "Trees & Ensembles":["a split divides examples","impurity measures how mixed a node is","depth controls tree complexity","ensembles combine multiple learners"],
    "Unsupervised Learning":["there is no target label to supervise the model","distance measures similarity","a cluster is a group under a chosen rule","dimensionality reduction creates a smaller representation"],
    "Evaluation & Validation":["training data is used to fit","validation data supports model choices","test data is reserved for final assessment","a metric is a measurement, not a conclusion by itself"],
    "ML Engineering Patterns":["a baseline is a reference point","reproducibility means the same protocol can be rerun","a pipeline is a sequence of transformations","diagnostics turn failures into measurable evidence"],
    "Neural Network Foundations":["a parameter is a learned number","a tensor is a structured collection of numbers","the forward pass computes a prediction","backpropagation computes derivatives of the loss"],
    "Convolutional Learning":["a kernel is a small grid of learned numbers","channels are feature planes","stride controls how far a kernel moves","the receptive field is the input region that can affect a unit"],
    "Sequence Models":["a sequence is ordered data","t is a position in the sequence","hidden state carries information between steps","recurrence reuses the same transition rule"],
    "Transformer Foundations":["a matrix is a rectangular table of numbers","Q, K and V are learned representations","a transpose swaps rows and columns","softmax turns scores into weights that sum to 1"],
    "Training Dynamics":["loss measures error","a gradient describes how loss changes","learning rate controls update size","regularization changes the training objective or effective capacity"],
    "Information Retrieval":["an embedding is a vector representation","similarity compares representations","ranking orders candidates","retrieval quality needs an evaluation metric"],
    "Reinforcement Learning":["an agent takes actions","a state describes the situation","a reward is feedback from the environment","a policy maps states to actions"],
    "Reasoning Systems":["a search tree contains candidate reasoning paths","a verifier checks a proposed result","self-consistency compares multiple sampled solutions","evaluation requires a defined criterion"],
    "Distributed ML":["data parallelism splits examples across workers","tensor parallelism splits computation","communication has a cost","scaling efficiency compares added compute with added throughput"],
    "Multimodal AI":["a modality is a type of information","an encoder creates a representation","alignment connects representations across modalities","fusion combines information"],
    "LLM Architecture":["tokens are discrete pieces of text","embeddings map tokens to vectors","attention mixes information between positions","KV cache stores past key/value states for efficient decoding"],
    "Pretraining & Adaptation":["pretraining learns from a large corpus","fine-tuning changes model behavior using a task dataset","PEFT updates a smaller parameter set","LoRA represents an update with low-rank matrices"],
    "Post-training":["preference data expresses relative choices","a reward model estimates preference","DPO directly optimizes preference comparisons","RLHF uses reinforcement learning with learned feedback"],
    "RAG & Tool Use":["retrieval supplies external context","a tool is an external operation","memory stores selected information","orchestration controls the sequence of actions"],
    "Agent Evaluation & Safety":["an agent can choose actions","an evaluation defines success","prompt injection attempts to alter instructions","red-teaming searches for failures deliberately"],
    "GPU & Inference Systems":["a kernel is a unit of GPU computation","batching processes multiple requests together","quantization uses lower-precision numbers","latency is response time"],
    "Cloud & MLOps":["a container packages software and dependencies","CI runs automated checks","a model registry tracks model artifacts","monitoring observes production behavior"],
    "Performance Engineering":["profiling measures where time is spent","memory is a finite resource","throughput measures work per unit time","a bottleneck is a limiting stage"],
    "Research Engineering":["a hypothesis is a testable claim","an ablation removes one component","a negative result is still evidence","a technical note separates evidence from interpretation"],
    "Portfolio & Interview Engineering":["a system design states constraints and interfaces","debugging starts from observable symptoms","a coding solution needs correctness evidence","a portfolio artifact should show what was built and measured"]
  };

  const STAGE_GUIDES = {
    Foundation:"First understand the objects and the words. Do not memorize the equation yet.",
    Derivation:"Start with the simplest definition, substitute small numbers, then build the formal equation.",
    Implementation:"Translate each mathematical object into a variable or data structure before writing the algorithm.",
    Engineering:"Find the invariant that should remain true, measure the failure, then change one thing at a time.",
    Experiment:"Write the baseline, variable, metric and expected behavior before looking at the result.",
    Research:"State what would convince you that the idea is wrong. Then collect evidence without hiding negative results."
  };

  function esc(value) {
    if (typeof escapeHtml === "function") return escapeHtml(String(value));
    return String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  }

  function symbols(math) {
    if (!math) return [];
    const found = String(math).match(/[A-Za-z][A-Za-z0-9_]*(?:_[A-Za-z0-9]+)?|√[A-Za-z0-9_]+|∑|∂|∇|×|÷|≤|≥|→|∈|^\d+/g) || [];
    return [...new Set(found)].filter(x => x.length <= 14).slice(0, 10);
  }

  function render(lesson) {
    if (!lesson) return "";
    const unit = lesson.unit || "";
    const stage = lesson.stage || "Foundation";
    const guide = UNIT_GUIDES[unit] || [
      "read every symbol as a name before treating it as mathematics",
      "use small numbers first",
      "track what each input and output represents",
      "connect the calculation to the model behavior"
    ];
    const math = lesson.math || "This lesson does not require a separate mathematical expression yet.";
    const tokenList = symbols(math);

    return `<section class="math-bridge card">
      <div class="module-num">BEGINNER MATH COACH · ${esc(stage)}</div>
      <h3>Math before notation</h3>
      <p class="math-bridge-plain">You do not need to know this equation already. Start with the meaning, then rebuild the notation one piece at a time.</p>
      <div class="math-bridge-grid">
        <div>
          <strong>Start with these ideas</strong>
          <ol>${guide.map(x => `<li>${esc(x)}</li>`).join("")}</ol>
        </div>
        <div>
          <strong>How to approach this stage</strong>
          <p>${esc(STAGE_GUIDES[stage] || STAGE_GUIDES.Foundation)}</p>
          <p class="math-bridge-source"><strong>This lesson's mathematical focus:</strong> ${esc(math)}</p>
        </div>
      </div>
      ${tokenList.length ? `<details><summary>See the symbols before calculating</summary><div class="math-bridge-vocab">${tokenList.map(x => `<div><code>${esc(x)}</code><span>Pause here and identify what this symbol represents in this lesson before calculating with it.</span></div>`).join("")}</div></details>` : ""}
      <details><summary>Beginner rule</summary><p class="math-bridge-rule">If a formula feels too fast: <strong>name every symbol → use tiny numbers → calculate one operation at a time → explain what the result means.</strong></p></details>
    </section>`;
  }

  window.BeginnerMathBridge = { render, guides: UNIT_GUIDES };
})();