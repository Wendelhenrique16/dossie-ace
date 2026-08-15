// src/data/occupations.js
// Categorias de Ocupação — o jogador escolhe 2 (Primária + Secundária) para
// formar a profissão/estilo de vida do personagem.
//
// Bônus mecânicos (aplicados em logic/occupationBonuses.js):
//   Primária:   +5 em todas as perícias listadas, +2 no atributo da categoria
//   Secundária: +3 em todas as perícias listadas, +1 em atributo livre à escolha
//   Perícia repetida entre Primária e Secundária: soma total +8

export const OCCUPATION_CATEGORIES = {
  animal: {
    label: 'Animal',
    attribute: 'sabedoria',
    skills: ['domarismo', 'mundo_natural', 'labuta'],
  },
  comunicacao: {
    label: 'Comunicação',
    attribute: 'carisma',
    skills: ['labia', 'atuacao', 'intuicao'],
  },
  criativo: {
    label: 'Criativo',
    attribute: 'carisma',
    skills: ['artes_visuais', 'prestidigitacao', 'performance'],
  },
  criminoso: {
    label: 'Criminoso',
    attribute: 'destreza',
    skills: ['crime', 'intimidar', 'furtividade'],
  },
  educador: {
    label: 'Educador',
    attribute: 'inteligencia',
    skills: ['labia', 'humanas', 'exatas', 'memoria'],
  },
  empregado: {
    label: 'Empregado',
    attribute: 'existencia',
    skills: ['labuta', 'sobrevivencia', 'performance'],
  },
  engenharias: {
    label: 'Engenharias',
    attribute: 'inteligencia',
    skills: ['engenharia', 'exatas', 'memoria'],
  },
  exatas: {
    label: 'Exatas',
    attribute: 'inteligencia',
    skills: ['exatas', 'intuicao', 'memoria'],
  },
  fisico: {
    label: 'Físico',
    attribute: 'existencia',
    skills: ['forca', 'resistencia', 'atletismo'],
  },
  humanas: {
    label: 'Humanas',
    attribute: 'sabedoria',
    skills: ['humanas', 'memoria', 'intuicao'],
  },
  labuta: {
    label: 'Labuta',
    attribute: 'existencia',
    skills: ['labuta', 'resistencia', 'mundo_natural'],
  },
  lei: {
    label: 'Lei',
    attribute: 'inteligencia',
    skills: ['humanas', 'investigacao', 'labia'],
  },
  mistico: {
    label: 'Místico',
    attribute: 'sabedoria',
    skills: ['ocultismo', 'intuicao', 'vontade'],
  },
  negocios: {
    label: 'Negócios',
    attribute: 'carisma',
    skills: ['labia', 'humanas', 'exatas'],
  },
  pesquisador: {
    label: 'Pesquisador',
    attribute: 'inteligencia',
    skills: ['memoria', 'investigacao', 'vontade'],
  },
  politico: {
    label: 'Político',
    attribute: 'carisma',
    skills: ['humanas', 'labia', 'atuacao'],
  },
  religioso: {
    label: 'Religioso',
    attribute: 'sabedoria',
    skills: ['vontade', 'performance', 'humanas'],
  },
  saude: {
    label: 'Saúde',
    attribute: 'inteligencia',
    skills: ['primeiros_socorros', 'medicina', 'vontade'],
  },
  seguranca: {
    label: 'Segurança',
    attribute: 'destreza',
    skills: ['prontidao', 'armas_de_fogo', 'combate'],
  },
  tecnologias: {
    label: 'Tecnologias',
    attribute: 'inteligencia',
    skills: ['usar_eletronicos', 'engenharia', 'consertos_mecanicos'],
  },
  trabalho_manual: {
    label: 'Trabalho Manual',
    attribute: 'destreza',
    skills: ['labuta', 'prestidigitacao', 'consertos_mecanicos'],
  },
  vagabundo: {
    label: 'Vagabundo / Sem Ocupação',
    attribute: null,
    skills: [],
    description: 'Não concede pontos de Ocupação nem bônus em Atributos (opção narrativa).',
  },
};

export const OCCUPATION_BONUSES = {
  primary: { skillBonus: 5, attributeBonus: 2, attributeChoice: 'fixed' }, // atributo da própria categoria
  secondary: { skillBonus: 3, attributeBonus: 1, attributeChoice: 'free' }, // atributo livre à escolha
  overlapBonus: 8, // se a mesma perícia aparece nas duas categorias, soma total = 8 (não 5+3=8, já é o total)
};