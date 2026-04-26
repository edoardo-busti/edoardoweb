// hooks/useActiveCard.js
import { useState, useCallback, useRef } from "react";

/**
 * useActiveCard
 *
 * Determina la card attiva confrontando la superficie visibile
 * (intersectionRatio) di tutte le card contemporaneamente.
 * Immune a scroll veloci: non dipende da eventi enter/exit
 * ma dal confronto continuo tra i ratio correnti.
 *
 * Restituisce:
 *  - activeIndex  → indice della card con più superficie visibile
 *  - registerRef  → ref callback da passare a ogni ServiceCard
 */
export function useActiveCard(total) {
  const [activeIndex, setActiveIndex] = useState(0);

  // Mappa indicizzata dei ratio correnti: { [index]: intersectionRatio }
  // Usiamo un ref perché non serve un re-render ad ogni aggiornamento del ratio —
  // solo quando cambia il vincitore.
  const ratiosRef = useRef({});

  // Ref agli observer per cleanup corretto al dismount
  const observersRef = useRef([]);

  /**
   * Confronta tutti i ratio noti e aggiorna activeIndex
   * solo se il vincitore è cambiato.
   */
  const pickWinner = useCallback(() => {
    const ratios = ratiosRef.current;
    let bestIndex = 0;
    let bestRatio = -1;

    for (const [i, ratio] of Object.entries(ratios)) {
      if (ratio > bestRatio) {
        bestRatio = ratio;
        bestIndex = Number(i);
      }
    }

    // Aggiorna lo stato solo se il vincitore è effettivamente cambiato
    setActiveIndex((prev) => (prev !== bestIndex ? bestIndex : prev));
  }, []);

  /**
   * ref callback: montaggio/smontaggio di ogni ServiceCard.
   * Crea un observer per card con threshold granulare (ogni 1% di visibilità)
   * per avere aggiornamenti continui durante lo scroll.
   */
  const registerRef = useCallback(
    (node, index) => {
      // Cleanup observer precedente per questo slot
      if (observersRef.current[index]) {
        observersRef.current[index].disconnect();
        delete ratiosRef.current[index];
      }

      if (!node) return;

      // Threshold array: [0, 0.01, 0.02, ..., 1.00]
      // L'observer scatta ad ogni variazione dell'1% di visibilità,
      // garantendo aggiornamenti continui anche con scroll rapido.
      const thresholds = Array.from({ length: 101 }, (_, i) => i / 100);

      const observer = new IntersectionObserver(
        ([entry]) => {
          ratiosRef.current[index] = entry.intersectionRatio;
          pickWinner();
        },
        {
          threshold: thresholds,
          // Nessuna rootMargin: confrontiamo la visibilità reale nel viewport
          rootMargin: "0px",
        },
      );

      observer.observe(node);
      observersRef.current[index] = observer;
    },
    [pickWinner],
  );

  return { activeIndex, registerRef };
}
