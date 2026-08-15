// src/pages/CharacterCreate.jsx
// Esqueleto funcional do fluxo de criação de personagem, estilo Pathbuilder:
// navegação por etapas na lateral, conteúdo da etapa atual à direita.
//
// Estilização é mínima de propósito — o layout final vem do design que está
// sendo produzido. O que importa aqui é o FLUXO e o ESTADO funcionando.

import { useState, useMemo } from 'react';
import { LIFE_STAGES } from '../data/lifeStages';
import { BACKGROUND_PACKAGES } from '../data/backgrounds';
import { SKILLS, ATTRIBUTES } from '../data/skills';
import { listSelectableOccupations, calculateOccupationBonuses } from '../logic/occupationBonuses';
import { rollExtraPackageSanityCost, checkBrokenSanityState } from '../logic/characterCalculations';
import BackgroundModal from '../components/modals/BackgroundModal';

const STEPS = [
  { id: 'identity', label: '1. Identidade' },
  { id: 'lifeStage', label: '2. Fase da Vida' },
  { id: 'backgrounds', label: '3. Antecedentes' },
  { id: 'attributes', label: '4. Atributos' },
  { id: 'occupation', label: '5. Ocupação' },
  { id: 'review', label: '6. Revisão & PDF' },
];

const EMPTY_ATTRIBUTES = Object.fromEntries(Object.keys(ATTRIBUTES).map((id) => [id, 0]));

export default function CharacterCreate() {
  const [currentStep, setCurrentStep] = useState('identity');
  const [activeModalPackage, setActiveModalPackage] = useState(null);

  const [character, setCharacter] = useState({
    name: '',
    concept: '',
    lifeStageId: null,
    purchasedBackgrounds: [], // [{ packageId, allocations }]
    maxSanity: 100,
    attributes: EMPTY_ATTRIBUTES,
    occupation: { primaryId: null, secondaryId: null, freeAttribute: null },
  });

  const stepIndex = STEPS.findIndex((s) => s.id === currentStep);
  const goNext = () => setCurrentStep(STEPS[Math.min(stepIndex + 1, STEPS.length - 1)].id);
  const goBack = () => setCurrentStep(STEPS[Math.max(stepIndex - 1, 0)].id);

  const lifeStage = character.lifeStageId ? LIFE_STAGES[character.lifeStageId] : null;
  const freePackages = lifeStage?.freePackages ?? 0;
  const purchasedCount = character.purchasedBackgrounds.length;
  const isExtraPackage = purchasedCount >= freePackages;

  // Soma de perícias vindas de todos os pacotes comprados
  const skillTotalsFromBackgrounds = useMemo(() => {
    const totals = {};
    character.purchasedBackgrounds.forEach(({ allocations }) => {
      Object.entries(allocations).forEach(([skillId, points]) => {
        totals[skillId] = (totals[skillId] || 0) + points;
      });
    });
    return totals;
  }, [character.purchasedBackgrounds]);

  // Bônus de ocupação (só calcula se as duas categorias já foram escolhidas)
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

  const isBroken = checkBrokenSanityState(purchasedCount);

  function handleSelectLifeStage(id) {
    setCharacter((c) => ({
      ...c,
      lifeStageId: id,
      maxSanity: 100,
      purchasedBackgrounds: [],
    }));
  }

  function handleConfirmBackground(allocations) {
    setCharacter((c) => {
      let newMaxSanity = c.maxSanity;
      // Se já ultrapassou o número de pacotes gratuitos, cobra o custo em sanidade
      if (c.purchasedBackgrounds.length >= freePackages) {
        newMaxSanity = Math.max(0, c.maxSanity - rollExtraPackageSanityCost());
      }
      return {
        ...c,
        purchasedBackgrounds: [
          ...c.purchasedBackgrounds,
          { packageId: activeModalPackage, allocations },
        ],
        maxSanity: newMaxSanity,
      };
    });
    setActiveModalPackage(null);
  }

  function handleAttributeChange(attrId, value) {
    setCharacter((c) => ({
      ...c,
      attributes: { ...c.attributes, [attrId]: Number(value) },
    }));
  }

  function handleExportPdf() {
    // TODO: substituir por geração real de PDF (ex: lib jsPDF/react-pdf) quando
    // o layout final da ficha estiver pronto. Por enquanto, usa a impressão do
    // navegador como placeholder para validar o fluxo ponta a ponta.
    window.print();
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Navegação lateral de etapas */}
      <aside className="w-56 border-r bg-white p-4 space-y-1">
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

      {/* Conteúdo da etapa atual */}
      <main className="flex-1 p-6 max-w-2xl">
        {currentStep === 'identity' && (
          <section>
            <h2 className="text-xl font-semibold mb-4">Identidade</h2>
            <label className="block text-sm mb-1">Nome do personagem</label>
            <input
              className="w-full border rounded px-3 py-2 mb-4"
              value={character.name}
              onChange={(e) => setCharacter((c) => ({ ...c, name: e.target.value }))}
            />
            <label className="block text-sm mb-1">Conceito</label>
            <textarea
              className="w-full border rounded px-3 py-2"
              rows={3}
              value={character.concept}
              onChange={(e) => setCharacter((c) => ({ ...c, concept: e.target.value }))}
              placeholder="Quem ele é, como pessoa — não em termos de ficha."
            />
          </section>
        )}

        {currentStep === 'lifeStage' && (
          <section>
            <h2 className="text-xl font-semibold mb-4">Fase da Vida</h2>
            <div className="grid grid-cols-1 gap-3">
              {Object.values(LIFE_STAGES).map((stage) => (
                <button
                  key={stage.id}
                  onClick={() => handleSelectLifeStage(stage.id)}
                  className={`text-left border rounded p-3 ${
                    character.lifeStageId === stage.id ? 'border-gray-900 bg-gray-50' : ''
                  }`}
                >
                  <div className="font-medium">{stage.label}</div>
                  <div className="text-sm text-gray-500">
                    {stage.freePackages} pacotes gratuitos · {stage.initialLuck} de sorte inicial
                  </div>
                </button>
              ))}
            </div>
          </section>
        )}

        {currentStep === 'backgrounds' && (
          <section>
            <h2 className="text-xl font-semibold mb-2">Antecedentes</h2>
            {!lifeStage ? (
              <p className="text-sm text-gray-500">Escolha a Fase da Vida primeiro.</p>
            ) : (
              <>
                <p className="text-sm text-gray-500 mb-4">
                  {purchasedCount} de {freePackages} pacotes gratuitos usados.
                  {isExtraPackage && (
                    <span className="text-amber-600"> Próxima compra terá custo em Sanidade.</span>
                  )}
                </p>
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
                <div className="text-sm">
                  Sanidade Máxima atual: <strong>{character.maxSanity}</strong>
                  {isBroken && (
                    <span className="text-red-600 ml-2">— A Beira da Loucura (sanidade travada em 1)</span>
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

        {currentStep === 'attributes' && (
          <section>
            <h2 className="text-xl font-semibold mb-4">Atributos</h2>
            <div className="space-y-3">
              {Object.entries(ATTRIBUTES).map(([id, attr]) => (
                <div key={id} className="flex items-center justify-between">
                  <span className="text-sm">{attr.label}</span>
                  <input
                    type="number"
                    className="w-20 border rounded px-2 py-1 text-right"
                    value={character.attributes[id]}
                    onChange={(e) => handleAttributeChange(id, e.target.value)}
                  />
                </div>
              ))}
            </div>
          </section>
        )}

        {currentStep === 'occupation' && (
          <section>
            <h2 className="text-xl font-semibold mb-4">Ocupação</h2>
            <label className="block text-sm mb-1">Categoria Primária</label>
            <select
              className="w-full border rounded px-3 py-2 mb-3"
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

            <label className="block text-sm mb-1">Categoria Secundária</label>
            <select
              className="w-full border rounded px-3 py-2 mb-3"
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
              className="w-full border rounded px-3 py-2"
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

        {currentStep === 'review' && (
          <section>
            <h2 className="text-xl font-semibold mb-4">Revisão</h2>
            <div className="space-y-4 text-sm">
              <div>
                <strong>{character.name || '(sem nome)'}</strong>
                <p className="text-gray-500">{character.concept}</p>
              </div>
              <div>
                Fase da Vida: <strong>{lifeStage?.label ?? '—'}</strong> · Sanidade Máxima:{' '}
                <strong>{character.maxSanity}</strong>
              </div>
              <div>
                <div className="font-medium mb-1">Atributos</div>
                {Object.entries(character.attributes).map(([id, value]) => (
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
            </div>

            <button
              onClick={handleExportPdf}
              className="mt-6 px-4 py-2 rounded bg-gray-900 text-white text-sm"
            >
              Gerar PDF (placeholder)
            </button>
            <p className="text-xs text-gray-400 mt-2">
              Exportação real de PDF entra quando o layout da ficha estiver pronto.
            </p>
          </section>
        )}

        {/* Navegação entre etapas */}
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