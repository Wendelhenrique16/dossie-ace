// src/components/character/AspectsStep.jsx
import { useState } from 'react';
import { POSITIVE_ASPECTS, NEGATIVE_ASPECTS, MANDATORY_AGE_ASPECTS_COUNT } from '../../data/aspects';
import { rollMandatoryAgeAspects, getManualAgeAspectPool } from '../../logic/aspectsSelection';

export default function AspectsStep({ character, setCharacter, lifeStageId, remainingLuck }) {
  const [swappingIndex, setSwappingIndex] = useState(null);
  const mandatoryCount = MANDATORY_AGE_ASPECTS_COUNT[lifeStageId] ?? 0;
  const mandatoryAspects = character.aspects.mandatoryIds
    .map((id) => NEGATIVE_ASPECTS.find((a) => a.id === id))
    .filter(Boolean);

  function handleRollMandatory() {
    const rolled = rollMandatoryAgeAspects(lifeStageId, [
      ...character.aspects.mandatoryIds,
      ...character.aspects.excessNegativeIds,
    ]);
    setCharacter((c) => ({
      ...c,
      aspects: { ...c.aspects, mandatoryIds: rolled.map((a) => a.id) },
    }));
  }

  function handleSwapMandatory(index, newId) {
    setCharacter((c) => {
      const ids = [...c.aspects.mandatoryIds];
      ids[index] = newId;
      return { ...c, aspects: { ...c.aspects, mandatoryIds: ids } };
    });
    setSwappingIndex(null);
  }

  function toggleChosen(listKey, id) {
    setCharacter((c) => {
      const current = c.aspects[listKey];
      const next = current.includes(id) ? current.filter((x) => x !== id) : [...current, id];
      return { ...c, aspects: { ...c.aspects, [listKey]: next } };
    });
  }

  return (
    <section>
      <h2 className="text-xl font-semibold mb-2">Aspectos & Sorte</h2>

      <div className="mb-4 text-sm bg-gray-100 p-3 rounded">
        Saldo de Sorte Atual:{' '}
        <strong className={remainingLuck < 0 ? 'text-red-600' : 'text-green-600'}>{remainingLuck}</strong>
      </div>

      {/* Obrigatórios por idade */}
      <div className="mb-6">
        <h3 className="font-medium mb-1">Obrigatórios (Fase da Vida)</h3>
        {mandatoryCount === 0 ? (
          <p className="text-sm text-gray-500">Sua Fase da Vida não exige aspectos obrigatórios na criação.</p>
        ) : (
          <>
            <p className="text-sm text-gray-500 mb-2">
              {mandatoryCount} aspecto(s) negativo(s) ligado(s) à idade.
            </p>
            {mandatoryAspects.length === 0 ? (
              <button onClick={handleRollMandatory} className="text-sm px-3 py-2 rounded border">
                Sortear
              </button>
            ) : (
              <div className="space-y-2">
                {mandatoryAspects.map((aspect, i) => (
                  <div key={aspect.id} className="border rounded p-3">
                    {swappingIndex === i ? (
                      <select
                        autoFocus
                        className="w-full border rounded px-2 py-1 text-sm"
                        defaultValue=""
                        onChange={(e) => e.target.value && handleSwapMandatory(i, e.target.value)}
                      >
                        <option value="">Escolher manualmente...</option>
                        {getManualAgeAspectPool([
                          ...character.aspects.mandatoryIds,
                          ...character.aspects.excessNegativeIds,
                        ]).map((opt) => (
                          <option key={opt.id} value={opt.id}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="font-medium text-sm">{aspect.label}</div>
                          <div className="text-xs text-gray-500">{aspect.effect}</div>
                        </div>
                        <button
                          onClick={() => setSwappingIndex(i)}
                          className="text-xs text-gray-500 underline whitespace-nowrap"
                        >
                          trocar
                        </button>
                      </div>
                    )}
                  </div>
                ))}
                <button onClick={handleRollMandatory} className="text-xs text-gray-500 underline">
                  sortear novamente todos
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Escolha livre — positivos */}
      <div className="mb-6">
        <h3 className="font-medium mb-2">Aspectos Positivos (à escolha)</h3>
        <div className="max-h-56 overflow-y-auto border rounded divide-y">
          {POSITIVE_ASPECTS.map((aspect) => (
            <label key={aspect.id} className="flex items-start gap-2 p-2 text-sm cursor-pointer hover:bg-gray-50">
              <input
                type="checkbox"
                className="mt-1"
                checked={character.aspects.chosenPositiveIds.includes(aspect.id)}
                onChange={() => toggleChosen('chosenPositiveIds', aspect.id)}
              />
              <div>
                <div className="font-medium">{aspect.label}</div>
                <div className="text-xs text-gray-500">{aspect.effect}</div>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Escolha livre — negativos */}
      <div>
        <h3 className="font-medium mb-2">Aspectos Negativos (à escolha)</h3>
        <div className="max-h-56 overflow-y-auto border rounded divide-y">
          {NEGATIVE_ASPECTS.map((aspect) => (
            <label key={aspect.id} className="flex items-start gap-2 p-2 text-sm cursor-pointer hover:bg-gray-50">
              <input
                type="checkbox"
                className="mt-1"
                checked={character.aspects.chosenNegativeIds.includes(aspect.id)}
                onChange={() => toggleChosen('chosenNegativeIds', aspect.id)}
              />
              <div>
                <div className="font-medium">{aspect.label}</div>
                <div className="text-xs text-gray-500">{aspect.effect}</div>
              </div>
            </label>
          ))}
        </div>
      </div>
    </section>
  );
}