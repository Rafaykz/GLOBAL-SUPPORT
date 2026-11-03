document.addEventListener('DOMContentLoaded', () => {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const elements = document.querySelectorAll('.reveal, .left, .right');
  if ('IntersectionObserver' in window && !reduced) {
    document.documentElement.classList.add('motion-ready');
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, {threshold: 0.06});
    elements.forEach(el => observer.observe(el));
  } else elements.forEach(el => el.classList.add('visible'));
  const progress = document.createElement('div');
  progress.className = 'reading-progress';
  progress.setAttribute('aria-hidden', 'true');
  document.body.appendChild(progress);
  const nav = document.querySelector('.navbar');
  const back = document.querySelector('.backtop');
  let pending = false;
  const update = () => {
    const height = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.transform = `scaleX(${height > 0 ? Math.min(window.scrollY / height, 1) : 0})`;
    nav?.classList.toggle('is-scrolled', window.scrollY > 30);
    back?.classList.toggle('show', window.scrollY > 450);
    pending = false;
  };
  window.addEventListener('scroll', () => {
    if (!pending) { pending = true; requestAnimationFrame(update); }
  }, {passive:true});
  window.addEventListener('resize', update);
  update();
  back?.addEventListener('click', () => window.scrollTo({top:0, behavior:reduced ? 'auto' : 'smooth'}));
  const current = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link, .dropdown-item').forEach(link => {
    if (link.getAttribute('href') === current) {
      link.classList.add('active');
      link.setAttribute('aria-current','page');
    }
  });
});
