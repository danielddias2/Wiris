/**
 * ============================================================
 * WIRIS VIANA — CONFIGURAÇÃO CENTRAL DE DADOS (v2)
 * ============================================================
 * INSTRUÇÃO: Altere os valores neste arquivo para atualizar
 * todos os componentes do site automaticamente.
 *
 * Valores marcados com [PLACEHOLDER] devem ser substituídos
 * pelos dados reais quando disponíveis.
 *
 * MÉTRICAS AO VIVO:
 * Se o servidor backend estiver rodando (server/), os valores
 * de seguidores serão buscados automaticamente de lá.
 * Configure METRICS_API_URL abaixo.
 * ============================================================
 */

window.WV_CONFIG = {

  // ── BACKEND DE MÉTRICAS ──────────────────────────────────
  // URL do servidor de métricas (server/index.js)
  // null = usa apenas os valores estáticos de stats abaixo
  // 'http://localhost:3001' = busca do servidor local
  metricsApiUrl: null, // [CONFIGURAR] ex: 'http://localhost:3001'

  // Intervalo de atualização das métricas no frontend (em ms)
  // O frontend consulta o backend a cada X ms para atualizar os contadores
  // Padrão: 5 minutos (300000 ms)
  metricsRefreshInterval: 300000,

  // ── IDENTIDADE ──────────────────────────────────────────
  creator: {
    name: 'Wiris Viana',
    tagline: 'Conteúdo que transforma audiência em atenção.',
    commercialTagline: 'Uma audiência real. Uma produção de verdade. Sua marca no centro disso.',
    niche: 'Entretenimento & Web-Novelas',
    location: 'Brasil',
  },

  // ── CONTATO COMERCIAL ────────────────────────────────────
  // [PLACEHOLDER] Substitua pelos dados reais de contato
  contact: {
    whatsapp: null,           // ex: '5511999999999'
    email: null,              // ex: 'contato@wirisviana.com'
    instagram: null,          // ex: 'https://instagram.com/wirisviana'
    youtubeChannel: null,     // ex: 'https://youtube.com/@wirisviana'
    tiktok: null,             // ex: 'https://tiktok.com/@wirisviana'
    kwai: null,               // ex: 'https://www.kwai.com/@wirisviana'
  },

  // ── MÉTRICAS PRINCIPAIS ──────────────────────────────────
  // [PLACEHOLDER] Valores usados quando o backend não está disponível.
  // Quando metricsApiUrl estiver configurado, os valores de seguidores
  // vêm do backend e estes são usados apenas como fallback inicial.
  stats: {
    // TikTok
    tiktokFollowers:     { value: 78421,    label: 'Seguidores TikTok',    suffix: '',   prefix: '' },
    tiktokViews:         { value: 32800000, label: 'Views TikTok',         suffix: '+',  prefix: '' },

    // Instagram
    instagramFollowers:  { value: 45200,    label: 'Seguidores Instagram', suffix: '',   prefix: '' },
    instagramReach:      { value: 9200000,  label: 'Alcance Mensal',       suffix: '+',  prefix: '' },

    // YouTube
    youtubeSubscribers:  { value: 12800,    label: 'Inscritos YouTube',    suffix: '',   prefix: '' },
    youtubeViews:        { value: 4100000,  label: 'Views YouTube',        suffix: '+',  prefix: '' },

    // Kwai
    kwaiFollowers:       { value: 0,        label: 'Seguidores Kwai',      suffix: '',   prefix: '' }, // [PLACEHOLDER]
    kwaiViews:           { value: 0,        label: 'Views Kwai',           suffix: '+',  prefix: '' }, // [PLACEHOLDER]

    // Gerais
    totalFollowers:      { value: 136421,   label: 'Seguidores Totais',    suffix: '+',  prefix: '' },
    monthlyViews:        { value: 41000000, label: 'Visualizações/Mês',    suffix: '+',  prefix: '' },
    monthlyReach:        { value: 9200000,  label: 'Alcance Mensal',       suffix: '+',  prefix: '' },
    engagementRate:      { value: 8.7,      label: 'Engajamento',          suffix: '%',  prefix: '' },
    contentPieces:       { value: 340,      label: 'Conteúdos Publicados', suffix: '+',  prefix: '' },
    brandCampaigns:      { value: 28,       label: 'Campanhas Realizadas', suffix: '+',  prefix: '' },
  },

  // ── PLATAFORMAS ──────────────────────────────────────────
  platforms: [
    {
      id: 'tiktok',
      name: 'TikTok',
      color: '#FF0050',
      icon: 'tiktok',
      followers: 78421,          // Sincronizado com backend quando disponível
      followersLabel: 'Seguidores',
      views: '32.8M+',
      viewsLabel: 'Visualizações',
      engagement: '8.7%',
      engagementLabel: 'Engajamento',
      growth: '+12%',
      growthLabel: 'Crescimento Mensal',
      contentType: 'Web-novelas, entretenimento, drama',
      url: null, // [PLACEHOLDER]
    },
    {
      id: 'instagram',
      name: 'Instagram',
      color: '#E1306C',
      icon: 'instagram',
      followers: 45200,
      followersLabel: 'Seguidores',
      views: '9.2M+',
      viewsLabel: 'Alcance Mensal',
      engagement: '6.4%',
      engagementLabel: 'Engajamento',
      growth: '+8%',
      growthLabel: 'Crescimento Mensal',
      contentType: 'Reels, stories, bastidores',
      url: null, // [PLACEHOLDER]
    },
    {
      id: 'youtube',
      name: 'YouTube',
      color: '#FF0000',
      icon: 'youtube',
      followers: 12800,
      followersLabel: 'Inscritos',
      views: '4.1M+',
      viewsLabel: 'Visualizações',
      engagement: '5.2%',
      engagementLabel: 'Engajamento',
      growth: '+22%',
      growthLabel: 'Crescimento Mensal',
      contentType: 'Séries, episódios completos, vlogs',
      url: null, // [PLACEHOLDER]
    },
    {
      id: 'kwai',
      name: 'Kwai',
      color: '#FF6900',
      icon: 'kwai',
      followers: 0,              // [PLACEHOLDER] — será sincronizado com backend
      followersLabel: 'Seguidores',
      views: '[Em breve]',       // [PLACEHOLDER]
      viewsLabel: 'Visualizações',
      engagement: '[Em breve]',  // [PLACEHOLDER]
      engagementLabel: 'Engajamento',
      growth: '[Em breve]',      // [PLACEHOLDER]
      growthLabel: 'Crescimento Mensal',
      contentType: 'Conteúdo de entretenimento e web-novelas',
      url: null, // [PLACEHOLDER]
    },
  ],

  // ── DADOS DO GRÁFICO DE CRESCIMENTO ─────────────────────
  // [PLACEHOLDER] Substitua pelos dados reais mensais
  chartData: {
    title: 'Crescimento de Visualizações',
    subtitle: 'Últimos 6 meses — todas as plataformas',
    labels: ['Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set'],
    datasets: [
      {
        label: 'Views Mensais',
        data: [12400000, 18600000, 24100000, 28900000, 35200000, 41000000],
        color: '#FF0000',
      },
      {
        label: 'Alcance',
        data: [4100000, 5800000, 6900000, 7600000, 8400000, 9200000],
        color: '#FF6B6B',
      },
    ],
  },

  // ── AUDIÊNCIA ────────────────────────────────────────────
  // [PLACEHOLDER] Substitua pelos dados reais de audiência
  audience: {
    ageGroups: [],      // [PLACEHOLDER]
    genderSplit: null,  // [PLACEHOLDER]
    topStates: [],      // [PLACEHOLDER]
    topCountries: [],   // [PLACEHOLDER]
    interests: [
      'Entretenimento',
      'Drama',
      'Web-novelas',
      'Ficção',
      'Conteúdo nacional',
      'Streaming',
    ],
  },

  // ── CONTEÚDO / WEB-NOVELAS ───────────────────────────────
  // [PLACEHOLDER] Adicione as produções reais
  content: [
    {
      id: 'serie-1',
      title: '[Nome da Série]',
      type: 'Web-novela',
      episodes: 0,
      views: '0',
      thumbnail: null,
      description: '[Descrição da série]',
      platform: 'TikTok',
    },
    {
      id: 'serie-2',
      title: '[Nome da Série 2]',
      type: 'Série',
      episodes: 0,
      views: '0',
      thumbnail: null,
      description: '[Descrição da série]',
      platform: 'YouTube',
    },
    {
      id: 'serie-3',
      title: '[Nome da Produção]',
      type: 'Conteúdo Especial',
      episodes: 0,
      views: '0',
      thumbnail: null,
      description: '[Descrição]',
      platform: 'Kwai',
    },
  ],

  // ── PERSONAGENS ──────────────────────────────────────────
  // [PLACEHOLDER] Adicione os personagens reais
  characters: [
    {
      id: 'char-1',
      name: '[Nome do Personagem]',
      photo: null,
      description: '[Descrição do personagem e sua participação no universo Wiris]',
      appearances: 0,
    },
    {
      id: 'char-2',
      name: '[Nome do Personagem 2]',
      photo: null,
      description: '[Descrição]',
      appearances: 0,
    },
    {
      id: 'char-3',
      name: '[Nome do Personagem 3]',
      photo: null,
      description: '[Descrição]',
      appearances: 0,
    },
  ],

  // ── FORMATOS DE PUBLICIDADE ──────────────────────────────
  advertising: [
    {
      id: 'integracao',
      number: '01',
      title: 'Integração no Conteúdo',
      icon: 'integration',
      description: 'Sua marca se torna parte orgânica das produções de Wiris, integrada à narrativa de forma natural e envolvente.',
      details: [
        'Mencão contextualizada dentro do enredo',
        'Produto ou serviço aparece no universo dos personagens',
        'Alto índice de recall por contexto emocional',
      ],
      platforms: ['TikTok', 'YouTube', 'Instagram', 'Kwai'],
      formats: ['Vídeo vertical', 'Episódio', 'Série'],
    },
    {
      id: 'product-placement',
      number: '02',
      title: 'Product Placement',
      icon: 'product',
      description: 'O produto aparece nas gravações como elemento natural da cena, sem interromper a experiência do espectador.',
      details: [
        'Visibilidade orgânica do produto',
        'Integração nas gravações de bastidores',
        'Aparição em múltiplos episódios',
      ],
      platforms: ['TikTok', 'YouTube', 'Kwai'],
      formats: ['Cena', 'Bastidores', 'Episódio'],
    },
    {
      id: 'patrocinado',
      number: '03',
      title: 'Conteúdo Patrocinado',
      icon: 'sponsored',
      description: 'Conteúdo exclusivo criado para comunicar a mensagem da sua marca com a linguagem e estilo únicos do Wiris.',
      details: [
        'Produção audiovisual completa',
        'Roteiro e direção criativa do Wiris',
        'Entrega em múltiplos formatos',
      ],
      platforms: ['TikTok', 'Instagram', 'YouTube', 'Kwai'],
      formats: ['Reels', 'Shorts', 'TikTok', 'Kwai'],
    },
    {
      id: 'mencao',
      number: '04',
      title: 'Menção de Marca',
      icon: 'mention',
      description: 'Apresentação direta da sua marca para a audiência fiel de Wiris, com autenticidade e credibilidade.',
      details: [
        'Recomendação pessoal do criador',
        'Alto índice de conversão',
        'Formato curto e direto',
      ],
      platforms: ['TikTok', 'Instagram', 'YouTube', 'Kwai'],
      formats: ['Stories', 'Live', 'Vídeo'],
    },
    {
      id: 'campanha',
      number: '05',
      title: 'Campanhas Personalizadas',
      icon: 'campaign',
      description: 'Planejamento estratégico de campanhas completas com múltiplos pontos de contato ao longo do tempo.',
      details: [
        'Estratégia de campanha personalizada',
        'Múltiplos formatos e plataformas',
        'Relatório de resultados',
      ],
      platforms: ['TikTok', 'Instagram', 'YouTube', 'Kwai'],
      formats: ['Campanha', 'Série', 'Especial'],
    },
    {
      id: 'producao',
      number: '06',
      title: 'Produção para Marcas',
      icon: 'production',
      description: 'Criação e produção audiovisual de conteúdo para os canais da própria marca, com a expertise criativa do time Wiris.',
      details: [
        'Equipe de produção completa',
        'Roteiro, filmagem e edição',
        'Entrega dos arquivos finais',
      ],
      platforms: ['Canais da marca'],
      formats: ['Qualquer formato'],
    },
  ],

  // ── MARCAS PARCEIRAS ─────────────────────────────────────
  // [PLACEHOLDER] Adicione as marcas reais quando disponíveis
  brands: [
    { id: 'brand-1', name: '[Marca Parceira]', logo: null, campaign: null, result: null },
    { id: 'brand-2', name: '[Marca Parceira]', logo: null, campaign: null, result: null },
    { id: 'brand-3', name: '[Marca Parceira]', logo: null, campaign: null, result: null },
    { id: 'brand-4', name: '[Marca Parceira]', logo: null, campaign: null, result: null },
    { id: 'brand-5', name: '[Marca Parceira]', logo: null, campaign: null, result: null },
    { id: 'brand-6', name: '[Marca Parceira]', logo: null, campaign: null, result: null },
  ],

  // ── NAVEGAÇÃO ────────────────────────────────────────────
  // Ordem oficial — não alterar sem atualizar os IDs das sections no HTML
  nav: [
    { label: 'Início',      href: '#inicio' },
    { label: 'Audiência',   href: '#audiencia' },
    { label: 'Conteúdo',    href: '#conteudo' },
    { label: 'Publicidade', href: '#publicidade' },
    { label: 'Bastidores',  href: '#bastidores' },
    { label: 'Contato',     href: '#contato' },
  ],

};
