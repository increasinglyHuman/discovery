import { state, resetEncounterState } from '../state.js';
import { ENCOUNTERS, ENERGY_PER_SCAN, STARTING_ENERGY } from '../data/encounters.js';
import { buildSceneVisual } from '../ui/scenes.js';
import { showScreen } from '../ui/screens.js';
import { revealEvidence } from './evidence.js';
import { toggleHypothesis } from './hypotheses.js';
import { submitReport } from './report.js';

export function renderEncounter() {
  const enc = ENCOUNTERS[state.currentEncounter];
  resetEncounterState();

  const screen = document.getElementById('screen-encounter');
  screen.innerHTML = '';

  // Header
  const header = document.createElement('div');
  header.innerHTML = `
    <div class="encounter-header">
      <span class="encounter-num">Encounter ${enc.num} of ${ENCOUNTERS.length}</span>
    </div>
    <h2 class="encounter-title">${enc.title}</h2>
    <div class="encounter-location">${enc.location}</div>
  `;
  screen.appendChild(header);

  // Scene visual
  screen.appendChild(buildSceneVisual(enc));

  // Description
  const desc = document.createElement('div');
  desc.className = 'encounter-desc';
  desc.textContent = enc.description;
  screen.appendChild(desc);

  // Energy bar
  const energyBar = document.createElement('div');
  energyBar.className = 'energy-bar';
  energyBar.id = 'energy-bar';
  const segCount = STARTING_ENERGY / ENERGY_PER_SCAN;
  let segsHTML = '';
  for (let i = 0; i < segCount; i++) {
    segsHTML += `<div class="energy-segment" id="energy-seg-${i}"></div>`;
  }
  energyBar.innerHTML = `
    <span class="energy-label">Scanner Power</span>
    <div class="energy-segments">${segsHTML}</div>
    <span class="energy-value" id="energy-value">${STARTING_ENERGY}</span>
  `;
  screen.appendChild(energyBar);

  // Evidence section
  const evTitle = document.createElement('div');
  evTitle.className = 'evidence-section-title';
  evTitle.textContent = 'Scanner Array — choose wisely';
  screen.appendChild(evTitle);

  const evGrid = document.createElement('div');
  evGrid.className = 'evidence-grid';
  evGrid.id = 'evidence-grid';

  enc.evidence.forEach((ev, i) => {
    const card = document.createElement('div');
    card.className = 'evidence-card' + (ev.risky ? ' risky' : '');
    card.dataset.index = i;
    card.addEventListener('click', () => revealEvidence(i));

    const supportTags = ev.supports.map(h =>
      `<span class="evidence-tag supports">Supports ${enc.hypotheses[h].letter}</span>`
    ).join('');
    const challengeTags = ev.challenges.map(h =>
      `<span class="evidence-tag challenges">Challenges ${enc.hypotheses[h].letter}</span>`
    ).join('');

    const riskyBadge = ev.risky ? '<span class="risk-badge">⚠ CAUTION</span>' : '';
    const consequenceHTML = ev.risky
      ? `<div class="consequence-card" style="display:none"><strong>⚠ Consequence:</strong> ${ev.riskyConsequence}</div>`
      : '';

    card.innerHTML = `
      <div class="evidence-scan-label">
        <img src="${ev.icon}" class="scan-icon" alt="">
        ${ev.label}${riskyBadge}
        <span class="scan-cost">${ENERGY_PER_SCAN} pw</span>
      </div>
      <div class="evidence-result">
        <div>${ev.result}</div>
        <div class="evidence-tags">${supportTags}${challengeTags}</div>
        ${consequenceHTML}
      </div>
    `;
    evGrid.appendChild(card);
  });
  screen.appendChild(evGrid);

  // Depleted banner placeholder
  const depletedBanner = document.createElement('div');
  depletedBanner.id = 'depleted-banner';
  depletedBanner.style.display = 'none';
  depletedBanner.className = 'depleted-banner';
  depletedBanner.textContent = 'Scanner power depleted — prepare your report';
  screen.appendChild(depletedBanner);

  // Hypotheses section
  const hyTitle = document.createElement('div');
  hyTitle.className = 'hypo-section-title';
  hyTitle.textContent = 'Your Active Hypotheses — tap to dismiss / restore';
  hyTitle.id = 'hypo-section-title';
  screen.appendChild(hyTitle);

  const hyGrid = document.createElement('div');
  hyGrid.className = 'hypo-grid';
  hyGrid.id = 'hypo-grid';

  enc.hypotheses.forEach((h, i) => {
    const card = document.createElement('div');
    card.className = 'hypo-card active';
    card.dataset.index = i;
    card.addEventListener('click', () => toggleHypothesis(i));
    card.innerHTML = `
      <div class="hypo-letter">${h.letter}</div>
      <div class="hypo-label">${h.label}</div>
      <div class="hypo-desc">${h.desc}</div>
      <span class="hypo-status">ACTIVE</span>
    `;
    hyGrid.appendChild(card);
  });
  screen.appendChild(hyGrid);

  // Report section (hidden)
  const reportDiv = document.createElement('div');
  reportDiv.id = 'report-section';
  reportDiv.style.display = 'none';
  reportDiv.innerHTML = `
    <div class="report-prompt mt-md">
      Time to file your report.<br>
      <strong>Select all hypotheses you believe are viable</strong> — you can choose more than one.
    </div>
    <div class="report-actions mt-md">
      <button class="btn primary" id="btn-submit-report">Transmit Report</button>
    </div>
  `;
  screen.appendChild(reportDiv);

  // Bind submit button
  reportDiv.querySelector('#btn-submit-report').addEventListener('click', submitReport);

  showScreen('encounter');
}
