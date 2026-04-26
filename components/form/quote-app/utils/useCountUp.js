import { useState, useEffect, useRef } from "react";

// ─── useCountUp ────────────────────────────────────────────────────────────────
// Anima un numero da 0 (o dal valore precedente) al target in `duration` ms.
// Usa easing ease-out per sembrare un calcolo reale che "converge".
//
// @param {number} target    — valore finale da raggiungere
// @param {number} duration  — durata animazione in ms (default 650)
// @param {boolean} run      — se false, non parte (es. prezzo non ancora calcolato)
//
// @returns {number} displayed — valore corrente animato (intero)

export function useCountUp(target, duration = 650, run = true) {
  const [displayed, setDisplayed] = useState(0);
  const rafRef      = useRef(null);
  const startRef    = useRef(null);
  const fromRef     = useRef(0);

  useEffect(() => {
    if (!run || target == null) return;

    // Parte dal valore attualmente mostrato (transizione fluida tra ricalcoli)
    fromRef.current = displayed;
    startRef.current = null;

    const animate = (timestamp) => {
      if (!startRef.current) startRef.current = timestamp;
      const elapsed  = timestamp - startRef.current;
      const progress = Math.min(elapsed / duration, 1);

      // Ease-out cubico — veloce all'inizio, rallenta verso il target
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = Math.round(fromRef.current + (target - fromRef.current) * eased);

      setDisplayed(value);

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate);
      }
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target, run]);

  return displayed;
}
