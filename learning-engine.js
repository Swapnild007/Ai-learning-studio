/* AI Learning Studio learning engine
 * The engine is intentionally independent of the UI.
 * It composes learning experiences from learner evidence instead of
 * treating a curriculum as a linear lesson queue.
 */

const LEARNING_TYPES = Object.freeze([
  "concept",
  "derivation",
  "worked-example",
  "coding-task",
  "debug-task",
  "experiment",
  "assessment",
  "lab",
  "project",
  "research-task",
  "review",
  "reflection"
]);

const MASTERY_DIMENSIONS = Object.freeze([
  "conceptual",
  "mathematical",
  "implementation",
  "debugging",
  "evaluation",
  "experimentation",
  "systems",
  "communication",
  "transfer"
]);

const EXPERIENCE_RULES = Object.freeze({
  weakConceptual: ["concept", "worked-example", "review"],
  weakMathematical: ["derivation", "worked-example", "coding-task"],
  weakImplementation: ["coding-task", "debug-task"],
  weakDebugging: ["debug-task", "experiment"],
  weakEvaluation: ["assessment", "experiment", "debug-task"],
  weakExperimentation: ["experiment", "lab"],
  weakSystems: ["worked-example", "coding-task", "lab"],
  weakCommunication: ["reflection", "assessment", "research-task"],
  weakTransfer: ["coding-task", "debug-task", "experiment", "project"]
});

function clamp(value, min = 0, max = 1) {
  return Math.max(min, Math.min(max, Number.isFinite(value) ? value : min));
}

function scoreCapability(capability, evidence) {
  const values = (evidence || [])
    .filter(item => item.capability === capability)
    .map(item => clamp(item.score))
    .slice(-8);

  if (!values.length) return 0;

  // Recent evidence matters, but we deliberately avoid making one attempt
  // decisive. This keeps the signal stable while still allowing adaptation.
  const weights = values.map((_, index) => index + 1);
  const totalWeight = weights.reduce((a, b) => a + b, 0);
  return values.reduce((sum, value, index) => sum + value * weights[index], 0) / totalWeight;
}

function capabilityState(capabilities = [], evidence = []) {
  return capabilities.map(capability => ({
    capability,
    score: scoreCapability(capability, evidence),
    evidenceCount: evidence.filter(item => item.capability === capability).length
  }));
}

function chooseFocus({ capabilities = [], evidence = [], context = {} }) {
  const states = capabilityState(capabilities, evidence);

  // Context can explicitly request a capability, for example from a project.
  if (context.focusCapability) {
    const requested = states.find(x => x.capability === context.focusCapability);
    if (requested) return requested;
  }

  return states
    .slice()
    .sort((a, b) => a.score - b.score || a.evidenceCount - b.evidenceCount)[0] || null;
}

function recommendedTypesForScore(score) {
  if (score < 0.35) return EXPERIENCE_RULES.weakConceptual;
  if (score < 0.55) return EXPERIENCE_RULES.weakImplementation;
  if (score < 0.72) return EXPERIENCE_RULES.weakEvaluation;
  if (score < 0.86) return EXPERIENCE_RULES.weakTransfer;
  return ["project", "research-task", "reflection"];
}

function rankExperience(experience, focus, state = {}) {
  if (!experience || !focus) return -Infinity;

  let score = 0;
  const allowed = recommendedTypesForScore(focus.score);

  if (allowed.includes(experience.type)) score += 50;
  if ((experience.capabilities || []).includes(focus.capability)) score += 35;

  const recent = new Set(state.recentExperienceIds || []);
  if (recent.has(experience.id)) score -= 30;

  if (experience.projectId && state.activeProjectId === experience.projectId) score += 18;
  if (experience.reviewDue) score += 15;
  if (experience.prerequisitesSatisfied !== false) score += 10;

  return score;
}

function recommendNextExperience({
  experiences = [],
  capabilities = [],
  evidence = [],
  context = {}
}) {
  const focus = chooseFocus({ capabilities, evidence, context });

  if (!focus) {
    return {
      reason: "insufficient-signal",
      focus: null,
      experience: experiences[0] || null
    };
  }

  const ranked = experiences
    .map(experience => ({
      experience,
      score: rankExperience(experience, focus, context)
    }))
    .filter(item => item.score > -Infinity)
    .sort((a, b) => b.score - a.score);

  return {
    reason: "capability-gap",
    focus,
    experience: ranked[0]?.experience || null,
    alternatives: ranked.slice(1, 4).map(item => item.experience)
  };
}

function recordEvidence(previous, item) {
  const evidence = Array.isArray(previous) ? [...previous] : [];
  evidence.push({
    id: item.id || crypto.randomUUID(),
    capability: item.capability,
    score: clamp(item.score),
    type: item.type || "assessment",
    createdAt: item.createdAt || new Date().toISOString(),
    artifact: item.artifact || null,
    notes: item.notes || ""
  });
  return evidence;
}

if (typeof window !== "undefined") {
  window.LEARNING_TYPES = LEARNING_TYPES;
  window.MASTERY_DIMENSIONS = MASTERY_DIMENSIONS;
  window.capabilityState = capabilityState;
  window.recommendNextExperience = recommendNextExperience;
  window.recordEvidence = recordEvidence;
}
