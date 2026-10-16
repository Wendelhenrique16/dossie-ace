// src/components/modals/PhysicalParametersModal.jsx
import { useMemo, useState } from 'react';
import { calculatePhysicalParameters, buildPhysicalParametersMarkdown } from '../../logic/physicalParameters';

export default function PhysicalParametersModal({ sheet, onClose }) {
  const [copied, setCopied] = useState(false);

  const markdown = useMemo(() => {
    const params = calculatePhysicalParameters(sheet);
    return buildPhysicalParametersMarkdown(params, sheet.character);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sheet.character, sheet.finalSkillTotals, sheet.finalAttributeTotals]);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(markdown);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = markdown;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[92vh] flex flex-col overflow-hidden">
        <div className="p-3 sm:p-4 border-b flex items-center justify-between shrink-0">
          <div>
            <h2 className="text-lg font-semibold">Parâmetros Físicos</h2>
            <p className="text-xs text-gray-500">Limites práticos da ficha, prontos para jogador e mestre usarem em cena.</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700 text-xl leading-none">×</button>
        </div>

        <div className="overflow-y-auto flex-1 overscroll-contain p-3 sm:p-4">
          <pre className="whitespace-pre-wrap break-words text-xs text-gray-700 font-mono">{markdown}</pre>
        </div>

        <div className="p-3 sm:p-4 border-t flex items-center justify-end gap-2 shrink-0">
          <button onClick={onClose} className="text-sm px-3 py-2 rounded border">Fechar</button>
          <button onClick={handleCopy} className="text-sm px-4 py-2 rounded bg-gray-900 text-white">
            {copied ? 'Copiado!' : 'Copiar Markdown'}
          </button>
        </div>
      </div>
    </div>
  );
}