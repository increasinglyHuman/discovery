import { state } from '../state.js';
import { ENCOUNTERS } from '../data/encounters.js';
import { renderResult } from './results.js';

export function enterReportPhase() {
  state.phase = 'report';
  state.reportSelections = new Set();
  const enc = ENCOUNTERS[state.currentEncounter];

  document.getElementById('hypo-section-title').textContent =
    'Select all hypotheses you believe are viable — tap to include in your report';

  enc.hypotheses.forEach((h, i) => {
    const card = document.querySelector(`#hypo-grid .hypo-card[data-index="${i}"]`);
    card.className = 'hypo-card selectable';
    card.querySelector('.hypo-status').textContent = 'TAP TO SELECT';
  });

  document.getElementById('report-section').style.display = 'block';
  document.getElementById('report-section').scrollIntoView({ behavior: 'smooth' });
}

export function submitReport() {
  const enc = ENCOUNTERS[state.currentEncounter];

  // Openness: based on active hypotheses at each evidence reveal
  const maxSnapshots = state.opennessSnapshots.length * enc.hypotheses.length;
  const actualSnapshots = state.opennessSnapshots.reduce((a, b) => a + b, 0);
  const openness = maxSnapshots > 0 ? Math.round((actualSnapshots / maxSnapshots) * 50) : 25;

  // Accuracy
  const truthSet = new Set([...enc.truth, ...(enc.truthPartial || [])]);
  const primarySet = new Set(enc.truth);
  let accuracyRaw = 0;

  enc.hypotheses.forEach((h, i) => {
    const selected = state.reportSelections.has(i);
    const isPrimary = primarySet.has(i);
    const isValid = truthSet.has(i);

    if (selected && isPrimary) accuracyRaw += 20;
    else if (selected && isValid) accuracyRaw += 10;
    else if (selected && !isValid) accuracyRaw -= 8;
    else if (!selected && isPrimary) accuracyRaw -= 12;
  });
  const accuracy = Math.max(0, Math.min(50, Math.round(accuracyRaw + 20)));

  const total = openness + accuracy;
  state.scores.push({ openness, accuracy, total, encounter: enc.title });

  renderResult(enc, openness, accuracy, total);
}
