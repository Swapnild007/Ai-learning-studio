# AI Learning Studio

AI Learning Studio is a browser-first technical AI learning environment designed around **capability development, evidence, experimentation and transfer**, not a conventional lesson catalogue.

## Product direction

The curriculum is intentionally broad. The six domains are a map of knowledge, not a six-course linear sequence.

The product is being built as a learning operating system with:
- adaptive next-action selection
- capability-based mastery
- retrieval and interleaving
- coding and debugging tasks
- interactive experiments
- labs
- project workspaces
- research workflows
- evidence-backed progress

See [PRODUCT_ARCHITECTURE.md](PRODUCT_ARCHITECTURE.md) for the current product and learning architecture.

## Current state

The repository currently contains the first visual shell and a compatibility curriculum layer. The existing 520-item target is **not** being represented as 520 fully authored lessons. The next engineering work converts the scaffold into a composable learning graph and progressively replaces scaffolding with validated learning experiences.

## Engineering principle

Build vertical slices that work end-to-end:

**diagnose → learn → attempt → observe → explain → apply → review → advance**

Every major slice must have QA coverage before it becomes a core product surface.

## Local run

```bash
python3 server.py
```

Then open the local server shown by the Python process.

## Validation

Static QA is provided in `qa_test.py`. GitHub Actions is configured to run:
- Python syntax validation
- JavaScript syntax validation
- static product checks

Do not treat configured CI as a passing test until an actual workflow run has completed successfully.
