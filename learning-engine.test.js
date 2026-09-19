const assert = require("node:assert/strict");
const fs = require("node:fs");
const vm = require("node:vm");

const source = fs.readFileSync("learning-engine.js", "utf8");
const sandbox = {
  window: {},
  console,
  Date,
  Math,
  Number,
  Set,
  Array,
  Object,
  String
};

vm.createContext(sandbox);
vm.runInContext(source, sandbox, { filename: "learning-engine.js" });

assert.equal(
  sandbox.window.LEARNING_TYPES.includes("coding-task"),
  true
);

const states = sandbox.window.capabilityState(
  ["implementation", "evaluation"],
  [
    { capability: "implementation", score: 0.8 },
    { capability: "evaluation", score: 0.2 }
  ]
);

assert.equal(states.length, 2);
assert.equal(states[1].score, 0.2);

const recommendation = sandbox.window.recommendNextExperience({
  capabilities: ["implementation", "evaluation"],
  evidence: [
    { capability: "implementation", score: 0.8 },
    { capability: "evaluation", score: 0.2 }
  ],
  experiences: [
    {
      id: "exp-1",
      type: "experiment",
      capabilities: ["evaluation"],
      prerequisitesSatisfied: true
    },
    {
      id: "exp-2",
      type: "coding-task",
      capabilities: ["implementation"],
      prerequisitesSatisfied: true
    }
  ]
});

assert.equal(recommendation.focus.capability, "evaluation");
assert.equal(recommendation.experience.id, "exp-1");

const evidence = sandbox.window.recordEvidence([], {
  capability: "evaluation",
  score: 0.9,
  type: "experiment"
});

assert.equal(evidence.length, 1);
assert.equal(evidence[0].capability, "evaluation");
assert.equal(evidence[0].score, 0.9);
assert.ok(evidence[0].id);

console.log("Learning engine tests passed.");
