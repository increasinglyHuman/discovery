export function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  const screen = document.getElementById('screen-' + id);
  screen.classList.add('active');
  screen.style.animation = 'none';
  screen.offsetHeight; // force reflow
  screen.style.animation = '';
  window.scrollTo({ top: 0, behavior: 'smooth' });
}
