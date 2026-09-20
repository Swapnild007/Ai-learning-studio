const fs=require("fs");
const s=fs.readFileSync("module02.js","utf8");
const required=[
  "An Introduction to Statistical Learning with Python",
  "https://introml.mit.edu/notes/",
  "log-odds score",
  "Split gain = reduction in the chosen impurity criterion",
  "PCA finds orthogonal directions of maximal variance",
  "a final test set remains separate",
  "Bootstrap = resampling the observed sample with replacement"
];
for(const token of required) if(!s.includes(token)) throw new Error("Missing audited accuracy correction: "+token);
const banned=[
  "Information gain = impurity reduction after a split.",
  "Weak learner = model performing above a trivial baseline.",
  'url:"https://ocw.mit.edu/courses/res-tll-008-social-and-ethical-responsibilities-of-computing-serc/"'
];
for(const token of banned) if(s.includes(token)) throw new Error("Outdated/inaccurate wording remains: "+token);
console.log("Module 02 content accuracy audit PASS");
