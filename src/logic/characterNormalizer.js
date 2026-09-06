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
selectedAbilities: (safeData.selectedAbilities ?? []).map((a) => ({
  instanceId: a.instanceId,
  abilityId: a.abilityId ?? null,
  name: a.name ?? '',
  trigger: {
    type: a.trigger?.type ?? 'Ativo',
    detail: a.trigger?.detail ?? '',
  },
  contextText: a.contextText ?? '',
  conditional: a.conditional ?? null, // null | { description, costReduction: 1 | 'zera' }
  cost: a.cost ?? { weight: 1, form: '1 Vigor' },
effect: {
  weight: a.effect?.weight ?? 1,
  names: a.effect?.names ?? [],
  description: a.effect?.description ?? '',
},
})),

    aspects: {
      ...safeData.aspects,
      mandatoryIds: safeData.aspects?.mandatoryIds ?? [],
      chosenPositiveIds: safeData.aspects?.chosenPositiveIds ?? [],
      chosenNegativeIds: safeData.aspects?.chosenNegativeIds ?? [],
      excessNegativeIds: safeData.aspects?.excessNegativeIds ?? [],
    },
    agingPenalty: {
  ...safeData.agingPenalty,
  halvedAttributeIds: safeData.agingPenalty?.halvedAttributeIds ?? [],
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