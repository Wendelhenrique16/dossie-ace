// src/logic/characterNormalizer.js
export function normalizeCharacter(data = {}) {
  const safeData = data ?? {};

  return {
    ...safeData,

    name: safeData.name ?? '',
    concept: safeData.concept ?? '',
    role: safeData.role ?? 'civil',
    lifeStageId: safeData.lifeStageId ?? null,
purchasedBackgrounds: (safeData.purchasedBackgrounds ?? []).map((entry) => ({
  ...entry,
  sanityCost: entry.sanityCost ?? 0, // fichas antigas não tinham esse campo
})),
    maxSanity: safeData.maxSanity ?? 100,
    weightKg: safeData.weightKg ?? null, 

    traumaIds: safeData.traumaIds ?? [],
    customSkills: safeData.customSkills ?? [],

    aspects: {
      ...safeData.aspects,
      mandatoryIds: safeData.aspects?.mandatoryIds ?? [],
      chosenPositiveIds: safeData.aspects?.chosenPositiveIds ?? [],
      chosenNegativeIds: safeData.aspects?.chosenNegativeIds ?? [],
      excessNegativeIds: safeData.aspects?.excessNegativeIds ?? [],
    },

    occupation: {
      ...safeData.occupation,
      primaryId: safeData.occupation?.primaryId ?? null,
      secondaryId: safeData.occupation?.secondaryId ?? null,
      freeAttribute: safeData.occupation?.freeAttribute ?? null,
    },

    classPath: {
      ...safeData.classPath,
      classId: safeData.classPath?.classId ?? null,
      archetypeId: safeData.classPath?.archetypeId ?? null,
      weaponChoiceSkillId: safeData.classPath?.weaponChoiceSkillId ?? null,
      caminhoId: safeData.classPath?.caminhoId ?? null,
    },
  };
}