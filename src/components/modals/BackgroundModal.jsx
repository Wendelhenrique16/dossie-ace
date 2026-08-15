// src/components/modals/BackgroundModal.jsx
// UC-01: Distribuir Pontos de Antecedentes.
// Skeleton funcional — estilização mínima, pronta para receber o design final.

import { useState } from 'react';
import { BACKGROUND_PACKAGES } from '../../data/backgrounds';
import { SKILLS } from '../../data/skills';
import {
  getValidSkillsForPackage,
  createDistributionState,
  incrementSkill,
  decrementSkill,
  randomizeDistribution,
  canConfirm,
} from '../../logic/backgroundDistribution';

export default function BackgroundModal({ packageId, onConfirm, onClose }) {
  const pkg = BACKGROUND_PACKAGES[packageId];
  const validSkills = getValidSkillsForPackage(packageId);
  const [state, setState] = useState(() => createDistributionState(packageId));

  if (!pkg) return null;

  const handleIncrement = (skillId) => setState((s) => incrementSkill(s, skillId));
  const handleDecrement = (skillId) => setState((s) => decrementSkill(s, skillId));
  const handleRandomize = () => setState((s) => randomizeDistribution(s, validSkills));
  const handleConfirm = () => {
    if (canConfirm(state)) onConfirm(state.allocations);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg max-h-[85vh] overflow-y-auto">
        {/* Cabeçalho */}
        <div className="p-4 border-b sticky top-0 bg-white flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">{pkg.label}</h2>
            <p className="text-sm text-gray-500">{pkg.description}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700 text-xl leading-none">
            ×
          </button>
        </div>

        {/* Saldo de pontos */}
        <div className="px-4 py-3 flex items-center justify-between border-b">
          <span className="text-sm text-gray-600">Pontos disponíveis</span>
          <span
            className={`text-lg font-bold ${
              state.remainingPoints === 0 ? 'text-red-600' : 'text-gray-900'
            }`}
          >
            {state.remainingPoints} / {state.totalPoints}
          </span>
        </div>

        {state.error && (
          <div className="px-4 py-2 text-sm text-red-600 bg-red-50 border-b">{state.error}</div>
        )}

        {/* Lista de perícias válidas */}
        <div className="p-4 space-y-2">
          {validSkills.map((skillId) => {
            const skill = SKILLS[skillId];
            const allocated = state.allocations[skillId] || 0;
            return (
              <div key={skillId} className="flex items-center justify-between py-1">
                <span className="text-sm">{skill?.label ?? skillId}</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleDecrement(skillId)}
                    disabled={allocated === 0}
                    className="w-7 h-7 rounded border disabled:opacity-30"
                  >
                    −
                  </button>
                  <span className="w-6 text-center text-sm">{allocated}</span>
                  <button
                    onClick={() => handleIncrement(skillId)}
                    disabled={state.remainingPoints === 0 || allocated >= 2}
                    className="w-7 h-7 rounded border disabled:opacity-30"
                  >
                    +
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Ações do modal */}
        <div className="p-4 border-t flex items-center justify-between sticky bottom-0 bg-white">
          <button onClick={handleRandomize} className="text-sm px-3 py-2 rounded border">
            Aleatorizar
          </button>
          <div className="flex gap-2">
            <button onClick={onClose} className="text-sm px-3 py-2 rounded border">
              Cancelar
            </button>
            <button
              onClick={handleConfirm}
              disabled={!canConfirm(state)}
              className="text-sm px-4 py-2 rounded bg-gray-900 text-white disabled:opacity-30"
            >
              Confirmar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}