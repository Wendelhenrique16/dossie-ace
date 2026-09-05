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

const extraPurchased = Math.max(0, purchasedCount - stage.freePackages);
if (extraPurchased > 0) {
  // 1 Trauma no 1º pacote extra + mais 1 a cada 3 extras adicionais
  // (1º extra = 1 trauma; 4º extra = 2º trauma; 7º extra = 3º trauma...)
  const traumaCount = 1 + Math.floor((extraPurchased - 1) / 3);
  slots.push({
    type: 'trauma',
    count: traumaCount,
    description: 'Trauma obrigatório: 1 no primeiro pacote extra, +1 a cada 3 pacotes extras adicionais.',
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



  return slots;
}

export const CONSEQUENCE_TYPE_LABELS = {
  trauma: 'Trauma (obrigatório)', // era 'vicio_ou_mania'
  aspecto_negativo_idade: 'Aspecto Negativo de Idade',
  aspecto_positivo_experiencia: 'Aspecto Positivo de Experiência',
  aspecto_negativo_grave: 'Aspecto Negativo Grave',
};