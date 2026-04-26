"use client";

import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import BookingWizard from "./BookingWizard";
import BookingInfo from "./BookingInfo";

const STEP_CONTENT = {
  calendar: {
    title: "Quando sei disponibile?",
    sub: "Scegli il giorno che preferisci.",
  },
  slots: {
    title: "A che ora ci sentiamo?",
    sub: "Seleziona il momento più comodo per te.",
  },
  form: {
    title: "Quasi fatto.",
    sub: "Inserisci i tuoi dati per completare la prenotazione.",
  },
  confirm: {
    title: "Tutto in ordine?",
    sub: "Controlla i dettagli prima di confermare.",
  },
  success: {
    title: "Prenotazione confermata.",
    sub: "A presto!",
  },
};

export default function BookingModal({
  isOpen,
  onClose,
  bannerSrc,
  avatarSrc,
  name,
  title,
  duration,
  description,
}) {
  const overlayRef = useRef(null);
  const [currentStep, setCurrentStep] = useState("calendar");

  const stepContent = STEP_CONTENT[currentStep] ?? STEP_CONTENT.calendar;

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      setCurrentStep("calendar"); // reset ad ogni apertura
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isOpen, onClose]);

  const handleOverlayClick = (e) => {
    if (e.target === overlayRef.current) onClose();
  };

  if (!isOpen) return null;

  return (
    <section
      className="bm-overlay"
      ref={overlayRef}
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
      aria-label="Prenota una call"
    >
      <div className="bm-dialog">
        <button
          className="bm-close-mobile"
          onClick={onClose}
          aria-label="Chiudi"
        >
          <X size={14} strokeWidth={2} />
        </button>
        <div className="bm-info-col">
          <BookingInfo
            bannerSrc={bannerSrc}
            avatarSrc={avatarSrc}
            name={name}
            title={title}
            duration={duration}
            description={description}
          />
        </div>

        <div className="bm-divider" />

        <div className="bm-wizard-col">
          <div className="bm-header">
            <div className="bm-header-left">
              <div className="bm-header-icon">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <rect x="3" y="4" width="18" height="18" rx="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
              </div>
              <div>
                <p className="bm-header-title">{stepContent.title}</p>
                <p className="bm-header-sub">{stepContent.sub}</p>
              </div>
            </div>
            <button className="bm-close" onClick={onClose} aria-label="Chiudi">
              <X size={14} strokeWidth={2} />
            </button>
          </div>

          <BookingWizard onClose={onClose} onStepChange={setCurrentStep} />
        </div>
      </div>
    </section>
  );
}
