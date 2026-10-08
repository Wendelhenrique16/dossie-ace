// src/data/fightingStylesCatalog.js
import { getEffectWeight } from './abilities';

export const FIGHTING_STYLE_CATALOG = [
  {
    id: 'boxe',
    name: 'Boxe',
    category: 'pronto',
    description: 'Soca rápido e desvia o corpo.',
    pointsRequired: 6,
    eixos: { potencia: 2, robustez: 1, agilidade: 2, distancia: 0, controle: 0 },
    postura: { ofensiva: 1, defensiva: 0 }, // 5 de Eixos + 1 de Postura (Nível 1) = 6
    passives: [{ names: ['Agilizar'], category: 'Socos', conditional: null, description: 'Golpes de cruzado e jab.' }],
  },
  {
    id: 'capoeira',
    name: 'Capoeira',
    category: 'pronto',
    description: 'Estilo evasivo e imprevisível, prioriza reposicionamento e golpes de oportunidade.',
    pointsRequired: 5,
    eixos: { potencia: 0, robustez: 0, agilidade: 2, distancia: 2, controle: 0 },
    postura: { ofensiva: 0, defensiva: 1 }, // 4 de Eixos + 1 de Postura (Nível 1) = 5
    passives: [{ names: ['Garantir'], category: 'Defesas', conditional: null, description: 'Esquivas com giro ou cambalhota.' }],
  },
  {
    id: 'jiu_jitsu',
    name: 'Jiu-Jitsu',
    category: 'pronto',
    description: 'Foco total em levar o combate ao chão e finalizar através de agarrões e imobilizações.',
    pointsRequired: 6,
    eixos: { potencia: 0, robustez: 1, agilidade: 0, distancia: 0, controle: 4 },
    postura: { ofensiva: 0, defensiva: 1 }, // 5 de Eixos + 1 de Postura (Nível 1) = 6
    passives: [{ names: ['Amplificar'], category: 'Agarrões', conditional: null, description: 'Manobras de imobilização já em andamento.' }],
  },
  {
    id: 'modelo_generico',
    name: '[Nome do Estilo]',
    category: 'modelo',
    description: 'Modelo em branco — preencha o nome e distribua os pontos conforme o conceito do personagem.',
    pointsRequired: 0,
    eixos: { potencia: 0, robustez: 0, agilidade: 0, distancia: 0, controle: 0 },
    postura: { ofensiva: 0, defensiva: 0 },
    passives: [],
  },
];

export function getReadyMadeStyles() {
  return FIGHTING_STYLE_CATALOG.filter((s) => s.category === 'pronto');
}

export function getStyleModels() {
  return FIGHTING_STYLE_CATALOG.filter((s) => s.category === 'modelo');
}

/**
 * Aplica um template do catálogo SOBRE um Estilo já existente (sobrescreve
 * eixos/postura/passivas). Preserva id, nome (se já digitado) e Golpes de Assinatura.
 */
export function applyCatalogToStyle(existingStyle, catalogEntry) {
  return {
    ...existingStyle,
    name: existingStyle.name?.trim() ? existingStyle.name : catalogEntry.name,
    eixos: { ...catalogEntry.eixos },
    postura: { ...catalogEntry.postura },
    passives: catalogEntry.passives.map((p) => ({
      instanceId: `${Date.now()}-${Math.random()}`,
      names: [...p.names],
      weight: Math.max(1, getEffectWeight(p.names) - (p.conditional ? 1 : 0)),
      category: p.category ?? null,
      conditional: p.conditional ? { ...p.conditional } : null,
      description: p.description ?? '',
    })),
  };
}

export function createBlankStyle() {
  return {
    id: `${Date.now()}-${Math.random()}`,
    name: '',
    eixos: { potencia: 0, robustez: 0, agilidade: 0, distancia: 0, controle: 0 },
    postura: { ofensiva: 0, defensiva: 0 },
    passives: [],
    signatureMoves: [],
  };
}