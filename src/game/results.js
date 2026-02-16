import { state } from '../state.js';
import { ENCOUNTERS, SHIP_LOGS, RANKS } from '../data/encounters.js';
import { showScreen } from '../ui/screens.js';
import { generateAdvice } from './advice.js';
import { renderScoreboard } from './scoreboard.js';

export function renderResult(enc, openness, accuracy, total) {
  const screen = document.getElementById('screen-result');
  const truthSet = new Set([...enc.truth, ...(enc.truthPartial || [])]);
  const primarySet = new Set(enc.truth);

  let hypoListHTML = '';
  enc.hypotheses.forEach((h, i) => {
    const isPrimary = primarySet.has(i);
    const isPartial = (enc.truthPartial || []).includes(i);
    const isValid = truthSet.has(i);
    const selected = state.reportSelections.has(i);

    const correct = isValid;
    const check = correct ? '✓' : '✗';
    let suffix = '';
    if (isPrimary) suffix = ' — Primary';
    else if (isPartial) suffix = ' — Partial';

    let playerTag = '';
    if (selected && isValid) playerTag = '<span class="player-tag selected">You selected ✓</span>';
    else if (selected && !isValid) playerTag = '<span class="player-tag missed">You selected ✗</span>';
    else if (!selected && isValid) playerTag = '<span class="player-tag missed">Missed</span>';

    hypoListHTML += `
      <div class="result-hypo ${correct ? 'correct' : 'wrong'}">
        <span class="check">${check}</span>
        <span class="label"><strong>${h.letter}. ${h.label}</strong>${suffix}</span>
        ${playerTag}
      </div>`;
  });

  let connectionHTML = '';
  if (enc.connectionNote) {
    connectionHTML = `<div class="connection-note mt-md"><strong>⟁ Connection Detected:</strong> ${enc.connectionNote}</div>`;
  }

  screen.innerHTML = `
    <div class="encounter-header">
      <span class="encounter-num">Analysis Complete</span>
    </div>
    <h2 class="encounter-title">${enc.title} — Results</h2>

    <div class="result-truth">
      <h3>What Was Actually Happening</h3>
      ${enc.truthExplanation}
    </div>

    <div class="result-hypo-list">${hypoListHTML}</div>

    <div class="score-cards">
      <div class="score-card openness">
        <div class="value">${openness}<small>/50</small></div>
        <div class="label">Open-Mindedness</div>
      </div>
      <div class="score-card accuracy">
        <div class="value">${accuracy}<small>/50</small></div>
        <div class="label">Discovery Accuracy</div>
      </div>
    </div>

    ${connectionHTML}

    <div class="text-center mt-md">
      <button class="btn primary" id="btn-advance">Continue</button>
    </div>
  `;

  document.getElementById('btn-advance').addEventListener('click', advanceFromResult);
  showScreen('result');
}

function advanceFromResult() {
  if (state.currentEncounter < ENCOUNTERS.length - 1) {
    renderShipLog();
  } else {
    renderFinalResults();
  }
}

function renderShipLog() {
  const logText = SHIP_LOGS[state.currentEncounter];
  const screen = document.getElementById('screen-log');

  screen.innerHTML = `
    <div class="ship-log-bg">
      <img src="images/ship-log.png" alt="">
    </div>
    <div class="ship-log-icon">◆</div>
    <div class="ship-log-title">Ship's Log — ISV Curiosity</div>
    <p class="ship-log-text">${logText}</p>
    <button class="btn primary mt-lg" id="btn-next-encounter">Continue to Next Site</button>
  `;

  document.getElementById('btn-next-encounter').addEventListener('click', nextEncounter);
  showScreen('log');
}

function nextEncounter() {
  state.currentEncounter++;
  // Dynamic import to avoid circular dependency
  import('./encounter.js').then(({ renderEncounter }) => renderEncounter());
}

function renderFinalResults() {
  const screen = document.getElementById('screen-final');
  const avgScore = Math.round(state.scores.reduce((a, s) => a + s.total, 0) / state.scores.length);
  const rank = RANKS.find(r => avgScore >= r.min && avgScore <= r.max) || RANKS[0];

  let breakdownHTML = '';
  state.scores.forEach(s => {
    breakdownHTML += `
      <div class="final-encounter-row">
        <span class="name">${s.encounter}</span>
        <span class="score">${s.total}/100</span>
      </div>`;
  });

  // Generate personalized advice
  const adviceHTML = generateAdvice(state.scores);

  screen.innerHTML = `
    <div class="final-rank-label">Your Explorer Rank</div>
    <div class="final-rank ${rank.cls}">${rank.name}</div>
    <div class="final-score-big">${avgScore}</div>

    <div class="final-breakdown">${breakdownHTML}</div>

    <p style="max-width:500px; text-align:center; color:var(--text-dim); font-size:0.9rem; line-height:1.7; margin-bottom:20px;">
      ${rank.desc}
    </p>

    <div class="final-reveal">
      <h3>Planetary Analysis — Classified</h3>
      <p>
        Kepler-442b is not simply habitable. It appears to be
        <span class="highlight">a single, planet-spanning living system</span>.
      </p>
      <p style="margin-top:12px;">
        The crystalline basin, the hexagonal columns, the atmospheric signal,
        the luminous migrations, the mineral archive, and the planet's response to your presence
        — these are not separate phenomena. They are <span class="highlight">organs of one massive superorganism</span>,
        connected through shared biochemistry and synchronized through the planetary field.
      </p>
      <p style="margin-top:12px;">
        Explorers who held multiple hypotheses across all six encounters were best positioned
        to see this bigger picture. Those who locked in a single explanation early
        missed the connections hiding in plain sight.
      </p>
    </div>

    <div class="meta-lesson mt-md">
      <h3>Transmission from Mission Control</h3>
      <p>
        The skill you just practiced has a name. Scientists call it
        <span class="key-term">cognitive flexibility</span> — the ability to hold multiple
        possible explanations at once while gathering evidence, resisting the urge to
        lock onto the first answer that feels right.
      </p>
      <p style="margin-top:12px;">
        Your brain has a built-in shortcut: when facing uncertainty, your threat-detection system
        wants to <span class="key-term">pick one answer and defend it</span>. That feels like
        clarity. It feels like courage. But it's actually your mind closing a door
        to protect you from the discomfort of not knowing.
      </p>
      <p style="margin-top:12px;">
        The best explorers — on alien worlds and in everyday life —
        <span class="key-term">notice that urge and keep exploring anyway</span>.
        They hold competing ideas without panic. They follow evidence, not comfort.
      </p>
      <p style="margin-top:12px;">
        And sometimes, the most important decision isn't what to believe —
        it's <span class="key-term">what not to disturb</span>.
        Every investigation has a cost. The wisest explorers know which questions
        to ask and which stones to leave unturned.
      </p>
      <p style="margin-top:12px;">
        In a world full of clickbait, hot takes, and instant certainty,
        this is the skill that changes everything:
        <span class="key-term">the willingness to stay curious longer than feels comfortable</span>.
      </p>
      <p style="margin-top:16px; text-align:center; color:var(--text-primary); font-weight:600;">
        That's not just how you explore alien worlds.<br>That's how you navigate this one.
      </p>
    </div>

    <div class="advice-card mt-md">
      <h3>Your Next Mission Briefing</h3>
      <p>${adviceHTML}</p>
    </div>

    <div id="scoreboard-container" class="mt-md"></div>

    <div class="text-center mt-lg" style="padding-bottom:40px;">
      <button class="btn" id="btn-replay">Play Again</button>
    </div>
  `;

  document.getElementById('btn-replay').addEventListener('click', () => location.reload());
  showScreen('final');

  // Load scoreboard asynchronously
  renderScoreboard(
    document.getElementById('scoreboard-container'),
    avgScore,
    rank.name
  );
}
