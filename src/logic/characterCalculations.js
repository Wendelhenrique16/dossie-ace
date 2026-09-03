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
 * Massa Efetiva (Regra da Força Mínima): Força baixa rebaixa a categoria
 * usada para Modificadores de Dano/Vantagens de Inércia — mas NÃO afeta
 * as desvantagens estruturais, que seguem sempre o peso real.
 * Força 6+: sem rebaixamento. Força 3-5: cai 1 degrau. Força 0-2: cai 2 degraus (mín. Pluma).
 */
export function getEffectiveMassCategory(weightKg, forcaLevel = 0) {
  const baseCategory = getMassCategory(weightKg);
  const baseIndex = MASS_CATEGORIES.findIndex((c) => c.id === baseCategory.id);

  let degrade = 0;
  if (forcaLevel === 0) degrade = 2;       // sem treino
  else if (forcaLevel === 1) degrade = 1;  // d4
  // nível 2+ (d6 ou mais): degrade = 0

  const effectiveIndex = Math.max(0, baseIndex - degrade);

  return {
    real: baseCategory,
    effective: MASS_CATEGORIES[effectiveIndex],
    wasDowngraded: effectiveIndex < baseIndex,
  };
}