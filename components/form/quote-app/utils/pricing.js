import { PRICING_CONFIG, SOLUTION_FIELDS } from "../config/pricing";

// ─── Calcolo fascia di prezzo ─────────────────────────────────────────────────
export function calculatePriceRange(selections) {
  const {
    solution, complexity, integration,
    design, content, multilang, seo, urgency,
  } = selections;

  const base = PRICING_CONFIG.baseMatrix?.[solution];
  if (!base) return null;

  const fields = SOLUTION_FIELDS[solution] ?? {};

  // — Moltiplicatori sul base —
  const complexityMult   = PRICING_CONFIG.complexityMultipliers?.[solution]?.[complexity] ?? 1;
  const integrationMult  = PRICING_CONFIG.integrationMultipliers?.[integration] ?? 1;
  const designMult       = PRICING_CONFIG.designMultipliers?.[design] ?? 1;
  const contentMult      = fields.content   ? (PRICING_CONFIG.contentMultipliers?.[content]     ?? 1) : 1;
  const multilangMult    = fields.multilang ? (PRICING_CONFIG.multilangMultipliers?.[multilang] ?? 1) : 1;

  const subtotal = base * complexityMult * integrationMult * designMult * contentMult * multilangMult;

  // — Addendi percentuali sul subtotale —
  const seoAdd     = fields.seo ? (PRICING_CONFIG.seoAdders?.[seo]         ?? 0) : 0;
  const urgencyAdd =               PRICING_CONFIG.urgencyAdders?.[urgency]  ?? 0;

  const min     = Math.round(subtotal * (1 + seoAdd + urgencyAdd));
  const maxMult = PRICING_CONFIG.maxMultipliers?.[solution] ?? 3;
  const max     = Math.round(min * maxMult);

  return { min, max };
}

// ─── Label helpers ────────────────────────────────────────────────────────────
export function getSolutionLabel(id) {
  const map = {
    website:   "Sito web",
    ecommerce: "E-commerce",
    webApp:    "Web App",
    mobileApp: "App Mobile",
  };
  return map[id] ?? id;
}

export function getLabelFromOptions(options, id) {
  return options?.find((o) => o.id === id)?.label ?? id ?? "—";
}
