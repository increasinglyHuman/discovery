# Creating Your Own PATHFINDER Scenarios

> A guide for human and AI creators who want to build their own discovery games using this template.

---

## What This Is

PATHFINDER is a browser-based game that teaches **cognitive flexibility** — the ability to hold multiple hypotheses open while gathering evidence. Players explore alien environments, spend limited scanner energy to reveal clues, and must resist the urge to lock onto a single explanation too early.

The game rewards **open-mindedness** (keeping hypotheses active) and **accuracy** (selecting the right answers at the end). The tension between these two drives creates the learning experience.

You can fork this project and build your own version — different planet, different theme, different scenarios. The engine handles all the scoring, UI, and state management. You just supply the stories and data.

---

## Quick Start

```bash
# Clone the repo
git clone https://github.com/increasinglyHuman/discovery.git
cd discovery

# Install dependencies
npm install

# Run locally
npm run dev

# Build for production
npm run build
```

The dev server runs at `http://localhost:5173`. The production build goes to `dist/`.

---

## Project Structure

```
src/
├── main.js                 # Entry point — wires up buttons and starfield
├── state.js                # Game state (energy, hypotheses, scores)
├── style.css               # All styles (glassmorphism space theme)
├── data/
│   └── encounters.js       # ★ YOUR CONTENT GOES HERE ★
├── game/
│   ├── encounter.js        # Renders an encounter screen
│   ├── evidence.js         # Scan reveal + risk dialog
│   ├── energy.js           # Energy bar management
│   ├── hypotheses.js       # Hypothesis toggle logic
│   ├── report.js           # Report phase + scoring
│   ├── results.js          # Results, ship log, final screen
│   ├── advice.js           # Post-game personalized coaching
│   └── scoreboard.js       # High score leaderboard
└── ui/
    ├── starfield.js        # Background star animation
    ├── scenes.js           # Scene overlay animations
    └── screens.js          # Screen transition manager
```

The file you'll spend 90% of your time editing is **`src/data/encounters.js`**.

---

## Creating Your Own Encounters

Each encounter is a JavaScript object in the `ENCOUNTERS` array. Here's the annotated structure:

```javascript
{
  id: 'pulse',                    // Unique slug (used internally)
  num: 1,                         // Display number
  title: 'The Pulse',             // Shown as the encounter heading
  location: 'Kepler-442b — Crystalline Basin',  // Subheading
  sceneClass: 'scene-pulse',      // CSS class for scene visual
  sceneImage: 'images/encounter-pulse.png',      // Background image

  description: `Your shuttle touches down beside a vast field of
    translucent crystals...`,     // Sets the scene — 2-3 sentences

  hypotheses: [
    {
      letter: 'A',               // Display label
      label: 'Geological Activity',
      desc: 'Subsurface thermal venting with periodic pressure release.'
    },
    { letter: 'B', label: 'Biological Organism', desc: '...' },
    { letter: 'C', label: 'Artificial Beacon', desc: '...' },
    { letter: 'D', label: 'Crystal Resonance', desc: '...' },
  ],

  evidence: [
    {
      label: 'Thermal scan',           // Button text
      icon: 'icons/splat.svg',         // 128x128 SVG icon
      result: 'Temperature fluctuates in sync with the pulse...',
      supports: [0, 1],                // Indices into hypotheses array
      challenges: [],                  // Indices this evidence argues against
    },
    {
      label: 'Deep subsurface sonar',
      icon: 'icons/mutantSpiral.svg',
      risky: true,                     // Triggers risk confirmation dialog
      riskyWarning: 'High-powered sonar could disturb whatever is producing the pulse.',
      riskyConsequence: 'The pulse falters. For three beats, the rhythm goes irregular...',
      result: 'Sonar reveals a massive hollow chamber 40 meters below...',
      supports: [0, 1, 2],
      challenges: [],
    },
    // ... more evidence items (recommend 5 per encounter)
  ],

  truth: [1, 3],           // Primary correct hypotheses (indices)
  truthPartial: [0],       // Partially correct hypotheses
  truthExplanation: `The crystalline basin is a living colonial organism...`,
  connectionNote: null,     // Or a string linking to previous encounter discoveries
}
```

### Key Design Rules

| Rule | Why |
|------|-----|
| **4 hypotheses per encounter** | Enough to create genuine ambiguity without overwhelming |
| **5 evidence items** | Players can only afford 4 scans (100 energy, 25 per scan), so they always leave one unread |
| **Exactly 1 risky evidence** | The risk/reward dilemma is central to the learning experience |
| **2+ truths (primary + partial)** | Reality is always more complex than a single answer. This IS the lesson |
| **supports/challenges use indices** | `supports: [0, 2]` means this evidence supports hypotheses A and C |

---

## Designing Good Hypotheses

The quality of your game lives or dies with hypothesis design. Here's what makes them work:

1. **Make the "obvious" answer wrong.** If players see columns, their first thought is "someone built these." That should be hypothesis D, and it should be wrong. The truth should be stranger.

2. **Always have 2+ partially correct answers.** Real discovery rarely yields a single clean answer. When truth = `[1, 3]` and truthPartial = `[0]`, the player learns that geology, biology, AND resonance are all at play. Frame-lock means picking just one.

3. **Each hypothesis should have at least one piece of supporting evidence.** No hypothesis should be obviously absurd from the start — players need to feel the pull of each one.

4. **The risky scan should support multiple hypotheses.** It's the most informative evidence, which is why it comes with a cost. The best data is expensive.

5. **Write hypotheses that a smart person would genuinely debate.** If your test audience dismisses three of four options immediately, the encounter won't teach cognitive flexibility.

---

## Scoring Psychology

The scoring system has two axes, each worth 50 points:

### Open-Mindedness (0-50)
Measured by counting how many hypotheses remain **active** (not dismissed) each time the player reveals evidence. The formula:

```
openness = (actual_snapshots / max_possible_snapshots) × 50
```

If a player keeps all 4 hypotheses active across 4 scans, they score 50. If they dismiss 3 hypotheses after the first scan, they score low.

**Design implication:** Your evidence should be ambiguous enough that keeping multiple hypotheses alive feels *reasonable*, not just strategically optimal.

### Discovery Accuracy (0-50)
Calculated in the report phase when players select which hypotheses they believe are viable:

- **+20** for each primary truth selected
- **+10** for each partial truth selected
- **-8** for each wrong hypothesis selected
- **-12** for each primary truth missed
- **+20** base offset (so scores don't go negative)
- Clamped to 0-50

**Design implication:** The scoring rewards selecting ALL correct answers (including partial truths). A player who picks just one correct answer scores lower than one who picks two correct + one partial.

---

## Adding Scene Visuals

Each encounter has a CSS-animated overlay. To add a new one:

### 1. Add a CSS class in `src/style.css`

```css
.scene-yourscene {
  background: linear-gradient(180deg, #1a0a2e 0%, #0d0d24 100%);
}
```

### 2. Add the overlay builder in `src/ui/scenes.js`

```javascript
// Inside buildSceneOverlay():
case 'scene-yourscene': {
  // Create animated elements
  const el = document.createElement('div');
  el.className = 'yourscene-element';
  overlay.appendChild(el);
  break;
}
```

### 3. Add keyframe animations in CSS

```css
.yourscene-element {
  position: absolute;
  /* ... your animated shapes */
  animation: yourAnimation 3s ease-in-out infinite;
}

@keyframes yourAnimation {
  0%, 100% { opacity: 0.3; }
  50% { opacity: 0.8; }
}
```

### 4. Reference in your encounter data

```javascript
sceneClass: 'scene-yourscene',
sceneImage: 'images/your-scene.png',
```

Existing scene types to reference: `scene-pulse` (crystal glow), `scene-architects` (hex columns), `scene-signal` (EM waves), `scene-migration` (flowing motes), `scene-archive` (mineral strata), `scene-response` (combined effects).

---

## Ship Logs

Ship logs appear between encounters. They're defined in the `SHIP_LOGS` array in `encounters.js`:

```javascript
export const SHIP_LOGS = [
  `After the basin, you brief Mission Control...`,  // After encounter 1
  `The column data raises more questions...`,        // After encounter 2
  // ... one fewer log than total encounters
];
```

You need **N-1 logs** for N encounters. Each log transitions the narrative from the encounter just completed to the next one.

---

## Customizing the Theme

The space theme lives in CSS custom properties at the top of `style.css`:

```css
:root {
  --bg-deep: #060613;        /* Deepest background */
  --bg-surface: #0d0d24;     /* Card/surface background */
  --bg-card: rgba(255,255,255,0.04);
  --accent-cyan: #00e5ff;    /* Primary accent */
  --accent-amber: #ffb347;   /* Secondary accent */
  --accent-magenta: #ff47ab; /* Alert/highlight */
  --accent-green: #47ffa0;   /* Success */
  --accent-red: #ff4757;     /* Danger */
  --text-primary: #e4e4f0;
  --text-dim: #7777a0;
}
```

To re-theme (e.g., underwater, archaeological, fantasy):
1. Change these CSS variables
2. Update scene classes and animations
3. Replace images in `public/images/`
4. Update text in `index.html` (title screen)
5. Update narrative text in encounters data

The glass-morphism effects (`backdrop-filter: blur`, semi-transparent backgrounds) work with any color scheme.

---

## Swapping Images

Images live in `public/images/` and are referenced by path in encounter data:

| Image | Used For | Recommended Size |
|-------|----------|-----------------|
| `bridge-approach.png` | Title screen hero | 1200×600+ |
| `encounter-*.png` | Scene background per encounter | 800×400+ |
| `ship-log.png` | Ship log transition screen | 800×400+ |

Images are displayed with `object-fit: cover` so they'll be cropped to fit. Wider is better than taller. Dark, moody images work best with the overlay text.

For icons, the game uses simple white SVGs (128×128) in `public/icons/`. The brutalist "bob" style is optional — any white-on-transparent SVG works.

---

## Explorer Ranks

Ranks are defined in the `RANKS` array:

```javascript
export const RANKS = [
  { name: 'Frame-Locked', min: 0,  max: 39, cls: 'rank-fl', desc: '...' },
  { name: 'Investigator', min: 40, max: 59, cls: 'rank-inv', desc: '...' },
  { name: 'Wayfinder',    min: 60, max: 79, cls: 'rank-wf',  desc: '...' },
  { name: 'Pathfinder',   min: 80, max: 100, cls: 'rank-pf', desc: '...' },
];
```

Each rank has a CSS class for styling and a description shown on the final results screen.

---

## The Scoreboard

The scoreboard uses a PHP backend (`scores.php`) that stores scores in a JSON file. To set up on your own server:

1. Copy `scores.php` to your web root alongside the built game
2. Create a `data/` directory next to it, writable by the web server:
   ```bash
   mkdir data
   chmod 777 data
   ```
3. Add a `data/.htaccess` with `Deny from all` to prevent direct access
4. The PHP file auto-creates `data/scores.json` on first use

The scoreboard is entirely optional. If you don't have a PHP server, the game works fine without it — the scoreboard section simply won't render any data.

To change the API URL, edit `src/game/scoreboard.js`:
```javascript
const API_URL = import.meta.env.PROD
  ? '/your/path/scores.php'   // Production URL
  : '/scores.php';            // Dev URL
```

---

## Deploying

```bash
# Build for production
npm run build

# The dist/ folder contains everything
# Upload to any static hosting (Netlify, Vercel, GitHub Pages, Apache, etc.)
```

If deploying to a subdirectory (not the root), update `vite.config.js`:

```javascript
export default defineConfig({
  base: '/your/subdirectory/',
});
```

---

## Tips for AI Creators

If you're an AI building scenarios from a prompt:

1. **Start with the truth**, then work backwards. Decide what's really happening, then design hypotheses that each capture a piece of that truth.
2. **Write the risky scan last.** It should be the most revealing evidence AND have the most dramatic consequence.
3. **Connection notes build the meta-narrative.** Each encounter's `connectionNote` should reference discoveries from earlier encounters, building toward a bigger revelation.
4. **Test the ambiguity.** Read each piece of evidence and ask: "Does this genuinely support the hypotheses it claims to?" If any tag feels forced, rewrite the evidence.
5. **The best encounters make the player change their mind at least once.** If the evidence doesn't challenge initial assumptions, it's not ambiguous enough.

---

## License

MIT — build whatever you want with this. Credit appreciated but not required.

Made with curiosity by Allen Partridge and Claude.
