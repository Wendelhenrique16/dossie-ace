// src/data/combatTables.js
// Tabelas do Livro do Jogador e do Mestre usadas nos Parâmetros Físicos.

// Vigor Estrutural (Livro do Mestre). Limiar = metade do Vigor. "Pesado" vale 60 a 80+ no livro.
export const STRUCTURAL_VIGOR = [
  { id: 'fragil', label: 'Frágil / Fino', vigor: 6 },
  { id: 'medio', label: 'Médio / Comum', vigor: 16 },
  { id: 'robusto', label: 'Robusto / Reforçado', vigor: 36 },
  { id: 'pesado', label: 'Pesado / Industrial', vigor: 60 },
];

// Atordoamento por dano contundente (Livro do Jogador): nível de sucesso do ataque
// que engatilha o Teste Reativo, por Categoria de Massa do alvo.
export const STUN_TRIGGER_BY_MASS = {
  pluma: { head: 'Sucesso Bom', body: 'Sucesso Normal' },
  leve: { head: 'Sucesso Bom', body: 'Sucesso Bom' },
  medio: { head: 'Sucesso Bom', body: 'Sucesso Bom' },
  pesado: { head: 'Sucesso Bom', body: 'Sucesso Extremo' },
  colosso: { head: 'Sucesso Extremo', body: 'Sucesso Extremo' },
  massivo: { immune: true },
  titanico: { immune: true },
};

// "O Preço de Continuar" (Livro do Jogador): Vigor perdido por Teste de Fadiga bem-sucedido.
export const FATIGUE_VIGOR_COST = {
  pluma: { intenso: 0, extremo: 1 },
  leve: { intenso: 1, extremo: 2 },
  medio: { intenso: 1, extremo: 2 },
  pesado: { intenso: 2, extremo: 4 },
  colosso: { intenso: 4, extremo: 8 },
  massivo: { intenso: 6, extremo: 12 },
  titanico: { intenso: 10, extremo: 20 },
};

// Escada de Dificuldade do Teste de Fadiga (Livro do Jogador).
export const FATIGUE_DT_LADDER = [11, 16, 21, 26, 31];

// ESTIMATIVA: o livro descreve a margem de turnos apenas de forma qualitativa
// ("quanto maior o nível de Resistência, mais a cobrança demora"). Ajuste aqui.
export function getFatigueMargin(resistenciaLevel) {
  const level = Math.max(0, resistenciaLevel || 0);
  return { intenso: level, extremo: Math.floor(level / 2) };
}

// Colisão e Atropelamento: dados a cada 10 pontos de Movimento, por Categoria de quem colide.
export const COLLISION_DICE = {
  pluma: { count: 1, face: 6, halve: true },
  leve: { count: 1, face: 6 },
  medio: { count: 1, face: 6 },
  pesado: { count: 1, face: 8 },
  colosso: { count: 2, face: 8 },
  massivo: { count: 2, face: 8, directTrauma: true },
  titanico: { count: 2, face: 8, directTrauma: true },
};