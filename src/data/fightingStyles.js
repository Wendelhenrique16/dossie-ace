// src/data/fightingStyles.js
// Estilo de Luta — todo personagem tem, mesmo com 0 pontos (Combate 0).
// Pontos totais = NÍVEL bruto da perícia Combate (não o valor do dado — é
// moeda de investimento, igual antecedentes), dobrado para o Arquétipo
// Artista Marcial. Distribuídos entre 5 Eixos e Postura.

export const ARTISTA_MARCIAL_ARCHETYPE_ID = 'artista_marcial'; // CONFIRMAR contra archetypeBonuses.js

// Tabela de Bônus universal — pontos investidos → dado bônus somado.
// Reaproveitável por qualquer mecânica futura, não é exclusiva de Estilo.
// Sem notação composta (nível 7-9 de perícia): aqui não é escolha de
// rolagem, é só "que dado somar", então trava em d20 no 6º ponto.
export const BONUS_TABLE_DICE_FACES = { 1: 4, 2: 6, 3: 8, 4: 10, 5: 12 };
export const BONUS_TABLE_CAP_FACE = 20; // 6+ pontos

// Os 5 Eixos.
export const FIGHTING_STYLE_AXES = {
  potencia: {
    label: 'Potência',
    description: 'Soma o Dado de Potência (Tabela de Bônus) no Dano Físico.',
  },
  robustez: {
    label: 'Robustez',
    description: 'Soma o Dado de Robustez na resistência a Atordoamento (rola junto com o dado de Constituição).',
  },
  agilidade: {
    label: 'Agilidade',
    description: 'Cada ponto concede 1 Reação gratuita por turno (Esquiva/Bloqueio/Aparar/Contra-ataque sem custo de Stamina).',
  },
  distancia: {
    label: 'Distância',
    description: '1 uso por cena de reposicionamento em combate sem gastar ação, por ponto.',
  },
  controle: {
    label: 'Controle',
    description: 'Soma o Dado de Controle no Teste Oposto de Manobra (agarrar/empurrar/derrubar/imobilizar), pra manter ou escapar.',
  },
};

// Eixos que usam a Tabela de Bônus (somam um dado). Agilidade e Distância
// ficam de fora — são contadores de uso, não dados somados.
export const DICE_BONUS_AXES = ['potencia', 'robustez', 'controle'];

// Postura — custo escalonado: Nível 1 = 1 ponto, Nível 2 = 2 pontos
// ADICIONAIS (3 pontos investidos no total pra ter Nível 2).
export const POSTURE_LEVEL_THRESHOLDS = { 1: 1, 2: 3 };

export const POSTURE_EFFECTS = {
  ofensiva: {
    1: { staminaDiscount: 1, description: 'Ataques deste Estilo custam -1 Stamina (piso 0). Primeiro ataque do turno ignora penalidade de sequência.' },
    2: { staminaDiscount: 2, description: 'Ataques deste Estilo custam -2 Stamina (piso 0). Primeiro ataque do turno ignora penalidade de sequência.' },
  },
  defensiva: {
    1: { prontidaoDivisor: 2, description: 'Ao sofrer dano físico, rola Prontidão, divide por 2 (arred. pra cima), reduz do dano.' },
    2: { prontidaoDivisor: 1, description: 'Ao sofrer dano físico, rola Prontidão inteiro (sem dividir), reduz do dano.' },
  },
};

// Passivas de Estilo nunca podem ser Reverter ou Multiplicar (livro).
// Alteração de Tipo de Dano (ex: golpes tratados como Cortante em vez de
// Contundente) foi considerada, mas fica de fora do código por enquanto —
// não existe estrutura de dados de Tipos de Dano ainda, ficaria vago
// demais como campo livre. Fica só Escopo (texto) + Efeito nomeado.
export const EXCLUDED_PASSIVE_EFFECTS = ['Reverter', 'Multiplicar'];

// A cada 3 pontos investidos (Eixos + Postura somados) num mesmo Estilo,
// desbloqueia de graça 1 ponto de peso pra Passiva.
export const PASSIVE_POINTS_PER_UNLOCK = 3;
export const MAX_SINGLE_PASSIVE_WEIGHT = 2;

// Categorias de Escopo pra Passiva de Estilo — "Outro" cobre o que não encaixa.
export const PASSIVE_CATEGORIES = [
  'Socos', 'Chutes', 'Cotoveladas', 'Joelhadas', 'Agarrões', 'Armas Brancas', 'Defesas', 'Outro',
];