/* Cursor */
const cf = document.getElementById('cf');
let mx = 0,
  my = 0,
  rx = 0,
  ry = 0;
document.addEventListener('mousemove', (e) => {
  mx = e.clientX;
  my = e.clientY;
});
(function tick() {
  rx += (mx - rx) * 0.15;
  ry += (my - ry) * 0.15;
  cf.style.left = rx + 'px';
  cf.style.top = ry + 'px';
  requestAnimationFrame(tick);
})();
document.querySelectorAll('a,button,.pc,.sk,.lc,.n-btn,.ci-link').forEach((el) => {
  el.addEventListener('mouseenter', () => {
    cf.classList.add('hovered');
  });
  el.addEventListener('mouseleave', () => {
    cf.classList.remove('hovered');
  });
});

/* Navbar + progress */
const nav = document.getElementById('nav'),
  bar = document.getElementById('bar');
const nAs = document.querySelectorAll('.n-links a'),
  secs = document.querySelectorAll('section[id]');
window.addEventListener('scroll', () => {
  nav.classList.toggle('sc', scrollY > 20);
  bar.style.width = (scrollY / (document.body.scrollHeight - innerHeight) * 100) + '%';
  let cur = '';
  secs.forEach((s) => {
    if (scrollY >= s.offsetTop - 120) cur = s.id;
  });
  nAs.forEach((a) => a.classList.toggle('active', a.getAttribute('href') === '#' + cur));
});

/* Reveal */
const obs = new IntersectionObserver((es) => {
  es.forEach((e) => {
    if (e.isIntersecting) {
      e.target.classList.add('on');
      obs.unobserve(e.target);
    }
  });
}, {
  threshold: 0.08,
  rootMargin: '0px 0px -44px 0px'
});
document.querySelectorAll('.rv').forEach((el) => obs.observe(el));
window.addEventListener('load', () => document.querySelectorAll('#hero .rv').forEach((el) => el.classList.add('on')));

/* Mobile menu */
function cm() {
  document.getElementById('mob').classList.remove('open');
}


/* Brush parallax */
const brush = document.getElementById('brush');
document.addEventListener('mousemove', (e) => {
  if (!brush) return;
  const x = (e.clientX / innerWidth - 0.5) * 16,
    y = (e.clientY / innerHeight - 0.5) * 12;
  brush.style.transform = `translate(calc(-50% + ${x}px), calc(-52% + ${y}px))`;
});
