/* ================================================================
   GAGAN C B — PORTFOLIO SCRIPT
   Features: Loader, Custom Cursor, Hero Canvas, Typed Text,
   Scroll Reveal, Skill Bars, Counter Animation, Parallax,
   Tilt Cards, Nav Active State, Smooth Scroll
   ================================================================ */

(() => {
  'use strict';

  // ── LOADER ──────────────────────────────────────────────────────
  const loader     = document.getElementById('loader');
  const loaderBar  = document.getElementById('loader-bar');
  const loaderPct  = document.getElementById('loader-pct');

  let pct = 0;
  const loaderInterval = setInterval(() => {
    pct += Math.random() * 18 + 4;
    if (pct >= 100) { pct = 100; clearInterval(loaderInterval); }
    loaderBar.style.width = pct + '%';
    loaderPct.textContent = Math.floor(pct) + '%';
    if (pct === 100) setTimeout(finishLoader, 400);
  }, 80);

  function finishLoader() {
    loader.classList.add('done');
    document.body.style.overflow = '';
    startHeroCanvas();
    initTyped();
    animateCounters();
  }
  document.body.style.overflow = 'hidden';

  // ── PROGRESS BAR ────────────────────────────────────────────────
  const pb = document.createElement('div');
  pb.id = 'progress-bar';
  document.body.prepend(pb);
  window.addEventListener('scroll', () => {
    const s = document.documentElement.scrollTop;
    const h = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    pb.style.width = ((s / h) * 100) + '%';
  }, { passive: true });

  // ── CURSOR ──────────────────────────────────────────────────────
  const dot  = document.getElementById('cursor-dot');
  const ring = document.getElementById('cursor-ring');
  if (dot && ring) {
    let mx = 0, my = 0, rx = 0, ry = 0;
    document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; }, { passive: true });
    (function animCursor() {
      dot.style.left  = mx + 'px';   dot.style.top  = my + 'px';
      rx += (mx - rx) * 0.13;        ry += (my - ry) * 0.13;
      ring.style.left = rx + 'px';   ring.style.top = ry + 'px';
      requestAnimationFrame(animCursor);
    })();
    document.querySelectorAll('a, button, .cert-item, .exp-card, .proj-mockup, .skill-chip-lg, .fact').forEach(el => {
      el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
      el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
    });
  }

  // ── NAV ─────────────────────────────────────────────────────────
  const nav       = document.getElementById('nav');
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('nav-links');

  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 40);
  }, { passive: true });

  hamburger?.addEventListener('click', () => {
    navLinks.classList.toggle('open');
    const spans = hamburger.querySelectorAll('span');
    if (navLinks.classList.contains('open')) {
      spans[0].style.transform = 'rotate(45deg) translate(5px,5px)';
      spans[1].style.opacity = '0';
    } else {
      spans[0].style.transform = '';
      spans[1].style.opacity = '';
    }
  });

  // Close menu on link click
  navLinks?.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      navLinks.classList.remove('open');
      hamburger?.querySelectorAll('span').forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
    });
  });

  // Smooth scroll
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // ── HERO CANVAS (Constellation / Particles) ──────────────────────
  function startHeroCanvas() {
    const canvas = document.getElementById('hero-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let W, H, particles = [], mouse = { x: -9999, y: -9999 };

    function resize() {
      W = canvas.width  = canvas.offsetWidth;
      H = canvas.height = canvas.offsetHeight;
    }
    resize();
    window.addEventListener('resize', resize, { passive: true });
    document.getElementById('hero')?.addEventListener('mousemove', e => {
      const r = canvas.getBoundingClientRect();
      mouse.x = e.clientX - r.left;
      mouse.y = e.clientY - r.top;
    }, { passive: true });
    document.getElementById('hero')?.addEventListener('mouseleave', () => {
      mouse.x = -9999; mouse.y = -9999;
    });

    class Particle {
      constructor() { this.reset(); }
      reset() {
        this.x   = Math.random() * W;
        this.y   = Math.random() * H;
        this.vx  = (Math.random() - .5) * .35;
        this.vy  = (Math.random() - .5) * .35;
        this.r   = Math.random() * 1.6 + .4;
        this.a   = Math.random() * .5 + .1;
        this.col = Math.random() > .65 ? [232, 164, 53] : [240, 232, 216];
      }
      update() {
        // Mouse repel
        const dx = this.x - mouse.x, dy = this.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 100) {
          this.vx += (dx / dist) * .6;
          this.vy += (dy / dist) * .6;
        }
        this.vx *= .98; this.vy *= .98;
        this.x  += this.vx; this.y  += this.vy;
        if (this.x < 0 || this.x > W || this.y < 0 || this.y > H) this.reset();
      }
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${this.col[0]},${this.col[1]},${this.col[2]},${this.a})`;
        ctx.fill();
      }
    }

    const N = Math.min(80, Math.floor(W * H / 12000));
    for (let i = 0; i < N; i++) particles.push(new Particle());

    function connect() {
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const d  = Math.sqrt(dx * dx + dy * dy);
          if (d < 120) {
            const a = .08 * (1 - d / 120);
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(232,164,53,${a})`;
            ctx.lineWidth = .5;
            ctx.stroke();
          }
        }
      }
    }

    function frame() {
      ctx.clearRect(0, 0, W, H);
      particles.forEach(p => { p.update(); p.draw(); });
      connect();
      requestAnimationFrame(frame);
    }
    frame();
  }

  // ── TYPED TEXT ──────────────────────────────────────────────────
  function initTyped() {
    const el = document.getElementById('typed-role');
    if (!el) return;
    const roles = [
      'Augmented Software Engineer',
      'Java & Spring Boot Developer',
      'AI Systems Builder',
      'Full Stack Engineer',
      'NLP Integration Specialist'
    ];
    let ri = 0, ci = 0, deleting = false, paused = false;
    function tick() {
      const current = roles[ri];
      if (!deleting) {
        ci++;
        el.textContent = current.slice(0, ci);
        if (ci === current.length) {
          paused = true;
          setTimeout(() => { deleting = true; paused = false; tick(); }, 2400);
          return;
        }
      } else {
        ci--;
        el.textContent = current.slice(0, ci);
        if (ci === 0) {
          deleting = false;
          ri = (ri + 1) % roles.length;
          setTimeout(tick, 350);
          return;
        }
      }
      if (!paused) setTimeout(tick, deleting ? 45 : 85);
    }
    setTimeout(tick, 600);
  }

  // ── COUNTER ANIMATION ────────────────────────────────────────────
  function animateCounters() {
    const strip = document.querySelector('.hero-stats-strip');
    if (!strip) return;
    strip.querySelectorAll('[data-count]').forEach(el => {
      const target  = parseInt(el.dataset.count);
      const suffix  = el.dataset.suffix || '';
      const dur     = 1800;
      const start   = performance.now();
      function update(now) {
        const t = Math.min((now - start) / dur, 1);
        const ease = 1 - Math.pow(1 - t, 4);
        el.textContent = Math.floor(ease * target) + (t === 1 ? suffix : '');
        if (t < 1) requestAnimationFrame(update);
      }
      requestAnimationFrame(update);
    });
  }

  // ── SCROLL REVEAL ────────────────────────────────────────────────
  const revealObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el    = entry.target;
      const delay = parseInt(el.dataset.delay || 0);
      setTimeout(() => {
        el.classList.add('revealed');
        // Trigger skill bars inside
        el.querySelectorAll('.sb-fill[data-pct]').forEach(bar => {
          setTimeout(() => bar.style.width = bar.dataset.pct + '%', 100);
        });
      }, delay);
      revealObs.unobserve(el);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

  document.querySelectorAll('[data-reveal]').forEach(el => revealObs.observe(el));

  // Also observe skill bars directly
  const barObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.querySelectorAll('.sb-fill[data-pct]').forEach(bar => {
          setTimeout(() => bar.style.width = bar.dataset.pct + '%', 200);
        });
        barObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });
  document.querySelectorAll('.skills-col').forEach(col => barObs.observe(col));

  // ── TILT EFFECT ON PROJECT MOCKUPS ──────────────────────────────
  document.querySelectorAll('.proj-mockup').forEach(card => {
    const wrap = card.closest('.proj-visual');
    if (!wrap) return;
    wrap.addEventListener('mousemove', e => {
      const r = wrap.getBoundingClientRect();
      const x = ((e.clientX - r.left) / r.width  - .5) * 14;
      const y = ((e.clientY - r.top)  / r.height - .5) * -10;
      card.style.transform = `perspective(800px) rotateY(${x}deg) rotateX(${y}deg) translateY(-8px)`;
    });
    wrap.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });

  // ── PARALLAX ON HERO BG WORD ─────────────────────────────────────
  const bgWord = document.querySelector('.hero-bg-word');
  const contactBgWord = document.querySelector('.contact-bg-word');
  window.addEventListener('scroll', () => {
    const sy = window.scrollY;
    if (bgWord) bgWord.style.transform = `translateX(-50%) translateY(${sy * 0.12}px)`;
    if (contactBgWord) {
      const r = contactBgWord.closest('section').getBoundingClientRect();
      contactBgWord.style.transform = `translateY(${r.top * -0.06}px)`;
    }
  }, { passive: true });

  // ── MAGNETIC EFFECT ON BUTTONS ───────────────────────────────────
  document.querySelectorAll('.cta-main, .cta-ghost, .nav-resume').forEach(btn => {
    btn.addEventListener('mousemove', e => {
      const r = btn.getBoundingClientRect();
      const x = (e.clientX - r.left - r.width  / 2) * .2;
      const y = (e.clientY - r.top  - r.height / 2) * .2;
      btn.style.transform = `translate(${x}px,${y}px)`;
    });
    btn.addEventListener('mouseleave', () => { btn.style.transform = ''; });
  });

  // ── ACTIVE NAV LINK ──────────────────────────────────────────────
  const sections  = document.querySelectorAll('section[id]');
  const navAs     = document.querySelectorAll('.nav-links a');

  const activeObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navAs.forEach(a => {
          a.style.color = a.getAttribute('href') === '#' + id
            ? 'var(--cream)' : '';
        });
      }
    });
  }, { threshold: 0.4 });
  sections.forEach(s => activeObs.observe(s));

  // ── HERO STATS REVEAL ON SCROLL ──────────────────────────────────
  // (Counters start on load; reinit if in view on scroll)
  let countersRun = true; // already run on load above

  // ── FLOATING LABELS ON SKILL CHIPS ──────────────────────────────
  document.querySelectorAll('.skill-chip-lg').forEach(chip => {
    chip.addEventListener('mouseenter', () => {
      chip.style.letterSpacing = '.1em';
    });
    chip.addEventListener('mouseleave', () => {
      chip.style.letterSpacing = '';
    });
  });

  // ── CERT ITEM HOVER GLOW ─────────────────────────────────────────
  document.querySelectorAll('.cert-item').forEach(item => {
    item.addEventListener('mouseenter', () => {
      item.style.boxShadow = '4px 0 0 0 var(--amber) inset';
    });
    item.addEventListener('mouseleave', () => {
      item.style.boxShadow = '';
    });
  });

  // ── EXPERIENCE CARD REVEAL ACCENT ───────────────────────────────
  document.querySelectorAll('.exp-card').forEach(card => {
    card.style.setProperty('--before-scale', '0');
    card.insertAdjacentHTML('afterbegin', '');
    const line = document.createElement('div');
    line.style.cssText = `
      position:absolute;top:0;left:0;right:0;height:2px;
      background:linear-gradient(90deg,var(--amber),transparent);
      transform:scaleX(0);transform-origin:left;
      transition:transform .5s cubic-bezier(0.16,1,0.3,1);
    `;
    card.style.position = 'relative';
    card.style.overflow = 'hidden';
    card.appendChild(line);
    card.addEventListener('mouseenter', () => { line.style.transform = 'scaleX(1)'; });
    card.addEventListener('mouseleave', () => { line.style.transform = 'scaleX(0)'; });
  });

  // ── RIPPLE ON CTA CLICK ──────────────────────────────────────────
  function addRipple(el) {
    el.addEventListener('click', e => {
      const r  = el.getBoundingClientRect();
      const rp = document.createElement('span');
      const size = Math.max(r.width, r.height) * 2;
      rp.style.cssText = `
        position:absolute;border-radius:50%;pointer-events:none;
        width:${size}px;height:${size}px;
        left:${e.clientX - r.left - size/2}px;
        top:${e.clientY - r.top - size/2}px;
        background:rgba(255,255,255,.15);
        transform:scale(0);animation:ripple .5s ease-out forwards;
      `;
      el.style.position = 'relative';
      el.style.overflow = 'hidden';
      el.appendChild(rp);
      setTimeout(() => rp.remove(), 600);
    });
  }
  const rippleStyle = document.createElement('style');
  rippleStyle.textContent = `@keyframes ripple{to{transform:scale(1);opacity:0}}`;
  document.head.appendChild(rippleStyle);
  document.querySelectorAll('.cta-main, .cta-ghost').forEach(addRipple);

  console.log('%c GAGAN C B — PORTFOLIO ', 'background:#e8a435;color:#0c0b09;font-weight:800;font-size:13px;padding:6px 14px');
  console.log('%c Augmented Software Engineer · Java · Spring Boot · AI ', 'color:#e8a435;font-size:11px');
})();