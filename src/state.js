import { STARTING_ENERGY } from './data/encounters.js';

export const state = {
  currentEncounter: 0,
  phase: 'title',
  energy: STARTING_ENERGY,
  evidenceRevealed: new Set(),
  hypothesesDismissed: new Set(),
  opennessSnapshots: [],
  reportSelections: new Set(),
  riskyUsed: false,
  pendingRiskyIndex: null,
  scores: [],
};

export function resetEncounterState() {
  state.phase = 'encounter';
  state.energy = STARTING_ENERGY;
  state.evidenceRevealed = new Set();
  state.hypothesesDismissed = new Set();
  state.opennessSnapshots = [];
  state.reportSelections = new Set();
  state.riskyUsed = false;
  state.pendingRiskyIndex = null;
}
