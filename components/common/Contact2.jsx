"use client";
import { useState, useEffect, useMemo, useRef } from "react";
import emailjs from "@emailjs/browser";

// ─── Pricing Config ────────────────────────────────────────────────────────────
const PRICING_CONFIG = {
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
      description: ": sito o app autonomi, senza connessioni a sistemi esterni",
    },
    {
      id: "base",
      label: "Integrazioni base",
      description: ": analytics, newsletter, form, chat, prenotazioni",
    },
    {
      id: "advanced",
      label: "Integrazioni avanzate",
      description:
        ": CRM, ERP, pagamenti custom, API, sincronizzazione magazzino",
    },
  ],
  integrationMultipliers: { none: 1.0, base: 1.2, advanced: 1.6 },

  // ── Design ───────────────────────────────────────────────────────────────────
  // Visibile: tutte le soluzioni
  designOptions: [
    {
      id: "ready",
      label: "Brand completo già pronto",
      description: ": logo, palette, font e linee guida forniti",
    },
    {
      id: "partial",
      label: "Brand parziale",
      description: ": solo logo o colori, resto da definire",
    },
    {
      id: "scratch",
      label: "Da zero",
      description: ": nessun riferimento visivo, design completo incluso",
    },
  ],
  designMultipliers: { ready: 1.0, partial: 1.15, scratch: 1.35 },

  // ── Contenuti ────────────────────────────────────────────────────────────────
  // Visibile: website, ecommerce, webApp
  contentOptions: [
    {
      id: "client",
      label: "Forniti dal cliente",
      description: ": testi, immagini e video già pronti",
    },
    {
      id: "copy",
      label: "Testi da scrivere",
      description: ": copywriting incluso, media forniti dal cliente",
    },
    {
      id: "full",
      label: "Testi + media da produrre",
      description: ": copywriting, fotografia e/o video inclusi",
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
    { id: "none", label: "Nessun SEO" },
    {
      id: "base",
      label: "SEO base",
      description: ": ottimizzazione on-page, meta tag, sitemap",
    },
    {
      id: "advanced",
      label: "SEO avanzato",
      description: ": tecnico + contenuti + link building iniziale",
    },
  ],
  seoAdders: { none: 0, base: 0.18, advanced: 0.35 },

  // ── Urgenza (addendo % sul subtotale) ────────────────────────────────────────
  // Visibile: tutte le soluzioni
  urgencyOptions: [
    {
      id: "standard",
      label: "Standard",
      description: ": tempi di consegna normali",
    },
    {
      id: "fast",
      label: "Accelerata",
      description: ": tempi ridotti del ~50%",
    },
    {
      id: "urgent",
      label: "Urgente",
      description: ": tempi ridotti del ~75%",
    },
  ],
  urgencyAdders: { standard: 0, fast: 0.3, urgent: 0.55 },

  // ── Manutenzione (€/mese, separata dal totale) ───────────────────────────────
  // Visibile: tutte le soluzioni
  maintenanceOptions: [
    { id: "none", label: "Nessuna manutenzione" },
    {
      id: "base",
      label: "Base",
      description: ": aggiornamenti, backup e monitoraggio",
    },
    {
      id: "advanced",
      label: "Avanzata",
      description: ": supporto prioritario + sviluppo evolutivo",
    },
  ],
  maintenancePrices: { none: 0, base: 150, advanced: 400 },
};

// ─── Visibilità per soluzione ──────────────────────────────────────────────────
const SOLUTION_FIELDS = {
  website: { content: true, multilang: true, seo: true },
  ecommerce: { content: true, multilang: true, seo: true },
  webApp: { content: true, multilang: true, seo: true },
  mobileApp: { content: false, multilang: false, seo: false },
};

// ─── Helpers ───────────────────────────────────────────────────────────────────
function calculatePriceRange(selections, config = PRICING_CONFIG) {
  const {
    solution,
    complexity,
    integration,
    design,
    content,
    multilang,
    seo,
    urgency,
  } = selections;
  const base = config.baseMatrix?.[solution];
  if (!base) return null;

  const fields = SOLUTION_FIELDS[solution] ?? {};

  // — moltiplicatori sul base —
  const complexityMult =
    config.complexityMultipliers?.[solution]?.[complexity] ?? 1;
  const integrationMult = config.integrationMultipliers?.[integration] ?? 1;
  const designMult = config.designMultipliers?.[design] ?? 1;
  const contentMult = fields.content
    ? (config.contentMultipliers?.[content] ?? 1)
    : 1;
  const multilangMult = fields.multilang
    ? (config.multilangMultipliers?.[multilang] ?? 1)
    : 1;

  const subtotal =
    base *
    complexityMult *
    integrationMult *
    designMult *
    contentMult *
    multilangMult;

  // — addendi percentuali sul subtotale —
  const seoAdd = fields.seo ? (config.seoAdders?.[seo] ?? 0) : 0;
  const urgencyAdd = config.urgencyAdders?.[urgency] ?? 0;

  const min = Math.round(subtotal * (1 + seoAdd + urgencyAdd));
  const maxMult = config.maxMultipliers?.[solution] ?? 3;
  const max = Math.round(min * maxMult);

  return { min, max };
}

function getSolutionLabel(id) {
  const map = {
    website: "Sito web",
    ecommerce: "E-commerce",
    webApp: "Web App",
    mobileApp: "App Mobile",
  };
  return map[id] ?? id;
}
function getLabelFromOptions(options, id) {
  return options?.find((o) => o.id === id)?.label ?? id ?? "—";
}

// ─── CustomSelect ──────────────────────────────────────────────────────────────
function CustomSelect({ id, value, onChange, options, placeholder, disabled }) {
  const [open, setOpen] = useState(false);
  const selectedLabel =
    options.find((o) => o.id === value || o.value === value)?.label ?? null;

  return (
    <div
      className={`qw-select-wrapper${disabled ? " qw-select-wrapper--disabled" : ""}${open ? " qw-select-wrapper--open" : ""}`}
      id={id}
      tabIndex="0"
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) setOpen(false);
      }}
    >
      <button
        type="button"
        className="qw-select-trigger input-field"
        disabled={disabled}
        onClick={() => !disabled && setOpen((prev) => !prev)}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className={selectedLabel ? "" : "qw-select-placeholder"}>
          {selectedLabel ?? placeholder}
        </span>
        <span
          className={`qw-select-arrow${open ? " qw-select-arrow--open" : ""}`}
        >
          ▾
        </span>
      </button>

      {open && (
        <ul className="qw-select-dropdown" role="listbox">
          {options.map((opt) => {
            const optValue = opt.id ?? opt.value ?? opt;
            const optLabel = opt.label ?? opt;
            const optDescription = opt.description ?? null;
            const isSelected = value === optValue;
            return (
              <li
                key={optValue}
                role="option"
                aria-selected={isSelected}
                className={`qw-select-option${isSelected ? " qw-select-option--selected" : ""}${optDescription ? " qw-select-option--described" : ""}`}
                onMouseDown={() => {
                  onChange(optValue);
                  setOpen(false);
                }}
              >
                {optLabel}
                {optDescription && (
                  <span className="qw-select-option-desc">
                    {optDescription}
                  </span>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

// ─── ProgressBar ───────────────────────────────────────────────────────────────
function ProgressBar({ step }) {
  const steps = ["Preventivo", "Dati", "Riepilogo"];
  return (
    <div className="qw-progress">
      {steps.map((label, i) => (
        <div key={i} className="qw-progress-item">
          <div
            className={`qw-progress-dot${i < step ? " qw-progress-dot--done" : ""}${i === step ? " qw-progress-dot--active" : ""}`}
          >
            {i < step ? "✓" : i + 1}
          </div>
          <span
            className={`qw-progress-label${i === step ? " qw-progress-label--active" : ""}`}
          >
            {label}
          </span>
          {i < steps.length - 1 && (
            <div
              className={`qw-progress-line${i < step ? " qw-progress-line--done" : ""}`}
            />
          )}
        </div>
      ))}
    </div>
  );
}

// ─── Stato iniziale ────────────────────────────────────────────────────────────
const INITIAL_SELECTIONS = {
  selectedBusiness: "",
  selectedCategory: "",
  selectedMainType: "",
  selectedSolution: "",
  selectedComplexity: "",
  selectedIntegration: "",
  selectedDesign: "",
  selectedContent: "",
  selectedMultilang: "",
  selectedSeo: "",
  selectedUrgency: "",
  selectedMaintenance: "",
};
const INITIAL_FORM = { fullName: "", email: "", phone: "", specs: "" };

// ─── Testo colonna sinistra per step ──────────────────────────────────────────
const LEFT_CONTENT = {
  0: {
    subtitle: "migliora la tua attività",
    title: "Calcola subito il tuo preventivo",
    description:
      "Scopri in pochi istanti la fascia di prezzo per il tuo progetto. Seleziona il tipo di attività e le funzionalità che ti interessano per elaborare una stima personalizzata basata sui parametri reali del mercato.",
  },
  1: {
    subtitle: "Dimmi di te",
    title: "Inserisci i tuoi dati",
    description:
      "Compila i campi con le tue informazioni di contatto e descrivi brevemente il progetto. Questi dati mi permetteranno di fornirti una valutazione su misura quanto prima.",
  },
  2: {
    subtitle: "Ci siamo quasi",
    title: "Controlla e invia la richiesta",
    description:
      "Verifica che tutti i dati inseriti siano corretti. Se vuoi modificare qualcosa puoi tornare indietro. Quando sei pronto, invia la richiesta: ti risponderò il prima possibile.",
  },
};

// ─── QuoteWidget ───────────────────────────────────────────────────────────────
export default function QuoteWidget({ parentClass = "get-in-touch-area" }) {
  const [step, setStep] = useState(0);
  const [animDir, setAnimDir] = useState("forward");
  const [animating, setAnimating] = useState(false);

  const [selections, setSelections] = useState(INITIAL_SELECTIONS);
  const {
    selectedBusiness,
    selectedCategory,
    selectedMainType,
    selectedSolution,
    selectedComplexity,
    selectedIntegration,
    selectedDesign,
    selectedContent,
    selectedMultilang,
    selectedSeo,
    selectedUrgency,
    selectedMaintenance,
  } = selections;

  const quoteOptions = {
    businessType: [
      { id: "professionista", label: "Professionista / Piccola impresa" },
      { id: "mediaAzienda", label: "Media azienda (50–249 dipendenti)" },
      { id: "grandeAzienda", label: "Grande azienda (250+ dipendenti)" },
    ],
    categories: [
      {
        id: "ristorazione",
        label: "Ristorazione e bevande",
        mainTypes: [
          "Ristorante/Pizzeria",
          "Bar/Lounge",
          "Catering",
          "Altro...",
        ],
      },
      {
        id: "cinematografia",
        label: "Cinematografia e intrattenimento",
        mainTypes: ["Produzione cinematografica", "Cinema", "Altro..."],
      },
      {
        id: "salute",
        label: "Salute e benessere",
        mainTypes: ["Studio professionale", "Clinica", "Altro..."],
      },
      {
        id: "educazione",
        label: "Educazione",
        mainTypes: ["Scuola", "Corso online", "Altro..."],
      },
      {
        id: "tecnologia",
        label: "Tecnologia",
        mainTypes: [
          "Fintech",
          "Cybersecurity",
          "Gaming",
          "Automazione",
          "Intelligenza Artificiale",
          "Altro...",
        ],
      },
    ],
    solutions: [
      { id: "website", label: "Sito Web / Vetrina / Blog" },
      { id: "ecommerce", label: "E-commerce / Vendita online" },
      { id: "webApp", label: "Applicazione Web interattiva" },
      { id: "mobileApp", label: "Applicazione Mobile" },
    ],
  };

  const [formData, setFormData] = useState(INITIAL_FORM);
  const { fullName, email, phone, specs } = formData;

  const [displayedPrice, setDisplayedPrice] = useState({
    min: null,
    max: null,
  });
  const [maintenanceMonthly, setMaintenanceMonthly] = useState(0);
  const [showPrice, setShowPrice] = useState(false);
  const [triggered, setTriggered] = useState(false);
  const [hasPriced, setHasPriced] = useState(false);

  const [isSending, setIsSending] = useState(false);
  const [sendStatus, setSendStatus] = useState(null);

  // Campi visibili in base alla soluzione
  const fields = selectedSolution
    ? (SOLUTION_FIELDS[selectedSolution] ?? {})
    : {};

  const mainTypeOptions = useMemo(() => {
    if (!selectedCategory) return [];
    const cat = quoteOptions.categories.find((c) => c.id === selectedCategory);
    return cat ? cat.mainTypes.map((mt) => ({ id: mt, label: mt })) : [];
  }, [selectedCategory]);

  const complexityOptions = selectedSolution
    ? (PRICING_CONFIG.complexityOptions[selectedSolution] ?? [])
    : [];

  // ─── Reset a cascata ───────────────────────────────────────────────────────
  const handleCategoryChange = (val) => {
    setSelections((prev) => ({
      ...prev,
      selectedCategory: val,
      selectedMainType: "",
      selectedSolution: "",
      selectedComplexity: "",
      selectedIntegration: "",
      selectedDesign: "",
      selectedContent: "",
      selectedMultilang: "",
      selectedSeo: "",
      selectedUrgency: "",
      selectedMaintenance: "",
    }));
  };
  const handleMainTypeChange = (val) => {
    setSelections((prev) => ({
      ...prev,
      selectedMainType: val,
      selectedSolution: "",
      selectedComplexity: "",
      selectedIntegration: "",
      selectedDesign: "",
      selectedContent: "",
      selectedMultilang: "",
      selectedSeo: "",
      selectedUrgency: "",
      selectedMaintenance: "",
    }));
  };
  const handleSolutionChange = (val) => {
    setSelections((prev) => ({
      ...prev,
      selectedSolution: val,
      selectedComplexity: "",
      selectedIntegration: "",
      selectedDesign: "",
      selectedContent: "",
      selectedMultilang: "",
      selectedSeo: "",
      selectedUrgency: "",
      selectedMaintenance: "",
    }));
    setHasPriced(false);
    setShowPrice(false);
    setDisplayedPrice({ min: null, max: null });
    setMaintenanceMonthly(0);
    setSendStatus(null);
  };

  const hasPricedRef = useRef(false);
  useEffect(() => {
    hasPricedRef.current = hasPriced;
  }, [hasPriced]);

  useEffect(() => {
    if (!selectedSolution) {
      setTriggered(false);
      setShowPrice(false);
      setDisplayedPrice({ min: null, max: null });
      return;
    }
    if (hasPricedRef.current) setTriggered(true);
  }, [
    selectedSolution,
    selectedComplexity,
    selectedIntegration,
    selectedDesign,
    selectedContent,
    selectedMultilang,
    selectedSeo,
    selectedUrgency,
    selectedMaintenance,
  ]);

  useEffect(() => {
    if (!triggered) return;
    setShowPrice(false);
    const timer = setTimeout(() => {
      const range = calculatePriceRange({
        solution: selectedSolution,
        complexity: selectedComplexity || null,
        integration: selectedIntegration || null,
        design: selectedDesign || null,
        content: selectedContent || null,
        multilang: selectedMultilang || null,
        seo: selectedSeo || null,
        urgency: selectedUrgency || null,
      });
      if (range) {
        setDisplayedPrice(range);
        setHasPriced(true);
      }
      const mPrice =
        PRICING_CONFIG.maintenancePrices?.[selectedMaintenance] ?? 0;
      setMaintenanceMonthly(mPrice);
      setShowPrice(true);
      setTriggered(false);
    }, 500);
    return () => clearTimeout(timer);
  }, [
    triggered,
    selectedSolution,
    selectedComplexity,
    selectedIntegration,
    selectedDesign,
    selectedContent,
    selectedMultilang,
    selectedSeo,
    selectedUrgency,
    selectedMaintenance,
  ]);

  // Tutti i campi obbligatori compilati per abilitare "Calcola"
  const coreReady =
    selectedSolution &&
    selectedComplexity &&
    selectedIntegration &&
    selectedDesign &&
    selectedUrgency &&
    selectedMaintenance;
  const extraReady =
    (!fields.content || selectedContent) &&
    (!fields.multilang || selectedMultilang) &&
    (!fields.seo || selectedSeo);
  const canCalculate = coreReady && extraReady;

  const canGoToStep1 = hasPriced;
  const canGoToStep2 =
    fullName.trim() !== "" &&
    email.trim() !== "" &&
    phone.trim() !== "" &&
    specs.trim() !== "";
  const canSubmit = canGoToStep2 && !isSending && sendStatus !== "success";

  // ─── Navigazione con animazione slide ─────────────────────────────────────
  const goTo = (nextStep, dir = "forward") => {
    setAnimDir(dir);
    setAnimating(true);
    setTimeout(() => {
      setStep(nextStep);
      setAnimating(false);
    }, 320);
  };

  // ─── Invio email ───────────────────────────────────────────────────────────
  const handleSubmit = async () => {
    if (!canSubmit) return;
    setIsSending(true);
    setSendStatus(null);

    const categoryLabel =
      quoteOptions.categories.find((c) => c.id === selectedCategory)?.label ??
      selectedCategory;
    const businessLabel =
      quoteOptions.businessType.find((b) => b.id === selectedBusiness)?.label ??
      selectedBusiness;

    const templateParams = {
      business_type: businessLabel,
      category: categoryLabel,
      main_type: selectedMainType,
      solution: getSolutionLabel(selectedSolution),
      complexity: getLabelFromOptions(
        PRICING_CONFIG.complexityOptions[selectedSolution],
        selectedComplexity,
      ),
      integration: getLabelFromOptions(
        PRICING_CONFIG.integrationOptions,
        selectedIntegration,
      ),
      design: getLabelFromOptions(PRICING_CONFIG.designOptions, selectedDesign),
      content: fields.content
        ? getLabelFromOptions(PRICING_CONFIG.contentOptions, selectedContent)
        : "N/A",
      multilang: fields.multilang
        ? getLabelFromOptions(
            PRICING_CONFIG.multilangOptions,
            selectedMultilang,
          )
        : "N/A",
      seo: fields.seo
        ? getLabelFromOptions(PRICING_CONFIG.seoOptions, selectedSeo)
        : "N/A",
      urgency: getLabelFromOptions(
        PRICING_CONFIG.urgencyOptions,
        selectedUrgency,
      ),
      maintenance: getLabelFromOptions(
        PRICING_CONFIG.maintenanceOptions,
        selectedMaintenance,
      ),
      maintenance_price:
        maintenanceMonthly > 0 ? `${maintenanceMonthly}€/mese` : "Nessuna",
      price_min: displayedPrice.min,
      price_max: displayedPrice.max,
      full_name: fullName.trim(),
      reply_to: email.trim(),
      phone: phone.trim(),
      specs: specs.trim(),
    };

    try {
      await emailjs.send(
        process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID,
        process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID,
        templateParams,
        process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY,
      );
      await emailjs.send(
        process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID,
        process.env.NEXT_PUBLIC_EMAILJS_AUTOREPLY_TEMPLATE_ID,
        templateParams,
        process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY,
      );
      setSendStatus("success");
      setSelections(INITIAL_SELECTIONS);
      setFormData(INITIAL_FORM);
      setDisplayedPrice({ min: null, max: null });
      setMaintenanceMonthly(0);
      setShowPrice(false);
      setHasPriced(false);
      setTriggered(false);
      setTimeout(() => {
        setStep(0);
        setSendStatus(null);
      }, 3500);
    } catch (err) {
      console.error("EmailJS error:", err);
      setSendStatus("error");
    } finally {
      setIsSending(false);
    }
  };

  const showResult = displayedPrice.min || (triggered && !showPrice);

  const slideClass = animating
    ? animDir === "forward"
      ? "qw-slide qw-slide--exit-left"
      : "qw-slide qw-slide--exit-right"
    : animDir === "forward"
      ? "qw-slide qw-slide--enter-right"
      : "qw-slide qw-slide--enter-left";

  const { subtitle, title, description } = LEFT_CONTENT[step];

  return (
    <section className={parentClass} id="preventivo">
      <div className="container">
        <div className="contact-get-in-touch-wrap">
          <div className="get-in-touch-wrapper tmponhover">
            <div>
              {/* ── Colonna sinistra ── */}
              <div className="section-head mb--50">
                <div className="section-sub-title center-title tmp-scroll-trigger tmp-fade-in animation-order-1">
                  <span className="subtitle">{subtitle}</span>
                </div>
                <h2 className="title split-collab tmp-scroll-trigger tmp-fade-in animation-order-2">
                  {title}
                </h2>
                <p className="description section-sm tmp-scroll-trigger tmp-fade-in animation-order-3">
                  {description}
                </p>
              </div>

              {/* ── Colonna destra ── */}
              <div>
                <div className="contact-inner">
                  <div className="contact-form">
                    <ProgressBar step={step} />

                    <div className="qw-slides-viewport">
                      <div className={slideClass}>
                        {/* ════════════════════════════════════════
                            STEP 0 — CONFIGURATORE PREVENTIVO
                        ════════════════════════════════════════ */}
                        {step === 0 && (
                          <div className="contact-form-wrapper row g-3">
                            {/* Attività */}
                            <div className="col-lg-6">
                              <div className="form-group">
                                <label
                                  className="qw-label"
                                  htmlFor="qw-activity"
                                >
                                  Attività
                                </label>
                                <CustomSelect
                                  id="qw-activity"
                                  value={selectedBusiness}
                                  onChange={(val) =>
                                    setSelections((prev) => ({
                                      ...prev,
                                      selectedBusiness: val,
                                    }))
                                  }
                                  options={quoteOptions.businessType}
                                  placeholder="Seleziona..."
                                  disabled={false}
                                />
                              </div>
                            </div>

                            {/* Settore */}
                            <div className="col-lg-6">
                              <div className="form-group">
                                <label className="qw-label" htmlFor="qw-field">
                                  Settore
                                </label>
                                <CustomSelect
                                  id="qw-field"
                                  value={selectedCategory}
                                  onChange={handleCategoryChange}
                                  options={quoteOptions.categories}
                                  placeholder="Seleziona..."
                                  disabled={!selectedBusiness}
                                />
                              </div>
                            </div>

                            {/* Categoria */}
                            <div className="col-lg-6">
                              <div className="form-group">
                                <label
                                  className="qw-label"
                                  htmlFor="qw-category"
                                >
                                  Categoria
                                </label>
                                <CustomSelect
                                  id="qw-category"
                                  value={selectedMainType}
                                  onChange={handleMainTypeChange}
                                  options={mainTypeOptions}
                                  placeholder="Seleziona..."
                                  disabled={!selectedCategory}
                                />
                              </div>
                            </div>

                            {/* Soluzione */}
                            <div className="col-lg-6">
                              <div className="form-group">
                                <label
                                  className="qw-label"
                                  htmlFor="qw-solution"
                                >
                                  Soluzione digitale
                                </label>
                                <CustomSelect
                                  id="qw-solution"
                                  value={selectedSolution}
                                  onChange={handleSolutionChange}
                                  options={quoteOptions.solutions}
                                  placeholder="Seleziona..."
                                  disabled={!selectedMainType}
                                />
                              </div>
                            </div>

                            {/* Campi condizionali (visibili dopo aver scelto la soluzione) */}
                            {selectedSolution && (
                              <>
                                {/* Complessità */}
                                <div className="col-lg-6">
                                  <div className="form-group">
                                    <label
                                      className="qw-label"
                                      htmlFor="qw-complexity"
                                    >
                                      {selectedSolution === "website" &&
                                        "Numero di pagine"}
                                      {selectedSolution === "ecommerce" &&
                                        "Catalogo prodotti"}
                                      {selectedSolution === "webApp" &&
                                        "Funzionalità"}
                                      {selectedSolution === "mobileApp" &&
                                        "Piattaforme"}
                                    </label>
                                    <CustomSelect
                                      id="qw-complexity"
                                      value={selectedComplexity}
                                      onChange={(val) =>
                                        setSelections((prev) => ({
                                          ...prev,
                                          selectedComplexity: val,
                                        }))
                                      }
                                      options={complexityOptions}
                                      placeholder="Seleziona..."
                                      disabled={false}
                                    />
                                  </div>
                                </div>

                                {/* Integrazioni */}
                                <div className="col-lg-6">
                                  <div className="form-group">
                                    <label
                                      className="qw-label"
                                      htmlFor="qw-integration"
                                    >
                                      Integrazioni
                                    </label>
                                    <CustomSelect
                                      id="qw-integration"
                                      value={selectedIntegration}
                                      onChange={(val) =>
                                        setSelections((prev) => ({
                                          ...prev,
                                          selectedIntegration: val,
                                        }))
                                      }
                                      options={
                                        PRICING_CONFIG.integrationOptions
                                      }
                                      placeholder="Seleziona..."
                                      disabled={!selectedComplexity}
                                    />
                                  </div>
                                </div>

                                {/* Design */}
                                <div className="col-lg-6">
                                  <div className="form-group">
                                    <label
                                      className="qw-label"
                                      htmlFor="qw-design"
                                    >
                                      Design
                                    </label>
                                    <CustomSelect
                                      id="qw-design"
                                      value={selectedDesign}
                                      onChange={(val) =>
                                        setSelections((prev) => ({
                                          ...prev,
                                          selectedDesign: val,
                                        }))
                                      }
                                      options={PRICING_CONFIG.designOptions}
                                      placeholder="Seleziona..."
                                      disabled={!selectedIntegration}
                                    />
                                  </div>
                                </div>

                                {/* Contenuti (solo website, ecommerce, webApp) */}
                                {fields.content && (
                                  <div className="col-lg-6">
                                    <div className="form-group">
                                      <label
                                        className="qw-label"
                                        htmlFor="qw-content"
                                      >
                                        Contenuti
                                      </label>
                                      <CustomSelect
                                        id="qw-content"
                                        value={selectedContent}
                                        onChange={(val) =>
                                          setSelections((prev) => ({
                                            ...prev,
                                            selectedContent: val,
                                          }))
                                        }
                                        options={PRICING_CONFIG.contentOptions}
                                        placeholder="Seleziona..."
                                        disabled={!selectedDesign}
                                      />
                                    </div>
                                  </div>
                                )}

                                {/* Multilingua (solo website, ecommerce, webApp) */}
                                {fields.multilang && (
                                  <div className="col-lg-6">
                                    <div className="form-group">
                                      <label
                                        className="qw-label"
                                        htmlFor="qw-multilang"
                                      >
                                        Multilingua
                                      </label>
                                      <CustomSelect
                                        id="qw-multilang"
                                        value={selectedMultilang}
                                        onChange={(val) =>
                                          setSelections((prev) => ({
                                            ...prev,
                                            selectedMultilang: val,
                                          }))
                                        }
                                        options={
                                          PRICING_CONFIG.multilangOptions
                                        }
                                        placeholder="Seleziona..."
                                        disabled={
                                          fields.content
                                            ? !selectedContent
                                            : !selectedDesign
                                        }
                                      />
                                    </div>
                                  </div>
                                )}

                                {/* SEO (solo website, ecommerce, webApp) */}
                                {fields.seo && (
                                  <div className="col-lg-6">
                                    <div className="form-group">
                                      <label
                                        className="qw-label"
                                        htmlFor="qw-seo"
                                      >
                                        SEO
                                      </label>
                                      <CustomSelect
                                        id="qw-seo"
                                        value={selectedSeo}
                                        onChange={(val) =>
                                          setSelections((prev) => ({
                                            ...prev,
                                            selectedSeo: val,
                                          }))
                                        }
                                        options={PRICING_CONFIG.seoOptions}
                                        placeholder="Seleziona..."
                                        disabled={
                                          fields.multilang
                                            ? !selectedMultilang
                                            : !selectedDesign
                                        }
                                      />
                                    </div>
                                  </div>
                                )}

                                {/* Urgenza */}
                                <div className="col-lg-6">
                                  <div className="form-group">
                                    <label
                                      className="qw-label"
                                      htmlFor="qw-urgency"
                                    >
                                      Urgenza
                                    </label>
                                    <CustomSelect
                                      id="qw-urgency"
                                      value={selectedUrgency}
                                      onChange={(val) =>
                                        setSelections((prev) => ({
                                          ...prev,
                                          selectedUrgency: val,
                                        }))
                                      }
                                      options={PRICING_CONFIG.urgencyOptions}
                                      placeholder="Seleziona..."
                                      disabled={
                                        fields.seo
                                          ? !selectedSeo
                                          : fields.multilang
                                            ? !selectedMultilang
                                            : fields.content
                                              ? !selectedContent
                                              : !selectedDesign
                                      }
                                    />
                                  </div>
                                </div>

                                {/* Manutenzione */}
                                <div className="col-lg-6">
                                  <div className="form-group">
                                    <label
                                      className="qw-label"
                                      htmlFor="qw-maintenance"
                                    >
                                      Manutenzione
                                    </label>
                                    <CustomSelect
                                      id="qw-maintenance"
                                      value={selectedMaintenance}
                                      onChange={(val) =>
                                        setSelections((prev) => ({
                                          ...prev,
                                          selectedMaintenance: val,
                                        }))
                                      }
                                      options={
                                        PRICING_CONFIG.maintenanceOptions
                                      }
                                      placeholder="Seleziona..."
                                      disabled={!selectedUrgency}
                                    />
                                  </div>
                                </div>
                              </>
                            )}

                            {/* Calcola + Risultato */}
                            <div className="col-lg-6">
                              <div className="qw-result-row">
                                <button
                                  disabled={!canCalculate || hasPriced}
                                  className={`qw-btn${hasPriced ? " qw-btn--calculated" : ""}`}
                                  onClick={() => {
                                    if (!hasPriced) setTriggered(true);
                                  }}
                                >
                                  {hasPriced ? "✓" : "Calcola preventivo"}
                                </button>

                                {showResult && (
                                  <div className="qw-result">
                                    {!showPrice ? (
                                      <span
                                        className="qw-spinner"
                                        aria-label="Calcolo in corso…"
                                      />
                                    ) : (
                                      <>
                                        <p>
                                          Fascia di prezzo:{" "}
                                          <strong>
                                            {displayedPrice.min}€ –{" "}
                                            {displayedPrice.max}€*
                                          </strong>
                                        </p>
                                        {maintenanceMonthly > 0 && (
                                          <p>
                                            Manutenzione:{" "}
                                            <strong>
                                              + {maintenanceMonthly}€/mese
                                            </strong>
                                          </p>
                                        )}
                                        <p className="qw-note">
                                          * La maggior parte dei progetti
                                          rientra nella fascia bassa. La stima è
                                          orientativa: il preventivo definitivo
                                          viene costruito insieme, nulla viene
                                          deciso senza di te.
                                        </p>
                                      </>
                                    )}
                                  </div>
                                )}
                              </div>
                            </div>

                            <div className="col-lg-6">
                              <div className="tmp-button-here">
                                <button
                                  className="qw-btn qw-btn--next w-100"
                                  disabled={!canGoToStep1}
                                  onClick={() => goTo(1, "forward")}
                                >
                                  Continua →
                                </button>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* ════════════════════════════════════════
                            STEP 1 — DATI PERSONALI
                        ════════════════════════════════════════ */}
                        {step === 1 && (
                          <div className="contact-form-wrapper row g-3">
                            <div className="col-lg-6">
                              <div className="form-group">
                                <label className="qw-label" htmlFor="qw-name">
                                  Nome e cognome
                                </label>
                                <input
                                  id="qw-name"
                                  name="fullName"
                                  type="text"
                                  autoComplete="name"
                                  className="input-field"
                                  placeholder="Mario Rossi"
                                  value={fullName}
                                  onChange={(e) =>
                                    setFormData((prev) => ({
                                      ...prev,
                                      fullName: e.target.value,
                                    }))
                                  }
                                />
                              </div>
                            </div>

                            <div className="col-lg-6">
                              <div className="form-group">
                                <label className="qw-label" htmlFor="qw-phone">
                                  Telefono
                                </label>
                                <input
                                  id="qw-phone"
                                  name="phone"
                                  type="tel"
                                  autoComplete="tel"
                                  className="input-field"
                                  placeholder="+39 333 000 0000"
                                  value={phone}
                                  onChange={(e) =>
                                    setFormData((prev) => ({
                                      ...prev,
                                      phone: e.target.value,
                                    }))
                                  }
                                />
                              </div>
                            </div>

                            <div className="col-lg-6">
                              <div className="form-group">
                                <label className="qw-label" htmlFor="qw-email">
                                  Indirizzo e-mail
                                </label>
                                <input
                                  id="qw-email"
                                  name="email"
                                  type="email"
                                  autoComplete="email"
                                  className="input-field"
                                  placeholder="mario@esempio.it"
                                  value={email}
                                  onChange={(e) =>
                                    setFormData((prev) => ({
                                      ...prev,
                                      email: e.target.value,
                                    }))
                                  }
                                />
                              </div>
                            </div>

                            <div className="col-lg-12">
                              <div className="form-group">
                                <label className="qw-label" htmlFor="qw-specs">
                                  Specifiche del progetto
                                </label>
                                <textarea
                                  id="qw-specs"
                                  name="specs"
                                  autoComplete="off"
                                  className="input-field"
                                  placeholder="Descrivi brevemente il progetto, obiettivi, funzionalità desiderate…"
                                  value={specs}
                                  onChange={(e) =>
                                    setFormData((prev) => ({
                                      ...prev,
                                      specs: e.target.value,
                                    }))
                                  }
                                />
                              </div>
                            </div>

                            <div className="col-lg-6">
                              <button
                                className="qw-btn qw-btn--back w-100"
                                onClick={() => goTo(0, "back")}
                              >
                                ← Indietro
                              </button>
                            </div>
                            <div className="col-lg-6">
                              <button
                                className="qw-btn qw-btn--next w-100"
                                disabled={!canGoToStep2}
                                onClick={() => goTo(2, "forward")}
                              >
                                Avanti →
                              </button>
                            </div>
                          </div>
                        )}

                        {/* ════════════════════════════════════════
                            STEP 2 — RIEPILOGO
                        ════════════════════════════════════════ */}
                        {step === 2 && (
                          <div className="contact-form-wrapper row g-3">
                            <div className="col-lg-12">
                              <div className="qw-summary">
                                <div className="qw-summary-block">
                                  <p className="qw-summary-section-title">
                                    Configurazione
                                  </p>
                                  <div className="qw-summary-grid">
                                    <span className="qw-summary-key">
                                      Attività
                                    </span>
                                    <span className="qw-summary-val">
                                      {quoteOptions.businessType.find(
                                        (b) => b.id === selectedBusiness,
                                      )?.label ?? "—"}
                                    </span>
                                    <span className="qw-summary-key">
                                      Settore
                                    </span>
                                    <span className="qw-summary-val">
                                      {quoteOptions.categories.find(
                                        (c) => c.id === selectedCategory,
                                      )?.label ?? "—"}
                                    </span>
                                    <span className="qw-summary-key">
                                      Categoria
                                    </span>
                                    <span className="qw-summary-val">
                                      {selectedMainType || "—"}
                                    </span>
                                    <span className="qw-summary-key">
                                      Soluzione
                                    </span>
                                    <span className="qw-summary-val">
                                      {getSolutionLabel(selectedSolution)}
                                    </span>
                                    <span className="qw-summary-key">
                                      Complessità
                                    </span>
                                    <span className="qw-summary-val">
                                      {getLabelFromOptions(
                                        PRICING_CONFIG.complexityOptions[
                                          selectedSolution
                                        ],
                                        selectedComplexity,
                                      )}
                                    </span>
                                    <span className="qw-summary-key">
                                      Integrazioni
                                    </span>
                                    <span className="qw-summary-val">
                                      {getLabelFromOptions(
                                        PRICING_CONFIG.integrationOptions,
                                        selectedIntegration,
                                      )}
                                    </span>
                                    <span className="qw-summary-key">
                                      Design
                                    </span>
                                    <span className="qw-summary-val">
                                      {getLabelFromOptions(
                                        PRICING_CONFIG.designOptions,
                                        selectedDesign,
                                      )}
                                    </span>
                                    {fields.content && (
                                      <>
                                        <span className="qw-summary-key">
                                          Contenuti
                                        </span>
                                        <span className="qw-summary-val">
                                          {getLabelFromOptions(
                                            PRICING_CONFIG.contentOptions,
                                            selectedContent,
                                          )}
                                        </span>
                                      </>
                                    )}
                                    {fields.multilang && (
                                      <>
                                        <span className="qw-summary-key">
                                          Multilingua
                                        </span>
                                        <span className="qw-summary-val">
                                          {getLabelFromOptions(
                                            PRICING_CONFIG.multilangOptions,
                                            selectedMultilang,
                                          )}
                                        </span>
                                      </>
                                    )}
                                    {fields.seo && (
                                      <>
                                        <span className="qw-summary-key">
                                          SEO
                                        </span>
                                        <span className="qw-summary-val">
                                          {getLabelFromOptions(
                                            PRICING_CONFIG.seoOptions,
                                            selectedSeo,
                                          )}
                                        </span>
                                      </>
                                    )}
                                    <span className="qw-summary-key">
                                      Urgenza
                                    </span>
                                    <span className="qw-summary-val">
                                      {getLabelFromOptions(
                                        PRICING_CONFIG.urgencyOptions,
                                        selectedUrgency,
                                      )}
                                    </span>
                                    <span className="qw-summary-key">
                                      Manutenzione
                                    </span>
                                    <span className="qw-summary-val">
                                      {getLabelFromOptions(
                                        PRICING_CONFIG.maintenanceOptions,
                                        selectedMaintenance,
                                      )}
                                    </span>
                                  </div>
                                </div>

                                <div className="qw-summary-price-block">
                                  <span className="qw-summary-key">
                                    Fascia di prezzo stimata (una tantum)
                                  </span>
                                  <span className="qw-summary-price">
                                    {displayedPrice.min}€ – {displayedPrice.max}
                                    €*
                                  </span>
                                  {maintenanceMonthly > 0 && (
                                    <>
                                      <span
                                        className="qw-summary-key"
                                        style={{ marginTop: "0.5rem" }}
                                      >
                                        Manutenzione
                                      </span>
                                      <span
                                        className="qw-summary-price"
                                        style={{ fontSize: "1.1rem" }}
                                      >
                                        + {maintenanceMonthly}€/mese
                                      </span>
                                    </>
                                  )}
                                  <p className="qw-note">
                                    * La fascia indicata è puramente orientativa
                                    e calcolata su diversi parametri di
                                    mercatoo. Il costo effettivo può essere
                                    stimato solo dopo una valutazione
                                    personalizzata della richiesta.
                                  </p>
                                </div>

                                <div className="qw-summary-block">
                                  <p className="qw-summary-section-title">
                                    Dati di contatto
                                  </p>
                                  <div className="qw-summary-grid">
                                    <span className="qw-summary-key">Nome</span>
                                    <span className="qw-summary-val">
                                      {fullName}
                                    </span>
                                    <span className="qw-summary-key">
                                      E-mail
                                    </span>
                                    <span className="qw-summary-val">
                                      {email}
                                    </span>
                                    <span className="qw-summary-key">
                                      Telefono
                                    </span>
                                    <span className="qw-summary-val">
                                      {phone}
                                    </span>
                                  </div>
                                </div>

                                <div className="qw-summary-block">
                                  <p className="qw-summary-section-title">
                                    Specifiche
                                  </p>
                                  <p className="qw-summary-specs">{specs}</p>
                                </div>

                                {sendStatus === "success" && (
                                  <p className="qw-feedback qw-feedback--success">
                                    ✓ Richiesta inviata con successo! Verrai
                                    contattato il prima possibile.
                                  </p>
                                )}
                                {sendStatus === "error" && (
                                  <p className="qw-feedback qw-feedback--error">
                                    ✗ Qualcosa è andato storto. Riprova o
                                    contattaci direttamente.
                                  </p>
                                )}
                              </div>
                            </div>

                            <div className="col-lg-6">
                              <button
                                className="qw-btn qw-btn--back w-100"
                                onClick={() => goTo(1, "back")}
                                disabled={isSending || sendStatus === "success"}
                              >
                                ← Modifica dati
                              </button>
                            </div>
                            <div className="col-lg-6">
                              <button
                                className="qw-btn qw-btn--submit w-100"
                                disabled={!canSubmit}
                                onClick={handleSubmit}
                              >
                                {isSending ? (
                                  <>
                                    <span className="qw-spinner qw-spinner--inline" />
                                    Invio…
                                  </>
                                ) : (
                                  "Richiedi valutazione"
                                )}
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
