import { state } from '../state.js';
import { ENCOUNTERS, ENERGY_PER_SCAN } from '../data/encounters.js';
import { updateEnergyUI, lockRemainingScans } from './energy.js';
import { enterReportPhase } from './report.js';

export function revealEvidence(index) {
  if (state.evidenceRevealed.has(index)) return;
  if (state.energy < ENERGY_PER_SCAN) return;

  const enc = ENCOUNTERS[state.currentEncounter];
  const ev = enc.evidence[index];

  // If risky, show confirmation dialog
  if (ev.risky) {
    state.pendingRiskyIndex = index;
    document.getElementById('risk-warning-text').textContent = ev.riskyWarning;
    document.getElementById('risk-overlay').classList.add('active');
    return;
  }

  executeReveal(index);
}

export function proceedRisk() {
  document.getElementById('risk-overlay').classList.remove('active');
  if (state.pendingRiskyIndex !== null) {
    state.riskyUsed = true;
    executeReveal(state.pendingRiskyIndex);
    state.pendingRiskyIndex = null;
  }
}

export function cancelRisk() {
  document.getElementById('risk-overlay').classList.remove('active');
  state.pendingRiskyIndex = null;
}

export function executeReveal(index) {
  const enc = ENCOUNTERS[state.currentEncounter];
  const ev = enc.evidence[index];
  const card = document.querySelector(`.evidence-card[data-index="${index}"]`);

  // Deduct energy
  state.energy -= ENERGY_PER_SCAN;
  updateEnergyUI();

  // Scanning animation
  card.classList.add('scanning');
  card.onclick = null;

  setTimeout(() => {
    card.classList.remove('scanning');
    card.classList.add('revealed');
    state.evidenceRevealed.add(index);

    // Show consequence if risky
    if (ev.risky) {
      const conseq = card.querySelector('.consequence-card');
      if (conseq) conseq.style.display = 'block';
    }

    // Snapshot: how many hypotheses are active right now?
    const activeCount = enc.hypotheses.length - state.hypothesesDismissed.size;
    state.opennessSnapshots.push(activeCount);

    // Check if energy depleted or all evidence revealed
    const allRevealed = state.evidenceRevealed.size === enc.evidence.length;
    const outOfEnergy = state.energy < ENERGY_PER_SCAN;

    if (allRevealed || outOfEnergy) {
      if (!allRevealed) lockRemainingScans();
      setTimeout(() => enterReportPhase(), 800);
    }
  }, 500);
}
