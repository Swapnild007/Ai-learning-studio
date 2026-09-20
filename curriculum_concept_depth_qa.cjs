const fs=require("fs");
const vm=require("vm");

const curriculum=fs.readFileSync("curriculum.js","utf8");
const depth=fs.readFileSync("curriculum-depth.js","utf8");
const ctx=vm.createContext({console});
vm.runInContext(curriculum+"\n"+depth+"\nglobalThis.__LESSONS=LESSONS; globalThis.__CURRICULUM=CURRICULUM;",ctx);

const lessons=ctx.__LESSONS;
const failures=[];
const expected={m1:30,m2:98,m3:98,m4:98,m5:98,m6:98};
const conceptsPerUnit=7;

if(lessons.length!==520) failures.push("Expected 520 lessons, got "+lessons.length);
for(const [id,n] of Object.entries(expected)){
  const count=lessons.filter(l=>l.module===id).length;
  if(count!==n) failures.push(id+" expected "+n+" lessons, got "+count);
}

const nonM1=lessons.filter(l=>l.module!=="m1");
if(nonM1.length!==490) failures.push("Expected 490 deep non-M1 lessons, got "+nonM1.length);

for(const module of ctx.__CURRICULUM.modules.filter(m=>m.id!=="m1")){
  for(const [unit] of module.units){
    const ls=lessons.filter(l=>l.unit===unit);
    const titles=new Set(ls.map(l=>l.title));
    if(titles.size<conceptsPerUnit) failures.push(unit+": fewer than "+conceptsPerUnit+" distinct concept experiences");
    const conceptTagged=ls.filter(l=>typeof l.lessonBody==="string"&&l.lessonBody.startsWith("Concept focus:"));
    if(conceptTagged.length<Math.max(1,ls.length-6)) failures.push(unit+": insufficient concept-tagged lessons ("+conceptTagged.length+"/"+ls.length+")");
  }
}

for(const l of nonM1){
  for(const field of ["lessonBody","mentalModel","vocabulary","math","mechanism","implementation","experiment","failure","research","workedExample","secondExample","practice","beginnerWarnings","lab","misconceptions","checkpoint","checkpointAnswers","highlights","keyNotes","stageSteps"]){
    const v=l[field];
    if(v==null || (Array.isArray(v)&&v.length===0) || (typeof v==="string"&&!v.trim())) failures.push(l.id+": missing "+field);
  }
}
if(failures.length){console.error(failures.join("\n"));process.exit(1);}
console.log("Concept-depth QA PASS: 520 total; 490 deep non-M1; 7+ concept experiences per unit; all deep fields populated.");
