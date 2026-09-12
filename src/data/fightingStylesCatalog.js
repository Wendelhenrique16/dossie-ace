// src/data/fightingStylesCatalog.js
// Catálogo de APOIO pro Estilo de Luta — igual ao de Habilidades: alguns
// prontos pra usar direto, um "modelo" em branco pra preencher o conceito,
// e sempre a opção de criar 100% do zero (motor livre já existe em
// characterCalculations.js, não depende deste catálogo).
//
// IMPORTANTE: os valores de eixos/postura aqui são só EXEMPLOS/placeholder —
// cada entrada assume um total de pontos investidos (ver `pointsRequired`)
// e a tela de criação deve avisar se o personagem não tem pontos suficientes
// pra aplicar o estilo como está (aí cabe reduzir manualmente).

export const FIGHTING_STYLE_CATALOG = [
  {
    id: 'boxe',
    name: 'Boxe',
    category: 'pronto',
    description: 'Estilo ofensivo baseado em socos, deslocamento de guarda e pressão constante.',
    pointsRequired: 6,
    eixos: { potencia: 2, robustez: 1, agilidade: 1, distancia: 0 },
    postura: { ofensiva: 2, defensiva: 0 },
    // 6 pontos investidos / 3 por passiva = orçamento de 2 de peso.
    passives: [{ effectName: 'Agilizar', weight: 1 }],
  },
  {
    id: 'capoeira',
    name: 'Capoeira',
    category: 'pronto',
    description: 'Estilo evasivo e imprevisível, prioriza reposicionamento e golpes de oportunidade.',
    pointsRequired: 6,
    eixos: { potencia: 0, robustez: 0, agilidade: 2, distancia: 2 },
    postura: { ofensiva: 0, defensiva: 2 },
    passives: [{ effectName: 'Garantir', weight: 1 }],
  },
  {
    id: 'krav_maga',
    name: 'Krav Maga',
    category: 'pronto',
    description: 'Foco em neutralização rápida e eficiente, sem floreios — resolver o confronto o quanto antes.',
    pointsRequired: 9,
    eixos: { potencia: 1, robustez: 1, agilidade: 1, distancia: 0 },
    postura: { ofensiva: 3, defensiva: 0 },
    // 9 pontos / 3 = orçamento de 3 de peso, respeitando teto de 2 por passiva.
    passives: [
      { effectName: 'Amplificar', weight: 2 },
      { effectName: 'Facilitar', weight: 1 },
    ],
  },
  {
    id: 'modelo_generico',
    name: '[Nome do Estilo]',
    category: 'modelo',
    description: 'Modelo em branco — preencha o nome e distribua os pontos conforme o conceito do personagem.',
    pointsRequired: 0,
    eixos: { potencia: 0, robustez: 0, agilidade: 0, distancia: 0 },
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
 * Cria uma instância de Estilo pro personagem a partir de uma entrada do
 * catálogo (pronto, modelo ou em branco). Sempre gera instanceId novo —
 * o catálogo nunca é mutado, só serve de template.
 */
export function instantiateStyleFromCatalog(catalogEntry) {
  return {
    id: `${Date.now()}-${Math.random()}`,
    name: catalogEntry?.name === '[Nome do Estilo]' ? '' : catalogEntry?.name ?? '',
    eixos: { ...(catalogEntry?.eixos ?? { potencia: 0, robustez: 0, agilidade: 0, distancia: 0 }) },
    postura: { ...(catalogEntry?.postura ?? { ofensiva: 0, defensiva: 0 }) },
    passives: (catalogEntry?.passives ?? []).map((p) => ({ ...p })),
  };
}

export function createBlankStyle() {
  return instantiateStyleFromCatalog(null);
}