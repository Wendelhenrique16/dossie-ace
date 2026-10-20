// src/logic/physicalParameters.js
// Transforma os números da ficha em limites práticos e feitos narrativos.

import { SKILLS, groupSkillsByCategory } from '../data/skills';
import { LIFE_STAGES } from '../data/lifeStages';
import { ARCHETYPE_BONUSES } from '../data/archetypeBonuses';
import { getScaleMultiplier, getScaleLabel } from '../data/scale';
import {
  STRUCTURAL_VIGOR, STUN_TRIGGER_BY_MASS, FATIGUE_VIGOR_COST, FATIGUE_DT_LADDER,
  getFatigueMargin, COLLISION_DICE,
} from '../data/combatTables';
import {
  getSkillDieMaxValue, getEffectiveMassCategory, calculateMovement, calculateCargaLimits,
  calculatePhysicalDamageBase, applyMassDamageModifier, formatPhysicalDamage, calculateMaxVigor,
  calculateMaxSanity, formatPhysicalDefense, METERS_PER_MOVEMENT_POINT, TURN_DURATION_SECONDS,
} from './characterCalculations';

const round1 = (n) => Math.round(n * 10) / 10;

/* ---------- Escala (concessões do Mestre) ---------- */

let skillCategoryMap = null;
function getSkillCategoryMap() {
  if (!skillCategoryMap) {
    skillCategoryMap = {};
    groupSkillsByCategory(Object.keys(SKILLS)).forEach((g) =>
      g.skills.forEach((id) => { skillCategoryMap[id] = g.categoryId; })
    );
  }
  return skillCategoryMap;
}

/** Escala efetiva de uma Perícia: a da Perícia, senão a da categoria (0 ou -1), senão 1. */
export function getEffectiveSkillScale(masterMode, skillId) {
  if (!masterMode?.enabled) return 1;
  const direct = masterMode.skillScales?.[skillId];
  if (direct != null) return direct;
  const category = masterMode.categoryScales?.[getSkillCategoryMap()[skillId]];
  return category != null ? category : 1;
}

function scaleInfo(masterMode, skillId) {
  const value = getEffectiveSkillScale(masterMode, skillId);
  return { skillId, value, multiplier: getScaleMultiplier(value), label: getScaleLabel(value) };
}

/* ---------- Armas Naturais x armadura (regras decididas) ---------- */

describeArmorInteraction
/* ---------- Dano: média e máximo ---------- */

export function getDamageStats(damage) {
  if (!damage || damage.diceCount === 0) return { avg: null, max: null };
  let avg = damage.diceCount * ((damage.dieFace + 1) / 2);
  let max = damage.diceCount * damage.dieFace;
  if (damage.multiplier > 1) { avg *= damage.multiplier; max *= damage.multiplier; }
  if (damage.divisor > 1) {
    avg = Math.max(1, Math.ceil(avg / damage.divisor));
    max = Math.max(1, Math.ceil(max / damage.divisor));
  }
  return { avg: Math.round(avg), max };
}

function structureEffect(damage, structure) {
  const limiar = structure.vigor / 2;
  if (damage <= limiar) return { key: 'absorvido', text: 'sem efeito' };
  if (damage <= structure.vigor) return { key: 'racha', text: 'reduz 1 de Vigor da estrutura' };
  return { key: 'passa', text: `${damage - structure.vigor} passa; reduz 1 de Vigor da estrutura` };
}

/** Diferença de Material (Livro do Mestre): retorno de dano em quem golpeia. */
function recoilFor(structure, attackerVigor, damage) {
  if (damage > structure.vigor / 2) return null;       // passou do Limiar: sem retorno
  if (structure.vigor <= attackerVigor) return null;   // objeto igual ou mais fraco
  return { amount: damage, trauma: structure.vigor > attackerVigor * 2 };
}

function buildStructures({ stats, masonryBreaker, vigorMax }) {
  return STRUCTURAL_VIGOR.map((s) => {
    const limiar = s.vigor / 2;
    if (masonryBreaker && s.id !== 'pesado') return { ...s, limiar, collapsesByMovement: true };
    if (stats.avg == null) return { ...s, limiar, noRoll: true };
    const evaluate = (damage) => ({ damage, ...structureEffect(damage, s), recoil: recoilFor(s, vigorMax, damage) });
    return { ...s, limiar, average: evaluate(stats.avg), best: evaluate(stats.max) };
  });
}

/* ---------- Colisão ---------- */

function collisionDamage(categoryId, points) {
  const row = COLLISION_DICE[categoryId];
  const groups = Math.floor(points / 10);
  if (!row || groups < 1) return { text: 'abaixo de 10 pontos: sem dano', avg: null };
  const count = row.count * groups;
  let avg = count * ((row.face + 1) / 2);
  if (row.halve) avg = Math.max(1, Math.ceil(avg / 2));
  const text = `${count}d${row.face}${row.halve ? ' ÷ 2 (mín. 1)' : ''}${row.directTrauma ? ' em Trauma Direto' : ''}`;
  return { text, avg: Math.round(avg) };
}

/* ---------- Fôlego ---------- */

function averageHalfRoundedUp(sides) {
  let sum = 0;
  for (let k = 1; k <= sides; k++) sum += Math.ceil(k / 2);
  return sum / sides;
}

/* ---------- Função principal ---------- */

/**
 * @param {object} sheet { character, finalSkillTotals, finalAttributeTotals }
 *   (os mesmos valores já calculados no CharacterCreate)
 */
export function calculatePhysicalParameters({ character, finalSkillTotals = {}, finalAttributeTotals = {} }) {
  const weightKg = character?.weightKg;
  if (!weightKg) {
    return { ok: false, reason: 'Informe o peso do personagem (passo Detalhes) para calcular os parâmetros físicos.' };
  }

  const masterMode = character.masterMode?.enabled ? character.masterMode : null;
  const lvl = (id) => finalSkillTotals[id] || 0;

  const archetypeBonus = ARCHETYPE_BONUSES[character.classPath?.archetypeId];
  const archetypeShifts = archetypeBonus?.massShift ? { [archetypeBonus.massShift.axis]: archetypeBonus.massShift.amount } : {};
  const mass = getEffectiveMassCategory(weightKg, {
    forcaLevel: lvl('forca'),
    constituicaoLevel: lvl('constituicao'),
    resistenciaLevel: lvl('resistencia'),
    archetypeShifts,
  });
  const realId = mass.real.id;

  const speedScale = scaleInfo(masterMode, 'atletismo');
  const strengthScale = scaleInfo(masterMode, 'forca');

  /* 1. Mobilidade */
  const movement = calculateMovement(lvl('atletismo'), weightKg);
  const baseMovement = movement.value;
  const scaledMovement = baseMovement * speedScale.multiplier;
  const makeRhythm = (id, label, points, effort) => {
    const metersPerTurn = points * METERS_PER_MOVEMENT_POINT;
    return {
      id, label, effort,
      points: round1(points),
      metersPerTurn: round1(metersPerTurn),
      kmh: round1((metersPerTurn / TURN_DURATION_SECONDS) * 3.6),
    };
  };
  const rhythms = baseMovement > 0
    ? [
      makeRhythm('andar', 'Andar', Math.ceil(scaledMovement / 2), 'Leve'),
      makeRhythm('correr', 'Correr', scaledMovement, 'Intenso'),
      makeRhythm('sprint', 'Sprint', scaledMovement * 2, 'Extremo'),
    ]
    : [];

  /* 2. Carga */
  const carga = calculateCargaLimits(weightKg, lvl('forca'));
  const loadBands = [
    { id: 'comfortable', label: 'Confortável', effort: 'Leve' },
    { id: 'heavy', label: 'Pesada', effort: 'Intenso' },
    { id: 'extreme', label: 'Extrema', effort: 'Extremo' },
  ].map((band) => ({
    ...band,
    cargaLevel: carga[band.id].cargaLevel,
    baseMaxKg: carga[band.id].maxKg,
    maxKg: round1((carga[band.id].maxKg ?? 0) * strengthScale.multiplier),
  }));

  /* 3. Dano e cenário */
  const baseDamage = calculatePhysicalDamageBase(finalAttributeTotals.existencia || 0, lvl('forca'), lvl('combate'));
  const physicalDamage = applyMassDamageModifier(baseDamage, mass.damage.category.id);
  const stats = getDamageStats(physicalDamage);
  const directTrauma = physicalDamage.diceCount === 0;
  const masonryBreaker = realId === 'massivo' || realId === 'titanico';
  const vigorMax = calculateMaxVigor(mass.vigor.category, lvl('resistencia'), lvl('constituicao'));
  const structures = buildStructures({ stats, masonryBreaker, vigorMax });
  const collision = ['correr', 'sprint'].map((id) => {
    const r = rhythms.find((x) => x.id === id);
    return r ? { rhythm: r.label, points: r.points, ...collisionDamage(realId, r.points) } : null;
  }).filter(Boolean);

  const naturalWeapons = (masterMode?.naturalWeapons ?? []).map((w) => ({
    name: w.name || '(sem nome)',
    damageType: w.damageType,
    tags: w.tags ?? [],
    damageText: formatPhysicalDamage(physicalDamage),
    armorNotes: describeArmorInteraction(w.damageType, w.tags ?? []),
  }));

  /* 4. Fôlego e Fadiga */
  const resistenciaDie = getSkillDieMaxValue(lvl('resistencia'));
  const staminaId = mass.stamina.category.id;
  const fatigue = {
    resistenciaDie,
    margin: getFatigueMargin(lvl('resistencia')), // estimativa
    marginIsEstimate: true,
    dtLadder: FATIGUE_DT_LADDER,
    silentCost: FATIGUE_VIGOR_COST[staminaId],
    costCategoryLabel: mass.stamina.category.label,
    recovery: resistenciaDie > 0
      ? { min: 1, max: Math.ceil(resistenciaDie / 2), avg: round1(averageHalfRoundedUp(resistenciaDie)) }
      : null,
  };

  /* 5. Limiares */
  const activeStyle = (character.fightingStyles ?? []).find((s) => s.id === character.activeFightingStyleId);
  const freePackages = LIFE_STAGES[character.lifeStageId]?.freePackages ?? 0;
  const maxSanity = calculateMaxSanity(character.purchasedBackgrounds ?? [], freePackages, 12, character.selectedAbilities ?? []);
  const thresholds = {
    vigorMax,
    woundThreshold: Math.ceil(vigorMax / 2),
    stun: STUN_TRIGGER_BY_MASS[realId],
    reactiveTest: formatPhysicalDefense(lvl('constituicao'), activeStyle),
    sanity: {
      max: maxSanity,
      shakenAt: Math.floor(maxSanity / 2),
      apathyAt: 1,
      ruptureDamage: 6,
    },
  };

  return {
    ok: true,
    weightKg,
    mass,
    scales: { speed: speedScale, strength: strengthScale },
    mobility: {
      atletismoValue: getSkillDieMaxValue(lvl('atletismo')),
      modifier: movement.modifier,
      massLabel: movement.massCategoryLabel,
      base: baseMovement,
      scaled: round1(scaledMovement),
      note: movement.note,
      rhythms,
    },
    load: { bands: loadBands, wasShifted: carga.wasShifted, shiftDirection: carga.shiftDirection, readAs: carga.effectiveCategory.label },
    damage: {
      physicalDamage,
      formatted: formatPhysicalDamage(physicalDamage),
      stats,
      directTrauma,
      masonryBreaker,
      structures,
      collision,
      naturalWeapons,
    },
    fatigue,
    thresholds,
    masterGrants: masterMode
      ? {
        skillScales: Object.entries(masterMode.skillScales ?? {}).map(([id, value]) => ({
          label: SKILLS[id]?.label ?? id, value, multiplier: getScaleMultiplier(value),
        })),
        categoryScales: Object.entries(masterMode.categoryScales ?? {}).map(([id, value]) => ({
          label: groupSkillsByCategory(Object.keys(SKILLS)).find((g) => g.categoryId === id)?.label || id,
          value, multiplier: getScaleMultiplier(value),
        })),
        naturalPassives: masterMode.naturalPassives ?? [],
        naturalWeapons,
      }
      : null,
  };
}

/* ---------- Markdown ---------- */

export function buildPhysicalParametersMarkdown(p, character) {
  const name = character?.name || '(sem nome)';
  if (!p.ok) return `# Parâmetros Físicos — ${name}\n\n${p.reason}\n`;

  const L = [];
  const sign = (n) => (n >= 0 ? `+${n}` : `${n}`);

  L.push(`# Parâmetros Físicos — ${name}`, '');
  L.push(`Categoria de Massa: **${p.mass.real.label}** (${p.weightKg} kg)`, '');

  /* 1 */
  L.push('## 1. Mobilidade e Velocidade', '');
  if (p.mobility.note) {
    L.push(`- ${p.mobility.note}`, '');
  } else {
    L.push(`- Movimento base: **${p.mobility.base}** (Atletismo ${p.mobility.atletismoValue} ${sign(p.mobility.modifier)} de Massa ${p.mobility.massLabel})`);
    if (p.scales.speed.multiplier !== 1) {
      L.push(`- Escala de Velocidade ${p.scales.speed.value} (${p.scales.speed.label}): Movimento × ${p.scales.speed.multiplier} = **${p.mobility.scaled}**`);
    }
    L.push('', '| Ritmo | Esforço | Pontos | m/turno | km/h |', '|---|---|---|---|---|');
    p.mobility.rhythms.forEach((r) => L.push(`| ${r.label} | ${r.effort} | ${r.points} | ${r.metersPerTurn} | ${r.kmh} |`));
    const sprint = p.mobility.rhythms.find((r) => r.id === 'sprint');
    L.push('', `Em Sprint, cobre cerca de ${sprint.metersPerTurn} m por turno (≈ ${sprint.kmh} km/h), ao custo de desgaste Extremo. 1 ponto de Movimento = ${METERS_PER_MOVEMENT_POINT} m por turno; o turno dura ${TURN_DURATION_SECONDS} s.`, '');
  }

  /* 2 */
  L.push('## 2. Carga e Força Bruta', '');
  if (p.load.wasShifted) {
    L.push(`- A Força desloca a leitura da tabela de Carga ${p.load.shiftDirection === 'up' ? 'para cima' : 'para baixo'}: lê como **${p.load.readAs}**.`);
  }
  if (p.scales.strength.multiplier !== 1) {
    L.push(`- Escala de Força ${p.scales.strength.value} (${p.scales.strength.label}): as faixas abaixo estão × ${p.scales.strength.multiplier}.`);
  }
  L.push('', '| Faixa | Esforço | Até (kg) | Carga |', '|---|---|---|---|');
  p.load.bands.forEach((b) => L.push(`| ${b.label} | ${b.effort} | ${b.maxKg}${p.scales.strength.multiplier !== 1 ? ` (base ${b.baseMaxKg})` : ''} | ${b.cargaLevel} |`));
  const [conf, heavy, extreme] = p.load.bands;
  L.push('', `Sustenta até ${conf.maxKg} kg sem esforço, até ${heavy.maxKg} kg sob esforço intenso e só alcança ${extreme.maxKg} kg no limite do corpo.`, '');

  /* 3 */
  L.push('## 3. Interação com Cenário e Dano(AINDA EM FASE DE TESTE)', '');
  L.push(`- Dano Físico (soco/ataque desarmado): **${p.damage.formatted}**${p.damage.stats.avg != null ? ` (média ${p.damage.stats.avg}, máximo ${p.damage.stats.max})` : ''}`);
  if (p.damage.physicalDamage.note) L.push(`- Massa Efetiva: ${p.damage.physicalDamage.note}`);
  if (p.damage.directTrauma) L.push('- Todo acerto físico causa Trauma Direto: o dano reduz o Vigor do alvo sem a conta de metade e excedente.');
  if (p.damage.masonryBreaker) L.push('- Destrói alvenaria e barricadas só se deslocando, sem rolagem nem ação.');
  if (p.scales.strength.multiplier !== 1) {
    L.push(`- Escala de Força ${p.scales.strength.value}: o impacto dos ataques e a força bruta são multiplicados (${p.scales.strength.label}).(Ainda em fase de teste) o Mestre arbitra.`);
  }
  L.push('', '| Estrutura | Vigor (Limiar) | Golpe médio | Melhor caso | Retorno ao atacante |', '|---|---|---|---|---|');
  p.damage.structures.forEach((s) => {
    const head = `| ${s.label} | ${s.vigor} (${s.limiar})`;
    if (s.collapsesByMovement) {
      L.push(`${head} | colapsa ao deslocamento | colapsa ao deslocamento | — |`);
    } else if (s.noRoll) {
      L.push(`${head} | Trauma Direto | Trauma Direto | avalie pela colisão |`);
    } else {
      const recoil = (e) => (e.recoil ? `${e.recoil.amount}${e.recoil.trauma ? ' (Trauma Direto)' : ''}` : null);
      const back = [recoil(s.average) && `médio ${recoil(s.average)}`, recoil(s.best) && `melhor ${recoil(s.best)}`].filter(Boolean).join(' / ') || '—';
      L.push(`${head} | ${s.average.damage}: ${s.average.text} | ${s.best.damage}: ${s.best.text} | ${back} |`);
    }
  });
  L.push('', 'Dano até o Limiar é absorvido; acima do Limiar reduz 1 de Vigor da estrutura; o que ultrapassa o Vigor atual passa a quem está atrás e a estrutura perde 1 de Vigor; com Vigor 0 ela quebra. Contra estrutura Fraca ao Tipo do golpe, o Vigor perdido é o dano que passou do Limiar.', '');
  if (p.damage.collision.length) {
    L.push('**Colisão e Atropelamento** (por 10 pontos de Movimento):');
    p.damage.collision.forEach((c) => L.push(`- ${c.rhythm} (${c.points} pontos): ${c.text}${c.avg != null ? ` — média ${c.avg}` : ''}`));
    L.push('');
  }
  if (p.damage.naturalWeapons.length) {
    L.push('**Armas Naturais** (o ataque desarmado rola com o tipo e as Tags):');
    p.damage.naturalWeapons.forEach((w) => {
      L.push(`- ${w.name} — ${w.damageType}${w.tags.length ? `, ${w.tags.join(', ')}` : ''}; dano ${w.damageText}`);
      w.armorNotes.forEach((n) => L.push(`  - ${n}`));
    });
    L.push('');
  }

  /* 4 */
  L.push('## 4. Fôlego e Fadiga', '');
  const f = p.fatigue;
  L.push(`- Teste de Fadiga: Resistência ${f.resistenciaDie ? `d${f.resistenciaDie}` : 'd00'} contra DT ${f.dtLadder.join(' / ')} (Fácil a Difícil).`);
  L.push(`- Margem de turnos antes do primeiro Teste (estimativa; AINDA EM FASE DE TESTE): **${f.margin.intenso}** em Esforço Intenso ou **${f.margin.extremo}** em Esforço Extremo.`);
  L.push('- Andar não soma desgaste; Correr soma como Intenso; Sprint soma como Extremo.');
  L.push(`- Custo silencioso de Vigor por Teste bem-sucedido (Massa ${f.costCategoryLabel}): **${f.silentCost.intenso}** (Intenso) / **${f.silentCost.extremo}** (Extremo).`);
  L.push(f.recovery
    ? `- Recuperar o fôlego (turno inteiro): rola Resistência e recupera metade do valor, arredondado para cima, da penalidade de Fadiga: de ${f.recovery.min} a ${f.recovery.max} por turno (média ≈ ${f.recovery.avg}).`
    : '- Recuperar o fôlego: sem dado de Resistência, não há o que rolar.', '');

  /* 5 */
  L.push('## 5. Limiares de Combate e Sanidade', '');
  const t = p.thresholds;
  L.push(`- Vigor Máximo: **${t.vigorMax}**. Limiar de Ferimento/Atordoamento: dano a partir de **${t.woundThreshold}** (metade do Vigor Máximo) engatilha a Condição do tipo de dano; acima do Vigor atual vira Dano Excedente.`);
  L.push(`- Dano Contundente a partir de ${t.woundThreshold} atordoa automaticamente, sem teste.`);
  if (t.stun?.immune) {
    L.push('- Atordoamento por golpe: imune a ataques corporais e armas portáteis comuns.');
  } else if (t.stun) {
    L.push(`- Para atordoá-lo, o ataque precisa de **${t.stun.head}** na cabeça ou rosto e **${t.stun.body}** no corpo (sem local declarado). Depois disso, ele faz o Teste Reativo de Constituição: ${t.reactiveTest}, contra o resultado do ataque.`);
  }
  L.push(`- Sanidade Máxima: **${t.sanity.max}**. Estado **Abalado** com Sanidade ${t.sanity.shakenAt} ou menos (todo dano de Sanidade dobra). **Apatia** com Sanidade ${t.sanity.apathyAt}.`);
  L.push(`- **Ruptura Mental:** ${t.sanity.ruptureDamage} ou mais pontos de dano de Sanidade de uma vez, ou qualquer dano com Sanidade 0.`, '');

  /* Concessões */
  if (p.masterGrants) {
    const g = p.masterGrants;
    L.push('## Concessões do Mestre', '');
    g.skillScales.forEach((s) => L.push(`- Escala ${s.value} em ${s.label} (× ${s.multiplier})`));
    g.categoryScales.forEach((s) => L.push(`- Escala ${s.value} na categoria ${s.label} (× ${s.multiplier})`));
    g.naturalPassives.forEach((np) => L.push(`- Passiva Natural: ${np.name || '(sem nome)'} — ${np.scope || '(sem escopo)'}${np.conditional ? ` (${np.conditional.description})` : ''} · ${np.names.join(' + ')}`));
    L.push('');
  }

  return L.join('\n');
}