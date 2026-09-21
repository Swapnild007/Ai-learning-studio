/* Beginner Mathematics Bridge
   A non-counted support layer for learners who are new to algebra and AI mathematics.
*/
(() => {
  const MATH_BRIDGE = {
    "Neural Network Foundations": {
      title: "Math bridge: what the symbols mean",
      plain: "A parameter is simply a number the model can learn. A neural network learns many numbers and uses them to transform inputs.",
      steps: [
        "Read C_in as: how many input channels enter the layer.",
        "Read C_out as: how many filters the layer learns.",
        "Read K_h × K_w as: the height × width of one filter.",
        "Multiply the pieces to count weights, then add one bias for each filter."
      ],
      example: "For 3 input channels, 8 filters and a 3×3 kernel: 8 × (3 × 3 × 3) + 8 = 224 trainable parameters.",
      vocabulary: {
        "C_in": "input channels",
        "C_out": "number of filters / output channels",
        "K_h": "kernel height",
        "K_w": "kernel width",
        "parameter": "a number learned during training",
        "bias": "one additional learned number for each filter"
      }
    },
    "Convolutional Learning": {
      title: "Math bridge: parameter counting",
      plain: "The parameter-count equation is only repeated multiplication and addition. It tells you how many learnable numbers are inside a convolution layer.",
      steps: [
        "Count the numbers in one kernel: K_h × K_w.",
        "Multiply by C_in because the kernel has one slice for every input channel.",
        "Multiply by C_out because we have multiple filters.",
        "Add C_out biases if the layer uses bias."
      ],
      example: "A 3×3 convolution with 3 input channels and 8 filters has 8 × (3 × 3 × 3) + 8 = 224 parameters.",
      vocabulary: {
        "kernel": "small grid of learned numbers",
        "channel": "one feature plane, such as red/green/blue",
        "filter": "the complete set of kernel weights used to produce one output channel",
        "parameter": "a learned number"
      }
    },
    "Sequence Models": {
      title: "Math bridge: a formula is a recipe",
      plain: "When you see h_t = f(h_{t-1}, x_t), read it as: the new hidden state is calculated from the previous hidden state and the current input.",
      steps: [
        "h_t means the hidden state at the current time step.",
        "h_{t-1} means the hidden state from the previous step.",
        "x_t means the current input.",
        "f means 'apply this calculation'."
      ],
      example: "If a sequence has five inputs, the model updates its hidden state five times, reusing the same learned rules.",
      vocabulary: {
        "t": "position or time step",
        "h": "hidden state",
        "x": "input",
        "f": "a function: a rule that turns inputs into an output"
      }
    },
    "Transformer Foundations": {
      title: "Math bridge: matrices are tables of numbers",
      plain: "Attention is mostly matrix multiplication, scaling and probability calculation. You do not need to memorize the notation first.",
      steps: [
        "Q, K and V are tables of numbers called matrices.",
        "QKᵀ compares every query with every key.",
        "Divide by √d_k to control the scale of the scores.",
        "Softmax converts scores into weights that add up to 1.",
        "Multiply those weights by V to create the output."
      ],
      example: "If four tokens are present, the attention-score table has 4×4 = 16 pairwise scores.",
      vocabulary: {
        "matrix": "a rectangular table of numbers",
        "transpose": "turn rows into columns",
        "score": "a number measuring compatibility",
        "softmax": "a calculation that turns scores into probabilities that add to 1"
      }
    },
    "Training Dynamics": {
      title: "Math bridge: learning rate and updates",
      plain: "A learning rate controls how large a step the model takes when changing its parameters.",
      steps: [
        "The gradient tells us which direction increases the loss.",
        "The optimizer moves in the opposite direction to reduce the loss.",
        "The learning rate controls the size of that move.",
        "A step that is too large can overshoot; a very small step can make learning slow."
      ],
      example: "If a parameter is 4, its gradient is 2 and the learning rate is 0.1, a simple gradient-descent update gives 4 − (0.1 × 2) = 3.8.",
      vocabulary: {
        "gradient": "a direction-and-size signal telling the optimizer how the loss changes",
        "learning rate": "the size of an optimization step",
        "loss": "a number measuring how wrong the model is",
        "update": "the change made to a parameter"
      }
    }
  };

  function get(unit) {
    return MATH_BRIDGE[unit] || null;
  }

  function render(unit) {
    const item = get(unit);
    if (!item) return "";
    return `<section class="math-bridge card">
      <div class="module-num">BEGINNER MATH BRIDGE</div>
      <h3>${escapeHtml(item.title)}</h3>
      <p class="math-bridge-plain">${escapeHtml(item.plain)}</p>
      <div class="math-bridge-grid">
        <div><strong>Read it step by step</strong><ol>${item.steps.map(x => `<li>${escapeHtml(x)}</li>`).join("")}</ol></div>
        <div><strong>Concrete example</strong><p>${escapeHtml(item.example)}</p></div>
      </div>
      <details><summary>Vocabulary</summary><div class="math-bridge-vocab">${Object.entries(item.vocabulary).map(([k,v]) => `<div><code>${escapeHtml(k)}</code><span>${escapeHtml(v)}</span></div>`).join("")}</div></details>
    </section>`;
  }

  window.BeginnerMathBridge = { get, render };
})();