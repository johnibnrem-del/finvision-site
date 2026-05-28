// ── Scroll reveal ──────────────────────────────────────────────
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      revealObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -32px 0px' });

document.querySelectorAll('[data-animate]').forEach((el, i) => {
  const delay = parseInt(el.dataset.delay || (i % 5) * 55, 10);
  el.style.transitionDelay = delay + 'ms';
  revealObserver.observe(el);
});

// ── Counter animation ──────────────────────────────────────────
function animateCount(el, target, duration = 1200) {
  const start = performance.now();
  const update = (now) => {
    const t = Math.min((now - start) / duration, 1);
    const ease = 1 - Math.pow(1 - t, 3);
    el.textContent = Math.round(ease * target);
    if (t < 1) requestAnimationFrame(update);
    else el.textContent = target;
  };
  requestAnimationFrame(update);
}

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      const target = parseInt(e.target.dataset.count, 10);
      if (!isNaN(target)) animateCount(e.target, target);
      counterObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.5 });
document.querySelectorAll('[data-count]').forEach(el => counterObserver.observe(el));

// ── 3D Tilt ────────────────────────────────────────────────────
document.querySelectorAll('.tilt').forEach(card => {
  card.addEventListener('mousemove', e => {
    const r = card.getBoundingClientRect();
    const x = e.clientX - r.left;
    const y = e.clientY - r.top;
    const cx = r.width / 2;
    const cy = r.height / 2;
    const rotX = ((y - cy) / cy) * -6;
    const rotY = ((x - cx) / cx) *  6;
    card.style.transform = `perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateZ(4px)`;
    card.style.boxShadow = `${-rotY * 2}px ${rotX * 2}px 28px rgba(124,58,237,0.15)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
    card.style.boxShadow = '';
  });
});

// ── Flip cards ────────────────────────────────────────────────
document.querySelectorAll('.flip-card').forEach(card => {
  card.addEventListener('click', () => card.classList.toggle('flipped'));
  // Keyboard support
  card.setAttribute('tabindex', '0');
  card.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      card.classList.toggle('flipped');
    }
  });
});

// ── Expandable cards ──────────────────────────────────────────
document.querySelectorAll('.expandable').forEach(card => {
  const trigger = card.querySelector('.expand-trigger');
  if (!trigger) return;
  card.addEventListener('click', e => {
    // Don't expand if clicking a link inside
    if (e.target.tagName === 'A' || e.target.closest('a')) return;
    card.classList.toggle('open');
  });
  card.setAttribute('tabindex', '0');
  card.addEventListener('keydown', e => {
    if (e.key === 'Enter') { e.preventDefault(); card.classList.toggle('open'); }
  });
});

// ── FAQ accordion ──────────────────────────────────────────────
document.querySelectorAll('.faq-item').forEach(item => {
  const q = item.querySelector('.faq-q');
  if (!q) return;
  q.addEventListener('click', () => {
    const isOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item.open').forEach(o => o.classList.remove('open'));
    if (!isOpen) item.classList.add('open');
  });
});

// ── Navbar scroll ─────────────────────────────────────────────
const navbar = document.getElementById('navbar');
if (navbar) {
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 20);
  }, { passive: true });
}

// ── Mobile menu ───────────────────────────────────────────────
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobile-menu');
if (hamburger && mobileMenu) {
  hamburger.addEventListener('click', () => {
    const open = hamburger.classList.toggle('open');
    mobileMenu.classList.toggle('open', open);
    hamburger.setAttribute('aria-expanded', open);
    document.body.style.overflow = open ? 'hidden' : '';
  });
  mobileMenu.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      hamburger.classList.remove('open');
      mobileMenu.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });
}

// ── Smooth scroll for anchor links ────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// ── Typing effect ─────────────────────────────────────────────
function startTyping(el) {
  const lines = (el.dataset.typing || '').split('|');
  if (!lines.length) return;
  let lineIdx = 0;
  let charIdx = 0;
  let deleting = false;
  let pauseTicks = 0;

  el.classList.add('typing-cursor');

  const tick = () => {
    const current = lines[lineIdx];
    if (!deleting) {
      if (charIdx < current.length) {
        el.textContent = current.slice(0, ++charIdx);
      } else {
        pauseTicks++;
        if (pauseTicks > 30) { deleting = true; pauseTicks = 0; }
      }
    } else {
      if (charIdx > 0) {
        el.textContent = current.slice(0, --charIdx);
      } else {
        deleting = false;
        lineIdx = (lineIdx + 1) % lines.length;
      }
    }
    setTimeout(tick, deleting ? 40 : 60);
  };
  tick();
}

document.querySelectorAll('[data-typing]').forEach(startTyping);

// ── Bar chart animation on scroll ────────────────────────────
const barObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.querySelectorAll('.cbar').forEach((bar, i) => {
        bar.style.animationDelay = `${i * 80}ms`;
        bar.style.animationPlayState = 'running';
      });
      barObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.3 });
document.querySelectorAll('.illus-chart').forEach(el => {
  el.querySelectorAll('.cbar').forEach(b => b.style.animationPlayState = 'paused');
  barObserver.observe(el);
});

// ── Stagger children ─────────────────────────────────────────
document.querySelectorAll('[data-stagger]').forEach(parent => {
  Array.from(parent.children).forEach((child, i) => {
    child.style.transitionDelay = `${i * 60}ms`;
  });
});
