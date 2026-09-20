const fs = require("fs");
const vm = require("vm");
const assert = require("assert");

const curriculumSource = fs.readFileSync("curriculum.js","utf8");
const moduleSource = fs.readFileSync("module03.js","utf8");

const context = { console, Math, Set, Map, Array, Object, String, Number, JSON };
vm.createContext(context);
vm.runInContext(curriculumSource, context);
assert.strictEqual(context.LESSONS.length, 520, "curriculum must contain 520 lessons");
assert.strictEqual(context.LESSONS.filter(x=>x.module==="m3").length, 98, "Module 03 must contain 98 lessons");

vm.runInContext(moduleSource, context);
const lessons=context.LESSONS.filter(x=>x.module==="m3");
assert.strictEqual(lessons.length,98);

const units=[...new Set(lessons.map(x=>x.unit))];
assert.deepStrictEqual(units,[
  "Neural Network Foundations",
  "Convolutional Learning",
  "Sequence Models",
  "Transformer Foundations",
  "Training Dynamics"
]);

const stages=["Foundation","Derivation","Implementation","Engineering","Experiment","Research"];
for(const unit of units){
  const core=lessons.filter(x=>x.unit===unit && !x.title.includes("· Transfer Case") && !x.title.includes("· Diagnostic Case") && !x.title.includes("· Scale Case") && !x.title.includes("· Ablation Case") && !x.title.includes("· Adversarial Case") && !x.title.includes("· Systems Case") && !x.title.includes("· Research Case"));
  assert.strictEqual(core.length,6,unit+" must have six authored stage lessons");
  assert.deepStrictEqual(core.map(x=>x.stage),stages);
  for(const l of core){
    for(const key of ["whyItMatters","lessonBody","mentalModel","vocabulary","math","mechanism","implementation","experiment","failure","evidence","deliverable","workedExample","secondExample","practice","beginnerWarnings","lab","misconceptions","checkpoint","checkpointAnswers","highlights","keyNotes","code"]){
      assert.ok(l[key],l.id+" missing "+key);
    }
    assert.ok(Array.isArray(l.mentalModel) && l.mentalModel.length>=4);
    assert.ok(Array.isArray(l.vocabulary) && l.vocabulary.length>=6);
    assert.ok(Array.isArray(l.practice) && l.practice.length>=5);
    assert.ok(Array.isArray(l.checkpointAnswers) && l.checkpointAnswers.length===3);
    assert.ok(l.code && !l.code.includes("run_experiment(seed=42)"),l.id+" still has generic placeholder code");
  }
}

const codes=lessons.filter(x=>stages.includes(x.stage)).map(x=>x.code);
assert.strictEqual(new Set(codes).size,30,"Module 03 authored stage code must be unique");

const requiredPhrases=[
  "backpropagation","autograd","receptive field","parameter sharing",
  "backpropagation through time","scaled dot-product attention",
  "positional information","residual","normalization","gradient"
];
const joined=lessons.slice(0,30).map(x=>JSON.stringify(x)).join("\n").toLowerCase();
for(const phrase of requiredPhrases) assert.ok(joined.includes(phrase), "missing domain concept: "+phrase);

assert.ok(moduleSource.includes("https://ocw.mit.edu/courses/6-7960-deep-learning-fall-2024/"));
assert.ok(moduleSource.includes("https://introml.mit.edu/notes/"));
assert.ok(moduleSource.includes("https://docs.pytorch.org/tutorials/beginner/intro"));
assert.ok(moduleSource.includes("https://arxiv.org/abs/1706.03762"));

const labSource=fs.readFileSync("module03-labs.js","utf8");
for(const unit of units) assert.ok(labSource.includes(unit), "missing interactive lab: "+unit);
assert.ok(labSource.includes("window.Module03Labs"));
assert.ok(labSource.includes("Attention Distribution"));
assert.ok(labSource.includes("Gradient Flow"));
assert.ok(labSource.includes("Receptive Field"));
assert.ok(labSource.includes("Long-Sequence Pressure"));
assert.ok(labSource.includes("Learning-Rate Stability"));

console.log(JSON.stringify({
  total:context.LESSONS.length,
  module03:lessons.length,
  authoredCore:30,
  practice:68,
  uniqueAuthoredCode:new Set(codes).size,
  units:units.length,
  stages:stages.length,
  interactiveLabs:5,
  status:"PASS"
},null,2));