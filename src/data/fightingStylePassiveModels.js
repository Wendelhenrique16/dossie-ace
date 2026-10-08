// src/data/fightingStylePassiveModels.js
export const FIGHTING_STYLE_PASSIVE_MODELS = [
  {
    id: 'golpes_mais_rapidos',
    name: 'Golpe Mais Rápido',
    description: 'O golpe escolhido gasta 1 ação a menos.',
    names: ['Agilizar'],
    suggestedCategory: 'Socos',
  },
  {
    id: 'golpe_poderoso',
    name: 'Golpe Mais Certeiro',
    description: 'O ataque do golpe escolhido é rolado duas vezes, ficando com o melhor resultado.',
    names: ['Vantagem'],
    suggestedCategory: 'Socos',
  },
  {
    id: 'sequencia_rapida',
    name: 'Golpe Mais Certeiro e Rápido',
    description: 'O ataque é rolado duas vezes, ficando com o melhor resultado, e o golpe gasta 1 ação a menos.',
    names: ['Vantagem', 'Agilizar'],
    suggestedCategory: 'Socos',
  },
  {
    id: 'lutador_de_chao',
    name: 'Agarrão Mais Eficaz',
    description: 'Um Sucesso normal numa manobra de agarrão ou imobilização é tratado como Sucesso Bom.',
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
    description: 'O golpe escolhido nunca sai com o pior resultado possível.',
    names: ['Garantir'],
    suggestedCategory: 'Socos',
  },
  {
    id: 'reacao_perfeita',
    name: 'Defesa Mais Firme',
    description: 'Um Sucesso normal na defesa é tratado como Sucesso Bom.',
    names: ['Amplificar'],
    suggestedCategory: 'Defesas',
  },
  {
    id: 'acerto_decisivo',
    name: 'Golpe Mais Forte',
    description: 'Depois de acertar, o dano do golpe é rolado duas vezes, ficando com o maior resultado.',
    names: ['Potencializar'],
    suggestedCategory: 'Socos',
  },
];

export function createPassiveFromModel(model) {
  return {
    instanceId: `${Date.now()}-${Math.random()}`,
    names: [...model.names],
    weight: 1, // corrigido pela UI logo após criar, via getEffectWeight
    category: model.suggestedCategory,
    conditional: null,
    description: model.description ?? '',
  };
}