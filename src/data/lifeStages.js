// src/data/lifeStages.js
// Fases da Vida — definem Sorte Inicial, Pacotes Gratuitos e limites de antecedentes.
// Fonte: Documento de regras ACE-RPG, seção "FASE DA VIDA".

export const LIFE_STAGES = {
  jovem: {
    id: 'jovem',
    label: 'Jovem',
    freePackages: 3,
    safeLimit: 6, // acima disso já é "excesso" (dentro do teto de 12)
    hardLimit: 12,
    initialLuck: 20,
    // Penalidade por pacote extra (além dos gratuitos)
    extraPackageSanityCost: { dice: 1, sides: 6, modifier: 6 }, // 1d6+6

    // A cada pacote comprado acima do limite seguro (6), até o hardLimit (12)
    penaltyAboveSafeLimit: {
      type: 'aspecto_negativo_grave',
      perExtraPackage: 1,
    },
  },

  adulto: {
    id: 'adulto',
    label: 'Adulto',
    freePackages: 9,
    safeLimit: 9, // acima do gratuito já conta como excesso
    hardLimit: 12,
    initialLuck: 15,
    extraPackageSanityCost: { dice: 1, sides: 6, modifier: 6 },
    mandatoryOnCreation: {
      type: 'aspecto_negativo_idade',
      description: 'Escolha 1 aspecto negativo relacionado à idade (obrigatório).',
    },
    penaltyAboveSafeLimit: {
      type: 'aspecto_negativo_grave',
      perExtraPackage: 1,
    },
  },

  maduro: {
    id: 'maduro',
    label: 'Maduro',
    freePackages: 6,
    safeLimit: 9, // de 6 (gratuito) até 9, penalidade padrão; de 9 até 12, penalidade de atributo
    hardLimit: 12,
    initialLuck: 10,
    extraPackageSanityCost: { dice: 1, sides: 6, modifier: 6 },
    mandatoryOnCreation: {
      type: 'aspectos_idade',
      negativeCount: 3,
      positiveCount: 3,
      description:
        'Começa com 3 aspectos negativos ligados à idade e 3 aspectos positivos à escolha (representando experiência).',
    },
    // 6 -> 9: aspecto negativo grave por pacote extra
    penaltyAboveSafeLimit: {
      type: 'aspecto_negativo_grave',
      perExtraPackage: 1,
      appliesFrom: 6,
      appliesUntil: 9,
    },
    // 9 -> 12: -2 em um atributo à escolha (Existência, Destreza ou Carisma)
    penaltyAboveHardThreshold: {
      type: 'atributo_penalidade',
      value: -2,
      eligibleAttributes: ['existencia', 'destreza', 'carisma'],
      appliesFrom: 9,
      appliesUntil: 12,
    },
  },
};

// Regra universal: 12 pacotes é o teto padrão (ver "LIMITE 12" no livro).
// Ultrapassar 12 fica a critério do mestre (treinamento pesado, contrato com
// entidades, ser sobre-humano etc.) — não é tratado automaticamente pelo MVP.
export const HARD_PACKAGE_LIMIT = 12;

// Consequência ao ultrapassar 12 pacotes: Sanidade Máxima trava em 1
// permanentemente e o personagem recebe a condição "A Beira da Loucura".
export const SANITY_BROKEN_STATE = {
  maxSanity: 1,
  conditionLabel: 'A Beira da Loucura',
  effects: [
    'Resistente à dor: penalidades por ferimentos cortadas pela metade',
    'Dano de sanidade anulado, exceto em casos excepcionais/extremos',
  ],
};