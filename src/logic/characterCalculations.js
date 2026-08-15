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
 * Determina se um personagem, ao ultrapassar 12 pacotes de antecedentes,
 * entra no estado "A Beira da Loucura" (Sanidade Máxima = 1 permanente).
 */
export function checkBrokenSanityState(totalPackages, hardLimit = 12) {
  return totalPackages > hardLimit;
}

