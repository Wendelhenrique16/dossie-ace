// src/data/skillTiers.js
// "O que os números querem dizer" (Livro do Jogador). O número da Perícia é o valor
// máximo do dado (d4 = 4, d12 = 12, d20 = 20). Os nomes "Elite" (16–20) e
// "Teto do sistema" (21–28) cobrem os valores que o livro não nomeia.

export const SKILL_NUMBER_INTRO =
  'Os números representam o nível real de capacidade do personagem naquela área, seja por treino, talento natural, adaptação ou condições biológicas. O número de uma Perícia é o valor máximo do seu dado: d4 = 4, d8 = 8, d12 = 12, d20 = 20. Antes de distribuir os pontos, decida em que faixa o personagem deve estar: um dado próximo de d20 coloca o personagem perto do limite humano naquela Perícia.';

export const SKILL_TIERS = [
  { id: 'inexperiente', label: 'Inexperiente', min: 0, max: 0, text: 'Ausência total de domínio. O personagem é incapaz ou extremamente ineficiente nas ações da Perícia e sempre sofre desvantagem nos testes ligados a ela.' },
  { id: 'basico', label: 'Básico', min: 1, max: 5, text: 'Nível funcional, o padrão humano médio ou uma capacidade natural básica. Realiza ações comuns sem dificuldade relevante, dentro do esperado da normalidade.' },
  { id: 'desenvolvido', label: 'Desenvolvido', min: 6, max: 10, text: 'Acima da média, por prática, talento ou adaptação. Demonstra consistência e eficiência e se destaca na área, mesmo entre pessoas comuns.' },
  { id: 'avancado', label: 'Avançado', min: 11, max: 15, text: 'Domínio elevado. Opera com precisão e confiança e raramente falha dentro da especialidade. Está acima da maioria, mesmo entre indivíduos treinados.' },
  { id: 'elite', label: 'Elite', min: 16, max: 20, text: 'Valores próximos de 20: especialistas, veteranos e indivíduos de alta precisão, no limite humano da ACE, capazes de feitos raros e desempenho extremo.' },
  { id: 'teto', label: 'Teto do sistema', min: 21, max: 28, text: 'O sistema trabalha com um teto entre 20 e 28 pontos, o limite das regras normais. Ultrapassar esse valor só acontece em casos excepcionais, definidos por regras específicas ou por decisões narrativas.' },
];

export const SKILL_LEVEL_DICE_LINE =
  'Nível da Perícia e dado: 0 = d00 · 1 = d4 · 2 = d6 · 3 = d8 · 4 = d10 · 5 = d12 · 6 = d20 · 7 = d20 / 5d4 · 8 = 3d8 / 6d4 · 9 = 3d8+d4 / 7d4 · 9+ = vantagem.';

export function getSkillTier(value) {
  return SKILL_TIERS.find((t) => value >= t.min && value <= t.max) ?? SKILL_TIERS[SKILL_TIERS.length - 1];
}