// src/pages/CharacterCreate.jsx
import { useState, useMemo } from 'react';
import { LIFE_STAGES } from '../data/lifeStages';
import { BACKGROUND_PACKAGES } from '../data/backgrounds';
import { SKILLS, ATTRIBUTES } from '../data/skills';
import { listSelectableOccupations, calculateOccupationBonuses } from '../logic/occupationBonuses';
import { rollExtraPackageSanityCost, checkBrokenSanityState } from '../logic/characterCalculations';
import BackgroundModal from '../components/modals/BackgroundModal';
import AspectsStep from '../components/character/AspectsStep';
import { POSITIVE_ASPECTS, NEGATIVE_ASPECTS } from '../data/aspects';

function buildSteps(isAgent) {
  const steps = [
    { id: 'identity', label: '1. Detalhes do Personagem' },
    { id: 'lifeStage', label: '2. Fase da Vida' },
    { id: 'backgrounds', label: '3. Antecedentes' },
    { id: 'aspects', label: '4. Aspectos' },
    { id: 'customSkills', label: '5. Habilidades' },
    { id: 'occupation', label: '6. Ocupação' },
  ];
  if (isAgent) {
    steps.push({ id: 'classPath', label: '7. Classe & Caminho' });
    steps.push({ id: 'review', label: '8. Validar & Exportar' });
  } else {
    steps.push({ id: 'review', label: '7. Validar & Exportar' });
  }
  return steps;
}

export default function CharacterCreate() {
  const [currentStep, setCurrentStep] = useState('identity');
  const [activeModalPackage, setActiveModalPackage] = useState(null);
  const [sanityWarning, setSanityWarning] = useState(null);

  const [character, setCharacter] = useState({
    name: '',
    concept: '',
    role: 'civil', // 'civil' | 'agente'
    lifeStageId: null,
    purchasedBackgrounds: [], // [{ packageId, allocations, attributeId }]
    maxSanity: 100,
    aspects: { mandatoryIds: [], chosenPositiveIds: [], chosenNegativeIds: [] },
    customSkills: [], // [{ name, skillId, cost, effectType, narrative }]
    occupation: { primaryId: null, secondaryId: null, freeAttribute: null },
    classPath: { className: '', path: '' },
  });

  const isAgent = character.role === 'agente';
  const STEPS = useMemo(() => buildSteps(isAgent), [isAgent]);
  const stepIndex = STEPS.findIndex((s) => s.id === currentStep);
  const goNext = () => setCurrentStep(STEPS[Math.min(stepIndex + 1, STEPS.length - 1)].id);
  const goBack = () => setCurrentStep(STEPS[Math.max(stepIndex - 1, 0)].id);

  const lifeStage = character.lifeStageId ? LIFE_STAGES[character.lifeStageId] : null;
  const freePackages = lifeStage?.freePackages ?? 0;
  const purchasedCount = character.purchasedBackgrounds.length;
  const isExtraPackage = purchasedCount >= freePackages;

  // Cálculo da Sorte Restante com base na Cotação da Idade
  // (custo por aspecto varia conforme a Fase da Vida escolhida)
  const remainingLuck = useMemo(() => {
    if (!lifeStage) return 0;
    let luck = lifeStage.initialLuck;
    const posCount = character.aspects.chosenPositiveIds.length;
    const negCount = character.aspects.chosenNegativeIds.length;

    if (character.lifeStageId === 'jovem') {
      luck -= posCount * 3;
      luck += negCount * 1;
    } else if (character.lifeStageId === 'adulto') {
      luck -= posCount * 1;
      luck += negCount * 1;
    } else if (character.lifeStageId === 'maduro') {
      luck -= posCount * 1;
      luck += negCount * 3;
    }
    return luck;
  }, [lifeStage, character.lifeStageId, character.aspects]);

  const skillTotalsFromBackgrounds = useMemo(() => {
    const totals = {};
    character.purchasedBackgrounds.forEach(({ allocations }) => {
      Object.entries(allocations).forEach(([skillId, points]) => {
        totals[skillId] = (totals[skillId] || 0) + points;
      });
    });
    return totals;
  }, [character.purchasedBackgrounds]);

  // Atributos vêm exclusivamente do +2 fixo de cada pacote comprado
  // (por enquanto qualquer atributo pode ser escolhido em qualquer pacote —
  // falta a relação pacote->atributos permitidos).
  const attributeTotalsFromBackgrounds = useMemo(() => {
    const totals = Object.fromEntries(Object.keys(ATTRIBUTES).map((id) => [id, 0]));
    character.purchasedBackgrounds.forEach(({ attributeId }) => {
      if (attributeId) totals[attributeId] = (totals[attributeId] || 0) + 2;
    });
    return totals;
  }, [character.purchasedBackgrounds]);

  const occupationBonuses = useMemo(() => {
    const { primaryId, secondaryId, freeAttribute } = character.occupation;
    if (!primaryId || !secondaryId) return { skillBonuses: {}, attributeBonuses: {} };
    return calculateOccupationBonuses(primaryId, secondaryId, freeAttribute);
  }, [character.occupation]);

  const finalSkillTotals = useMemo(() => {
    const totals = { ...skillTotalsFromBackgrounds };
    Object.entries(occupationBonuses.skillBonuses).forEach(([skillId, bonus]) => {
      totals[skillId] = (totals[skillId] || 0) + bonus;
    });
    return totals;
  }, [skillTotalsFromBackgrounds, occupationBonuses]);

  const finalAttributeTotals = useMemo(() => {
    const totals = { ...attributeTotalsFromBackgrounds };
    Object.entries(occupationBonuses.attributeBonuses).forEach(([attrId, bonus]) => {
      totals[attrId] = (totals[attrId] || 0) + bonus;
    });
    return totals;
  }, [attributeTotalsFromBackgrounds, occupationBonuses]);

  const isBroken = checkBrokenSanityState(purchasedCount);

  // Vigor Base (Atributo Existência + bônus de Constituição)
  const vigor = useMemo(() => {
    const existencia = finalAttributeTotals.existencia || 0;
    const constituicaoSkill = finalSkillTotals.constituicao || 0;
    return existencia * 2 + Math.floor(constituicaoSkill / 2);
  }, [finalAttributeTotals, finalSkillTotals]);

  function handleSelectLifeStage(id) {
    setCharacter((c) => ({
      ...c,
      lifeStageId: id,
      maxSanity: 100,
      purchasedBackgrounds: [],
      aspects: { mandatoryIds: [], chosenPositiveIds: [], chosenNegativeIds: [] },
    }));
    setSanityWarning(null);
  }

  function handleConfirmBackground({ allocations, attributeId }) {
    setCharacter((c) => {
      let newMaxSanity = c.maxSanity;
      let warning = null;
      if (c.purchasedBackgrounds.length >= freePackages) {
        const cost = rollExtraPackageSanityCost();
        newMaxSanity = Math.max(1, c.maxSanity - cost);
        warning = `Pacote extra adicionado: -${cost} de Sanidade Máxima.`;
      }
      setSanityWarning(warning);
      return {
        ...c,
        purchasedBackgrounds: [
          ...c.purchasedBackgrounds,
          { packageId: activeModalPackage, allocations, attributeId },
        ],
        maxSanity: newMaxSanity,
      };
    });
    setActiveModalPackage(null);
  }

  function handleAddCustomSkill() {
    setCharacter((c) => ({
      ...c,
      customSkills: [
        ...c.customSkills,
        { name: '', skillId: '', cost: '1_vigor', effectType: 'facilitar', narrative: '' },
      ],
    }));
  }

  function handleExportPdf() {
    // TODO: substituir por geração real de PDF (jsPDF/react-pdf) quando o
    // layout final da ficha estiver pronto. Placeholder valida o fluxo.
    window.print();
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Navegação lateral */}
      <aside className="w-60 border-r bg-white p-4 space-y-1">
        <h1 className="text-sm font-semibold text-gray-400 uppercase mb-3">Ficha ACE</h1>
        {STEPS.map((step, i) => (
          <button
            key={step.id}
            onClick={() => setCurrentStep(step.id)}
            className={`w-full text-left px-3 py-2 rounded text-sm ${
              step.id === currentStep
                ? 'bg-gray-900 text-white'
                : i < stepIndex
                ? 'text-gray-700 hover:bg-gray-100'
                : 'text-gray-400 hover:bg-gray-100'
            }`}
          >
            {step.label}
          </button>
        ))}
      </aside>

      {/* Conteúdo principal */}
      <main className="flex-1 p-6 max-w-2xl">
        {/* Step 1: Detalhes */}
        {currentStep === 'identity' && (
          <section>
            <h2 className="text-xl font-semibold mb-4">Detalhes do Personagem</h2>
            <label className="block text-sm mb-1">Nome do personagem</label>
            <input
              className="w-full border rounded px-3 py-2 mb-4"
              value={character.name}
              onChange={(e) => setCharacter((c) => ({ ...c, name: e.target.value }))}
            />
            <label className="block text-sm mb-1">Conceito</label>
            <textarea
              className="w-full border rounded px-3 py-2 mb-4"
              rows={3}
              value={character.concept}
              onChange={(e) => setCharacter((c) => ({ ...c, concept: e.target.value }))}
              placeholder="Quem ele é no mundo de ACE."
            />
            <label className="block text-sm mb-1">Papel</label>
            <div className="flex gap-2">
              {['civil', 'agente'].map((role) => (
                <button
                  key={role}
                  onClick={() => setCharacter((c) => ({ ...c, role }))}
                  className={`px-4 py-2 rounded border text-sm capitalize ${
                    character.role === role ? 'bg-gray-900 text-white' : ''
                  }`}
                >
                  {role}
                </button>
              ))}
            </div>
          </section>
        )}

        {/* Step 2: Fase da Vida */}
        {currentStep === 'lifeStage' && (
          <section>
            <h2 className="text-xl font-semibold mb-2">Fase da Vida</h2>
            <p className="text-sm text-gray-500 mb-4">
              Define o saldo de Sorte Inicial, a quantidade de pacotes de antecedentes gratuitos e
              os aspectos obrigatórios de idade.
            </p>
            <div className="grid grid-cols-1 gap-3">
              {Object.values(LIFE_STAGES).map((stage) => {
                const selected = character.lifeStageId === stage.id;
                return (
                  <button
                    key={stage.id}
                    onClick={() => handleSelectLifeStage(stage.id)}
                    className={`text-left border rounded p-3 ${selected ? 'border-gray-900 bg-gray-50' : ''}`}
                  >
                    <div className="font-medium">{stage.label}</div>
                    {selected && (
                      <div className="text-sm text-gray-600 mt-1">
                        Sorte Inicial: <strong>{stage.initialLuck}</strong> · Pacotes Grátis:{' '}
                        <strong>{stage.freePackages}</strong>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </section>
        )}

        {/* Step 3: Antecedentes */}
        {currentStep === 'backgrounds' && (
          <section>
            <h2 className="text-xl font-semibold mb-2">Antecedentes & Atributos</h2>
            {!lifeStage ? (
              <p className="text-sm text-gray-500">Selecione a Fase da Vida primeiro.</p>
            ) : (
              <>
                <div className="mb-6">
                  <h3 className="font-medium mb-2">Atributos</h3>
                  <p className="text-xs text-gray-500 mb-2">
                    Cada pacote comprado concede +2 fixo a um Atributo, escolhido no próprio modal
                    de distribuição.
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    {Object.entries(ATTRIBUTES).map(([id, attr]) => (
                      <div key={id} className="flex items-center justify-between text-sm">
                        <span>{attr.label}</span>
                        <strong>{attributeTotalsFromBackgrounds[id] ?? 0}</strong>
                      </div>
                    ))}
                  </div>
                </div>

                <h3 className="font-medium mb-2">Pacotes de Antecedentes</h3>
                <p className="text-sm text-gray-500 mb-3">
                  {purchasedCount} de {freePackages} pacotes gratuitos utilizados.
                  {isExtraPackage && <span className="text-amber-600"> Custo em Sanidade (1d6 + 6) ativo.</span>}
                </p>

                {sanityWarning && (
                  <div className="mb-3 text-sm px-3 py-2 rounded bg-amber-50 text-amber-700 border border-amber-200">
                    ⚠ {sanityWarning}
                  </div>
                )}

                <div className="grid grid-cols-1 gap-2 mb-4">
                  {Object.values(BACKGROUND_PACKAGES).map((pkg) => (
                    <button
                      key={pkg.id}
                      onClick={() => setActiveModalPackage(pkg.id)}
                      className="text-left border rounded p-3 hover:bg-gray-50"
                    >
                      <div className="font-medium">{pkg.label}</div>
                      <div className="text-sm text-gray-500">{pkg.pointsPerPurchase} aumentos por compra</div>
                    </button>
                  ))}
                </div>

                <div className="text-sm border-t pt-3">
                  Sanidade Máxima Atual: <strong>{character.maxSanity}</strong>
                  {isBroken && (
                    <div className="text-red-600 mt-1 font-medium">
                      A Beira da Loucura — Sanidade travada em 1 permanente.
                    </div>
                  )}
                </div>
              </>
            )}

            {activeModalPackage && (
              <BackgroundModal
                packageId={activeModalPackage}
                onConfirm={handleConfirmBackground}
                onClose={() => setActiveModalPackage(null)}
              />
            )}
          </section>
        )}

        {/* Step 4: Aspectos (catálogo real + Sorte) */}
        {currentStep === 'aspects' && (
          <AspectsStep
            character={character}
            setCharacter={setCharacter}
            lifeStageId={character.lifeStageId}
            remainingLuck={remainingLuck}
          />
        )}

        {/* Step 5: Habilidades Customizadas */}
        {currentStep === 'customSkills' && (
          <section>
            <h2 className="text-xl font-semibold mb-2">Habilidades do Personagem</h2>
            <p className="text-sm text-gray-500 mb-4">
              Manobras e especializações técnicas ativas baseadas em Perícias.
            </p>

            {character.customSkills.map((sk, index) => (
              <div key={index} className="border rounded p-3 mb-3 bg-white space-y-2 text-sm">
                <input
                  placeholder="Nome da Habilidade (ex: Corte de Machado)"
                  className="w-full border rounded px-2 py-1 font-medium"
                  value={sk.name}
                  onChange={(e) => {
                    const val = e.target.value;
                    setCharacter((c) => {
                      const updated = [...c.customSkills];
                      updated[index].name = val;
                      return { ...c, customSkills: updated };
                    });
                  }}
                />
                <div className="grid grid-cols-3 gap-2">
                  <select
                    className="border rounded px-2 py-1"
                    value={sk.cost}
                    onChange={(e) => {
                      const val = e.target.value;
                      setCharacter((c) => {
                        const updated = [...c.customSkills];
                        updated[index].cost = val;
                        return { ...c, customSkills: updated };
                      });
                    }}
                  >
                    <option value="1_vigor">1 de Vigor</option>
                    <option value="2_vigor">2 de Vigor</option>
                    <option value="1_sanidade">1 de Sanidade</option>
                    <option value="reacao">Reação</option>
                  </select>

                  <select
                    className="border rounded px-2 py-1"
                    value={sk.effectType}
                    onChange={(e) => {
                      const val = e.target.value;
                      setCharacter((c) => {
                        const updated = [...c.customSkills];
                        updated[index].effectType = val;
                        return { ...c, customSkills: updated };
                      });
                    }}
                  >
                    <option value="facilitar">Facilitar Cenário</option>
                    <option value="tempo">Fazer Mais Rápido</option>
                    <option value="rendimento">Aumentar Resultado</option>
                    <option value="falha">Salvar em Falha</option>
                  </select>

                  <input
                    placeholder="Perícia (ex: Armas Brancas)"
                    className="border rounded px-2 py-1"
                    value={sk.skillId}
                    onChange={(e) => {
                      const val = e.target.value;
                      setCharacter((c) => {
                        const updated = [...c.customSkills];
                        updated[index].skillId = val;
                        return { ...c, customSkills: updated };
                      });
                    }}
                  />
                </div>
                <textarea
                  placeholder="Descrição da interpretação / motivo da habilidade..."
                  className="w-full border rounded px-2 py-1 text-xs"
                  rows={2}
                  value={sk.narrative}
                  onChange={(e) => {
                    const val = e.target.value;
                    setCharacter((c) => {
                      const updated = [...c.customSkills];
                      updated[index].narrative = val;
                      return { ...c, customSkills: updated };
                    });
                  }}
                />
              </div>
            ))}

            <button
              onClick={handleAddCustomSkill}
              className="px-3 py-2 rounded bg-gray-200 text-sm hover:bg-gray-300"
            >
              + Adicionar Habilidade
            </button>
          </section>
        )}

        {/* Step 6: Ocupação */}
        {currentStep === 'occupation' && (
          <section>
            <h2 className="text-xl font-semibold mb-4">Ocupação</h2>
            <label className="block text-sm mb-1">Categoria Primária (+5 Perícias / +2 Atributo)</label>
            <select
              className="w-full border rounded px-3 py-2 mb-3 text-sm"
              value={character.occupation.primaryId ?? ''}
              onChange={(e) =>
                setCharacter((c) => ({
                  ...c,
                  occupation: { ...c.occupation, primaryId: e.target.value || null },
                }))
              }
            >
              <option value="">Selecione...</option>
              {listSelectableOccupations().map((occ) => (
                <option key={occ.id} value={occ.id}>
                  {occ.label}
                </option>
              ))}
            </select>

            <label className="block text-sm mb-1">Categoria Secundária (+3 Perícias / +1 Atributo Livre)</label>
            <select
              className="w-full border rounded px-3 py-2 mb-3 text-sm"
              value={character.occupation.secondaryId ?? ''}
              onChange={(e) =>
                setCharacter((c) => ({
                  ...c,
                  occupation: { ...c.occupation, secondaryId: e.target.value || null },
                }))
              }
            >
              <option value="">Selecione...</option>
              {listSelectableOccupations().map((occ) => (
                <option key={occ.id} value={occ.id}>
                  {occ.label}
                </option>
              ))}
            </select>

            <label className="block text-sm mb-1">Atributo Livre (bônus da Secundária)</label>
            <select
              className="w-full border rounded px-3 py-2 text-sm"
              value={character.occupation.freeAttribute ?? ''}
              onChange={(e) =>
                setCharacter((c) => ({
                  ...c,
                  occupation: { ...c.occupation, freeAttribute: e.target.value || null },
                }))
              }
            >
              <option value="">Selecione...</option>
              {Object.entries(ATTRIBUTES).map(([id, attr]) => (
                <option key={id} value={id}>
                  {attr.label}
                </option>
              ))}
            </select>
          </section>
        )}

        {/* Step 7: Classe & Caminho (só Agente) */}
        {currentStep === 'classPath' && (
          <section>
            <h2 className="text-xl font-semibold mb-2">Classe & Caminho</h2>
            <p className="text-sm text-gray-500 mb-4">Exclusivo para Agentes da ACE (Rank D+).</p>
            <label className="block text-sm mb-1">Classe</label>
            <input
              className="w-full border rounded px-3 py-2 mb-4 text-sm"
              value={character.classPath.className}
              onChange={(e) =>
                setCharacter((c) => ({ ...c, classPath: { ...c.classPath, className: e.target.value } }))
              }
            />
            <label className="block text-sm mb-1">Caminho</label>
            <input
              className="w-full border rounded px-3 py-2 text-sm"
              value={character.classPath.path}
              onChange={(e) =>
                setCharacter((c) => ({ ...c, classPath: { ...c.classPath, path: e.target.value } }))
              }
            />
          </section>
        )}

        {/* Step Final: Validar */}
        {currentStep === 'review' && (
          <section>
            <h2 className="text-xl font-semibold mb-4">Validar e Exportar Ficha</h2>
            <div className="space-y-4 text-sm">
              <div>
                <strong>{character.name || '(sem nome)'}</strong>{' '}
                <span className="text-gray-400 capitalize">({character.role})</span>
                <p className="text-gray-500">{character.concept}</p>
              </div>
              <div>
                Fase da Vida: <strong>{lifeStage?.label ?? '—'}</strong> · Sanidade Máxima:{' '}
                <strong>{character.maxSanity}</strong> · Vigor: <strong>{vigor}</strong> · Sorte Restante:{' '}
                <strong>{remainingLuck}</strong>
              </div>
              <div>
                <div className="font-medium mb-1">Atributos</div>
                {Object.entries(finalAttributeTotals).map(([id, value]) => (
                  <div key={id}>
                    {ATTRIBUTES[id].label}: {value}
                  </div>
                ))}
              </div>
              <div>
                <div className="font-medium mb-1">Perícias (com bônus de ocupação já somados)</div>
                {Object.entries(finalSkillTotals).length === 0 ? (
                  <p className="text-gray-400">Nenhuma perícia distribuída ainda.</p>
                ) : (
                  Object.entries(finalSkillTotals).map(([skillId, total]) => (
                    <div key={skillId}>
                      {SKILLS[skillId]?.label ?? skillId}: {total}
                    </div>
                  ))
                )}
              </div>
              <div>
                <div className="font-medium mb-1">Aspectos</div>
                {[
                  ...character.aspects.mandatoryIds,
                  ...character.aspects.chosenPositiveIds,
                  ...character.aspects.chosenNegativeIds,
                ].length === 0 ? (
                  <p className="text-gray-400">Nenhum aspecto selecionado ainda.</p>
                ) : (
                  <>
                    {character.aspects.mandatoryIds.map((id) => {
                      const a = NEGATIVE_ASPECTS.find((x) => x.id === id);
                      return <div key={id}>{a?.label ?? id} (obrigatório)</div>;
                    })}
                    {character.aspects.chosenPositiveIds.map((id) => {
                      const a = POSITIVE_ASPECTS.find((x) => x.id === id);
                      return <div key={id}>{a?.label ?? id} (positivo)</div>;
                    })}
                    {character.aspects.chosenNegativeIds.map((id) => {
                      const a = NEGATIVE_ASPECTS.find((x) => x.id === id);
                      return <div key={id}>{a?.label ?? id} (negativo)</div>;
                    })}
                  </>
                )}
              </div>
              <div>
                <div className="font-medium mb-1">Habilidades Customizadas</div>
                {character.customSkills.length === 0 ? (
                  <p className="text-gray-400">Nenhuma habilidade adicionada.</p>
                ) : (
                  character.customSkills.map((sk, idx) => (
                    <div key={idx} className="text-xs border-b py-1">
                      <strong>{sk.name || 'Sem nome'}</strong> ({sk.skillId}) — Custo: {sk.cost} | Efeito:{' '}
                      {sk.effectType}
                    </div>
                  ))
                )}
              </div>
              {isAgent && (
                <div>
                  <div className="font-medium mb-1">Classe & Caminho</div>
                  {character.classPath.className || '—'} / {character.classPath.path || '—'}
                </div>
              )}
            </div>

            <button
              onClick={handleExportPdf}
              className="mt-6 px-4 py-2 rounded bg-gray-900 text-white text-sm"
            >
              Gerar PDF (Documento Confidencial)
            </button>
            <p className="text-xs text-gray-400 mt-2">
              Exportação real de PDF entra quando o layout da ficha estiver pronto.
            </p>
          </section>
        )}

        {/* Botões de Navegação */}
        <div className="flex justify-between mt-8 pt-4 border-t max-w-2xl">
          <button onClick={goBack} disabled={stepIndex === 0} className="text-sm px-4 py-2 rounded border disabled:opacity-30">
            Voltar
          </button>
          <button
            onClick={goNext}
            disabled={stepIndex === STEPS.length - 1}
            className="text-sm px-4 py-2 rounded bg-gray-900 text-white disabled:opacity-30"
          >
            Avançar
          </button>
        </div>
      </main>
    </div>
  );
}