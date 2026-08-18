// src/data/skills.js
// Todas as perícias do sistema, agrupadas por categoria.
// Cada perícia tem um id único (usado em cálculos e nos pacotes/ocupações).

export const SKILL_CATEGORIES = {
  corpo: {
    label: 'Corpo',
    skills: ['forca', 'resistencia', 'constituicao', 'aparencia'],
  },
  sentidos: {
    label: 'Sentidos',
    skills: ['visao', 'audicao', 'olfato', 'prontidao'],
  },
  mente: {
    label: 'Mente',
    skills: ['percepcao', 'investigacao', 'intuicao', 'vontade'],
  },
  conhecimento: {
    label: 'Conhecimento',
    skills: ['primeiros_socorros', 'medicina', 'mundo_natural', 'memoria'],
  },
  profissao: {
    label: 'Profissão',
    skills: ['humanas', 'exatas', 'artes_visuais', 'labuta'],
  },
  utilidade: {
    label: 'Utilidade',
    skills: ['pontaria', 'dirigir', 'domarismo', 'crime'],
  },
  tecnologia: {
    label: 'Tecnologias',
    skills: ['consertos_mecanicos', 'engenharia', 'usar_eletronicos'],
  },
  miscelanea: {
    label: 'Miscelânea',
    skills: ['prestidigitacao', 'sobrevivencia', 'performance', 'culinaria'],
  },
  combate: {
    label: 'Combate',
    skills: ['combate', 'armas_brancas', 'armas_de_fogo', 'ocultismo'],
  },
  movimento: {
    label: 'Movimento',
    skills: ['terreno', 'atletismo', 'acrobacias', 'furtividade'],
  },
  social: {
    label: 'Social',
    skills: ['labia', 'charme', 'intimidar', 'atuacao'],
  },
};

// Lista plana de perícias com nome de exibição — útil para popular selects/modais.
export const SKILLS = {
  forca: { label: 'Força', category: 'corpo' },
  resistencia: { label: 'Resistência', category: 'corpo' },
  constituicao: { label: 'Constituição', category: 'corpo' },
  aparencia: { label: 'Aparência', category: 'corpo' },

  visao: { label: 'Visão', category: 'sentidos' },
  audicao: { label: 'Audição', category: 'sentidos' },
  olfato: { label: 'Olfato', category: 'sentidos' },
  prontidao: { label: 'Prontidão', category: 'sentidos' },

  percepcao: { label: 'Percepção', category: 'mente' },
  investigacao: { label: 'Investigação', category: 'mente' },
  intuicao: { label: 'Intuição', category: 'mente' },
  vontade: { label: 'Vontade', category: 'mente' },

  primeiros_socorros: { label: 'Primeiros Socorros', category: 'conhecimento' },
  medicina: { label: 'Medicina', category: 'conhecimento' },
  mundo_natural: { label: 'Mundo Natural', category: 'conhecimento' },
  memoria: { label: 'Memória', category: 'conhecimento' },

  humanas: { label: 'Ciências Humanas', category: 'profissao' },
  exatas: { label: 'Exatas', category: 'profissao' },
  artes_visuais: { label: 'Artes Visuais', category: 'profissao' },
  labuta: { label: 'Ofícios Manuais / Labuta', category: 'profissao' },

  pontaria: { label: 'Pontaria', category: 'utilidade' },
  dirigir: { label: 'Dirigir', category: 'utilidade' },
  domarismo: { label: 'Domarismo', category: 'utilidade' },
  crime: { label: 'Crime', category: 'utilidade' },

  consertos_mecanicos: { label: 'Consertos Mecânicos', category: 'tecnologia' },
  engenharia: { label: 'Engenharias', category: 'tecnologia' },
  usar_eletronicos: { label: 'Usar Eletrônicos', category: 'tecnologia' },

  prestidigitacao: { label: 'Prestidigitação', category: 'miscelanea' },
  sobrevivencia: { label: 'Sobrevivência', category: 'miscelanea' },
  performance: { label: 'Performance', category: 'miscelanea' },
  culinaria: { label: 'Culinária', category: 'miscelanea' },

  combate: { label: 'Combate', category: 'combate' },
  armas_brancas: { label: 'Armas Brancas', category: 'combate' },
  armas_de_fogo: { label: 'Armas de Fogo', category: 'combate' },
  ocultismo: { label: 'Ocultismo', category: 'combate' },

  terreno: { label: 'Terreno', category: 'movimento' },
  atletismo: { label: 'Atletismo', category: 'movimento' },
  acrobacias: { label: 'Acrobacias', category: 'movimento' },
  furtividade: { label: 'Furtividade', category: 'movimento' },

  labia: { label: 'Lábia', category: 'social' },
  charme: { label: 'Charme', category: 'social' },
  intimidar: { label: 'Intimidar', category: 'social' },
  atuacao: { label: 'Atuação', category: 'social' },
};

// Os 5 Atributos base (fixos, definem o potencial).
export const ATTRIBUTES = {
  existencia: { label: 'Existência' },
  destreza: { label: 'Destreza' },
  inteligencia: { label: 'Inteligência' },
  carisma: { label: 'Carisma' },
  sabedoria: { label: 'Sabedoria' },
};

// Conversão Nível de Perícia -> Dado de Teste.
// index = nível (0 a 9), value = descrição do dado.
// Níveis 7+ usam notação composta (ver characterCalculations.js p/ resolver a rolagem).
export const SKILL_LEVEL_TO_DICE = {
  0: 'd00', // sem treino: sempre em desvantagem
  1: 'd4',
  2: 'd6',
  3: 'd8',
  4: 'd10',
  5: 'd12',
  6: 'd20',
  7: 'd20/5d4', // narrativamente equivalente; ver regra de resolução
  8: '3d8/6d4',
  9: '3d8+d4/7d4',
  // 9+ : vantagem (rola duas vezes, fica com o maior)
};

/**
 * Agrupa uma lista de ids de perícia por categoria, seguindo a mesma ordem
 * e nomenclatura da ficha (Corpo, Sentidos, Mente, Conhecimento, Profissão,
 * Utilidade, Tecnologias, Miscelânea, Combate, Movimento, Social).
 * Só retorna categorias que tenham ao menos 1 perícia presente em skillIds.
 */
export function groupSkillsByCategory(skillIds) {
  const idSet = new Set(skillIds);
  return Object.entries(SKILL_CATEGORIES)
    .map(([categoryId, category]) => ({
      categoryId,
      label: category.label,
      skills: category.skills.filter((skillId) => idSet.has(skillId)),
    }))
    .filter((group) => group.skills.length > 0);
}