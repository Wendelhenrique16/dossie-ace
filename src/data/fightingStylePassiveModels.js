// src/data/fightingStylePassiveModels.js
// Catálogo de APOIO pras Passivas de Estilo de Luta — cada modelo já vem
// com Efeito(s) nomeado(s) prontos (podendo combinar mais de um, igual
// Habilidade) e um placeholder de Escopo pro jogador substituir.
export const FIGHTING_STYLE_PASSIVE_MODELS = [
  {
    id: 'golpes_mais_rapidos',
    name: 'Golpe Mais Rápido',
    description: 'Torna o golpe escolhido mais rápido de executar, gastando menos ação.',
    names: ['Agilizar'],
    scopePlaceholder: '[tipo de golpe — ex: jabs e cruzados]',
  },
  {
    id: 'golpe_poderoso',
    name: 'Golpe Mais Forte',
    description: 'Torna o golpe escolhido mais forte, rolando o dano duas vezes e ficando com o melhor.',
    names: ['Vantagem'],
    scopePlaceholder: '[golpe específico — ex: cruzado de direita]',
  },
  {
    id: 'sequencia_rapida',
    name: 'Golpe Mais Forte e Rápido',
    description: 'Torna o golpe escolhido mais forte e mais rápido ao mesmo tempo — combina os dois efeitos anteriores.',
    names: ['Vantagem', 'Agilizar'],
    scopePlaceholder: '[golpe específico — ex: combo de socos]',
  },
  {
    id: 'lutador_de_chao',
    name: 'Vantagem em Agarrões',
    description: 'Torna manobras de agarrão ou imobilização mais eficazes.',
    names: ['Amplificar'],
    scopePlaceholder: '[manobras de agarrão ou imobilização]',
  },
  {
    id: 'guarda_solida',
    name: 'Ignorar Penalidade de Defesa',
    description: 'Ignora, por uma cena, uma penalidade acumulada específica ligada à defesa.',
    names: ['Blindar'],
    scopePlaceholder: '[tipo de ataque ou situação a ignorar]',
  },
  {
    id: 'golpe_certeiro',
    name: 'Golpe Sem Falha Crítica',
    description: 'O golpe escolhido nunca sai catastroficamente errado.',
    names: ['Garantir'],
    scopePlaceholder: '[golpe específico]',
  },
  {
    id: 'reacao_perfeita',
    name: 'Defesa Facilitada',
    description: 'Facilita a defesa contra um tipo específico de ataque.',
    names: ['Facilitar'],
    scopePlaceholder: '[tipo de ataque a defender — ex: chutes]',
  },
  {
    id: 'acerto_decisivo',
    name: 'Efeito Colateral Potencializado',
    description: 'Depois de acertar, o efeito colateral do golpe (sangramento, atordoamento) é mais grave — rola o efeito duas vezes e fica com o melhor.',
    names: ['Potencializar'],
    scopePlaceholder: '[golpe ou tipo de dano específico]',
  },
];
