// src/data/fightingStylesCatalog.js
// Catálogo de APOIO pro Estilo de Luta — igual ao de Habilidades: alguns
// prontos pra usar direto, um modelo em branco pra preencher o conceito.
// O motor de criação livre (characterCalculations.js) não depende disto.

export const FIGHTING_STYLE_CATALOG = [
  {
    id: 'boxe',
    name: 'Boxe',
    category: 'pronto',
    description: 'Estilo ofensivo baseado em socos, deslocamento de guarda e pressão constante.',
    pointsRequired: 6,
    eixos: { potencia: 2, robustez: 1, agilidade: 1, distancia: 0, controle: 0 },
    postura: { ofensiva: 2, defensiva: 0 }, // 3 pontos de Postura (Nível 2) + 3 de Eixos = 6
    passives: [{ effectName: 'Agilizar', weight: 1, scope: 'Golpes de cruzado e jab', description: '' }],
  },
  {
    id: 'capoeira',
    name: 'Capoeira',
    category: 'pronto',
    description: 'Estilo evasivo e imprevisível, prioriza reposicionamento e golpes de oportunidade.',
    pointsRequired: 6,
    eixos: { potencia: 0, robustez: 0, agilidade: 2, distancia: 2, controle: 0 },
    postura: { ofensiva: 0, defensiva: 1 }, // 1 ponto de Postura (Nível 1) + 5 de Eixos = 6
    passives: [{ effectName: 'Garantir', weight: 1, scope: 'Esquivas com giro ou cambalhota', description: '' }],
  },
  {
    id: 'jiu_jitsu',
    name: 'Jiu-Jitsu',
    category: 'pronto',
    description: 'Foco total em levar o combate ao chão e finalizar através de agarrões e imobilizações.',
    pointsRequired: 6,
    eixos: { potencia: 0, robustez: 1, agilidade: 0, distancia: 0, controle: 4 },
    postura: { ofensiva: 0, defensiva: 1 }, // 1 ponto de Postura (Nível 1) + 5 de Eixos = 6
    passives: [{ effectName: 'Amplificar', weight: 2, scope: 'Manobras de imobilização já em andamento', description: '' }],
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
 * eixos/postura/passivas). Preserva o id do Estilo e o nome, SE o jogador já
 * tiver digitado um nome — senão usa o nome do catálogo.
 */
export function applyCatalogToStyle(existingStyle, catalogEntry) {
  return {
    ...existingStyle,
    name: existingStyle.name?.trim() ? existingStyle.name : catalogEntry.name,
    eixos: { ...catalogEntry.eixos },
    postura: { ...catalogEntry.postura },
    passives: catalogEntry.passives.map((p) => ({
      effectName: p.effectName,
      weight: p.weight,
      scope: p.scope ?? '',
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
  };
}