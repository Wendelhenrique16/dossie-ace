// src/logic/traumaSelection.js
import { TRAUMAS } from '../data/traumas';

/**
 * Sorteia N Traumas (Fobia/Mania), sem repetir.
 */
export function rollRandomTraumas(count, excludeIds = []) {
  if (count <= 0) return [];
  const pool = TRAUMAS.filter((t) => !excludeIds.includes(t.id));
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

/**
 * Pool completo pra escolha manual (troca de 1 item).
 */
export function getManualTraumaPool(excludeIds = []) {
  return TRAUMAS.filter((t) => !excludeIds.includes(t.id));
}

export function findTraumaById(id) {
  return TRAUMAS.find((t) => t.id === id) ?? null;
}