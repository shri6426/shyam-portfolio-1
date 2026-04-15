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

/* ===== HERO CANVAS PARTICLES ===== */
(function() {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  
  // Clean up opacity from CSS logic
  canvas.style.opacity = '1';

  let w = canvas.width = window.innerWidth;
  let h = canvas.height = window.innerHeight;
  window.addEventListener('resize', () => {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
    initParticles();
  });

  const particles = [];
  // Use more dense particles for better interactive mesh
  const numParticles = 140; 
  
  let mouse = { x: -1000, y: -1000 };
  document.addEventListener('mousemove', e => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });
  document.addEventListener('mouseleave', () => {
    mouse.x = -1000;
    mouse.y = -1000;
  });

  function initParticles() {
    particles.length = 0;
    for (let i = 0; i < numParticles; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 0.6 + 0.15;
        // Randomly pick a color scheme (mostly dark charcoal, occasionally pink/teal)
        let col = '#222222';
        const chance = Math.random();
        if (chance > 0.95) col = '#ee2a90'; // pink
        else if (chance > 0.90) col = '#3a9e8d'; // teal
        
        particles.push({
            x: Math.random() * w,
            y: Math.random() * h,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            r: Math.random() * 2 + 1.5,
            color: col
        });
    }
  }

  function draw() {
    ctx.clearRect(0, 0, w, h);
    
    for (let i = 0; i < numParticles; i++) {
      let p = particles[i];

      // Update position
      p.x += p.vx;
      p.y += p.vy;

      // Bounce off walls smoothly
      if (p.x < -20) p.vx = Math.abs(p.vx);
      if (p.x > w + 20) p.vx = -Math.abs(p.vx);
      if (p.y < -20) p.vy = Math.abs(p.vy);
      if (p.y > h + 20) p.vy = -Math.abs(p.vy);

      // Mouse repulsion physics
      let mdx = p.x - mouse.x;
      let mdy = p.y - mouse.y;
      let mDist = Math.sqrt(mdx*mdx + mdy*mdy);
      
      const mouseInfluenceDist = 180;
      if (mDist < mouseInfluenceDist) {
         // Push particle away
         const force = (mouseInfluenceDist - mDist) / mouseInfluenceDist;
         const forceX = (mdx / mDist) * force * 4;
         const forceY = (mdy / mDist) * force * 4;
         p.x += forceX;
         p.y += forceY;
      }

      // Draw particle circle
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      if (p.color !== '#222222') {
          ctx.shadowBlur = 12;
          ctx.shadowColor = p.color;
      } else {
          ctx.shadowBlur = 0;
      }
      ctx.fill();
      ctx.shadowBlur = 0; // reset
      
      // Neighbor Connections
      for (let j = i + 1; j < numParticles; j++) {
        let p2 = particles[j];
        let dx = p.x - p2.x;
        let dy = p.y - p2.y;
        let distSq = dx*dx + dy*dy;
        
        let connectDistSq = 16000;
        if (distSq < connectDistSq) { 
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p2.x, p2.y);
          let alpha = 1 - (Math.sqrt(distSq) / Math.sqrt(connectDistSq));
          // default line color
          ctx.strokeStyle = `rgba(120, 120, 120, ${alpha * 0.18})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }

      // Mouse Connection Line
      if (mDist < mouseInfluenceDist * 1.2) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(mouse.x, mouse.y);
          let mAlpha = 1 - (mDist / (mouseInfluenceDist * 1.2));
          ctx.strokeStyle = `rgba(238, 42, 144, ${mAlpha * 0.5})`;
          ctx.lineWidth = 1.2;
          ctx.stroke();
      }
    }
    requestAnimationFrame(draw);
  }

  initParticles();
  draw();
})();
