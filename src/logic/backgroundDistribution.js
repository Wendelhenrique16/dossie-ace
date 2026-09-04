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