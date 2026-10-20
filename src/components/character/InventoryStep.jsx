// src/components/character/InventoryStep.jsx
import { ARSENAL, ARSENAL_GROUPS, ARSENAL_BY_ID, WEAPON_TAGS, DAMAGE_TYPE_INFO, getDamageTypes } from '../../data/arsenal';
import { formatWeaponDamage } from '../../logic/characterCalculations';
import {
  ARMOR_CATALOG, ARMOR_BY_ID, ARMOR_ERAS, ARMOR_CATEGORIES, ARMOR_CATEGORY_BY_ID,
  ARMOR_DAMAGE_TYPES, createArmorState, getResistantTypes,
} from '../../data/armor';

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
  function addArmor(entryId) {
    const entry = ARMOR_BY_ID[entryId];
    if (!entry) return;
    setCharacter((c) => ({
      ...c,
      inventory: [
        ...(c.inventory ?? []),
        { instanceId: `${Date.now()}-${Math.random()}`, catalogId: entry.id, name: entry.name, quantity: 1, notes: entry.description ?? '', armor: createArmorState(entry) },
      ],
    }));
  }
  function addCustomArmor() {
    setCharacter((c) => ({
      ...c,
      inventory: [
        ...(c.inventory ?? []),
        { instanceId: `${Date.now()}-${Math.random()}`, catalogId: null, name: '', quantity: 1, notes: '', armor: createArmorState(null) },
      ],
    }));
  }
  function updateArmor(instanceId, patch) {
    setCharacter((c) => ({
      ...c,
      inventory: (c.inventory ?? []).map((i) =>
        i.instanceId === instanceId && i.armor ? { ...i, armor: { ...i.armor, ...patch } } : i
      ),
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
        <select
          className="text-xs border rounded px-2 py-1.5"
          value=""
          onChange={(e) => {
            if (e.target.value) addArmor(e.target.value);
            e.target.value = '';
          }}
        >
          <option value="">+ Armadura ou escudo...</option>
          {ARMOR_ERAS.map((era) => (
            <optgroup key={era} label={era}>
              {ARMOR_CATALOG.filter((a) => a.era === era).map((a) => (
                <option key={a.id} value={a.id}>{a.name}</option>
              ))}
            </optgroup>
          ))}
        </select>
        <button onClick={addCustomArmor} className="text-xs px-3 py-1.5 rounded border bg-gray-50">+ Armadura personalizada</button>
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
                {item.armor && (
                  <div className="bg-gray-50 border rounded p-2 text-xs text-gray-600 space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <label className="flex items-center gap-1">
                        Categoria
                        <select
                          className="border rounded px-2 py-1"
                          value={item.armor.category}
                          onChange={(e) => {
                            const vigor = ARMOR_CATEGORY_BY_ID[e.target.value]?.vigor ?? 16;
                            updateArmor(item.instanceId, { category: e.target.value, vigorMax: vigor, vigorCurrent: vigor });
                          }}
                        >
                          {ARMOR_CATEGORIES.map((c) => (
                            <option key={c.id} value={c.id}>{c.label}</option>
                          ))}
                        </select>
                      </label>
                      <label className="flex items-center gap-1">
                        Vigor máx
                        <input
                          type="number"
                          min={1}
                          className="w-14 border rounded px-2 py-1"
                          value={item.armor.vigorMax}
                          onChange={(e) => updateArmor(item.instanceId, { vigorMax: Math.max(1, Number(e.target.value) || 1) })}
                        />
                      </label>
                      <label className="flex items-center gap-1">
                        Vigor atual
                        <input
                          type="number"
                          min={0}
                          className="w-14 border rounded px-2 py-1"
                          value={item.armor.vigorCurrent}
                          onChange={(e) => updateArmor(item.instanceId, { vigorCurrent: Math.max(0, Number(e.target.value) || 0) })}
                        />
                      </label>
                      <span>Limiar: {Math.ceil(item.armor.vigorMax / 2)}</span>
                    </div>
                    <div>
                      <strong>Fraca a:</strong>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {ARMOR_DAMAGE_TYPES.map((t) => {
                          const on = item.armor.weakTo.includes(t);
                          return (
                            <button
                              key={t}
                              type="button"
                              onClick={() =>
                                updateArmor(item.instanceId, { weakTo: on ? item.armor.weakTo.filter((x) => x !== t) : [...item.armor.weakTo, t] })
                              }
                              className={`px-2 py-1 rounded border ${on ? 'bg-gray-900 text-white' : 'hover:bg-white'}`}
                            >
                              {t}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                    <div><strong>Resistente a:</strong> {getResistantTypes(item.armor.weakTo).join(', ') || '—'}</div>
                    <div>Até o Limiar: absorvido, sem efeito. Acima do Limiar, até o Vigor atual: absorvido e −1 de Vigor. Acima do Vigor atual: o que ultrapassa passa a quem está protegido e a proteção perde 1 de Vigor. Vigor 0: quebrada.</div>
                    <div>Resistente a um Tipo: vale só a regra comum. Fraca a um Tipo: em armadura vestida, ao passar do Limiar o usuário sofre a Condição do Tipo em Grau Leve; em cobertura e estrutura, o Vigor perdido é o dano que passou do Limiar.</div>
                    <div>Penetrante: só o Limiar detém, vale para qualquer Tipo. Corrosivo: em Sucesso Bom ou Extremo, destrói a proteção.</div>
                  </div>
                )}

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