// src/data/arsenal.js
// Arsenal Padrão do Livro do Jogador. damage.kind:
//   'fisico' = Dano Físico do personagem + 1d{die}   |   'texto' = valor escrito   |   'nenhum'
// Entradas sem `damage` são itens que não causam dano (kits, suprimentos).

export const ARSENAL_GROUPS = [
  { id: 'corpo_a_corpo', label: 'Armas Corpo a Corpo' },
  { id: 'fogo_curtas', label: 'Armas de Fogo Curtas' },
  { id: 'fogo_longas', label: 'Armas de Fogo Longas' },
  { id: 'explosivos', label: 'Explosivos e Táticos' },
  { id: 'brancas', label: 'Armas Brancas' },
  { id: 'distancia', label: 'Armas à Distância' },
  { id: 'suprimentos', label: 'Medicina e Suprimentos' },
];

const KIT_NOTES =
  'Kit Médico. Estabilizar Sangramento e tratar Ferimento Leve podem ser feitos no improviso, mas tratar Ferimento Médio ou Grave exige o kit: sem ele a tentativa falha ou piora o quadro. Ao concluir um Tratar, rola-se o dado do kit: Leve degrada em 1 ou 2, Médio em 1, 2 ou 3, Grave reduz 1 nível e ainda rola pra descer outro.';

export const ARSENAL = [
  // Corpo a Corpo
  { id: 'soco_ingles', group: 'corpo_a_corpo', name: 'Soco Inglês / Soqueira', damage: { kind: 'fisico', die: 4 }, damageType: 'Contundente', tags: ['Ocultável'] },
  { id: 'faca_combate', group: 'corpo_a_corpo', name: 'Faca de Combate / Canivete', damage: { kind: 'fisico', die: 4 }, damageType: 'Cortante/Perfurante', tags: ['Letal', 'Ocultável'] },
  { id: 'cassetete', group: 'corpo_a_corpo', name: 'Cassetete / Taco de Beisebol', damage: { kind: 'fisico', die: 6 }, damageType: 'Contundente', tags: ['Não-Letal'] },
  { id: 'facao', group: 'corpo_a_corpo', name: 'Facão / Espada Curta', damage: { kind: 'fisico', die: 8 }, damageType: 'Cortante', tags: ['Letal'] },
  { id: 'machado_incendio', group: 'corpo_a_corpo', name: 'Machado de Incêndio / Marreta', damage: { kind: 'fisico', die: 10 }, damageType: 'Contundente ou Cortante', tags: ['Brutal', 'Pesada'] },
  { id: 'lanca', group: 'corpo_a_corpo', name: 'Lança / Bastão Longo', damage: { kind: 'fisico', die: 8 }, damageType: 'Perfurante ou Contundente', tags: ['Alcance', 'Pesada'] },
  // Armas de Fogo Curtas
  { id: 'pistola_leve', group: 'fogo_curtas', name: 'Pistola Leve (9mm, .380)', damage: { kind: 'texto', text: 'd20+d10' }, damageType: 'Perfurante', tags: ['Letal', 'Ocultável'], supply: 'Dado de Suprimento d6 · pente de 15 balas' },
  { id: 'revolver_pesado', group: 'fogo_curtas', name: 'Revólver Pesado (.44, .357)', damage: { kind: 'texto', text: 'd20+d12' }, damageType: 'Perfurante', tags: ['Letal', 'Penetrante'], supply: 'Tambor de 6 tiros, contado · reserva d6/d8/d10 (loadout)' },
  { id: 'submetralhadora', group: 'fogo_curtas', name: 'Submetralhadora (Uzi, MP5)', damage: { kind: 'texto', text: 'd20+d10' }, damageType: 'Perfurante', tags: ['Letal', 'Automática'], supply: 'Dado de Suprimento d8 · pente de 25 balas' },
  { id: 'taser', group: 'fogo_curtas', name: 'Taser / Arma de Choque', damage: { kind: 'texto', text: '1d4 fixo' }, damageType: 'Perfurante', tags: ['Não-Letal', 'Elétrico', 'Ocultável'], supply: '1 cartucho (troca por ação, sem dado)' },
  // Armas de Fogo Longas
  { id: 'fuzil_assalto', group: 'fogo_longas', name: 'Fuzil de Assalto (M4A1, AK-47)', damage: { kind: 'texto', text: 'd20+d12' }, damageType: 'Perfurante', tags: ['Letal', 'Automática', 'Pesada'], supply: 'Dado de Suprimento d10 · pente de 30 balas' },
  { id: 'escopeta', group: 'fogo_longas', name: 'Escopeta (Calibre 12)', damage: { kind: 'texto', text: 'd20+d12' }, damageType: 'Perfurante', tags: ['Letal', 'Dispersão', 'Brutal', 'Pesada'], supply: 'Tubo de 6 tiros, contado · reserva d6/d8/d10 (loadout). Variantes: Quebra-Cano 2 tiros, Bombeada 6, Caça (Bolt-Action) 1' },
  { id: 'rifle_precisao', group: 'fogo_longas', name: 'Rifle de Precisão (Sniper)', damage: { kind: 'texto', text: 'd20+d12+5' }, damageType: 'Perfurante', tags: ['Letal', 'Penetrante', 'Pesada'], supply: 'Sem magazine: 1 tiro, contado · com magazine interno: 5 · reserva d6/d8/d10 (loadout)' },
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
  { id: 'arco_curto', group: 'distancia', name: 'Arco Curto', damage: { kind: 'texto', text: 'd20+d8' }, damageType: 'Perfurante', tags: ['Letal', 'Silenciosa'], supply: '1 flecha encaixada · aljava d6/d8/d10' },
  { id: 'arco_longo', group: 'distancia', name: 'Arco Longo', damage: { kind: 'texto', text: 'd20+d10' }, damageType: 'Perfurante', tags: ['Letal', 'Silenciosa', 'Pesada', 'Alcance', 'Penetrante'], supply: '1 flecha encaixada · aljava d6/d8/d10' },
  { id: 'besta_leve', group: 'distancia', name: 'Besta Leve', damage: { kind: 'texto', text: 'd20+d10' }, damageType: 'Perfurante', tags: ['Letal', 'Penetrante'], supply: '1 virote engatilhado · carcaz d6/d8/d10' },
  { id: 'besta_pesada', group: 'distancia', name: 'Besta Pesada', damage: { kind: 'texto', text: 'd20+d12' }, damageType: 'Perfurante', tags: ['Letal', 'Penetrante', 'Pesada', 'Brutal'], supply: '1 virote engatilhado · carcaz d6/d8/d10' },
  // Medicina e Suprimentos
  { id: 'estojo_medico_civil', group: 'suprimentos', name: 'Estojo Médico Civil (de bolso)', supply: 'Dado de Suprimento do kit: d6', notes: KIT_NOTES },
  { id: 'mala_paramedico', group: 'suprimentos', name: 'Mala de Paramédico / Médico de Campo', supply: 'Dado de Suprimento do kit: d8', notes: KIT_NOTES },
  { id: 'pente_reserva', group: 'suprimentos', name: 'Pente de reserva', notes: 'Item de carga comum: a quantidade é o número de pentes carregados. Ao trocar de pente, o novo começa no topo do Dado de Suprimento da arma.' },
  { id: 'reserva_municao', group: 'suprimentos', name: 'Reserva de munição (revólver, escopeta, rifle, arco, besta)', supply: 'Leve (bolso, cinto) d6 · Média (bandoleira, coldre extra) d8 · Pesada (mochila, cinto tático completo) d10', notes: 'O tipo de reserva é escolhido no loadout; o dado rola ao recarregar.' },
];

export const ARSENAL_BY_ID = Object.fromEntries(ARSENAL.map((a) => [a.id, a]));

// Resumo dos Tipos de Dano (condensado do Livro do Jogador; ajuste o texto se quiser).
export const DAMAGE_TYPE_INFO = {
  Contundente: 'Impactos, pancadas e quedas. Eficiente em causar dor, desequilíbrio e Atordoamento: mesmo sem reduzir o Vigor, o alvo pode precisar resistir ao impacto pra não ficar atordoado. Golpes extremos podem causar fraturas ou lesões internas.',
  Cortante: 'Objetos que rasgam ou separam tecidos. Eficiente em causar Sangramento: até um corte superficial provoca dor e sangramento leve se o alvo não estiver protegido. Roupas grossas ou proteções podem impedir cortes leves.',
  Perfurante: 'Objetos que atravessam o corpo ou penetram fundo (flechas, estacas, projéteis). Causa ferimentos concentrados, com sangramento intenso ou atingindo estruturas internas; em órgãos e articulações gera consequências debilitantes além do dano.',
};

/** Extrai os tipos de dano de textos como "Cortante/Perfurante" ou "Contundente ou Cortante". */
export function getDamageTypes(damageType) {
  if (!damageType) return [];
  return damageType
    .split(/\s*\/\s*|\s+ou\s+/)
    .map((t) => t.trim())
    .filter((t) => DAMAGE_TYPE_INFO[t]);
}

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