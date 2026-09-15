// src/data/fightingStylePassiveModels.js
// Catálogo de APOIO pras Passivas de Estilo de Luta — cada modelo já vem
// com Efeito(s) nomeado(s) prontos (podendo combinar mais de um, igual
// Habilidade) e um placeholder de Escopo pro jogador substituir.

export const FIGHTING_STYLE_PASSIVE_MODELS = [
  {
    id: 'golpes_mais_rapidos',
    name: 'Golpes Mais Rápidos',
    description: 'O golpe específico sai mais rápido, gastando menos ação.',
    names: ['Agilizar'],
    scopePlaceholder: '[tipo de golpe — ex: jabs e cruzados]',
  },
  {
    id: 'golpe_poderoso',
    name: 'Golpe Poderoso',
    description: 'O golpe específico causa mais impacto — vantagem no dano.',
    names: ['Vantagem'],
    scopePlaceholder: '[golpe específico — ex: cruzado de direita]',
  },
  {
    id: 'sequencia_rapida',
    name: 'Sequência Rápida',
    description: 'Combina Golpe Poderoso com velocidade — bater mais vezes, mais forte, no mesmo golpe.',
    names: ['Vantagem', 'Agilizar'],
    scopePlaceholder: '[golpe específico — ex: combo de socos]',
  },
  {
    id: 'lutador_de_chao',
    name: 'Lutador de Chão',
    description: 'Domínio de luta agarrada — vantagem em manobras de imobilização/controle.',
    names: ['Amplificar'],
    scopePlaceholder: '[manobras de agarrão ou imobilização]',
  },
  {
    id: 'guarda_solida',
    name: 'Guarda Sólida',
    description: 'Ignora, por uma cena, uma penalidade acumulada específica ligada à defesa deste Estilo.',
    names: ['Blindar'],
    scopePlaceholder: '[tipo de ataque ou situação a ignorar]',
  },
  {
    id: 'golpe_certeiro',
    name: 'Golpe Certeiro',
    description: 'O golpe específico nunca sai catastroficamente errado.',
    names: ['Garantir'],
    scopePlaceholder: '[golpe específico]',
  },
  {
    id: 'reacao_perfeita',
    name: 'Reação Perfeita',
    description: 'Facilita a defesa contra um tipo específico de ataque.',
    names: ['Facilitar'],
    scopePlaceholder: '[tipo de ataque a defender — ex: chutes]',
  },
  {
    id: 'acerto_decisivo',
    name: 'Acerto Decisivo',
    description: 'Depois de acertar, o efeito colateral (sangramento, atordoamento) é mais grave.',
    names: ['Potencializar'],
    scopePlaceholder: '[golpe ou tipo de dano específico]',
  },
];

/**
 * Cria uma nova entrada de passiva a partir de um modelo — adiciona ao
 * Estilo, não sobrescreve nada existente.
 */
export function createPassiveFromModel(model) {
  return {
    instanceId: `${Date.now()}-${Math.random()}`,
    names: [...model.names],
    weight: Math.max(...model.names.map((n) => 1)), // recalculado de verdade na UI via getEffectWeight
    scope: model.scopePlaceholder,
    description: '',
  };
}