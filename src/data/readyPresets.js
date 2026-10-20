// src/data/readyPresets.js
// Listas prontas (ace_listas_prontas, 19/10/2026): Especialidades, Passivas Naturais, Passivas de Estilo e Golpes de Assinatura.
// Os nomes de Efeito seguem as chaves de EFFECT_DEFINITIONS (abilities.js): "Facilitar (Aprimorado)".
// `conditional` das Especialidades e Passivas é texto; os creators convertem para { description }.

import { getEffectWeight, EFFECT_DEFINITIONS } from './abilities';

export const SPECIALTY_PRESETS = [
  {"id": "esp_desarmar_agarrado", "name": "Desarmar Agarrado", "origin": "Lutador", "scope": "desarmar um oponente agarrado", "conditional": null, "names": ["Vantagem"], "description": "Tirar a arma da mão de quem está preso numa chave.", "source": "livro"},
  {"id": "esp_desarmar_agarrado_firme", "name": "Desarmar Agarrado Firme", "origin": "Lutador", "scope": "desarmar um oponente agarrado", "conditional": "só contra armas curtas", "names": ["Vantagem", "Garantir"], "description": "Desarmar com firmeza quem está agarrado e empunha uma arma curta.", "source": "livro"},
  {"id": "esp_maos_de_ferro", "name": "Mãos de Ferro", "origin": "Lutador", "scope": "manter um oponente agarrado", "conditional": null, "names": ["Vantagem"], "description": "Pegada firme que não deixa o oponente escapar.", "source": "proposta"},
  {"id": "esp_queda_controlada", "name": "Queda Controlada", "origin": "Lutador", "scope": "amortecer uma queda", "conditional": null, "names": ["Facilitar"], "description": "Saber cair e rolar para reduzir o impacto.", "source": "proposta"},
  {"id": "esp_golpe_de_surpresa", "name": "Golpe de Surpresa", "origin": "Lutador", "scope": "atacar um alvo desprevenido", "conditional": null, "names": ["Vantagem"], "description": "Aproveitar o instante em que o alvo ainda não percebeu o ataque.", "source": "proposta"},
  {"id": "esp_tiro_parado", "name": "Tiro Parado", "origin": "Lutador", "scope": "atirar com arma de fogo", "conditional": "só se não se moveu no turno", "names": ["Amplificar"], "description": "Atirar com calma, apoiado e sem se mover.", "source": "proposta"},
  {"id": "esp_escudo_firme", "name": "Escudo Firme", "origin": "Lutador", "scope": "bloquear com um escudo", "conditional": null, "names": ["Vantagem"], "description": "Treino em posicionar o escudo contra os golpes.", "source": "proposta"},
  {"id": "esp_respiro_de_combate", "name": "Respiro de Combate", "origin": "Lutador", "scope": "recuperar o fôlego", "conditional": null, "names": ["Potencializar"], "description": "Controlar a respiração para voltar ao ritmo no meio da luta.", "source": "proposta"},
  {"id": "esp_olho_pra_simbolos", "name": "Olho pra Símbolos", "origin": "Ocultista", "scope": "decifrar um símbolo ocultista", "conditional": null, "names": ["Facilitar"], "description": "Reconhecer e decifrar símbolos ocultistas.", "source": "livro"},
  {"id": "esp_leitura_de_rituais", "name": "Leitura de Rituais", "origin": "Ocultista", "scope": "decifrar um ritual escrito", "conditional": "só de uma tradição que já estudou", "names": ["Facilitar (Aprimorado)"], "description": "Entender rituais escritos de uma tradição estudada.", "source": "proposta"},
  {"id": "esp_presenca_sentida", "name": "Presença Sentida", "origin": "Ocultista", "scope": "perceber a presença de uma Entidade próxima", "conditional": null, "names": ["Vantagem"], "description": "Perceber quando uma Entidade está por perto.", "source": "proposta"},
  {"id": "esp_mente_firme", "name": "Mente Firme", "origin": "Ocultista", "scope": "resistir ao pavor causado por uma Entidade", "conditional": null, "names": ["Garantir"], "description": "Manter a cabeça fria diante do pavor que uma Entidade causa.", "source": "proposta"},
  {"id": "esp_tracar_circulo", "name": "Traçar Círculo", "origin": "Ocultista", "scope": "traçar um círculo ritual", "conditional": null, "names": ["Agilizar"], "description": "Traçar um círculo ritual com rapidez.", "source": "proposta"},
  {"id": "esp_reparo_rapido", "name": "Reparo Rápido", "origin": "Suporte (Engenheiro)", "scope": "consertar um equipamento sob pressão", "conditional": null, "names": ["Agilizar"], "description": "Consertar equipamento com rapidez, mesmo sob pressão.", "source": "livro"},
  {"id": "esp_gambiarra", "name": "Gambiarra", "origin": "Suporte (Engenheiro)", "scope": "improvisar um reparo com sucata", "conditional": null, "names": ["Facilitar"], "description": "Improvisar um conserto com o que houver à mão.", "source": "proposta"},
  {"id": "esp_mao_de_cofre", "name": "Mão de Cofre", "origin": "Suporte (Engenheiro)", "scope": "desarmar uma armadilha ou um mecanismo", "conditional": null, "names": ["Facilitar"], "description": "Desarmar armadilhas e mecanismos com mão firme.", "source": "proposta"},
  {"id": "esp_olhar_treinado", "name": "Olhar Treinado", "origin": "Suporte (Investigador)", "scope": "procurar pistas numa cena", "conditional": null, "names": ["Facilitar"], "description": "Achar pistas que passam despercebidas numa cena.", "source": "proposta"},
  {"id": "esp_faro_pra_mentira", "name": "Faro pra Mentira", "origin": "Suporte (Investigador)", "scope": "perceber que alguém está mentindo", "conditional": null, "names": ["Vantagem"], "description": "Perceber quando alguém está mentindo.", "source": "proposta"},
  {"id": "esp_arquivista", "name": "Arquivista", "origin": "Suporte (Investigador)", "scope": "pesquisar em registros e documentos", "conditional": null, "names": ["Facilitar"], "description": "Achar informação em registros e documentos.", "source": "proposta"},
  {"id": "esp_maos_firmes", "name": "Mãos Firmes", "origin": "Suporte (Médico de Campo)", "scope": "estancar um sangramento", "conditional": null, "names": ["Garantir"], "description": "Estancar um sangramento com mãos que não tremem.", "source": "livro"},
  {"id": "esp_diagnostico_rapido", "name": "Diagnóstico Rápido", "origin": "Suporte (Médico de Campo)", "scope": "diagnosticar um veneno ou uma doença", "conditional": null, "names": ["Facilitar"], "description": "Identificar um veneno ou uma doença pelos sintomas.", "source": "proposta"},
  {"id": "esp_conversa_mansa", "name": "Conversa Mansa", "origin": "Suporte (Negociador)", "scope": "acalmar uma pessoa hostil", "conditional": null, "names": ["Vantagem"], "description": "Acalmar uma pessoa hostil falando com calma.", "source": "proposta"},
  {"id": "esp_barganha", "name": "Barganha", "origin": "Suporte (Negociador)", "scope": "pechinchar um preço ou uma troca", "conditional": null, "names": ["Vantagem"], "description": "Pechinchar um preço ou uma troca.", "source": "proposta"},
  {"id": "esp_folego_de_corredor", "name": "Fôlego de Corredor", "origin": "Geral (cotidiana)", "scope": "correr em Esforço Intenso", "conditional": null, "names": ["Blindar"], "description": "Corpo acostumado a manter o ritmo de corrida. Blindar: ignora a penalidade acumulada de Fadiga desse esforço.", "source": "proposta"},
  {"id": "esp_pe_de_atalho", "name": "Pé de Atalho", "origin": "Geral (cotidiana)", "scope": "tentar um atalho numa perseguição", "conditional": null, "names": ["Vantagem"], "description": "Olho para o caminho mais curto numa fuga.", "source": "proposta"},
  {"id": "esp_escalador", "name": "Escalador", "origin": "Geral (cotidiana)", "scope": "escalar uma superfície difícil", "conditional": null, "names": ["Facilitar"], "description": "Prática em subir paredes, árvores e estruturas.", "source": "proposta"},
  {"id": "esp_nadador", "name": "Nadador", "origin": "Geral (cotidiana)", "scope": "nadar contra a correnteza", "conditional": null, "names": ["Facilitar"], "description": "Domínio da água, inclusive com correnteza.", "source": "proposta"},
  {"id": "esp_pulo_certo", "name": "Pulo Certo", "origin": "Geral (cotidiana)", "scope": "pular um muro ou um vão (Parkour)", "conditional": null, "names": ["Facilitar"], "description": "Julgar bem a distância de muros e vãos.", "source": "proposta"},
  {"id": "esp_pe_firme_no_volante", "name": "Pé Firme no Volante", "origin": "Geral (cotidiana)", "scope": "conduzir um veículo em alta velocidade", "conditional": null, "names": ["Garantir"], "description": "Controle do veículo em alta velocidade.", "source": "proposta"},
  {"id": "esp_sumir_na_multidao", "name": "Sumir na Multidão", "origin": "Geral (cotidiana)", "scope": "se esconder entre pessoas", "conditional": null, "names": ["Vantagem"], "description": "Misturar-se entre as pessoas e desaparecer.", "source": "proposta"},
  {"id": "esp_ouvido_atento", "name": "Ouvido Atento", "origin": "Geral (cotidiana)", "scope": "ouvir uma conversa ou um ruído à distância", "conditional": null, "names": ["Facilitar"], "description": "Ouvir o que outros deixam passar.", "source": "proposta"},
  {"id": "esp_memoria_de_rostos", "name": "Memória de Rostos", "origin": "Geral (cotidiana)", "scope": "lembrar um rosto já visto", "conditional": null, "names": ["Facilitar"], "description": "Guardar rostos vistos uma única vez.", "source": "proposta"},
  {"id": "esp_sobrevivente_de_rua", "name": "Sobrevivente de Rua", "origin": "Geral (cotidiana)", "scope": "encontrar abrigo ou comida na cidade", "conditional": null, "names": ["Facilitar"], "description": "Saber onde achar abrigo e comida na cidade.", "source": "proposta"},
  {"id": "esp_acalmar_animal", "name": "Acalmar Animal", "origin": "Geral (Ocupação: Animal)", "scope": "acalmar um animal assustado", "conditional": null, "names": ["Facilitar"], "description": "Jeito com animais, que se acalmam com a presença do personagem.", "source": "proposta"},
  {"id": "esp_papo_reto", "name": "Papo Reto", "origin": "Geral (Ocupação: Comunicação)", "scope": "obter uma informação numa conversa casual", "conditional": null, "names": ["Vantagem"], "description": "Conversa franca que faz o outro falar mais do que pretendia.", "source": "proposta"},
  {"id": "esp_maos_de_artista", "name": "Mãos de Artista", "origin": "Geral (Ocupação: Criativo)", "scope": "imitar um estilo ou uma assinatura", "conditional": null, "names": ["Facilitar"], "description": "Mão treinada para copiar traços e estilos.", "source": "proposta"},
  {"id": "esp_gazua_agil", "name": "Gazua Ágil", "origin": "Geral (Ocupação: Criminoso)", "scope": "arrombar uma fechadura comum", "conditional": null, "names": ["Agilizar"], "description": "Abrir fechaduras comuns em poucos segundos.", "source": "proposta"},
  {"id": "esp_memoria_de_professor", "name": "Memória de Professor", "origin": "Geral (Ocupação: Educador)", "scope": "lembrar um conceito que já ensinou", "conditional": null, "names": ["Facilitar"], "description": "Lembrar com clareza o que já explicou muitas vezes.", "source": "proposta"},
  {"id": "esp_rotina_de_trabalho", "name": "Rotina de Trabalho", "origin": "Geral (Ocupação: Empregado)", "scope": "repetir uma tarefa do próprio emprego", "conditional": null, "names": ["Garantir"], "description": "Fazer sem erro a tarefa que repete todo dia.", "source": "proposta"},
  {"id": "esp_olho_de_engenheiro", "name": "Olho de Engenheiro", "origin": "Geral (Ocupação: Engenharias)", "scope": "avaliar a estabilidade de uma estrutura", "conditional": null, "names": ["Facilitar"], "description": "Ver de relance se uma estrutura aguenta.", "source": "proposta"},
  {"id": "esp_calculo_de_cabeca", "name": "Cálculo de Cabeça", "origin": "Geral (Ocupação: Exatas)", "scope": "calcular uma distância ou uma quantidade sem instrumentos", "conditional": null, "names": ["Facilitar"], "description": "Fazer contas rápidas de cabeça.", "source": "proposta"},
  {"id": "esp_corpo_treinado", "name": "Corpo Treinado", "origin": "Geral (Ocupação: Físico)", "scope": "forçar uma porta ou mover um obstáculo pesado", "conditional": null, "names": ["Facilitar"], "description": "Corpo condicionado para esforços de força.", "source": "proposta"},
  {"id": "esp_leitura_de_cultura", "name": "Leitura de Cultura", "origin": "Geral (Ocupação: Humanas)", "scope": "entender os costumes de um grupo", "conditional": null, "names": ["Facilitar"], "description": "Compreender costumes e história de um grupo.", "source": "proposta"},
  {"id": "esp_aguenta_o_tranco", "name": "Aguenta o Tranco", "origin": "Geral (Ocupação: Labuta)", "scope": "trabalhar em esforço prolongado", "conditional": null, "names": ["Blindar"], "description": "Resistência de quem trabalha pesado o dia todo. Blindar: ignora a penalidade acumulada de Fadiga desse esforço.", "source": "proposta"},
  {"id": "esp_conhece_a_lei", "name": "Conhece a Lei", "origin": "Geral (Ocupação: Lei)", "scope": "saber o que é legal e como funciona um procedimento", "conditional": null, "names": ["Facilitar"], "description": "Conhecimento de leis e procedimentos.", "source": "proposta"},
  {"id": "esp_ler_pressagios", "name": "Ler Presságios", "origin": "Geral (Ocupação: Místico)", "scope": "interpretar sinais e presságios", "conditional": null, "names": ["Facilitar"], "description": "Interpretar sinais, sonhos e presságios.", "source": "proposta"},
  {"id": "esp_faro_pra_negocio", "name": "Faro pra Negócio", "origin": "Geral (Ocupação: Negócios)", "scope": "avaliar o valor de um bem", "conditional": null, "names": ["Facilitar"], "description": "Estimar quanto algo realmente vale.", "source": "proposta"},
  {"id": "esp_referencia_cruzada", "name": "Referência Cruzada", "origin": "Geral (Ocupação: Pesquisador)", "scope": "relacionar duas informações já descobertas", "conditional": null, "names": ["Facilitar"], "description": "Ligar pontos entre informações que parecem soltas.", "source": "proposta"},
  {"id": "esp_jogo_de_cintura", "name": "Jogo de Cintura", "origin": "Geral (Ocupação: Político)", "scope": "escapar de uma pergunta incômoda", "conditional": null, "names": ["Vantagem"], "description": "Sair de uma saia justa sem se comprometer.", "source": "proposta"},
  {"id": "esp_palavra_de_conforto", "name": "Palavra de Conforto", "origin": "Geral (Ocupação: Religioso)", "scope": "consolar alguém em pânico", "conditional": null, "names": ["Garantir"], "description": "Palavras que acalmam quem está em desespero.", "source": "proposta"},
  {"id": "esp_triagem_rapida", "name": "Triagem Rápida", "origin": "Geral (Ocupação: Saúde)", "scope": "avaliar a gravidade de um ferimento", "conditional": null, "names": ["Facilitar"], "description": "Avaliar de imediato o tamanho de um ferimento.", "source": "proposta"},
  {"id": "esp_olho_de_seguranca", "name": "Olho de Segurança", "origin": "Geral (Ocupação: Segurança)", "scope": "notar alguém escondendo uma arma", "conditional": null, "names": ["Vantagem"], "description": "Olhar treinado para sinais de perigo numa multidão.", "source": "proposta"},
  {"id": "esp_mexe_em_qualquer_coisa", "name": "Mexe em Qualquer Coisa", "origin": "Geral (Ocupação: Tecnologias)", "scope": "usar um aparelho eletrônico desconhecido", "conditional": null, "names": ["Facilitar"], "description": "Descobrir rápido como um aparelho funciona.", "source": "proposta"},
  {"id": "esp_mao_de_oficio", "name": "Mão de Ofício", "origin": "Geral (Ocupação: Trabalho Manual)", "scope": "consertar um objeto do dia a dia", "conditional": null, "names": ["Agilizar"], "description": "Consertos rápidos de quem vive de trabalho manual.", "source": "proposta"}
];

export const NATURAL_PASSIVE_PRESETS = [
  {"id": "nat_escalador_nato", "name": "Escalador Nato", "scope": "escalar", "conditional": null, "names": ["Facilitar (Aprimorado)"], "description": "Corpo feito para subir, sem esforço aparente.", "source": "livro"},
  {"id": "nat_empurrao_imparavel", "name": "Empurrão Imparável", "scope": "empurrar ou derrubar algo no caminho", "conditional": null, "names": ["Vantagem"], "description": "Massa e força que varrem o que estiver na frente.", "source": "livro"},
  {"id": "nat_nadador_nato", "name": "Nadador Nato", "scope": "nadar", "conditional": null, "names": ["Facilitar (Aprimorado)"], "description": "Corpo adaptado à água.", "source": "proposta"},
  {"id": "nat_pouso_seguro", "name": "Pouso Seguro", "scope": "amortecer uma queda", "conditional": null, "names": ["Facilitar (Aprimorado)"], "description": "Cai de pé e sem se machucar.", "source": "proposta"},
  {"id": "nat_faro_agucado", "name": "Faro Aguçado", "scope": "seguir um rastro de cheiro", "conditional": null, "names": ["Facilitar (Aprimorado)"], "description": "Olfato apurado que acompanha rastros.", "source": "proposta"},
  {"id": "nat_visao_agucada", "name": "Visão Aguçada", "scope": "avistar algo à distância", "conditional": null, "names": ["Facilitar (Aprimorado)"], "description": "Visão que alcança detalhes muito longe.", "source": "proposta"},
  {"id": "nat_sentidos_no_escuro", "name": "Sentidos no Escuro", "scope": "perceber no escuro", "conditional": null, "names": ["Facilitar (Aprimorado)"], "description": "Percebe o ambiente mesmo sem luz.", "source": "proposta"},
  {"id": "nat_alerta_constante", "name": "Alerta Constante", "scope": "perceber uma ameaça que se aproxima", "conditional": null, "names": ["Vantagem"], "description": "Sempre atento ao que se move por perto.", "source": "proposta"},
  {"id": "nat_passo_silencioso", "name": "Passo Silencioso", "scope": "aproximar-se sem ser notado", "conditional": null, "names": ["Vantagem"], "description": "Movimentos leves que quase não fazem barulho.", "source": "proposta"},
  {"id": "nat_camuflagem_natural", "name": "Camuflagem Natural", "scope": "esconder-se parado no terreno", "conditional": null, "names": ["Vantagem"], "description": "Corpo que se confunde com o terreno.", "source": "proposta"},
  {"id": "nat_bote_rapido", "name": "Bote Rápido", "scope": "atacar de emboscada", "conditional": null, "names": ["Agilizar"], "description": "Ataque súbito vindo de uma espera imóvel.", "source": "proposta"},
  {"id": "nat_investida", "name": "Investida", "scope": "atacar", "conditional": "só depois de correr em linha reta até o alvo", "names": ["Amplificar"], "description": "Ataque que ganha força com a corrida.", "source": "proposta"},
  {"id": "nat_caca_em_bando", "name": "Caça em Bando", "scope": "flanquear um alvo", "conditional": "só com aliado da mesma espécie junto ao alvo", "names": ["Vantagem"], "description": "Ataque coordenado de quem caça em grupo.", "source": "proposta"},
  {"id": "nat_presenca_aterradora", "name": "Presença Aterradora", "scope": "intimidar", "conditional": null, "names": ["Vantagem"], "description": "Presença que mete medo só de aparecer.", "source": "proposta"},
  {"id": "nat_pele_grossa", "name": "Pele Grossa", "scope": "sofrer dano físico", "conditional": null, "names": ["Blindar"], "description": "Pele e couro espessos. Blindar: ignora a penalidade acumulada de ferimentos leves.", "source": "proposta"},
  {"id": "nat_incansavel", "name": "Incansável", "scope": "sustentar esforço prolongado", "conditional": null, "names": ["Blindar"], "description": "Corpo que quase não se cansa. Blindar: ignora a penalidade acumulada de Fadiga.", "source": "proposta"}
];

export const STYLE_PASSIVE_PRESETS = [
  {"id": "pas_chute_firme", "name": "Chute Firme", "category": "Chutes", "conditional": null, "names": ["Amplificar"], "stylePoints": 6, "description": "Chutes plantados e bem apoiados, que acertam onde miram.", "source": "livro"},
  {"id": "pas_chute_giratorio_certeiro", "name": "Chute Giratório Certeiro", "category": "Chutes", "conditional": "só em chutes giratórios", "names": ["Amplificar"], "stylePoints": 3, "description": "O giro dá ao chute a precisão de quem treinou o movimento.", "source": "livro"},
  {"id": "pas_guarda_de_ferro", "name": "Guarda de Ferro", "category": "Defesas", "conditional": null, "names": ["Amplificar", "Garantir"], "stylePoints": 9, "description": "Guarda fechada e treinada, difícil de furar.", "source": "livro"},
  {"id": "pas_soco_firme", "name": "Soco Firme", "category": "Socos", "conditional": null, "names": ["Amplificar"], "stylePoints": 6, "description": "Socos de base firme e punho alinhado.", "source": "proposta"},
  {"id": "pas_soco_pesado", "name": "Soco Pesado", "category": "Socos", "conditional": null, "names": ["Potencializar"], "stylePoints": 3, "description": "Socos que carregam o peso do corpo.", "source": "proposta"},
  {"id": "pas_cotovelada_seca", "name": "Cotovelada Seca", "category": "Cotoveladas", "conditional": null, "names": ["Potencializar"], "stylePoints": 3, "description": "Cotoveladas curtas e secas.", "source": "proposta"},
  {"id": "pas_joelhada_dura", "name": "Joelhada Dura", "category": "Joelhadas", "conditional": null, "names": ["Potencializar"], "stylePoints": 3, "description": "Joelhadas com o quadril por trás.", "source": "proposta"},
  {"id": "pas_agarrao_firme", "name": "Agarrão Firme", "category": "Agarrões", "conditional": null, "names": ["Vantagem"], "stylePoints": 6, "description": "Pegada de quem treina lutas de agarre.", "source": "proposta"},
  {"id": "pas_agarrao_seguro", "name": "Agarrão Seguro", "category": "Agarrões", "conditional": null, "names": ["Garantir"], "stylePoints": 3, "description": "Pegadas que não escapam.", "source": "proposta"},
  {"id": "pas_agarrao_veloz", "name": "Agarrão Veloz", "category": "Agarrões", "conditional": null, "names": ["Agilizar"], "stylePoints": 3, "description": "Transições rápidas entre as pegadas.", "source": "proposta"},
  {"id": "pas_lamina_firme", "name": "Lâmina Firme", "category": "Armas Brancas", "conditional": null, "names": ["Amplificar"], "stylePoints": 6, "description": "Pegada firme na lâmina e golpes bem posicionados.", "source": "proposta"},
  {"id": "pas_estocada_certeira", "name": "Estocada Certeira", "category": "Armas Brancas", "conditional": "só em estocadas", "names": ["Vantagem"], "stylePoints": 3, "description": "Estocadas treinadas até virarem reflexo.", "source": "proposta"},
  {"id": "pas_esquiva_agil", "name": "Esquiva Ágil", "category": "Defesas", "conditional": "só em esquivas", "names": ["Vantagem"], "stylePoints": 3, "description": "Esquivas leves, de corpo solto.", "source": "proposta"},
  {"id": "pas_esquiva_veloz", "name": "Esquiva Veloz", "category": "Defesas", "conditional": "só em esquivas", "names": ["Agilizar"], "stylePoints": 3, "description": "Esquivas rápidas, que quase não exigem esforço.", "source": "proposta"},
  {"id": "pas_aparo_treinado", "name": "Aparo Treinado", "category": "Defesas", "conditional": "só ao aparar", "names": ["Amplificar"], "stylePoints": 3, "description": "Aparos limpos, que desviam o golpe do oponente.", "source": "proposta"},
  {"id": "pas_defesa_firme", "name": "Defesa Firme", "category": "Defesas", "conditional": null, "names": ["Garantir"], "stylePoints": 3, "description": "Defesa sólida, que raramente falha.", "source": "proposta"},
  {"id": "pas_folego_de_lutador", "name": "Fôlego de Lutador", "category": "Outro", "conditional": null, "names": ["Blindar"], "stylePoints": 6, "description": "Fôlego de quem treina lutas longas. Blindar: ignora a penalidade acumulada de Fadiga. (Categoria: sustentar esforço no combate.)", "source": "proposta"}
];

export const SIGNATURE_MOVE_PRESETS = [
  {"id": "gol_cruzado", "name": "Cruzado", "triggerType": "Reativo", "triggerDetail": "logo após acertar um soco", "cost": {"weight": 1, "form": "1 Vigor"}, "conditional": null, "effectName": "Agilizar", "effectDescription": "O jab seguinte gasta 1 ação a menos.", "description": "Soco de abertura que emenda o seguinte.", "source": "livro"},
  {"id": "gol_chute_da_troca", "name": "Chute da Troca", "triggerType": "Reativo", "triggerDetail": "logo após uma Finta bem-sucedida", "cost": {"weight": 1, "form": "1 Vigor"}, "conditional": null, "effectName": "Agilizar", "effectDescription": "O chute seguinte gasta 1 ação a menos.", "description": "Chute que aproveita a abertura da finta.", "source": "livro"},
  {"id": "gol_giro_devolvido", "name": "Giro Devolvido", "triggerType": "Reativo", "triggerDetail": "logo após sofrer um golpe", "cost": {"weight": 1, "form": "1 Vigor"}, "conditional": null, "effectName": "Agilizar", "effectDescription": "O Contra-ataque gasta 1 ação a menos.", "description": "Giro que devolve o golpe recebido.", "source": "livro"},
  {"id": "gol_gancho_certeiro", "name": "Gancho Certeiro", "triggerType": "Ativo", "triggerDetail": "antes de um gancho", "cost": {"weight": 2, "form": "2 Vigor"}, "conditional": {"description": "com menos da metade do Vigor", "costReduction": 1}, "effectName": "Amplificar", "effectDescription": "Um Sucesso normal no gancho vira Sucesso Bom.", "description": "Gancho preciso, que busca o ponto exato.", "source": "livro"},
  {"id": "gol_chute_giratorio_pesado", "name": "Chute Giratório Pesado", "triggerType": "Ativo", "triggerDetail": "antes de um chute giratório", "cost": {"weight": 1, "form": "1 Vigor"}, "conditional": null, "effectName": "Potencializar", "effectDescription": "O dano é rolado duas vezes e fica o maior.", "description": "Chute giratório com todo o peso do giro.", "source": "livro"},
  {"id": "gol_direto_seguro", "name": "Direto Seguro", "triggerType": "Ativo", "triggerDetail": "antes de um soco direto", "cost": {"weight": 1, "form": "1 Vigor"}, "conditional": null, "effectName": "Garantir", "effectDescription": "A rolagem de ataque não pode cair em Falha Crítica.", "description": "Soco direto limpo, de execução treinada.", "source": "proposta"},
  {"id": "gol_joelhada_esmagadora", "name": "Joelhada Esmagadora", "triggerType": "Ativo", "triggerDetail": "antes de uma joelhada", "cost": {"weight": 1, "form": "1 Vigor"}, "conditional": null, "effectName": "Potencializar", "effectDescription": "O dano é rolado duas vezes e fica o maior.", "description": "Joelhada que esmaga com o peso do corpo.", "source": "proposta"},
  {"id": "gol_aparo_e_cotovelada", "name": "Aparo e Cotovelada", "triggerType": "Reativo", "triggerDetail": "logo após Aparar com sucesso", "cost": {"weight": 1, "form": "1 Vigor"}, "conditional": null, "effectName": "Potencializar", "effectDescription": "O contra-ataque rola o dano duas vezes e fica o maior.", "description": "Cotovelada seca que sai do aparo.", "source": "proposta"},
  {"id": "gol_estocada_precisa", "name": "Estocada Precisa", "triggerType": "Ativo", "triggerDetail": "antes de uma estocada", "cost": {"weight": 2, "form": "2 Vigor"}, "conditional": null, "effectName": "Amplificar", "effectDescription": "Um Sucesso normal vira Sucesso Bom.", "description": "Estocada que procura a brecha na defesa.", "source": "proposta"},
  {"id": "gol_rasteira_dominante", "name": "Rasteira Dominante", "triggerType": "Ativo", "triggerDetail": "antes de uma rasteira", "cost": {"weight": 2, "form": "2 Vigor"}, "conditional": null, "effectName": "Vantagem", "effectDescription": "Rola o ataque duas vezes e fica o maior.", "description": "Rasteira que domina o equilíbrio do oponente.", "source": "proposta"},
  {"id": "gol_finta_e_direto", "name": "Finta e Direto", "triggerType": "Reativo", "triggerDetail": "logo após uma Finta bem-sucedida", "cost": {"weight": 2, "form": "2 Vigor"}, "conditional": null, "effectName": "Amplificar", "effectDescription": "O ataque seguinte, de Sucesso normal, vira Sucesso Bom.", "description": "Direto que entra pela guarda aberta pela finta.", "source": "proposta"},
  {"id": "gol_contragolpe_de_esquiva", "name": "Contragolpe de Esquiva", "triggerType": "Reativo", "triggerDetail": "logo após Esquivar com sucesso", "cost": {"weight": 2, "form": "2 Vigor"}, "conditional": null, "effectName": "Vantagem", "effectDescription": "O contra-ataque rola duas vezes e fica o maior.", "description": "Contragolpe lançado de dentro da esquiva.", "source": "proposta"},
  {"id": "gol_voadora_devastadora", "name": "Voadora Devastadora", "triggerType": "Ativo", "triggerDetail": "antes de uma voadora", "cost": {"weight": 3, "form": "Usar o turno inteiro"}, "conditional": {"description": "com menos da metade do Vigor", "costReduction": 1}, "effectName": "Multiplicar", "effectDescription": "Dobra o efeito de um acerto.", "description": "Voadora que concentra toda a força em um só golpe.", "source": "proposta"},
  {"id": "gol_virada_desesperada", "name": "Virada Desesperada", "triggerType": "Reativo", "triggerDetail": "logo após sofrer um golpe", "cost": {"weight": 3, "form": "3+ Vigor ou Sanidade combinados"}, "conditional": {"description": "com menos da metade do Vigor", "costReduction": 1}, "effectName": "Reverter", "effectDescription": "Uma falha no contra-ataque é tratada como sucesso normal.", "description": "Reação de última hora que vira o combate.", "source": "proposta"}
];

export const SPECIALTY_ORIGINS = [...new Set(SPECIALTY_PRESETS.map((p) => p.origin))];

const newId = () => `${Date.now()}-${Math.random()}`;
const cond = (text) => (text ? { description: text } : null);

/** Especialidade pronta -> item de character.specialties (formato de normalizeSpecialty). */
export function createSpecialtyFromPreset(p) {
  return { instanceId: newId(), name: p.name, scope: p.scope, names: [...p.names], conditional: cond(p.conditional), description: p.description ?? '' };
}

/** Passiva Natural pronta -> item de masterMode.naturalPassives (mesmo formato da Especialidade). */
export function createNaturalPassiveFromPreset(p) {
  return createSpecialtyFromPreset(p);
}

/** Passiva de Estilo pronta -> item de style.passives. Peso = getEffectWeight, menos 1 se houver Condicional (mín. 1). */
export function createStylePassiveFromPreset(p) {
  return {
    instanceId: newId(),
    names: [...p.names],
    weight: Math.max(1, getEffectWeight(p.names) - (p.conditional ? 1 : 0)),
    category: p.category,
    conditional: cond(p.conditional),
    description: `${p.name}. ${p.description}`,
  };
}

/** Golpe de Assinatura pronto -> item de style.signatureMoves (formato de normalizeAbility). */
export function createSignatureMoveFromPreset(p) {
  const def = EFFECT_DEFINITIONS[p.effectName];
  return {
    instanceId: newId(),
    abilityId: null,
    sanityCost: 0,
    name: p.name,
    trigger: { type: p.triggerType, detail: p.triggerDetail },
    contextText: '',
    conditional: p.conditional ? { ...p.conditional } : null,
    cost: { ...p.cost },
    effect: { weight: def?.weight ?? 1, names: [p.effectName], description: p.effectDescription },
  };
}