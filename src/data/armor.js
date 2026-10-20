// src/data/armor.js
// Armaduras e escudos prontos (Livro do Jogador: Frágil/Médio/Robusto/Pesado e tipos de dano).
// Fonte: ace_listas_prontas (19/10/2026). Itens marcados (livro) vs (proposta) ficam em `source`.
// Resistente a = todos os Tipos de Dano que não estão em `weakTo`.

export const ARMOR_DAMAGE_TYPES = ["Contundente", "Cortante", "Perfurante", "Incendiário / Fogo", "Elétrico", "Tóxico / Biológico", "Corrosivo / Ácido"];

// Vigor e Limiar por Categoria (tabela de Vigor Estrutural). Pesado: o livro diz 60 a 80+, então 60 é só o ponto de partida editável.
export const ARMOR_CATEGORIES = [
  { id: 'fragil', label: 'Frágil', vigor: 6 },
  { id: 'medio', label: 'Médio', vigor: 16 },
  { id: 'robusto', label: 'Robusto', vigor: 36 },
  { id: 'pesado', label: 'Pesado / Industrial', vigor: 60 },
];
export const ARMOR_CATEGORY_BY_ID = Object.fromEntries(ARMOR_CATEGORIES.map((c) => [c.id, c]));

export const ARMOR_ERAS = ['Cotidiano', 'Medieval', 'Moderno', 'Especial'];

export const ARMOR_CATALOG = [
  { id: "roupa_grossa_casaco_de_couro", name: "Roupa Grossa / Casaco de Couro", era: "Cotidiano", category: "fragil", weakTo: ["Contundente", "Perfurante", "Incendiário / Fogo", "Tóxico / Biológico", "Corrosivo / Ácido"], description: "Casaco pesado ou jaqueta de couro que protege de cortes e arranhões.", source: "proposta" },
  { id: "armadura_de_sucata", name: "Armadura de Sucata", era: "Cotidiano", category: "medio", weakTo: ["Perfurante", "Elétrico", "Tóxico / Biológico", "Corrosivo / Ácido"], description: "Chapas, pneus e peças amarradas ou soldadas ao corpo.", source: "proposta" },
  { id: "escudo_improvisado", name: "Escudo Improvisado", era: "Cotidiano", category: "fragil", weakTo: ["Perfurante", "Incendiário / Fogo", "Corrosivo / Ácido"], description: "Porta, tampo de mesa ou tampa de metal segurada à frente do corpo.", source: "proposta" },
  { id: "gibao_acolchoado", name: "Gibão Acolchoado", era: "Medieval", category: "fragil", weakTo: ["Perfurante", "Incendiário / Fogo", "Tóxico / Biológico", "Corrosivo / Ácido"], description: "Casaco de tecido grosso e acolchoado que amortece pancadas e cortes.", source: "proposta" },
  { id: "couro_reforcado", name: "Couro Reforçado", era: "Medieval", category: "medio", weakTo: ["Perfurante", "Incendiário / Fogo", "Tóxico / Biológico", "Corrosivo / Ácido"], description: "Couro endurecido e preso com tachas de metal.", source: "proposta" },
  { id: "cota_de_malha", name: "Cota de Malha", era: "Medieval", category: "medio", weakTo: ["Contundente", "Perfurante", "Elétrico", "Tóxico / Biológico", "Corrosivo / Ácido"], description: "Túnica de anéis de metal entrelaçados.", source: "proposta" },
  { id: "armadura_de_placas", name: "Armadura de Placas", era: "Medieval", category: "robusto", weakTo: ["Contundente", "Elétrico", "Tóxico / Biológico", "Corrosivo / Ácido"], description: "Placas de aço articuladas que cobrem o corpo inteiro.", source: "proposta" },
  { id: "escudo_de_madeira", name: "Escudo de Madeira", era: "Medieval", category: "medio", weakTo: ["Cortante", "Incendiário / Fogo", "Corrosivo / Ácido"], description: "Escudo de tábuas reforçadas com aro de ferro.", source: "proposta" },
  { id: "escudo_de_aco_paves", name: "Escudo de Aço / Pavês", era: "Medieval", category: "robusto", weakTo: ["Elétrico", "Corrosivo / Ácido"], description: "Escudo grande de aço que cobre o corpo de quem se abriga atrás dele.", source: "proposta" },
  { id: "colete_balistico", name: "Colete Balístico", era: "Moderno", category: "medio", weakTo: ["Contundente", "Tóxico / Biológico", "Corrosivo / Ácido"], description: "Colete de fibra balística, usado sob a roupa ou por cima.", source: "proposta" },
  { id: "traje_antimotim", name: "Traje Antimotim", era: "Moderno", category: "medio", weakTo: ["Perfurante", "Incendiário / Fogo", "Corrosivo / Ácido"], description: "Proteção rígida e acolchoada com capacete e protetores de membros.", source: "proposta" },
  { id: "colete_de_placas", name: "Colete de Placas", era: "Moderno", category: "robusto", weakTo: ["Contundente", "Elétrico", "Tóxico / Biológico", "Corrosivo / Ácido"], description: "Colete com placas de cerâmica ou aço sobre o tronco.", source: "proposta" },
  { id: "armadura_tatica_completa", name: "Armadura Tática Completa", era: "Moderno", category: "robusto", weakTo: ["Elétrico", "Corrosivo / Ácido"], description: "Conjunto blindado com capacete, placas e proteção de braços e pernas.", source: "proposta" },
  { id: "escudo_antimotim", name: "Escudo Antimotim", era: "Moderno", category: "medio", weakTo: ["Perfurante", "Incendiário / Fogo", "Corrosivo / Ácido"], description: "Escudo transparente de policarbonato.", source: "proposta" },
  { id: "escudo_balistico", name: "Escudo Balístico", era: "Moderno", category: "robusto", weakTo: ["Corrosivo / Ácido"], description: "Escudo de blindagem balística com visor.", source: "proposta" },
  { id: "traje_antichamas", name: "Traje Antichamas", era: "Especial", category: "medio", weakTo: ["Cortante", "Perfurante", "Tóxico / Biológico", "Corrosivo / Ácido"], description: "Traje de bombeiro ou de fundição, com revestimento contra calor.", source: "proposta" },
  { id: "traje_anti_quimico", name: "Traje Anti-Químico", era: "Especial", category: "fragil", weakTo: ["Contundente", "Cortante", "Perfurante", "Incendiário / Fogo"], description: "Macacão vedado, com máscara e luvas, contra agentes químicos e biológicos.", source: "proposta" },
];

export const ARMOR_BY_ID = Object.fromEntries(ARMOR_CATALOG.map((a) => [a.id, a]));

/** Estado da armadura guardado no item do Inventário (item.armor). */
export function createArmorState(entry) {
  const category = entry?.category ?? 'medio';
  const vigor = ARMOR_CATEGORY_BY_ID[category]?.vigor ?? 16;
  return { category, vigorMax: vigor, vigorCurrent: vigor, weakTo: [...(entry?.weakTo ?? [])] };
}

export function getResistantTypes(weakTo = []) {
  return ARMOR_DAMAGE_TYPES.filter((t) => !weakTo.includes(t));
}