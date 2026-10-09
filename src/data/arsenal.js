// src/data/arsenal.js
// Arsenal Padrão do Livro do Jogador. damage.kind:
//   'fisico' = Dano Físico do personagem + 1d{die}   |   'texto' = valor escrito   |   'nenhum'

export const ARSENAL_GROUPS = [
  { id: 'corpo_a_corpo', label: 'Armas Corpo a Corpo' },
  { id: 'fogo_curtas', label: 'Armas de Fogo Curtas' },
  { id: 'fogo_longas', label: 'Armas de Fogo Longas' },
  { id: 'explosivos', label: 'Explosivos e Táticos' },
  { id: 'brancas', label: 'Armas Brancas' },
  { id: 'distancia', label: 'Armas à Distância' },
];

export const ARSENAL = [
  // Corpo a Corpo
  { id: 'soco_ingles', group: 'corpo_a_corpo', name: 'Soco Inglês / Soqueira', damage: { kind: 'fisico', die: 4 }, damageType: 'Contundente', tags: ['Ocultável'] },
  { id: 'faca_combate', group: 'corpo_a_corpo', name: 'Faca de Combate / Canivete', damage: { kind: 'fisico', die: 4 }, damageType: 'Cortante/Perfurante', tags: ['Letal', 'Ocultável'] },
  { id: 'cassetete', group: 'corpo_a_corpo', name: 'Cassetete / Taco de Beisebol', damage: { kind: 'fisico', die: 6 }, damageType: 'Contundente', tags: ['Não-Letal'] },
  { id: 'facao', group: 'corpo_a_corpo', name: 'Facão / Espada Curta', damage: { kind: 'fisico', die: 8 }, damageType: 'Cortante', tags: ['Letal'] },
  { id: 'machado_incendio', group: 'corpo_a_corpo', name: 'Machado de Incêndio / Marreta', damage: { kind: 'fisico', die: 10 }, damageType: 'Contundente ou Cortante', tags: ['Brutal', 'Pesada'] },
  { id: 'lanca', group: 'corpo_a_corpo', name: 'Lança / Bastão Longo', damage: { kind: 'fisico', die: 8 }, damageType: 'Perfurante ou Contundente', tags: ['Alcance', 'Pesada'] },
  // Armas de Fogo Curtas
  { id: 'pistola_leve', group: 'fogo_curtas', name: 'Pistola Leve (9mm, .380)', damage: { kind: 'texto', text: 'd20+d10' }, damageType: 'Perfurante', tags: ['Letal', 'Ocultável'] },
  { id: 'revolver_pesado', group: 'fogo_curtas', name: 'Revólver Pesado (.44, .357)', damage: { kind: 'texto', text: 'd20+d12' }, damageType: 'Perfurante', tags: ['Letal', 'Penetrante'] },
  { id: 'submetralhadora', group: 'fogo_curtas', name: 'Submetralhadora (Uzi, MP5)', damage: { kind: 'texto', text: 'd20+d10' }, damageType: 'Perfurante', tags: ['Letal', 'Automática'] },
  { id: 'taser', group: 'fogo_curtas', name: 'Taser / Arma de Choque', damage: { kind: 'texto', text: '1d4 fixo' }, damageType: 'Perfurante', tags: ['Não-Letal', 'Elétrico', 'Ocultável'] },
  // Armas de Fogo Longas
  { id: 'fuzil_assalto', group: 'fogo_longas', name: 'Fuzil de Assalto (M4A1, AK-47)', damage: { kind: 'texto', text: 'd20+d12' }, damageType: 'Perfurante', tags: ['Letal', 'Automática', 'Pesada'] },
  { id: 'escopeta', group: 'fogo_longas', name: 'Escopeta (Calibre 12)', damage: { kind: 'texto', text: 'd20+d12' }, damageType: 'Perfurante', tags: ['Letal', 'Dispersão', 'Brutal', 'Pesada'] },
  { id: 'rifle_precisao', group: 'fogo_longas', name: 'Rifle de Precisão (Sniper)', damage: { kind: 'texto', text: 'd20+d12+5' }, damageType: 'Perfurante', tags: ['Letal', 'Penetrante', 'Pesada'] },
  // Explosivos e Táticos
  { id: 'granada', group: 'explosivos', name: 'Granada de Fragmentação', damage: { kind: 'texto', text: '20 fixo' }, damageType: 'Perfurante', tags: ['Explosão/Área', 'Letal'] },
  { id: 'molotov', group: 'explosivos', name: 'Coquetel Molotov', damage: { kind: 'texto', text: '10 fixo' }, damageType: 'Contundente', tags: ['Explosão/Área', 'Incendiário/Fogo'] },
  { id: 'gas', group: 'explosivos', name: 'Gás Lacrimogêneo / Fumaça', damage: { kind: 'nenhum' }, damageType: '—', tags: ['Explosão/Área', 'Não-Letal'], notes: 'Asfixia/cegueira temporária.' },
  // Armas Brancas
  { id: 'adaga', group: 'brancas', name: 'Adaga / Estilete', damage: { kind: 'fisico', die: 4 }, damageType: 'Perfurante ou Cortante', tags: ['Letal', 'Ocultável', 'Penetrante'] },
  { id: 'espada_curta', group: 'brancas', name: 'Espada Curta / Rapieira', damage: { kind: 'fisico', die: 6 }, damageType: 'Perfurante ou Cortante', tags: ['Letal'] },
  { id: 'espada_longa', group: 'brancas', name: 'Espada Longa / Machado de Batalha', damage: { kind: 'fisico', die: 10 }, damageType: 'Cortante', tags: ['Letal', 'Pesada'] },
  { id: 'montante', group: 'brancas', name: 'Montante (Espada de Duas Mãos)', damage: { kind: 'fisico', die: 12 }, damageType: 'Cortante', tags: ['Letal', 'Brutal', 'Pesada'] },
  { id: 'maca', group: 'brancas', name: 'Maça / Martelo de Guerra', damage: { kind: 'fisico', die: 8 }, damageType: 'Contundente', tags: ['Brutal', 'Pesada'] },
  { id: 'alabarda', group: 'brancas', name: 'Alabarda / Lança Longa', damage: { kind: 'fisico', die: 10 }, damageType: 'Cortante ou Perfurante', tags: ['Alcance', 'Pesada', 'Letal'] },
  { id: 'chicote', group: 'brancas', name: 'Chicote', damage: { kind: 'fisico', die: 4 }, damageType: 'Cortante', tags: ['Alcance'] },
  // Armas à Distância
  { id: 'arco_curto', group: 'distancia', name: 'Arco Curto', damage: { kind: 'texto', text: 'd20+d8' }, damageType: 'Perfurante', tags: ['Letal', 'Silenciosa'] },
  { id: 'arco_longo', group: 'distancia', name: 'Arco Longo', damage: { kind: 'texto', text: 'd20+d10' }, damageType: 'Perfurante', tags: ['Letal', 'Silenciosa', 'Pesada', 'Alcance', 'Penetrante'] },
  { id: 'besta_leve', group: 'distancia', name: 'Besta Leve', damage: { kind: 'texto', text: 'd20+d10' }, damageType: 'Perfurante', tags: ['Letal', 'Penetrante'] },
  { id: 'besta_pesada', group: 'distancia', name: 'Besta Pesada', damage: { kind: 'texto', text: 'd20+d12' }, damageType: 'Perfurante', tags: ['Letal', 'Penetrante', 'Pesada', 'Brutal'] },
];

export const ARSENAL_BY_ID = Object.fromEntries(ARSENAL.map((a) => [a.id, a]));

// Resumo das Tags (condensado do Livro do Jogador; ajuste o texto se quiser).
export const WEAPON_TAGS = {
  'Letal': 'Ponto vital com Sucesso Extremo mata na hora um alvo de escala humana; contra escala superior, tira 1/3 do Vigor máximo.',
  'Não-Letal': 'Não causa Sangramento grave, mutilação nem morte instantânea; zerar o Vigor só nocauteia ou rende.',
  'Automática': 'Fluxo contínuo de disparos; permite os modos Concentração, Varredura e Supressão e degrada o Dado de Suprimento.',
  'Brutal': 'Mesmo com Defesa Total, o alvo ainda sofre metade do dano rolado.',
  'Dispersão': 'Até 5 m, aumenta a Dificuldade pra esquivar e empurra o alvo pra trás.',
  'Ocultável': 'Vantagem em Prestidigitação e furtividade pra esconder, passar por revista e sacar de surpresa.',
  'Explosão/Área': 'Dano fixo, sem rolagem de ataque; o alvo reage pra sair do epicentro e o dano cai pela metade a cada margem de distância.',
  'Incendiário/Fogo': 'Se causar dano, impõe Em Chamas: dano fixo no Vigor a cada turno até apagar com uma Ação principal.',
  'Elétrico': 'Em Sucesso Bom ou Extremo, zera a Stamina do alvo ou anula suas Reações no turno.',
  'Pesada': 'Exige as duas mãos; em movimento impõe Desvantagem no ataque e em Agilidade e movimento enquanto em uso.',
  'Penetrante': 'Ignora a redução de coletes, escudos e armaduras rígidas, sem destruí-los.',
  'Alcance': 'Ataca corpo a corpo de 2 a 3 m; armas curtas e desarmados não contra-atacam sem encurtar a distância.',
  'Silenciosa': 'Sem estampido nem clarão; disparar escondido não revela o atirador sem um teste ativo de Percepção.',
};