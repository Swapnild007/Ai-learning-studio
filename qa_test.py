from pathlib import Path

ROOT = Path(__file__).resolve().parent

REQUIRED_FILES = [
    "index.html",
    "styles.css",
    "curriculum.js",
    "learning-engine.js",
    "app.js",
    "server.py",
    "qa_test.py",
]

for filename in REQUIRED_FILES:
    assert (ROOT / filename).is_file(), f"Missing required file: {filename}"

html = (ROOT / "index.html").read_text(encoding="utf-8")
css = (ROOT / "styles.css").read_text(encoding="utf-8")
curriculum = (ROOT / "curriculum.js").read_text(encoding="utf-8")
engine = (ROOT / "learning-engine.js").read_text(encoding="utf-8")
app = (ROOT / "app.js").read_text(encoding="utf-8")

for asset in [
    'href="styles.css"',
    'src="curriculum.js"',
    'src="learning-engine.js"',
    'src="app.js"',
]:
    assert asset in html, f"Missing HTML asset reference: {asset}"

assert "targetLessons:520" in curriculum
assert "function buildLessons()" in curriculum
assert "const LESSONS=buildLessons()" in curriculum

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
]:
    assert token in app, f"Missing app token: {token}"

for breakpoint in ["@media (max-width:760px)", "@media (max-width:430px)", "@media (max-width:360px)", "@media (min-width:1440px)"]:
    assert breakpoint in css, f"Missing responsive breakpoint: {breakpoint}"
for token in ["max-width:1320px", "prefers-reduced-motion", "overflow-x:hidden"]:
    assert token in css, f"Missing responsive/accessibility token: {token}"

# Validate the mobile-first content contract without requiring a misleading min-width rule.
# The layout must remain shrinkable at small viewports and explicitly suppress accidental horizontal overflow.
assert "main{flex:1;min-width:0" in css, "Main content is not shrink-safe"
assert "grid-template-columns:1fr" in css, "Mobile single-column layout is missing"

print("Static QA PASS")
