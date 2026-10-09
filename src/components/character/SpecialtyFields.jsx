// src/components/character/SpecialtyFields.jsx
import { EFFECT_DEFINITIONS } from '../../data/abilities';
import { EXCLUDED_PASSIVE_EFFECTS } from '../../data/fightingStyles';

export default function SpecialtyFields({ specialty: s, onChange, onRemove }) {
  function toggleEffect(name) {
    onChange((sp) => ({
      ...sp,
      names: sp.names.includes(name) ? sp.names.filter((n) => n !== name) : [...sp.names, name],
    }));
  }

  return (
    <div className="border rounded p-3 space-y-2">
      <div className="flex items-center justify-between">
        <input
          className="font-medium text-sm border-b border-transparent hover:border-gray-300 focus:border-gray-900 outline-none flex-1"
          placeholder="Nome (ex: Desarmar Agarrado)"
          value={s.name}
          onChange={(e) => onChange((sp) => ({ ...sp, name: e.target.value }))}
        />
        <button onClick={onRemove} className="text-xs text-red-500 underline ml-2">Remover</button>
      </div>

      <div>
        <label className="block text-xs text-gray-500 mb-1">Escopo: a ação específica (não uma Perícia inteira)</label>
        <input
          className={`w-full border rounded px-2 py-1 text-xs ${!s.scope.trim() ? 'border-red-400' : ''}`}
          placeholder='ex: "desarmar um oponente agarrado"'
          value={s.scope}
          onChange={(e) => onChange((sp) => ({ ...sp, scope: e.target.value }))}
        />
      </div>

      <div>
        <label className="block text-xs text-gray-500 mb-1">Efeitos (combine quantos quiser)</label>
        <div className="flex flex-wrap gap-1 mb-2">
          {Object.keys(EFFECT_DEFINITIONS)
            .filter((name) => !EXCLUDED_PASSIVE_EFFECTS.includes(name))
            .map((name) => (
              <button
                key={name}
                type="button"
                onClick={() => toggleEffect(name)}
                className={`px-2 py-1 rounded border text-xs ${s.names.includes(name) ? 'bg-gray-900 text-white' : 'hover:bg-gray-50'}`}
              >
                {name}
              </button>
            ))}
        </div>
        {s.names.length > 0 && (
          <div className="bg-gray-50 border rounded p-2 text-xs text-gray-500 space-y-1">
            {s.names.map((n) => (
              <div key={n}><strong>{n}:</strong> {EFFECT_DEFINITIONS[n].description}</div>
            ))}
          </div>
        )}
        <p className="text-xs text-gray-400 mt-1">
          Facilitar vale pra testes contra Dificuldade fixa. Pra ataques, defesas e Manobras, escolha outro Efeito.
        </p>
      </div>

      <div>
        <label className="flex items-center gap-2 text-xs text-gray-500">
          <input
            type="checkbox"
            checked={!!s.conditional}
            onChange={() => onChange((sp) => ({ ...sp, conditional: sp.conditional ? null : { description: '' } }))}
          />
          Condicional (opcional — restringe a ação a uma situação mais específica)
        </label>
        {s.conditional && (
          <input
            className="w-full border rounded px-2 py-1 text-xs mt-1"
            placeholder='ex: "só contra armas curtas"'
            value={s.conditional.description}
            onChange={(e) => onChange((sp) => ({ ...sp, conditional: { description: e.target.value } }))}
          />
        )}
      </div>

      <div>
        <label className="block text-xs text-gray-500 mb-1">Descrição (opcional)</label>
        <textarea
          className="w-full border rounded px-2 py-1 text-xs"
          rows={2}
          placeholder="Como a Passiva aparece na prática"
          value={s.description}
          onChange={(e) => onChange((sp) => ({ ...sp, description: e.target.value }))}
        />
      </div>

      {s.names.length === 0 && <p className="text-xs text-red-600">⚠ Escolha ao menos 1 Efeito.</p>}
    </div>
  );
}