// src/components/modals/BackgroundModal.jsx
// UC-01: Distribuir Pontos de Antecedentes.
// Skeleton funcional — estilização mínima, pronta para receber o design final.

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

export default function BackgroundModal({ packageId, purchaseNumber = 1, onConfirm, onClose }) {
  const pkg = BACKGROUND_PACKAGES[packageId];
  const validSkills = getValidSkillsForPackage(packageId);
  const skillGroups = groupSkillsByCategory(validSkills);
  const [state, setState] = useState(() => createDistributionState(packageId));

  if (!pkg) return null;

  // Escala Narrativa: mostra o tier correspondente a essa compra (capado no
  // último tier definido, já que o livro só tem até a 4ª compra escrita).
  const narrativeTier =
    pkg.narrativeScale?.[Math.min(purchaseNumber, pkg.narrativeScale.length) - 1] ?? null;

  const handleIncrement = (skillId) => setState((s) => incrementSkill(s, skillId));
  const handleDecrement = (skillId) => setState((s) => decrementSkill(s, skillId));
  const handleRandomize = () => setState((s) => randomizeDistribution(s, validSkills));
  const handleSelectAttribute = (attributeId) => setState((s) => selectAttribute(s, attributeId));
  const handleConfirm = () => {
    if (canConfirm(state)) {
      onConfirm({ allocations: state.allocations, attributeId: state.selectedAttribute });
    }
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

        {/* Escala Narrativa — o "sabor" dessa compra específica */}
        {narrativeTier && (
          <div className="px-4 py-3 border-b bg-gray-50 text-sm">
            <span className="font-medium">
              {purchaseNumber}ª compra ({narrativeTier.title}):
            </span>{' '}
            <span className="text-gray-600">{narrativeTier.text}</span>
          </div>
        )}

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

        {/* Bônus fixo de Atributo (+2, não divisível) */}
        <div className="px-4 py-3 border-b">
          <div className="text-sm text-gray-600 mb-2">
            Escolha o Atributo que recebe +{ATTRIBUTE_BONUS_PER_PACKAGE} nesta compra
          </div>
          <div className="flex flex-wrap gap-2">
            {Object.entries(ATTRIBUTES).map(([id, attr]) => (
              <button
                key={id}
                onClick={() => handleSelectAttribute(id)}
                className={`px-3 py-1.5 rounded border text-sm ${
                  state.selectedAttribute === id ? 'bg-gray-900 text-white' : 'hover:bg-gray-50'
                }`}
              >
                {attr.label}
              </button>
            ))}
          </div>
        </div>

        {/* Lista de perícias válidas, agrupadas por categoria (como na ficha) */}
        <div className="p-4 space-y-4">
          {skillGroups.map((group) => (
            <div key={group.categoryId}>
              <h3 className="text-xs font-semibold text-gray-400 uppercase mb-1">{group.label}</h3>
              <div className="space-y-2">
                {group.skills.map((skillId) => {
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
            </div>
          ))}
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