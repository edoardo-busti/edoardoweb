// ─── Pricing Config ────────────────────────────────────────────────────────────
export const PRICING_CONFIG = {
  baseMatrix: {
    website: 600,
    ecommerce: 900,
    webApp: 2000,
    mobileApp: 4500,
  },
  maxMultipliers: {
    website: 2.5,
    ecommerce: 2.5,
    webApp: 3.5,
    mobileApp: 4.0,
  },

  // ── Complessità ──────────────────────────────────────────────────────────────
  complexityOptions: {
    website: [
      { id: "small", label: "Fino a 5 pagine" },
      { id: "medium", label: "6–15 pagine" },
      { id: "large", label: "16+ pagine" },
    ],
    ecommerce: [
      { id: "small", label: "Fino a 50 prodotti" },
      { id: "medium", label: "51–500 prodotti" },
      { id: "large", label: "500+ prodotti" },
    ],
    webApp: [
      { id: "small", label: "1–3 funzionalità core" },
      { id: "medium", label: "4–8 funzionalità + dashboard" },
      { id: "large", label: "Sistema complesso / multi-ruolo" },
    ],
    mobileApp: [
      { id: "small", label: "Solo iOS o Android" },
      { id: "medium", label: "iOS + Android (cross-platform)" },
      { id: "large", label: "iOS + Android (native)" },
    ],
  },
  complexityMultipliers: {
    website: { small: 1, medium: 1.5, large: 2.2 },
    ecommerce: { small: 1, medium: 1.6, large: 2.4 },
    webApp: { small: 1, medium: 1.7, large: 2.8 },
    mobileApp: { small: 1, medium: 1.8, large: 3.0 },
  },

  // ── Integrazioni ─────────────────────────────────────────────────────────────
  integrationOptions: [
    {
      id: "none",
      label: "Nessuna integrazione",
      description: "Progetto autonomo, veloce da sviluppare e da mantenere",
    },
    {
      id: "base",
      label: "Integrazioni base",
      description: "Analytics, newsletter, form, chat, prenotazioni",
    },
    {
      id: "advanced",
      label: "Integrazioni avanzate",
      description:
        "CRM, ERP, pagamenti custom, API, sincronizzazione magazzino",
    },
  ],
  integrationMultipliers: { none: 1.0, base: 1.2, advanced: 1.6 },

  // ── Design ───────────────────────────────────────────────────────────────────
  designOptions: [
    {
      id: "ready",
      label: "Brand già presente",
      description: "Partiamo dalle tue linee guida",
    },
    {
      id: "partial",
      label: "Brand parziale",
      description:
        "Definiamo insieme l'identità visiva e la completiamo per il web",
    },
    {
      id: "scratch",
      label: "Creazione da zero",
      description:
        "Brand identity, wireframe, UI design e design system creati da zero",
    },
  ],
  designMultipliers: { ready: 1.0, partial: 1.15, scratch: 1.35 },

  // ── Contenuti ────────────────────────────────────────────────────────────────
  // Visibile: website, ecommerce, webApp
  contentOptions: [
    {
      id: "client",
      label: "Forniti dal cliente",
      description:
        "I tuoi contenuti, ottimizzati e integrati professionalmente",
    },
    {
      id: "copy",
      label: "Testi da scrivere",
      description: "Copywriting strategico incluso, media forniti da te",
    },
    {
      id: "full",
      label: "Testi + media da produrre",
      description:
        "Copywriting, fotografia e/o video prodotti interamente da noi",
    },
  ],
  contentMultipliers: { client: 1.0, copy: 1.2, full: 1.45 },

  // ── Multilingua ──────────────────────────────────────────────────────────────
  // Visibile: website, ecommerce, webApp
  multilangOptions: [
    { id: "one", label: "Una sola lingua" },
    { id: "two", label: "2 lingue" },
    { id: "multi", label: "3+ lingue" },
  ],
  multilangMultipliers: { one: 1.0, two: 1.2, multi: 1.4 },

  // ── SEO (addendo % sul subtotale) ────────────────────────────────────────────
  // Visibile: website, ecommerce, webApp
  seoOptions: [
    {
      id: "none",
      label: "Nessun SEO",
      description:
        "Ideale se hai già una strategia SEO o un consulente dedicato",
    },
    {
      id: "base",
      label: "SEO base",
      description: "Ottimizzazione on-page, meta tag, sitemap",
    },
    {
      id: "advanced",
      label: "SEO avanzato",
      description: "Tecnico + contenuti + link building iniziale",
    },
  ],
  seoAdders: { none: 0, base: 0.18, advanced: 0.35 },

  // ── Urgenza (addendo % sul subtotale) ────────────────────────────────────────
  urgencyOptions: [
    {
      id: "standard",
      label: "Standard",
      description: "Pianificazione ottimale per il miglior risultato finale",
    },
    {
      id: "fast",
      label: "Accelerata",
      description: "Tempi ridotti del ~50%, priorità nel calendario",
    },
    {
      id: "urgent",
      label: "Urgente",
      description: "Consegna accelerata del ~75%, team dedicato",
    },
  ],
  urgencyAdders: { standard: 0, fast: 0.3, urgent: 0.55 },

  // ── Manutenzione (€/mese, separata dal totale una tantum) ───────────────────
  maintenanceOptions: [
    {
      id: "none",
      label: "Nessuna manutenzione",
      description:
        "Ideale se hai un team interno o preferisci gestire autonomamente",
    },
    {
      id: "base",
      label: "Base",
      description: "Aggiornamenti, backup e monitoraggio inclusi",
    },
    {
      id: "advanced",
      label: "Avanzata",
      description: "Supporto prioritario + sviluppo evolutivo continuo",
    },
  ],
  maintenancePrices: { none: 0, base: 50, advanced: 200 },
};

// ─── Visibilità campi per soluzione ───────────────────────────────────────────
// Aggiungere qui nuove soluzioni o campi condizionali futuri
export const SOLUTION_FIELDS = {
  website: { content: true, multilang: true, seo: true },
  ecommerce: { content: true, multilang: true, seo: true },
  webApp: { content: true, multilang: true, seo: true },
  mobileApp: { content: true, multilang: true, seo: false },
};
