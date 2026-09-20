const fs = require("fs");
const vm = require("vm");

const curriculum = fs.readFileSync("curriculum.js", "utf8");
const module02 = fs.readFileSync("module02.js", "utf8");
const context = {};
vm.createContext(context);
vm.runInContext(curriculum + "\nthis.__ALS = { CURRICULUM, LESSONS };", context);
vm.runInContext(module02 + "\nthis.__M2 = { CURRICULUM, LESSONS };", context);

const { CURRICULUM, LESSONS } = context.__M2;
const m2 = LESSONS.filter(x => x.module === "m2");
const module = CURRICULUM.modules.find(x => x.id === "m2");

if (m2.length !== 30) throw new Error("Module 02 must contain exactly 30 authored lessons");
if (new Set(m2.map(x => x.title)).size !== 30) throw new Error("Module 02 lesson titles must be unique");
if (new Set(m2.map(x => x.unit)).size !== 5) throw new Error("Module 02 must cover five units");
if (new Set(m2.map(x => x.stage)).size !== 6) throw new Error("Module 02 must cover six stages");
if (!module.masteryGate || module.masteryGate.criteria.length < 6) throw new Error("Module 02 mastery gate is incomplete");
if (!module.researchBasis || module.researchBasis.length < 5) throw new Error("Module 02 research basis is incomplete");

for (const lesson of m2) {
  for (const field of ["whyItMatters","lessonBody","mentalModel","vocabulary","workedExample","secondExample","math","mechanism","implementation","experiment","failure","lab","misconceptions","takeaway","practice","code","checkpoint","checkpointAnswers","highlights","keyNotes"]) {
    if (!lesson[field] || (Array.isArray(lesson[field]) && lesson[field].length === 0)) {
      throw new Error("Missing Module 02 field: " + field + " in " + lesson.id);
    }
  }
  if (lesson.code.includes("run_experiment(seed=42)")) throw new Error("Generic placeholder code remains in " + lesson.id);
  if (lesson.checkpoint.length !== 3 || lesson.checkpointAnswers.length !== 3) throw new Error("Checkpoint structure invalid in " + lesson.id);
}

console.log("Module 02 runtime QA PASS");
console.log("Module 02 lessons:", m2.length);
console.log("Unique titles:", new Set(m2.map(x => x.title)).size);
console.log("Research sources:", module.researchBasis.length);
