// src/logic/exportCharacterPdf.js
// PDF básico, sem estilização — mesma estrutura de linhas do .txt, só que
// num arquivo que abre bem no celular. Estiliza depois quando o layout
// final da ficha estiver pronto.

import { jsPDF } from 'jspdf';
import { buildCharacterSheetLines } from './exportCharacterText';

const PAGE_HEIGHT_MM = 297; // A4
const MARGIN_MM = 15;
const LINE_HEIGHT_MM = 6;
const FONT_SIZE = 10;

export function generateCharacterSheetPdf(params) {
  const lines = buildCharacterSheetLines(params);
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  doc.setFont('courier', 'normal');
  doc.setFontSize(FONT_SIZE);

  let y = MARGIN_MM;

  lines.forEach((line) => {
    if (y > PAGE_HEIGHT_MM - MARGIN_MM) {
      doc.addPage();
      y = MARGIN_MM;
    }
    doc.text(line, MARGIN_MM, y);
    y += LINE_HEIGHT_MM;
  });

  return doc;
}

export function downloadCharacterSheetPdf(params, filename = 'ficha-ace.pdf') {
  const doc = generateCharacterSheetPdf(params);
  doc.save(filename);
}