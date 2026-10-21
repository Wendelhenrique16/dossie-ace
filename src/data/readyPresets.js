// src/data/readyPresets.js
// Listas prontas (ace_listas_prontas, 19/10/2026): Passivas Naturais, Passivas de Estilo e Golpes de Assinatura.
// Os nomes de Efeito seguem as chaves de EFFECT_DEFINITIONS (abilities.js): "Facilitar (Aprimorado)".
// `conditional` das Passivas é texto; os creators convertem para { description }.

import { getEffectWeight, EFFECT_DEFINITIONS } from './abilities';

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

const newId = () => `${Date.now()}-${Math.random()}`;
const cond = (text) => (text ? { description: text } : null);

/** Passiva Natural pronta -> item de masterMode.naturalPassives. */
export function createNaturalPassiveFromPreset(p) {
  return { instanceId: newId(), name: p.name, scope: p.scope, names: [...p.names], conditional: cond(p.conditional), description: p.description ?? '' };
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