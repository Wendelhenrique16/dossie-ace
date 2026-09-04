// src/data/massCategories.js
// Categoria de Massa — definida pelo peso corporal (kg).
// Ordem crescente: índice 0 = mais leve (Pluma), índice 6 = mais pesado (Titânico).
//
// A Massa Efetiva agora tem 3 eixos independentes (Regra da Estrutura Física):
// - damageEffect: modulado por FORÇA (fraqueza REBAIXA o degrau)
// - vigorEffect: modulado por CONSTITUIÇÃO (fraqueza REBAIXA o degrau)
// - staminaEffect / staminaCost: modulado por RESISTÊNCIA (fraqueza ELEVA o degrau — é o único invertido)
// As Vantagens/Desvantagens (estruturais) SEMPRE usam o peso real, nunca são afetadas por esses 3 eixos.

export const MASS_CATEGORIES = [
  {
    id: 'pluma',
    label: 'Pluma',
    maxWeightKg: 55,
    damageEffect: 'Causa apenas metade do Dano Físico base rolado (mín. 1).',
    vigorEffect: 'Reduz o Vigor Máximo em um valor igual à metade da sua Constituição.',
    staminaEffect: 'A primeira ação extra de Movimento ou Esquiva no turno custa 0 Vigor.',
    staminaCost: 0,
    advantage: 'Acesso a espaços confinados. Não aciona placas/pisos frágeis.',
    disadvantage: 'Penalidade imediata de mobilidade com armaduras/armas pesadas.',
  },
  {
    id: 'leve',
    label: 'Leve',
    maxWeightKg: 75,
    damageEffect: 'Dano Padrão.',
    vigorEffect: 'Padrão.',
    staminaEffect: 'Padrão (Ações e reações custam 1 Stamina ou 1 Vigor).',
    staminaCost: 1,
    advantage: 'Proporção padrão do cenário. Camuflagem social.',
    disadvantage: 'Nenhuma.',
  },
  {
    id: 'medio',
    label: 'Médio',
    maxWeightKg: 95,
    damageEffect: 'Dano Padrão.',
    vigorEffect: 'Padrão.',
    staminaEffect: 'Padrão (Ações e reações custam 1 Stamina ou 1 Vigor).',
    staminaCost: 1,
    advantage: 'Proporção padrão do cenário. Camuflagem social.',
    disadvantage: 'Nenhuma.',
  },
  {
    id: 'pesado',
    label: 'Pesado',
    maxWeightKg: 120,
    damageEffect: 'Recebe 1 dado bônus nas rolagens de Dano Físico.',
    vigorEffect: 'Aumenta o Vigor Máximo somando o valor do dado de Constituição uma segunda vez.',
    staminaEffect: 'Ataques físicos e Esquivas custam 2 Stamina (ou 2 Vigor).',
    staminaCost: 2,
    advantage: 'Bônus em Intimidação. Alta tolerância a toxinas/sedativos.',
    disadvantage: 'Quebra estruturas frágeis. Dobro de consumo de suprimentos.',
  },
  {
    id: 'colosso',
    label: 'Colosso',
    maxWeightKg: 250,
    damageEffect: 'O Dano Físico base é dobrado.',
    vigorEffect: 'Aumenta o Vigor Máximo somando o dobro do valor de Constituição.',
    staminaEffect: 'Ataques físicos e Esquivas custam 3 Stamina (ou 3 Vigor).',
    staminaCost: 3,
    advantage: 'Imune a sedativos comuns. Atravessa barreiras finas só andando.',
    disadvantage: 'Incompatível com veículos/itens humanos. Furtividade penalizada.',
  },
  {
    id: 'massivo',
    label: 'Massivo',
    maxWeightKg: 500,
    damageEffect: 'Acertos físicos causam Trauma Direto automaticamente.',
    vigorEffect: 'Escala colossal (ignora os limites humanos).',
    staminaEffect: 'Não utiliza a economia de Stamina padrão.',
    staminaCost: null,
    advantage: 'Destrói estruturas de alvenaria com o próprio deslocamento.',
    disadvantage: 'Inviabilidade total de ambientes civis e armamentos humanos.',
  },
  {
    id: 'titanico',
    label: 'Titânico',
    maxWeightKg: Infinity,
    damageEffect: 'Acertos físicos causam Trauma Direto automaticamente.',
    vigorEffect: 'Escala colossal (ignora os limites humanos).',
    staminaEffect: 'Não utiliza a economia de Stamina padrão.',
    staminaCost: null,
    advantage: 'Destrói estruturas de alvenaria com o próprio deslocamento.',
    disadvantage: 'Inviabilidade total de ambientes civis e armamentos humanos.',
  },
];