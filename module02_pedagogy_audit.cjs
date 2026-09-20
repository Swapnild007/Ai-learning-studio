const fs=require("fs");
const vm=require("vm");
const cp=require("child_process");

const curriculum=fs.readFileSync("curriculum.js","utf8");
const module02=fs.readFileSync("module02.js","utf8");
const ctx=vm.createContext({console});
vm.runInContext(curriculum+"\n"+module02+"\nglobalThis.__LESSONS=LESSONS; globalThis.__CURRICULUM=CURRICULUM;",ctx);

const lessons=ctx.__LESSONS.filter(x=>x.module==="m2"&&!x.title.includes("· Practice "));
const failures=[];
const expectStages=["Foundation","Derivation","Implementation","Engineering","Experiment","Research"];
if(lessons.length!==30) failures.push("Expected exactly 30 authored Module 02 lessons, got "+lessons.length);

const seen=new Set();
for(const l of lessons){
  if(!expectStages.includes(l.stage)) failures.push(l.id+": invalid stage "+l.stage);
  const expected=l.stage+" · "+l.unit;
  if(!l.title.startsWith(expected)) failures.push(l.id+": title/stage/unit mismatch: "+l.title);
  if(seen.has(l.id)) failures.push("duplicate lesson id "+l.id);
  seen.add(l.id);
  if(!Array.isArray(l.stageSteps)||l.stageSteps.length!==3) failures.push(l.id+": stageSteps incomplete");
  if(!l.math||l.math.length<80) failures.push(l.id+": stage math missing/too short");
  if(!l.mechanism||l.mechanism.length<30) failures.push(l.id+": stage mechanism missing");
  if(!l.implementation||!l.experiment||!l.failure) failures.push(l.id+": missing implementation/experiment/failure");
  if(!l.workedExample||!l.secondExample) failures.push(l.id+": examples missing");
  if(!Array.isArray(l.checkpointAnswers)||l.checkpointAnswers.length!==3) failures.push(l.id+": checkpoint answers incomplete");
  if(typeof l.code!=="string"||l.code.includes("run_experiment")||l.code.includes("undefined")) failures.push(l.id+": placeholder/invalid code marker remains");
  try{cp.execFileSync("python3",["-c","import ast,sys; ast.parse(sys.stdin.read())"],{input:l.code,stdio:["pipe","pipe","pipe"]});}
  catch(e){failures.push(l.id+": Python syntax error in stage code");}
}
if(new Set(lessons.map(x=>x.code)).size!==30) failures.push("Stage code is duplicated across authored lessons");
if(lessons.some(x=>x.title.includes("Practice"))) failures.push("Practice records leaked into authored core set");
if(ctx.__CURRICULUM.meta.targetLessons!==520) failures.push("Curriculum target changed unexpectedly");
for(const module of ctx.__CURRICULUM.modules){
  const count=ctx.__LESSONS.filter(x=>x.module===module.id).length;
  const expected=module.id==="m1"?30:98;
  if(count!==expected) failures.push(module.id+": expected "+expected+" lessons, got "+count);
}
if(ctx.__LESSONS.length!==520) failures.push("Expected 520 total lessons, got "+ctx.__LESSONS.length);
if(failures.length){console.error(failures.join("\n"));process.exit(1);}
console.log("Module 02 pedagogical QA PASS: 30 authored lessons, stage/title alignment, stage-specific math/mechanism, examples, checkpoints, unique executable Python syntax, and no placeholder code.");
