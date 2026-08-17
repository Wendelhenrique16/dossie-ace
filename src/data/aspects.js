// src/data/aspects.js
// Lista Oficial de Aspectos (ACE RPG) — positivos e negativos.
// Aspectos negativos marcados com ageTag:true compõem a lista recomendada
// de seleção obrigatória por idade (Adulto: 1 item, Maduro: 3 itens).

export const POSITIVE_ASPECTS = [
  { id: 'reflexos_agucados', label: 'Reflexos Aguçados', description: 'Um indivíduo rápido com agilidade acima do comum.', effect: 'Vantagem em testes que envolvem Prontidão.' },
  { id: 'sistema_imunologico', label: 'Sistema Imunológico', description: 'Constituição invejável, quase nunca fica doente e resiste bem à fadiga.', effect: '+5 no resultado final de testes de Constituição e Resistência. Rola novamente 1 dado falho para resistir a fadiga ou toxinas por sessão.' },
  { id: 'maos_habeis', label: 'Mãos Hábeis', description: 'Prestidigitação elevada, mãos precisas e rápidas.', effect: 'Vantagem em situações que envolvem Prestidigitação e trabalho manual delicado.' },
  { id: 'sentidos_agucados', label: 'Sentidos Aguçados', description: 'Percepção excepcional do ambiente, seja pela visão, olfato ou audição.', effect: '+5 no resultado final de uma perícia de Sentidos à escolha (menos Prontidão) OU +5 na categoria Sentidos geral (menos Prontidão).' },
  { id: 'memoria_eidetica', label: 'Memória Eidética', description: 'Se lembra dos detalhes da vida com clareza excepcional.', effect: 'Vantagem em lembrar informações e detalhes lidos ou vistos anteriormente.' },
  { id: 'sangue_frio', label: 'Sangue Frio', description: 'Capaz de manter a calma quando necessário.', effect: 'Vantagem em testes de Vontade e Sanidade para resistir a choque ou pânico.' },
  { id: 'poliglota', label: 'Poliglota', description: 'Fala mais de uma língua.', effect: 'Fala fluentemente uma língua adicional. Dobra a quantidade de línguas faladas a cada graduação.' },
  { id: 'carisma_magnetico', label: 'Carisma Magnético', description: 'Habilidade nata em agradar os outros.', effect: 'Vantagem em testes sociais baseados em Carisma.' },
  { id: 'sortudo', label: 'Sortudo', description: 'Movido por uma força imprevisível, moldando situações favoráveis ao acaso.', effect: 'Rola novamente 1 teste falho por sessão à sua escolha.' },
  { id: 'seguro_de_si', label: 'Seguro de Si', description: 'Seus pressentimentos raramente estão errados.', effect: '+5 no resultado final de testes de Intuição.' },
  { id: 'fala_persuasiva', label: 'Fala Persuasiva', description: 'Consegue convencer pessoas com dialética impecável.', effect: 'Vantagem em testes de Lábia e convencimento.' },
  { id: 'agradavel_aos_olhos', label: 'Agradável aos Olhos', description: 'Nasceu excepcionalmente bonito.', effect: 'Vantagem em testes sociais contra pessoas suscetíveis a atração visual.' },
  { id: 'justiceiro', label: 'Justiceiro', description: 'Forte senso de justiça para uma causa específica.', effect: 'Vantagem em ações relacionadas à causa; Desvantagem caso aja ativamente contra ela.' },
  { id: 'leitor_rapido', label: 'Leitor Rápido', description: 'Capaz de ler e absorver informações rapidamente.', effect: 'Vantagem em testes de Memória sobre textos lidos; corta o tempo de leitura/pesquisa pela metade.' },
  { id: 'sono_leve', label: 'Sono Leve', description: 'Descansa em qualquer lugar e continua alerta.', effect: '+5 no resultado final para resistir a surpresas e emboscadas enquanto dorme.' },
  { id: 'empata', label: 'Empata', description: 'Faz conexão humana e considera o bem-estar alheio.', effect: '+5 no resultado final para entender emoções alheias e Vantagem para acalmar pessoas alteradas.' },
  { id: 'herdeiro', label: 'Herdeiro', description: 'Nasceu abastado, com maior disponibilidade de recursos.', effect: 'Acesso a recursos extras (itens, verba ou influência) 1x por sessão.' },
  { id: 'contatos', label: 'Contatos', description: 'Sempre conhece a pessoa certa para a situação certa.', effect: '1x por sessão, declara que conhece alguém útil presente no local ou acessível por rede.' },
  { id: 'atento', label: 'Atento', description: 'Percepção aguçada e olho atento aos arredores.', effect: 'Vantagem em testes de Percepção do ambiente e nega penalidades ao ser pego desprevenido.' },
  { id: 'voz_melodica', label: 'Voz Melódica', description: 'Capacidade vocal impressionante.', effect: '+5 no resultado final em canto, discursos ou uso performático da voz.' },
  { id: 'flexivel', label: 'Flexível', description: 'Pode se contorcer inteiro.', effect: 'Vantagem para escapar de amarras, agarrões e transitar por espaços estreitos.' },
  { id: 'alta_tolerancia_a_dor', label: 'Alta Tolerância à Dor', description: 'Tolera níveis altos de dor sem muitos problemas.', effect: 'Vantagem contra perda de Sanidade relacionada a dor e ignora penalidades por dores leves.' },
  { id: 'equilibrio_e_tudo', label: 'Equilíbrio é Tudo', description: 'Equilíbrio invejável, quase de acrobata profissional.', effect: '+5 no resultado final em testes de Equilíbrio ou Acrobacia em terrenos instáveis.' },
  { id: 'integro', label: 'Íntegro', description: 'Conduta reta e ética honesta.', effect: '+5 no resultado final de testes sociais com quem valoriza honestidade.' },
  { id: 'corajoso', label: 'Corajoso', description: 'Lida de frente com os perigos da vida.', effect: '+5 no resultado final contra testes de Medo e Intimidação.' },
  { id: 'paciente', label: 'Paciente', description: 'Controla emoções com tranquilidade.', effect: 'Vantagem em testes sociais que envolvam paciência, diplomacia ou empatia.' },
  { id: 'persistente', label: 'Persistente', description: 'Falha não é opção viável.', effect: 'Cada teste forçado pode ser forçado 1 vez a mais por sessão.' },
  { id: 'determinacao', label: 'Determinação', description: 'Determinação invejável, mesmo nos piores momentos.', effect: 'Da lista de ruptura mental, troque 1 opção (Impulso de Fuga, Inconsciência, Colapso Emocional ou Surto Violento) por Clareza Mental.' },
  { id: 'fe_em_deus', label: 'Fé em Deus', description: 'Fé de que vai dar tudo certo em situações estressantes.', effect: 'Metade da Sanidade perdida no estado ABALADO é ignorada.' },
  { id: 'versatil', label: 'Versátil', description: 'Personalidade adaptável a diversos contextos sociais.', effect: 'Vantagem em testes sociais com diferentes grupos, subculturas e classes sociais.' },
  { id: 'adaptavel', label: 'Adaptável', description: 'Toma consciência rápida da situação quando tudo dá errado.', effect: 'Re-rola 1x por sessão um teste inicial de adaptação a situação inédita.' },
  { id: 'barriga_de_ferro', label: 'Barriga de Ferro', description: 'Metabolismo resistente à maioria das toxinas.', effect: '+5 no resultado final contra venenos, intoxicações e substâncias nocivas.' },
  { id: 'bom_folego', label: 'Bom Fôlego', description: 'Resistência física maior que a média.', effect: 'A DT em testes contínuos de Resistência/Constituição para esforço físico aumenta muito mais devagar.' },
  { id: 'pintudo', label: 'Pintudo', description: 'Abençoado anatomicamente, extremamente autoconfiante.', effect: 'Permite re-rolar 1 teste social falho por sessão.' },
  { id: 'cheiroso', label: 'Cheiroso', description: 'Se cuida e está sempre emitindo aroma agradável.', effect: '+5 no resultado final em primeiras impressões sociais.' },
  { id: 'afinidade_com_animais', label: 'Afinidade com Animais', description: 'Tem jeito com animais.', effect: 'Vantagem em testes de interação ou domesticação de animais.' },
];

export const NEGATIVE_ASPECTS = [
  { id: 'miopia_astigmatismo', label: 'Miopia / Astigmatismo', description: 'Deficiência na visão, acentuada ou não.', effect: '-5 no resultado final em percepção visual à distância / Desvantagem geral em testes de visão sem óculos.', ageTag: true },
  { id: 'alergia', label: 'Alergia', description: 'Alergias específicas que dificultam a vida em momentos cruciais.', effect: 'O contato com o alérgeno gera Desvantagem em testes físicos enquanto exposto.' },
  { id: 'paranoico', label: 'Paranoico', description: 'Sempre em alerta exagerado para qualquer ameaça real ou imaginária.', effect: 'Desvantagem em testes de socialização e dificuldade em firmar laços de confiança espontâneos.' },
  { id: 'esquecido', label: 'Esquecido', description: 'Memória ruim para nomes, rostos ou informações do dia a dia.', effect: 'Desvantagem em testes de Memória ou ao lembrar detalhes cruciais.', ageTag: true },
  { id: 'vicio', label: 'Vício', description: 'Dependência que não consegue largar.', effect: 'A ausência da substância/hábito gera Desvantagem em testes que exijam foco.' },
  { id: 'mau_presagio', label: 'Mau Presságio', description: 'Presença causa desconforto em supersticiosos.', effect: '-5 no resultado final em interações sociais com pessoas crentes em superstições.' },
  { id: 'azarado', label: 'Azarado', description: 'Azar cômico e constante.', effect: '-5 no resultado final em testes de coordenação ou onde a sorte pura for relevante.' },
  { id: 'fedorento', label: 'Fedorento', description: 'Banho não é tradição na rotina.', effect: '-5 no resultado final em primeiras impressões e Desvantagem em testes de Charme.' },
  { id: 'condicao_severa', label: 'Condição Severa', description: 'Condição debilitante permanente em parte do corpo.', effect: '-5 no resultado final ou Desvantagem em testes físicos/mentais relacionados à área afetada.', ageTag: true },
  { id: 'doenca_degenerativa', label: 'Doença Degenerativa', description: 'Doença que piora progressivamente com o tempo.', effect: '-5 no resultado final em testes físicos/mentais afetados pela condição ao longo da campanha.', ageTag: true },
  { id: 'amnesia', label: 'Amnésia', description: 'Memória falha severamente por trauma, estresse ou eventos passados.', effect: 'A critério do Mestre, exige teste de Vontade em cenas de investigação/memória; em falha, esquece fatos cruciais.' },
  { id: 'ma_reputacao', label: 'Má Reputação', description: 'Mal reconhecido por erros passados ou um crime não esquecido.', effect: 'Desvantagem em interações sociais com quem já ouviu falar negativamente de você.' },
  { id: 'problema_articulacoes', label: 'Problema nas Articulações', description: 'Juntas travam em momentos inoportunos.', effect: '-5 no resultado final em testes de agilidade e movimentos bruscos.', ageTag: true },
  { id: 'estrabismo', label: 'Estrabismo', description: 'Olhos não focam no mesmo ponto, causando dores de cabeça.', effect: 'Desvantagem em testes de percepção visual refinada e foco à distância.' },
  { id: 'insonia', label: 'Insônia', description: 'Dificuldade grave em conseguir descanso reparador.', effect: 'Exige teste diário de Vontade + Constituição ao acordar; falha aplica Desvantagem no primeiro teste do dia.', ageTag: true },
  { id: 'ma_impressao', label: 'Má Impressão', description: 'Atitude inicial nunca é das melhores.', effect: '-5 no resultado final na primeira interação social com desconhecidos.' },
  { id: 'feio', label: 'Feio', description: 'Aparência não é agradável de se olhar.', effect: '-5 no resultado final em interações sociais baseadas em atração física.' },
  { id: 'lealdade_extrema', label: 'Lealdade Extrema', description: 'Obsessão cega e inabalável por uma causa, pessoa ou grupo.', effect: 'Sofre 1d6 de dano direto de Sanidade sempre que forçado a agir contra sua causa.' },
  { id: 'problemas_de_confianca', label: 'Problemas de Confiança', description: 'Traumas passados geram desconfiança constante.', effect: 'Desvantagem em testes de empatia e cooperação; +2 no resultado final para detectar mentiras ou hostilidade.' },
  { id: 'franga', label: 'Franga', description: 'Físico fraco e franzino.', effect: '-5 no resultado final em testes de Força e Resistência física.' },
  { id: 'intolerancia_lactose', label: 'Intolerância à Lactose', description: 'Organismo não digere lactose.', effect: 'Ingerir lactose exige teste de Constituição; falha resulta em dores e Desvantagem em ações físicas por 1d6 horas.' },
  { id: 'deficit_atencao', label: 'Déficit de Atenção', description: 'Dificuldade em manter o foco no mesmo estímulo por muito tempo.', effect: 'Desvantagem em testes de foco prolongado, escuta passiva e memorização de conversas longas.' },
  { id: 'discalculia', label: 'Discalculia', description: 'Dificuldade com conceitos numéricos e matemáticos.', effect: 'Desvantagem em testes que envolvam cálculo, navegação por mapas complexos e estimativas numéricas.' },
  { id: 'dislexia', label: 'Dislexia', description: 'Dificuldade no processamento de leitura e ortografia.', effect: 'Exige o dobro do tempo para ler textos e Desvantagem ao decifrar escritos ou códigos sob pressão.' },
  { id: 'personalidade_antissocial', label: 'Personalidade Antissocial', description: 'Dificuldade profunda em experimentar empatia e remorso legítimos.', effect: 'Desvantagem em testes de empatia interpessoal; +2 no resultado final em testes de manipulação fria.' },
  { id: 'transtorno_dissociativo_identidade', label: 'Transtorno Dissociativo de Identidade', description: 'Duas ou mais personalidades distintas em um único indivíduo.', effect: 'Em estresse extremo, o Mestre pode exigir teste de Vontade; falha faz outra personalidade tomar o controle temporariamente.' },
  { id: 'sentidos_fracos', label: 'Sentidos Fracos', description: 'Um dos sentidos tem desempenho muito abaixo da média.', effect: '-5 no resultado final em testes que envolvam o sentido afetado (audição, tato ou olfato/paladar).', ageTag: true },
  { id: 'gagueira', label: 'Gagueira', description: 'Dificuldade na articulação da fala sob ansiedade.', effect: 'Desvantagem em testes de fala pública sob pressão e -5 no resultado final da perícia Lábia.' },
  { id: 'saude_fragil', label: 'Saúde Frágil', description: 'Organismo fraco contra contaminações e baques físicos.', effect: '-5 no resultado final em testes para resistir a doenças, venenos e atordoamentos.', ageTag: true },
  { id: 'desatento', label: 'Desatento', description: 'Desligado do ambiente ao redor.', effect: 'Desvantagem em testes de Percepção situacional e para notar armadilhas ou sinais sutis.' },
  { id: 'calvo', label: 'Calvo', description: 'Queda acentuada de cabelo.', effect: 'Desvantagem em testes de Charme interpessoal com certas pessoas.', ageTag: true },
  { id: 'voz_irritante', label: 'Voz Irritante', description: 'Timbre vocal desagradável.', effect: '-5 no resultado final em interações verbais diplomáticas ou discursos longos.' },
  { id: 'prosopagnosia', label: 'Prosopagnosia', description: 'Dificuldade neurológica de memorizar e reconhecer rostos.', effect: 'Desvantagem em testes para reconhecer pessoas visualmente; risco de confundir conhecidos sob estresse.', ageTag: true },
  { id: 'depressao', label: 'Depressão', description: 'Desmotivação profunda e perda de interesse na rotina.', effect: 'Ao iniciar o dia, exige teste de Vontade; falha aplica -5 no resultado final de ações não urgentes.' },
  { id: 'ansiedade', label: 'Ansiedade', description: 'Preocupação e medo excessivo com situações cotidianas iminentes.', effect: 'Desvantagem em testes de tomada de decisão rápida sob pressão iminente.' },
  { id: 'baixa_tolerancia_dor', label: 'Baixa Tolerância à Dor', description: 'Sensibilidade alta a ferimentos e dor física.', effect: 'Desvantagem em testes de resistência à dor; ferimentos graves exigem teste de Vontade para não entrar em colapso.' },
  { id: 'pessimo_equilibrio', label: 'Péssimo Equilíbrio', description: 'Equilíbrio comprometido, facilita quedas em momentos inoportunos.', effect: '-5 no resultado final em testes de agilidade fina, escalada, acrobacias e terrenos irregulares.', ageTag: true },
  { id: 'pobre', label: 'Pobre', description: 'Desafortunado financeiramente, com escassez de recursos.', effect: 'Começa com 50% a menos de verba/equipamentos; Vantagem em testes para improvisar soluções e sobreviver com pouco.' },
  { id: 'ansiedade_social', label: 'Ansiedade Social', description: 'Nervosismo acentuado em contextos de interação coletiva.', effect: 'Desvantagem em testes sociais diante de grandes grupos ou figuras de autoridade.' },
  { id: 'asmatico', label: 'Asmático', description: 'Dificuldade de ventilação pulmonar em momentos de esforço.', effect: 'A DT para testes de esforço físico contínuo e resistência aeróbica aumenta muito mais rápido.', ageTag: true },
];

// Quantidade de aspectos negativos [IDADE] obrigatórios por Fase da Vida
// (ver LIFE_STAGES em lifeStages.js — Jovem não tem obrigatório fixo aqui,
// só via excesso de pacotes; Adulto e Maduro têm exigência na criação).
export const MANDATORY_AGE_ASPECTS_COUNT = {
  jovem: 0,
  adulto: 1,
  maduro: 3,
};

export function getAgeTaggedNegativeAspects() {
  return NEGATIVE_ASPECTS.filter((a) => a.ageTag);
}