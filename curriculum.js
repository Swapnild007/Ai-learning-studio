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
  const M1_TEACHING = {
    "Linear Algebra": {
      why: "Linear Algebra gives AI a language for representing many numbers at once. Images, datasets, embeddings, model weights and gradients all become easier to reason about when you can identify the object, its shape and the operation being performed.",
      start: "Think of a spreadsheet. One number is a scalar, a list of related numbers is a vector, and a rectangular table is a matrix. Machine learning repeatedly transforms these objects. The goal is not to memorize symbols first; it is to understand what each object means and why an operation is valid.",
      vocabulary: ["Scalar = one number.", "Vector = an ordered list of numbers.", "Dimension = the number of values in a vector.", "Matrix = a rectangular grid of numbers.", "Shape = the size of an object, such as (3,4).", "Transpose = swap rows and columns.", "Dot product = multiply matching values and add them.", "Linear map = a transformation that respects addition and scalar multiplication."],
      mental: ["A vector can represent one example, one embedding or one parameter set.", "A matrix can represent many examples or a transformation.", "Shape is a mathematical contract, not just a programming detail.", "Matrix multiplication combines weighted sums and therefore appears naturally in linear models and neural-network layers.", "Eigenvectors describe directions that a transformation preserves up to scaling; decompositions expose useful structure in a matrix."],
      example: ["A student described by [study hours, practice tests, projects] becomes x=[2,3,4]. Each position has meaning.", "For x=[2,3] and w=[0.5,2], x·w=2(0.5)+3(2)=7. This is a simple weighted combination and a building block of prediction."],
      practice: ["Predict the shape before calculating.", "Compute a dot product by hand.", "Explain why incompatible dimensions make an operation invalid.", "Write a small test for a wrong shape.", "Explain the difference between elementwise and matrix multiplication."],
      warnings: ["Do not confuse rows and columns.", "Do not assume broadcasting proves the mathematics is correct.", "Do not memorize matrix notation without asking what every symbol represents.", "Use numerical tolerance for floating-point comparisons."],
      lab: "Build dot(), matvec() and transpose() from scratch, add shape checks, compare against NumPy and deliberately test invalid shapes.",
      misconceptions: ["A vector is not an unordered bag of values.", "A matrix is not necessarily a dataset.", "Matrix multiplication is not elementwise multiplication.", "A successful program execution does not prove mathematical correctness.", "Advanced notation becomes easier after the objects are familiar."],
      takeaway: "Before touching a formula, identify the object, its meaning, its shape and the operation. This habit becomes a debugging tool for regression, neural networks, attention and gradients.",
      stages: {
        Foundation: ["Identify scalars, vectors and matrices from examples.", "Predict shapes without calculating.", "Explain a dot product in plain language."],
        Derivation: ["Derive matrix-vector multiplication from indexed scalar sums.", "Connect Xw to repeated dot products.", "Explain why dimensions must align."],
        Implementation: ["Implement dot, matvec and transpose.", "Compare with NumPy using randomized tests.", "Use allclose and explicit shape assertions."],
        Engineering: ["Debug transpose, shape and broadcasting errors.", "Instrument intermediate shapes.", "Write a root-cause report instead of patching the final exception."],
        Experiment: ["Study conditioning and numerical tolerance.", "Vary matrix correlation or scale.", "Record error, condition number and interpretation."],
        Research: ["Test a falsifiable hypothesis about scaling or conditioning.", "Use multiple seeds and controlled variables.", "Report limitations and negative results."]
      }
    },
    "Probability & Statistics": {
      why: "Probability and statistics teach you how AI handles uncertainty. A model does not live in a world of perfect measurements: data is sampled, labels can be noisy, and evaluation results vary from run to run.",
      start: "Start with a simple distinction: probability describes uncertainty before or within a model of a process; statistics uses observed data to learn about that process. You will repeatedly move between theoretical quantities and measurements from samples.",
      vocabulary: ["Random variable = a numerical quantity whose value depends on chance.", "Distribution = a description of how probability is assigned to possible values.", "Expectation = probability-weighted average.", "Variance = average squared deviation from the mean.", "Sample = observed data used to estimate a population property.", "Estimator = a rule that turns data into an estimate.", "Confidence interval = an interval procedure with stated long-run coverage properties.", "Conditional probability = probability after restricting attention to another event."],
      mental: ["A sample is not the population.", "Repeated experiments reveal sampling variability.", "A point estimate without uncertainty can be misleading.", "Conditioning changes the reference population.", "Evaluation methodology determines what statistical question your metric actually answers."],
      example: ["A coin with probability p=0.3 of heads has expected outcome 0.3 if heads=1 and tails=0.", "If ten observations have a sample mean of 7, that does not mean every future sample will have mean 7. Repeated samples reveal the distribution of the estimator."],
      practice: ["Compute a Bernoulli mean and variance.", "Explain P(A|B) in plain language.", "Simulate samples and compare empirical and theoretical means.", "Explain why sample size changes uncertainty.", "Identify a leakage path in an evaluation split."],
      warnings: ["Do not confuse P(A|B) with P(B|A).", "Do not treat one sample statistic as a population truth.", "Do not cherry-pick seeds.", "Do not interpret a confidence interval as a probability statement about a fixed parameter after the interval is observed."],
      lab: "Implement mean, sample variance and a simple confidence-interval procedure, then run repeated trials and measure empirical coverage.",
      misconceptions: ["Random does not mean patternless.", "A larger sample reduces uncertainty but does not remove bias automatically.", "Statistical significance is not the same as practical importance.", "A metric can be precise while answering the wrong question."],
      takeaway: "Whenever you see a model score, ask how the data was sampled, what uncertainty remains, and what population the result is supposed to represent.",
      stages: {
        Foundation: ["Understand random variables and distributions.", "Compute expectation and variance.", "Simulate repeated samples."],
        Derivation: ["Derive Bernoulli expectation and variance.", "Derive sampling-error intuition.", "Explain conditional probability and Bayes' rule."],
        Implementation: ["Implement statistics without hiding the calculation.", "Build a repeated-sampling harness.", "Compare empirical and theoretical values."],
        Engineering: ["Find leakage in a train/test pipeline.", "Separate population, sample and evaluation units.", "Document an invalid comparison and fix it."],
        Experiment: ["Compare two model variants across fixed seeds.", "Preserve every run.", "Report variability and uncertainty rather than one score."],
        Research: ["Formulate a falsifiable reliability hypothesis.", "Define primary and secondary outcomes.", "Document ambiguous or negative evidence."]
      }
    },
    "Calculus & Optimization": {
      why: "Calculus explains how a small change in an input changes an output. Optimization turns that idea into a practical training mechanism: use information about the slope of a loss to decide how parameters should move.",
      start: "Imagine standing on a hill and wanting to reach the lowest point. The local slope tells you which direction is uphill. Gradient descent uses the same idea in many dimensions: estimate the direction in which the objective increases, then move the parameters the other way.",
      vocabulary: ["Derivative = local rate of change.", "Partial derivative = rate of change with respect to one variable while holding others fixed.", "Gradient = vector of partial derivatives.", "Jacobian = matrix of derivatives for a vector-valued function.", "Hessian = matrix of second derivatives.", "Learning rate = step size used by an optimizer.", "Convex = a function with a useful global structure for optimization.", "Conditioning = sensitivity of a problem to small perturbations."],
      mental: ["The gradient points toward increasing function value.", "For minimization, gradient descent moves opposite the gradient.", "The learning rate controls how far each update moves.", "Curvature affects stability and convergence.", "Gradient checking compares an analytical derivative against an independent numerical approximation."],
      example: ["For f(w)=0.5(w-3)^2, the derivative is w-3. If w=1, the derivative is -2, so moving opposite the gradient means increasing w toward 3.", "For a regression loss, the gradient combines prediction error with the structure of the input matrix."],
      practice: ["Differentiate a simple quadratic.", "Predict the sign of a derivative.", "Run gradient descent with three learning rates.", "Use finite differences to check a gradient.", "Explain why feature scale can change optimization behavior."],
      warnings: ["A bigger learning rate is not always faster.", "A decreasing loss does not prove the implementation is correct.", "Finite differences have numerical error too.", "Always inspect gradients, loss and parameter scale together."],
      lab: "Implement a scalar gradient descent loop, extend it to linear regression, then compare analytical and finite-difference gradients.",
      misconceptions: ["A derivative is not the same as the function value.", "The gradient is not a single scalar.", "Optimization is not just trial-and-error learning-rate tuning.", "A local improvement does not automatically imply a globally optimal solution."],
      takeaway: "The central habit is to connect a mathematical derivative to an observable parameter update and then verify the implementation independently.",
      stages: {
        Foundation: ["Interpret derivatives as local change.", "Understand gradients geometrically.", "Run a tiny optimization example."],
        Derivation: ["Derive gradient descent for a quadratic.", "Derive the gradient of MSE.", "Explain the role of the transpose."],
        Implementation: ["Implement finite differences and analytical gradients.", "Build linear regression training from scratch.", "Add gradient checks."],
        Engineering: ["Diagnose exploding or stalled training.", "Inspect gradient norm and loss curves.", "Separate data-scale bugs from learning-rate bugs."],
        Experiment: ["Map stable and unstable learning-rate ranges.", "Compare raw and standardized features.", "Report convergence and failure modes."],
        Research: ["Test whether normalization increases optimization robustness.", "Use a predefined learning-rate grid and multiple seeds.", "Report what the experiment cannot establish."]
      }
    },
    "Algorithms & Data Structures": {
      why: "AI is not only mathematics. Data must be stored, searched, transformed and moved efficiently. Algorithms and data structures determine whether a correct idea remains practical when the dataset becomes large.",
      start: "Think about looking for a name in an unsorted pile of papers versus a sorted index. Both contain the same information, but the organization changes the amount of work required. Algorithms formalize the steps; data structures organize the information those steps operate on.",
      vocabulary: ["Algorithm = a defined procedure for solving a problem.", "Data structure = a way to organize data for particular operations.", "Big-O = asymptotic description of scaling.", "Invariant = a condition that remains true during an algorithm.", "Hash table = key-based structure supporting fast average lookup.", "Heap = structure for maintaining extreme elements efficiently.", "Graph = nodes connected by edges.", "Recursion = solving a problem through smaller instances of itself."],
      mental: ["Correctness comes before optimization.", "Complexity describes scaling, not one stopwatch measurement.", "An invariant is often the key to understanding an algorithm.", "The right data structure can change an algorithm's practical behavior dramatically.", "Benchmarks must use realistic workloads."],
      example: ["Searching an unsorted list may require checking every item. Binary search can repeatedly halve the search region, but only when the data is ordered.", "A hash map turns repeated key lookup into a different computational pattern than scanning a list."],
      practice: ["Trace binary search by hand.", "Write a loop invariant.", "Calculate complexity of nested loops.", "Implement a frequency counter.", "Compare top-k approaches for different k."],
      warnings: ["Big-O is not a complete performance model.", "Do not optimize code before measuring the bottleneck.", "A faster algorithm that produces wrong results is not an optimization.", "Memory complexity matters too."],
      lab: "Implement binary search, frequency indexing and bounded top-k retrieval, then benchmark correctness, latency and memory as input size changes.",
      misconceptions: ["O(n) does not mean every O(n) program has the same runtime.", "Hash lookup is not literally guaranteed constant time in every circumstance.", "Recursion is a technique, not automatically a faster solution.", "Benchmark results depend on workload and environment."],
      takeaway: "Learn to connect a data representation to the operations you need, then derive and measure the resulting cost.",
      stages: {
        Foundation: ["Understand algorithms and data structures.", "Trace simple searches.", "Read basic complexity notation."],
        Derivation: ["Derive complexity from loop counts.", "Use invariants to reason about correctness.", "Analyze matrix and retrieval workloads."],
        Implementation: ["Implement binary search, hashing and top-k.", "Write adversarial tests.", "Compare against trusted references."],
        Engineering: ["Profile a slow retrieval routine.", "Find the actual bottleneck.", "Replace it without changing behavior."],
        Experiment: ["Benchmark scaling across input sizes.", "Measure p50/p95 latency and memory.", "Use realistic workload distributions."],
        Research: ["Study a speed-quality-memory trade-off.", "Define a quality constraint before measuring.", "Report the feasible operating region."]
      }
    },
    "Systems Foundations": {
      why: "A model ultimately runs on a computer. CPU, memory, storage, networking, processes and concurrency determine whether an AI workload is fast, slow, stable or impossible to run.",
      start: "Think of an AI program as a worker using limited resources. It needs memory to hold data, compute to process it, storage to read it and networking to move information. Systems thinking means measuring those resources instead of guessing.",
      vocabulary: ["Process = a running program with its own resources.", "Thread = execution path within a process.", "Memory = working storage used by programs.", "I/O = input/output such as disk and network activity.", "Concurrency = multiple activities making progress during overlapping periods.", "Throughput = amount of work completed per unit time.", "Latency = time taken by one operation or request.", "Backpressure = slowing a producer when downstream capacity is limited."],
      mental: ["Every workload has resource constraints.", "The slowest stage can limit pipeline throughput.", "Queues decouple stages but consume memory.", "More concurrency can improve throughput until another resource becomes the bottleneck.", "Telemetry turns vague performance complaints into testable hypotheses."],
      example: ["If data loading takes 100 ms and computation takes 20 ms, adding compute workers may not help if the loader remains the bottleneck.", "A batch of larger tensors may improve throughput but increase memory and latency."],
      practice: ["Estimate tensor memory from shape and dtype.", "Calculate simple throughput.", "Identify a likely bottleneck from stage timings.", "Explain backpressure.", "Compare batch-size trade-offs."],
      warnings: ["An out-of-memory error is a resource failure, not automatically a model failure.", "CPU utilization alone does not explain every bottleneck.", "More workers can make performance worse.", "Average latency can hide tail latency."],
      lab: "Build a bounded producer-consumer pipeline, instrument stage time and queue depth, then vary batch size and worker count.",
      misconceptions: ["A process and a thread are not the same thing.", "High CPU usage does not automatically mean the system is efficient.", "More parallelism is not always better.", "Throughput and latency are related but different measurements."],
      takeaway: "Systems literacy starts with resource accounting: what is consuming memory, what is waiting, what is executing, and what measurement would distinguish competing explanations?",
      stages: {
        Foundation: ["Understand processes, memory, I/O and concurrency.", "Estimate simple resource requirements.", "Read basic system measurements."],
        Derivation: ["Derive memory and throughput estimates.", "Reason about pipeline bottlenecks.", "Explain queueing and backpressure."],
        Implementation: ["Build a bounded producer-consumer pipeline.", "Add instrumentation.", "Handle clean startup and shutdown."],
        Engineering: ["Diagnose CPU, memory and I/O bottlenecks.", "Use telemetry to identify the limiting stage.", "Document root cause and verified fix."],
        Experiment: ["Measure batch and worker trade-offs.", "Record throughput, p95 latency and memory.", "Identify a feasible operating region."],
        Research: ["Test a bottleneck hypothesis.", "Instrument competing explanations.", "Report causal evidence, limitations and next experiments."]
      }
    }
  };

  const authoredLessons = {};
  let authoredId = 1;
  for (const unit of Object.keys(M1_TEACHING)) {
    const profile = M1_TEACHING[unit];
    for (const stage of ["Foundation","Derivation","Implementation","Engineering","Experiment","Research"]) {
      const stageInfo = STAGE_DETAIL[stage];
      const steps = profile.stages[stage];
      authoredLessons["L"+String(authoredId).padStart(3,"0")] = {
        whyItMatters: profile.why,
        lessonBody: profile.start,
        mentalModel: profile.mental,
        vocabulary: profile.vocabulary,
        workedExample: { title: "Worked example", text: profile.example[0], steps: ["Identify what each number represents.", "Write the object and its shape.", "Apply the operation one step at a time.", "Check whether the result makes sense."] },
        secondExample: { title: "Second example", text: profile.example[1], steps: ["State the inputs.", "Perform the calculation or reasoning.", "Check dimensions or assumptions.", "Explain what the result means in an ML context."] },
        practice: profile.practice,
        beginnerWarnings: profile.warnings,
        lab: { title: stage+" lab", objective: stageInfo.verb+" "+unit+".", steps, success: profile.lab },
        misconceptions: profile.misconceptions,
        takeaway: profile.takeaway,
        lessonBodyExtra: "This stage is deliberately connected to the next one. You are not expected to know everything immediately. First understand the idea, then derive it, then implement it, then learn to debug it, measure it and finally investigate it.",
        stageSteps: steps
      };
      authoredId++;
    }
  }


  const stageSupport = {
    Foundation: {
      answers: [
        "The key assumption is that the core objects and their meanings are understood before operations are applied. The invariant is that every object keeps a valid, explicitly tracked shape.",
        "Your explanation is falsified if an example that satisfies the stated definitions consistently produces a different result. A shape prediction that contradicts the actual mathematical definition is also a warning that the mental model needs revision.",
        "An engineer should be able to reproduce the example, explain every input and output, predict the shape before execution, and verify the result with an independent calculation or trusted reference."
      ],
      highlights: [
        "Understand the object before memorizing the formula.",
        "Shape and meaning are part of correctness.",
        "Use a tiny example to test your understanding."
      ],
      notes: [
        "Read each symbol as an object with a meaning.",
        "Write the shape beside unfamiliar vectors, matrices or tensors.",
        "If you cannot explain an example in plain language, pause before moving on."
      ]
    },
    Derivation: {
      answers: [
        "The derivation assumes the definitions and algebraic rules used in the lesson are valid. The invariant is that each transformation preserves the meaning of the original expression.",
        "A derivation is challenged when a valid input produces a contradiction, a dimension mismatch, or an algebraic step that cannot be justified from the preceding step.",
        "Another engineer should be able to reproduce the derivation line by line, map symbols to concrete quantities, and verify the final result numerically on a small example."
      ],
      highlights: [
        "Derive first, memorize later.",
        "Every algebraic step needs a reason.",
        "Use a small numerical example to verify the derivation."
      ],
      notes: [
        "Keep dimensions visible while deriving matrix expressions.",
        "Separate definitions from conclusions.",
        "If one step feels like a jump, expand it into scalar operations."
      ]
    },
    Implementation: {
      answers: [
        "The implementation assumes the mathematical specification is translated faithfully into code. The invariant is that the implementation produces the specified result for every valid input and rejects invalid inputs clearly.",
        "A failing reference comparison, a violated shape contract, an edge-case failure, or a mismatch between the code and the derivation would falsify the current implementation.",
        "Evidence includes tests, randomized comparisons with a trusted reference, explicit edge cases, and an explanation of why the implementation matches the mathematics."
      ],
      highlights: [
        "Correctness comes before optimization.",
        "Test normal cases and deliberately invalid cases.",
        "Compare against an independent reference whenever possible."
      ],
      notes: [
        "Keep the first implementation small enough to inspect.",
        "Name variables according to their mathematical role.",
        "Do not hide the core operation inside a library until you understand it."
      ]
    },
    Engineering: {
      answers: [
        "The engineering invariant is that the system's stated contracts remain true while the workload runs. Examples include valid shapes, bounded memory, correct data separation, and expected output properties.",
        "The explanation is falsified when measurements contradict the predicted failure mode, or when reproducing the same condition does not reproduce the symptom.",
        "A convincing engineering result contains the symptom, hypothesis, diagnostic test, measured evidence, root cause, fix, and a regression test showing the failure does not return."
      ],
      highlights: [
        "Debug the cause, not just the visible error.",
        "Measure before changing the system.",
        "A fix is incomplete without a regression test."
      ],
      notes: [
        "Write down the first observable symptom.",
        "Change one variable at a time during diagnosis.",
        "Keep a record of failed hypotheses; they are useful evidence."
      ]
    },
    Experiment: {
      answers: [
        "The experiment assumes the selected variable is the intended cause of the observed change and that other important variables are controlled. The protocol itself is an invariant across comparison conditions.",
        "The hypothesis is weakened or falsified when the predicted effect is absent, reverses direction, disappears across repetitions, or can be explained by an uncontrolled variable.",
        "Another engineer should have enough information to reproduce the setup, inputs, seeds, measurements and analysis without relying on undocumented choices."
      ],
      highlights: [
        "Change one important variable deliberately.",
        "Preserve the complete result set, including failures.",
        "Separate observation from interpretation."
      ],
      notes: [
        "Define the hypothesis before inspecting the result.",
        "Keep seeds, versions and configuration recorded.",
        "Report uncertainty and failed runs instead of hiding them."
      ]
    },
    Research: {
      answers: [
        "A research question assumes a clearly defined mechanism or relationship that can be tested. The invariant is the experimental protocol: the comparison must remain fair enough to interpret the observed difference.",
        "A result that consistently contradicts the prediction, or evidence showing that the effect disappears under a controlled condition, can falsify the hypothesis.",
        "Strong evidence includes a reproducible protocol, baseline, raw measurements, multiple runs where appropriate, analysis, limitations, and a clear statement of what the evidence does and does not establish."
      ],
      highlights: [
        "A good research question can be falsified.",
        "Negative results are evidence, not failure.",
        "Do not claim more than the experiment establishes."
      ],
      notes: [
        "Define what result would change your mind before running the experiment.",
        "Distinguish a measured effect from a causal explanation.",
        "Always state the main limitation and the next experiment."
      ]
    }
  };

  const makeSupport = (profile, stage, stageSteps) => {
    const support = stageSupport[stage];
    const safeProfile = profile || {
      focus: "the core concepts and practical skills in this lesson",
      stages: { [stage]: stageSteps || [] }
    };
    return {
      checkpointAnswers: support.answers.map((answer, index) =>
        stageSteps?.[index]
          ? answer + " In this lesson, apply that principle to: " + stageSteps[index]
          : answer
      ),
      highlights: [...support.highlights, "Unit focus: " + safeProfile.focus + "."],
      keyNotes: [...support.notes, "Stage goal: " + (stageSteps?.[0] || "demonstrate the lesson objective") + "."]
    };
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
          ...makeSupport(profile, stage, module.id==="m1" ? M1_TEACHING[unit].stages[stage] : []),
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
  /*
   * Do not pad a module by cloning its own lessons.
   * The previous implementation reused the first base lesson repeatedly,
   * which caused every generated practice lesson to retain module:"m1".
   * That made Module 01 incorrectly display hundreds of lessons.
   *
   * Keep Module 01 at its authored 30 lessons. Future target capacity is
   * distributed across Modules 02-06 so generated practice records retain
   * their source module identity.
   */
  let i=0;
  const expandableBase=base.filter((lesson)=>lesson.module!=="m1");
  while(lessons.length<CURRICULUM.meta.targetLessons){
    const source=expandableBase[i%expandableBase.length], k=lessons.length+1;
    lessons.push({
      ...source,
      id:"L"+String(k).padStart(3,"0"),
      order:k,
      title:source.title+" · Practice "+(Math.floor(i/expandableBase.length)+1),
      evidence:"Transfer the same concept to a new dataset, constraint or failure mode.",
      deliverable:"A transfer artifact with evidence showing what changed and what remained invariant."
    });
    i++;
  }
  return lessons;
}

const LESSONS=buildLessons();