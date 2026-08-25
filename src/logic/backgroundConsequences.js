// src/logic/backgroundConsequences.js
// Calcula quantos "slots" de consequência (Vício/Mania obrigatório, Aspecto
// Negativo Grave, penalidade de Atributo) o personagem já disparou, com
// base na Fase da Vida e na quantidade de pacotes comprados.
//
// Não resolve o CONTEÚDO desses slots (isso depende do catálogo de Vícios/
// Manias/Traumas, que ainda não existe — só Aspectos Negativos "normais"
// estão catalogados). Serve pra UI mostrar "você tem 2 Aspectos Negativos
// Graves pendentes" como placeholder até o catálogo chegar.

import { LIFE_STAGES } from '../data/lifeStages';

export function calculatePendingConsequences(lifeStageId, purchasedCount) {
  const stage = LIFE_STAGES[lifeStageId];
  if (!stage) return [];

  const slots = [];

  if (stage.mandatoryOnFirstExtra && purchasedCount > stage.freePackages) {
    slots.push({
      type: stage.mandatoryOnFirstExtra.type,
      count: 1,
      description: stage.mandatoryOnFirstExtra.description,
    });
  }

  if (stage.mandatoryOnCreation) {
    const m = stage.mandatoryOnCreation;
    if (m.type === 'aspectos_idade') {
      slots.push({ type: 'aspecto_negativo_idade', count: m.negativeCount, description: m.description });
      slots.push({ type: 'aspecto_positivo_experiencia', count: m.positiveCount, description: m.description });
    } else {
      slots.push({ type: m.type, count: 1, description: m.description });
    }
  }

  if (stage.penaltyAboveSafeLimit) {
    const p = stage.penaltyAboveSafeLimit;
    const from = p.appliesFrom ?? stage.safeLimit;
    const until = p.appliesUntil ?? stage.hardLimit;
    const count = Math.max(0, Math.min(purchasedCount, until) - from);
    if (count > 0) {
      slots.push({
        type: p.type,
        count,
        description: `Aspecto Negativo Grave por pacote comprado além do limite seguro (${from}).`,
      });
    }
  }

  if (stage.penaltyAboveHardThreshold) {
    const p = stage.penaltyAboveHardThreshold;
    const count = Math.max(0, Math.min(purchasedCount, p.appliesUntil) - p.appliesFrom);
    if (count > 0) {
      slots.push({
        type: p.type,
        count,
        description: `-2 em um Atributo à escolha entre: ${p.eligibleAttributes.join(', ')}.`,
      });
    }
  }

  return slots;
}

export const CONSEQUENCE_TYPE_LABELS = {
  vicio_ou_mania: 'Vício ou Mania (obrigatório)',
  aspecto_negativo_idade: 'Aspecto Negativo de Idade',
  aspecto_positivo_experiencia: 'Aspecto Positivo de Experiência',
  aspecto_negativo_grave: 'Aspecto Negativo Grave',
  atributo_penalidade: 'Penalidade de Atributo',
};