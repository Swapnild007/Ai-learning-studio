# AI Learning Studio: Product Architecture

## Product thesis

AI Learning Studio is not a digital textbook and it is not a lesson catalogue.

The product should behave like a **learning operating system for technical AI capability**. The learner moves through concepts, practice, experiments, projects, review, and research according to demonstrated capability rather than a fixed page sequence.

The curriculum is large by design. The interface must therefore reduce cognitive load without reducing the curriculum.

## 1. Curriculum is a graph, not a list

The existing six domains remain the content map:

1. Mathematics & Computational Foundations
2. Classical ML & Statistical Inference
3. Deep Learning
4. Advanced AI Systems
5. Generative & Agentic AI
6. Production AI & MLOps

These are **domains**, not six linear courses.

Every learning object should connect to:
- capabilities
- prerequisites
- related concepts
- implementation tasks
- experiments
- failure modes
- assessments
- evidence artifacts
- projects
- research questions

A learner can enter from a problem, project, skill gap, review queue, or curiosity and still converge on the same underlying capability graph.

## 2. Learning objects

The atomic content model is intentionally broader than "lesson".

- Concept: an idea the learner must understand.
- Derivation: formal reasoning or mathematical mechanism.
- Worked example: a concrete instance.
- Coding task: implement or modify something.
- Debug task: diagnose a deliberately broken system.
- Experiment: manipulate variables and inspect evidence.
- Assessment: demonstrate understanding under constraints.
- Lab: reusable experimental environment.
- Project: multi-object artifact with engineering evidence.
- Research task: open-ended question with a documented result.
- Review item: retrieval practice scheduled from prior evidence.
- Reflection: explain trade-offs, limitations, and next questions.

A single concept may therefore produce several experiences without duplicating the underlying content.

## 3. The learner loop

The primary loop is:

**Diagnose → Learn → Attempt → Observe → Explain → Apply → Review → Advance**

The system should prefer an action that creates evidence over an action that merely increases completion count.

Examples:
- If a learner can explain attention but cannot implement it, serve an implementation task.
- If implementation works but evaluation is weak, serve an evaluation/debug task.
- If the learner can reproduce a result, serve a controlled experiment.
- If the learner repeatedly succeeds, increase transfer difficulty rather than replaying basics.

## 4. Mastery is multidimensional

Do not use a single percentage as the definition of mastery.

Track capability dimensions such as:
- conceptual understanding
- mathematical reasoning
- implementation
- debugging
- evaluation
- experimentation
- systems reasoning
- communication
- transfer

The source curriculum's L0-L6 progression is treated as a **capability maturity model**, not a lesson-number sequence.

A learner can be L4 in evaluation and L2 in distributed systems simultaneously.

## 5. Modern teaching mechanics

The product should use:

### Retrieval practice
Bring back important ideas after a delay instead of relying on rereading.

### Interleaving
Mix related but distinct problems so the learner must select the method rather than follow a visible recipe.

### Generation
Ask the learner to predict an output, derive a relationship, write a hypothesis, or choose a debugging experiment before revealing the answer.

### Productive failure
Allow a constrained attempt before showing the canonical explanation.

### Error-driven learning
Treat wrong answers and failed experiments as diagnostic signals.

### Dual representation
Connect equations, code, diagrams, traces, metrics, and plain-language explanations.

### Transfer
Move the same mechanism into a new dataset, architecture, constraint, or failure mode.

### Evidence-based progression
Advance based on demonstrated capability, not lesson completion.

## 6. Product surfaces

The navigation should eventually be organized around learner intent:

- **Today**: the next high-value learning action.
- **Explore**: the capability graph and curriculum map.
- **Practice**: retrieval, coding, debugging, and transfer tasks.
- **Labs**: controlled experiments.
- **Projects**: portfolio-grade artifacts.
- **Research**: open-ended investigation.
- **Progress**: capability evidence and mastery map.

Search remains global and should search concepts, capabilities, projects, labs, and evidence, not only lessons.

## 7. Content architecture

The content layer must be data-driven.

Recommended object shape:

```
{
  id,
  type,
  title,
  domain,
  capabilities[],
  prerequisites[],
  concepts[],
  difficulty,
  masteryTargets[],
  estimatedMinutes,
  modes[],
  content,
  tasks[],
  assessment,
  evidence,
  related[],
  sourceRefs[]
}
```

The runtime should compose experiences from these objects instead of requiring every experience to be hard-coded into a page.

## 8. Evidence model

A completion event is weak evidence.

Useful evidence includes:
- correct implementation
- test results
- debugging diagnosis
- experiment table
- metric comparison
- written explanation
- reproducible run
- project artifact
- research note

Evidence should be timestamped and associated with the capability it demonstrates.

## 9. Curriculum scale

The current catalog target of 520 learning items is a structural target, not permission to generate 520 shallow placeholders.

The system must distinguish:
- authored content
- generated practice
- generated review
- scaffolded content
- validated content

The UI must never imply that scaffolded content is finished educational material.

## 10. Architecture principles

1. Content and presentation are separate.
2. Curriculum is a graph.
3. Experiences are composable.
4. Progress is evidence-based.
5. Difficulty adapts to demonstrated performance.
6. Every experiment has a hypothesis, variable, measurement, and conclusion.
7. Every project has an artifact and evaluation criteria.
8. Research work records negative results and limitations.
9. The interface should feel native and calm, but learning mechanics matter more than visual decoration.
10. Every major feature gets automated QA before it becomes a core surface.

## 11. Delivery strategy

Build vertical slices, not isolated UI screens.

### Slice A
Diagnose → first concept → interactive practice → assessment → evidence → next action.

### Slice B
Concept → code task → execution result → debugging → mastery update.

### Slice C
Concept → lab → experiment → result capture → explanation → research question.

### Slice D
Multiple capabilities → project workspace → artifact → evaluation → portfolio evidence.

Each slice must be usable end-to-end before expanding breadth.

## Immediate architectural decision

The current lesson-list architecture is now considered a temporary compatibility layer.

We will not keep expanding the six-module page into a giant catalogue.

The next implementation should introduce a learning engine that can select the next experience from:
- learner state
- capability gaps
- prerequisites
- recent errors
- review due dates
- current project context
- available labs
- evidence already produced

This is the foundation for a genuinely modern technical learning product.
