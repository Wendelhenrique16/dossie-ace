// src/components/AceOSBoot.jsx
// Roda uma vez, ao montar o App: fase spinner (estilo boot genérico) ->
// fase terminal (linhas com "(OK)") -> nome do sistema piscando -> some
// sozinho, revelando o app por trás.

import { useEffect, useState } from 'react';

const BOOT_LINES = [
  'Iniciando AceOS...',
  'Comunicando com o servidor central...',
  'Verificando integridade dos módulos...',
  'Carregando protocolos de segurança...',
];

const SPINNER_PHASE_MS = 1800;
const LINE_INTERVAL_MS = 700;
const OK_DELAY_MS = 350;
const BLINK_PHASE_MS = 1400;

export default function AceOSBoot({ onComplete }) {
  const [phase, setPhase] = useState('spinner'); // spinner -> terminal -> blink -> done
  const [visibleLines, setVisibleLines] = useState(0);
  const [okLines, setOkLines] = useState(0);

  // Fase 1: spinner
  useEffect(() => {
    if (phase !== 'spinner') return;
    const t = setTimeout(() => setPhase('terminal'), SPINNER_PHASE_MS);
    return () => clearTimeout(t);
  }, [phase]);

  // Fase 2: revela as linhas do terminal, uma a uma
  useEffect(() => {
    if (phase !== 'terminal') return;
    if (visibleLines < BOOT_LINES.length) {
      const t = setTimeout(() => setVisibleLines((n) => n + 1), LINE_INTERVAL_MS);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setPhase('blink'), 200);
    return () => clearTimeout(t);
  }, [phase, visibleLines]);

  // Fase 2b: marca "(OK)" em cada linha já revelada, com atraso
  useEffect(() => {
    if (phase !== 'terminal') return;
    if (okLines < visibleLines) {
      const t = setTimeout(() => setOkLines((n) => n + 1), OK_DELAY_MS);
      return () => clearTimeout(t);
    }
  }, [phase, visibleLines, okLines]);

  // Fase 3: nome piscando, depois termina
  useEffect(() => {
    if (phase !== 'blink') return;
    const t = setTimeout(() => {
      setPhase('done');
      onComplete?.();
    }, BLINK_PHASE_MS);
    return () => clearTimeout(t);
  }, [phase, onComplete]);

  if (phase === 'done') return null;

  return (
    <div className="ace-boot-overlay">
      {phase === 'spinner' && (
        <div className="ace-boot-spinner-phase">
          <div className="ace-boot-logo">⌬</div>
          <div className="ace-boot-dots">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      )}

      {phase === 'terminal' && (
        <div className="ace-boot-terminal">
          {BOOT_LINES.slice(0, visibleLines).map((line, i) => (
            <div key={i} className="ace-boot-line">
              &gt; {line} {i < okLines && <span className="ace-boot-ok">(OK)</span>}
            </div>
          ))}
        </div>
      )}

      {phase === 'blink' && <div className="ace-boot-blink-name">ACE-OS</div>}
    </div>
  );
}