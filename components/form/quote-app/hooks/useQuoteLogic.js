import { useState, useEffect, useMemo, useRef } from "react";
import { PRICING_CONFIG, SOLUTION_FIELDS } from "../config/pricing";
import { BUSINESS_TYPES, CATEGORIES } from "../constants/quoteOptions";
import {
  calculatePriceRange,
  getLabelFromOptions,
  getSolutionLabel,
} from "../utils/pricing";

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

// Campi Step 1 da resettare quando cambia la soluzione nello Step 0
const STEP1_RESET = {
  selectedDesign: "",
  selectedContent: "",
  selectedMultilang: "",
  selectedSeo: "",
  selectedUrgency: "",
  selectedMaintenance: "",
};

// ─── Hook principale ───────────────────────────────────────────────────────────
export function useQuoteLogic() {
  // ── Navigazione ──────────────────────────────────────────────────────────────
  const [step, setStep] = useState(0);
  const [animDir, setAnimDir] = useState("forward");
  const [animating, setAnimating] = useState(false);

  const goTo = (nextStep, dir = "forward", onAfter = null) => {
    setAnimDir(dir);
    setAnimating(true);
    setTimeout(() => {
      setStep(nextStep);
      setAnimating(false);
      onAfter?.();
    }, 320);
  };

  // ── Selezioni configuratore ──────────────────────────────────────────────────
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

  // ── Form dati personali ──────────────────────────────────────────────────────
  const [formData, setFormData] = useState(INITIAL_FORM);
  const { fullName, email, phone, specs } = formData;

  // ── Risultato pricing ────────────────────────────────────────────────────────
  const [displayedPrice, setDisplayedPrice] = useState({
    min: null,
    max: null,
  });
  const [maintenanceMonthly, setMaintenanceMonthly] = useState(0);
  const [showPrice, setShowPrice] = useState(false);
  const [triggered, setTriggered] = useState(false);
  const [hasPriced, setHasPriced] = useState(false);

  // ── Invio email ──────────────────────────────────────────────────────────────
  const [isSending, setIsSending] = useState(false);
  const [sendStatus, setSendStatus] = useState(null);
  const [submittedName, setSubmittedName] = useState("");
  const [privacyAccepted, setPrivacyAccepted] = useState(false);

  // ── Campi visibili per soluzione ─────────────────────────────────────────────
  const fields = selectedSolution
    ? (SOLUTION_FIELDS[selectedSolution] ?? {})
    : { content: true, multilang: true, seo: true };

  // ── Opzioni dinamiche ────────────────────────────────────────────────────────
  const mainTypeOptions = useMemo(() => {
    if (!selectedCategory) return [];
    const cat = CATEGORIES.find((c) => c.id === selectedCategory);
    return cat ? cat.mainTypes.map((mt) => ({ id: mt, label: mt })) : [];
  }, [selectedCategory]);

  const complexityOptions = selectedSolution
    ? (PRICING_CONFIG.complexityOptions[selectedSolution] ?? [])
    : [];

  // ── Reset a cascata ───────────────────────────────────────────────────────────
  const handleCategoryChange = (val) =>
    setSelections((prev) => ({
      ...prev,
      selectedCategory: val,
      selectedMainType: "",
      selectedSolution: "",
      selectedComplexity: "",
      selectedIntegration: "",
      ...STEP1_RESET,
    }));

  const handleMainTypeChange = (val) =>
    setSelections((prev) => ({
      ...prev,
      selectedMainType: val,
      selectedSolution: "",
      selectedComplexity: "",
      selectedIntegration: "",
      ...STEP1_RESET,
    }));

  // Cambiare soluzione resetta anche tutti i campi di Step 1
  const handleSolutionChange = (val) => {
    setSelections((prev) => ({
      ...prev,
      selectedSolution: val,
      selectedComplexity: "",
      selectedIntegration: "",
      ...STEP1_RESET,
    }));
    setHasPriced(false);
    setShowPrice(false);
    setDisplayedPrice({ min: null, max: null });
    setMaintenanceMonthly(0);
    setSendStatus(null);
  };

  // ── Ricalcolo automatico dopo il primo calcolo ────────────────────────────────
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
      setMaintenanceMonthly(
        PRICING_CONFIG.maintenancePrices?.[selectedMaintenance] ?? 0,
      );
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

  // ── Gates ─────────────────────────────────────────────────────────────────────

  // Step 0 → Step 1: tutti e 6 i campi di identificazione compilati
  const canGoToStep1 = !!(
    selectedBusiness &&
    selectedCategory &&
    selectedMainType
  );
  // Bottone "Calcola preventivo" in Step 1: tutti i campi di configurazione compilati
  const coreReady = !!(
    selectedSolution &&
    selectedComplexity &&
    selectedIntegration &&
    selectedDesign &&
    selectedUrgency &&
    selectedMaintenance
  );
  const extraReady =
    (!fields.content || !!selectedContent) &&
    (!fields.multilang || !!selectedMultilang) &&
    (!fields.seo || !!selectedSeo);
  const canCalculate = coreReady && extraReady;

  // Step 1 → Step 2: preventivo calcolato
  const canGoToStep2 = hasPriced;

  // Step 2 → Step 3: form dati personali completo
  const canGoToStep3 =
    fullName.trim() !== "" &&
    email.trim() !== "" &&
    phone.trim() !== "" &&
    specs.trim() !== "";

  const canSubmit =
    canGoToStep3 && privacyAccepted && !isSending && sendStatus !== "success";
  const showResult = !!(displayedPrice.min || (triggered && !showPrice));

  // ── Slide animation class ─────────────────────────────────────────────────────
  const slideClass = animating
    ? animDir === "forward"
      ? "qw-slide qw-slide--exit-left"
      : "qw-slide qw-slide--exit-right"
    : animDir === "forward"
      ? "qw-slide qw-slide--enter-right"
      : "qw-slide qw-slide--enter-left";

  // ── Invio email ───────────────────────────────────────────────────────────────
  const handleSubmit = async (emailjs, onSuccess = null) => {
    if (!canSubmit) return;
    setIsSending(true);
    setSendStatus(null);

    const categoryLabel =
      CATEGORIES.find((c) => c.id === selectedCategory)?.label ??
      selectedCategory;
    const businessLabel =
      BUSINESS_TYPES.find((b) => b.id === selectedBusiness)?.label ??
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
      onSuccess?.();
      setSubmittedName(fullName.trim().split(" ")[0]);
      setPrivacyAccepted(false);
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
        setSubmittedName("");
      }, 10000);
    } catch (err) {
      console.error("EmailJS error:", err);
      setSendStatus("error");
    } finally {
      setIsSending(false);
    }
  };

  return {
    // navigazione
    step,
    animDir,
    animating,
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
    triggered,
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
  };
}
