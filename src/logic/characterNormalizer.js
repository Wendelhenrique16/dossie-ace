// src/logic/characterNormalizer.js
export function normalizeCharacter(data = {}) {
  return {
    ...data,

    traumaIds: data.traumaIds ?? [],
    customSkills: data.customSkills ?? [],

    aspects: {
      ...data.aspects,
      mandatoryIds: data.aspects?.mandatoryIds ?? [],
      chosenPositiveIds: data.aspects?.chosenPositiveIds ?? [],
      chosenNegativeIds: data.aspects?.chosenNegativeIds ?? [],
      excessNegativeIds: data.aspects?.excessNegativeIds ?? [],
    },

    occupation: {
      ...data.occupation,
      primaryId: data.occupation?.primaryId ?? null,
      secondaryId: data.occupation?.secondaryId ?? null,
      freeAttribute: data.occupation?.freeAttribute ?? null,
    },

    classPath: {
      ...data.classPath,
      classId: data.classPath?.classId ?? null,
      archetypeId: data.classPath?.archetypeId ?? null,
      weaponChoiceSkillId: data.classPath?.weaponChoiceSkillId ?? null,
      caminhoId: data.classPath?.caminhoId ?? null,
    },
  };
}