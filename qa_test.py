from pathlib import Path

ROOT = Path(__file__).resolve().parent

REQUIRED_FILES = [
    "index.html",
    "styles.css",
    "curriculum.js",
    "module02.js",
    "module02_runtime_qa.cjs",
    "module02_labs_qa.cjs",
    "module02-labs.js",
    "learning-engine.js",
    "app.js",
    "server.py",
    "qa_test.py",
    "syntax-primer.js",
]

for filename in REQUIRED_FILES:
    assert (ROOT / filename).is_file(), f"Missing required file: {filename}"

html = (ROOT / "index.html").read_text(encoding="utf-8")
css = (ROOT / "styles.css").read_text(encoding="utf-8")
curriculum = (ROOT / "curriculum.js").read_text(encoding="utf-8")
module02 = (ROOT / "module02.js").read_text(encoding="utf-8")
engine = (ROOT / "learning-engine.js").read_text(encoding="utf-8")
app = (ROOT / "app.js").read_text(encoding="utf-8")
syntax = (ROOT / "syntax-primer.js").read_text(encoding="utf-8")

for asset in [
    'href="styles.css',
    'src="curriculum.js',
    'src="module02.js',
    'src="module02-labs.js',
    'src="learning-engine.js',
    'src="app.js',
    'src="syntax-primer.js',
]:
    assert asset in html, f"Missing HTML asset reference: {asset}"

assert "targetLessons:520" in curriculum
assert "function buildLessons()" in curriculum
assert "const LESSONS=buildLessons()" in curriculum

for token in [
    "researchBasis",
    "masteryGate",
    "Regression & Classification",
    "Trees & Ensembles",
    "Unsupervised Learning",
    "Evaluation & Validation",
    "ML Engineering Patterns",
    "Stanford University",
    "Carnegie Mellon University",
]:
    assert token in module02, f"Missing Module 02 research/content token: {token}"

for token in [
    "recommendNextExperience",
    "capabilityState",
    "recordEvidence",
    "MASTERY_DIMENSIONS",
]:
    assert token in engine, f"Missing learning-engine token: {token}"

for token in [
    "home",
    "learn",
    "labs",
    "projects",
    "progress",
    "localStorage",
    "openLesson",
    "escapeHtml",
    "menuBackdrop",
    "setMenuOpen",
]:
    assert token in app, f"Missing app token: {token}"

for token in [
    "Programming Syntax Primer",
    "Variables, Types & Expressions",
    "Lists, Arrays & Indexing",
    "if, for & while",
    "Functions & Parameters",
    "Dictionaries, Sets & Data Structures",
    "Modules, Errors, Testing & Debugging",
    "syntaxBridge",
    "syntaxModalBackdrop",
]:
    assert token in syntax, f"Missing syntax bridge token: {token}"

for breakpoint in ["@media (max-width:760px)", "@media (max-width:430px)", "@media (max-width:360px)", "@media (min-width:1440px)"]:
    assert breakpoint in css, f"Missing responsive breakpoint: {breakpoint}"
for token in ["max-width:1320px", "prefers-reduced-motion", "overflow-x:hidden"]:
    assert token in css, f"Missing responsive/accessibility token: {token}"

assert "main{flex:1;min-width:0" in css, "Main content is not shrink-safe"
assert "grid-template-columns:1fr" in css, "Mobile single-column layout is missing"
assert "menu-backdrop" in css, "Mobile menu backdrop is missing"
assert 'id="menuBackdrop"' in html, "Mobile menu backdrop element is missing"
assert 'id="moduleNav"' not in html, "Curriculum is incorrectly exposed as a separate navigation block"

print("Static QA PASS")
