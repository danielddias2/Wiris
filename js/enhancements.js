/**
 * WIRIS VIANA — Enhancements JS v2
 * Scroll progress bar, ticker, platform comparison bars, refined interactions
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
      `🎥 ${C.stats.totalFollowers.value.toLocaleString('pt-BR')} seguidores consolidados`,
      `📊 ${(C.stats.monthlyViews.value / 1_000_000).toFixed(0)}M+ visualizações por mês`,
      `🔴 ${C.stats.engagementRate.value}% taxa de engajamento médio`,
      `📱 Presente no YouTube, TikTok, Instagram e Kwai`,
      `✅ Disponível para parcerias e campanhas comerciais`,
      `🎬 Produção audiovisual cinematográfica`,
      `📈 Audiência qualificada e engajamento real`,
    ];

    // Duplicar para loop contínuo perfeito
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
    const maxFollowers = Math.max(...platforms.map(p => p.followers), 1);

    container.innerHTML = ''; // Limpa antes de preencher

    platforms.forEach((p, idx) => {
      const percentage = p.followers > 0 ? (p.followers / maxFollowers) * 100 : 4;
      const valueLabel = p.followers > 0 ? p.followers.toLocaleString('pt-BR') : 'Em breve';

      const row = document.createElement('div');
      row.className = 'platform-bar-row';
      row.innerHTML = `
        <div class="platform-bar-label">${p.name}</div>
        <div class="platform-bar-track">
          <div
            class="platform-bar-fill"
            style="background:${p.color};transition-delay:${idx * 0.12}s"
            data-width="${percentage}"
          ></div>
        </div>
        <div class="platform-bar-value" style="${p.followers === 0 ? 'font-size:0.625rem;opacity:0.6;font-style:italic;width:60px' : ''}">${valueLabel}</div>
      `;

      container.appendChild(row);
    });

    // Animar barras ao entrar no viewport
    const barObserver = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        container.querySelectorAll('.platform-bar-fill').forEach(fill => {
          fill.style.width = fill.dataset.width + '%';
        });
        barObserver.disconnect();
      }
    }, { threshold: 0.2 });

    barObserver.observe(container);
  }

  buildPlatformBars();

  // ── KEYBOARD NAVIGATION (Acessibilidade) ─────────────────
  const skipLink = document.getElementById('skip-main');
  if (skipLink) {
    skipLink.addEventListener('focus', () => {
      skipLink.style.top = '1rem';
      skipLink.style.zIndex = '99999';
    });
    skipLink.addEventListener('blur', () => {
      skipLink.style.top = '-100%';
    });
  }

  // ── SMOOTH HOVER 3D NA FOTO (Sem interferir nos balões) ────
  // Aplica a perspectiva apenas na imagem de fundo, preservando
  // as posições absolutas e animações CSS dos balões flutuantes.
  if (window.matchMedia('(min-width: 1024px) and (prefers-reduced-motion: no-preference)').matches) {
    const photoBg = document.querySelector('.hero-image-bg');

    if (photoBg) {
      document.addEventListener('mousemove', (e) => {
        const { clientX, clientY } = e;
        const { innerWidth, innerHeight } = window;
        const x = (clientX / innerWidth - 0.5) * 8;
        const y = (clientY / innerHeight - 0.5) * 6;

        photoBg.style.transform = `perspective(800px) rotateY(${x * 0.4}deg) rotateX(${-y * 0.3}deg)`;
      });

      document.addEventListener('mouseleave', () => {
        photoBg.style.transform = '';
      });
    }
  }

  // ── ADVERTISING CTA STRIP ────────────────────────────────
  function buildAdvertisingCTA() {
    const strip = document.getElementById('advertising-cta-strip');
    if (!strip) return;

    strip.innerHTML = `
      <div class="advertising-cta-strip-text">
        <h3>Interessado em uma parceria comercial?</h3>
        <p>Receba o media kit completo com métricas detalhadas, opções de integração e proposta personalizada.</p>
      </div>
      <a href="#contato" class="btn btn-primary" aria-label="Solicitar proposta comercial">
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
      { value: '4', label: 'Plataformas Oficiais' },
    ];

    strip.innerHTML = '';
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
