// src/components/BureaucraticLoader.jsx
// UC-04: Tela de Carregamento Burocrático Imersivo.
// Modal escuro estilo terminal estatal, com barra de progresso lenta e
// textos falsos de "validação". Sobe até 99%, pausa de propósito, e só
// então finaliza — nunca é instantâneo, mesmo que a ação real já tenha
// terminado.

import { useEffect, useState } from 'react';

const DEFAULT_MESSAGES = [
  'Validando credenciais do ministério...',
  'Consultando arquivos do DOPS...',
  'Autenticando selo confidencial...',
  'Acessando servidor da divisão...',
  'Aguardando carimbo do setor...',
  'Processando protocolo confidencial...',
];

/**
 * @param {boolean} isOpen - controla se o modal está visível
 * @param {() => void} onComplete - chamado quando a "burocracia" termina
 * @param {number} [minDurationMs] - tempo até chegar em 99% (padrão: 3-5s aleatório)
 * @param {string[]} [messages] - pool de mensagens falsas a exibir
 */
export default function BureaucraticLoader({
  isOpen,
  onComplete,
  minDurationMs,
  messages = DEFAULT_MESSAGES,
}) {
  const [progress, setProgress] = useState(0);
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    if (!isOpen) {
      setProgress(0);
      setMessageIndex(0);
      return undefined;
    }

    const duration = minDurationMs ?? 3000 + Math.random() * 2000; // 3-5s
    const startTime = Date.now();
    let rafId;

    function tick() {
      const elapsed = Date.now() - startTime;
      const pct = Math.min(99, (elapsed / duration) * 99);
      setProgress(Math.floor(pct));

      if (pct < 99) {
        rafId = requestAnimationFrame(tick);
      } else {
        // Pausa intencional de 1.5s em 99% antes de finalizar
        setTimeout(() => {
          setProgress(100);
          setTimeout(() => onComplete?.(), 200);
        }, 1500);
      }
    }
    rafId = requestAnimationFrame(tick);

    const messageInterval = setInterval(() => {
      setMessageIndex((i) => (i + 1) % messages.length);
    }, 900);

    return () => {
      cancelAnimationFrame(rafId);
      clearInterval(messageInterval);
    };
  }, [isOpen, minDurationMs, onComplete, messages]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[100]">
      <div className="border p-6 w-full max-w-sm">
        <div className="text-xs uppercase tracking-wide mb-4 opacity-70">
          Sistema Interno — Processando
        </div>

        <div className="bureaucratic-progress-track mb-2">
          <div className="bureaucratic-progress-fill" style={{ width: `${progress}%` }} />
        </div>
        <div className="text-xs text-right mb-4 opacity-70">{progress}%</div>

        <div className="text-sm min-h-[1.5em]">{messages[messageIndex]}</div>
      </div>
    </div>
  );
}