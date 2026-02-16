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
  }

  div.appendChild(overlay);
  return div;
}
