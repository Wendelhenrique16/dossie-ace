// src/components/character/StepHelp.jsx
import { useState } from 'react';
import { STEP_TUTORIALS } from '../../data/tutorials';
import { SKILL_TIERS, SKILL_NUMBER_INTRO, SKILL_LEVEL_DICE_LINE } from '../../data/skillTiers';

export default function StepHelp({ stepId }) {
  const [open, setOpen] = useState(false);
  const tutorial = STEP_TUTORIALS[stepId];
  if (!tutorial) return null;

  return (
    <div className="mb-4 border rounded p-3 bg-gray-50 text-sm">
      <div className="flex items-start justify-between gap-3">
        <p className="text-gray-700">{tutorial.intro}</p>
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          title="Dicas e tutorial deste passo"
          className={`shrink-0 w-6 h-6 rounded-full border text-xs font-semibold ${open ? 'bg-gray-900 text-white' : 'hover:bg-gray-100'}`}
        >
          ?
        </button>
      </div>

      {open && (
        <div className="mt-3 space-y-3">
          <ul className="list-disc pl-5 space-y-1 text-xs text-gray-600">
            {tutorial.tips.map((tip, i) => (
              <li key={i}>{tip}</li>
            ))}
          </ul>

          {tutorial.showNumberScale && (
            <div className="border-t pt-2">
              <div className="text-xs font-semibold text-gray-700 mb-1">Como ler os números</div>
              <p className="text-xs text-gray-600 mb-2">{SKILL_NUMBER_INTRO}</p>
              <div className="space-y-1">
                {SKILL_TIERS.map((tier) => (
                  <div key={tier.id} className="text-xs text-gray-600">
                    <strong>
                      {tier.label} ({tier.min === tier.max ? tier.min : `${tier.min} a ${tier.max}`}):
                    </strong>{' '}
                    {tier.text}
                  </div>
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-2">{SKILL_LEVEL_DICE_LINE}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}