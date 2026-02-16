import { state } from '../state.js';
import { ENCOUNTERS, ENERGY_PER_SCAN, STARTING_ENERGY } from '../data/encounters.js';

export function updateEnergyUI() {
  document.getElementById('energy-value').textContent = state.energy;
  const segCount = STARTING_ENERGY / ENERGY_PER_SCAN;
  const activeSeg = Math.ceil(state.energy / ENERGY_PER_SCAN);
  for (let i = 0; i < segCount; i++) {
    const seg = document.getElementById('energy-seg-' + i);
    if (i < activeSeg) {
      seg.classList.remove('spent');
    } else {
      seg.classList.add('spent');
    }
  }
}

export function lockRemainingScans() {
  const enc = ENCOUNTERS[state.currentEncounter];
  enc.evidence.forEach((ev, i) => {
    if (!state.evidenceRevealed.has(i)) {
      const card = document.querySelector(`.evidence-card[data-index="${i}"]`);
      card.classList.add('locked');
      card.onclick = null;
    }
  });
  document.getElementById('depleted-banner').style.display = 'block';
}
