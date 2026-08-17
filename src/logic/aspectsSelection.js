// src/logic/aspectsSelection.js
// Sorteio (com opção de escolha manual) dos aspectos obrigatórios por idade,
// e seleção livre de aspectos positivos/negativos adicionais.

import {
  POSITIVE_ASPECTS,
  NEGATIVE_ASPECTS,
  getAgeTaggedNegativeAspects,
  MANDATORY_AGE_ASPECTS_COUNT,
} from '../data/aspects';

/**
 * Sorteia N aspectos negativos [IDADE], sem repetir, com base na Fase da Vida.
 */
export function rollMandatoryAgeAspects(lifeStageId, excludeIds = []) {
  const count = MANDATORY_AGE_ASPECTS_COUNT[lifeStageId] ?? 0;
  if (count === 0) return [];

  const pool = getAgeTaggedNegativeAspects().filter((a) => !excludeIds.includes(a.id));
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

/**
 * Troca um aspecto sorteado por outro da mesma lista (re-sortear 1 item),
 * ou permite escolha manual retornando o pool completo para o jogador escolher.
 */
export function getManualAgeAspectPool(excludeIds = []) {
  return getAgeTaggedNegativeAspects().filter((a) => !excludeIds.includes(a.id));
}

export function findAspectById(id) {
  return (
    POSITIVE_ASPECTS.find((a) => a.id === id) || NEGATIVE_ASPECTS.find((a) => a.id === id) || null
  );
}

export function listAllPositive() {
  return POSITIVE_ASPECTS;
}

export function listAllNegative() {
  return NEGATIVE_ASPECTS;
}