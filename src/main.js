import './style.css';
import { state } from './state.js';
import { createStarfield } from './ui/starfield.js';
import { renderEncounter } from './game/encounter.js';
import { proceedRisk, cancelRisk } from './game/evidence.js';

// Initialize starfield
createStarfield();

// Bind title screen start button
document.getElementById('btn-start').addEventListener('click', () => {
  state.currentEncounter = 0;
  state.scores = [];
  renderEncounter();
});

// Bind risk overlay buttons
document.getElementById('btn-proceed-risk').addEventListener('click', proceedRisk);
document.getElementById('btn-cancel-risk').addEventListener('click', cancelRisk);
