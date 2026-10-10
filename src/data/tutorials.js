// src/data/tutorials.js
// Texto de cada passo da criação: `intro` (sempre visível) e `tips` (botão "?").
// `showNumberScale` mostra a régua "Como ler os números" no painel.

export const STEP_TUTORIALS = {
  identity: {
    intro: 'Neste passo você registra quem é o personagem: nome, conceito, papel, peso e dados pessoais.',
    tips: [
      'Papel: Civil ou Agente da ACE. O passo Classe & Caminho aparece apenas para Agentes.',
      'Peso (obrigatório): define a Categoria de Massa, que influencia o Vigor, o Dano Físico, a Carga e o Movimento. Escolha um peso coerente com a idade, a altura e os Pacotes físicos do personagem.',
      'Categorias por peso: Pluma até 55 kg, Leve até 75 kg, Médio até 95 kg, Pesado até 120 kg, Colosso até 250 kg, Massivo até 500 kg e Titânico acima disso.',
      'A Categoria de Massa só muda por uma alteração física drástica e duradoura, como mutação, cibernética pesada ou ganho extremo de massa ao longo de anos.',
      'Gênero, Sexualidade, Religião, Estado Civil, Altura, Aparência e Curiosidades gerais são textos livres e aparecem na ficha.',
      'Modo Mestre: liga o passo "Concessões do Mestre" (Escala, Passiva Natural e Armas Naturais). Use com a permissão do Mestre.',
    ],
  },

  lifeStage: {
    intro: 'Neste passo você escolhe a Fase da Vida: Jovem, Adulto ou Maduro.',
    tips: [
      'Cada Fase define a Sorte Inicial (Jovem 20, Adulto 15, Maduro 10) e os Pacotes de Antecedentes gratuitos (Jovem 3, Adulto 9, Maduro 6).',
      'A Sorte compra Aspectos Positivos no passo Aspectos. A cotação muda por Fase: Jovem paga 3 por Aspecto Positivo e recebe 1 por Negativo; Adulto paga 1 e recebe 1; Maduro paga 1 e recebe 3.',
      'Obrigações de idade: Jovem recebe 1 Vício ou Mania ao comprar o primeiro pacote extra; Adulto recebe 1 Aspecto Negativo de Idade; Maduro recebe 3 Aspectos Negativos de Idade.',
      'Maduro tem ainda a Penalidade de Idade: pelo menos 2 Atributos são cortados pela metade. Eles são sorteados e podem ser trocados manualmente ou sorteados de novo.',
      'Trocar a Fase da Vida reinicia os pacotes comprados, os aspectos e os traumas. Escolha a Fase antes de seguir para os próximos passos.',
    ],
  },

  backgrounds: {
    intro: 'Neste passo você compra Pacotes de Antecedentes e distribui os aumentos entre as Perícias e os Atributos.',
    tips: [
      'Cada compra concede um número fixo de Aumentos: Acadêmico, Marginal, Militar e Naturalista dão 10; Corpo, Físico e Ocultista dão 8; Interesses dá 4.',
      'Cada compra também dá +2 em um único Atributo, escolhido no modal de distribuição.',
      'Dentro de uma mesma compra, cada Perícia recebe no máximo 2 Aumentos. Aumentos de compras diferentes na mesma Perícia se somam.',
      'Cada Pacote libera categorias de Perícia específicas. No Interesses, você escolhe até 4 Perícias que representam o hobby.',
      'Os pacotes dentro do limite gratuito da Fase da Vida não custam nada. Cada pacote além disso custa d6+6 de Sanidade Máxima, rolado na compra. Remover o pacote devolve a Sanidade.',
      'Ao passar de 12 pacotes, o personagem entra em A Beira da Loucura: a Sanidade Máxima fica em 1.',
      '"Distribuir tudo pendente" reúne os pacotes ainda sem distribuição numa lista única de Perícias. "Aleatorizar" sorteia os pontos que sobrarem.',
      'Antes de concentrar pontos numa Perícia, confira "Como ler os números" abaixo: ele mostra o que cada valor significa.',
    ],
    showNumberScale: true,
  },

  aspects: {
    intro: 'Neste passo você usa a Sorte para comprar Aspectos Positivos e pode aceitar Aspectos Negativos para ganhar mais Sorte.',
    tips: [
      'O saldo de Sorte Atual aparece no topo e fica vermelho quando passa do que você tem. A cotação depende da Fase da Vida: Jovem paga 3 por Aspecto Positivo e recebe 1 por Negativo; Adulto paga 1 e recebe 1; Maduro paga 1 e recebe 3.',
      'Obrigatórios (Fase da Vida): são Aspectos Negativos ligados à idade. Clique em Sortear; cada um pode ser trocado manualmente em "trocar", e você pode sortear todos de novo. A tela mostra quantos a sua Fase exige. O Jovem não tem obrigatórios neste passo: o Vício ou Mania do Jovem vem ao comprar o primeiro pacote extra, no passo Antecedentes.',
      'Aspectos Positivos e Negativos (à escolha): marque as caixas nas duas listas. Cada Positivo marcado gasta Sorte e cada Negativo marcado devolve Sorte. O saldo conta apenas os aspectos que você marca nas listas.',
      'Aspectos Negativos Graves e Traumas sorteados por excesso de pacotes ficam no passo Antecedentes, onde também podem ser trocados manualmente.',
      'Cada Aspecto aparece na ficha com o efeito descrito. Escolha aspectos coerentes com o conceito do personagem.',
    ],
  },

  customSkills: {
    intro: 'Neste passo você monta Habilidades: vantagens pontuais além do que Perícia e Atributo já entregam.',
    tips: [
      'Toda Habilidade tem quatro peças: Gatilho (Ativo, quando você escolhe usar; ou Reativo, em resposta a algo), Condicional opcional, Custo e Efeito.',
      'O Custo é pago em Vigor, Sanidade, ações de Stamina ou Fadiga, e seu peso deve acompanhar o peso do Efeito. Pagar menos que o Efeito gera um excedente dobrado como consequência extra.',
      'O Efeito é sempre um dos Efeitos nomeados do sistema, com peso de 1 a 3 (o peso aparece em cada botão). Ao combinar mais de um Efeito, o peso final é a soma deles.',
      'O Condicional reduz o Custo em troca de amarrar a Habilidade a uma situação restrita ou perigosa.',
      'Cada Habilidade comprada custa d6+6 de Sanidade Máxima, o mesmo desgaste de um pacote extra. Remover a Habilidade devolve a Sanidade. A Habilidade de Assinatura do Arquétipo não paga esse custo.',
      'Você pode criar a partir do Catálogo, de um Modelo (preenchendo o contexto) ou do zero.',
    ],
  },

  occupation: {
    intro: 'Neste passo você escolhe a Ocupação Primária e a Secundária, que dão bônus em Perícias e Atributos.',
    tips: [
      'A Primária dá +5 nas Perícias da categoria e +2 no Atributo da categoria. A Secundária dá +3 nas Perícias e +1 em um Atributo livre, que você escolhe.',
      'Perícias repetidas entre as duas Ocupações somam +8.',
      'Esses bônus somam no resultado da rolagem e não mudam o dado da Perícia. Por isso a ficha mostra, por exemplo, d8 (+5).',
    ],
  },

  classPath: {
    intro: 'Neste passo, exclusivo para Agentes, você escolhe Classe, Arquétipo, Especialidade e Caminho.',
    tips: [
      'A Classe e o Arquétipo dão bônus fixos em Atributos e Perícias. O Lutador escolhe 1 Perícia para o bônus de Classe.',
      'O Arquétipo concede uma Habilidade de Assinatura: escolha 1 entre 3.',
      'Cada ponto de Especialidade, concedido pelo bônus de Classe (Lutador e Ocultista têm 1, Suporte tem 2), vira uma Passiva própria, sempre ligada, numa ação específica que o personagem domina. Você combina quantos Efeitos quiser, e o Condicional é opcional.',
      'O Escopo da Especialidade é uma ação específica (por exemplo, "desarmar um oponente agarrado"), e não uma Perícia inteira.',
      'O Caminho concede uma vantagem própria, descrita no card.',
    ],
  },

  fightingStyle: {
    intro: 'Neste passo você monta o Estilo de Luta: distribui pontos entre os Eixos e a Postura e escolhe Passivas e Golpes de Assinatura.',
    tips: [
      'Todo personagem tem um Estilo, mesmo com 0 pontos. Os pontos totais são iguais ao nível da Perícia Combate (dobrado para o Arquétipo Artista Marcial).',
      'Os 5 Eixos: Potência soma um dado de bônus ao Dano Físico; Robustez soma um dado ao Teste Reativo contra Atordoamento; Agilidade dá 1 Reação gratuita por turno por ponto; Distância dá 1 reposicionamento por cena por ponto; Controle soma um dado nas Manobras.',
      'Postura: o Nível 1 custa 1 ponto e o Nível 2 custa 3 pontos no total. Pontos fora desses valores não somam efeito.',
      'Passivas: a cada 3 pontos investidos no Estilo, você ganha 1 ponto de peso. Cada Efeito pesa no máximo 2, e Reverter e Multiplicar ficam de fora. O Condicional reduz o peso da Passiva em 1 (mínimo 1).',
      'Golpes de Assinatura: 1 a cada 2 pontos investidos. Funcionam como Habilidades de combate e só valem enquanto o Estilo estiver ativo.',
      'Apenas um Estilo fica ativo por vez. Use "Ativar" para marcar qual é.',
    ],
  },

  inventory: {
    intro: 'Neste passo você lista o que o personagem carrega e os efeitos de cada item.',
    tips: [
      'Escolha itens do Arsenal Padrão (armas, Kit Médico, pentes e reservas de munição) ou crie um Item livre com nome, quantidade e descrição.',
      'As armas mostram o dano, o Tipo de Dano e as Tags, cada um com sua descrição. As armas corpo a corpo somam o seu Dano Físico ao dado da arma.',
      'O Suprimento mostra o Dado de Suprimento e o tamanho do pente ou da reserva, quando a arma usa munição.',
      'O topo do passo mostra a sua Carga confortável, como referência. O Inventário não pesa item por item.',
    ],
  },

  masterGrants: {
    intro: 'Neste passo (Modo Mestre) você registra as concessões que dependem do Mestre: Escala, Passiva Natural e Armas Naturais.',
    tips: [
      'A Escala 1 é o padrão e não custa nada. A Escala 2 ou mais usa Modificadores de Escala, cujo total depende da Escala Geral (2 dá 2, 3 dá 4, 4 dá 8, 5 dá 16). Cada Modificador sobe uma Perícia em 1 grau.',
      'Escala 0 ou −1 vale para uma categoria inteira de Perícias. Para personagem de jogador, o limite é de 3 categorias.',
      'A Passiva Natural é uma facilidade inata sempre ligada, concedida pelo Mestre e sem limite de pontos. Cada Efeito pesa no máximo 2.',
      'A Arma Natural usa um Tipo de Dano escolhido pela anatomia (presa é Perfurante, garra é Cortante, coice é Contundente) e as Tags que fizerem sentido. O ataque desarmado rola com isso.',
    ],
  },

  review: {
    intro: 'Neste passo você confere a ficha completa e salva ou exporta.',
    tips: [
      'Salvar Ficha grava a ficha no banco de dados. Antes de continuar em outro aparelho, salve.',
      'Baixar Ficha (.txt) e Gerar PDF exportam a ficha com todos os campos.',
      'Vigor, Dano Físico, Sanidade Máxima, Carga e Movimento são calculados automaticamente a partir dos Atributos, Perícias, Massa e Estilo.',
      'Cada Perícia aparece com o dado e o nível de domínio correspondente. Confira "Como ler os números" abaixo.',
    ],
    showNumberScale: true,
  },
};