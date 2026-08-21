// src/data/caminhos.js
// Caminhos do sistema ACE. Não concedem bônus fixo de Atributo/Perícia —
// só uma Vantagem situacional em testes específicos.
// `description` fica vazio de propósito (texto final é do design).

export const CAMINHOS = {
  curta_distancia: {
    id: 'curta_distancia',
    label: 'Curta Distância',
    description: '', // TODO: texto do caminho (design)
    vantagem: 'Vantagem em testes de Combate contra alvos a 10 metros ou menos.',
  },
  longa_distancia: {
    id: 'longa_distancia',
    label: 'Longa Distância',
    description: '',
    vantagem: 'Vantagem em testes de Combate à distância contra alvos além de 10 metros.',
  },
  paranormal: {
    id: 'paranormal',
    label: 'Paranormal',
    description: '',
    vantagem: 'Vantagem em testes envolvendo manipular, entender ou negociar com Entidades.',
  },
  medico: {
    id: 'medico',
    label: 'Médico',
    description: '',
    vantagem: 'Vantagem em testes de Primeiros Socorros ou Medicina ao tratar outra pessoa.',
  },
};