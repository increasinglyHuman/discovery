export function createStarfield() {
  const el = document.getElementById('starfield');
  const count = Math.min(150, Math.floor(window.innerWidth * window.innerHeight / 6000));
  for (let i = 0; i < count; i++) {
    const star = document.createElement('div');
    star.className = 'star';
    const size = Math.random() < 0.85 ? 1 : Math.random() < 0.5 ? 2 : 3;
    star.style.width = size + 'px';
    star.style.height = size + 'px';
    star.style.left = Math.random() * 100 + '%';
    star.style.top = Math.random() * 100 + '%';
    star.style.setProperty('--dur', (2 + Math.random() * 4) + 's');
    star.style.setProperty('--oMin', (0.1 + Math.random() * 0.3).toFixed(2));
    star.style.setProperty('--oMax', (0.5 + Math.random() * 0.5).toFixed(2));
    star.style.animationDelay = (Math.random() * 4) + 's';
    el.appendChild(star);
  }
}
