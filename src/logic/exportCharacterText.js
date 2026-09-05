// src/logic/exportCharacterText.js
import { SKILLS, SKILL_LEVEL_TO_DICE, groupSkillsByCategory } from '../data/skills';
import { BACKGROUND_PACKAGES } from '../data/backgrounds';
import { CLASSES, getArchetypesForClass } from '../data/classes';
import { CAMINHOS } from '../data/caminhos';
import { POSITIVE_ASPECTS, NEGATIVE_ASPECTS } from '../data/aspects';
import { OCCUPATION_CATEGORIES } from '../data/occupations';
import { TRAUMAS } from '../data/traumas';
import { getEffectiveMassCategory } from './characterCalculations';
function diceFor(level) {
  if (!level || level <= 0) return 'd00';
  return SKILL_LEVEL_TO_DICE[Math.min(level, 9)] ?? 'd00';
}

function aspectLabel(id, catalog) {
  return catalog.find((a) => a.id === id)?.label ?? id;
}

/**
 * Monta a ficha como um array de linhas (cada item = 1 linha do documento).
 * Usado tanto pelo export .txt quanto pelo export .pdf, pra não duplicar a
 * lógica de montagem em dois lugares.
 */
export function buildCharacterSheetLines({
  character,
  lifeStage,
  finalAttributeTotals,
  finalSkillTotals,
  skillResultBonuses,
  vigor,
  maxSanity, // novo
  remainingLuck,
  classBonuses,
  isAgent,
}) {
  const lines = [];

  const classId = character.classPath.classId;
  const archetypeId = character.classPath.archetypeId;
  const className = isAgent ? CLASSES[classId]?.label ?? '' : '';
  const caminhoName = isAgent ? CAMINHOS[character.classPath.caminhoId]?.label ?? '' : '';
  const specialtyPoints = isAgent ? classBonuses?.specialtyPoints ?? '' : '';

  lines.push('"Personagem', '');
  lines.push(`Nome: ${character.name || ''}`);
  lines.push('Tier: ');
  lines.push(`Idade: ${lifeStage?.label ?? ''}`);
  lines.push(`Classe: ${className}`);
  lines.push(`Caminho: ${caminhoName}`);
  lines.push(`Especialidade: ${specialtyPoints}`);
  lines.push('');

  lines.push('"Curiosidades', '');
  lines.push('Gênero: ');
  lines.push('Sexualidade: ');
  lines.push('Religião: ');
  lines.push('Estado Civil: ');
  lines.push(`Lore: ${character.concept || ''}`);
  lines.push('Curiosidades gerais: ');
  lines.push('');

  lines.push('"Informações', '');
  lines.push('Pacotes de antecedentes:');
  Object.values(BACKGROUND_PACKAGES).forEach((pkg) => {
    const count = character.purchasedBackgrounds.filter((p) => p.packageId === pkg.id).length;
    lines.push(`${pkg.label.replace('Pacote ', '')}. ${count}`);
  });
  lines.push('');

  const primary = OCCUPATION_CATEGORIES[character.occupation.primaryId];
  const secondary = OCCUPATION_CATEGORIES[character.occupation.secondaryId];
  const occupationText = [primary?.label, secondary?.label].filter(Boolean).join(' + ');
  lines.push(`Ocupação: ${occupationText}`);
  lines.push('');

  lines.push('Aspectos:');
  lines.push('    "Negativos');
  [
    ...character.aspects.mandatoryIds,
    ...character.aspects.chosenNegativeIds,
    ...character.aspects.excessNegativeIds,
  ].forEach((id) => {
    lines.push(`> ${aspectLabel(id, NEGATIVE_ASPECTS)}`);
  });
  lines.push('      "Positivos');
  character.aspects.chosenPositiveIds.forEach((id) => {
    lines.push(`> ${aspectLabel(id, POSITIVE_ASPECTS)}`);
  });
  lines.push('');

  const vicioIds = [
    ...character.aspects.mandatoryIds,
    ...character.aspects.chosenNegativeIds,
    ...character.aspects.excessNegativeIds,
  ].filter((id) => id === 'vicio');
  lines.push(`Vícios: ${vicioIds.length > 0 ? 'Vício' : ''}`);

  // Traumas unificados (Fobias + Manias)
  const traumaLabels = (character.traumaIds || [])
    .map((id) => TRAUMAS.find((t) => t.id === id)?.label ?? id)
    .join(', ');
  lines.push(`Traumas: ${traumaLabels}`);
  lines.push('Manias: ');
  lines.push('');

lines.push('"Corpo', '');
lines.push('Altura: ');
lines.push(`Peso: ${character.weightKg ?? ''}`);
lines.push('Aparência: ');
lines.push('');

  lines.push('〃Atributos', '');
  lines.push(`Existência: ${finalAttributeTotals.existencia ?? 0}`);
  lines.push(`Destreza: ${finalAttributeTotals.destreza ?? 0}`);
  lines.push(`Inteligência: ${finalAttributeTotals.inteligencia ?? 0}`);
  lines.push(`Carisma: ${finalAttributeTotals.carisma ?? 0}`);
  lines.push(`Sabedoria: ${finalAttributeTotals.sabedoria ?? 0}`);
  lines.push('');

  lines.push('〃Perícias', '');
  const allSkillIds = Object.keys(SKILLS);
  groupSkillsByCategory(allSkillIds).forEach((group) => {
    lines.push(`- ${group.label}:`, '');
    group.skills.forEach((skillId) => {
      const level = finalSkillTotals[skillId] ?? 0;
      const bonus = skillResultBonuses?.[skillId];
      const bonusText = bonus ? ` (+${bonus})` : '';
      lines.push(`${SKILLS[skillId].label}: ${diceFor(level)}${bonusText}`);
    });
    lines.push('');
  });

  lines.push('"Defesas', '');
  lines.push('Defesa (armadura): ');
  lines.push('DT Física: ');
  lines.push('DT Mental: ');
  lines.push('DT Social: ');
  lines.push('');

lines.push('"Vigor', '');
lines.push(`Vigor: ${massAdjustedVigor.value}/${massAdjustedVigor.value}`);
lines.push(
  `Dano Físico: ${
    physicalDamage
      ? physicalDamage.diceCount > 0
        ? `${physicalDamage.diceCount}d${physicalDamage.dieFace}`
        : 'Trauma Direto automático'
      : ''
  }`
);
lines.push(`Sorte: ${remainingLuck}/${lifeStage?.initialLuck ?? 0}`);
lines.push(`Sanidade: ${maxSanity}/${maxSanity}`);
lines.push('');
  lines.push('"Ferimentos', '');
  lines.push('Local / Penalidade: Nenhum');
  lines.push('');

  lines.push('"Condições', '');
  lines.push('> Normal (sem penalidades)');
  lines.push('');

  lines.push('"Vantagens e Efeitos Especiais', '');

  const allAspectIds = [
    ...character.aspects.mandatoryIds,
    ...character.aspects.chosenPositiveIds,
    ...character.aspects.chosenNegativeIds,
    ...character.aspects.excessNegativeIds,
  ];
  if (allAspectIds.length > 0) {
    lines.push('Aspectos:');
    character.aspects.mandatoryIds.forEach((id) => {
      const a = NEGATIVE_ASPECTS.find((x) => x.id === id);
      if (a) lines.push(`> ${a.label} — ${a.effect}`);
    });
    character.aspects.chosenPositiveIds.forEach((id) => {
      const a = POSITIVE_ASPECTS.find((x) => x.id === id);
      if (a) lines.push(`> ${a.label} — ${a.effect}`);
    });
    character.aspects.chosenNegativeIds.forEach((id) => {
      const a = NEGATIVE_ASPECTS.find((x) => x.id === id);
      if (a) lines.push(`> ${a.label} — ${a.effect}`);
    });
    character.aspects.excessNegativeIds.forEach((id) => {
      const a = NEGATIVE_ASPECTS.find((x) => x.id === id);
      if (a) lines.push(`> ${a.label} — ${a.effect}`);
    });
    lines.push('');
  }

  // Descrições e detalhes dos Traumas
  if (character.traumaIds && character.traumaIds.length > 0) {
    lines.push('Traumas:');
    character.traumaIds.forEach((id) => {
      const t = TRAUMAS.find((x) => x.id === id);
      if (t) lines.push(`> ${t.label} — ${t.description}`);
    });
    lines.push('');
  }

  if (isAgent && archetypeId) {
    const archetype = getArchetypesForClass(classId).find((a) => a.id === archetypeId);
    if (archetype?.note) {
      lines.push('Arquétipo:');
      lines.push(`> ${archetype.label} — ${archetype.note}`);
      lines.push('');
    }
  }

  if (isAgent && character.classPath.caminhoId) {
    lines.push('Caminho:');
    lines.push(`> ${CAMINHOS[character.classPath.caminhoId]?.vantagem ?? ''}`);
    lines.push('');
  }
if (character.weightKg) {
  const massInfo = getEffectiveMassCategory(character.weightKg, {
    forcaLevel: finalSkillTotals.forca || 0,
    constituicaoLevel: finalSkillTotals.constituicao || 0,
    resistenciaLevel: finalSkillTotals.resistencia || 0,
  });
  lines.push('Categoria de Massa:');
  lines.push(`> Peso real: ${massInfo.real.label}`);
  lines.push(`> Dano: ${massInfo.damage.category.damageEffect}`);
  lines.push(`> Vigor: ${massInfo.vigor.category.vigorEffect}`);
  lines.push(`> Stamina: ${massInfo.stamina.category.staminaEffect}`);
  lines.push(`> Vantagem: ${massInfo.real.advantage}`);
  lines.push(`> Desvantagem: ${massInfo.real.disadvantage}`);
  lines.push('');
}

  if (character.customSkills.length > 0) {
    lines.push('Habilidades:');
    character.customSkills.forEach((sk) => {
      const skillLabel = SKILLS[sk.skillId]?.label ?? sk.skillId;
      lines.push(`> ${sk.name || '(sem nome)'} [${skillLabel}, custo: ${sk.cost}] — ${sk.narrative}`);
    });
  }

  return lines;
}

export function generateCharacterSheetText(params) {
  return buildCharacterSheetLines(params).join('\n');
}

export function downloadCharacterSheetText(text, filename = 'ficha-ace.txt') {
  const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}