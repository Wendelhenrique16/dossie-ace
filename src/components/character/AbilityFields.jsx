// src/components/character/AbilityFields.jsx
import { TRIGGER_TYPES, COST_FORMS_BY_WEIGHT, COST_WEIGHT_LABELS, EFFECT_DEFINITIONS, getEffectWeight } from '../../data/abilities';

export default function AbilityFields({ ability: a, onChange, onRemove, triggerPlaceholder = 'ex: antes de sacar a arma' }) {
  const set = (updater) => onChange(updater);

  function toggleEffect(name) {
    set((ab) => {
      const names = ab.effect.names.includes(name)
        ? ab.effect.names.filter((n) => n !== name)
        : [...ab.effect.names, name];
      return { ...ab, effect: { ...ab.effect, weight: names.length ? getEffectWeight(names) : 1, names } };
    });
  }

  return (
    <div className="border rounded p-3 space-y-2">
      <div className="flex items-center justify-between">
        <input
          className="font-medium text-sm border-b border-transparent hover:border-gray-300 focus:border-gray-900 outline-none flex-1"
          value={a.name}
          onChange={(e) => set((ab) => ({ ...ab, name: e.target.value }))}
        />
        <button onClick={onRemove} className="text-xs text-red-500 underline ml-2">Remover</button>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="block text-xs text-gray-500 mb-1">Gatilho</label>
          <select
            className="w-full border rounded px-2 py-1 text-xs"
            value={a.trigger.type}
            onChange={(e) => set((ab) => ({ ...ab, trigger: { ...ab.trigger, type: e.target.value } }))}
          >
            {TRIGGER_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1">Detalhe (opcional)</label>
          <input
            className="w-full border rounded px-2 py-1 text-xs"
            placeholder={triggerPlaceholder}
            value={a.trigger.detail}
            onChange={(e) => set((ab) => ({ ...ab, trigger: { ...ab.trigger, detail: e.target.value } }))}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="block text-xs text-gray-500 mb-1">Peso do Custo</label>
          <select
            className="w-full border rounded px-2 py-1 text-xs"
            value={a.cost.weight}
            onChange={(e) => {
              const weight = Number(e.target.value);
              set((ab) => ({ ...ab, cost: { weight, form: COST_FORMS_BY_WEIGHT[weight][0] } }));
            }}
          >
            {[1, 2, 3, 4].map((w) => <option key={w} value={w}>{w} — {COST_WEIGHT_LABELS[w]}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1">Forma do Custo</label>
          <select
            className="w-full border rounded px-2 py-1 text-xs"
            value={a.cost.form}
            onChange={(e) => set((ab) => ({ ...ab, cost: { ...ab.cost, form: e.target.value } }))}
          >
            {COST_FORMS_BY_WEIGHT[a.cost.weight].map((form) => <option key={form} value={form}>{form}</option>)}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-xs text-gray-500 mb-1">
          Efeito (peso {a.effect.weight} — {COST_WEIGHT_LABELS[Math.min(a.effect.weight, 4)]})
        </label>
        <div className="flex flex-wrap gap-1 mb-2">
          {Object.entries(EFFECT_DEFINITIONS).map(([name, def]) => (
            <button
              key={name}
              type="button"
              onClick={() => toggleEffect(name)}
              className={`px-2 py-1 rounded border text-xs ${a.effect.names.includes(name) ? 'bg-gray-900 text-white' : 'hover:bg-gray-50'}`}
            >
              {name} ({def.weight})
            </button>
          ))}
        </div>
        {a.effect.names.length > 0 && (
          <div className="bg-gray-50 border rounded p-2 text-xs text-gray-500 space-y-1">
            {a.effect.names.map((n) => (
              <div key={n}><strong>{n}:</strong> {EFFECT_DEFINITIONS[n].description}</div>
            ))}
          </div>
        )}
      </div>

      <div>
        <label className="block text-xs text-gray-500 mb-1">Descrição</label>
        <textarea
          className="w-full border rounded px-2 py-1 text-xs"
          rows={2}
          placeholder="Descreva o que o golpe/habilidade faz na prática"
          value={a.effect.description}
          onChange={(e) => set((ab) => ({ ...ab, effect: { ...ab.effect, description: e.target.value } }))}
        />
      </div>

      {a.cost.weight !== a.effect.weight && (
        <p className="text-xs text-amber-600">
          ⚠ Custo (peso {a.cost.weight}) e Efeito (peso {a.effect.weight}) diferentes —
          {a.cost.weight < a.effect.weight
            ? ' pagar menos gera um excedente dobrado como consequência extra.'
            : ' pagar mais é só desperdício de recurso (roleplay).'}
        </p>
      )}

      <div>
        <label className="flex items-center gap-2 text-xs text-gray-500">
          <input
            type="checkbox"
            checked={!!a.conditional}
            onChange={() => set((ab) => ({ ...ab, conditional: ab.conditional ? null : { description: '', costReduction: 1 } }))}
          />
          Condicional (reduz o Custo em troca de uma restrição)
        </label>
        {a.conditional && (
          <div className="mt-2 space-y-2 pl-5">
            <input
              className="w-full border rounded px-2 py-1 text-xs"
              placeholder="Descreva a condição"
              value={a.conditional.description}
              onChange={(e) => set((ab) => ({ ...ab, conditional: { ...ab.conditional, description: e.target.value } }))}
            />
            <select
              className="w-full border rounded px-2 py-1 text-xs"
              value={a.conditional.costReduction}
              onChange={(e) =>
                set((ab) => ({
                  ...ab,
                  conditional: { ...ab.conditional, costReduction: e.target.value === 'zera' ? 'zera' : Number(e.target.value) },
                }))
              }
            >
              <option value={1}>Reduz -1 no peso do Custo</option>
              <option value="zera">Zera o Custo</option>
            </select>
          </div>
        )}
      </div>
    </div>
  );
}