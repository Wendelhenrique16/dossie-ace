// src/components/character/MasterGrantsStep.jsx
import { SKILLS, groupSkillsByCategory } from '../../data/skills';
import { SCALE_LEVELS, SCALE_MAX, MAX_WEAK_CATEGORIES_FOR_PLAYER, getScaleLabel } from '../../data/scale';
import { DAMAGE_TYPE_INFO, WEAPON_TAGS } from '../../data/arsenal';
import { getScaleBudget } from '../../logic/masterMode';
import { formatPhysicalDamage } from '../../logic/characterCalculations';
import SpecialtyFields from './SpecialtyFields';

export default function MasterGrantsStep({ character, setCharacter, physicalDamage }) {
  const mm = character.masterMode ?? {};
  const skillScales = mm.skillScales ?? {};
  const categoryScales = mm.categoryScales ?? {};
  const naturalPassives = mm.naturalPassives ?? [];
  const naturalWeapons = mm.naturalWeapons ?? [];
  const budget = getScaleBudget(mm);
  const groups = groupSkillsByCategory(Object.keys(SKILLS));
  const weakCount = Object.keys(categoryScales).length;

  function updateMaster(updater) {
    setCharacter((c) => ({ ...c, masterMode: updater(c.masterMode ?? {}) }));
  }
  function setSkillScale(skillId, value) {
    updateMaster((m) => {
      const next = { ...(m.skillScales ?? {}) };
      if (value == null) delete next[skillId];
      else next[skillId] = value;
      return { ...m, skillScales: next };
    });
  }
  function setCategoryScale(categoryId, value) {
    updateMaster((m) => {
      const next = { ...(m.categoryScales ?? {}) };
      if (value === '') delete next[categoryId];
      else next[categoryId] = Number(value);
      return { ...m, categoryScales: next };
    });
  }

  function addPassive() {
    updateMaster((m) => ({
      ...m,
      naturalPassives: [
        ...(m.naturalPassives ?? []),
        { instanceId: `${Date.now()}-${Math.random()}`, name: '', scope: '', names: [], conditional: null, description: '' },
      ],
    }));
  }
  function updatePassive(instanceId, updater) {
    updateMaster((m) => ({
      ...m,
      naturalPassives: (m.naturalPassives ?? []).map((p) => (p.instanceId === instanceId ? updater(p) : p)),
    }));
  }
  function removePassive(instanceId) {
    updateMaster((m) => ({ ...m, naturalPassives: (m.naturalPassives ?? []).filter((p) => p.instanceId !== instanceId) }));
  }

  function addWeapon() {
    updateMaster((m) => ({
      ...m,
      naturalWeapons: [
        ...(m.naturalWeapons ?? []),
        { instanceId: `${Date.now()}-${Math.random()}`, name: '', damageType: 'Cortante', tags: [], notes: '' },
      ],
    }));
  }
  function updateWeapon(instanceId, patch) {
    updateMaster((m) => ({
      ...m,
      naturalWeapons: (m.naturalWeapons ?? []).map((w) => (w.instanceId === instanceId ? { ...w, ...patch } : w)),
    }));
  }
  function removeWeapon(instanceId) {
    updateMaster((m) => ({ ...m, naturalWeapons: (m.naturalWeapons ?? []).filter((w) => w.instanceId !== instanceId) }));
  }

  return (
    <section>
      <h2 className="text-xl font-semibold mb-2">Concessões do Mestre</h2>
      <p className="text-sm text-gray-500 mb-4">
        Escala, Passiva Natural e Armas Naturais dependem do Mestre. Use este passo apenas com a permissão dele.
      </p>

      {/* ESCALA */}
      <div className="mb-6">
        <h3 className="font-medium mb-1">Escala</h3>
        <p className="text-xs text-gray-500 mb-2">
          A Escala 1 é o padrão e não custa nada. A Escala 2 ou mais se compra com Modificadores de Escala, e cada
          Modificador sobe uma Perícia em 1 grau. A Escala multiplica o resultado final quando aquela capacidade é usada diretamente.
        </p>

        <div className="flex items-center gap-2 mb-2 text-sm flex-wrap">
          <label>Escala Geral</label>
          <select
            className="border rounded px-2 py-1 text-sm"
            value={budget.general}
            onChange={(e) => updateMaster((m) => ({ ...m, scaleGeneral: Number(e.target.value) }))}
          >
            {[1, 2, 3, 4, 5].map((n) => (
              <option key={n} value={n}>{n} — {getScaleLabel(n)}</option>
            ))}
          </select>
          <span className={`text-xs ${budget.remaining < 0 ? 'text-red-600' : 'text-gray-500'}`}>
            Modificadores de Escala: {budget.spent} de {budget.total}
            {budget.remaining < 0 && ' — passou do total'}
          </span>
        </div>

        <div className="space-y-1 mb-2">
          {Object.entries(skillScales).map(([skillId, value]) => (
            <div key={skillId} className="flex items-center justify-between text-xs border rounded px-2 py-1">
              <span>{SKILLS[skillId]?.label ?? skillId}</span>
              <div className="flex items-center gap-2">
                <select
                  className="border rounded px-2 py-1"
                  value={value}
                  onChange={(e) => setSkillScale(skillId, Number(e.target.value))}
                >
                  {SCALE_LEVELS.filter((l) => l.value >= 2 && l.value <= SCALE_MAX).map((l) => (
                    <option key={l.value} value={l.value}>Escala {l.value} ({l.label})</option>
                  ))}
                </select>
                <span className="text-gray-400">{value - 1} Mod.</span>
                <button onClick={() => setSkillScale(skillId, null)} className="text-red-500 underline">Remover</button>
              </div>
            </div>
          ))}
        </div>

        <select
          className="text-xs border rounded px-2 py-1.5 mb-4"
          value=""
          onChange={(e) => {
            if (e.target.value) setSkillScale(e.target.value, 2);
            e.target.value = '';
          }}
        >
          <option value="">+ Perícia com Escala...</option>
          {groups.map((g) => (
            <optgroup key={g.categoryId} label={g.label}>
              {g.skills.filter((id) => !(id in skillScales)).map((id) => (
                <option key={id} value={id}>{SKILLS[id]?.label ?? id}</option>
              ))}
            </optgroup>
          ))}
        </select>

        <h4 className="text-sm font-medium mb-1">Escala 0 ou −1 (categoria inteira)</h4>
        <p className="text-xs text-gray-500 mb-2">
          A fraqueza vale pra categoria de Perícias inteira, nunca pra uma Perícia isolada. Pra personagem de jogador, o limite é
          de {MAX_WEAK_CATEGORIES_FOR_PLAYER} categorias.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
          {groups.map((g) => (
            <div key={g.categoryId} className="flex items-center justify-between text-xs border rounded px-2 py-1">
              <span>{g.label}</span>
              <select
                className="border rounded px-2 py-1"
                value={categoryScales[g.categoryId] ?? ''}
                onChange={(e) => setCategoryScale(g.categoryId, e.target.value)}
              >
                <option value="">Padrão</option>
                <option value="0">Escala 0 (metade)</option>
                <option value="-1">Escala −1 (¼)</option>
              </select>
            </div>
          ))}
        </div>
        {weakCount > MAX_WEAK_CATEGORIES_FOR_PLAYER && (
          <p className="text-xs text-amber-600 mt-1">
            ⚠ O livro limita a {MAX_WEAK_CATEGORIES_FOR_PLAYER} categorias com Escala 0 ou −1 pra personagem de jogador (criatura e NPC não têm esse limite).
          </p>
        )}
      </div>

      {/* PASSIVAS NATURAIS */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-1">
          <h3 className="font-medium">Passivas Naturais ({naturalPassives.length})</h3>
          <button onClick={addPassive} className="text-xs px-2 py-1 rounded border bg-gray-50">+ Nova Passiva Natural</button>
        </div>
        <p className="text-xs text-gray-500 mb-2">
          Facilidade inata, sempre ligada, concedida pelo Mestre (um macaco que escala sem esforço, um elefante que empurra qualquer coisa
          no caminho). Não tem limite de pontos. Cada Efeito pesa no máximo 2, e Reverter e Multiplicar ficam de fora.
        </p>
        <div className="space-y-2">
          {naturalPassives.map((p) => (
            <SpecialtyFields
              key={p.instanceId}
              specialty={p}
              onChange={(updater) => updatePassive(p.instanceId, updater)}
              onRemove={() => removePassive(p.instanceId)}
            />
          ))}
        </div>
      </div>

      {/* ARMAS NATURAIS */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <h3 className="font-medium">Armas Naturais ({naturalWeapons.length})</h3>
          <button onClick={addWeapon} className="text-xs px-2 py-1 rounded border bg-gray-50">+ Nova Arma Natural</button>
        </div>
        <p className="text-xs text-gray-500 mb-2">
          Garra, presa, chifre, cauda, casco. Escolha o Tipo de Dano pela anatomia e as Tags que fizerem sentido. O ataque desarmado
          passa a rolar com esse Tipo de Dano e essas Tags.
        </p>
        <div className="space-y-2">
          {naturalWeapons.map((w) => (
            <div key={w.instanceId} className="border rounded p-3 space-y-2">
              <div className="flex items-center gap-2">
                <input
                  className="font-medium text-sm border-b border-transparent hover:border-gray-300 focus:border-gray-900 outline-none flex-1"
                  placeholder="Nome (ex: Garras)"
                  value={w.name}
                  onChange={(e) => updateWeapon(w.instanceId, { name: e.target.value })}
                />
                <select
                  className="border rounded px-2 py-1 text-xs"
                  value={w.damageType}
                  onChange={(e) => updateWeapon(w.instanceId, { damageType: e.target.value })}
                >
                  {Object.keys(DAMAGE_TYPE_INFO).map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
                <button onClick={() => removeWeapon(w.instanceId)} className="text-xs text-red-500 underline">Remover</button>
              </div>

              <div className="flex flex-wrap gap-1">
                {Object.keys(WEAPON_TAGS).map((tag) => {
                  const selected = w.tags.includes(tag);
                  return (
                    <button
                      key={tag}
                      type="button"
                      onClick={() =>
                        updateWeapon(w.instanceId, { tags: selected ? w.tags.filter((t) => t !== tag) : [...w.tags, tag] })
                      }
                      className={`px-2 py-1 rounded border text-xs ${selected ? 'bg-gray-900 text-white' : 'hover:bg-gray-50'}`}
                    >
                      {tag}
                    </button>
                  );
                })}
              </div>

              <div className="bg-gray-50 border rounded p-2 text-xs text-gray-600 space-y-1">
                <div><strong>Dano:</strong> {formatPhysicalDamage(physicalDamage)} (ataque desarmado) · <strong>Tipo:</strong> {w.damageType}</div>
                <div><strong>{w.damageType}:</strong> {DAMAGE_TYPE_INFO[w.damageType]}</div>
                {w.tags.map((tag) => (
                  <div key={tag}><strong>{tag}:</strong> {WEAPON_TAGS[tag]}</div>
                ))}
              </div>

              <textarea
                className="w-full border rounded px-2 py-1 text-xs"
                rows={2}
                placeholder="Descrição (opcional)"
                value={w.notes}
                onChange={(e) => updateWeapon(w.instanceId, { notes: e.target.value })}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}