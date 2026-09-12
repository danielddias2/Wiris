/**
 * WIRIS VIANA — Main JavaScript
 * Handles: theme, navigation, animations, counters, chart
 */

document.addEventListener('DOMContentLoaded', () => {

  const C = window.WV_CONFIG;

  // ── 1. THEME SYSTEM ─────────────────────────────────────
  const THEME_KEY = 'wv-theme';
  let currentTheme = localStorage.getItem(THEME_KEY) || 'dark';

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(THEME_KEY, theme);
    currentTheme = theme;
  }

  applyTheme(currentTheme);

  document.getElementById('theme-toggle').addEventListener('click', () => {
    applyTheme(currentTheme === 'dark' ? 'light' : 'dark');
  });

  // ── 2. NAVBAR ────────────────────────────────────────────
  const navbar = document.getElementById('navbar');
  const mobileToggle = document.getElementById('nav-mobile-toggle');
  const mobileMenu = document.getElementById('nav-mobile-menu');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    updateActiveNav();
  }, { passive: true });

  mobileToggle.addEventListener('click', () => {
    const isOpen = mobileMenu.classList.toggle('open');
    mobileToggle.setAttribute('aria-expanded', isOpen);
    mobileToggle.innerHTML = isOpen
      ? `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`
      : `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>`;
  });

  // Close mobile menu on link click
  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
      mobileToggle.setAttribute('aria-expanded', false);
      mobileToggle.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>`;
    });
  });

  function updateActiveNav() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a, .nav-mobile-menu a');
    let current = '';

    sections.forEach(section => {
      const sectionTop = section.offsetTop - 80;
      if (window.scrollY >= sectionTop) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  }

  // ── 3. ANIMATED COUNTER ──────────────────────────────────
  function animateCounter(el, target, duration = 1800, suffix = '', prefix = '') {
    const isDecimal = target % 1 !== 0;
    const start = performance.now();
    const startVal = 0;

    function easeOutExpo(t) {
      return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
    }

    function formatNumber(num) {
      if (num >= 1000000) {
        return (num / 1000000).toFixed(num >= 10000000 ? 0 : 1) + 'M';
      }
      if (num >= 1000) {
        return num.toLocaleString('pt-BR');
      }
      return isDecimal ? num.toFixed(1) : Math.floor(num).toLocaleString('pt-BR');
    }

    function update(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = easeOutExpo(progress);
      const current = startVal + (target - startVal) * eased;

      el.textContent = prefix + formatNumber(current) + suffix;

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        el.textContent = prefix + formatNumber(target) + suffix;
      }
    }

    requestAnimationFrame(update);
  }

  // ── 4. SCROLL REVEAL & COUNTER TRIGGER ──────────────────
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -48px 0px' });

  document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(el => {
    revealObserver.observe(el);
  });

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseFloat(el.dataset.target);
        const suffix = el.dataset.suffix || '';
        const prefix = el.dataset.prefix || '';
        animateCounter(el, target, 2000, suffix, prefix);
        counterObserver.unobserve(el);
      }
    });
  }, { threshold: 0.3 });

  document.querySelectorAll('[data-counter]').forEach(el => {
    counterObserver.observe(el);
  });

  // ── 5. BUILD NAVIGATION ──────────────────────────────────
  function buildNav() {
    const navLinks = document.getElementById('nav-links');
    const mobileLinks = document.getElementById('nav-mobile-menu');

    C.nav.forEach(item => {
      const a = document.createElement('a');
      a.href = item.href;
      a.textContent = item.label;
      navLinks.appendChild(a);

      const am = document.createElement('a');
      am.href = item.href;
      am.textContent = item.label;
      mobileLinks.appendChild(am);
    });
  }

  buildNav();

  // ── 6. BUILD HERO STATS ──────────────────────────────────
  function buildHeroStats() {
    const container = document.getElementById('hero-mini-stats');
    const heroItems = [
      { stat: C.stats.totalFollowers,  label: 'Seguidores' },
      { stat: C.stats.monthlyViews,    label: 'Views/Mês' },
      { stat: C.stats.engagementRate,  label: 'Engajamento' },
    ];

    heroItems.forEach((item, i) => {
      if (i > 0) {
        const div = document.createElement('div');
        div.className = 'hero-mini-stat-divider';
        container.appendChild(div);
      }

      const stat = document.createElement('div');
      stat.className = 'hero-mini-stat';

      const val = document.createElement('div');
      val.className = 'hero-mini-stat-value';
      val.setAttribute('data-counter', '');
      val.setAttribute('data-target', item.stat.value);
      val.setAttribute('data-suffix', item.stat.suffix);
      val.textContent = '0';

      const lbl = document.createElement('div');
      lbl.className = 'hero-mini-stat-label';
      lbl.textContent = item.label;

      stat.appendChild(val);
      stat.appendChild(lbl);
      container.appendChild(stat);

      // Register for counter animation
      counterObserver.observe(val);
    });
  }

  buildHeroStats();

  // ── 7. BUILD MAIN STATS SECTION ─────────────────────────
  function buildStats() {
    const grid = document.getElementById('stats-grid');
    const statItems = [
      {
        stat: C.stats.totalFollowers,
        label: 'Seguidores Totais',
        sublabel: 'TikTok + Instagram + YouTube',
        indicator: '+18% este mês',
      },
      {
        stat: C.stats.monthlyViews,
        label: 'Visualizações/Mês',
        sublabel: 'Todas as plataformas',
        indicator: '+24% este mês',
      },
      {
        stat: C.stats.engagementRate,
        label: 'Taxa de Engajamento',
        sublabel: 'Média das plataformas',
        indicator: 'Acima da média',
      },
      {
        stat: C.stats.monthlyReach,
        label: 'Alcance Mensal',
        sublabel: 'Contas únicas impactadas',
        indicator: '+15% este mês',
      },
    ];

    statItems.forEach((item, idx) => {
      const el = document.createElement('div');
      el.className = `stat-item reveal reveal-delay-${idx + 1}`;
      el.innerHTML = `
        <div class="stat-item-indicator">${item.indicator}</div>
        <div class="stat-item-value">
          <span data-counter data-target="${item.stat.value}" data-suffix="${item.stat.suffix}" data-prefix="${item.stat.prefix}">0</span>
        </div>
        <div class="stat-item-label">${item.label}</div>
        <div class="stat-item-sublabel">${item.sublabel}</div>
      `;
      grid.appendChild(el);
      revealObserver.observe(el);
      counterObserver.observe(el.querySelector('[data-counter]'));
    });
  }

  buildStats();

  // ── 8. BUILD PLATFORMS ───────────────────────────────────
  function getPlatformEmoji(id) {
    const map = { tiktok: '🎵', instagram: '📸', youtube: '▶️' };
    return map[id] || '🌐';
  }

  function buildPlatforms() {
    const grid = document.getElementById('platforms-grid');

    C.platforms.forEach((p, idx) => {
      const card = document.createElement('div');
      card.className = `platform-card reveal reveal-delay-${idx + 1}`;
      card.style.setProperty('--platform-color', p.color);

      card.innerHTML = `
        <div class="platform-header">
          <div class="platform-name-wrap">
            <div class="platform-icon" aria-hidden="true">${getPlatformEmoji(p.id)}</div>
            <div class="platform-name">${p.name}</div>
          </div>
          <div class="platform-growth-badge">${p.growth} / mês</div>
        </div>

        <div class="platform-main-metric">
          <div class="platform-main-value">
            <span data-counter data-target="${p.followers}" data-suffix="">0</span>
          </div>
          <div class="platform-main-label">${p.followersLabel}</div>
        </div>

        <div class="platform-secondary-metrics">
          <div class="platform-metric">
            <div class="platform-metric-value">${p.views}</div>
            <div class="platform-metric-label">${p.viewsLabel}</div>
          </div>
          <div class="platform-metric">
            <div class="platform-metric-value">${p.engagement}</div>
            <div class="platform-metric-label">${p.engagementLabel}</div>
          </div>
        </div>

        <div class="platform-content-type">${p.contentType}</div>
      `;

      grid.appendChild(card);
      revealObserver.observe(card);
      counterObserver.observe(card.querySelector('[data-counter]'));
    });
  }

  buildPlatforms();

  // ── 9. BUILD GROWTH CHART ────────────────────────────────
  function buildChart() {
    const canvas = document.getElementById('growth-chart');
    if (!canvas || !window.Chart) return;

    const isDark = () => document.documentElement.getAttribute('data-theme') !== 'light';

    const getColors = () => ({
      grid: isDark() ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.05)',
      label: isDark() ? '#717171' : '#909090',
    });

    const cd = C.chartData;

    function formatLabel(val) {
      if (val >= 1000000) return (val / 1000000).toFixed(0) + 'M';
      if (val >= 1000) return (val / 1000).toFixed(0) + 'K';
      return val;
    }

    let chart;

    function createChart() {
      const colors = getColors();
      if (chart) chart.destroy();

      chart = new Chart(canvas, {
        type: 'line',
        data: {
          labels: cd.labels,
          datasets: cd.datasets.map((ds, i) => ({
            label: ds.label,
            data: ds.data,
            borderColor: ds.color,
            backgroundColor: i === 0
              ? 'rgba(255,0,0,0.08)'
              : 'rgba(255,107,107,0.05)',
            borderWidth: i === 0 ? 2.5 : 1.5,
            pointBackgroundColor: ds.color,
            pointBorderColor: isDark() ? '#161616' : '#FFFFFF',
            pointBorderWidth: 2,
            pointRadius: 4,
            pointHoverRadius: 6,
            tension: 0.4,
            fill: i === 0,
          })),
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          animation: {
            duration: 1400,
            easing: 'easeOutQuart',
          },
          interaction: {
            mode: 'index',
            intersect: false,
          },
          plugins: {
            legend: { display: false },
            tooltip: {
              backgroundColor: isDark() ? '#1F1F1F' : '#FFFFFF',
              borderColor: isDark() ? '#272727' : '#E0E0E0',
              borderWidth: 1,
              titleColor: isDark() ? '#FFFFFF' : '#0F0F0F',
              bodyColor: isDark() ? '#AAAAAA' : '#606060',
              padding: 12,
              callbacks: {
                label: (ctx) => ` ${ctx.dataset.label}: ${formatLabel(ctx.parsed.y)}`,
              },
            },
          },
          scales: {
            x: {
              grid: { color: colors.grid },
              ticks: { color: colors.label, font: { size: 12, family: 'Inter' } },
              border: { color: colors.grid },
            },
            y: {
              grid: { color: colors.grid },
              ticks: {
                color: colors.label,
                font: { size: 12, family: 'Inter' },
                callback: (val) => formatLabel(val),
              },
              border: { color: colors.grid },
            },
          },
        },
      });
    }

    // Create chart when in view
    const chartObserver = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        createChart();
        chartObserver.disconnect();
      }
    }, { threshold: 0.3 });

    chartObserver.observe(canvas);

    // Rebuild chart on theme change (observe attribute)
    new MutationObserver(() => {
      if (chart) createChart();
    }).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

    // Legend
    const legendEl = document.getElementById('chart-legend');
    cd.datasets.forEach(ds => {
      const item = document.createElement('div');
      item.className = 'chart-legend-item';
      item.innerHTML = `<div class="chart-legend-dot" style="background:${ds.color}"></div>${ds.label}`;
      legendEl.appendChild(item);
    });
  }

  buildChart();

  // ── 10. BUILD AUDIENCE ───────────────────────────────────
  function buildAudience() {
    const interestsEl = document.getElementById('audience-interests');
    if (!interestsEl) return;

    C.audience.interests.forEach(interest => {
      const tag = document.createElement('span');
      tag.className = 'interest-tag';
      tag.textContent = interest;
      interestsEl.appendChild(tag);
    });
  }

  buildAudience();

  // ── 11. BUILD CONTENT SHOWCASE ───────────────────────────
  function buildContent() {
    const grid = document.getElementById('content-grid');
    if (!grid) return;

    C.content.forEach((item, idx) => {
      const card = document.createElement('div');
      card.className = `content-card reveal reveal-delay-${(idx % 3) + 1}`;
      card.setAttribute('aria-label', item.title);

      const thumbHTML = item.thumbnail
        ? `<img src="${item.thumbnail}" alt="${item.title}" class="content-card-thumb" loading="lazy">`
        : `<div class="content-card-placeholder">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true">
              <rect x="2" y="2" width="20" height="20" rx="3"/>
              <circle cx="12" cy="10" r="3"/>
              <path d="M7 20c0-3.31 2.24-6 5-6s5 2.69 5 6"/>
            </svg>
            <span style="font-size:0.625rem;letter-spacing:0.1em;text-transform:uppercase">Thumbnail em breve</span>
           </div>`;

      card.innerHTML = `
        ${thumbHTML}
        <div class="content-card-platform">${item.platform}</div>
        <div class="content-card-overlay">
          <div class="content-card-type">${item.type}</div>
          <div class="content-card-title">${item.title}</div>
          <div class="content-card-meta">
            ${item.episodes ? `<span>${item.episodes} episódios</span>` : ''}
            ${item.views && item.views !== '0' ? `<span>${item.views} views</span>` : ''}
          </div>
        </div>
      `;

      grid.appendChild(card);
      revealObserver.observe(card);
    });
  }

  buildContent();

  // ── 12. BUILD CHARACTERS ─────────────────────────────────
  function buildCharacters() {
    const grid = document.getElementById('characters-grid');
    if (!grid) return;

    C.characters.forEach((char, idx) => {
      const card = document.createElement('div');
      card.className = `character-card reveal reveal-delay-${(idx % 3) + 1}`;

      const photoHTML = char.photo
        ? `<img src="${char.photo}" alt="${char.name}" class="character-photo" loading="lazy">`
        : `<div class="character-photo-placeholder">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" aria-hidden="true">
              <circle cx="12" cy="8" r="5"/>
              <path d="M3 21c0-5.52 4.03-10 9-10s9 4.48 9 10"/>
            </svg>
           </div>`;

      card.innerHTML = `
        <div class="character-photo-wrap">${photoHTML}</div>
        <div class="character-info">
          <div class="character-name">${char.name}</div>
          <div class="character-description">${char.description}</div>
          ${char.appearances ? `<div class="character-appearances">${char.appearances} aparições</div>` : ''}
        </div>
      `;

      grid.appendChild(card);
      revealObserver.observe(card);
    });
  }

  buildCharacters();

  // ── 13. BUILD ADVERTISING FORMATS ───────────────────────
  function getAdIcon(icon) {
    const icons = {
      integration: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>`,
      product: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>`,
      sponsored: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg>`,
      mention: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75"><circle cx="12" cy="12" r="4"/><path d="M16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-3.92 7.94"/></svg>`,
      campaign: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>`,
      production: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75"><path d="M15.05 5A5 5 0 0 1 19 8.95M15.05 1A9 9 0 0 1 23 8.94M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.72 13 19.79 19.79 0 0 1 1.65 4.45 2 2 0 0 1 3.62 2.24h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9a16 16 0 0 0 6 6l.72-.87a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>`,
    };
    return icons[icon] || icons.integration;
  }

  function buildAdvertising() {
    const grid = document.getElementById('advertising-grid');
    if (!grid) return;

    C.advertising.forEach((format, idx) => {
      const card = document.createElement('div');
      card.className = `ad-format-card reveal reveal-delay-${(idx % 3) + 1}`;

      card.innerHTML = `
        <div class="ad-format-number">${format.number}</div>
        <div class="ad-format-icon" aria-hidden="true">${getAdIcon(format.icon)}</div>
        <div>
          <div class="ad-format-title">${format.title}</div>
          <div class="ad-format-desc" style="margin-top:0.75rem">${format.description}</div>
        </div>
        <div class="ad-format-details">
          ${format.details.map(d => `<div class="ad-format-detail">${d}</div>`).join('')}
        </div>
        <div class="ad-format-platforms">
          ${format.platforms.map(p => `<span class="ad-platform-tag">${p}</span>`).join('')}
        </div>
      `;

      grid.appendChild(card);
      revealObserver.observe(card);
    });
  }

  buildAdvertising();

  // ── 14. BUILD BRANDS ─────────────────────────────────────
  function buildBrands() {
    const grid = document.getElementById('brands-grid');
    if (!grid) return;

    C.brands.forEach(brand => {
      const cell = document.createElement('div');
      cell.className = 'brand-cell';

      if (brand.logo) {
        cell.innerHTML = `<img src="${brand.logo}" alt="${brand.name}" class="brand-logo" loading="lazy">`;
      } else {
        cell.innerHTML = `
          <div class="brand-placeholder">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" opacity="0.3" aria-hidden="true">
              <rect x="3" y="7" width="18" height="13" rx="2"/>
              <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/>
              <line x1="12" y1="12" x2="12" y2="16"/>
              <line x1="10" y1="14" x2="14" y2="14"/>
            </svg>
            <span>Marca Parceira</span>
          </div>
        `;
      }

      grid.appendChild(cell);
    });
  }

  buildBrands();

  // ── 15. BUILD CONTACT CTA ────────────────────────────────
  function buildContact() {
    const actionsEl = document.getElementById('contact-actions');
    if (!actionsEl) return;

    const { contact } = C;

    // WhatsApp
    if (contact.whatsapp) {
      const btn = document.createElement('a');
      btn.href = `https://wa.me/${contact.whatsapp}`;
      btn.target = '_blank';
      btn.rel = 'noopener noreferrer';
      btn.className = 'btn btn-primary btn-lg';
      btn.setAttribute('aria-label', 'Contato via WhatsApp');
      btn.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.125.553 4.122 1.523 5.853L.057 23.18a.75.75 0 0 0 .917.912l5.42-1.449A11.945 11.945 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.75c-1.97 0-3.808-.56-5.366-1.529l-.383-.232-3.973 1.062 1.08-3.864-.251-.398A9.708 9.708 0 0 1 2.25 12 9.75 9.75 0 0 1 12 2.25 9.75 9.75 0 0 1 21.75 12 9.75 9.75 0 0 1 12 21.75z"/></svg>WhatsApp`;
      actionsEl.appendChild(btn);
    } else {
      const btn = document.createElement('a');
      btn.href = '#';
      btn.className = 'btn btn-primary btn-lg';
      btn.setAttribute('aria-label', 'Falar sobre uma campanha');
      btn.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>Falar Sobre uma Campanha`;
      actionsEl.appendChild(btn);
    }

    // Email
    if (contact.email) {
      const btn = document.createElement('a');
      btn.href = `mailto:${contact.email}`;
      btn.className = 'btn btn-secondary btn-lg';
      btn.setAttribute('aria-label', 'Enviar e-mail');
      btn.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>E-mail`;
      actionsEl.appendChild(btn);
    }

    // Instagram
    if (contact.instagram) {
      const btn = document.createElement('a');
      btn.href = contact.instagram;
      btn.target = '_blank';
      btn.rel = 'noopener noreferrer';
      btn.className = 'btn btn-ghost btn-lg';
      btn.setAttribute('aria-label', 'Instagram');
      btn.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>Instagram`;
      actionsEl.appendChild(btn);
    }

    // Se nenhum contato foi configurado
    if (!contact.whatsapp && !contact.email && !contact.instagram) {
      const note = document.getElementById('contact-disclaimer');
      if (note) {
        note.textContent = 'Informações de contato em breve.';
      }
    }
  }

  buildContact();

  // ── 16. FADE IN HERO ON LOAD ─────────────────────────────
  document.querySelectorAll('.hero-content > *').forEach((el, i) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = `opacity 0.6s ease ${i * 0.12}s, transform 0.6s ease ${i * 0.12}s`;
    setTimeout(() => {
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
    }, 100);
  });

  // Hero image float cards counters
  document.querySelectorAll('.hero-float-card [data-counter]').forEach(el => {
    counterObserver.observe(el);
  });

});
