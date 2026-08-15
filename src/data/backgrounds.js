// src/data/backgrounds.js
// Pacotes de Antecedentes — cada um concede "Aumentos" para distribuir entre
// as categorias de perícia permitidas. Podem ser comprados múltiplas vezes
// (Acúmulo de Graduação), cada compra aumenta o teto de +2 níveis num atributo.
//
// Regras gerais (valem para todos os pacotes, ver characterCalculations.js):
// - Máx. 2 Aumentos por perícia dentro de uma mesma compra do pacote.
// - Aumentos de pacotes diferentes na mesma perícia se somam livremente.

export const BACKGROUND_PACKAGES = {
  academico: {
    id: 'academico',
    label: 'Pacote Acadêmico',
    description:
      'Formação formal em instituições de ensino: estudo, pesquisa teórica, pensamento crítico.',
    pointsPerPurchase: 10,
    // Categorias de perícia liberadas para gastar os pontos + espaço p/ escolha livre
    allowedSkillCategories: ['mente', 'conhecimento', 'profissao', 'tecnologia', 'miscelanea', 'social'],
    freeChoiceSlots: 2, // "+ 2 Atributos à escolha"
    narrativeScale: [
      { purchase: 1, title: 'Ensino Médio', text: 'Conhecimento geral, alfabetização científica básica, interpretação de texto e raciocínio lógico elementar.' },
      { purchase: 2, title: 'Faculdade', text: 'Especialização em área específica, metodologia de pesquisa, artigos científicos e vivência universitária.' },
      { purchase: 3, title: 'Mestrado', text: 'Domínio técnico aprofundado, capacidade de tese, autoridade intelectual e docência acadêmica.' },
      { purchase: 4, title: 'Doutorado', text: 'Referência na área, produção de conhecimento inédito, alto rigor analítico e reputação científica.' },
    ],
  },

  corpo: {
    id: 'corpo',
    label: 'Pacote Corpo',
    description: 'Molde biológico natural: vitalidade, genética, resistência e sentidos.',
    pointsPerPurchase: 5,
    allowedSkillCategories: ['corpo', 'mente', 'sentidos', 'social'],
    freeChoiceSlots: 0,
    narrativeScale: [
      { purchase: 1, title: 'Resistência Básica', text: 'Organismo funcional, boa recuperação de fadiga diária e imunidade padrão.' },
      { purchase: 2, title: 'Saudável', text: 'Vitalidade acima da média, excelente sistema imunológico, disposição constante.' },
      { purchase: 3, title: 'Ótimo', text: 'Físico privilegiado, altíssima tolerância a dor, toxinas e estresse biológico.' },
      { purchase: 4, title: 'Excepcional', text: 'Genética fora da curva, vigor físico no auge humano, sentidos aguçados.' },
    ],
  },

  fisico: {
    id: 'fisico',
    label: 'Pacote Físico',
    description: 'Treinamento deliberado do corpo: exercício, esportes, condicionamento, artes marciais.',
    pointsPerPurchase: 5,
    allowedSkillCategories: ['corpo', 'movimento', 'combate', 'sentidos'],
    freeChoiceSlots: 0,
    narrativeScale: [
      { purchase: 1, title: 'Iniciado', text: 'Praticante regular de atividades físicas, frequência em academias ou esportes recreativos.' },
      { purchase: 2, title: 'Ativo', text: 'Atleta amador constante, bom controle corporal, explosão muscular e fôlego.' },
      { purchase: 3, title: 'Experiente', text: 'Condicionamento de atleta competitivo, rotina rígida de exercícios.' },
      { purchase: 4, title: 'Profissional', text: 'Preparo físico de elite, reflexos extremamente afiados, força e mobilidade no limite humano.' },
    ],
  },

  interesses: {
    id: 'interesses',
    label: 'Pacote Interesses',
    description: 'Investimento pessoal em hobbies, paixões e projetos paralelos.',
    pointsPerPurchase: 4,
    allowedSkillCategories: [], // qualquer categoria — ver freeChoiceSlots
    freeChoiceSlots: 4, // "Escolha até 4 Atributos quaisquer"
    narrativeScale: [
      { purchase: 1, title: 'Amador', text: 'Entusiasta casual de fins de semana, leitura esporádica e prática não profissional.' },
      { purchase: 2, title: 'Apaixonado', text: 'Dedicação constante, compra de equipamentos próprios, estudo ativo.' },
      { purchase: 3, title: 'Pretensioso', text: 'Domínio avançado sobre o assunto, conhecimento comparável ao de profissionais.' },
      { purchase: 4, title: 'Mestre Hobbista', text: 'Autoridade no assunto entre entusiastas, acervo pessoal e habilidade lapidada por anos.' },
    ],
  },

  marginal: {
    id: 'marginal',
    label: 'Pacote Marginal',
    description: 'Sobrevivência nas ruas, criminalidade e ambientes desregulados.',
    pointsPerPurchase: 10,
    allowedSkillCategories: ['tecnologia', 'utilidade', 'conhecimento', 'social', 'movimento', 'combate'],
    freeChoiceSlots: 0,
    narrativeScale: [
      { purchase: 1, title: 'Aviãozinho / Olheiro', text: 'Contato inicial com a rua, malícia para evitar golpes simples.' },
      { purchase: 2, title: 'Capanga / Executor', text: 'Prática com esquemas ilícitos, intimidação direta, manejo de riscos operacionais.' },
      { purchase: 3, title: 'Bandido / Veterano', text: 'Conhece as engrenagens do crime, rotas de fuga, receptação e negociações perigosas.' },
      { purchase: 4, title: 'Chefão / Comandante', text: 'Visão estratégica do submundo, autoridade no crime, controle territorial.' },
    ],
  },

  militar: {
    id: 'militar',
    label: 'Pacote Militar',
    description: 'Treinamento formal em forças armadas, polícia ou grupos paramilitares.',
    pointsPerPurchase: 10,
    allowedSkillCategories: ['corpo', 'sentidos', 'mente', 'utilidade', 'combate', 'movimento', 'miscelanea'],
    freeChoiceSlots: 0,
    narrativeScale: [
      { purchase: 1, title: 'Alistamento / Recruta', text: 'Instrução básica de tiros, formação disciplinar, manuseio de equipamentos básicos.' },
      { purchase: 2, title: 'Soldado / Operador', text: 'Experiência de campo real, patrulhamento, combate tático.' },
      { purchase: 3, title: 'Sargento / Liderança Tática', text: 'Comando de esquadrão em crises, frieza sob ataque, controle de baixas.' },
      { purchase: 4, title: 'Capitão / Estrategista', text: 'Comando de operações complexas, planejamento tático avançado, gestão de crise.' },
    ],
  },

  naturalista: {
    id: 'naturalista',
    label: 'Pacote Naturalista',
    description: 'Vivência com o ambiente natural, áreas rurais, vida selvagem, expedições.',
    pointsPerPurchase: 10,
    allowedSkillCategories: ['movimento', 'miscelanea', 'utilidade', 'profissao', 'conhecimento', 'corpo'],
    freeChoiceSlots: 0,
    narrativeScale: [
      { purchase: 1, title: 'Campista Casual', text: 'Prática com acampamentos, trilhas, orientação por bússola/estrelas e nós básicos.' },
      { purchase: 2, title: 'Caipira / Trabalhador Rural', text: 'Trabalho direto com a terra, trato com animais, resiliência a intempéries.' },
      { purchase: 3, title: 'Fazendeiro / Guia', text: 'Manejo completo de propriedades rurais, navegação por terreno fechado.' },
      { purchase: 4, title: 'Aventureiro / Sobrevivente', text: 'Adaptação total a ecossistemas inóspitos, rastreamento avançado, autonomia total.' },
    ],
  },

  ocultista: {
    id: 'ocultista',
    label: 'Pacote Ocultista',
    description: 'Estudo ou contato com o sobrenatural, dogmas esquecidos, ordens secretas.',
    pointsPerPurchase: 5,
    allowedSkillCategories: ['mente', 'profissao', 'miscelanea'],
    freeChoiceSlots: 0,
    extraSkills: ['ocultismo'], // pertence à categoria "combate" mas é liberado aqui também
    narrativeScale: [
      { purchase: 1, title: 'Curioso', text: 'Leituras esotéricas superficiais, lendas urbanas, símbolos básicos.' },
      { purchase: 2, title: 'Amador', text: 'Prática de ritos simples, identificação de tomos e grimórios.' },
      { purchase: 3, title: 'Cultista', text: 'Envolvimento profundo com seitas, tradução de línguas mortas, rituais complexos.' },
      { purchase: 4, title: 'Líder Espiritual / Mestre do Oculto', text: 'Autoridade em tomos proibidos, domínio sobre dogmas obscuros.' },
    ],
  },
};

// Regras gerais de distribuição (RN-08 / "Como Funcionam os Pacotes")
export const BACKGROUND_RULES = {
  maxIncreasePerSkillPerPurchase: 2, // cada compra: até 2 aumentos numa mesma perícia
  graduationBonusPerRepeat: 2, // cada recompra do mesmo pacote: +2 no teto daquele atributo
};