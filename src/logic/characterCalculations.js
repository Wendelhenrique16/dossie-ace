// src/logic/characterCalculations.js
// Funções puras (sem estado, sem I/O) — fáceis de testar isoladamente antes
// de existir qualquer tela. Import de dados vem de ../data/*.

import { SKILL_LEVEL_TO_DICE } from '../data/skills';

/**
 * Rola um dado de N lados.
 */
export function rollDie(sides) {
  return Math.floor(Math.random() * sides) + 1;
}

/**
 * Resolve o teste de uma perícia baseado no nível (0-9+).
 * Níveis 7-9 têm notação composta (ex: "3d8/6d4") — por regra narrativa,
 * o jogador escolhe qual das duas rolagens usar antes de rolar
 * (normalmente a de maior valor esperado, mas isso é decisão de mesa).
 * Nível 9+ = vantagem: rola duas vezes o dado do nível 9 e fica com o maior.
 */
export function rollSkillTest(skillLevel) {
  const clampedLevel = Math.max(0, Math.min(skillLevel, 9));

  if (clampedLevel === 0) {
    // Nível 0 = d00 (sempre em desvantagem: rola dois d100/d20 e fica com o pior — regra de mesa)
    return { level: 0, dice: 'd00', result: null, note: 'Sem treino: aplicar desvantagem.' };
  }

  if (clampedLevel <= 6) {
    const sidesMap = { 1: 4, 2: 6, 3: 8, 4: 10, 5: 12, 6: 20 };
    const sides = sidesMap[clampedLevel];
    return { level: clampedLevel, dice: `d${sides}`, result: rollDie(sides) };
  }

  // Níveis 7, 8, 9 possuem notação composta — retornamos os dois resultados
  // possíveis e deixamos a escolha para a camada de UI/regra de mesa.
  const compositeRolls = {
    7: () => ({ optionA: rollDie(20), optionB: sumDice(5, 4) }),
    8: () => ({ optionA: sumDice(3, 8), optionB: sumDice(6, 4) }),
    9: () => ({ optionA: sumDice(3, 8) + rollDie(4), optionB: sumDice(7, 4) }),
  };

  return {
    level: clampedLevel,
    dice: SKILL_LEVEL_TO_DICE[clampedLevel],
    result: compositeRolls[clampedLevel](),
  };
}

/**
 * Nível 9+ = vantagem (rola duas vezes, fica com o maior).
 */
export function rollWithAdvantage(rollFn) {
  const a = rollFn();
  const b = rollFn();
  return Math.max(a, b);
}

function sumDice(count, sides) {
  let total = 0;
  for (let i = 0; i < count; i++) total += rollDie(sides);
  return total;
}

/**
 * Custo em Sanidade ao comprar um pacote de antecedentes extra (RN-07): 1d6+6.
 */
export function rollExtraPackageSanityCost() {
  return rollDie(6) + 6;
}

/**
 * Calcula Força máxima em kg (1 ponto de Força = 10kg).
 */
export function calculateMaxCarryWeightKg(forcaLevel) {
  return forcaLevel * 10;
}

/**
 * Cada ponto em Resistência = +1 ação em esforço extremo e +1 no contador
 * de cansaço máximo.
 */
export function calculateStaminaFromResistencia(resistenciaLevel) {
  return {
    extremeEffortActions: resistenciaLevel,
    maxFatigueCounter: resistenciaLevel,
  };
}

/**
 * A cada 5 pontos em Prontidão, +1 reação por turno. 15+ concede uma ação
 * adicional.
 */
export function calculateReactionsFromProntidao(prontidaoLevel) {
  const reactions = Math.floor(prontidaoLevel / 5);
  return {
    reactionsPerTurn: reactions,
    bonusAction: prontidaoLevel >= 15,
  };
}

/**
 * Investigação: a partir de 5 pontos, cada ponto reduz o tempo de análise
 * de ambientes/situações complexas. Retorna um multiplicador de tempo
 * (1 = tempo normal, menor = mais rápido). A curva exata é decisão de
 * mesa/produto — aqui usamos uma redução linear simples como base.
 */
export function calculateInvestigationTimeMultiplier(investigacaoLevel) {
  if (investigacaoLevel < 5) return 1;
  const reduction = (investigacaoLevel - 4) * 0.05; // 5% por ponto acima de 4
  return Math.max(0.2, 1 - reduction); // nunca abaixo de 20% do tempo original
}

/**
 * Determina se um personagem, ao ultrapassar 12 pacotes de antecedentes,
 * entra no estado "A Beira da Loucura" (Sanidade Máxima = 1 permanente).
 */
export function checkBrokenSanityState(totalPackages, hardLimit = 12) {
  return totalPackages > hardLimit;
}

/**
 * Valor máximo de face de um dado pelo nível de perícia (0-9+).
 * Usado pra calcular o Vigor (Resistência + Constituição).
 * Níveis 7-9 usam a maior face das notações compostas do livro.
 */
export function getSkillDieMaxValue(level) {
  const table = { 0: 0, 1: 4, 2: 6, 3: 8, 4: 10, 5: 12, 6: 20, 7: 20, 8: 24, 9: 28 };
  return table[Math.max(0, Math.min(level, 9))] ?? 0;
}

/**
 * Vigor = dado máximo de Resistência + dado máximo de Constituição.
 * Ex: Resistência nível 3 (d8) + Constituição nível 5 (d12) = 8 + 12 = 20.
 */
export function calculateVigor(resistenciaLevel, constituicaoLevel) {
  return getSkillDieMaxValue(resistenciaLevel) + getSkillDieMaxValue(constituicaoLevel);
}

/**
 * Determina os Níveis de Sucesso de um teste, comparando o resultado
 * contra a Dificuldade (DT) base e seus incrementos.
 * Ordem: Falha crítica | Falha | Normal | Sucesso Bom | Sucesso Extremo
 */
export function resolveSuccessLevel(rollTotal, dtBase = 21) {
  if (rollTotal < dtBase - 10) return 'falha_critica';
  if (rollTotal < dtBase) return 'falha';
  if (rollTotal < dtBase + 5) return 'normal';
  if (rollTotal < dtBase + 10) return 'sucesso_bom';
  return 'sucesso_extremo';
}

import { MASS_CATEGORIES } from '../data/massCategories';

/**
 * Categoria de Massa baseada no peso corporal (kg).
 */
export function getMassCategory(weightKg) {
  return MASS_CATEGORIES.find((cat) => weightKg <= cat.maxWeightKg) ?? MASS_CATEGORIES[MASS_CATEGORIES.length - 1];
}
/**
 * Fraqueza REBAIXA o degrau (usado por Força→Dano e Constituição→Vigor).
 * Nível 0 (sem treino): cai 2. Nível 1 (d4): cai 1. Nível 2+ (d6+): cai 0.
 */
function degradeStepsFromLevel(level) {
  if (level >= 2) return 0;
  if (level === 1) return 1;
  return 2;
}

/**
 * Fraqueza ELEVA o degrau (usado por Resistência→Stamina — é o único invertido).
 * Nível 0: sobe 2. Nível 1 (d4): sobe 1. Nível 2+ (d6+): sobe 0.
 */
function elevateStepsFromLevel(level) {
  if (level >= 2) return 0;
  if (level === 1) return 1;
  return 2;
}

function shiftCategoryIndex(baseIndex, steps, direction) {
  const shifted = direction === 'down' ? baseIndex - steps : baseIndex + steps;
  return Math.max(0, Math.min(MASS_CATEGORIES.length - 1, shifted));
}

/**
 * Massa Efetiva (Regra da Estrutura Física): 3 eixos independentes.
 * As Vantagens/Desvantagens (estruturais) sempre usam a categoria REAL (peso puro).
 */
export function getEffectiveMassCategory(weightKg, { forcaLevel = 0, constituicaoLevel = 0, resistenciaLevel = 0 } = {}) {
  const realCategory = getMassCategory(weightKg);
  const baseIndex = MASS_CATEGORIES.findIndex((c) => c.id === realCategory.id);

  const damageIndex = shiftCategoryIndex(baseIndex, degradeStepsFromLevel(forcaLevel), 'down');
  const vigorIndex = shiftCategoryIndex(baseIndex, degradeStepsFromLevel(constituicaoLevel), 'down');
  const staminaIndex = shiftCategoryIndex(baseIndex, elevateStepsFromLevel(resistenciaLevel), 'up');

  return {
    real: realCategory,
    damage: { category: MASS_CATEGORIES[damageIndex], wasChanged: damageIndex !== baseIndex },
    vigor: { category: MASS_CATEGORIES[vigorIndex], wasChanged: vigorIndex !== baseIndex },
    stamina: { category: MASS_CATEGORIES[staminaIndex], wasChanged: staminaIndex !== baseIndex },
  };
}

/**
 * Sanidade Máxima agora é DERIVADA, não um valor fixo salvo no personagem.
 * Isso permite remover um pacote comprado sem "travar" o desconto: o
 * cálculo sempre soma o sanityCost apenas das entradas que estão em
 * posição >= freePackages no momento atual (recalcula sozinho ao remover).
 */
export function calculateMaxSanity(purchasedBackgrounds, freePackages, hardLimit = 12) {
  if (purchasedBackgrounds.length > hardLimit) return 1; // A Beira da Loucura

  let total = 100;
  purchasedBackgrounds.forEach((entry, index) => {
    if (index >= freePackages) total -= entry.sanityCost || 0;
  });
  return Math.max(1, total);
}

/**
 * Sorteia quais atributos serão cortados pela metade ao escolher Maduro
 * (Penalidade de Idade). Sem repetição.
 */
export function rollAgingPenaltyAttributes(eligibleAttributes, count) {
  const pool = [...eligibleAttributes];
  const picked = [];
  while (picked.length < count && pool.length > 0) {
    const idx = Math.floor(Math.random() * pool.length);
    picked.push(pool.splice(idx, 1)[0]);
  }
  return picked;
}

/**
 * Dano Físico base: (Existência + dado de Força + dado de Combate) / 3,
 * dividido por 2 de novo se o personagem for Lutador. Usa o DADO (valor
 * máximo da face), não o nível da perícia.
 */
export function calculatePhysicalDamageBase(existenciaValue, forcaLevel, combateLevel, isLutador = false) {
  const forcaDie = getSkillDieMaxValue(forcaLevel);
  const combateDie = getSkillDieMaxValue(combateLevel);
  let base = (existenciaValue + forcaDie + combateDie) / 3;
  if (isLutador) base /= 2;
  return base;
}

/**
 * Aplica o modificador de Dano da Categoria de Massa EFETIVA (já rebaixada
 * por Força). Massivo/Titânico não geram um número — viram Trauma Direto
 * automático, então value fica null e quem exibe trata isso à parte.
 */
/**
 * Aplica o modificador de Dano da Categoria de Massa EFETIVA. Retorna a
 * notação de dado (quantidade + face), não um número cru — porque "Pesado"
 * não soma valor, ele rola 2 dados do mesmo tipo (ex: 2d8), e os demais
 * viram um único dado maior (ex: d10 vira d12 no Colosso).
 */
export function applyMassDamageModifier(baseDamage, massCategoryId) {
  const baseDie = roundToNearestDie(baseDamage);

  switch (massCategoryId) {
    case 'pluma': {
      const halvedDie = Math.max(2, roundToNearestDie(baseDamage / 2));
      return { diceCount: 1, dieFace: halvedDie, note: 'Metade do Dano Físico, arredondado pro dado mais próximo (mín. d2)' };
    }
    case 'pesado':
      return { diceCount: 2, dieFace: baseDie, note: 'Dado bônus: rola 2 dados do mesmo tipo em vez de 1' };
    case 'colosso': {
      const doubledDie = roundToNearestDie(baseDamage * 2);
      return { diceCount: 1, dieFace: doubledDie, note: 'Dano dobrado, arredondado pro dado mais próximo' };
    }
    case 'massivo':
    case 'titanico':
      return { diceCount: 0, dieFace: null, note: 'Trauma Direto automático — ignora o cálculo padrão' };
    default: // leve, medio
      return { diceCount: 1, dieFace: baseDie, note: null };
  }
}
export const STANDARD_DICE_FACES = [2, 4, 6, 8, 10, 12, 20, 24, 28];

/**
 * Arredonda um valor de dano pro dado padrão mais próximo (não existe d5,
 * d7 etc — só os dados que realmente existem no sistema).
 */
export function roundToNearestDie(value) {
  return STANDARD_DICE_FACES.reduce((closest, face) =>
    Math.abs(face - value) < Math.abs(closest - value) ? face : closest
  );
}
/**
 * Aplica o modificador de Vigor da Categoria de Massa EFETIVA (já rebaixada
 * por Constituição), usando o dado de Constituição pra somar/subtrair.
 */
export function applyMassVigorModifier(baseVigor, massCategoryId, constituicaoLevel) {
  const constituicaoDie = getSkillDieMaxValue(constituicaoLevel);
  switch (massCategoryId) {
    case 'pluma':
      return { value: Math.max(0, baseVigor - Math.floor(constituicaoDie / 2)), note: null };
    case 'pesado':
      return { value: baseVigor + constituicaoDie, note: null };
    case 'colosso':
      return { value: baseVigor + constituicaoDie * 2, note: null };
    case 'massivo':
    case 'titanico':
      return { value: baseVigor, note: 'Escala colossal — valor de referência, ajustar por mesa' };
    default: // leve, medio
      return { value: baseVigor, note: null };
  }
}