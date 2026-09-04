// src/components/modals/BulkDistributionModal.jsx
// Distribuição em lote: mostra TODOS os pacotes pendentes na mesma tela,
// cada um com seu próprio saldo/limite/perícias válidas — nada "vaza" de
// um pacote pro outro, mesma regra de sempre, só que tudo visível junto.

import { useState } from 'react';
import { BACKGROUND_PACKAGES } from '../../data/backgrounds';
import { SKILLS, ATTRIBUTES, groupSkillsByCategory } from '../../data/skills';
import {
  getValidSkillsForPackage,
  createDistributionState,
  incrementSkill,
  decrementSkill,
  randomizeDistribution,
  selectAttribute,
  canConfirm,
  ATTRIBUTE_BONUS_PER_PACKAGE,
} from '../../logic/backgroundDistribution';

export default function BulkDistributionModal({ pendingEntries, onConfirmAll, onClose }) {
  // pendingEntries: [{ instanceIndex, packageId }]
  const [states, setStates] = useState(() => {
    const initial = {};
    pendingEntries.forEach(({ instanceIndex, packageId }) => {
      initial[instanceIndex] = createDistributionState(packageId);
    });
    return initial;
  });

  const allValid = pendingEntries.every(({ instanceIndex }) => canConfirm(states[instanceIndex]));

  function updateState(instanceIndex, updater) {
    setStates((s) => ({ ...s, [instanceIndex]: updater(s[instanceIndex]) }));
  }

  function handleConfirmAll() {
    if (!allValid) return;
    const results = {};
    pendingEntries.forEach(({ instanceIndex }) => {
      results[instanceIndex] = {
        allocations: states[instanceIndex].allocations,
        attributeId: states[instanceIndex].selectedAttribute,
      };
    });
    onConfirmAll(results);
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[92vh] flex flex-col overflow-hidden">
        <div className="p-3 sm:p-4 border-b flex items-center justify-between shrink-0">
          <h2 className="text-lg font-semibold">Distribuir Todos os Pacotes Pendentes</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700 text-xl leading-none">
            ×
          </button>
        </div>

        <div className="overflow-y-auto flex-1 p-4 space-y-6 overscroll-contain">
          {pendingEntries.map(({ instanceIndex, packageId }) => {
            const pkg = BACKGROUND_PACKAGES[packageId];
            const validSkills = getValidSkillsForPackage(packageId);
            const skillGroups = groupSkillsByCategory(validSkills);
            const state = states[instanceIndex];

            return (
              <div key={instanceIndex} className="border rounded p-3">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium">
                    {pkg.label} #{instanceIndex + 1}
                  </h3>
                  <span
                    className={`text-sm font-bold ${
                      state.remainingPoints === 0 ? 'text-green-600' : 'text-gray-600'
                    }`}
                  >
                    {state.remainingPoints} / {state.totalPoints} pts
                  </span>
                </div>

                <div className="mb-3">
                  <div className="text-xs text-gray-500 mb-1">
                    Atributo (+{ATTRIBUTE_BONUS_PER_PACKAGE})
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {Object.entries(ATTRIBUTES).map(([id, attr]) => (
                      <button
                        key={id}
                        onClick={() => updateState(instanceIndex, (s) => selectAttribute(s, id))}
                        className={`px-2 py-1 rounded border text-xs ${
                          state.selectedAttribute === id ? 'bg-gray-900 text-white' : 'hover:bg-gray-50'
                        }`}
                      >
                        {attr.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  {skillGroups.map((group) => (
                    <div key={group.categoryId}>
                      <h4 className="text-xs font-semibold text-gray-400 uppercase mb-1">{group.label}</h4>
                      <div className="space-y-1">
                        {group.skills.map((skillId) => {
                          const skill = SKILLS[skillId];
                          const allocated = state.allocations[skillId] || 0;
                          return (
                            <div key={skillId} className="flex items-center justify-between py-0.5">
                              <span className="text-xs">{skill?.label ?? skillId}</span>
                              <div className="flex items-center gap-1">
                                <button
                                  onClick={() => updateState(instanceIndex, (s) => decrementSkill(s, skillId))}
                                  disabled={allocated === 0}
                                  className="w-6 h-6 rounded border text-xs disabled:opacity-30"
                                >
                                  −
                                </button>
                                <span className="w-5 text-center text-xs">{allocated}</span>
                                <button
                                  onClick={() => updateState(instanceIndex, (s) => incrementSkill(s, skillId))}
                                  disabled={state.remainingPoints === 0 || allocated >= 2}
                                  className="w-6 h-6 rounded border text-xs disabled:opacity-30"
                                >
                                  +
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => updateState(instanceIndex, (s) => randomizeDistribution(s, validSkills))}
                  className="mt-2 text-xs px-2 py-1 rounded border"
                >
                  Aleatorizar este pacote
                </button>
              </div>
            );
          })}
        </div>

        <div className="p-3 sm:p-4 border-t flex justify-end gap-2 shrink-0">
          <button onClick={onClose} className="text-sm px-4 py-2 rounded border">
            Cancelar
          </button>
          <button
            onClick={handleConfirmAll}
            disabled={!allValid}
            className="text-sm px-4 py-2 rounded bg-gray-900 text-white disabled:opacity-30"
          >
            Confirmar Todos
          </button>
        </div>
      </div>
    </div>
  );
}