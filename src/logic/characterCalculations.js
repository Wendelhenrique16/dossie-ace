// src/logic/characterCalculations.js
// Funções puras (sem estado, sem I/O) — fáceis de testar isoladamente antes
// de existir qualquer tela. Import de dados vem de ../data/*.

import { SKILL_LEVEL_TO_DICE } from '../data/skills';
import { getEffectWeight, EFFECT_DEFINITIONS } from '../data/abilities';
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
export function getEffectiveMassCategory(weightKg, { forcaLevel = 0, constituicaoLevel = 0, resistenciaLevel = 0, archetypeShifts = {} } = {}) {
  const realCategory = getMassCategory(weightKg);
  const baseIndex = MASS_CATEGORIES.findIndex((c) => c.id === realCategory.id);
  const clamp = (i) => Math.max(0, Math.min(MASS_CATEGORIES.length - 1, i));

  const damagePreArch = shiftCategoryIndex(baseIndex, degradeStepsFromLevel(forcaLevel), 'down');
  const vigorPreArch = shiftCategoryIndex(baseIndex, degradeStepsFromLevel(constituicaoLevel), 'down');
  const staminaPreArch = shiftCategoryIndex(baseIndex, elevateStepsFromLevel(resistenciaLevel), 'up');

  const damageIndex = clamp(damagePreArch + (archetypeShifts.damage || 0));
  const vigorIndex = clamp(vigorPreArch + (archetypeShifts.vigor || 0));
  const staminaIndex = clamp(staminaPreArch + (archetypeShifts.stamina || 0));

  return {
    real: realCategory,
    damage: {
      category: MASS_CATEGORIES[damageIndex],
      wasDegraded: damagePreArch < baseIndex,
      wasBoostedByArchetype: damageIndex > damagePreArch,
    },
    vigor: {
      category: MASS_CATEGORIES[vigorIndex],
      wasDegraded: vigorPreArch < baseIndex,
      wasBoostedByArchetype: vigorIndex > vigorPreArch,
    },
    stamina: {
      category: MASS_CATEGORIES[staminaIndex],
      wasElevatedByWeakness: staminaPreArch > baseIndex,
      wasReducedByArchetype: staminaIndex < staminaPreArch,
    },
  };
}

/**
 * Sanidade Máxima agora é DERIVADA, não um valor fixo salvo no personagem.
 * Isso permite remover um pacote comprado sem "travar" o desconto: o
 * cálculo sempre soma o sanityCost apenas das entradas que estão em
 * posição >= freePackages no momento atual (recalcula sozinho ao remover).
 */
export function calculateMaxSanity(purchasedBackgrounds, freePackages, hardLimit = 12, selectedAbilities = []) {
  if (purchasedBackgrounds.length > hardLimit) return 1; // A Beira da Loucura

  let total = 100;
  purchasedBackgrounds.forEach((entry, index) => {
    if (index >= freePackages) total -= entry.sanityCost || 0;
  });
  // Livro: cada Habilidade comprada custa d6+6 de Sanidade Máxima (valor guardado na compra).
  selectedAbilities.forEach((ability) => {
    total -= ability.sanityCost || 0;
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

// Escada de dados do Dano Físico (livro): d4, d6, d8, d10, d12, d20, 3d8 (=24).
export const DAMAGE_DICE_LADDER = [
  { value: 4, diceCount: 1, dieFace: 4 },
  { value: 6, diceCount: 1, dieFace: 6 },
  { value: 8, diceCount: 1, dieFace: 8 },
  { value: 10, diceCount: 1, dieFace: 10 },
  { value: 12, diceCount: 1, dieFace: 12 },
  { value: 20, diceCount: 1, dieFace: 20 },
  { value: 24, diceCount: 3, dieFace: 8 },
];

// Dado mais próximo; empate exato entre dois dados usa o maior.
export function roundToDamageDie(value) {
  return DAMAGE_DICE_LADDER.reduce((best, step) => {
    const diff = Math.abs(step.value - value);
    const bestDiff = Math.abs(best.value - value);
    return diff < bestDiff || (diff === bestDiff && step.value > best.value) ? step : best;
  });
}

/** Dano Físico base = (Existência + dado de Força + dado de Combate) / 3. */
export function calculatePhysicalDamageBase(existenciaValue, forcaLevel, combateLevel) {
  return (existenciaValue + getSkillDieMaxValue(forcaLevel) + getSkillDieMaxValue(combateLevel)) / 3;
}

/**
 * Modificador de Dano da Massa EFETIVA. Retorna dados + multiplicador/divisor
 * aplicados ao RESULTADO rolado (Pluma ÷2 mín. 1 arred. pra cima; Colosso ×2).
 */
export function applyMassDamageModifier(baseDamage, massCategoryId) {
  const base = roundToDamageDie(baseDamage);
  const result = { diceCount: base.diceCount, dieFace: base.dieFace, multiplier: 1, divisor: 1, note: null };

  switch (massCategoryId) {
    case 'pluma':
      return { ...result, divisor: 2, note: 'Metade do Dano Físico base rolado (mín. 1, arredondado pra cima)' };
    case 'pesado':
      return { ...result, diceCount: base.diceCount + 1, note: 'Dado bônus: +1 dado do mesmo tipo' };
    case 'colosso':
      return { ...result, multiplier: 2, note: 'Dano Físico base dobrado' };
    case 'massivo':
    case 'titanico':
      return { diceCount: 0, dieFace: null, multiplier: 1, divisor: 1, note: 'Trauma Direto automático — ignora o cálculo padrão' };
    default: // leve, medio
      return result;
  }
}

export function formatPhysicalDamage(damage) {
  if (!damage) return '—';
  if (damage.diceCount === 0) return 'Trauma Direto automático';
  const dice = `${damage.diceCount}d${damage.dieFace}`;
  if (damage.multiplier > 1) return `${dice} × ${damage.multiplier}`;
  if (damage.divisor > 1) return `${dice} ÷ ${damage.divisor} (mín. 1)`;
  return dice;
}

/**
 * Vigor Máximo = Vigor Base da Categoria de Vigor (já rebaixada pela
 * Constituição e ajustada por Arquétipo) + dado de Resistência + dado de Constituição.
 */
export function calculateMaxVigor(vigorCategory, resistenciaLevel, constituicaoLevel) {
  return (vigorCategory?.vigorBase ?? 0)
    + getSkillDieMaxValue(resistenciaLevel)
    + getSkillDieMaxValue(constituicaoLevel);
}
import {CARGA_TABLE, CARGA_BY_MASS, MOVEMENT_MASS_MODIFIER } from '../data/massCategories';
// (junta com o import de MASS_CATEGORIES que já existe — só adicionar os 3 novos nomes)

/**
 * Força desloca a LEITURA da tabela de Carga em degraus (não muda a Categoria
 * de Massa em si, só qual linha da tabela Confortável/Pesada/Extrema é lida).
 */


function getCargaLevelInfo(level) {
  const entry = CARGA_TABLE.find((c) => c.level === level);
  return entry ? { level, minKg: entry.minKg, maxKg: entry.maxKg } : null;
}

/**
 * Limites de Carga (Confortável/Pesada/Extrema) pro peso e Força do personagem.
 * Usa a Categoria de Massa REAL (peso puro) como linha-base, deslocada pelo
 * degrau de Força — igual ao exemplo do livro (Médio + Força 12 = lê como Colosso).
 *//**
 * Recebe o NÚMERO de Força (não o nível bruto) — as faixas 0/1-5/6-10/...
 * do livro são sobre essa escala.
 */
function forcaCargaShiftSteps(forcaValue) {
  if (forcaValue === 0) return -1;
  if (forcaValue <= 5) return 0;
  if (forcaValue <= 10) return 1;
  if (forcaValue <= 15) return 2;
  if (forcaValue <= 20) return 3;
  return 4;
}

export function calculateCargaLimits(weightKg, forcaLevel) {
  const forcaValue = getSkillDieMaxValue(forcaLevel); // conversão que faltava
  const realCategory = getMassCategory(weightKg);
  const baseIndex = MASS_CATEGORIES.findIndex((c) => c.id === realCategory.id);
  const shift = forcaCargaShiftSteps(forcaValue);
  const shiftedIndex = Math.max(0, Math.min(MASS_CATEGORIES.length - 1, baseIndex + shift));
  const effectiveCategory = MASS_CATEGORIES[shiftedIndex];
  const row = CARGA_BY_MASS[effectiveCategory.id];

  return {
    realCategory,
    effectiveCategory,
    wasShifted: shiftedIndex !== baseIndex,
    shiftDirection: shiftedIndex > baseIndex ? 'up' : shiftedIndex < baseIndex ? 'down' : null,
    comfortable: { cargaLevel: row.comfortable, ...getCargaLevelInfo(row.comfortable) },
    heavy: { cargaLevel: row.heavy, ...getCargaLevelInfo(row.heavy) },
    extreme: { cargaLevel: row.extreme, ...getCargaLevelInfo(row.extreme) },
  };
}

/**
 * Movimento = Atletismo + Modificador de Massa (peso REAL, sem multiplicador
 * — o "1 ponto = 1,5m" é só nota de referência de Mestre, nunca aparece na ficha).
 * Atletismo 0 = incapaz (Movimento 0).
 */
const METERS_PER_MOVEMENT_POINT = 1.5;
const TURN_DURATION_SECONDS = 6;

function metersPerTurnToKmH(metersPerTurn) {
  return Number(((metersPerTurn / TURN_DURATION_SECONDS) * 3.6).toFixed(1));
}

/**
 * Movimento = Atletismo + Modificador de Massa (peso REAL). Atletismo 0 =
 * incapaz. Também traduz pontos em metros/turno e km/h — 1 ponto = 1,5m
 * a cada turno de 6s (fórmula de referência, não afeta o valor em pontos).
 * Esforço Extremo ainda não tem multiplicador definido no livro — fica de
 * fora até isso ser fechado.
 */
/**
 * Movimento = Atletismo + Modificador de Massa. "Atletismo" aqui é o NÚMERO
 * da perícia (valor de face do dado, 0-28 — a mesma escala do livro em
 * "O que os números querem dizer"), não o nível bruto 0-9.
 */
export function calculateMovement(atletismoLevel, weightKg) {
  const atletismoValue = getSkillDieMaxValue(atletismoLevel);

  if (!atletismoValue || atletismoValue <= 0) {
    return {
      value: 0, modifier: null, massCategoryLabel: null,
      andar: null, correr: null, sprint: null,
      note: 'Atletismo 0: incapaz de se mover com eficiência.',
    };
  }
  const massCategory = getMassCategory(weightKg);
  const modifier = MOVEMENT_MASS_MODIFIER[massCategory.id] ?? 0;
  const value = Math.max(0, atletismoValue + modifier);

  const toRitmo = (points) => {
    const metersPerTurn = points * METERS_PER_MOVEMENT_POINT;
    return { points, metersPerTurn, kmh: metersPerTurnToKmH(metersPerTurn) };
  };

  return {
    value,
    modifier,
    massCategoryLabel: massCategory.label,
    andar: toRitmo(Math.ceil(value / 2)), // Esforço Leve
    correr: toRitmo(value),               // Esforço Intenso
    sprint: toRitmo(value * 2),           // Esforço Extremo
    note: null,
  };
}

import {
  BONUS_TABLE_DICE_FACES, BONUS_TABLE_CAP_FACE, DICE_BONUS_AXES,
  POSTURE_LEVEL_THRESHOLDS, POSTURE_EFFECTS, PASSIVE_POINTS_PER_UNLOCK,
  MAX_SINGLE_PASSIVE_WEIGHT, ARTISTA_MARCIAL_ARCHETYPE_ID,
  EXCLUDED_PASSIVE_EFFECTS, SIGNATURE_POINTS_PER_MOVE,
} from '../data/fightingStyles';

/**
 * Tabela de Bônus universal: pontos investidos → face do dado bônus.
 * 0 pontos = sem bônus. 6+ pontos trava em d20 (BONUS_TABLE_CAP_FACE).
 */
export function getBonusDieFace(points) {
  if (!points || points <= 0) return null;
  if (points >= 6) return BONUS_TABLE_CAP_FACE;
  return BONUS_TABLE_DICE_FACES[points] ?? null;
}

/**
 * Pontos totais de Estilo de Luta = NÍVEL bruto (0-9) da perícia Combate,
 * dobrado se o Arquétipo for Artista Marcial. É moeda de investimento,
 * não um efeito mecânico direto — por isso usa o nível, não o valor do dado.
 */
export function calculateFightingStylePoints(combateSkillLevel, archetypeId) {
  const base = Math.max(0, combateSkillLevel || 0);
  return archetypeId === ARTISTA_MARCIAL_ARCHETYPE_ID ? base * 2 : base;
}

/**
 * Nível de Postura atingido pelos pontos investidos (0, 1 ou 2), pelo
 * custo escalonado: Nível 1 = 1 ponto, Nível 2 = 3 pontos total.
 */
export function getPostureLevel(points) {
  if (points >= POSTURE_LEVEL_THRESHOLDS[2]) return 2;
  if (points >= POSTURE_LEVEL_THRESHOLDS[1]) return 1;
  return 0;
}

/**
 * Soma os pontos investidos num único Estilo (Eixos + Postura Ofensiva + Postura Defensiva).
 */
export function calculateStyleInvestedPoints(style) {
  const eixosSum = Object.values(style.eixos || {}).reduce((sum, v) => sum + (v || 0), 0);
  return eixosSum + (style.postura?.ofensiva || 0) + (style.postura?.defensiva || 0);
}

/**
 * Soma investida em TODOS os Estilos do personagem — usado pra validar
 * contra o total disponível (calculateFightingStylePoints).
 */
export function calculateTotalInvestedPoints(fightingStyles) {
  return (fightingStyles || []).reduce((sum, style) => sum + calculateStyleInvestedPoints(style), 0);
}

/**
 * Quantos pontos de peso de Passiva um Estilo desbloqueou (de graça).
 */
export function calculatePassiveWeightBudget(style) {
  return Math.floor(calculateStyleInvestedPoints(style) / PASSIVE_POINTS_PER_UNLOCK);
}
/**
 * Peso de uma Passiva = SOMA dos pesos dos Efeitos combinados, menos 1 se
 * houver Condicional (mínimo 1).
 */
export function calculatePassiveWeight(names, hasConditional) {
  if (!names || names.length === 0) return 1;
  const baseWeight = getEffectWeight(names);
  return hasConditional ? Math.max(1, baseWeight - 1) : baseWeight;
}

/**
 * Valida as Passivas de um Estilo: o peso TOTAL (soma) cabe no orçamento;
 * cada EFEITO pesa no máximo 2 (Reverter/Multiplicar ficam fora); toda
 * Passiva tem ao menos 1 Efeito e uma Categoria.
 */
export function validateStylePassives(style, chosenPassives) {
  const budget = calculatePassiveWeightBudget(style);
  const passives = chosenPassives || [];
  const totalWeight = passives.reduce((sum, p) => sum + calculatePassiveWeight(p.names, !!p.conditional), 0);
  const anyInvalidEffect = passives.some((p) =>
    (p.names || []).some(
      (n) => EXCLUDED_PASSIVE_EFFECTS.includes(n) || (EFFECT_DEFINITIONS[n]?.weight ?? 1) > MAX_SINGLE_PASSIVE_WEIGHT
    )
  );
  const anyMissingCategory = passives.some((p) => !p.category);
  const anyMissingNames = passives.some((p) => !p.names || p.names.length === 0);
  return {
    valid: totalWeight <= budget && !anyInvalidEffect && !anyMissingCategory && !anyMissingNames,
    budget,
    totalWeight,
    anyInvalidEffect,
    anyMissingCategory,
    anyMissingNames,
  };
}

/** Golpes de Assinatura: 1 a cada 2 pontos investidos no Estilo (blocos completos). */
export function calculateSignatureMoveBudget(style) {
  return Math.floor(calculateStyleInvestedPoints(style) / SIGNATURE_POINTS_PER_MOVE);
}

export function validateSignatureMoves(style) {
  const budget = calculateSignatureMoveBudget(style);
  const moves = style.signatureMoves ?? [];
  const anyMissingName = moves.some((m) => !m.name?.trim());
  const anyMissingEffect = moves.some((m) => !m.effect?.names?.length);
  return {
    valid: moves.length <= budget && !anyMissingName && !anyMissingEffect,
    budget,
    count: moves.length,
    anyMissingName,
    anyMissingEffect,
  };
}
/**
 * Traduz os pontos investidos em CADA Eixo pro efeito mecânico concreto.
 * physicalDamage vem de calculatePhysicalDamageBase + applyMassDamageModifier
 * (já existentes). constituicaoLevel/prontidaoLevel são NÍVEIS brutos (0-9).
 */
export function calculateStyleEffects(style, { physicalDamage, constituicaoLevel, prontidaoLevel }) {
  const potenciaPoints = style.eixos?.potencia || 0;
  const robustezPoints = style.eixos?.robustez || 0;
  const agilidadePoints = style.eixos?.agilidade || 0;
  const distanciaPoints = style.eixos?.distancia || 0;
  const controlePoints = style.eixos?.controle || 0;

  const potenciaDieFace = getBonusDieFace(potenciaPoints);
  const robustezDieFace = getBonusDieFace(robustezPoints);
  const controleDieFace = getBonusDieFace(controlePoints);
  const constituicaoValue = getSkillDieMaxValue(constituicaoLevel || 0);

  const ofensivaLevel = getPostureLevel(style.postura?.ofensiva || 0);
  const defensivaLevel = getPostureLevel(style.postura?.defensiva || 0);
  const prontidaoDieFace = getSkillDieMaxValue(prontidaoLevel || 0);
const reativoParts = ['1d20', constituicaoValue > 0 && `d${constituicaoValue}`, robustezDieFace && `d${robustezDieFace}`].filter(Boolean);

  return {
    potencia: {
      points: potenciaPoints,
      bonusDie: potenciaDieFace ? `+d${potenciaDieFace}` : null,
      baseDamage: physicalDamage ? formatPhysicalDamage(physicalDamage) : '—',
    },
    robustez: {
      points: robustezPoints,
      bonusDie: robustezDieFace ? `+d${robustezDieFace}` : null,
      testeReativo: `${reativoParts.join(' + ')} (contra o resultado do ataque)`,
    },
    agilidade: {
      points: agilidadePoints,
      freeReactionsPerTurn: agilidadePoints,
    },
    distancia: {
      points: distanciaPoints,
      usosPerScene: distanciaPoints,
    },
    controle: {
      points: controlePoints,
      bonusDie: controleDieFace ? `+d${controleDieFace}` : null,
    },
    postura: {
      ofensiva: {
        level: ofensivaLevel,
        staminaDiscount: ofensivaLevel > 0 ? POSTURE_EFFECTS.ofensiva[ofensivaLevel].staminaDiscount : 0,
        description: ofensivaLevel > 0 ? POSTURE_EFFECTS.ofensiva[ofensivaLevel].description : null,
      },
      defensiva: {
        level: defensivaLevel,
        prontidaoDie: defensivaLevel > 0 ? `d${prontidaoDieFace}` : null,
        divisor: defensivaLevel > 0 ? POSTURE_EFFECTS.defensiva[defensivaLevel].prontidaoDivisor : null,
        description: defensivaLevel > 0 ? POSTURE_EFFECTS.defensiva[defensivaLevel].description : null,
      },
    },
  };
}