from pathlib import Path
root=Path(__file__).parent
html=(root/"index.html").read_text()
css=(root/"styles.css").read_text()
js=(root/"app.js").read_text()
cur=(root/"curriculum.js").read_text()
for f in ["styles.css","curriculum.js","app.js"]: assert f in html,f"Missing asset reference: {f}"
assert "targetLessons:520" in cur
assert "LESSONS=buildLessons()" in cur
for token in ["home","learn","labs","projects","progress","localStorage","openLesson","escapeHtml"]: assert token in js
assert "@media(max-width:760px)" in css
print("QA PASS")
