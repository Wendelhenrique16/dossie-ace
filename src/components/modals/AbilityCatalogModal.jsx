// src/components/modals/AbilityCatalogModal.jsx
// Lista o catálogo de Habilidades agrupado por categoria. Ao clicar numa,
// devolve a habilidade escolhida pro pai (que cria uma instância editável)
// e fecha o modal.

import { groupAbilitiesByCategory } from '../../data/abilities';

export default function AbilityCatalogModal({ onSelect, onClose, filterCategory, title }) {
  const groups = groupAbilitiesByCategory().filter(
    (group) => !filterCategory || group.categoryId === filterCategory
  );

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg max-h-[92vh] flex flex-col overflow-hidden">
        <div className="p-3 sm:p-4 border-b flex items-center justify-between shrink-0">
          <h2 className="text-lg font-semibold">{title ?? 'Catálogo de Habilidades'}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700 text-xl leading-none">
            ×
          </button>
        </div>

        <div className="overflow-y-auto flex-1 p-4 space-y-4 overscroll-contain">
          {groups.map((group) => (
            <div key={group.categoryId}>
              <h3 className="text-xs font-semibold text-gray-400 uppercase mb-2">{group.label}</h3>
              <div className="space-y-2">
                {group.abilities.map((ability) => (
                  <button
                    key={ability.id}
                    onClick={() => onSelect(ability)}
                    className="w-full text-left border rounded p-3 hover:bg-gray-50"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-sm">{ability.name}</span>
                      <span className="text-xs text-gray-400">
                        Custo {ability.cost.label} · Efeito {ability.effect.names.join('+')}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{ability.effect.description}</p>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}