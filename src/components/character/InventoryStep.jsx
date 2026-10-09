// src/components/character/InventoryStep.jsx
import { ARSENAL, ARSENAL_GROUPS, ARSENAL_BY_ID, WEAPON_TAGS, DAMAGE_TYPE_INFO, getDamageTypes } from '../../data/arsenal';
import { formatWeaponDamage } from '../../logic/characterCalculations';

export default function InventoryStep({ character, setCharacter, physicalDamage, cargaInfo }) {
  const items = character.inventory ?? [];

  function update(instanceId, patch) {
    setCharacter((c) => ({
      ...c,
      inventory: (c.inventory ?? []).map((i) => (i.instanceId === instanceId ? { ...i, ...patch } : i)),
    }));
  }
  function remove(instanceId) {
    setCharacter((c) => ({ ...c, inventory: (c.inventory ?? []).filter((i) => i.instanceId !== instanceId) }));
  }
  function addFree() {
    setCharacter((c) => ({
      ...c,
      inventory: [...(c.inventory ?? []), { instanceId: `${Date.now()}-${Math.random()}`, catalogId: null, name: '', quantity: 1, notes: '' }],
    }));
  }
  function addFromArsenal(entryId) {
    const entry = ARSENAL_BY_ID[entryId];
    if (!entry) return;
    setCharacter((c) => ({
      ...c,
      inventory: [
        ...(c.inventory ?? []),
        { instanceId: `${Date.now()}-${Math.random()}`, catalogId: entry.id, name: entry.name, quantity: 1, notes: entry.notes ?? '' },
      ],
    }));
  }

  return (
    <section>
      <h2 className="text-xl font-semibold mb-2">Inventário</h2>
      <p className="text-sm text-gray-500 mb-2">
        Lista do que o personagem carrega, com os efeitos de cada item. Os itens do Arsenal trazem dano, tipo, Tags e suprimento.
      </p>
      {cargaInfo && (
        <p className="text-xs text-gray-500 mb-4">
          Carga confortável do personagem: até <strong>{cargaInfo.comfortable.maxKg} kg</strong> (Carga {cargaInfo.comfortable.cargaLevel}).
        </p>
      )}

      <div className="flex flex-wrap gap-2 mb-4">
        <select
          className="text-xs border rounded px-2 py-1.5"
          value=""
          onChange={(e) => {
            if (e.target.value) addFromArsenal(e.target.value);
            e.target.value = '';
          }}
        >
          <option value="">+ Do Arsenal Padrão...</option>
          {ARSENAL_GROUPS.map((g) => (
            <optgroup key={g.id} label={g.label}>
              {ARSENAL.filter((a) => a.group === g.id).map((a) => (
                <option key={a.id} value={a.id}>{a.name}</option>
              ))}
            </optgroup>
          ))}
        </select>
        <button onClick={addFree} className="text-xs px-3 py-1.5 rounded border bg-gray-50">+ Item livre</button>
      </div>

      {items.length === 0 ? (
        <p className="text-sm text-gray-400">Nenhum item adicionado.</p>
      ) : (
        <div className="space-y-3">
          {items.map((item) => {
            const entry = item.catalogId ? ARSENAL_BY_ID[item.catalogId] : null;
            const hasInfo = entry && (entry.damage || entry.tags?.length || entry.supply);
            const types = entry ? getDamageTypes(entry.damageType) : [];
            return (
              <div key={item.instanceId} className="border rounded p-3 space-y-2">
                <div className="flex items-center gap-2">
                  <input
                    className="font-medium text-sm border-b border-transparent hover:border-gray-300 focus:border-gray-900 outline-none flex-1"
                    placeholder="Nome do item"
                    value={item.name}
                    onChange={(e) => update(item.instanceId, { name: e.target.value })}
                  />
                  <label className="text-xs text-gray-500 flex items-center gap-1">
                    Qtd
                    <input
                      type="number"
                      min={1}
                      className="w-14 border rounded px-2 py-1 text-xs"
                      value={item.quantity}
                      onChange={(e) => update(item.instanceId, { quantity: Math.max(1, Number(e.target.value) || 1) })}
                    />
                  </label>
                  <button onClick={() => remove(item.instanceId)} className="text-xs text-red-500 underline">Remover</button>
                </div>

                {hasInfo && (
                  <div className="bg-gray-50 border rounded p-2 text-xs text-gray-600 space-y-1">
                    {entry.damage && (
                      <div>
                        <strong>Dano:</strong> {formatWeaponDamage(entry.damage, physicalDamage)}
                        {entry.damageType && entry.damageType !== '—' && (
                          <> · <strong>Tipo:</strong> {entry.damageType}</>
                        )}
                      </div>
                    )}
                    {types.map((t) => (
                      <div key={t}><strong>{t}:</strong> {DAMAGE_TYPE_INFO[t]}</div>
                    ))}
                    {(entry.tags ?? []).map((tag) => (
                      <div key={tag}><strong>{tag}:</strong> {WEAPON_TAGS[tag] ?? ''}</div>
                    ))}
                    {entry.supply && (
                      <div><strong>Suprimento:</strong> {entry.supply}</div>
                    )}
                  </div>
                )}

                <div>
                  <label className="block text-xs text-gray-500 mb-1">Efeitos / descrição</label>
                  <textarea
                    className="w-full border rounded px-2 py-1 text-xs"
                    rows={2}
                    placeholder="O que o item faz, estado, observações"
                    value={item.notes}
                    onChange={(e) => update(item.instanceId, { notes: e.target.value })}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}