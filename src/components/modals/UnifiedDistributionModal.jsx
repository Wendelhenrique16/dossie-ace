// src/components/modals/UnifiedDistributionModal.jsx
// Distribuição unificada: UMA lista de perícias com o total somado de todos
// os pacotes pendentes. O saldo/limite de 2 por perícia continua preso ao
// pacote de origem por baixo dos panos (pra respeitar as regras e preparar
// terreno pra futura regra de "qual pacote libera qual atributo"), mas na
// tela o jogador só vê o total — sem separação visual por pacote.

import { useState } from 'react';
import { BACKGROUND_PACKAGES } from '../../data/backgrounds';
import { SKILLS, ATTRIBUTES, groupSkillsByCategory } from '../../data/skills';
import {
  getValidSkillsForPackage,
  createUnifiedDistributionState,
  getUnifiedSkillTotal,
  getUnifiedRemainingPoints,
  incrementUnifiedSkill,
  decrementUnifiedSkill,
  selectUnifiedAttribute,
  randomizeUnifiedDistribution,
  unifiedCanConfirm,
  ATTRIBUTE_BONUS_PER_PACKAGE,
} from '../../logic/backgroundDistribution';

export default function UnifiedDistributionModal({ pendingEntries, onConfirmAll, onClose }) {
  const [state, setState] = useState(() => createUnifiedDistributionState(pendingEntries));

  // União de todas as perícias válidas entre os pacotes pendentes —
  // a ficha única mostra qualquer perícia que pelo menos um deles libera.
  const unionSkillIds = [...new Set(pendingEntries.flatMap(({ packageId }) => getValidSkillsForPackage(packageId)))];
  const skillGroups = groupSkillsByCategory(unionSkillIds);

  const remainingPoints = getUnifiedRemainingPoints(state);
  const canConfirmAll = unifiedCanConfirm(state);

  const handleIncrement = (skillId) => setState((s) => incrementUnifiedSkill(s, skillId, pendingEntries));
  const handleDecrement = (skillId) => setState((s) => decrementUnifiedSkill(s, skillId));
  const handleSelectAttribute = (instanceIndex, attributeId) =>
    setState((s) => selectUnifiedAttribute(s, instanceIndex, attributeId));
  const handleRandomize = () => setState((s) => randomizeUnifiedDistribution(s, pendingEntries));

  function handleConfirmAll() {
    if (!canConfirmAll) return;
    const results = {};
    pendingEntries.forEach(({ instanceIndex }) => {
      const pkgState = state.perPackage[instanceIndex];
      results[instanceIndex] = { allocations: pkgState.allocations, attributeId: pkgState.selectedAttribute };
    });
    onConfirmAll(results);
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg max-h-[92vh] flex flex-col overflow-hidden">
        <div className="p-3 sm:p-4 border-b flex items-center justify-between shrink-0">
          <div>
            <h2 className="text-lg font-semibold">Distribuir Todos os Pacotes Pendentes</h2>
            <p className="text-xs text-gray-500">
              {pendingEntries.length} pacote(s) pendente(s) — ficha única
            </p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700 text-xl leading-none">
            ×
          </button>
        </div>

        <div className="overflow-y-auto flex-1 overscroll-contain">
          {/* Saldo total */}
          <div className="px-4 py-3 flex items-center justify-between border-b">
            <span className="text-sm text-gray-600">Pontos disponíveis (soma de todos os pacotes)</span>
            <span className={`text-lg font-bold ${remainingPoints === 0 ? 'text-red-600' : 'text-gray-900'}`}>
              {remainingPoints}
            </span>
          </div>

          {/* Atributos — continua por pacote, porque o +2 é fixo por compra */}
          <div className="px-4 py-3 border-b space-y-2">
            <div className="text-sm text-gray-600 mb-1">
              Atributo (+{ATTRIBUTE_BONUS_PER_PACKAGE} por pacote)
            </div>
            {pendingEntries.map(({ instanceIndex, packageId }) => {
              const pkg = BACKGROUND_PACKAGES[packageId];
              const pkgState = state.perPackage[instanceIndex];
              return (
                <div key={instanceIndex} className="flex items-center justify-between flex-wrap gap-1">
                  <span className="text-xs text-gray-500 w-full sm:w-auto">
                    {pkg.label} #{instanceIndex + 1}:
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {Object.entries(ATTRIBUTES).map(([id, attr]) => (
                      <button
                        key={id}
                        onClick={() => handleSelectAttribute(instanceIndex, id)}
                        className={`px-2 py-1 rounded border text-xs ${
                          pkgState.selectedAttribute === id ? 'bg-gray-900 text-white' : 'hover:bg-gray-50'
                        }`}
                      >
                        {attr.label}
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Ficha única de perícias */}
          <div className="p-4 space-y-4">
            {skillGroups.map((group) => (
              <div key={group.categoryId}>
                <h3 className="text-xs font-semibold text-gray-400 uppercase mb-1">{group.label}</h3>
                <div className="space-y-2">
                  {group.skills.map((skillId) => {
                    const skill = SKILLS[skillId];
                    const total = getUnifiedSkillTotal(state, skillId);
                    return (
                      <div key={skillId} className="flex items-center justify-between py-1">
                        <span className="text-sm">{skill?.label ?? skillId}</span>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleDecrement(skillId)}
                            disabled={total === 0}
                            className="w-7 h-7 rounded border disabled:opacity-30"
                          >
                            −
                          </button>
                          <span className="w-6 text-center text-sm">{total}</span>
                          <button
                            onClick={() => handleIncrement(skillId)}
                            disabled={remainingPoints === 0}
                            className="w-7 h-7 rounded border disabled:opacity-30"
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
        </div>

        <div className="p-3 sm:p-4 border-t flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 shrink-0">
          <button onClick={handleRandomize} className="text-xs sm:text-sm px-3 py-2 rounded border order-2 sm:order-1">
            Aleatorizar tudo
          </button>
          <div className="flex gap-2 order-1 sm:order-2">
            <button onClick={onClose} className="flex-1 sm:flex-initial text-xs sm:text-sm px-3 py-2 rounded border">
              Cancelar
            </button>
            <button
              onClick={handleConfirmAll}
              disabled={!canConfirmAll}
              className="flex-1 sm:flex-initial text-xs sm:text-sm px-4 py-2 rounded bg-gray-900 text-white disabled:opacity-30"
            >
              Confirmar Todos
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}