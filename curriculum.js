const CURRICULUM={meta:{title:"AI Learning Studio",targetLessons:520,targetProjects:12},modules:[
{id:"m1",number:1,title:"Mathematics & Computational Foundations",desc:"Operational mathematics, numerical computing and core programming for machine learning.",tags:["Math","Python","Algorithms","Numerics"],units:[["Linear Algebra","Vectors, matrices, linear maps, eigenstructure, decompositions"],["Probability & Statistics","Random variables, distributions, estimation, uncertainty and testing"],["Calculus & Optimization","Derivatives, gradients, Jacobians, optimization and training dynamics"],["Algorithms & Data Structures","Complexity, recursion, graphs, hashing and ML-oriented implementation"],["Systems Foundations","Linux, memory, processes, concurrency, networking and numerical behavior"]]},
{id:"m2",number:2,title:"Classical ML & Statistical Inference",desc:"Build the statistical intuition and implementation discipline behind reliable ML.",tags:["ML","Statistics","Evaluation","NumPy"],units:[["Regression & Classification","Linear models, logistic regression, regularization and calibration"],["Trees & Ensembles","Decision trees, random forests, boosting and feature behavior"],["Unsupervised Learning","Clustering, mixture models, EM and dimensionality reduction"],["Evaluation & Validation","Splits, leakage, metrics, uncertainty, A/B testing and error analysis"],["ML Engineering Patterns","Baselines, reproducibility, data pipelines and model diagnostics"]]},
{id:"m3",number:3,title:"Deep Learning",desc:"From backpropagation to modern training systems and representation learning.",tags:["PyTorch","Backprop","Vision","Training"],units:[["Neural Network Foundations","MLPs, activations, losses, backpropagation and initialization"],["Convolutional Learning","CNNs, receptive fields, normalization and visual representation"],["Sequence Models","RNN/LSTM concepts, limitations and the transition to attention"],["Transformer Foundations","Attention, positional information, residuals, normalization and scaling"],["Training Dynamics","Optimization, regularization, mixed precision, instability and debugging"]]},
{id:"m4",number:4,title:"Advanced AI Systems",desc:"Retrieval, reinforcement learning, reasoning and distributed computation.",tags:["RL","RAG","Distributed","Reasoning"],units:[["Information Retrieval","Embeddings, vector search, ranking and retrieval evaluation"],["Reinforcement Learning","MDPs, value methods, policy gradients and deep RL"],["Reasoning Systems","Search, verifiers, self-consistency and reasoning evaluation"],["Distributed ML","Data/tensor/pipeline parallelism and multi-device training"],["Multimodal AI","Vision-language representations and multimodal architectures"]]},
{id:"m5",number:5,title:"Generative & Agentic AI",desc:"Modern language-model workflows from tokenization through agents and safety testing.",tags:["LLMs","Agents","Post-training","Evals"],units:[["LLM Architecture","Tokenization, transformers, KV cache, context and model behavior"],["Pretraining & Adaptation","Data preparation, pretraining concepts, SFT, PEFT and LoRA"],["Post-training","Preference data, DPO, RLHF/RLAIF and reward modeling"],["RAG & Tool Use","Retrieval pipelines, tools, memory, orchestration and failure modes"],["Agent Evaluation & Safety","Agent evals, prompt injection, tool misuse, sandboxing and red-teaming"]]},
{id:"m6",number:6,title:"Production AI & MLOps",desc:"Ship, observe, optimize and operate ML systems under real constraints.",tags:["CUDA","Inference","MLOps","Production"],units:[["GPU & Inference Systems","CUDA concepts, kernels, quantization, batching and serving"],["Cloud & MLOps","Containers, CI/CD, model registries, monitoring and reproducibility"],["Performance Engineering","Profiling, memory, throughput, latency and bottleneck analysis"],["Research Engineering","Experiment design, ablations, negative results and technical writing"],["Portfolio & Interview Engineering","System design, debugging, coding and evidence-based demonstration"]]}
]};

const MODULE_01_DETAIL = {
  "Linear Algebra": {
    focus: "vectors, matrices, linear maps, projections, eigenstructure and decompositions",
    math: "Track dimensions explicitly and derive matrix operations from indexed scalar sums.",
    implementation: "Implement dot product, matrix-vector multiplication, transpose and a small linear-regression forward pass from scratch.",
    experiment: "Test shape edge cases, numerical tolerance and conditioning with controlled synthetic matrices.",
    failure: "Shape mismatches, incorrect transposes, elementwise-vs-matrix multiplication and numerical instability.",
    evidence: "Predict output shapes, derive one matrix operation unaided, pass randomized reference comparisons, and explain a numerical failure."
  },
  "Probability & Statistics": {
    focus: "random variables, expectation, variance, conditional probability, estimation and uncertainty",
    math: "Derive expectation, variance, sampling error and confidence intervals from definitions before using library functions.",
    implementation: "Implement empirical statistics and a small uncertainty-aware evaluation harness.",
    experiment: "Repeat controlled samples across seeds and compare empirical behavior with theoretical expectations.",
    failure: "Confusing conditional probabilities, leaking information across evaluation splits, cherry-picking runs and over-interpreting point estimates.",
    evidence: "Explain uncertainty, preserve raw runs, report variability and identify an invalid evaluation protocol."
  },
  "Calculus & Optimization": {
    focus: "derivatives, gradients, Jacobians, gradient descent, curvature and training dynamics",
    math: "Derive scalar and vector gradients and connect them directly to parameter-update rules.",
    implementation: "Implement finite differences, analytical gradients and gradient descent for a small regression problem.",
    experiment: "Map learning-rate stability, feature scaling and gradient error under controlled conditions.",
    failure: "Wrong signs, missing factors, unstable learning rates, poor scaling and unverified gradients.",
    evidence: "Pass gradient checks, diagnose training curves and justify an optimization choice from measurements."
  },
  "Algorithms & Data Structures": {
    focus: "complexity, arrays, hashing, search, heaps, graphs and ML-oriented data structures",
    math: "Derive time and memory complexity from explicit input dimensions and loop invariants.",
    implementation: "Implement binary search, frequency indexing and bounded top-k retrieval without relying on the target algorithm.",
    experiment: "Benchmark scaling across workload sizes and compare exact versus optimized implementations.",
    failure: "Broken invariants, accidental quadratic behavior, unrealistic benchmarks and optimizing non-critical code.",
    evidence: "Provide correctness tests, complexity analysis, profiling evidence and an end-to-end benchmark."
  },
  "Systems Foundations": {
    focus: "processes, memory, concurrency, I/O, networking, batching and resource constraints",
    math: "Estimate memory, throughput, latency and resource ceilings before running a workload.",
    implementation: "Build a bounded producer-consumer pipeline with instrumentation for stage time and queue depth.",
    experiment: "Measure batching and concurrency trade-offs across throughput, p95 latency and memory.",
    failure: "OOM, backpressure, deadlock, hidden serialization, I/O bottlenecks and optimizing the wrong resource.",
    evidence: "Produce a root-cause report backed by telemetry and a reproducible systems benchmark."
  }
};

const STAGE_DETAIL = {
  Foundation: {
    type: "concept",
    verb: "Explain the core model and connect its notation to an observable ML or systems behavior.",
    deliverable: "A short explanation plus a minimal working example."
  },
  Derivation: {
    type: "derivation",
    verb: "Derive the central relationship from first principles and map every symbol to code.",
    deliverable: "An unaided derivation and a computational verification."
  },
  Implementation: {
    type: "coding-task",
    verb: "Implement the smallest correct version and compare it against a trusted reference.",
    deliverable: "Working code, tests, reference comparison and a short correctness note."
  },
  Engineering: {
    type: "debug-task",
    verb: "Diagnose a realistic failure using invariants, measurements and a root-cause hypothesis.",
    deliverable: "A debugging log containing symptom, hypothesis, test, root cause and fix."
  },
  Experiment: {
    type: "experiment",
    verb: "Change one controlled variable, measure the effect and preserve the complete result set.",
    deliverable: "A reproducible benchmark with baseline, measurements, failures and interpretation."
  },
  Research: {
    type: "research-task",
    verb: "Frame a falsifiable question, run a controlled study and report limitations or negative results honestly.",
    deliverable: "A research note containing hypothesis, protocol, evidence, limitations and next question."
  }
};

function buildLessons(){
  const stages=["Foundation","Derivation","Implementation","Engineering","Experiment","Research"];
  const lessons=[], base=[];
  const authoredLessons = {
    L001: {
      lessonBody: "If you are completely new to Linear Algebra, start with one simple idea: machine learning works with numbers, and Linear Algebra gives us a clean way to organize and transform those numbers. A single person, image, sentence or transaction can be represented as numbers. A vector is one ordered list of those numbers. A matrix is a collection of such numbers arranged in rows and columns. When you understand what the numbers represent and how their shapes fit together, many ML equations stop looking mysterious.",
      whyItMatters: "You will see vectors and matrices everywhere in AI: model weights, datasets, embeddings, images, neural-network layers and gradients. You do not need to memorize advanced mathematics first. Your first goal is to become comfortable reading the objects, their shapes and the operation being performed.",
      mentalModel: [
        "Scalar = one number, such as 5.",
        "Vector = an ordered list of numbers, such as [2, 3, 4]. Think of it as one row of measurements or one point described by several features.",
        "Matrix = numbers arranged in rows and columns. Think of a spreadsheet: rows can represent examples and columns can represent features.",
        "Shape = the size of the object. A vector [2,3,4] has 3 values. A matrix with 3 rows and 2 columns has shape (3,2).",
        "Operation = an instruction that transforms numbers. Matrix multiplication is a structured operation, not simply multiplying every number by another number."
      ],
      vocabulary: [
        "Scalar: a single number.",
        "Vector: an ordered one-dimensional collection of numbers.",
        "Dimension: how many values are inside a vector.",
        "Matrix: a rectangular grid of numbers.",
        "Row: numbers running horizontally across a matrix.",
        "Column: numbers running vertically down a matrix.",
        "Transpose: swap rows and columns.",
        "Dot product: multiply corresponding vector values and add the results."
      ],
      workedExample: {
        title: "Worked example: understanding a vector",
        text: "Imagine a student is described by three measurements: study hours = 2, practice tests = 3, and projects completed = 4. We can represent that student as x = [2, 3, 4]. The vector is not just three random numbers. Each position has a meaning. This idea is critical in ML because changing the order of features changes what the model receives.",
        steps: [
          "Position 1 represents study hours.",
          "Position 2 represents practice tests.",
          "Position 3 represents projects completed.",
          "The vector therefore has dimension 3 and shape (3,).",
          "If another vector stores weights for these three features, it must also contain three compatible values."
        ]
      },
      secondExample: {
        title: "Worked example: the dot product",
        text: "Suppose x = [2, 3] and weights w = [0.5, 2]. Multiply matching positions: 2×0.5 = 1 and 3×2 = 6. Then add them: 1 + 6 = 7. The dot product is therefore 7. In a simple linear model, this calculation is one of the building blocks used to produce a prediction.",
        steps: [
          "Match the first feature with the first weight.",
          "Match the second feature with the second weight.",
          "Multiply each matching pair.",
          "Add the products.",
          "Check that both vectors have the same dimension before calculating."
        ]
      },
      practice: [
        "Write a vector representing a person with age, height and weekly study hours. Give each position a clear meaning.",
        "For x=[1,2,4] and w=[3,-1,0.5], calculate the dot product by hand.",
        "For a matrix with 3 rows and 4 columns, write its shape as (3,4).",
        "For A with shape (3,4) and x with shape (4,), predict the shape of Ax before calculating it.",
        "Explain in your own words why a vector with 3 values cannot be directly used where 4 values are required."
      ],
      beginnerWarnings: [
        "Do not try to memorize every formula on the first reading. First understand what each object represents.",
        "Do not confuse the number of rows with the number of columns.",
        "Do not assume every multiplication symbol means matrix multiplication.",
        "Always ask: What does this number represent? What is its shape? What operation are we performing?",
        "When code gives a shape error, return to the mathematics instead of changing dimensions randomly until the error disappears."
      ],
      lab: {
        title: "Beginner lab: build your first matrix-vector multiplication",
        objective: "Turn the mathematical idea into a tiny Python implementation without hiding the important steps behind a library.",
        steps: [
          "Create a 2×3 matrix A and a length-3 vector x.",
          "Take the first row of A and calculate its dot product with x.",
          "Repeat the same process for the second row.",
          "Store the two results in a new vector.",
          "Compare your result with NumPy.",
          "Change x to a length-2 vector and observe the failure. Explain why the operation is mathematically invalid."
        ],
        success: "You can explain the calculation without looking at the code, the implementation agrees with a reference implementation, and you can explain the shape error rather than simply fixing it by trial and error."
      },
      misconceptions: [
        "A vector is not merely a bag of numbers. Position and meaning matter.",
        "A matrix is not automatically a dataset. It can also represent a transformation or parameters.",
        "Matrix multiplication and elementwise multiplication answer different mathematical questions.",
        "A program running without an error does not prove that the mathematical operation is correct.",
        "Advanced notation becomes easier after the underlying objects are familiar."
      ],
      takeaway: "Your first Linear Algebra skill is not calculation speed. It is the habit of identifying the object, its meaning, its shape and the operation being performed. That habit will later help you understand regression, neural networks, embeddings, attention and gradient calculations.",
      lessonBodyExtra: "When you reach a formula such as y = Wx + b later in the course, do not treat it as a new language. Read it as a sequence of familiar objects: W is a matrix, x is a vector, Wx is a matrix-vector operation, b is another vector, and y is the resulting output. The goal of this lesson is to make that reading feel natural."
    }
  };

  let n=1;
  for(const module of CURRICULUM.modules){
    for(const [unit,scope] of module.units){
      for(const stage of stages){
        const profile=module.id==="m1" ? MODULE_01_DETAIL[unit] : null;
        const stageInfo=STAGE_DETAIL[stage];
        const lesson={
          id:"L"+String(n).padStart(3,"0"),
          module:module.id,
          moduleTitle:module.title,
          unit,
          stage,
          title:stage+" · "+unit,
          scope,
          order:n,
          type:stageInfo.type,
          minutes:stage==="Foundation"?35:stage==="Derivation"?45:stage==="Implementation"?55:stage==="Engineering"?60:stage==="Experiment"?70:80,
          objective:profile ? stageInfo.verb+" Focus: "+profile.focus+"." : "Build an operational understanding of "+unit+" and connect it to "+scope+".",
          prerequisite:stage==="Foundation" ? "Programming fundamentals" : stages[stages.indexOf(stage)-1]+" mastery in this unit",
          math:profile ? profile.math : "Derive the core mathematical objects and assumptions.",
          mechanism:profile ? "Connect "+profile.focus+" to a concrete computation, invariant or measurable system behavior." : "Trace the concept from assumption → mechanism → implementation → observable result.",
          implementation:profile ? profile.implementation : "Implement the smallest correct version, then compare it with a trusted baseline.",
          experiment:profile ? profile.experiment : "Change one controlled variable, measure the effect, and record the result.",
          failure:profile ? profile.failure : "Investigate incorrect assumptions, numerical errors, leakage, instability or performance regressions.",
          evidence:profile ? profile.evidence : "Explain the concept, produce a working implementation and document the evidence.",
          deliverable:profile ? stageInfo.deliverable : "A reproducible learning artifact with code, measurements and a written explanation.",
          code:profile ? "# "+stage+": "+unit+"\n# Build the smallest reproducible version.\nresult = run_experiment(seed=42)\nprint(result)" : "# Build the smallest reproducible experiment.\nresult = run_experiment(seed=42)\nprint(result)",
          ...authoredLessons["L"+String(n).padStart(3,"0")],
          checkpoint:[
            "What assumption or invariant is this lesson testing?",
            "What observation would falsify your current explanation?",
            "What evidence would convince another engineer that the result is correct?"
          ]
        };
        lessons.push(lesson); base.push(lesson); n++;
      }
    }
  }
  let i=0;
  while(lessons.length<CURRICULUM.meta.targetLessons){
    const source=base[i%base.length], k=lessons.length+1;
    lessons.push({...source,id:"L"+String(k).padStart(3,"0"),order:k,title:source.title+" · Practice "+(Math.floor(i/base.length)+1),evidence:"Transfer the same concept to a new dataset, constraint or failure mode.",deliverable:"A transfer artifact with evidence showing what changed and what remained invariant."});
    i++;
  }
  return lessons;
}

const LESSONS=buildLessons();