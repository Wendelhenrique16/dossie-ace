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

// description = texto específico dessa habilidade (o que ela faz na prática),
// pré-preenchido no campo editável "Descrição" ao escolher do catálogo.
// EFFECT_DEFINITIONS[nome].description é o texto GENÉRICO do Efeito em si
// (o que "Facilitar" significa em qualquer habilidade) — não editável,
// mostrado como legenda de apoio.
const ability = (id, name, category, triggerType, triggerDetail, cost, effectNames, description, extra = {}) => ({
  id,
  name,
  category,
  trigger: { type: triggerType, detail: triggerDetail },
  conditional: null,
  cost,
  effect: { weight: getEffectWeight(effectNames), names: effectNames, description },
  ...extra,
});

export const ABILITIES = {
  // ---- COMBATE ----
  manobra_agil: ability('manobra_agil', 'Manobra Ágil', 'combate', 'Ativo', 'antes de Derrubar, Imobilizar ou Desarmar',
    { weight: 1, form: '1 Vigor' }, ['Agilizar'], 'A manobra de combate gasta 1 ação a menos.'),

  chuva_de_golpes: {
    ...ability('chuva_de_golpes', 'Chuva de Golpes', 'combate', 'Ativo', 'ao focar todos os ataques no mesmo alvo',
      { weight: 2, form: '2 Vigor' }, ['Blindar'], 'Ignora a penalidade acumulada por realizar múltiplos ataques corpo a corpo no mesmo turno.'),
    conditional: { description: 'O alvo está atordoado, desequilibrado ou flanqueado', costReduction: 1 },
  },

  ambidestria: ability('ambidestria', 'Ambidestria', 'combate', 'Ativo', '',
    { weight: 2, form: '2 Vigor' }, ['Blindar'], 'Ignora a penalidade por atacar com duas armas diferentes no mesmo turno.'),

  revidar: {
    ...ability('revidar', 'Revidar', 'combate', 'Reativo', 'logo após Esquivar ou Bloquear com sucesso',
      { weight: 1, form: '1 Vigor' }, ['Facilitar'], 'Rebaixa em 1 o grau de sucesso exigido no ataque de resposta imediata.'),
    conditional: { description: 'O atacante está a alcance corpo a corpo', costReduction: 'zera' },
  },

  recuo_controlado: ability('recuo_controlado', 'Recuo Controlado', 'combate', 'Ativo', 'ao atirar em rajada',
    { weight: 2, form: '2 Vigor' }, ['Blindar'], 'Ignora a penalidade de recuo ao disparar em modo Automático ou usar Fogo de Supressão.'),

  evasao_perfeita: ability('evasao_perfeita', 'Evasão Perfeita', 'combate', 'Reativo', 'ao rolar defesa contra um ataque físico',
    { weight: 2, form: '2 Vigor' }, ['Amplificar'], 'Um Sucesso normal na Esquiva é tratado como Sucesso Bom.'),

  golpe_certeiro: {
    ...ability('golpe_certeiro', 'Golpe Certeiro', 'combate', 'Ativo', 'antes de um ataque preparado, sem ter se movido no turno',
      { weight: 2, form: '2 Vigor' }, ['Facilitar', 'Garantir'], 'Rebaixa em 1 o grau de sucesso exigido pra acertar um ponto vital, e essa rolagem não pode cair em Falha Crítica.'),
    conditional: { description: 'Não se moveu neste turno', costReduction: 1 },
  },

  recarga_rapida: ability('recarga_rapida', 'Recarga Rápida', 'combate', 'Ativo', 'ao trocar o carregador ou recarregar munição',
    { weight: 1, form: '1 Vigor' }, ['Agilizar'], 'A ação de recarregar gasta 1 ação a menos.'),

  saque_rapido: ability('saque_rapido', 'Saque Rápido', 'combate', 'Ativo', 'no momento de sacar a arma',
    { weight: 1, form: '1 Vigor' }, ['Agilizar'], 'A ação de sacar uma arma gasta 1 ação a menos (torna-se ação livre).'),

  mira_rapida: ability('mira_rapida', 'Mira Rápida', 'combate', 'Ativo', 'antes de realizar um disparo',
    { weight: 1, form: '1 Vigor' }, ['Agilizar'], 'A ação preparatória de Mirar gasta 1 ação a menos.'),

  improviso_letal: ability('improviso_letal', 'Improviso Letal', 'combate', 'Ativo', 'ao usar um item fora do padrão como arma',
    { weight: 1, form: '1 Vigor' }, ['Amplificar'], 'Um Sucesso normal ao atacar com o item improvisado é tratado como Sucesso Bom.'),

  reflexo_de_arremesso: ability('reflexo_de_arremesso', 'Reflexo de Arremesso', 'combate', 'Ativo', 'antes de arremessar um objeto que não é arma de arremesso dedicada',
    { weight: 1, form: '1 Vigor' }, ['Garantir'], 'Essa rolagem de ataque não pode cair em Falha Crítica.'),

  // ---- MOVIMENTO E FURTIVIDADE ----
  passo_de_sombra: {
    ...ability('passo_de_sombra', 'Passo de Sombra', 'movimento', 'Reativo', 'logo após um ataque furtivo',
      { weight: 1, form: '1 ação/reação (Stamina)' }, ['Agilizar'], 'Mover-se e voltar a se esconder gasta 1 ação a menos.'),
    conditional: { description: 'Sem armadura pesada e sob cobertura', costReduction: 'zera' },
  },

  salto_calculado: ability('salto_calculado', 'Salto Calculado', 'movimento', 'Ativo', 'antes de um salto, escalada ou acrobacia',
    { weight: 1, form: '1 Vigor' }, ['Garantir'], 'Essa ação não pode cair em Falha Crítica.'),

  fuga_agil: ability('fuga_agil', 'Fuga Ágil', 'movimento', 'Reativo', 'ao tentar se afastar de um perigo iminente',
    { weight: 1, form: '1 ação/reação (Stamina)' }, ['Agilizar'], 'A ação de se afastar gasta 1 ação a menos.'),

  acrobata_nato: ability('acrobata_nato', 'Acrobata Nato', 'movimento', 'Ativo', 'antes de um teste de Acrobacias envolvendo cambalhotas, saltos ou manobras aéreas',
    { weight: 1, form: '1 Vigor' }, ['Amplificar'], 'Um Sucesso normal em Acrobacias é tratado como Sucesso Bom.'),

  queda_controlada: ability('queda_controlada', 'Queda Controlada', 'movimento', 'Reativo', 'ao sofrer uma queda ou ser derrubado',
    { weight: 1, form: '1 Vigor' }, ['Garantir'], 'O teste de Acrobacias pra amortecer a queda não pode cair em Falha Crítica.'),

  // ---- SOCIAL ----
  leitura_de_sala: ability('leitura_de_sala', 'Leitura de Sala', 'social', 'Ativo', 'ao entrar em um ambiente social novo',
    { weight: 1, form: '1 Sanidade' }, ['Facilitar'], 'Rebaixa em 1 o grau de sucesso exigido pra identificar a dinâmica social do ambiente.'),

  blefe_perfeito: ability('blefe_perfeito', 'Blefe Perfeito', 'social', 'Ativo', 'antes de mentir ou blefar',
    { weight: 2, form: '2 Sanidade' }, ['Amplificar'], 'Um Sucesso normal em Lábia é tratado como Sucesso Bom.'),

  presenca_imponente: ability('presenca_imponente', 'Presença Imponente', 'social', 'Ativo', 'antes de intimidar',
    { weight: 1, form: '1 Vigor' }, ['Garantir'], 'O teste de Intimidar não pode cair em Falha Crítica.'),

  // ---- MENTAL E SANIDADE ----
  compartimentalizar: ability('compartimentalizar', 'Compartimentalizar', 'mental', 'Reativo', 'ao sofrer uma perda de Sanidade',
    { weight: 2, form: '2 Vigor' }, ['Blindar'], 'Ignora, por uma cena, a penalidade acumulada de choque/trauma recente.'),

  foco_em_crise: {
    ...ability('foco_em_crise', 'Foco em Crise', 'mental', 'Reativo', 'ao falhar em um teste de Vontade',
      { weight: 3, form: '3+ Vigor ou Sanidade combinados' }, ['Reverter'], 'A falha nesse teste de Vontade é tratada como sucesso normal.'),
    conditional: { description: 'O Vigor está abaixo da metade', costReduction: 1 },
  },

  // ---- UTILIDADE E SUPORTE ----
  gambiarra_rapida: ability('gambiarra_rapida', 'Gambiarra Rápida', 'utilidade', 'Ativo', 'ao reparar algo sob pressão',
    { weight: 1, form: '1 Vigor' }, ['Agilizar'], 'O reparo gasta 1 ação a menos.'),

  olho_clinico: ability('olho_clinico', 'Olho Clínico', 'utilidade', 'Ativo', 'ao investigar uma cena',
    { weight: 1, form: '1 Sanidade' }, ['Compensar'], 'Uma falha na investigação ainda revela um detalhe parcial relacionado.'),

  preparo_tatico: ability('preparo_tatico', 'Preparo Tático', 'utilidade', 'Ativo', 'ao montar explosivos, armadilhas ou dispositivos improvisados',
    { weight: 1, form: '1 Vigor' }, ['Garantir'], 'A montagem não pode cair em Falha Crítica.'),

  primeiros_socorros_de_combate: {
    ...ability('primeiros_socorros_de_combate', 'Primeiros Socorros de Combate', 'utilidade', 'Ativo', 'ao tratar um aliado sangrando sob fogo',
      { weight: 2, form: '2 Vigor' }, ['Agilizar', 'Garantir'], 'O tratamento gasta 1 ação a menos e não pode cair em Falha Crítica.'),
    conditional: { description: 'Dividindo a mesma cobertura que o aliado', costReduction: 1 },
  },

  instinto_de_sobrevivencia: ability('instinto_de_sobrevivencia', 'Instinto de Sobrevivência', 'utilidade', 'Reativo', 'ao sofrer dano que engatilhe uma Condição grave',
    { weight: 2, form: '2 Vigor' }, ['Amplificar'], 'Um Sucesso normal no teste de resistência (Constituição/Vontade) é tratado como Sucesso Bom.'),

  // ---- MODELOS (o jogador preenche o contexto entre colchetes) ----
  modelo_maestria: ability('modelo_maestria', 'Maestria', 'modelo', 'Ativo', '',
    { weight: 1, form: '1 Vigor' }, ['Facilitar'], 'Rebaixa em 1 o grau de sucesso exigido no contexto escolhido.',
    { hasContext: true, contextLabel: 'ação, item ou situação' }),

  modelo_agilizar: ability('modelo_agilizar', 'Agilizar', 'modelo', 'Ativo', '',
    { weight: 1, form: '1 Vigor' }, ['Agilizar'], 'A ação escolhida gasta 1 ação a menos.',
    { hasContext: true, contextLabel: 'ação específica' }),

  modelo_automatizar: {
    ...ability('modelo_automatizar', 'Automatizar', 'modelo', 'Ativo', '',
      { weight: 1, form: '1 Vigor' }, ['Garantir'], 'Não pode cair em Falha Crítica na ação escolhida.',
      { hasContext: true, contextLabel: 'ação repetitiva' }),
    conditional: { description: 'A ação já foi feita pelo menos uma vez nessa cena', costReduction: 'zera' },
  },

  modelo_improvisar: ability('modelo_improvisar', 'Improvisar com', 'modelo', 'Ativo', '',
    { weight: 1, form: '1 Vigor' }, ['Amplificar'], 'Um Sucesso normal usando o item escolhido é tratado como Sucesso Bom.',
    { hasContext: true, contextLabel: 'item fora do padrão' }),

  modelo_maestria_pressao: {
    ...ability('modelo_maestria_pressao', 'Maestria sob Pressão', 'modelo', 'Reativo', 'em uma situação de perigo iminente/pressão',
      { weight: 2, form: '1 Vigor + 1 Sanidade' }, ['Agilizar', 'Amplificar'], 'A ação escolhida gasta 1 ação a menos e um Sucesso normal nela é tratado como Sucesso Bom, só enquanto a pressão durar.',
      { hasContext: true, contextLabel: 'ação + perícia' }),
    conditional: { description: 'Só utilizável enquanto estiver sob a condição de pressão descrita', costReduction: 1 },
  },

  modelo_condicionamento: ability('modelo_condicionamento', 'Condicionamento de', 'modelo', 'Ativo', '',
    { weight: 1, form: '1 Vigor' }, ['Blindar'], 'Ignora, por uma cena, a penalidade acumulada do tipo de esforço escolhido.',
    { hasContext: true, contextLabel: 'tipo de esforço físico' }),

  modelo_mobilidade: ability('modelo_mobilidade', 'Mobilidade em', 'modelo', 'Ativo', '',
    { weight: 1, form: '1 ação/reação (Stamina)' }, ['Garantir'], 'Não pode cair em Falha Crítica na ação de deslocamento escolhida.',
    { hasContext: true, contextLabel: 'ação de deslocamento' }),

  // ---- HABILIDADES DE ASSINATURA (3 por Arquétipo) ----

  // Parrudo
  golpe_bruto: ability('golpe_bruto', 'Golpe Bruto', 'assinatura', 'Ativo', 'antes de um ataque corpo a corpo',
    { weight: 1, form: '1 Vigor' }, ['Amplificar'], 'Um Sucesso normal no ataque desarmado é tratado como Sucesso Bom.',
    { archetypeId: 'parrudo' }),
  forca_bruta: ability('forca_bruta', 'Força Bruta', 'assinatura', 'Ativo', 'ao quebrar, arrombar ou erguer algo usando Força',
    { weight: 1, form: '1 Vigor' }, ['Garantir'], 'Esse teste de Força não pode cair em Falha Crítica.',
    { archetypeId: 'parrudo' }),
  pele_de_aco: ability('pele_de_aco', 'Pele de Aço', 'assinatura', 'Reativo', 'ao sofrer dano físico',
    { weight: 2, form: '2 Vigor' }, ['Blindar'], 'Ignora, por uma cena, a penalidade acumulada de ferimentos leves.',
    { archetypeId: 'parrudo' }),

  // Veterano
  folego_de_veterano: ability('folego_de_veterano', 'Fôlego de Veterano', 'assinatura', 'Ativo', 'ao sustentar esforço físico prolongado',
    { weight: 1, form: '1 Vigor' }, ['Blindar'], 'Ignora, por uma cena, a penalidade de cansaço acumulado.',
    { archetypeId: 'veterano' }),
  cicatrizes_de_guerra: ability('cicatrizes_de_guerra', 'Cicatrizes de Guerra', 'assinatura', 'Reativo', 'ao sofrer um Ferimento',
    { weight: 2, form: '2 Vigor' }, ['Amplificar'], 'O teste de Constituição/Vontade pra resistir ao colapso é tratado como Sucesso Bom.',
    { archetypeId: 'veterano' }),
  instinto_de_campo: ability('instinto_de_campo', 'Instinto de Campo', 'assinatura', 'Ativo', 'antes de agir num ambiente de combate familiar',
    { weight: 1, form: '1 Vigor' }, ['Facilitar'], 'Rebaixa em 1 o grau de sucesso exigido em Sobrevivência ou Percepção nesse contexto.',
    { archetypeId: 'veterano' }),

  // Assassino Silencioso
  golpe_fatal: ability('golpe_fatal', 'Golpe Fatal', 'assinatura', 'Ativo', 'antes de um ataque furtivo',
    { weight: 2, form: '2 Vigor' }, ['Multiplicar'], 'Dobra o efeito do dano nesse ataque furtivo.',
    { archetypeId: 'assassino_silencioso' }),
  sombra_perfeita: ability('sombra_perfeita', 'Sombra Perfeita', 'assinatura', 'Ativo', 'ao se esconder logo após agir',
    { weight: 1, form: '1 ação/reação (Stamina)' }, ['Garantir'], 'O teste de Furtividade pra sumir de vista não pode cair em Falha Crítica.',
    { archetypeId: 'assassino_silencioso' }),
  silencio_mortal: ability('silencio_mortal', 'Silêncio Mortal', 'assinatura', 'Reativo', 'logo após eliminar um alvo furtivamente',
    { weight: 1, form: '1 Vigor' }, ['Blindar'], 'Ignora, por uma cena, a chance de outros perceberem que o ataque aconteceu.',
    { archetypeId: 'assassino_silencioso' }),

  // Atirador de Elite
  disparo_calculado: ability('disparo_calculado', 'Disparo Calculado', 'assinatura', 'Ativo', 'antes de atirar',
    { weight: 1, form: '1 Vigor' }, ['Facilitar'], 'Rebaixa em 1 o grau de sucesso exigido nesse disparo.',
    { archetypeId: 'atirador_de_elite' }),
  tiro_certeiro: ability('tiro_certeiro', 'Tiro Certeiro', 'assinatura', 'Ativo', 'contra um alvo parado ou sem cobertura',
    { weight: 2, form: '2 Vigor' }, ['Amplificar'], 'Um Sucesso normal nesse disparo é tratado como Sucesso Bom.',
    { archetypeId: 'atirador_de_elite' }),
  reflexo_de_combate: ability('reflexo_de_combate', 'Reflexo de Combate', 'assinatura', 'Reativo', 'após ser alvo de um ataque de retorno inimigo',
    { weight: 1, form: '1 ação/reação (Stamina)' }, ['Garantir'], 'O teste de defesa não pode cair em Falha Crítica.',
    { archetypeId: 'atirador_de_elite' }),

  // Artista Marcial
  fluidez_marcial: ability('fluidez_marcial', 'Fluidez Marcial', 'assinatura', 'Ativo', 'durante uma sequência de golpes desarmados',
    { weight: 1, form: '1 Vigor' }, ['Agilizar'], 'O próximo golpe da sequência gasta 1 ação a menos que o padrão.',
    { archetypeId: 'artista_marcial' }),
  postura_perfeita: ability('postura_perfeita', 'Postura Perfeita', 'assinatura', 'Reativo', 'ao ser atacado corpo a corpo',
    { weight: 2, form: '2 Vigor' }, ['Blindar'], 'Ignora, por uma cena, a penalidade de estar cercado ou flanqueado.',
    { archetypeId: 'artista_marcial' }),
  golpe_decisivo: ability('golpe_decisivo', 'Golpe Decisivo', 'assinatura', 'Ativo', 'ao acumular vantagem tática sobre o oponente',
    { weight: 3, form: 'Usar o turno inteiro' }, ['Multiplicar'], 'Dobra o efeito do próximo golpe desarmado bem-sucedido.',
    { archetypeId: 'artista_marcial' }),

  // Vidente
  pressagio: ability('pressagio', 'Presságio', 'assinatura', 'Ativo', 'antes de uma ação arriscada',
    { weight: 1, form: '1 Sanidade' }, ['Facilitar'], 'Rebaixa em 1 o grau de sucesso exigido, guiado pelo instinto do personagem.',
    { archetypeId: 'vidente' }),
  visao_alem_do_veu: ability('visao_alem_do_veu', 'Visão Além do Véu', 'assinatura', 'Ativo', 'ao investigar algo de natureza sobrenatural',
    { weight: 2, form: '2 Sanidade' }, ['Amplificar'], 'Um Sucesso normal em Intuição ou Ocultismo relacionado é tratado como Sucesso Bom.',
    { archetypeId: 'vidente' }),
  aviso_silencioso: ability('aviso_silencioso', 'Aviso Silencioso', 'assinatura', 'Reativo', 'ao perceber perigo iminente sobre um aliado',
    { weight: 1, form: '1 Sanidade' }, ['Garantir'], 'O teste de Percepção do aliado avisado não pode cair em Falha Crítica.',
    { archetypeId: 'vidente' }),

  // Religioso
  fe_inabalavel: ability('fe_inabalavel', 'Fé Inabalável', 'assinatura', 'Reativo', 'ao sofrer perda de Sanidade por choque ou horror',
    { weight: 2, form: '2 Vigor' }, ['Blindar'], 'Ignora, por uma cena, a penalidade acumulada desse choque.',
    { archetypeId: 'religioso' }),
  palavra_consagrada: ability('palavra_consagrada', 'Palavra Consagrada', 'assinatura', 'Ativo', 'ao confrontar algo hostil verbalmente, invocando a fé',
    { weight: 1, form: '1 Sanidade' }, ['Facilitar'], 'Rebaixa em 1 o grau de sucesso exigido nesse confronto.',
    { archetypeId: 'religioso' }),
  bencao_de_protecao: ability('bencao_de_protecao', 'Bênção de Proteção', 'assinatura', 'Ativo', 'antes de proteger um aliado',
    { weight: 2, form: '1 Vigor + 1 Sanidade' }, ['Garantir'], 'O teste de defesa do aliado protegido não pode cair em Falha Crítica.',
    { archetypeId: 'religioso' }),

  // Pactário
  barganha_sombria: {
    ...ability('barganha_sombria', 'Barganha Sombria', 'assinatura', 'Ativo', 'ao invocar o poder do contrato',
      { weight: 2, form: '1 Vigor + 1 Sanidade' }, ['Amplificar'], 'Um Sucesso normal na ação invocada é tratado como Sucesso Bom.',
      { archetypeId: 'pactario' }),
    conditional: { description: 'Aceita agir conforme a vontade da entidade nessa cena', costReduction: 1 },
  },
  vontade_emprestada: ability('vontade_emprestada', 'Vontade Emprestada', 'assinatura', 'Reativo', 'ao falhar um teste de Ocultismo — a entidade empresta força na hora',
    { weight: 3, form: 'Debuff/penalidade em si mesmo' }, ['Reverter'], 'A falha nesse teste de Ocultismo é tratada como sucesso normal — a entidade cobra o preço depois.',
    { archetypeId: 'pactario' }),
  preco_do_pacto: ability('preco_do_pacto', 'Preço do Pacto', 'assinatura', 'Ativo', 'antes de uma ação crítica',
    { weight: 3, form: 'Debuff/penalidade em si mesmo' }, ['Multiplicar'], 'Dobra o efeito do próximo sucesso — a entidade escolhe a penalidade específica cobrada em troca.',
    { archetypeId: 'pactario' }),

  // Ritualista
  ritual_preparado: {
    ...ability('ritual_preparado', 'Ritual Preparado', 'assinatura', 'Ativo', 'ao preparar algo ocultista complexo com antecedência',
      { weight: 2, form: '2 Vigor' }, ['Garantir'], 'Essa preparação não pode cair em Falha Crítica.',
      { archetypeId: 'ritualista' }),
    conditional: { description: 'Consome um material ritualístico específico', costReduction: 1 },
  },
  circulo_de_precisao: ability('circulo_de_precisao', 'Círculo de Precisão', 'assinatura', 'Ativo', 'ao executar um ritual que exige exatidão',
    { weight: 2, form: '2 Vigor' }, ['Amplificar'], 'Um Sucesso normal na execução do ritual é tratado como Sucesso Bom.',
    { archetypeId: 'ritualista' }),
  formula_perfeita: {
    ...ability('formula_perfeita', 'Fórmula Perfeita', 'assinatura', 'Ativo', 'ao repetir um ritual já executado antes',
      { weight: 1, form: '1 Vigor' }, ['Facilitar'], 'Rebaixa em 1 o grau de sucesso exigido nesse ritual já dominado.',
      { archetypeId: 'ritualista' }),
    conditional: { description: 'Já executou esse ritual específico antes', costReduction: 'zera' },
  },

  // Engenheiro
  reparo_relampago: ability('reparo_relampago', 'Reparo Relâmpago', 'assinatura', 'Ativo', 'ao consertar algo sob pressão',
    { weight: 1, form: '1 Vigor' }, ['Agilizar'], 'O reparo gasta 1 ação a menos que o padrão.',
    { archetypeId: 'engenheiro' }),
  gambiarra_genial: ability('gambiarra_genial', 'Gambiarra Genial', 'assinatura', 'Ativo', 'ao improvisar uma solução técnica',
    { weight: 2, form: '2 Vigor' }, ['Amplificar'], 'Um Sucesso normal na improvisação técnica é tratado como Sucesso Bom.',
    { archetypeId: 'engenheiro' }),
  diagnostico_preciso: ability('diagnostico_preciso', 'Diagnóstico Preciso', 'assinatura', 'Ativo', 'ao identificar uma falha técnica',
    { weight: 1, form: '1 Sanidade' }, ['Garantir'], 'Esse diagnóstico não pode cair em Falha Crítica.',
    { archetypeId: 'engenheiro' }),

  // Investigador
  faro_investigativo: ability('faro_investigativo', 'Faro Investigativo', 'assinatura', 'Ativo', 'ao investigar uma cena',
    { weight: 1, form: '1 Vigor' }, ['Garantir'], 'O teste de Investigação não pode cair em Falha Crítica.',
    { archetypeId: 'investigador' }),
  conexao_de_pistas: ability('conexao_de_pistas', 'Conexão de Pistas', 'assinatura', 'Ativo', 'ao analisar pistas já coletadas',
    { weight: 2, form: '2 Sanidade' }, ['Compensar'], 'Uma falha ao conectar as pistas ainda revela uma conexão parcial relacionada.',
    { archetypeId: 'investigador' }),
  memoria_fotografica: ability('memoria_fotografica', 'Memória Fotográfica', 'assinatura', 'Ativo', 'ao tentar lembrar um detalhe visto antes',
    { weight: 1, form: '1 Sanidade' }, ['Amplificar'], 'Um Sucesso normal em Memória é tratado como Sucesso Bom.',
    { archetypeId: 'investigador' }),

  // Médico de Campo
  maos_firmes: ability('maos_firmes', 'Mãos Firmes', 'assinatura', 'Ativo', 'ao tratar um aliado',
    { weight: 2, form: '2 Vigor' }, ['Amplificar'], 'Um Sucesso normal no tratamento é tratado como Sucesso Bom.',
    { archetypeId: 'medico_de_campo' }),
  estabilizacao_de_emergencia: ability('estabilizacao_de_emergencia', 'Estabilização de Emergência', 'assinatura', 'Reativo', 'ao ver um aliado entrar em colapso',
    { weight: 2, form: '2 Vigor' }, ['Agilizar', 'Garantir'], 'Estabilizar o aliado gasta 1 ação a menos e não pode cair em Falha Crítica.',
    { archetypeId: 'medico_de_campo' }),
  triagem_rapida: ability('triagem_rapida', 'Triagem Rápida', 'assinatura', 'Ativo', 'ao avaliar múltiplos feridos ao mesmo tempo',
    { weight: 1, form: '1 Sanidade' }, ['Facilitar'], 'Rebaixa em 1 o grau de sucesso exigido pra identificar quem tratar primeiro.',
    { archetypeId: 'medico_de_campo' }),

  // Negociador
  advocacia: ability('advocacia', 'Advocacia', 'assinatura', 'Ativo', 'ao negociar ou defender socialmente em nome de um aliado',
    { weight: 1, form: '1 Sanidade' }, ['Facilitar'], 'Rebaixa em 1 o grau de sucesso exigido nessa negociação.',
    { archetypeId: 'negociador' }),
  leitura_de_intencoes: ability('leitura_de_intencoes', 'Leitura de Intenções', 'assinatura', 'Ativo', 'ao negociar com alguém hostil',
    { weight: 1, form: '1 Sanidade' }, ['Garantir'], 'Esse teste social não pode cair em Falha Crítica.',
    { archetypeId: 'negociador' }),
  acordo_vantajoso: ability('acordo_vantajoso', 'Acordo Vantajoso', 'assinatura', 'Ativo', 'ao fechar uma negociação',
    { weight: 2, form: '2 Sanidade' }, ['Amplificar'], 'Um Sucesso normal em Lábia pra fechar o acordo é tratado como Sucesso Bom.',
    { archetypeId: 'negociador' }),
};

export const ABILITY_CATEGORY_LABELS = {
  combate: 'Combate',
  movimento: 'Movimento e Furtividade',
  social: 'Social',
  mental: 'Mental e Sanidade',
  utilidade: 'Utilidade e Suporte',
  modelo: 'Modelos (preencha o contexto)',
  assinatura: 'Habilidades de Assinatura (por Arquétipo)',
};

// Retorna só as 3 Habilidades de Assinatura de um Arquétipo específico.
export function getSignatureAbilitiesForArchetype(archetypeId) {
  return Object.values(ABILITIES).filter((a) => a.category === 'assinatura' && a.archetypeId === archetypeId);
}

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