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

assert "@media(max-width:760px)" in css or "@media (max-width:760px)" in css

print("Static QA PASS")
