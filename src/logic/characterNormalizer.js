// src/logic/characterNormalizer.js
import { createBlankStyle } from '../data/fightingStylesCatalog';
function normalizeSpecialty(s) {
  return {
    instanceId: s.instanceId ?? `${Date.now()}-${Math.random()}`,
    name: s.name ?? '',
    scope: s.scope ?? '',
    names: s.names ?? [],
    conditional: s.conditional ?? null,
    description: s.description ?? '',
  };
}
function normalizeInventoryItem(i) {
  return {
    instanceId: i.instanceId ?? `${Date.now()}-${Math.random()}`,
    catalogId: i.catalogId ?? null,
    name: i.name ?? '',
    quantity: i.quantity ?? 1,
    notes: i.notes ?? '',
  };
}
function normalizeAbility(a) {
  return {
    instanceId: a.instanceId ?? `${Date.now()}-${Math.random()}`,
    abilityId: a.abilityId ?? null,
    sanityCost: a.sanityCost ?? 0, // fichas antigas: sem custo retroativo
    name: a.name ?? '',
    trigger: { type: a.trigger?.type ?? 'Ativo', detail: a.trigger?.detail ?? '' },
    contextText: a.contextText ?? '',
    conditional: a.conditional ?? null,
    cost: a.cost ?? { weight: 1, form: '1 Vigor' },
    effect: {
      weight: a.effect?.weight ?? 1,
      names: a.effect?.names ?? [],
      description: a.effect?.description ?? '',
    },
  };
}
export function normalizeCharacter(data = {}) {
  const safeData = data ?? {};
  const fightingStylesList = (() => {
    const raw = safeData.fightingStyles ?? [];
    const mapped = raw.map((style) => ({
      id: style.id,
      name: style.name ?? '',
      eixos: {
        potencia: style.eixos?.potencia ?? 0,
        robustez: style.eixos?.robustez ?? 0,
        agilidade: style.eixos?.agilidade ?? 0,
        distancia: style.eixos?.distancia ?? 0,
        controle: style.eixos?.controle ?? 0,
      },
      postura: {
        ofensiva: style.postura?.ofensiva ?? 0,
        defensiva: style.postura?.defensiva ?? 0,
      },
      passives: (style.passives ?? []).map((p) => ({
        instanceId: p.instanceId ?? `${Date.now()}-${Math.random()}`,
        names: p.names ?? [],
        weight: p.weight ?? 1,
        category: p.category ?? null,
        conditional: p.conditional ?? null, // null | { description: string }
        description: p.description ?? (p.scope ?? ''), // migra dados antigos (campo scope) pra description
        signatureMoves: (style.signatureMoves ?? []).map(normalizeAbility),
      })),
    }));
    // TODO PERSONAGEM SEMPRE TEM PELO MENOS 1 ESTILO — mesmo zerado.
    return mapped.length > 0 ? mapped : [createBlankStyle()];
  })();
  return {
    ...safeData,

    name: safeData.name ?? '',
    concept: safeData.concept ?? '',
    gender: safeData.gender ?? '',
    sexuality: safeData.sexuality ?? '',
    religion: safeData.religion ?? '',
    maritalStatus: safeData.maritalStatus ?? '',
    height: safeData.height ?? '',
    appearance: safeData.appearance ?? '',
    curiosities: safeData.curiosities ?? '',
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
    selectedAbilities: (safeData.selectedAbilities ?? []).map(normalizeAbility),

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
    fightingStyles: fightingStylesList,
    inventory: (safeData.inventory ?? []).map(normalizeInventoryItem),
    specialties: (safeData.specialties ?? []).map(normalizeSpecialty),
    activeFightingStyleId: safeData.activeFightingStyleId ?? (fightingStylesList.length === 1 ? fightingStylesList[0].id : null),
    currentPosture: safeData.currentPosture ?? 'neutra', // 'neutra' | 'ofensiva' | 'defensiva'
  };
}