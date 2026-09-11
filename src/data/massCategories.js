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
// Tabela de Carga (peso bruto → nível de Carga). Absoluta: independe de quem
// está carregando. Nível 11 cobre 500kg–1t (sem teto superior definido no livro).
export const CARGA_TABLE = [
  { level: 1, minKg: 0, maxKg: 2 },
  { level: 2, minKg: 2, maxKg: 5 },
  { level: 3, minKg: 5, maxKg: 10 },
  { level: 4, minKg: 10, maxKg: 20 },
  { level: 5, minKg: 20, maxKg: 35 },
  { level: 6, minKg: 35, maxKg: 50 },
  { level: 7, minKg: 50, maxKg: 75 },
  { level: 8, minKg: 75, maxKg: 100 },
  { level: 9, minKg: 100, maxKg: 200 },
  { level: 10, minKg: 200, maxKg: 500 },
  { level: 11, minKg: 500, maxKg: 1000 },
];

// Faixas Confortável/Pesada/Extrema por Categoria de Massa (peso REAL,
// não a Massa Efetiva rebaixada por Força/Constituição/Resistência).
export const CARGA_BY_MASS = {
  pluma: { comfortable: 2, heavy: 3, extreme: 4 },
  leve: { comfortable: 3, heavy: 4, extreme: 5 },
  medio: { comfortable: 3, heavy: 5, extreme: 6 },
  pesado: { comfortable: 4, heavy: 5, extreme: 6 },
  colosso: { comfortable: 5, heavy: 6, extreme: 7 },
  massivo: { comfortable: 6, heavy: 7, extreme: 8 },
  titanico: { comfortable: 7, heavy: 8, extreme: 9 },
};

// Modificador de Massa pro Movimento (Movimento = Atletismo + Modificador).
// Curva em sino com pico no Médio — usa a Categoria de Massa REAL.
export const MOVEMENT_MASS_MODIFIER = {
  pluma: -1,
  leve: 0,
  medio: 2,
  pesado: 1,
  colosso: -1,
  massivo: -2,
  titanico: -4,
};