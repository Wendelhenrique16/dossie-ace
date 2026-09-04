// src/logic/backgroundDistribution.js
// Lógica pura para o modal de distribuição de pontos (UC-01).

import { BACKGROUND_PACKAGES, BACKGROUND_RULES } from '../data/backgrounds';
import { SKILL_CATEGORIES } from '../data/skills';

/**
 * Retorna a lista de perícias válidas para um pacote (RN-01: "o sistema deve
 * carregar as perícias válidas ao abrir o modal").
 */
export function getValidSkillsForPackage(packageId) {
  const pkg = BACKGROUND_PACKAGES[packageId];
  if (!pkg) throw new Error(`Pacote desconhecido: ${packageId}`);

  const skillsFromCategories = pkg.allowedSkillCategories.flatMap(
    (categoryId) => SKILL_CATEGORIES[categoryId]?.skills || []
  );

  const extra = pkg.extraSkills || [];
  return [...new Set([...skillsFromCategories, ...extra])];
}



/**
 * Seleciona qual Atributo recebe o bônus fixo de +2 nesta compra do pacote.
 * Regra: +2 fixo, não divisível — é sempre um único atributo por compra.
 */
export function selectAttribute(state, attributeId) {
  return { ...state, selectedAttribute: attributeId, error: null };
}

export const ATTRIBUTE_BONUS_PER_PACKAGE = 2;

/**
 * Incrementa 1 ponto numa perícia (botão "+" do modal).
 * RN-02: bloqueia incremento se saldo chegar a 0.
 * Regra geral: máx. 2 aumentos por perícia por compra.
 */
export function incrementSkill(state, skillId) {
  if (state.remainingPoints <= 0) {
    return { ...state, error: 'Saldo de pontos esgotado.' };
  }

  const currentAllocation = state.allocations[skillId] || 0;
  if (currentAllocation >= BACKGROUND_RULES.maxIncreasePerSkillPerPurchase) {
    return { ...state, error: 'Limite de 2 aumentos por perícia nesta compra atingido.' };
  }

  return {
    ...state,
    remainingPoints: state.remainingPoints - 1,
    allocations: { ...state.allocations, [skillId]: currentAllocation + 1 },
    error: null,
  };
}

/**
 * Decrementa 1 ponto numa perícia (permite o jogador corrigir antes de confirmar).
 */
export function decrementSkill(state, skillId) {
  const currentAllocation = state.allocations[skillId] || 0;
  if (currentAllocation <= 0) return state;

  return {
    ...state,
    remainingPoints: state.remainingPoints + 1,
    allocations: { ...state.allocations, [skillId]: currentAllocation - 1 },
    error: null,
  };
}

/**
 * FA02 - Aleatorizar: distribui automaticamente os pontos restantes entre
 * as perícias válidas, respeitando o limite de 2 por perícia.
 */
export function randomizeDistribution(state, validSkillIds) {
  let working = { ...state, allocations: { ...state.allocations } };
  const maxPerSkill = BACKGROUND_RULES.maxIncreasePerSkillPerPurchase;

  while (working.remainingPoints > 0) {
    const eligible = validSkillIds.filter(
      (id) => (working.allocations[id] || 0) < maxPerSkill
    );
    if (eligible.length === 0) break; // todas as perícias atingiram o teto

    const pick = eligible[Math.floor(Math.random() * eligible.length)];
    working = incrementSkill(working, pick);
  }

  return working;
}
/** 
 * Estado inicial do modal ao abrir um pacote.

export function createDistributionState(packageId) {
  const pkg = BACKGROUND_PACKAGES[packageId];
  if (!pkg) throw new Error(`Pacote desconhecido: ${packageId}`);

  return {
    packageId,
    totalPoints: pkg.pointsPerPurchase,
    remainingPoints: pkg.pointsPerPurchase,
    allocations: {}, // { skillId: pontosAlocados }
    selectedAttribute: null, // atributo escolhido para o +2 fixo desta compra
  };
} */
/**
 * O modal só habilita "Confirmar" quando o saldo de perícias chega a 0
 * E um Atributo foi escolhido para o bônus fixo de +2.
 */
export function canConfirm(state) {
  return state.remainingPoints === 0 && state.selectedAttribute !== null;
}
export function createDistributionState(packageId, existing = null) {
  const pkg = BACKGROUND_PACKAGES[packageId];
  if (!pkg) throw new Error(`Pacote desconhecido: ${packageId}`);

  if (existing) {
    const allocatedPoints = Object.values(existing.allocations || {}).reduce((a, b) => a + b, 0);
    return {
      packageId,
      totalPoints: pkg.pointsPerPurchase,
      remainingPoints: pkg.pointsPerPurchase - allocatedPoints,
      allocations: { ...existing.allocations },
      selectedAttribute: existing.attributeId ?? null,
    };
  }

  return {
    packageId,
    totalPoints: pkg.pointsPerPurchase,
    remainingPoints: pkg.pointsPerPurchase,
    allocations: {},
    selectedAttribute: null,
  };
}

/**
 * Estado "unificado": um objeto com o estado normal de distribuição por
 * pacote pendente (mesma estrutura de sempre), só que a UI vai somar tudo
 * visualmente — a separação por pacote continua existindo por baixo.
 */
export function createUnifiedDistributionState(pendingEntries) {
  const perPackage = {};
  pendingEntries.forEach(({ instanceIndex, packageId }) => {
    perPackage[instanceIndex] = createDistributionState(packageId);
  });
  return { perPackage };
}

export function getUnifiedSkillTotal(state, skillId) {
  return Object.values(state.perPackage).reduce((sum, s) => sum + (s.allocations[skillId] || 0), 0);
}

export function getUnifiedRemainingPoints(state) {
  return Object.values(state.perPackage).reduce((sum, s) => sum + s.remainingPoints, 0);
}

/**
 * Clique no "+": escolhe automaticamente QUAL pacote pendente absorve o
 * ponto. Só pacotes que (a) permitem essa perícia, (b) ainda têm saldo e
 * (c) não bateram o teto de 2 nessa perícia entram na disputa. Preferência:
 * completar um pacote que já tem 1 ponto nessa perícia antes de abrir outro.
 */
export function incrementUnifiedSkill(state, skillId, pendingEntries) {
  const eligible = pendingEntries
    .filter(({ packageId }) => getValidSkillsForPackage(packageId).includes(skillId))
    .map(({ instanceIndex }) => instanceIndex)
    .filter((idx) => {
      const s = state.perPackage[idx];
      return s.remainingPoints > 0 && (s.allocations[skillId] || 0) < 2;
    });

  if (eligible.length === 0) return state;

  const target = eligible.find((idx) => (state.perPackage[idx].allocations[skillId] || 0) === 1) ?? eligible[0];

  return {
    ...state,
    perPackage: { ...state.perPackage, [target]: incrementSkill(state.perPackage[target], skillId) },
  };
}

/**
 * Clique no "-": tira o ponto do pacote que tem MAIS pontos alocados
 * naquela perícia primeiro (esvazia o "mais cheio" antes do "quase vazio").
 */
export function decrementUnifiedSkill(state, skillId) {
  const holders = Object.entries(state.perPackage).filter(([, s]) => (s.allocations[skillId] || 0) > 0);
  if (holders.length === 0) return state;

  holders.sort((a, b) => (b[1].allocations[skillId] || 0) - (a[1].allocations[skillId] || 0));
  const [targetIdx] = holders[0];

  return {
    ...state,
    perPackage: { ...state.perPackage, [targetIdx]: decrementSkill(state.perPackage[targetIdx], skillId) },
  };
}

export function selectUnifiedAttribute(state, instanceIndex, attributeId) {
  return {
    ...state,
    perPackage: { ...state.perPackage, [instanceIndex]: selectAttribute(state.perPackage[instanceIndex], attributeId) },
  };
}

export function randomizeUnifiedDistribution(state, pendingEntries) {
  const perPackage = { ...state.perPackage };
  pendingEntries.forEach(({ instanceIndex, packageId }) => {
    const validSkills = getValidSkillsForPackage(packageId);
    perPackage[instanceIndex] = randomizeDistribution(perPackage[instanceIndex], validSkills);
  });
  return { ...state, perPackage };
}

export function unifiedCanConfirm(state) {
  return Object.values(state.perPackage).every((s) => canConfirm(s));
}