export function buildSceneVisual(encounter) {
  const div = document.createElement('div');
  div.className = 'scene-visual ' + encounter.sceneClass;

  // Background image layer
  if (encounter.sceneImage) {
    const img = document.createElement('img');
    img.src = encounter.sceneImage;
    img.alt = '';
    img.className = 'scene-bg-img';
    div.appendChild(img);
  }

  // Animated overlay elements
  const overlay = document.createElement('div');
  overlay.className = 'scene-overlay';

  if (encounter.id === 'pulse') {
    overlay.innerHTML = '<div class="pulse-core"></div>';
    for (let i = 0; i < 30; i++) {
      const c = document.createElement('div');
      c.className = 'crystal';
      c.style.left = (5 + Math.random() * 90) + '%';
      c.style.height = (30 + Math.random() * 80) + 'px';
      c.style.opacity = (0.3 + Math.random() * 0.5).toFixed(2);
      c.style.transform = `rotate(${-5 + Math.random() * 10}deg)`;
      overlay.appendChild(c);
    }
  } else if (encounter.id === 'architects') {
    for (let i = 0; i < 20; i++) {
      const c = document.createElement('div');
      c.className = 'column';
      const w = 14 + Math.random() * 20;
      c.style.width = w + 'px';
      c.style.height = (40 + Math.random() * 100) + 'px';
      c.style.left = (i * 5 + Math.random() * 3) + '%';
      c.style.opacity = (0.4 + Math.random() * 0.4).toFixed(2);
      overlay.appendChild(c);
    }
  } else if (encounter.id === 'message') {
    for (let i = 0; i < 5; i++) {
      const w = document.createElement('div');
      w.className = 'wave';
      w.style.animationDelay = (i * 0.6) + 's';
      overlay.appendChild(w);
    }
  } else if (encounter.id === 'migration') {
    // Flowing luminous particles moving left to right
    for (let i = 0; i < 25; i++) {
      const p = document.createElement('div');
      p.className = 'mote';
      p.style.top = (10 + Math.random() * 80) + '%';
      p.style.animationDuration = (3 + Math.random() * 4) + 's';
      p.style.animationDelay = (Math.random() * 5) + 's';
      p.style.setProperty('--size', (2 + Math.random() * 4) + 'px');
      p.style.opacity = (0.4 + Math.random() * 0.6).toFixed(2);
      overlay.appendChild(p);
    }
  } else if (encounter.id === 'archive') {
    // Horizontal banding lines like mineral strata
    for (let i = 0; i < 15; i++) {
      const band = document.createElement('div');
      band.className = 'stratum';
      band.style.top = (5 + i * 6.5) + '%';
      band.style.height = (1 + Math.random() * 3) + 'px';
      band.style.opacity = (0.15 + Math.random() * 0.3).toFixed(2);
      band.style.animationDelay = (i * 0.2) + 's';
      overlay.appendChild(band);
    }
  } else if (encounter.id === 'response') {
    // Combined: pulse + waves + motes — everything reacting
    overlay.innerHTML = '<div class="pulse-core response-pulse"></div>';
    for (let i = 0; i < 3; i++) {
      const w = document.createElement('div');
      w.className = 'wave response-wave';
      w.style.animationDelay = (i * 0.8) + 's';
      overlay.appendChild(w);
    }
    for (let i = 0; i < 10; i++) {
      const p = document.createElement('div');
      p.className = 'mote';
      p.style.top = (10 + Math.random() * 80) + '%';
      p.style.animationDuration = (2 + Math.random() * 3) + 's';
      p.style.animationDelay = (Math.random() * 3) + 's';
      p.style.setProperty('--size', (2 + Math.random() * 3) + 'px');
      p.style.opacity = (0.3 + Math.random() * 0.5).toFixed(2);
      overlay.appendChild(p);
    }
  }

  div.appendChild(overlay);
  return div;
}
