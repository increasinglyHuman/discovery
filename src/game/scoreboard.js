/**
 * Scoreboard — arcade-style high score submission and display.
 */

const API_URL = import.meta.env.PROD
  ? '/adobe/pathfinder/scores.php'
  : '/scores.php'; // dev proxy or local PHP

/**
 * Fetch top 10 leaderboard.
 */
export async function fetchLeaderboard() {
  try {
    const res = await fetch(API_URL);
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

/**
 * Submit a score. Returns updated leaderboard with position.
 */
export async function submitScore(initials, score, rank) {
  try {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ initials, score, rank }),
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

/**
 * Render the scoreboard section into a container element.
 * @param {HTMLElement} container
 * @param {number} playerScore - The player's average score
 * @param {string} playerRank - The player's rank name
 */
export async function renderScoreboard(container, playerScore, playerRank) {
  const data = await fetchLeaderboard();

  // Check if player qualifies for top 10
  const qualifies = !data || data.scores.length < 10 || playerScore > data.scores[data.scores.length - 1].score;

  let html = `
    <div class="scoreboard">
      <h3 class="scoreboard-title">Hall of Explorers</h3>
  `;

  // Initials entry (if qualifies)
  if (qualifies) {
    html += `
      <div class="scoreboard-entry" id="scoreboard-entry">
        <p class="scoreboard-qualify">Your score qualifies! Enter your initials:</p>
        <div class="initials-input">
          <input type="text" maxlength="1" class="initial-box" data-pos="0" autocomplete="off">
          <span class="initial-dash">-</span>
          <input type="text" maxlength="1" class="initial-box" data-pos="1" autocomplete="off">
          <span class="initial-dash">-</span>
          <input type="text" maxlength="1" class="initial-box" data-pos="2" autocomplete="off">
        </div>
        <button class="btn primary" id="btn-submit-score">Register Score</button>
      </div>
    `;
  }

  // Leaderboard table
  html += `<div class="scoreboard-list" id="scoreboard-list">`;
  if (data && data.scores.length > 0) {
    data.scores.forEach((s, i) => {
      const rankCls = s.rank.toLowerCase().replace(/[^a-z]/g, '');
      html += `
        <div class="scoreboard-row">
          <span class="sb-pos">${i + 1}</span>
          <span class="sb-initials">${s.initials}</span>
          <span class="sb-rank rank-${rankCls}">${s.rank}</span>
          <span class="sb-score">${s.score}</span>
        </div>`;
    });
  } else {
    html += `<div class="scoreboard-empty">No scores yet — be the first explorer!</div>`;
  }
  html += `</div></div>`;

  container.innerHTML = html;

  // Wire up initials input behavior
  if (qualifies) {
    const boxes = container.querySelectorAll('.initial-box');
    boxes.forEach(box => {
      box.addEventListener('input', (e) => {
        e.target.value = e.target.value.toUpperCase().replace(/[^A-Z]/g, '');
        if (e.target.value && e.target.dataset.pos < 2) {
          boxes[parseInt(e.target.dataset.pos) + 1].focus();
        }
      });
      box.addEventListener('keydown', (e) => {
        if (e.key === 'Backspace' && !e.target.value && e.target.dataset.pos > 0) {
          boxes[parseInt(e.target.dataset.pos) - 1].focus();
        }
      });
    });
    boxes[0].focus();

    container.querySelector('#btn-submit-score').addEventListener('click', async () => {
      const initials = Array.from(boxes).map(b => b.value).join('');
      if (initials.length < 3) return;

      const result = await submitScore(initials, playerScore, playerRank);
      if (result) {
        // Replace entry form with confirmation
        const entryDiv = container.querySelector('#scoreboard-entry');
        entryDiv.innerHTML = `<p class="scoreboard-confirm">Registered! Position: #${result.position}</p>`;

        // Update leaderboard
        const listDiv = container.querySelector('#scoreboard-list');
        let listHTML = '';
        result.scores.forEach((s, i) => {
          const rankCls = s.rank.toLowerCase().replace(/[^a-z]/g, '');
          const isYou = s.initials === initials && s.score === playerScore;
          listHTML += `
            <div class="scoreboard-row ${isYou ? 'scoreboard-you' : ''}">
              <span class="sb-pos">${i + 1}</span>
              <span class="sb-initials">${s.initials}</span>
              <span class="sb-rank rank-${rankCls}">${s.rank}</span>
              <span class="sb-score">${s.score}</span>
            </div>`;
        });
        listDiv.innerHTML = listHTML;
      }
    });
  }
}
