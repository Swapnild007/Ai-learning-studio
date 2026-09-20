const fs = require("fs");
const vm = require("vm");

const source = fs.readFileSync("syntax-primer.js", "utf8");
const context = {
  document: {
    readyState: "loading",
    addEventListener() {}
  },
  window: {
    addEventListener() {}
  }
};

vm.runInNewContext(source, context, { filename: "syntax-primer.js" });

for (const token of [
  "Programming Syntax Primer",
  "Variables, Types & Expressions",
  "Lists, Arrays & Indexing",
  "if, for & while",
  "Functions & Parameters",
  "Dictionaries, Sets & Data Structures",
  "Modules, Errors, Testing & Debugging"
]) {
  if (!source.includes(token)) throw new Error("Missing syntax primer token: " + token);
}

console.log("Syntax primer static/runtime parse QA PASS");
