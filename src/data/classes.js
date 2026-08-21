// src/data/classes.js
// Classes e Arquétipos do sistema ACE.
// `description` fica vazio de propósito — texto final é responsabilidade
// do design (ver placeholder na UI). Bônus mecânicos já estão fechados.

export const CLASSES = {
  lutador: {
    id: 'lutador',
    label: 'Lutador',
    description: '', // TODO: texto da classe (design)
    classBonus: {
      attributeBonuses: { destreza: 2 },
      skillBonuses: { forca: 2 },
      // "+2 em Combate, Armas Brancas ou Armas de Fogo" — jogador escolhe 1
      skillChoice: { options: ['combate', 'armas_brancas', 'armas_de_fogo'], amount: 2 },
      specialtyPoints: 1,
    },
    archetypes: [
      {
        id: 'parrudo',
        label: 'Parrudo',
        description: '', // TODO: texto do arquétipo (design)
        bonus: { skillBonuses: { forca: 2, constituicao: 2 } },
      },
      {
        id: 'artista_marcial',
        label: 'Artista Marcial',
        description: '',
        bonus: { skillBonuses: { combate: 2, prontidao: 2 } },
        note: 'Domina uma arte marcial à escolha.',
      },
      {
        id: 'assassino_silencioso',
        label: 'Assassino Silencioso',
        description: '',
        bonus: { skillBonuses: { furtividade: 2, prontidao: 2 } },
        note: 'Ataques furtivos críticos facilitados.',
      },
      {
        id: 'atirador_de_elite',
        label: 'Atirador de Elite',
        description: '',
        bonus: {
          attributeBonuses: { destreza: 2 },
          skillBonuses: { pontaria: 2, armas_de_fogo: 2 },
        },
      },
      {
        id: 'veterano',
        label: 'Veterano',
        description: '',
        bonus: {
          attributeBonuses: { existencia: 2 },
          skillBonuses: { resistencia: 2, sobrevivencia: 2 },
        },
      },
    ],
  },

  ocultista: {
    id: 'ocultista',
    label: 'Ocultista',
    description: '', // TODO: texto da classe (design)
    classBonus: {
      attributeBonuses: { sabedoria: 2 },
      skillBonuses: { ocultismo: 2, vontade: 2, intuicao: 2 },
      specialtyPoints: 1,
    },
    archetypes: [
      {
        id: 'religioso',
        label: 'Religioso',
        description: '',
        bonus: { skillBonuses: { vontade: 2, labia: 2 } },
        note: 'Armas religiosas causam dano extra contra Entidades.',
      },
      {
        id: 'pactario',
        label: 'Pactário',
        description: '',
        bonus: {
          attributeBonuses: { carisma: 2 },
          skillBonuses: { ocultismo: 2, intimidar: 2 },
        },
      },
      {
        id: 'vidente',
        label: 'Vidente',
        description: '',
        bonus: {
          attributeBonuses: { sabedoria: 2 },
          skillBonuses: { intuicao: 2, percepcao: 2 },
        },
      },
      {
        id: 'ritualista',
        label: 'Ritualista',
        description: '',
        bonus: {
          attributeBonuses: { inteligencia: 2 },
          skillBonuses: { ocultismo: 2, exatas: 2 },
        },
      },
    ],
  },

  suporte: {
    id: 'suporte',
    label: 'Suporte',
    description: '', // TODO: texto da classe (design)
    classBonus: {
      attributeBonuses: { inteligencia: 2 },
      skillBonuses: { primeiros_socorros: 2, medicina: 2, armas_de_fogo: 2 },
      specialtyPoints: 2,
    },
    archetypes: [
      {
        id: 'engenheiro',
        label: 'Engenheiro',
        description: '',
        bonus: {
          attributeBonuses: { inteligencia: 2 },
          skillBonuses: { consertos_mecanicos: 3, usar_eletronicos: 3 },
        },
        note: 'Único Arquétipo capaz de modificar/criar equipamentos (ver Arsenal).',
      },
      {
        id: 'investigador',
        label: 'Investigador',
        description: '',
        bonus: {
          attributeBonuses: { inteligencia: 2 },
          skillBonuses: { investigacao: 2, percepcao: 2, intuicao: 2 },
        },
      },
      {
        id: 'medico_de_campo',
        label: 'Médico de Campo',
        description: '',
        bonus: {
          attributeBonuses: { existencia: 2 },
          skillBonuses: { primeiros_socorros: 2, vontade: 2 },
        },
      },
      {
        id: 'negociador',
        label: 'Negociador',
        description: '',
        bonus: {
          attributeBonuses: { carisma: 2 },
          skillBonuses: { labia: 2, intuicao: 2 },
        },
      },
    ],
  },
};

export function getArchetypesForClass(classId) {
  return CLASSES[classId]?.archetypes ?? [];
}