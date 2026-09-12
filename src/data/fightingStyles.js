// src/data/fightingStyles.js
// Estilo de Luta — todo personagem tem, mesmo com 0 pontos (Combate 0).
// Pontos = NÍVEL bruto da perícia Combate (não o valor do dado — é moeda
// de investimento, igual antecedentes), dobrado para o Arquétipo Artista Marcial.

export const ARTISTA_MARCIAL_ARCHETYPE_ID = 'artista_marcial'; // CONFIRMAR

// Os 4 Eixos — cada ponto soma direto, sem limite por eixo, só ativo
// enquanto o Estilo estiver ativo (Postura Ofensiva/Defensiva assumida).
export const FIGHTING_STYLE_AXES = {
  potencia: {
    label: 'Potência',
    description: 'Sobe 1 degrau o dado usado no cálculo de Dano Físico, por ponto.',
  },
  robustez: {
    label: 'Robustez',
    description: '+1 na Defesa Física (DT = 10 + dado de Constituição) contra Atordoamento, por ponto.',
  },
  agilidade: {
    label: 'Agilidade',
    description: '+1 Stamina extra (pra atacar ou esquivar), por ponto.',
  },
  distancia: {
    label: 'Distância',
    description: '1 uso por cena de reposicionamento sem gastar ação, por ponto.',
  },
};

// Postura — bônus mecânico só existe se houver pontos investidos NAQUELA
// postura específica dentro do Estilo. Postura Neutra nunca tem custo/bônus.
export const POSTURE_BONUSES = {
  ofensiva: {
    1: { effectName: 'Facilitar', description: 'Facilitar nos próprios ataques.' },
    2: { effectName: 'Amplificar', description: 'Amplificar nos próprios ataques.' },
  },
  defensiva: {
    1: { effectName: 'Garantir', description: 'Garantir nas próprias defesas.' },
    2: { effectName: 'Blindar', description: 'Blindar nas próprias defesas.' },
  },
};

// A cada 3 pontos investidos (Eixos + Postura somados) num mesmo Estilo,
// desbloqueia de graça 1 ponto de peso pra Passiva.
export const PASSIVE_POINTS_PER_UNLOCK = 3;
export const MAX_SINGLE_PASSIVE_WEIGHT = 2;

// Passivas de Estilo nunca podem ser Reverter ou Multiplicar (livro).
export const EXCLUDED_PASSIVE_EFFECTS = ['Reverter', 'Multiplicar'];