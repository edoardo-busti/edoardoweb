"use client";

import emailjs from "@emailjs/browser";

import { PRICING_CONFIG } from "./config/pricing";
import {
  BUSINESS_TYPES,
  CATEGORIES,
  SOLUTIONS,
} from "./constants/quoteOptions";
import { LEFT_CONTENT } from "./constants/leftContent";
import { getLabelFromOptions, getSolutionLabel } from "./utils/pricing";
import { useCountUp } from "./utils/useCountUp";
import { useQuoteLogic } from "./hooks/useQuoteLogic";
import CustomSelect from "./components/CustomSelect";
import ProgressBar from "./components/ProgressBar";

// ─── QuoteWidget ───────────────────────────────────────────────────────────────
export default function QuoteWidget({
  parentClass = "get-in-touch-area tmp-section-gap",
  hideHeader = false,
}) {
  const {
    // navigazione
    step,
    goTo,
    slideClass,
    // selezioni
    selections,
    setSelections,
    fields,
    mainTypeOptions,
    complexityOptions,
    handleCategoryChange,
    handleMainTypeChange,
    handleSolutionChange,
    // form
    formData,
    setFormData,
    // pricing
    displayedPrice,
    maintenanceMonthly,
    showPrice,
    showResult,
    hasPriced,
    setTriggered,
    // invio
    isSending,
    sendStatus,
    submittedName,
    privacyAccepted,
    setPrivacyAccepted,
    handleSubmit,
    // gates
    canCalculate,
    canGoToStep1,
    canGoToStep2,
    canGoToStep3,
    canSubmit,
  } = useQuoteLogic();

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

  const { fullName, email, phone, specs } = formData;
  const { subtitle, title, description } = LEFT_CONTENT[step];

  // Ref sulla sezione — usato per scroll to top ad ogni cambio step
  const scrollToSection = () => {
    const target = document.getElementById("preventivo");
    if (!target) return;
    const top = target.getBoundingClientRect().top + window.scrollY - 40;
    window.scrollTo({ top, behavior: "smooth" });
  };

  const setSel = (key) => (val) =>
    setSelections((prev) => ({ ...prev, [key]: val }));

  // Animazione number roll — min e max del prezzo
  const animatedMin = useCountUp(displayedPrice.min, 650, showPrice);
  const animatedMax = useCountUp(displayedPrice.max, 650, showPrice);

  // Helper: label complessità dinamica
  const complexityLabel =
    {
      website: "Numero di pagine",
      ecommerce: "Catalogo prodotti",
      webApp: "Funzionalità",
      mobileApp: "Piattaforme",
    }[selectedSolution] ?? "Complessità";

  const inner = (
    <div>
      <div className="contact-inner">
        <div className="contact-form">
          <ProgressBar step={step} />

          <div className="qw-slides-viewport">
            <div className={slideClass}>
              {/* ══════════════════════════════════════════════════
                  STEP 0 — IDENTIFICAZIONE (3 input)
                  Attività · Settore · Categoria
              ══════════════════════════════════════════════════ */}
              {step === 0 && (
                <div className="contact-form-wrapper row g-3">
                  <div className="col-lg-4">
                    <div className="form-group">
                      <label className="qw-label" htmlFor="qw-activity">
                        Attività
                      </label>
                      <CustomSelect
                        id="qw-activity"
                        value={selectedBusiness}
                        onChange={setSel("selectedBusiness")}
                        options={BUSINESS_TYPES}
                        placeholder="Seleziona..."
                        disabled={false}
                      />
                    </div>
                  </div>

                  <div className="col-lg-4">
                    <div className="form-group">
                      <label className="qw-label" htmlFor="qw-field">
                        Settore
                      </label>
                      <CustomSelect
                        id="qw-field"
                        value={selectedCategory}
                        onChange={handleCategoryChange}
                        options={CATEGORIES}
                        placeholder="Seleziona..."
                        disabled={!selectedBusiness}
                      />
                    </div>
                  </div>

                  <div className="col-lg-4">
                    <div className="form-group">
                      <label className="qw-label" htmlFor="qw-category">
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
                  <div className="col-lg-8"></div>

                  <div className="col-lg-4">
                    <div className="tmp-button-here">
                      <button
                        className="qw-btn qw-btn--next w-100"
                        disabled={!canGoToStep1}
                        onClick={() => goTo(1, "forward", scrollToSection)}
                      >
                        Continua →
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* ══════════════════════════════════════════════════
                  STEP 1 — CONFIGURAZIONE + CALCOLO
                  Soluzione · Complessità · Integrazioni
                  Design · Contenuti · Multilingua · SEO
                  Urgenza · Manutenzione
              ══════════════════════════════════════════════════ */}
              {step === 1 && (
                <div className="contact-form-wrapper row g-3">
                  <div className="col-lg-4">
                    <div className="form-group">
                      <label className="qw-label" htmlFor="qw-solution">
                        Soluzione digitale
                      </label>
                      <CustomSelect
                        id="qw-solution"
                        value={selectedSolution}
                        onChange={handleSolutionChange}
                        options={SOLUTIONS}
                        placeholder="Seleziona..."
                        disabled={false}
                      />
                    </div>
                  </div>

                  <div className="col-lg-4">
                    <div className="form-group">
                      <label className="qw-label" htmlFor="qw-complexity">
                        {complexityLabel}
                      </label>
                      <CustomSelect
                        id="qw-complexity"
                        value={selectedComplexity}
                        onChange={setSel("selectedComplexity")}
                        options={complexityOptions}
                        placeholder="Seleziona..."
                        disabled={!selectedSolution}
                      />
                    </div>
                  </div>

                  <div className="col-lg-4">
                    <div className="form-group">
                      <label className="qw-label" htmlFor="qw-integration">
                        Integrazioni
                      </label>
                      <CustomSelect
                        id="qw-integration"
                        value={selectedIntegration}
                        onChange={setSel("selectedIntegration")}
                        options={PRICING_CONFIG.integrationOptions}
                        placeholder="Seleziona..."
                        disabled={!selectedComplexity}
                      />
                    </div>
                  </div>

                  <div className="col-lg-4">
                    <div className="form-group">
                      <label className="qw-label" htmlFor="qw-design">
                        Design
                      </label>
                      <CustomSelect
                        id="qw-design"
                        value={selectedDesign}
                        onChange={setSel("selectedDesign")}
                        options={PRICING_CONFIG.designOptions}
                        placeholder="Seleziona..."
                        disabled={!selectedIntegration}
                      />
                    </div>
                  </div>

                  {/* Contenuti — solo website, ecommerce, webApp */}
                  {fields.content && (
                    <div className="col-lg-4">
                      <div className="form-group">
                        <label className="qw-label" htmlFor="qw-content">
                          Contenuti
                        </label>
                        <CustomSelect
                          id="qw-content"
                          value={selectedContent}
                          onChange={setSel("selectedContent")}
                          options={PRICING_CONFIG.contentOptions}
                          placeholder="Seleziona..."
                          disabled={!selectedDesign}
                        />
                      </div>
                    </div>
                  )}

                  {/* Multilingua — solo website, ecommerce, webApp */}
                  {fields.multilang && (
                    <div className="col-lg-4">
                      <div className="form-group">
                        <label className="qw-label" htmlFor="qw-multilang">
                          Multilingua
                        </label>
                        <CustomSelect
                          id="qw-multilang"
                          value={selectedMultilang}
                          onChange={setSel("selectedMultilang")}
                          options={PRICING_CONFIG.multilangOptions}
                          placeholder="Seleziona..."
                          disabled={
                            fields.content ? !selectedContent : !selectedDesign
                          }
                        />
                      </div>
                    </div>
                  )}

                  {/* SEO — solo website, ecommerce, webApp */}
                  {fields.seo && (
                    <div className="col-lg-4">
                      <div className="form-group">
                        <label className="qw-label" htmlFor="qw-seo">
                          SEO
                        </label>
                        <CustomSelect
                          id="qw-seo"
                          value={selectedSeo}
                          onChange={setSel("selectedSeo")}
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

                  <div className="col-lg-4">
                    <div className="form-group">
                      <label className="qw-label" htmlFor="qw-urgency">
                        Urgenza
                      </label>
                      <CustomSelect
                        id="qw-urgency"
                        value={selectedUrgency}
                        onChange={setSel("selectedUrgency")}
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

                  <div className="col-lg-4">
                    <div className="form-group">
                      <label className="qw-label" htmlFor="qw-maintenance">
                        Manutenzione
                      </label>
                      <CustomSelect
                        id="qw-maintenance"
                        value={selectedMaintenance}
                        onChange={setSel("selectedMaintenance")}
                        options={PRICING_CONFIG.maintenanceOptions}
                        placeholder="Seleziona..."
                        disabled={!selectedUrgency}
                      />
                    </div>
                  </div>

                  {/* Calcola + risultato — riga intera */}
                  <div className="col-lg-12">
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
                              <div style={{ display: "flex", gap: "18px" }}>
                                <p>
                                  A partire da: <strong>{animatedMin}€*</strong>
                                </p>
                                {maintenanceMonthly > 0 && (
                                  <p>
                                    Manutenzione:{" "}
                                    <strong>
                                      + {maintenanceMonthly}€/mese
                                    </strong>
                                  </p>
                                )}
                              </div>
                              <p className="qw-note">
                                * La stima è orientativa: il preventivo
                                definitivo viene costruito insieme, nulla viene
                                deciso senza di te. Continua per richiedere una
                                valutazione.
                              </p>
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Navigazione — indietro a sinistra, continua a destra */}
                  <div className="col-lg-6">
                    <button
                      className="qw-btn qw-btn--back w-100"
                      onClick={() => goTo(0, "back", scrollToSection)}
                    >
                      ← Indietro
                    </button>
                  </div>
                  <div className="col-lg-6">
                    <button
                      className="qw-btn qw-btn--next w-100"
                      disabled={!canGoToStep2}
                      onClick={() => goTo(2, "forward", scrollToSection)}
                    >
                      Continua →
                    </button>
                  </div>
                </div>
              )}

              {/* ══════════════════════════════════════════════════
                  STEP 2 — DATI PERSONALI
              ══════════════════════════════════════════════════ */}
              {step === 2 && (
                <div className="contact-form-wrapper row g-3">
                  <div className="col-lg-4">
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
                          setFormData((p) => ({
                            ...p,
                            fullName: e.target.value,
                          }))
                        }
                      />
                    </div>
                  </div>

                  <div className="col-lg-4">
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
                          setFormData((p) => ({ ...p, phone: e.target.value }))
                        }
                      />
                    </div>
                  </div>

                  <div className="col-lg-4">
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
                          setFormData((p) => ({ ...p, email: e.target.value }))
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
                          setFormData((p) => ({ ...p, specs: e.target.value }))
                        }
                      />
                    </div>
                  </div>

                  <div className="col-lg-6">
                    <button
                      className="qw-btn qw-btn--back w-100"
                      onClick={() => goTo(1, "back", scrollToSection)}
                    >
                      ← Indietro
                    </button>
                  </div>
                  <div className="col-lg-6">
                    <button
                      className="qw-btn qw-btn--next w-100"
                      disabled={!canGoToStep3}
                      onClick={() => goTo(3, "forward", scrollToSection)}
                    >
                      Avanti →
                    </button>
                  </div>
                </div>
              )}

              {/* ══════════════════════════════════════════════════
                  STEP 3 — RIEPILOGO + INVIO
              ══════════════════════════════════════════════════ */}
              {step === 3 && sendStatus === "success" && (
                <div className="contact-form-wrapper row g-3">
                  <div className="col-lg-12">
                    <div className="qw-success">
                      <div className="qw-success-ring">
                        <svg
                          width="28"
                          height="28"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      </div>
                      <h3 className="qw-success-title">
                        Richiesta inviata, {submittedName}!
                      </h3>
                      <p className="qw-success-sub">
                        La tua stima è stata ricevuta.
                        <br />
                        Ti risponderò <strong>entro 24 ore</strong> con una
                        valutazione personalizzata.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {step === 3 && sendStatus !== "success" && (
                <div className="contact-form-wrapper row g-3">
                  <div className="col-lg-12">
                    <div className="qw-summary">
                      <div className="qw-summary-block">
                        <p className="qw-summary-section-title">Progetto</p>
                        <div className="qw-summary-grid">
                          <span className="qw-summary-key">Attività</span>
                          <span className="qw-summary-val">
                            {BUSINESS_TYPES.find(
                              (b) => b.id === selectedBusiness,
                            )?.label ?? "—"}
                          </span>
                          <span className="qw-summary-key">Settore</span>
                          <span className="qw-summary-val">
                            {CATEGORIES.find((c) => c.id === selectedCategory)
                              ?.label ?? "—"}
                          </span>
                          <span className="qw-summary-key">Categoria</span>
                          <span className="qw-summary-val">
                            {selectedMainType || "—"}
                          </span>
                          <span className="qw-summary-key">Soluzione</span>
                          <span className="qw-summary-val">
                            {getSolutionLabel(selectedSolution)}
                          </span>
                          <span className="qw-summary-key">Complessità</span>
                          <span className="qw-summary-val">
                            {getLabelFromOptions(
                              PRICING_CONFIG.complexityOptions[
                                selectedSolution
                              ],
                              selectedComplexity,
                            )}
                          </span>
                          <span className="qw-summary-key">Integrazioni</span>
                          <span className="qw-summary-val">
                            {getLabelFromOptions(
                              PRICING_CONFIG.integrationOptions,
                              selectedIntegration,
                            )}
                          </span>
                        </div>
                      </div>

                      <div className="qw-summary-block">
                        <p className="qw-summary-section-title">Dettagli</p>
                        <div className="qw-summary-grid">
                          <span className="qw-summary-key">Design</span>
                          <span className="qw-summary-val">
                            {getLabelFromOptions(
                              PRICING_CONFIG.designOptions,
                              selectedDesign,
                            )}
                          </span>
                          {fields.content && (
                            <>
                              <span className="qw-summary-key">Contenuti</span>
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
                              <span className="qw-summary-key">SEO</span>
                              <span className="qw-summary-val">
                                {getLabelFromOptions(
                                  PRICING_CONFIG.seoOptions,
                                  selectedSeo,
                                )}
                              </span>
                            </>
                          )}
                          <span className="qw-summary-key">Urgenza</span>
                          <span className="qw-summary-val">
                            {getLabelFromOptions(
                              PRICING_CONFIG.urgencyOptions,
                              selectedUrgency,
                            )}
                          </span>
                          <span className="qw-summary-key">Manutenzione</span>
                          <span className="qw-summary-val">
                            {getLabelFromOptions(
                              PRICING_CONFIG.maintenanceOptions,
                              selectedMaintenance,
                            )}
                          </span>
                        </div>
                      </div>

                      

                      <div className="qw-summary-block qw-summary-data">
                        <p className="qw-summary-section-title">
                          Dati di contatto
                        </p>
                        <div className="qw-summary-grid">
                          <span className="qw-summary-key">Nome</span>
                          <span className="qw-summary-val">{fullName}</span>
                          <span className="qw-summary-key">E-mail</span>
                          <span className="qw-summary-val">{email}</span>
                          <span className="qw-summary-key">Telefono</span>
                          <span className="qw-summary-val">{phone}</span>
                        </div>
                      </div>

                      <div className="qw-summary-block">
                        <p className="qw-summary-section-title">Specifiche</p>
                        <p className="qw-summary-specs">{specs}</p>
                      </div>

                      <div className="bm-consents">
                        <label className="bm-consent-row">
                          <input
                            type="checkbox"
                            className="bm-checkbox"
                            checked={privacyAccepted}
                            onChange={(e) =>
                              setPrivacyAccepted(e.target.checked)
                            }
                            disabled={isSending || sendStatus === "success"}
                          />
                          <span className="bm-consent-text">
                            Ho letto e accetto la{" "}
                            <a
                              href="https://www.iubenda.com/privacy-policy/41659310"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="bm-consent-link"
                            >
                              Privacy Policy
                            </a>{" "}
                            <span className="bm-consent-required">*</span>
                          </span>
                        </label>
                      </div>

                      {sendStatus === "error" && (
                        <p className="qw-feedback qw-feedback--error">
                          ✗ Qualcosa è andato storto. Riprova o contattaci
                          direttamente.
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="col-lg-6">
                    <button
                      className="qw-btn qw-btn--back w-100"
                      onClick={() => goTo(2, "back", scrollToSection)}
                      disabled={isSending || sendStatus === "success"}
                    >
                      ← Modifica dati
                    </button>
                  </div>
                  <div className="col-lg-6">
                    <button
                      className="qw-btn qw-btn--submit w-100"
                      disabled={!canSubmit}
                      onClick={() => handleSubmit(emailjs, scrollToSection)}
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
  );

  if (hideHeader) return inner;

  return (
    <div className={parentClass}>
      <section className="container" id="calcola-preventivo">
        <div className="contact-get-in-touch-wrap">
          <div className="get-in-touch-wrapper tmponhover">
            <div>
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
              {inner}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
