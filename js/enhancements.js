/**
 * WIRIS VIANA — Enhancements JS
 * Scroll progress bar, ticker, platform bars, refined interactions
 */

document.addEventListener('DOMContentLoaded', () => {

  const C = window.WV_CONFIG;

  // ── SCROLL PROGRESS BAR ──────────────────────────────────
  const progressBar = document.getElementById('scroll-progress');
  if (progressBar) {
    window.addEventListener('scroll', () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      progressBar.style.width = `${Math.min(progress, 100)}%`;
    }, { passive: true });
  }

  // ── LIVE TICKER CONTENT ──────────────────────────────────
  function buildTicker() {
    const ticker = document.getElementById('ticker-track');
    if (!ticker) return;

    const items = [
      `🎥 ${C.stats.totalFollowers.value.toLocaleString('pt-BR')} seguidores totais`,
      `📊 ${(C.stats.monthlyViews.value / 1000000).toFixed(0)}M+ visualizações por mês`,
      `🔴 ${C.stats.engagementRate.value}% taxa de engajamento`,
      `📱 Presente em TikTok, Instagram e YouTube`,
      `✅ Disponível para parcerias comerciais`,
      `🎬 Produção audiovisual profissional`,
      `📈 Crescimento consistente mês a mês`,
    ];

    // Duplicate for seamless loop
    const allItems = [...items, ...items];
    ticker.innerHTML = allItems.map(item =>
      `<span class="ticker-item">${item}</span>`
    ).join('');
  }

  buildTicker();

  // ── PLATFORM PROGRESS BARS ───────────────────────────────
  function buildPlatformBars() {
    const container = document.getElementById('platform-bars');
    if (!container) return;

    const platforms = C.platforms;
    const maxFollowers = Math.max(...platforms.map(p => p.followers));

    platforms.forEach((p, idx) => {
      const percentage = (p.followers / maxFollowers) * 100;

      const row = document.createElement('div');
      row.className = 'platform-bar-row';
      row.innerHTML = `
        <div class="platform-bar-label">${p.name}</div>
        <div class="platform-bar-track">
          <div
            class="platform-bar-fill"
            style="background:${p.color};transition-delay:${idx * 0.15}s"
            data-width="${percentage}"
          ></div>
        </div>
        <div class="platform-bar-value">${p.followers.toLocaleString('pt-BR')}</div>
      `;

      container.appendChild(row);
    });

    // Animate on scroll
    const barObserver = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        container.querySelectorAll('.platform-bar-fill').forEach(fill => {
          fill.style.width = fill.dataset.width + '%';
        });
        barObserver.disconnect();
      }
    }, { threshold: 0.4 });

    barObserver.observe(container);
  }

  buildPlatformBars();

  // ── KEYBOARD NAVIGATION ──────────────────────────────────
  // Allow skip to main content
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Tab' && !e.shiftKey) {
      const skipLink = document.getElementById('skip-main');
      if (skipLink) skipLink.style.transform = 'translateY(0)';
    }
  });

  // ── SMOOTH HOVER PARALLAX (very subtle, desktop only) ────
  if (window.matchMedia('(min-width: 1024px) and (prefers-reduced-motion: no-preference)').matches) {
    const heroImageWrap = document.querySelector('.hero-image-wrap');
    const floatCards = document.querySelectorAll('.hero-float-card');

    if (heroImageWrap) {
      document.addEventListener('mousemove', (e) => {
        const { clientX, clientY } = e;
        const { innerWidth, innerHeight } = window;
        const x = (clientX / innerWidth - 0.5) * 12;
        const y = (clientY / innerHeight - 0.5) * 8;

        heroImageWrap.style.transform = `perspective(1000px) rotateY(${x * 0.3}deg) rotateX(${-y * 0.2}deg)`;

        floatCards.forEach((card, i) => {
          const depth = (i + 1) * 0.4;
          card.style.transform = `translateY(${Math.sin(Date.now() / 2000 + i) * 8}px) translate(${x * depth * 0.5}px, ${y * depth * 0.4}px)`;
        });
      });

      document.addEventListener('mouseleave', () => {
        heroImageWrap.style.transform = '';
        floatCards.forEach(card => {
          card.style.transform = '';
        });
      });
    }
  }

  // ── ADVERTISING CTA STRIP ────────────────────────────────
  function buildAdvertisingCTA() {
    const strip = document.getElementById('advertising-cta-strip');
    if (!strip) return;

    strip.innerHTML = `
      <div class="advertising-cta-strip-text">
        <h3>Interessado em uma parceria?</h3>
        <p>Solicite o media kit completo com dados detalhados e cases.</p>
      </div>
      <a href="#contato" class="btn btn-primary">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
        </svg>
        Solicitar Proposta
      </a>
    `;
  }

  buildAdvertisingCTA();

  // ── BEHIND THE SCENES STAT STRIP ─────────────────────────
  function buildBTSStats() {
    const strip = document.getElementById('bts-stat-strip');
    if (!strip) return;

    const items = [
      { value: C.stats.contentPieces.value + '+', label: 'Conteúdos Publicados' },
      { value: C.stats.brandCampaigns.value + '+', label: 'Campanhas Realizadas' },
      { value: '3', label: 'Plataformas Ativas' },
    ];

    items.forEach(item => {
      const el = document.createElement('div');
      el.className = 'bts-stat-item';
      el.innerHTML = `
        <div class="bts-stat-value">${item.value}</div>
        <div class="bts-stat-label">${item.label}</div>
      `;
      strip.appendChild(el);
    });
  }

  buildBTSStats();

});
