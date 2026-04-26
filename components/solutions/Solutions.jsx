// components/Solutions.jsx
// Server Component — nessun hook, nessuna logica client

import React from "react";
import { solutionsSection, solutionsServices } from "@/data/solutionsContent";
import SolutionsCards from "@/components/solutions/SolutionsCards";

export default function Solutions() {
  const { subtitle, title, description } = solutionsSection;

  // Derivo gli array serializzabili da passare al client boundary:
  // - services: dati card (title, description, iconName)
  // - mockups:  array di { src, alt } per MockupDisplay
  const services = solutionsServices.map(
    ({ title, description, iconName, features }) => ({
      title,
      description,
      iconName,
      features,
    }),
  );

  const mockups = solutionsServices.map(({ mockup }) => mockup);

  return (
    <section className="project-details-area-wrapper pt--100" id="soluzioni">
      <div className="container">
        {/* ── Section Header — HTML statico, indicizzato dai crawler ── */}
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

        {/*
          ── Client boundary ──
          Passa solo dati serializzabili (stringhe, oggetti plain).
          Titoli e descrizioni dei servizi arrivano qui già pronti
          per essere resi lato server nelle card.
        */}
        <SolutionsCards services={services} mockups={mockups} />
      </div>
    </section>
  );
}
