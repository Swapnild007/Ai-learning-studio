const fs=require("fs");
const s=fs.readFileSync("module02-labs.js","utf8");
new Function(s);
const required=["Module02Labs","Regression Lab","Tree Split Lab","Clustering Lab","Cross-Validation Lab","Baseline vs Complexity Lab","data-m2-range","data-m2-reveal"];
for(const token of required) if(!s.includes(token)) throw new Error("Missing Module 02 lab token: "+token);
if(s.includes("conceptual simulator")||s.includes("model flexibility")) throw new Error("Legacy conceptual Module 02 interaction detected");
console.log("Module 02 labs QA PASS");
