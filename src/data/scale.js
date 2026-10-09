// src/data/scale.js
// Escala (Livro do Jogador / Livro do Mestre).

export const SCALE_LEVELS = [
  { value: -1, label: '¼ do padrão humano' },
  { value: 0, label: 'metade do padrão humano' },
  { value: 1, label: 'padrão humano' },
  { value: 2, label: '~2x' },
  { value: 3, label: '~4x' },
  { value: 4, label: '~8x' },
  { value: 5, label: '~16x' },
];

export const SCALE_MAX = 5;

// Escala Geral -> total de Modificadores de Escala pra distribuir entre Perícias.
export const SCALE_MODIFIERS_BY_GENERAL = { 1: 0, 2: 2, 3: 4, 4: 8, 5: 16 };

// Escala 0 ou -1 em personagem de jogador: até 3 categorias de Perícia (com permissão do Mestre).
export const MAX_WEAK_CATEGORIES_FOR_PLAYER = 3;

export function getScaleLabel(value) {
  return SCALE_LEVELS.find((l) => l.value === value)?.label ?? '';
}