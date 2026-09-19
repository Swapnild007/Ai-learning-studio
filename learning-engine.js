/* AI Learning Studio learning engine.
 * This module is UI-independent. It selects learning experiences from
 * learner evidence instead of treating the curriculum as a linear queue.
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
  const numeric = Number(value);
  const safeValue = Number.isFinite(numeric) ? numeric : min;
  return Math.max(min, Math.min(max, safeValue));
}

function scoreCapability(capability, evidence = []) {
  const values = evidence
    .filter((item) => item && item.capability === capability)
    .map((item) => clamp(item.score))
    .slice(-8);

  if (!values.length) return 0;

  const weights = values.map((_, index) => index + 1);
  const totalWeight = weights.reduce((sum, weight) => sum + weight, 0);

  return values.reduce(
    (sum, value, index) => sum + value * weights[index],
    0
  ) / totalWeight;
}

function capabilityState(capabilities = [], evidence = []) {
  return capabilities.map((capability) => ({
    capability,
    score: scoreCapability(capability, evidence),
    evidenceCount: evidence.filter(
      (item) => item && item.capability === capability
    ).length
  }));
}

function chooseFocus({
  capabilities = [],
  evidence = [],
  context = {}
} = {}) {
  const states = capabilityState(capabilities, evidence);

  if (context.focusCapability) {
    const requested = states.find(
      (item) => item.capability === context.focusCapability
    );

    if (requested) return requested;
  }

  return (
    states
      .slice()
      .sort(
        (a, b) =>
          a.score - b.score || a.evidenceCount - b.evidenceCount
      )[0] || null
  );
}

function recommendedTypesForScore(score) {
  if (score < 0.35) return EXPERIENCE_RULES.weakConceptual;
  if (score < 0.55) return EXPERIENCE_RULES.weakImplementation;
  if (score < 0.72) return EXPERIENCE_RULES.weakEvaluation;
  if (score < 0.86) return EXPERIENCE_RULES.weakTransfer;

  return ["project", "research-task", "reflection"];
}

function rankExperience(experience, focus, state = {}) {
  if (!experience || !focus) return Number.NEGATIVE_INFINITY;

  let score = 0;
  const allowed = recommendedTypesForScore(focus.score);

  if (allowed.includes(experience.type)) score += 50;

  if (
    Array.isArray(experience.capabilities) &&
    experience.capabilities.includes(focus.capability)
  ) {
    score += 35;
  }

  const recent = new Set(
    Array.isArray(state.recentExperienceIds)
      ? state.recentExperienceIds
      : []
  );

  if (recent.has(experience.id)) score -= 30;

  if (
    experience.projectId &&
    state.activeProjectId === experience.projectId
  ) {
    score += 18;
  }

  if (experience.reviewDue) score += 15;
  if (experience.prerequisitesSatisfied !== false) score += 10;

  return score;
}

function recommendNextExperience({
  experiences = [],
  capabilities = [],
  evidence = [],
  context = {}
} = {}) {
  const focus = chooseFocus({ capabilities, evidence, context });

  if (!focus) {
    return {
      reason: "insufficient-signal",
      focus: null,
      experience: experiences[0] || null,
      alternatives: []
    };
  }

  const ranked = experiences
    .map((experience) => ({
      experience,
      score: rankExperience(experience, focus, context)
    }))
    .filter((item) => Number.isFinite(item.score))
    .sort((a, b) => b.score - a.score);

  return {
    reason: "capability-gap",
    focus,
    experience: ranked[0]?.experience || null,
    alternatives: ranked.slice(1, 4).map((item) => item.experience)
  };
}

let evidenceSequence = 0;

function createEvidenceId() {
  evidenceSequence += 1;

  if (
    typeof globalThis !== "undefined" &&
    globalThis.crypto &&
    typeof globalThis.crypto.randomUUID === "function"
  ) {
    return globalThis.crypto.randomUUID();
  }

  return `evidence-${Date.now()}-${evidenceSequence}`;
}

function recordEvidence(previous = [], item = {}) {
  const evidence = Array.isArray(previous) ? [...previous] : [];

  evidence.push({
    id: item.id || createEvidenceId(),
    capability: item.capability || null,
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
