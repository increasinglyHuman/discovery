# PATHFINDER: First Contact Protocol

> *"The illiterate of the 21st century will not be those who cannot read and write, but those who cannot learn, unlearn, and relearn."*
> — Often attributed to Alvin Toffler, actually a mashup of Toffler + psychologist Herbert Gerjuoy

An interactive minigame that teaches **cognitive flexibility** through alien exploration. Built as a companion piece to a short-form video about critical thinking, frame-lock, and ambiguity tolerance.

[![Play Now](https://img.shields.io/badge/Play_Now-poqpoq.com-00e5ff?style=for-the-badge)](https://poqpoq.com/adobe/pathfinder/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](LICENSE)
[![Built With](https://img.shields.io/badge/Built_With-Vite-646CFF?style=for-the-badge)](https://vitejs.dev/)

---

## The Concept

### `fight-or-flight-or-frame-lock`

When your brain encounters ambiguity, it wants to resolve the tension **fast**. Your amygdala fires, your threat-detection system spins up, and you grab the first explanation that reduces anxiety. That's **frame-lock** — the cognitive equivalent of fight-or-flight, but for ideas.

This game puts you in a context where frame-lock would cause you to *miss the bigger picture*.

### `cognitive-flexibility` `ambiguity-tolerance` `critical-thinking`

The player is a science officer making first contact with alien phenomena. The scoring system rewards:
- **Open-mindedness** — keeping multiple hypotheses alive while gathering evidence
- **Discovery accuracy** — correctly identifying which explanations fit the data

Players who lock onto a single explanation early score poorly. Players who hold competing ideas without panic — who **stay curious longer than feels comfortable** — discover the deeper truth.

### `frames-and-framing` `lakoff` `gerjuoy`

The game's design is informed by:
- **George Lakoff's** work on cognitive framing — the frame is the message
- **Herbert Gerjuoy's** original insight (via Toffler) — the illiterate of the future are those who haven't learned *how to learn*
- **Neuroscience of threat response** — the amygdala doesn't care about your epistemology

### `energy-budget` `risk-mechanics`

Not every scan is free. The scanner has limited power, and some tests carry real consequences — provoking unknown organisms, announcing your presence to a planetary system. The wisest explorers know which questions to ask and which stones to leave unturned.

---

## Play It

**Live:** [poqpoq.com/adobe/pathfinder/](https://poqpoq.com/adobe/pathfinder/)

**Local development:**
```bash
npm install
npm run dev
```

**Production build:**
```bash
npm run build
npm run preview
```

---

## Architecture

```
src/
├── main.js                 ← Entry point
├── style.css               ← Mobile-first styles
├── state.js                ← Reactive game state
├── data/
│   └── encounters.js       ← 3 encounters, ship logs, ranks
├── ui/
│   ├── starfield.js        ← Procedural starfield
│   ├── scenes.js           ← Scene visuals (image + CSS overlays)
│   └── screens.js          ← Screen transitions
└── game/
    ├── encounter.js         ← Encounter rendering
    ├── evidence.js          ← Scan mechanics + risk dialogs
    ├── energy.js            ← Power budget system
    ├── hypotheses.js        ← Hypothesis management
    ├── report.js            ← Report phase + scoring
    └── results.js           ← Results, ship log, final reveal
```

Zero dependencies. Vanilla JS + Vite. Mobile-first. The entire game logic is ~30KB gzipped.

---

## Discovery Packs

The architecture supports additional encounter packs. Each encounter is a self-contained data object — new scenarios can be added to `src/data/encounters.js` without touching game logic.

---

## Credits

**Concept & Direction:** Allen Partridge ([@doctorpartridge](https://www.linkedin.com/in/doctorpartridge/))
**Development:** Claude (Anthropic) — architecture, game logic, scoring system, CSS, and module structure
**Scene Art:** Generated with [Meshy AI](https://www.meshy.ai/)
**Icons:** Brutalist Bob icon set

## Intellectual Roots

- Alvin Toffler — *Future Shock* (1970), *Rethinking the Future* (1997)
- Herbert Gerjuoy — "Tomorrow's illiterate will not be the man who can't read, but the man who has not learned how to learn"
- George Lakoff — *Don't Think of an Elephant*, *Metaphors We Live By*
- Neuroscience of amygdala hijack, cognitive flexibility, and distress tolerance in the presence of ambiguity

---

*Built for the LinkedIn learning community. Designed to make you uncomfortable — in the best way.*
