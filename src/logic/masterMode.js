// src/logic/masterMode.js
import { SKILLS, groupSkillsByCategory } from '../data/skills';
import { SCALE_MODIFIERS_BY_GENERAL, getScaleLabel } from '../data/scale';
import { formatPhysicalDamage } from './characterCalculations';

/** Modificadores de Escala: total pela Escala Geral, gastos = soma de (Escala - 1) por Perícia. */
export function getScaleBudget(masterMode) {
  const general = masterMode?.scaleGeneral ?? 1;
  const total = SCALE_MODIFIERS_BY_GENERAL[general] ?? 0;
  const spent = Object.values(masterMode?.skillScales ?? {}).reduce((sum, v) => sum + Math.max(0, v - 1), 0);
  return { general, total, spent, remaining: total - spent };
}

/** Linhas das Concessões do Mestre pro export (.txt / .pdf). */
export function buildMasterModeLines(masterMode, physicalDamage) {
  if (!masterMode?.enabled) return [];
  const lines = [];
  const categoryLabel = Object.fromEntries(
    groupSkillsByCategory(Object.keys(SKILLS)).map((g) => [g.categoryId, g.label])
  );
  const budget = getScaleBudget(masterMode);

  lines.push('"Concessões do Mestre', '');
  lines.push(`Escala Geral: ${budget.general} (Modificadores de Escala: ${budget.spent}/${budget.total})`);
  Object.entries(masterMode.skillScales ?? {}).forEach(([skillId, value]) => {
    lines.push(`> ${SKILLS[skillId]?.label ?? skillId}: Escala ${value} (${getScaleLabel(value)})`);
  });
  Object.entries(masterMode.categoryScales ?? {}).forEach(([categoryId, value]) => {
    lines.push(`> ${categoryLabel[categoryId] ?? categoryId} (categoria inteira): Escala ${value} (${getScaleLabel(value)})`);
  });
  lines.push('');

  (masterMode.naturalPassives ?? []).forEach((p) => {
    const scopeText = `${p.scope || '(sem escopo)'}${p.conditional ? ` — ${p.conditional.description}` : ''}`;
    lines.push(`# ${(p.name || '(sem nome)').toUpperCase()} — PASSIVA NATURAL`, '');
    lines.push(`> ${p.description || ''}`);
    lines.push(`> **Escopo:** ${scopeText} · **Efeito:** ${p.names.join(' + ')}`);
    lines.push('');
  });

  (masterMode.naturalWeapons ?? []).forEach((w) => {
    lines.push(`# ${(w.name || '(sem nome)').toUpperCase()} — ARMA NATURAL`, '');
    lines.push(`> ${w.notes || ''}`);
    lines.push(`> **Dano:** ${formatPhysicalDamage(physicalDamage)} (ataque desarmado) · **Tipo:** ${w.damageType} · **Tags:** ${w.tags.join(', ') || '—'}`);
    lines.push('');
  });

  return lines;
}