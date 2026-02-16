import { state } from '../state.js';
import { ENCOUNTERS } from '../data/encounters.js';

export function toggleHypothesis(index) {
  if (state.phase === 'report') {
    const card = document.querySelector(`#hypo-grid .hypo-card[data-index="${index}"]`);
    if (state.reportSelections.has(index)) {
      state.reportSelections.delete(index);
      card.classList.remove('selected');
      card.querySelector('.hypo-status').textContent = 'TAP TO SELECT';
    } else {
      state.reportSelections.add(index);
      card.classList.add('selected');
      card.querySelector('.hypo-status').textContent = 'SELECTED';
    }
    return;
  }

  if (state.hypothesesDismissed.has(index)) {
    state.hypothesesDismissed.delete(index);
  } else {
    state.hypothesesDismissed.add(index);
  }
  updateHypothesisCards();
}

export function updateHypothesisCards() {
  const enc = ENCOUNTERS[state.currentEncounter];
  enc.hypotheses.forEach((h, i) => {
    const card = document.querySelector(`#hypo-grid .hypo-card[data-index="${i}"]`);
    const dismissed = state.hypothesesDismissed.has(i);
    card.className = `hypo-card ${dismissed ? 'dismissed' : 'active'}`;
    card.querySelector('.hypo-status').textContent = dismissed ? 'DISMISSED' : 'ACTIVE';
  });
}
