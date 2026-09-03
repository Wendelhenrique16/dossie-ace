// src/data/massCategories.js
// Categoria de Massa — definida pelo peso corporal (kg).
// Ordem crescente: índice 0 = mais leve (Pluma), índice 6 = mais pesado (Titânico).
export const MASS_CATEGORIES = [
  {
    id: 'pluma',
    label: 'Pluma',
    maxWeightKg: 55,
    damageModifier: 'half', // metade do dano físico base (mínimo 1)
    damageEffect: 'Causa apenas metade do Dano Físico base rolado (mínimo de 1).',
    advantage: 'Acesso livre a espaços confinados. Não aciona placas de pressão comuns nem quebra pisos/telhados frágeis.',
    disadvantage: 'Sofre desvantagens de mobilidade imediatas ao usar armaduras pesadas e armamentos de grande porte.',
  },
  {
    id: 'leve',
    label: 'Leve',
    maxWeightKg: 75,
    damageModifier: 'normal',
    damageEffect: 'Dano Padrão. Nenhum bônus ou penalidade.',
    advantage: 'Proporção padrão do cenário. Uso livre de equipamentos/veículos. Facilidade para camuflagem e furtividade social.',
    disadvantage: 'Nenhuma.',
  },
  {
    id: 'medio',
    label: 'Médio',
    maxWeightKg: 95,
    damageModifier: 'normal',
    damageEffect: 'Dano Padrão. Nenhum bônus ou penalidade.',
    advantage: 'Proporção padrão do cenário. Uso livre de equipamentos/veículos. Facilidade para camuflagem e furtividade social.',
    disadvantage: 'Nenhuma.',
  },
  {
    id: 'pesado',
    label: 'Pesado',
    maxWeightKg: 120,
    damageModifier: 'bonus_die', // +1 dado bônus no dano físico
    damageEffect: 'Recebe 1 dado bônus nas rolagens de Dano Físico.',
    advantage: 'Bônus em Intimidação por presença física. Alta tolerância metabólica a toxinas, venenos e sedativos padrão.',
    disadvantage: 'Quebra estruturas e mobílias frágeis. Proteções feitas sob medida. Dobro de consumo de suprimentos.',
  },
  {
    id: 'colosso',
    label: 'Colosso',
    maxWeightKg: 250,
    damageModifier: 'double', // dano físico base dobrado
    damageEffect: 'O Dano Físico base calculado é dobrado.',
    advantage: 'Imune a doses padrão de toxinas/sedativos. Atravessa barreiras físicas simples apenas com ação de movimento.',
    disadvantage: 'Incompatível com veículos e assentos comuns. Armaduras sob medida. Furtividade penalizada em pisos suscetíveis a peso.',
  },
  {
    id: 'massivo',
    label: 'Massivo',
    maxWeightKg: 500,
    damageModifier: 'direct_trauma', // todo acerto físico causa Trauma Direto automático
    damageEffect: 'Todos os acertos físicos causam Trauma Direto automaticamente.',
    advantage: 'O simples deslocamento destrói estruturas de alvenaria e barricadas sem rolagem ou gasto de ação.',
    disadvantage: 'Incapaz de manusear armas e painéis comuns. Colapso estrutural automático de pisos comuns. Furtividade interna impossível.',
  },
  {
    id: 'titanico',
    label: 'Titânico',
    maxWeightKg: Infinity,
    damageModifier: 'direct_trauma',
    damageEffect: 'Todos os acertos físicos causam Trauma Direto automaticamente.',
    advantage: 'O simples deslocamento destrói estruturas de alvenaria e barricadas sem rolagem ou gasto de ação.',
    disadvantage: 'Incapaz de manusear armas e painéis comuns. Colapso estrutural automático de pisos comuns. Furtividade interna impossível.',
  },
];