// src/data/abilities.js
// Catálogo de Habilidades prontas. Gatilho (tipo), Forma do Custo e Nome do
// Efeito são sempre um dos valores das tabelas fixas do livro — só o
// "detalhe" do Gatilho e a descrição final do Efeito ficam livres, porque
// dependem do contexto narrativo específico de cada habilidade.

export const TRIGGER_TYPES = ['Ativo', 'Reativo'];

export const COST_FORMS_BY_WEIGHT = {
  1: ['1 Vigor', '1 Sanidade', '1 ação/reação (Stamina)'],
  2: ['2 Vigor', '1 Vigor + 1 Sanidade', '2 Sanidade'],
  3: ['Usar o turno inteiro', 'Debuff/penalidade em si mesmo', '3+ Vigor ou Sanidade combinados'],
};

export const COST_WEIGHT_LABELS = { 1: 'Leve', 2: 'Moderado', 3: 'Pesado' };

// As 8 opções de Efeito nomeado — peso fixo, não editável por design.
export const EFFECT_DEFINITIONS = {
  Facilitar: { weight: 1, description: 'Rebaixa em 1 o grau de sucesso exigido numa ação específica.' },
  Agilizar: { weight: 1, description: 'A ação específica gasta 1 ação a menos que o padrão.' },
  Garantir: { weight: 1, description: 'Remove a possibilidade de Falha Crítica numa ação específica.' },
  Amplificar: { weight: 2, description: 'Um sucesso normal numa ação específica é tratado como Sucesso Bom (falhas não mudam).' },
  Blindar: { weight: 2, description: 'Ignora, por uma cena, uma penalidade/debuff acumulado de um tipo específico.' },
  Compensar: { weight: 2, description: 'Uma falha específica pode ser tratada como sucesso parcial em outra coisa relacionada.' },
  Reverter: { weight: 3, description: 'Uma falha específica é tratada como sucesso normal.' },
  Multiplicar: { weight: 3, description: 'Dobra o efeito de um sucesso já obtido numa ação específica.' },
};

export function getEffectWeight(names) {
  return Math.max(...names.map((n) => EFFECT_DEFINITIONS[n]?.weight ?? 1));
}

const ability = (id, name, category, triggerType, triggerDetail, cost, effectNames, extra = {}) => ({
  id,
  name,
  category,
  trigger: { type: triggerType, detail: triggerDetail },
  conditional: null,
  cost,
  effect: { weight: getEffectWeight(effectNames), names: effectNames },
  ...extra,
});

export const ABILITIES = {
  // ---- COMBATE ----
  manobra_agil: ability('manobra_agil', 'Manobra Ágil', 'combate', 'Ativo', 'antes de Derrubar, Imobilizar ou Desarmar',
    { weight: 1, form: '1 Vigor' }, ['Agilizar']),

  chuva_de_golpes: {
    ...ability('chuva_de_golpes', 'Chuva de Golpes', 'combate', 'Ativo', 'ao focar todos os ataques no mesmo alvo',
      { weight: 2, form: '2 Vigor' }, ['Blindar']),
    conditional: { description: 'O alvo está atordoado, desequilibrado ou flanqueado', costReduction: 1 },
  },

  ambidestria: ability('ambidestria', 'Ambidestria', 'combate', 'Ativo', '',
    { weight: 2, form: '2 Vigor' }, ['Blindar']),

  revidar: {
    ...ability('revidar', 'Revidar', 'combate', 'Reativo', 'logo após Esquivar ou Bloquear com sucesso',
      { weight: 1, form: '1 Vigor' }, ['Facilitar']),
    conditional: { description: 'O atacante está a alcance corpo a corpo', costReduction: 'zera' },
  },

  recuo_controlado: ability('recuo_controlado', 'Recuo Controlado', 'combate', 'Ativo', 'ao atirar em rajada',
    { weight: 2, form: '2 Vigor' }, ['Blindar']),

  evasao_perfeita: ability('evasao_perfeita', 'Evasão Perfeita', 'combate', 'Reativo', 'ao rolar defesa contra um ataque físico',
    { weight: 2, form: '2 Vigor' }, ['Amplificar']),

  golpe_certeiro: {
    ...ability('golpe_certeiro', 'Golpe Certeiro', 'combate', 'Ativo', 'antes de um ataque preparado, sem ter se movido no turno',
      { weight: 2, form: '2 Vigor' }, ['Facilitar', 'Garantir']),
    conditional: { description: 'Não se moveu neste turno', costReduction: 1 },
  },

  recarga_rapida: ability('recarga_rapida', 'Recarga Rápida', 'combate', 'Ativo', 'ao trocar o carregador ou recarregar munição',
    { weight: 1, form: '1 Vigor' }, ['Agilizar']),

  saque_rapido: ability('saque_rapido', 'Saque Rápido', 'combate', 'Ativo', 'no momento de sacar a arma',
    { weight: 1, form: '1 Vigor' }, ['Agilizar']),

  mira_rapida: ability('mira_rapida', 'Mira Rápida', 'combate', 'Ativo', 'antes de realizar um disparo',
    { weight: 1, form: '1 Vigor' }, ['Agilizar']),

  improviso_letal: ability('improviso_letal', 'Improviso Letal', 'combate', 'Ativo', 'ao usar um item fora do padrão como arma',
    { weight: 1, form: '1 Vigor' }, ['Amplificar']),

  reflexo_de_arremesso: ability('reflexo_de_arremesso', 'Reflexo de Arremesso', 'combate', 'Ativo', 'antes de arremessar um objeto que não é arma de arremesso dedicada',
    { weight: 1, form: '1 Vigor' }, ['Garantir']),

  // ---- MOVIMENTO E FURTIVIDADE ----
  passo_de_sombra: {
    ...ability('passo_de_sombra', 'Passo de Sombra', 'movimento', 'Reativo', 'logo após um ataque furtivo',
      { weight: 1, form: '1 ação/reação (Stamina)' }, ['Agilizar']),
    conditional: { description: 'Sem armadura pesada e sob cobertura', costReduction: 'zera' },
  },

  salto_calculado: ability('salto_calculado', 'Salto Calculado', 'movimento', 'Ativo', 'antes de um salto, escalada ou acrobacia',
    { weight: 1, form: '1 Vigor' }, ['Garantir']),

  fuga_agil: ability('fuga_agil', 'Fuga Ágil', 'movimento', 'Reativo', 'ao tentar se afastar de um perigo iminente',
    { weight: 1, form: '1 ação/reação (Stamina)' }, ['Agilizar']),

  acrobata_nato: ability('acrobata_nato', 'Acrobata Nato', 'movimento', 'Ativo', 'antes de um teste de Acrobacias envolvendo cambalhotas, saltos ou manobras aéreas',
    { weight: 1, form: '1 Vigor' }, ['Amplificar']),

  queda_controlada: ability('queda_controlada', 'Queda Controlada', 'movimento', 'Reativo', 'ao sofrer uma queda ou ser derrubado',
    { weight: 1, form: '1 Vigor' }, ['Garantir']),

  // ---- SOCIAL ----
  leitura_de_sala: ability('leitura_de_sala', 'Leitura de Sala', 'social', 'Ativo', 'ao entrar em um ambiente social novo',
    { weight: 1, form: '1 Sanidade' }, ['Facilitar']),

  blefe_perfeito: ability('blefe_perfeito', 'Blefe Perfeito', 'social', 'Ativo', 'antes de mentir ou blefar',
    { weight: 2, form: '2 Sanidade' }, ['Amplificar']),

  presenca_imponente: ability('presenca_imponente', 'Presença Imponente', 'social', 'Ativo', 'antes de intimidar',
    { weight: 1, form: '1 Vigor' }, ['Garantir']),

  // ---- MENTAL E SANIDADE ----
  compartimentalizar: ability('compartimentalizar', 'Compartimentalizar', 'mental', 'Reativo', 'ao sofrer uma perda de Sanidade',
    { weight: 2, form: '2 Vigor' }, ['Blindar']),

  foco_em_crise: {
    ...ability('foco_em_crise', 'Foco em Crise', 'mental', 'Reativo', 'ao falhar em um teste de Vontade',
      { weight: 3, form: '3+ Vigor ou Sanidade combinados' }, ['Reverter']),
    conditional: { description: 'O Vigor está abaixo da metade', costReduction: 1 },
  },

  // ---- UTILIDADE E SUPORTE ----
  gambiarra_rapida: ability('gambiarra_rapida', 'Gambiarra Rápida', 'utilidade', 'Ativo', 'ao reparar algo sob pressão',
    { weight: 1, form: '1 Vigor' }, ['Agilizar']),

  olho_clinico: ability('olho_clinico', 'Olho Clínico', 'utilidade', 'Ativo', 'ao investigar uma cena',
    { weight: 1, form: '1 Sanidade' }, ['Compensar']),

  preparo_tatico: ability('preparo_tatico', 'Preparo Tático', 'utilidade', 'Ativo', 'ao montar explosivos, armadilhas ou dispositivos improvisados',
    { weight: 1, form: '1 Vigor' }, ['Garantir']),

  primeiros_socorros_de_combate: {
    ...ability('primeiros_socorros_de_combate', 'Primeiros Socorros de Combate', 'utilidade', 'Ativo', 'ao tratar um aliado sangrando sob fogo',
      { weight: 2, form: '2 Vigor' }, ['Agilizar', 'Garantir']),
    conditional: { description: 'Dividindo a mesma cobertura que o aliado', costReduction: 1 },
  },

  instinto_de_sobrevivencia: ability('instinto_de_sobrevivencia', 'Instinto de Sobrevivência', 'utilidade', 'Reativo', 'ao sofrer dano que engatilhe uma Condição grave',
    { weight: 2, form: '2 Vigor' }, ['Amplificar']),

  // ---- MODELOS (o jogador preenche o contexto entre colchetes) ----
  modelo_maestria: ability('modelo_maestria', 'Maestria', 'modelo', 'Ativo', '',
    { weight: 1, form: '1 Vigor' }, ['Facilitar'], { hasContext: true, contextLabel: 'ação, item ou situação' }),

  modelo_agilizar: ability('modelo_agilizar', 'Agilizar', 'modelo', 'Ativo', '',
    { weight: 1, form: '1 Vigor' }, ['Agilizar'], { hasContext: true, contextLabel: 'ação específica' }),

  modelo_automatizar: {
    ...ability('modelo_automatizar', 'Automatizar', 'modelo', 'Ativo', '',
      { weight: 1, form: '1 Vigor' }, ['Garantir'], { hasContext: true, contextLabel: 'ação repetitiva' }),
    conditional: { description: 'A ação já foi feita pelo menos uma vez nessa cena', costReduction: 'zera' },
  },

  modelo_improvisar: ability('modelo_improvisar', 'Improvisar com', 'modelo', 'Ativo', '',
    { weight: 1, form: '1 Vigor' }, ['Amplificar'], { hasContext: true, contextLabel: 'item fora do padrão' }),

  modelo_maestria_pressao: {
    ...ability('modelo_maestria_pressao', 'Maestria sob Pressão', 'modelo', 'Reativo', 'em uma situação de perigo iminente/pressão',
      { weight: 2, form: '1 Vigor + 1 Sanidade' }, ['Agilizar', 'Amplificar'], { hasContext: true, contextLabel: 'ação + perícia' }),
    conditional: { description: 'Só utilizável enquanto estiver sob a condição de pressão descrita', costReduction: 1 },
  },

  modelo_condicionamento: ability('modelo_condicionamento', 'Condicionamento de', 'modelo', 'Ativo', '',
    { weight: 1, form: '1 Vigor' }, ['Blindar'], { hasContext: true, contextLabel: 'tipo de esforço físico' }),

  modelo_mobilidade: ability('modelo_mobilidade', 'Mobilidade em', 'modelo', 'Ativo', '',
    { weight: 1, form: '1 ação/reação (Stamina)' }, ['Garantir'], { hasContext: true, contextLabel: 'ação de deslocamento' }),
};

export const ABILITY_CATEGORY_LABELS = {
  combate: 'Combate',
  movimento: 'Movimento e Furtividade',
  social: 'Social',
  mental: 'Mental e Sanidade',
  utilidade: 'Utilidade e Suporte',
  modelo: 'Modelos (preencha o contexto)',
};

export function groupAbilitiesByCategory() {
  const groups = {};
  Object.values(ABILITIES).forEach((a) => {
    if (!groups[a.category]) groups[a.category] = [];
    groups[a.category].push(a);
  });
  return Object.entries(groups).map(([categoryId, abilities]) => ({
    categoryId,
    label: ABILITY_CATEGORY_LABELS[categoryId] ?? categoryId,
    abilities,
  }));
}