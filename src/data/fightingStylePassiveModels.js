// src/data/fightingStylePassiveModels.js
// Catálogo de APOIO pras Passivas de Estilo de Luta — cada modelo já vem
// com Efeito(s) nomeado(s) e uma Categoria sugerida. O jogador ainda pode
// trocar a Categoria e preencher o Condicional pra reduzir o peso.

export const FIGHTING_STYLE_PASSIVE_MODELS = [
  {
    id: 'golpes_mais_rapidos',
    name: 'Golpe Mais Rápido',
    description: 'Torna o golpe escolhido mais rápido de executar, gastando menos ação.',
    names: ['Agilizar'],
    suggestedCategory: 'Socos',
  },
  {
    id: 'golpe_poderoso',
    name: 'Golpe Mais Forte',
    description: 'Torna o golpe escolhido mais forte, rolando o dano duas vezes e ficando com o melhor.',
    names: ['Vantagem'],
    suggestedCategory: 'Socos',
  },
  {
    id: 'sequencia_rapida',
    name: 'Golpe Mais Forte e Rápido',
    description: 'Torna o golpe escolhido mais forte e mais rápido ao mesmo tempo — combina os dois efeitos anteriores.',
    names: ['Vantagem', 'Agilizar'],
    suggestedCategory: 'Socos',
  },
  {
    id: 'lutador_de_chao',
    name: 'Vantagem em Agarrões',
    description: 'Torna manobras de agarrão ou imobilização mais eficazes.',
    names: ['Amplificar'],
    suggestedCategory: 'Agarrões',
  },
  {
    id: 'guarda_solida',
    name: 'Ignorar Penalidade de Defesa',
    description: 'Ignora, por uma cena, uma penalidade acumulada específica ligada à defesa.',
    names: ['Blindar'],
    suggestedCategory: 'Defesas',
  },
  {
    id: 'golpe_certeiro',
    name: 'Golpe Sem Falha Crítica',
    description: 'O golpe escolhido nunca sai catastroficamente errado.',
    names: ['Garantir'],
    suggestedCategory: 'Socos',
  },
  {
    id: 'reacao_perfeita',
    name: 'Defesa Facilitada',
    description: 'Facilita a defesa contra um tipo específico de ataque.',
    names: ['Facilitar'],
    suggestedCategory: 'Defesas',
  },
  {
    id: 'acerto_decisivo',
    name: 'Efeito Colateral Potencializado',
    description: 'Depois de acertar, o efeito colateral do golpe (sangramento, atordoamento) é mais grave — rola o efeito duas vezes e fica com o melhor.',
    names: ['Potencializar'],
    suggestedCategory: 'Socos',
  },
];

/**
 * Cria uma nova entrada de passiva a partir de um modelo — adiciona ao
 * Estilo, não sobrescreve nada existente. O peso é recalculado de verdade
 * (sem Condicional) via getEffectWeight, chamado pela UI depois.
 */
export function createPassiveFromModel(model) {
  return {
    instanceId: `${Date.now()}-${Math.random()}`,
    names: [...model.names],
    weight: 1, // corrigido pela UI logo após criar, via getEffectWeight
    category: model.suggestedCategory,
    conditional: null,
    description: '',
  };
}