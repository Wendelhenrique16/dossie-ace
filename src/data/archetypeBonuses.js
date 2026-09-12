// src/data/archetypeBonuses.js
// Bônus fixo passivo de cada Arquétipo — sempre ativo, não usa o sistema de
// Gatilho/Custo/Efeito (isso é papel das Habilidades de Assinatura, que
// ficam em abilities.js). Os 3 que mexem em Categoria de Massa (massShift)
// são lidos por getEffectiveMassCategory via archetypeShifts.
//
// IMPORTANTE: confira se os ids abaixo batem exatamente com os ids usados
// em src/data/classes.js (getArchetypesForClass) — foram assumidos pelo
// padrão de nomenclatura do resto do projeto (snake_case do nome).

export const ARCHETYPE_BONUSES = {
  // ---- LUTADOR ----
  parrudo: {
    archetypeId: 'parrudo',
    name: 'Físico Avassalador',
    description: 'A estrutura muscular do personagem converte massa em impacto além do normal: a Categoria de Massa efetiva para Dano sobe 1 degrau em relação ao que a Força indicaria.',
    massShift: { axis: 'damage', amount: 1 },
  },
  veterano: {
    archetypeId: 'veterano',
    name: 'Corpo Curtido',
    description: 'Anos de combate endureceram o corpo além do que a Constituição sozinha explicaria: a Categoria de Massa efetiva para Vigor sobe 1 degrau.',
    massShift: { axis: 'vigor', amount: 1 },
  },
  assassino_silencioso: {
    archetypeId: 'assassino_silencioso',
    name: 'Golpe da Sombra',
    description: 'Quando o alvo não viu o ataque chegar, a precisão é cirúrgica: um Sucesso Bom obtido em um ataque furtivo é tratado como Sucesso Extremo.',
  },
atirador_de_elite: {
  archetypeId: 'atirador_de_elite',
  name: 'Pulso de Aço', 
  description: 'Ignora penalidades de alcance ao realizar disparos a até 20 metros. Acima dessa distância, qualquer penalidade por alcance é reduzida pela metade.',
},
  artista_marcial: {
    archetypeId: 'artista_marcial',
    name: 'Economia de Movimento',
    description: 'Anos de treino tornaram cada movimento eficiente ao extremo: a Categoria de Massa efetiva para Stamina cai 1 degrau, reduzindo o custo de ação em combate.',
    massShift: { axis: 'stamina', amount: -1 },
  },

  // ---- OCULTISTA ----
  vidente: {
    archetypeId: 'vidente',
    name: 'Olhos Além do Véu',
    description: 'O personagem sente o perigo antes que ele se manifeste: é imune a Surpresa e Emboscada, entrando em qualquer confronto já ciente da ameaça.',
  },
  religioso: {
    archetypeId: 'religioso',
    name: 'Instrumento da Fé',
    description: 'Armas e símbolos religiosos empunhados pelo personagem causam dano extra contra Entidades, canalizando a fé como arma contra o sobrenatural.',
  },
  pactario: {
    archetypeId: 'pactario',
    name: 'Cláusula de Emergência',
    description: 'Uma vez por sessão, o personagem pode invocar uma Habilidade sua sem pagar Custo algum — a entidade com quem ele fez seu contrato cobre o preço na hora, e cobrará de volta depois, narrativamente, do jeito e na hora que o Mestre decidir.',
  },
  ritualista: {
    archetypeId: 'ritualista',
    name: 'Método Impecável',
    description: 'Um ritual preparado com pelo menos 10 minutos de antecedência nunca resulta em Falha Crítica — no pior cenário possível, o resultado é tratado como uma Falha normal.',
  },

  // ---- SUPORTE ----
  engenheiro: {
    archetypeId: 'engenheiro',
    name: 'Mão na Massa',
    description: 'Único Arquétipo capaz de modificar, customizar ou criar armas híbridas a partir do Arsenal Padrão, combinando Tags e tipos de dano de formas não previstas no equipamento original.',
  },
  investigador: {
    archetypeId: 'investigador',
    name: 'Faro Apurado',
    description: 'Ao investigar uma cena, o personagem sempre encontra ao menos uma pista relevante, mesmo em caso de falha no teste — a critério do Mestre, uma pista menor ou incompleta em vez de nenhuma.',
  },
  medico_de_campo: {
    archetypeId: 'medico_de_campo',
    name: 'Mão Extra',
    description: 'Sempre que estabiliza um aliado com Primeiros Socorros, o personagem restaura 1 ponto adicional de Vigor além do valor padrão do tratamento.',
  },
  negociador: {
    archetypeId: 'negociador',
    name: 'Segunda Chance Social',
    description: 'Uma vez por cena, o personagem pode reverter automaticamente uma primeira impressão social negativa — a própria ou a de um aliado presente.',
  },
};