// src/logic/occupationBonuses.js
// Aplica os bônus mecânicos de Ocupação Primária + Secundária (RN-08 / RN-11).

import { OCCUPATION_CATEGORIES, OCCUPATION_BONUSES } from '../data/occupations';

/**
 * Calcula os bônus finais de perícia e atributo a partir das categorias
 * escolhidas como Primária e Secundária.
 *
 * @param {string} primaryId - id da categoria primária
 * @param {string} secondaryId - id da categoria secundária
 * @param {string} [freeAttributeChoice] - atributo escolhido livremente p/ a Secundária
 * @returns {{ skillBonuses: Record<string, number>, attributeBonuses: Record<string, number> }}
 */
export function calculateOccupationBonuses(primaryId, secondaryId, freeAttributeChoice) {
  const primary = OCCUPATION_CATEGORIES[primaryId];
  const secondary = OCCUPATION_CATEGORIES[secondaryId];
  if (!primary || !secondary) {
    throw new Error('Categoria de ocupação inválida.');
  }

  const skillBonuses = {};
  const attributeBonuses = {};

  // Primária: +5 em cada perícia listada, +2 no atributo da própria categoria
  primary.skills.forEach((skillId) => {
    skillBonuses[skillId] = (skillBonuses[skillId] || 0) + OCCUPATION_BONUSES.primary.skillBonus;
  });
  if (primary.attribute) {
    attributeBonuses[primary.attribute] =
      (attributeBonuses[primary.attribute] || 0) + OCCUPATION_BONUSES.primary.attributeBonus;
  }

  // Secundária: +3 em cada perícia listada, +1 em atributo livre à escolha
  secondary.skills.forEach((skillId) => {
    skillBonuses[skillId] = (skillBonuses[skillId] || 0) + OCCUPATION_BONUSES.secondary.skillBonus;
  });
  if (freeAttributeChoice) {
    attributeBonuses[freeAttributeChoice] =
      (attributeBonuses[freeAttributeChoice] || 0) + OCCUPATION_BONUSES.secondary.attributeBonus;
  }

  // Nota: a soma de +5 e +3 numa mesma perícia repetida já resulta em +8
  // naturalmente pela soma acima — não é necessário tratamento especial,
  // mas deixamos OCCUPATION_BONUSES.overlapBonus documentado como referência/checagem.

  return { skillBonuses, attributeBonuses };
}

/**
 * Retorna a lista de categorias disponíveis para exibir no select de Ocupação,
 * excluindo "vagabundo" da lista de combináveis (é uma opção isolada).
 */
export function listSelectableOccupations() {
  return Object.entries(OCCUPATION_CATEGORIES)
    .filter(([id]) => id !== 'vagabundo')
    .map(([id, data]) => ({ id, ...data }));
}