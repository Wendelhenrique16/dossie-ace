// src/logic/exportCharacterText.js
import { SKILLS, SKILL_LEVEL_TO_DICE, groupSkillsByCategory } from '../data/skills';
import { BACKGROUND_PACKAGES } from '../data/backgrounds';
import { CLASSES, getArchetypesForClass } from '../data/classes';
import { CAMINHOS } from '../data/caminhos';
import { POSITIVE_ASPECTS, NEGATIVE_ASPECTS } from '../data/aspects';
import { OCCUPATION_CATEGORIES } from '../data/occupations';
import { TRAUMAS } from '../data/traumas';
import { ABILITIES } from '../data/abilities';
import { ARCHETYPE_BONUSES } from '../data/archetypeBonuses';
import { FIGHTING_STYLE_AXES } from '../data/fightingStyles';
import { ARSENAL_BY_ID } from '../data/arsenal';
import { buildMasterModeLines } from './masterMode';
import { getEffectiveMassCategory, calculateStyleEffects, formatPhysicalDamage, formatArsenalSummary, formatPhysicalDefense, DEFENSE_SKILLS } from './characterCalculations';
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
  character, lifeStage, finalAttributeTotals, finalSkillTotals, skillResultBonuses,
  vigor, massAdjustedVigor, physicalDamage, maxSanity, remainingLuck, classBonuses, isAgent,
  cargaInfo, movementInfo, fightingStyleInfo, // NOVO
}) {
  const lines = [];

  const classId = character.classPath.classId;
  const archetypeId = character.classPath.archetypeId;
  const className = isAgent ? CLASSES[classId]?.label ?? '' : '';
  const caminhoName = isAgent ? CAMINHOS[character.classPath.caminhoId]?.label ?? '' : '';
  const specialtyPoints = isAgent ? classBonuses?.specialtyPoints ?? '' : '';

  lines.push('"Personagem', '');
  lines.push(`Nome: ${character.name || ''}`);
  lines.push(`Idade: ${lifeStage?.label ?? ''}`);
  lines.push(`Classe: ${className}`);
  lines.push(`Caminho: ${caminhoName}`);
  lines.push(`Especialidade: ${(character.specialties ?? []).map((s) => s.name || '(sem nome)').join(', ')}`);
  lines.push('');

  lines.push('"Curiosidades', '');
  lines.push(`Gênero: ${character.gender || ''}`);
  lines.push(`Sexualidade: ${character.sexuality || ''}`);
  lines.push(`Religião: ${character.religion || ''}`);
  lines.push(`Estado Civil: ${character.maritalStatus || ''}`);
  lines.push(`Lore: ${character.concept || ''}`);
  lines.push(`Curiosidades gerais: ${character.curiosities || ''}`);
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
  lines.push(`Altura: ${character.height || ''}`);
  lines.push(`Peso: ${character.weightKg ?? ''}`);
  lines.push(`Aparência: ${character.appearance || ''}`);
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
  const activeStyle = (character.fightingStyles ?? []).find((s) => s.id === character.activeFightingStyleId);
  const constituicaoBonus = skillResultBonuses?.constituicao;
  lines.push(
    `Física (Teste Reativo de Constituição): ${formatPhysicalDefense(finalSkillTotals.constituicao || 0, activeStyle)}${constituicaoBonus ? ` (+${constituicaoBonus})` : ''}`
  );
  [['Mental', DEFENSE_SKILLS.mental], ['Social', DEFENSE_SKILLS.social]].forEach(([label, skillIds]) => {
    const text = skillIds
      .map((skillId) => {
        const bonus = skillResultBonuses?.[skillId];
        return `${SKILLS[skillId]?.label ?? skillId} ${diceFor(finalSkillTotals[skillId] ?? 0)}${bonus ? ` (+${bonus})` : ''}`;
      })
      .join(' · ');
    lines.push(`${label}: ${text}`);
  });
  lines.push('');

  lines.push('"Vigor', '');
  lines.push(`Vigor: ${massAdjustedVigor.value}/${massAdjustedVigor.value}`);
  lines.push(`Dano Físico: ${formatPhysicalDamage(physicalDamage)}`);
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
  (character.specialties ?? []).forEach((s) => {
    const scopeText = `${s.scope || '(sem escopo)'}${s.conditional ? ` — ${s.conditional.description}` : ''}`;
    lines.push(`# ${(s.name || '(sem nome)').toUpperCase()} — ESPECIALIDADE`, '');
    lines.push(`> ${s.description || ''}`);
    lines.push(`> **Escopo:** ${scopeText} · **Efeito:** ${s.names.join(' + ')}`);
    lines.push('');
  });
  if (isAgent && character.classPath.caminhoId) {
    lines.push('Caminho:');
    lines.push(`> ${CAMINHOS[character.classPath.caminhoId]?.vantagem ?? ''}`);
    lines.push('');
  }
  if (isAgent && character.classPath.archetypeId && ARCHETYPE_BONUSES[character.classPath.archetypeId]) {
    const bonus = ARCHETYPE_BONUSES[character.classPath.archetypeId];
    lines.push(`Bônus do Arquétipo (${bonus.name}): ${bonus.description}`);
  }
  if (character.weightKg) {
    const archetypeBonus = ARCHETYPE_BONUSES[character.classPath.archetypeId];
    const archetypeShifts = archetypeBonus?.massShift
      ? { [archetypeBonus.massShift.axis]: archetypeBonus.massShift.amount }
      : {};

    const massInfo = getEffectiveMassCategory(character.weightKg, {
      forcaLevel: finalSkillTotals.forca || 0,
      constituicaoLevel: finalSkillTotals.constituicao || 0,
      resistenciaLevel: finalSkillTotals.resistencia || 0,
      archetypeShifts,
    });
    lines.push('Categoria de Massa:');
    lines.push(`> Peso real: ${massInfo.real.label}`);
    lines.push(`> Dano: ${massInfo.damage.category.damageEffect}`);
    lines.push(`> Vigor: ${massInfo.vigor.category.vigorEffect}`);
    lines.push(`> Stamina: ${massInfo.stamina.category.staminaEffect}`);
    lines.push(`> Vantagem: ${massInfo.real.advantage}`);
    lines.push(`> Desvantagem: ${massInfo.real.disadvantage}`);
    if (cargaInfo) {
      lines.push('Carga:');
      lines.push(`> Confortável: até ${cargaInfo.comfortable.maxKg}kg (Carga ${cargaInfo.comfortable.cargaLevel})`);
      lines.push(`> Pesada: até ${cargaInfo.heavy.maxKg}kg (Carga ${cargaInfo.heavy.cargaLevel})`);
      lines.push(`> Extrema: até ${cargaInfo.extreme.maxKg}kg (Carga ${cargaInfo.extreme.cargaLevel})`);
      lines.push('');
    }
    if (movementInfo) {
      if (movementInfo.note) {
        lines.push(`Movimento: 0 pontos (${movementInfo.note})`);
      } else {
        lines.push(
          `Movimento: ${movementInfo.value} pontos — ` +
          `Andar ${movementInfo.andar.metersPerTurn}m/turno (${movementInfo.andar.kmh} km/h) · ` +
          `Correr ${movementInfo.correr.metersPerTurn}m/turno (${movementInfo.correr.kmh} km/h) · ` +
          `Sprint ${movementInfo.sprint.metersPerTurn}m/turno (${movementInfo.sprint.kmh} km/h)`
        );
      }
      lines.push('');
    }
    if (character.fightingStyles && character.fightingStyles.length > 0) {
      lines.push('Estilo de Luta:');
      const active = character.fightingStyles.find((s) => s.id === character.activeFightingStyleId);
      lines.push(`> Ativo: ${active?.name || 'Nenhum'}`);
      character.fightingStyles.forEach((style) => {
        const effects = calculateStyleEffects(style, {
          physicalDamage,
          constituicaoLevel: finalSkillTotals.constituicao || 0,
          prontidaoLevel: finalSkillTotals.prontidao || 0,
        });
        lines.push(`> ${style.name || '(sem nome)'}`);
        lines.push(`  - Potência ${effects.potencia.points}: ${effects.potencia.baseDamage}${effects.potencia.bonusDie ? ` ${effects.potencia.bonusDie}` : ''}`);
        lines.push(`  - Robustez ${effects.robustez.points}: Teste Reativo de Constituição = ${effects.robustez.testeReativo}`);
        lines.push(`  - Agilidade ${effects.agilidade.points}: ${effects.agilidade.freeReactionsPerTurn} Reação(ões) gratuita(s) por turno`);
        lines.push(`  - Distância ${effects.distancia.points}: ${effects.distancia.usosPerScene} uso(s) por cena`);
        lines.push(`  - Controle ${effects.controle.points}: ${effects.controle.bonusDie ?? 'sem bônus'} no Teste Oposto de Manobra`);
        if (effects.postura.ofensiva.level > 0) {
          lines.push(`  - Postura Ofensiva Nível ${effects.postura.ofensiva.level}: ${effects.postura.ofensiva.description}`);
        }
        if (effects.postura.defensiva.level > 0) {
          lines.push(`  - Postura Defensiva Nível ${effects.postura.defensiva.level}: ${effects.postura.defensiva.description} (dado atual: ${effects.postura.defensiva.prontidaoDie})`);
        }
        style.passives.forEach((p) => {
          const categoryText = `${p.category ?? '(sem categoria)'}${p.conditional ? ` (${p.conditional.description})` : ''}`;
          lines.push(`# ${style.name.toUpperCase() || '(SEM NOME)'} — PASSIVA`, '');
          lines.push(`> ${p.description || ''}`);
          lines.push(`> **Categoria:** ${categoryText} · **Efeito:** ${p.names.join(' + ')} · **Peso:** ${p.weight}`);
          lines.push('');
        });
        (style.signatureMoves ?? []).forEach((m) => {
          const triggerText = `${m.trigger.type}${m.trigger.detail ? ` (${m.trigger.detail})` : ''}`;
          const conditionalText = m.conditional ? ` (Condicional: ${m.conditional.description})` : '';
          lines.push(`# ${(m.name || '(sem nome)').toUpperCase()} — GOLPE DE ASSINATURA (${(style.name || 'sem nome').toUpperCase()})`, '');
          lines.push(`> ${m.effect.description || ''}`);
          lines.push(`> **Gatilho:** ${triggerText} · **Custo:** ${m.cost.form} · **Efeito:** ${m.effect.names.join(' + ')}${conditionalText}`);
          lines.push('');
        });
      });
      lines.push('');
    }
  }
    lines.push(...buildMasterModeLines(character.masterMode, physicalDamage));
    const inventory = character.inventory ?? [];
  if (inventory.length > 0) {
    lines.push('"Inventário', '');
    inventory.forEach((item) => {
      const entry = item.catalogId ? ARSENAL_BY_ID[item.catalogId] : null;
      lines.push(`> ${item.name || entry?.name || '(sem nome)'}${item.quantity > 1 ? ` x${item.quantity}` : ''}`);
      if (entry) {
        lines.push(`  - ${formatArsenalSummary(entry, physicalDamage)}`);
            }
      
      if (item.notes) lines.push(`  - ${item.notes}`);
    });
    lines.push('');
  }
  character.selectedAbilities.forEach((a) => {
    const name = a.contextText ? `${a.name} [${a.contextText}]` : a.name;
    const triggerText = `${a.trigger.type}${a.trigger.detail ? ` (${a.trigger.detail})` : ''}`;
    const conditionalText = a.conditional ? ` (Condicional: ${a.conditional.description})` : '';
    lines.push(`# ${name.toUpperCase()}`, '');
    lines.push(`> ${a.effect.description}`);
    lines.push(`> **Gatilho:** ${triggerText} · **Custo:** ${a.cost.form} · **Efeito:** ${a.effect.names.join(' + ')}${conditionalText}`);
    lines.push('');
  });

  if (character.customSkills.length > 0) {
    character.customSkills.forEach((sk) => {
      const skillLabel = SKILLS[sk.skillId]?.label ?? sk.skillId;
      lines.push(`# ${(sk.name || '(sem nome)').toUpperCase()}`, '');
      lines.push(`> ${sk.narrative || ''}`);
      lines.push(`> **Perícia:** ${skillLabel} · **Custo:** ${sk.cost} · **Efeito:** ${sk.effectType}`);
      lines.push('');
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