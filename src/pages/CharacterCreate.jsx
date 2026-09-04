// src/pages/CharacterCreate.jsx
import { useState, useMemo, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { LIFE_STAGES } from '../data/lifeStages';
import { BACKGROUND_PACKAGES } from '../data/backgrounds';
import { SKILLS, ATTRIBUTES, groupSkillsByCategory, SKILL_LEVEL_TO_DICE } from '../data/skills';
import { listSelectableOccupations, calculateOccupationBonuses } from '../logic/occupationBonuses';
import { CLASSES, getArchetypesForClass } from '../data/classes';
import { CAMINHOS } from '../data/caminhos';
import { calculateClassBonuses } from '../logic/classBonuses';
import BureaucraticLoader from '../components/BureaucraticLoader';
import { saveCharacterToSupabase, loadCharacter } from '../logic/saveCharacter';
import { calculatePendingConsequences, CONSEQUENCE_TYPE_LABELS } from '../logic/backgroundConsequences';
import { rollRandomNegativeAspects, getManualNegativeAspectPool } from '../logic/aspectsSelection';
import { rollRandomTraumas, getManualTraumaPool } from '../logic/traumaSelection';
import { TRAUMAS } from '../data/traumas';
import { generateCharacterSheetText, downloadCharacterSheetText } from '../logic/exportCharacterText';
import { downloadCharacterSheetPdf } from '../logic/exportCharacterPdf';
import BackgroundModal from '../components/modals/BackgroundModal';
import AspectsStep from '../components/character/AspectsStep';
import { POSITIVE_ASPECTS, NEGATIVE_ASPECTS } from '../data/aspects';
import { normalizeCharacter } from '../logic/characterNormalizer';
import { rollExtraPackageSanityCost, checkBrokenSanityState, calculateVigor, getEffectiveMassCategory, calculateMaxSanity } from '../logic/characterCalculations';

function buildSteps(isAgent) {
  const steps = [
    { id: 'identity', label: '1. Detalhes do Personagem' },
    { id: 'lifeStage', label: '2. Fase da Vida' },
    { id: 'backgrounds', label: '3. Antecedentes' },
    { id: 'aspects', label: '4. Aspectos' },
    { id: 'customSkills', label: '5. Habilidades' },
    { id: 'occupation', label: '6. Ocupação' },
  ];
  if (isAgent) {
    steps.push({ id: 'classPath', label: '7. Classe & Caminho' });
    steps.push({ id: 'review', label: '8. Validar & Exportar' });
  } else {
    steps.push({ id: 'review', label: '7. Validar & Exportar' });
  }
  return steps;
}

export default function CharacterCreate({ userId }) {
  const navigate = useNavigate();
  const { id: routeCharacterId } = useParams(); // presente em /characters/:id, ausente em /characters/new
  const [currentCharacterId, setCurrentCharacterId] = useState(routeCharacterId ?? null);
  const [isLoadingExisting, setIsLoadingExisting] = useState(!!routeCharacterId);
  const [loadError, setLoadError] = useState(null);
  const [currentStep, setCurrentStep] = useState('identity');
  const [activeModalPackage, setActiveModalPackage] = useState(null);
  const [sanityWarning, setSanityWarning] = useState(null);
  const [pendingAction, setPendingAction] = useState(null); // null | 'pdf' | 'save' | 'txt'
  const [saveError, setSaveError] = useState(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
const [distributeQueue, setDistributeQueue] = useState([]); // fila de índices pendentes pro "Distribuir tudo"
  const [character, setCharacter] = useState(() => normalizeCharacter());

  const draftKey = `ace-draft-${routeCharacterId ?? 'new'}`;

  // Modo edição/recuperação: primeiro checa se existe um rascunho local
  // (RNF-03 — não perder progresso em caso de refresh/oscilação). Se tiver,
  // usa ele e nem busca no Supabase. Só busca do banco se não tiver rascunho.
  useEffect(() => {
    const savedDraft = localStorage.getItem(draftKey);
    if (savedDraft) {
      try {
        setCharacter(normalizeCharacter(JSON.parse(savedDraft)));
        setIsLoadingExisting(false);
        return;
      } catch {
        // rascunho corrompido — ignora e segue pro fluxo normal
      }
    }

    if (!routeCharacterId) {
      setIsLoadingExisting(false);
      return;
    }

    let cancelled = false;
    loadCharacter(routeCharacterId).then(({ data, error }) => {
      if (cancelled) return;
      if (error || !data) {
        setLoadError(error?.message || 'Ficha não encontrada.');
      } else {
        setCharacter(normalizeCharacter(data.data));
      }
      setIsLoadingExisting(false);
    });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [routeCharacterId]);

  // Autosave a cada 10s (RF-06). Usa um ref pra sempre salvar o estado mais
  // recente sem precisar recriar o interval a cada tecla digitada.
  const characterRef = useRef(character);
  useEffect(() => {
    characterRef.current = character;
  }, [character]);

  useEffect(() => {
    const interval = setInterval(() => {
      localStorage.setItem(draftKey, JSON.stringify(characterRef.current));
    }, 10000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [draftKey]);

  const isAgent = character.role === 'agente';
  const STEPS = useMemo(() => buildSteps(isAgent), [isAgent]);
  const stepIndex = STEPS.findIndex((s) => s.id === currentStep);
  const goNext = () => setCurrentStep(STEPS[Math.min(stepIndex + 1, STEPS.length - 1)].id);
  const goBack = () => setCurrentStep(STEPS[Math.max(stepIndex - 1, 0)].id);

  const lifeStage = character.lifeStageId ? LIFE_STAGES[character.lifeStageId] : null;
  const freePackages = lifeStage?.freePackages ?? 0;
  const purchasedCount = character.purchasedBackgrounds.length;
  const isExtraPackage = purchasedCount >= freePackages;

  // Cálculo da Sorte Restante com base na Cotação da Idade
  // (custo por aspecto varia conforme a Fase da Vida escolhida)
  const remainingLuck = useMemo(() => {
    if (!lifeStage) return 0;
    let luck = lifeStage.initialLuck;
    const posCount = character.aspects.chosenPositiveIds.length;
    const negCount = character.aspects.chosenNegativeIds.length;

    if (character.lifeStageId === 'jovem') {
      luck -= posCount * 3;
      luck += negCount * 1;
    } else if (character.lifeStageId === 'adulto') {
      luck -= posCount * 1;
      luck += negCount * 1;
    } else if (character.lifeStageId === 'maduro') {
      luck -= posCount * 1;
      luck += negCount * 3;
    }
    return luck;
  }, [lifeStage, character.lifeStageId, character.aspects]);

  const skillTotalsFromBackgrounds = useMemo(() => {
    const totals = {};
    character.purchasedBackgrounds.forEach(({ allocations }) => {
      Object.entries(allocations).forEach(([skillId, points]) => {
        totals[skillId] = (totals[skillId] || 0) + points;
      });
    });
    return totals;
  }, [character.purchasedBackgrounds]);

  // Atributos vêm exclusivamente do +2 fixo de cada pacote comprado
  // (por enquanto qualquer atributo pode ser escolhido em qualquer pacote —
  // falta a relação pacote->atributos permitidos).
  const attributeTotalsFromBackgrounds = useMemo(() => {
    const totals = Object.fromEntries(Object.keys(ATTRIBUTES).map((id) => [id, 0]));
    character.purchasedBackgrounds.forEach(({ attributeId }) => {
      if (attributeId) totals[attributeId] = (totals[attributeId] || 0) + 2;
    });
    return totals;
  }, [character.purchasedBackgrounds]);

  const occupationBonuses = useMemo(() => {
    const { primaryId, secondaryId, freeAttribute } = character.occupation;
    if (!primaryId || !secondaryId) return { skillBonuses: {}, attributeBonuses: {} };
    return calculateOccupationBonuses(primaryId, secondaryId, freeAttribute);
  }, [character.occupation]);

  const classBonuses = useMemo(() => {
    const { classId, archetypeId, weaponChoiceSkillId } = character.classPath;
    if (!isAgent || !classId || !archetypeId) {
      return { attributeBonuses: {}, skillBonuses: {}, specialtyPoints: 0, notes: [] };
    }
    return calculateClassBonuses(classId, archetypeId, weaponChoiceSkillId);
  }, [isAgent, character.classPath]);

  // finalSkillTotals = SÓ o nível "puro" das perícias (o que decide o dado).
  // Ocupação e Classe/Arquétipo dão bônus no RESULTADO da rolagem, não no
  // nível — não podem entrar aqui, ou o dado mostrado fica errado.
  const finalSkillTotals = skillTotalsFromBackgrounds;

  // Bônus de resultado (somam depois de rolar, nunca mudam o dado) —
  // Ocupação (+5/+3) e Classe/Arquétipo (+2/+3) funcionam da mesma forma.
  const skillResultBonuses = useMemo(() => {
    const bonuses = {};
    Object.entries(occupationBonuses.skillBonuses).forEach(([skillId, bonus]) => {
      bonuses[skillId] = (bonuses[skillId] || 0) + bonus;
    });
    Object.entries(classBonuses.skillBonuses).forEach(([skillId, bonus]) => {
      bonuses[skillId] = (bonuses[skillId] || 0) + bonus;
    });
    return bonuses;
  }, [occupationBonuses, classBonuses]);

  const finalAttributeTotals = useMemo(() => {
    const totals = { ...attributeTotalsFromBackgrounds };
    Object.entries(occupationBonuses.attributeBonuses).forEach(([attrId, bonus]) => {
      totals[attrId] = (totals[attrId] || 0) + bonus;
    });
    Object.entries(classBonuses.attributeBonuses).forEach(([attrId, bonus]) => {
      totals[attrId] = (totals[attrId] || 0) + bonus;
    });
    return totals;
  }, [attributeTotalsFromBackgrounds, occupationBonuses, classBonuses]);

  const isBroken = checkBrokenSanityState(purchasedCount);

  const pendingConsequences = useMemo(() => {
    if (!character.lifeStageId) return [];
    return calculatePendingConsequences(character.lifeStageId, purchasedCount);
  }, [character.lifeStageId, purchasedCount]);

  // Quantos Aspectos Negativos Graves o personagem precisa ter (por excesso
  // de pacotes). Usa o catálogo normal de Aspectos Negativos — não existe
  // uma lista separada de "graves", como confirmado.
  const graveAspectsNeeded = pendingConsequences
    .filter((slot) => slot.type === 'aspecto_negativo_grave')
    .reduce((sum, slot) => sum + slot.count, 0);

  const [swappingGraveIndex, setSwappingGraveIndex] = useState(null);

  function allSelectedAspectIds(excludeExcess = false) {
    return [
      ...character.aspects.mandatoryIds,
      ...character.aspects.chosenPositiveIds,
      ...character.aspects.chosenNegativeIds,
      ...(excludeExcess ? [] : character.aspects.excessNegativeIds),
    ];
  }

  function handleRollGraveAspects() {
    const missing = graveAspectsNeeded - character.aspects.excessNegativeIds.length;
    if (missing <= 0) return;
    const rolled = rollRandomNegativeAspects(missing, allSelectedAspectIds());
    setCharacter((c) => ({
      ...c,
      aspects: {
        ...c.aspects,
        excessNegativeIds: [...c.aspects.excessNegativeIds, ...rolled.map((a) => a.id)],
      },
    }));
  }

  function handleSwapGraveAspect(index, newId) {
    setCharacter((c) => {
      const ids = [...c.aspects.excessNegativeIds];
      ids[index] = newId;
      return { ...c, aspects: { ...c.aspects, excessNegativeIds: ids } };
    });
    setSwappingGraveIndex(null);
  }

  // Trauma (Fobia/Mania) obrigatório — Jovem, 1º pacote extra
  const traumaNeeded = pendingConsequences
    .filter((slot) => slot.type === 'vicio_ou_mania')
    .reduce((sum, slot) => sum + slot.count, 0);

  const [swappingTraumaIndex, setSwappingTraumaIndex] = useState(null);

  function handleRollTrauma() {
    const missing = traumaNeeded - character.traumaIds.length;
    if (missing <= 0) return;
    const rolled = rollRandomTraumas(missing, character.traumaIds);
    setCharacter((c) => ({
      ...c,
      traumaIds: [...c.traumaIds, ...rolled.map((t) => t.id)],
    }));
  }

  function handleSwapTrauma(index, newId) {
    setCharacter((c) => {
      const ids = [...c.traumaIds];
      ids[index] = newId;
      return { ...c, traumaIds: ids };
    });
    setSwappingTraumaIndex(null);
  }

  // Vigor oficial: dado máximo de Resistência + dado máximo de Constituição
  const vigor = useMemo(() => {
    return calculateVigor(finalSkillTotals.resistencia || 0, finalSkillTotals.constituicao || 0);
  }, [finalSkillTotals]);
const massInfo = useMemo(() => {
  if (!character.weightKg) return null;
  return getEffectiveMassCategory(character.weightKg, {
    forcaLevel: finalSkillTotals.forca || 0,
    constituicaoLevel: finalSkillTotals.constituicao || 0,
    resistenciaLevel: finalSkillTotals.resistencia || 0,
  });
}, [character.weightKg, finalSkillTotals]);
const maxSanity = useMemo(
  () => calculateMaxSanity(character.purchasedBackgrounds, freePackages),
  [character.purchasedBackgrounds, freePackages]
);

function handleSelectLifeStage(id) {
  setCharacter((c) => ({
    ...c,
    lifeStageId: id,
    purchasedBackgrounds: [],
    aspects: { mandatoryIds: [], chosenPositiveIds: [], chosenNegativeIds: [], excessNegativeIds: [] },
    traumaIds: [],
  }));
  setSanityWarning(null);
}

function handlePurchaseBackground(packageId) {
  setCharacter((c) => {
    const isExtra = c.purchasedBackgrounds.length >= freePackages;
    const sanityCost = isExtra ? rollExtraPackageSanityCost() : 0;
    setSanityWarning(isExtra ? `Pacote extra adicionado: -${sanityCost} de Sanidade Máxima.` : null);
    return {
      ...c,
      purchasedBackgrounds: [
        ...c.purchasedBackgrounds,
        { packageId, allocations: {}, attributeId: null, sanityCost },
      ],
    };
  });
}

function handleRemoveBackground(index) {
  setCharacter((c) => {
    const updated = [...c.purchasedBackgrounds];
    updated.splice(index, 1);
    return { ...c, purchasedBackgrounds: updated };
  });
  setSanityWarning(null);
}

function openDistributionModal(instanceIndex) {
  const entry = character.purchasedBackgrounds[instanceIndex];
  setActiveModalPackage({ packageId: entry.packageId, instanceIndex });
}

function handleDistributeAllPending() {
  const pendingIndices = character.purchasedBackgrounds
    .map((entry, index) => ({ entry, index }))
    .filter(({ entry }) => Object.keys(entry.allocations).length === 0)
    .map(({ index }) => index);
  if (pendingIndices.length === 0) return;
  setDistributeQueue(pendingIndices.slice(1));
  openDistributionModal(pendingIndices[0]);
}

function handleConfirmBackground({ allocations, attributeId }) {
  setCharacter((c) => {
    const updated = [...c.purchasedBackgrounds];
    updated[activeModalPackage.instanceIndex] = {
      ...updated[activeModalPackage.instanceIndex],
      allocations,
      attributeId,
    };
    return { ...c, purchasedBackgrounds: updated };
  });

  if (distributeQueue.length > 0) {
    const [nextIndex, ...rest] = distributeQueue;
    setDistributeQueue(rest);
    setActiveModalPackage({
      packageId: character.purchasedBackgrounds[nextIndex].packageId,
      instanceIndex: nextIndex,
    });
  } else {
    setActiveModalPackage(null);
  }
}

function handleCloseModal() {
  setDistributeQueue([]); // cancelar no meio da fila interrompe o "distribuir tudo"
  setActiveModalPackage(null);
}

  function handleAddCustomSkill() {
    setCharacter((c) => ({
      ...c,
      customSkills: [
        ...c.customSkills,
        { name: '', skillId: '', cost: '1_vigor', effectType: 'facilitar', narrative: '' },
      ],
    }));
  }

  function handleExportPdf() {
    // UC-04: a "burocracia" roda antes da geração real do PDF.
    setPendingAction('pdf');
  }

  function handleSaveCharacter() {
    setSaveError(null);
    setSaveSuccess(false);
    setPendingAction('save');
  }

  function handleDownloadTxt() {
    setPendingAction('txt');
  }

  async function handleLoaderComplete() {
    const action = pendingAction;
    setPendingAction(null);

const exportParams = {
  character,
  lifeStage,
  finalAttributeTotals,
  finalSkillTotals,
  skillResultBonuses,
  vigor,
  maxSanity, // novo
  remainingLuck,
  classBonuses,
  isAgent,
};

    if (action === 'pdf') {
      // Básico e sem estilização por enquanto — mesma estrutura da ficha,
      // só que já em PDF de verdade (melhor pra quem usa pelo celular).
      downloadCharacterSheetPdf(exportParams, `${character.name || 'ficha-ace'}.pdf`);
      return;
    }

    if (action === 'txt') {
      const text = generateCharacterSheetText(exportParams);
      downloadCharacterSheetText(text, `${character.name || 'ficha-ace'}.txt`);
      return;
    }

    if (action === 'save') {
      if (!userId) {
        setSaveError('Você precisa estar logado para salvar a ficha.');
        return;
      }
      const { data, error } = await saveCharacterToSupabase(userId, character, currentCharacterId);
      if (error) {
        setSaveError(error.message);
      } else {
        setSaveSuccess(true);
        localStorage.removeItem(draftKey);
        // Primeira vez salvando (era INSERT): guarda o id pra próximos
        // saves virarem UPDATE em vez de criar fichas duplicadas, e troca
        // a URL pra /characters/:id sem recarregar a página.
        if (!currentCharacterId && data?.id) {
          setCurrentCharacterId(data.id);
          navigate(`/characters/${data.id}`, { replace: true });
        }
      }
    }
  }

  if (isLoadingExisting) {
    return <div className="theme-root-loading-placeholder p-6 text-sm opacity-70">Carregando ficha...</div>;
  }

  if (loadError) {
    return (
      <div className="p-6">
        <p className="text-sm text-red-500 mb-4">{loadError}</p>
        <button onClick={() => navigate('/characters')} className="px-4 py-2 border rounded text-sm">
          ← Voltar pra lista
        </button>
      </div>
    );
  }

return (
    <div className="flex flex-col md:flex-row h-full">
      {/* Navegação lateral no Desktop / Barra deslizável no Mobile */}
      <aside className="w-full md:w-60 border-b md:border-b-0 md:border-r bg-white p-3 md:p-4 shrink-0">
        <button onClick={() => navigate('/dashboard')} className="text-xs text-gray-400 hover:text-gray-600 mb-2 block">
          ← Voltar ao Dashboard
        </button>
        <h1 className="text-sm font-semibold text-gray-400 uppercase mb-2 hidden md:block">Ficha ACE</h1>
        
        {/* Contêiner de passos: scroll horizontal no mobile, vertical no desktop */}
        <div className="flex flex-row md:flex-col gap-1 overflow-x-auto md:overflow-visible pb-1 md:pb-0 no-scrollbar">
          {STEPS.map((step, i) => (
            <button
              key={step.id}
              onClick={() => setCurrentStep(step.id)}
              className={`whitespace-nowrap md:whitespace-normal text-left px-3 py-1.5 md:py-2 rounded text-xs md:text-sm shrink-0 md:w-full ${
                step.id === currentStep
                  ? 'bg-gray-900 text-white'
                  : i < stepIndex
                  ? 'text-gray-700 hover:bg-gray-100'
                  : 'text-gray-400 hover:bg-gray-100'
              }`}
            >
              {step.label}
            </button>
          ))}
        </div>
      </aside>

      {/* Conteúdo principal com scroll independente e padding reduzido no mobile */}
      <main className="flex-1 p-4 md:p-6 max-w-2xl overflow-y-auto">
        {/* Step 1: Detalhes */}
        {currentStep === 'identity' && (
          <section>
            <h2 className="text-xl font-semibold mb-4">Detalhes do Personagem</h2>
            <label className="block text-sm mb-1">Nome do personagem</label>
            <input
              className="w-full border rounded px-3 py-2 mb-4"
              value={character.name}
              onChange={(e) => setCharacter((c) => ({ ...c, name: e.target.value }))}
            />
            <label className="block text-sm mb-1">Conceito</label>
            <textarea
              className="w-full border rounded px-3 py-2 mb-4"
              rows={3}
              value={character.concept}
              onChange={(e) => setCharacter((c) => ({ ...c, concept: e.target.value }))}
              placeholder="Quem ele é no mundo de ACE."
            />
            <label className="block text-sm mb-1">Papel</label>
            <div className="flex gap-2">
              {['civil', 'agente'].map((role) => (
                <button
                  key={role}
                  onClick={() => setCharacter((c) => ({ ...c, role }))}
                  className={`px-4 py-2 rounded border text-sm capitalize ${
                    character.role === role ? 'bg-gray-900 text-white' : ''
                  }`}
                >
                  {role}
                </button>
              ))}
            </div>
            <label className="block text-sm mb-1 mt-4">Peso (kg)</label>
<input
  type="number"
  className="w-full border rounded px-3 py-2"
  value={character.weightKg ?? ''}
  onChange={(e) =>
    setCharacter((c) => ({ ...c, weightKg: e.target.value ? Number(e.target.value) : null }))
  }
  placeholder="Ex: 78"
/>
          </section>
        )}

        {/* Step 2: Fase da Vida */}
        {currentStep === 'lifeStage' && (
          <section>
            <h2 className="text-xl font-semibold mb-2">Fase da Vida</h2>
            <p className="text-sm text-gray-500 mb-4">
              Define o saldo de Sorte Inicial, a quantidade de pacotes de antecedentes gratuitos e
              os aspectos obrigatórios de idade.
            </p>
            <div className="grid grid-cols-1 gap-3">
              {Object.values(LIFE_STAGES).map((stage) => {
                const selected = character.lifeStageId === stage.id;
                return (
                  <button
                    key={stage.id}
                    onClick={() => handleSelectLifeStage(stage.id)}
                    className={`text-left border rounded p-3 ${selected ? 'border-gray-900 bg-gray-50' : ''}`}
                  >
                    <div className="font-medium">{stage.label}</div>
                    {selected && (
                      <div className="text-sm text-gray-600 mt-1">
                        Sorte Inicial: <strong>{stage.initialLuck}</strong> · Pacotes Grátis:{' '}
                        <strong>{stage.freePackages}</strong>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </section>
        )}

        {/* Step 3: Antecedentes */}
        {currentStep === 'backgrounds' && (
          <section>
            <h2 className="text-xl font-semibold mb-2">Antecedentes & Atributos</h2>
            {!lifeStage ? (
              <p className="text-sm text-gray-500">Selecione a Fase da Vida primeiro.</p>
            ) : (
              <>
                <div className="mb-6">
                  <h3 className="font-medium mb-2">Atributos</h3>
                  <p className="text-xs text-gray-500 mb-2">
                    Cada pacote comprado concede +2 fixo a um Atributo, escolhido no próprio modal
                    de distribuição.
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    {Object.entries(ATTRIBUTES).map(([id, attr]) => (
                      <div key={id} className="flex items-center justify-between text-sm">
                        <span>{attr.label}</span>
                        <strong>{attributeTotalsFromBackgrounds[id] ?? 0}</strong>
                      </div>
                    ))}
                  </div>
                </div>

                <h3 className="font-medium mb-2">Pacotes de Antecedentes</h3>
                <p className="text-sm text-gray-500 mb-3">
                  {purchasedCount} de {freePackages} pacotes gratuitos utilizados.
                  {isExtraPackage && <span className="text-amber-600"> Custo em Sanidade (1d6 + 6) ativo.</span>}
                </p>

                {sanityWarning && (
                  <div className="mb-3 text-sm px-3 py-2 rounded bg-amber-50 text-amber-700 border border-amber-200">
                    ⚠ {sanityWarning}
                  </div>
                )}

<div className="grid grid-cols-1 gap-2 mb-4">
  {Object.values(BACKGROUND_PACKAGES).map((pkg) => (
    <button
      key={pkg.id}
      onClick={() => handlePurchaseBackground(pkg.id)}
      className="text-left border rounded p-3 hover:bg-gray-50"
    >
      <div className="font-medium">{pkg.label}</div>
      <div className="text-sm text-gray-500">{pkg.pointsPerPurchase} aumentos por compra — clique para comprar</div>
    </button>
  ))}
</div>

{character.purchasedBackgrounds.length > 0 && (
  <div className="mb-4">
    <div className="flex items-center justify-between mb-2">
      <h3 className="font-medium">Pacotes Comprados</h3>
      {character.purchasedBackgrounds.some((e) => Object.keys(e.allocations).length === 0) && (
        <button onClick={handleDistributeAllPending} className="text-xs px-3 py-1.5 rounded border bg-gray-50">
          Distribuir tudo pendente
        </button>
      )}
    </div>
    <div className="space-y-2">
      {character.purchasedBackgrounds.map((entry, index) => {
        const pkg = BACKGROUND_PACKAGES[entry.packageId];
        const isDistributed = Object.keys(entry.allocations).length > 0;
        return (
          <div key={index} className="border rounded p-3 flex items-center justify-between">
            <div>
              <div className="font-medium text-sm">{pkg.label} #{index + 1}</div>
              <div className="text-xs text-gray-400">
                {isDistributed ? '✓ Distribuído' : 'Pendente de distribuição'}
                {index >= freePackages && ` · Extra (-${entry.sanityCost} Sanidade)`}
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => openDistributionModal(index)} className="text-xs px-2 py-1 rounded border">
                {isDistributed ? 'Editar' : 'Distribuir'}
              </button>
              <button onClick={() => handleRemoveBackground(index)} className="text-xs px-2 py-1 rounded border text-red-500">
                Remover
              </button>
            </div>
          </div>
        );
      })}
    </div>
  </div>
)}

                <div className="text-sm border-t pt-3">
Sanidade Máxima Atual: <strong>{maxSanity}</strong>
                  {isBroken && (
                    <div className="text-red-600 mt-1 font-medium">
                      A Beira da Loucura — Sanidade travada em 1 permanente.
                    </div>
                  )}
                </div>

                {pendingConsequences.length > 0 && (
                  <div className="text-sm border-t pt-3 mt-3">
                    <div className="font-medium mb-2">Consequências</div>

                    {graveAspectsNeeded > 0 && (
                      <div className="border rounded p-2 mb-2">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">Aspecto Negativo Grave</span>
                          <span className="text-xs text-gray-400">
                            {character.aspects.excessNegativeIds.length}/{graveAspectsNeeded}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          Sorteado do catálogo normal de Aspectos Negativos (não existe lista própria de
                          "graves").
                        </p>

                        {character.aspects.excessNegativeIds.length < graveAspectsNeeded && (
                          <button
                            onClick={handleRollGraveAspects}
                            className="mt-2 text-xs px-2 py-1 rounded border"
                          >
                            Sortear {graveAspectsNeeded - character.aspects.excessNegativeIds.length}{' '}
                            pendente(s)
                          </button>
                        )}

                        {character.aspects.excessNegativeIds.length > 0 && (
                          <div className="mt-2 space-y-1">
                            {character.aspects.excessNegativeIds.map((id, i) => {
                              const aspect = NEGATIVE_ASPECTS.find((a) => a.id === id);
                              return (
                                <div key={i} className="flex items-center justify-between text-xs">
                                  {swappingGraveIndex === i ? (
                                    <select
                                      autoFocus
                                      className="w-full border rounded px-2 py-1"
                                      defaultValue=""
                                      onChange={(e) => e.target.value && handleSwapGraveAspect(i, e.target.value)}
                                    >
                                      <option value="">Escolher manualmente...</option>
                                      {getManualNegativeAspectPool(allSelectedAspectIds()).map((opt) => (
                                        <option key={opt.id} value={opt.id}>
                                          {opt.label}
                                        </option>
                                      ))}
                                    </select>
                                  ) : (
                                    <>
                                      <span>{aspect?.label ?? id}</span>
                                      <button
                                        onClick={() => setSwappingGraveIndex(i)}
                                        className="text-gray-500 underline"
                                      >
                                        trocar
                                      </button>
                                    </>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    )}

                    {traumaNeeded > 0 && (
                      <div className="border rounded p-2 mb-2">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">Trauma (Fobia ou Mania)</span>
                          <span className="text-xs text-gray-400">
                            {character.traumaIds.length}/{traumaNeeded}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          Sorteado do catálogo de Traumas (une Fobias e Manias numa lista só).
                        </p>

                        {character.traumaIds.length < traumaNeeded && (
                          <button onClick={handleRollTrauma} className="mt-2 text-xs px-2 py-1 rounded border">
                            Sortear {traumaNeeded - character.traumaIds.length} pendente(s)
                          </button>
                        )}

                        {character.traumaIds.length > 0 && (
                          <div className="mt-2 space-y-1">
                            {character.traumaIds.map((id, i) => {
                              const trauma = TRAUMAS.find((t) => t.id === id);
                              return (
                                <div key={i} className="flex items-center justify-between text-xs">
                                  {swappingTraumaIndex === i ? (
                                    <select
                                      autoFocus
                                      className="w-full border rounded px-2 py-1"
                                      defaultValue=""
                                      onChange={(e) => e.target.value && handleSwapTrauma(i, e.target.value)}
                                    >
                                      <option value="">Escolher manualmente...</option>
                                      {getManualTraumaPool(character.traumaIds).map((opt) => (
                                        <option key={opt.id} value={opt.id}>
                                          {opt.label}
                                        </option>
                                      ))}
                                    </select>
                                  ) : (
                                    <>
                                      <span>
                                        {trauma?.label ?? id}
                                        {trauma?.description ? ` — ${trauma.description}` : ''}
                                      </span>
                                      <button
                                        onClick={() => setSwappingTraumaIndex(i)}
                                        className="text-gray-500 underline whitespace-nowrap ml-2"
                                      >
                                        trocar
                                      </button>
                                    </>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    )}

                    {pendingConsequences.filter(
                      (s) => s.type !== 'aspecto_negativo_grave' && s.type !== 'vicio_ou_mania'
                    ).length > 0 && (
                      <>
                        <p className="text-xs text-gray-400 mb-2">
                          Catálogo ainda não implementado pra esse tipo — só o placeholder por enquanto.
                        </p>
                        <div className="space-y-2">
                          {pendingConsequences
                            .filter((slot) => slot.type !== 'aspecto_negativo_grave' && slot.type !== 'vicio_ou_mania')
                            .map((slot, i) => (
                              <div key={i} className="border rounded p-2">
                                <div className="flex items-center justify-between">
                                  <span className="font-medium">
                                    {CONSEQUENCE_TYPE_LABELS[slot.type] ?? slot.type}
                                  </span>
                                  <span className="text-xs text-gray-400">×{slot.count}</span>
                                </div>
                                <p className="text-xs text-gray-500 mt-1">{slot.description}</p>
                                <button
                                  disabled
                                  className="mt-2 text-xs px-2 py-1 rounded border opacity-40 cursor-not-allowed"
                                >
                                  Selecionar (catálogo em breve)
                                </button>
                              </div>
                            ))}
                        </div>
                      </>
                    )}
                  </div>
                )}
              </>
            )}

 
          </section>
        )}
{activeModalPackage && (
  <BackgroundModal
    packageId={activeModalPackage.packageId}
    purchaseNumber={
      character.purchasedBackgrounds
        .slice(0, activeModalPackage.instanceIndex + 1)
        .filter((p) => p.packageId === activeModalPackage.packageId).length
    }
    initialAllocations={character.purchasedBackgrounds[activeModalPackage.instanceIndex]?.allocations}
    initialAttributeId={character.purchasedBackgrounds[activeModalPackage.instanceIndex]?.attributeId}
    onConfirm={handleConfirmBackground}
    onClose={handleCloseModal}
  />
)}
        {/* Step 4: Aspectos (catálogo real + Sorte) */}
        {currentStep === 'aspects' && (
          <AspectsStep
            character={character}
            setCharacter={setCharacter}
            lifeStageId={character.lifeStageId}
            remainingLuck={remainingLuck}
          />
        )}

        {/* Step 5: Habilidades Customizadas */}
        {currentStep === 'customSkills' && (
          <section>
            <h2 className="text-xl font-semibold mb-2">Habilidades do Personagem</h2>
            <p className="text-sm text-gray-500 mb-4">
              Manobras e especializações técnicas ativas baseadas em Perícias.
            </p>

            {character.customSkills.map((sk, index) => (
              <div key={index} className="border rounded p-3 mb-3 bg-white space-y-2 text-sm">
                <input
                  placeholder="Nome da Habilidade (ex: Corte de Machado)"
                  className="w-full border rounded px-2 py-1 font-medium"
                  value={sk.name}
                  onChange={(e) => {
                    const val = e.target.value;
                    setCharacter((c) => {
                      const updated = [...c.customSkills];
                      updated[index].name = val;
                      return { ...c, customSkills: updated };
                    });
                  }}
                />
                <div className="grid grid-cols-3 gap-2">
                  <select
                    className="border rounded px-2 py-1"
                    value={sk.cost}
                    onChange={(e) => {
                      const val = e.target.value;
                      setCharacter((c) => {
                        const updated = [...c.customSkills];
                        updated[index].cost = val;
                        return { ...c, customSkills: updated };
                      });
                    }}
                  >
                    <option value="1_vigor">1 de Vigor</option>
                    <option value="2_vigor">2 de Vigor</option>
                    <option value="1_sanidade">1 de Sanidade</option>
                    <option value="reacao">Reação</option>
                  </select>

                  <select
                    className="border rounded px-2 py-1"
                    value={sk.effectType}
                    onChange={(e) => {
                      const val = e.target.value;
                      setCharacter((c) => {
                        const updated = [...c.customSkills];
                        updated[index].effectType = val;
                        return { ...c, customSkills: updated };
                      });
                    }}
                  >
                    <option value="facilitar">Facilitar Cenário</option>
                    <option value="tempo">Fazer Mais Rápido</option>
                    <option value="rendimento">Aumentar Resultado</option>
                    <option value="falha">Salvar em Falha</option>
                  </select>

                  <input
                    placeholder="Perícia (ex: Armas Brancas)"
                    className="border rounded px-2 py-1"
                    value={sk.skillId}
                    onChange={(e) => {
                      const val = e.target.value;
                      setCharacter((c) => {
                        const updated = [...c.customSkills];
                        updated[index].skillId = val;
                        return { ...c, customSkills: updated };
                      });
                    }}
                  />
                </div>
                <textarea
                  placeholder="Descrição da interpretação / motivo da habilidade..."
                  className="w-full border rounded px-2 py-1 text-xs"
                  rows={2}
                  value={sk.narrative}
                  onChange={(e) => {
                    const val = e.target.value;
                    setCharacter((c) => {
                      const updated = [...c.customSkills];
                      updated[index].narrative = val;
                      return { ...c, customSkills: updated };
                    });
                  }}
                />
              </div>
            ))}

            <button
              onClick={handleAddCustomSkill}
              className="px-3 py-2 rounded bg-gray-200 text-sm hover:bg-gray-300"
            >
              + Adicionar Habilidade
            </button>
          </section>
        )}

        {/* Step 6: Ocupação */}
        {currentStep === 'occupation' && (
          <section>
            <h2 className="text-xl font-semibold mb-4">Ocupação</h2>
            <label className="block text-sm mb-1">Categoria Primária (+5 Perícias / +2 Atributo)</label>
            <select
              className="w-full border rounded px-3 py-2 mb-3 text-sm"
              value={character.occupation.primaryId ?? ''}
              onChange={(e) =>
                setCharacter((c) => ({
                  ...c,
                  occupation: { ...c.occupation, primaryId: e.target.value || null },
                }))
              }
            >
              <option value="">Selecione...</option>
              {listSelectableOccupations().map((occ) => (
                <option key={occ.id} value={occ.id}>
                  {occ.label}
                </option>
              ))}
            </select>

            <label className="block text-sm mb-1">Categoria Secundária (+3 Perícias / +1 Atributo Livre)</label>
            <select
              className="w-full border rounded px-3 py-2 mb-3 text-sm"
              value={character.occupation.secondaryId ?? ''}
              onChange={(e) =>
                setCharacter((c) => ({
                  ...c,
                  occupation: { ...c.occupation, secondaryId: e.target.value || null },
                }))
              }
            >
              <option value="">Selecione...</option>
              {listSelectableOccupations().map((occ) => (
                <option key={occ.id} value={occ.id}>
                  {occ.label}
                </option>
              ))}
            </select>

            <label className="block text-sm mb-1">Atributo Livre (bônus da Secundária)</label>
            <select
              className="w-full border rounded px-3 py-2 text-sm"
              value={character.occupation.freeAttribute ?? ''}
              onChange={(e) =>
                setCharacter((c) => ({
                  ...c,
                  occupation: { ...c.occupation, freeAttribute: e.target.value || null },
                }))
              }
            >
              <option value="">Selecione...</option>
              {Object.entries(ATTRIBUTES).map(([id, attr]) => (
                <option key={id} value={id}>
                  {attr.label}
                </option>
              ))}
            </select>
          </section>
        )}

        {/* Step 7: Classe & Caminho (só Agente) */}
        {currentStep === 'classPath' && (
          <section>
            <h2 className="text-xl font-semibold mb-2">Classe & Caminho</h2>
            <p className="text-sm text-gray-500 mb-4">Exclusivo para Agentes da ACE (Rank D+).</p>

            {/* Classe */}
            <label className="block text-sm mb-1">Classe</label>
            <div className="grid grid-cols-1 gap-2 mb-4">
              {Object.values(CLASSES).map((cls) => (
                <button
                  key={cls.id}
                  onClick={() =>
                    setCharacter((c) => ({
                      ...c,
                      classPath: {
                        classId: cls.id,
                        archetypeId: null,
                        weaponChoiceSkillId: null,
                        caminhoId: c.classPath.caminhoId,
                      },
                    }))
                  }
                  className={`text-left border rounded p-3 ${
                    character.classPath.classId === cls.id ? 'border-gray-900 bg-gray-50' : 'hover:bg-gray-50'
                  }`}
                >
                  <div className="font-medium">{cls.label}</div>
                  <div className="text-xs text-gray-400 italic">
                    {cls.description || '(descrição a definir)'}
                  </div>
                </button>
              ))}
            </div>

            {/* Escolha de perícia condicional (só Lutador, por enquanto) */}
            {character.classPath.classId &&
              CLASSES[character.classPath.classId].classBonus.skillChoice && (
                <div className="mb-4">
                  <label className="block text-sm mb-1">
                    Perícia do bônus de Classe (escolha 1)
                  </label>
                  <select
                    className="w-full border rounded px-3 py-2 text-sm"
                    value={character.classPath.weaponChoiceSkillId ?? ''}
                    onChange={(e) =>
                      setCharacter((c) => ({
                        ...c,
                        classPath: { ...c.classPath, weaponChoiceSkillId: e.target.value || null },
                      }))
                    }
                  >
                    <option value="">Selecione...</option>
                    {CLASSES[character.classPath.classId].classBonus.skillChoice.options.map(
                      (skillId) => (
                        <option key={skillId} value={skillId}>
                          {SKILLS[skillId]?.label ?? skillId}
                        </option>
                      )
                    )}
                  </select>
                </div>
              )}

            {/* Arquétipo */}
            {character.classPath.classId && (
              <>
                <label className="block text-sm mb-1">Arquétipo</label>
                <div className="grid grid-cols-1 gap-2 mb-4">
                  {getArchetypesForClass(character.classPath.classId).map((arch) => (
                    <button
                      key={arch.id}
                      onClick={() =>
                        setCharacter((c) => ({
                          ...c,
                          classPath: { ...c.classPath, archetypeId: arch.id },
                        }))
                      }
                      className={`text-left border rounded p-3 ${
                        character.classPath.archetypeId === arch.id
                          ? 'border-gray-900 bg-gray-50'
                          : 'hover:bg-gray-50'
                      }`}
                    >
                      <div className="font-medium">{arch.label}</div>
                      <div className="text-xs text-gray-400 italic">
                        {arch.description || '(descrição a definir)'}
                      </div>
                    </button>
                  ))}
                </div>
              </>
            )}

            {/* Caminho */}
            <label className="block text-sm mb-1">Caminho</label>
            <div className="grid grid-cols-1 gap-2">
              {Object.values(CAMINHOS).map((caminho) => (
                <button
                  key={caminho.id}
                  onClick={() =>
                    setCharacter((c) => ({
                      ...c,
                      classPath: { ...c.classPath, caminhoId: caminho.id },
                    }))
                  }
                  className={`text-left border rounded p-3 ${
                    character.classPath.caminhoId === caminho.id
                      ? 'border-gray-900 bg-gray-50'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <div className="font-medium">{caminho.label}</div>
                  <div className="text-xs text-gray-400 italic mb-1">
                    {caminho.description || '(descrição a definir)'}
                  </div>
                  <div className="text-xs text-gray-500">{caminho.vantagem}</div>
                </button>
              ))}
            </div>
          </section>
        )}

        {/* Step Final: Validar */}
        {currentStep === 'review' && (
          <section>
            <h2 className="text-xl font-semibold mb-4">Validar e Exportar Ficha</h2>
            <div className="space-y-4 text-sm">
              <div>
                <strong>{character.name || '(sem nome)'}</strong>{' '}
                <span className="text-gray-400 capitalize">({character.role})</span>
                <p className="text-gray-500">{character.concept}</p>
              </div>
              <div>
                Fase da Vida: <strong>{lifeStage?.label ?? '—'}</strong> · Sanidade Máxima: <strong>{maxSanity}</strong> · Vigor: <strong>{vigor}</strong> · Sorte Restante:{' '}
                <strong>{remainingLuck}</strong>
              </div>
              
              <div>
                <div className="font-medium mb-1">Atributos</div>
                {Object.entries(finalAttributeTotals).map(([id, value]) => (
                  <div key={id}>
                    {ATTRIBUTES[id].label}: {value}
                  </div>
                ))}
              </div>
              <div>
                <div className="font-medium mb-1">Perícias</div>
                {Object.keys(finalSkillTotals).length === 0 ? (
                  <p className="text-gray-400">Nenhuma perícia distribuída ainda.</p>
                ) : (
                  groupSkillsByCategory(Object.keys(finalSkillTotals)).map((group) => (
                    <div key={group.categoryId} className="mb-2">
                      <div className="text-xs font-semibold text-gray-400 uppercase">{group.label}</div>
                      {group.skills.map((skillId) => {
                        const level = finalSkillTotals[skillId] || 0;
                        const dice = level > 0 ? SKILL_LEVEL_TO_DICE[Math.min(level, 9)] : 'd00';
                        const bonus = skillResultBonuses[skillId];
                        return (
                          <div key={skillId}>
                            {SKILLS[skillId]?.label ?? skillId}: {dice}
                            {bonus ? ` (+${bonus})` : ''}
                          </div>
                        );
                      })}
                    </div>
                  ))
                )}
              </div>
              <div>
                <div className="font-medium mb-1">Aspectos</div>
                {[
                  ...character.aspects.mandatoryIds,
                  ...character.aspects.chosenPositiveIds,
                  ...character.aspects.chosenNegativeIds,
                  ...character.aspects.excessNegativeIds,
                ].length === 0 ? (
                  <p className="text-gray-400">Nenhum aspecto selecionado ainda.</p>
                ) : (
                  <>
                    {character.aspects.mandatoryIds.map((id) => {
                      const a = NEGATIVE_ASPECTS.find((x) => x.id === id);
                      return <div key={id}>{a?.label ?? id} (obrigatório)</div>;
                    })}
                    {character.aspects.chosenPositiveIds.map((id) => {
                      const a = POSITIVE_ASPECTS.find((x) => x.id === id);
                      return <div key={id}>{a?.label ?? id} (positivo)</div>;
                    })}
                    {character.aspects.chosenNegativeIds.map((id) => {
                      const a = NEGATIVE_ASPECTS.find((x) => x.id === id);
                      return <div key={id}>{a?.label ?? id} (negativo)</div>;
                    })}
                    {character.aspects.excessNegativeIds.map((id) => {
                      const a = NEGATIVE_ASPECTS.find((x) => x.id === id);
                      return <div key={id}>{a?.label ?? id} (grave)</div>;
                    })}
                  </>
                )}
              </div>
              <div>
                <div className="font-medium mb-1">Traumas (Fobia/Mania)</div>
                {character.traumaIds.length === 0 ? (
                  <p className="text-gray-400">Nenhum trauma selecionado ainda.</p>
                ) : (
                  character.traumaIds.map((id) => {
                    const t = TRAUMAS.find((x) => x.id === id);
                    return <div key={id}>{t?.label ?? id}</div>;
                  })
                )}
              </div>
              <div>
{massInfo && (
  <div>
    <div className="font-medium mb-1">Categoria de Massa</div>
    <div>Peso real: <strong>{massInfo.real.label}</strong></div>
    <div className="text-xs text-gray-500 mt-1">
      <strong>Dano:</strong> {massInfo.damage.category.damageEffect}
      {massInfo.damage.wasChanged && <span className="text-amber-600"> (rebaixado para {massInfo.damage.category.label} por Força baixa)</span>}
    </div>
    <div className="text-xs text-gray-500">
      <strong>Vigor:</strong> {massInfo.vigor.category.vigorEffect}
      {massInfo.vigor.wasChanged && <span className="text-amber-600"> (rebaixado para {massInfo.vigor.category.label} por Constituição baixa)</span>}
    </div>
    <div className="text-xs text-gray-500">
      <strong>Stamina:</strong> {massInfo.stamina.category.staminaEffect}
      {massInfo.stamina.wasChanged && <span className="text-amber-600"> (elevado para {massInfo.stamina.category.label} por Resistência baixa)</span>}
    </div>
    <div className="text-xs text-gray-500 mt-1"><strong>Vantagem:</strong> {massInfo.real.advantage}</div>
    <div className="text-xs text-gray-500"><strong>Desvantagem:</strong> {massInfo.real.disadvantage}</div>
  </div>
)}
  
                <div className="font-medium mb-1">Habilidades Customizadas</div>
                {character.customSkills.length === 0 ? (
                  <p className="text-gray-400">Nenhuma habilidade adicionada.</p>
                ) : (
                  character.customSkills.map((sk, idx) => (
                    <div key={idx} className="text-xs border-b py-1">
                      <strong>{sk.name || 'Sem nome'}</strong> ({sk.skillId}) — Custo: {sk.cost} | Efeito:{' '}
                      {sk.effectType}
                    </div>
                  ))
                )}
              </div>
              {isAgent && (
                <div>
                  <div className="font-medium mb-1">Classe & Caminho</div>
                  <div>
                    Classe: {CLASSES[character.classPath.classId]?.label ?? '—'}
                    {character.classPath.classId &&
                      CLASSES[character.classPath.classId].classBonus.skillChoice && (
                        <> ({SKILLS[character.classPath.weaponChoiceSkillId]?.label ?? 'perícia não escolhida'})</>
                      )}
                  </div>
                  <div>
                    Arquétipo:{' '}
                    {getArchetypesForClass(character.classPath.classId).find(
                      (a) => a.id === character.classPath.archetypeId
                    )?.label ?? '—'}
                  </div>
                  <div>Caminho: {CAMINHOS[character.classPath.caminhoId]?.label ?? '—'}</div>
                  <div>Pontos de Especialidade: {classBonuses.specialtyPoints}</div>
                  {classBonuses.notes.map((note, i) => (
                    <div key={i} className="text-xs text-gray-500 mt-1">
                      {note}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex flex-wrap gap-2 mt-6">
              <button onClick={handleSaveCharacter} className="px-4 py-2 rounded bg-gray-900 text-white text-sm">
                Salvar Ficha
              </button>
              <button onClick={handleDownloadTxt} className="px-4 py-2 rounded border text-sm">
                Baixar Ficha (.txt)
              </button>
              <button onClick={handleExportPdf} className="px-4 py-2 rounded border text-sm">
                Gerar PDF (Documento Confidencial)
              </button>
            </div>

            {saveError && <p className="text-xs text-red-500 mt-2">{saveError}</p>}
            {saveSuccess && <p className="text-xs text-green-600 mt-2">Ficha salva com sucesso.</p>}

            <p className="text-xs text-gray-400 mt-2">
              Exportação real de PDF entra quando o layout da ficha estiver pronto — por enquanto, use
              "Baixar Ficha (.txt)" pra ter um registro completo.
            </p>
          </section>
        )}

        {/* Botões de Navegação */}
<div className="flex justify-between items-center mt-8 pt-4 border-t max-w-2xl gap-3 pb-6 md:pb-0">          <button onClick={goBack} disabled={stepIndex === 0} className="text-sm px-4 py-2 rounded border disabled:opacity-30">
            Voltar
          </button>
          <button
            onClick={goNext}
            disabled={stepIndex === STEPS.length - 1}
            className="text-sm px-4 py-2 rounded bg-gray-900 text-white disabled:opacity-30"
          >
            Avançar
          </button>
        </div>
      </main>

      <BureaucraticLoader isOpen={pendingAction !== null} onComplete={handleLoaderComplete} />
    </div>
  );
}