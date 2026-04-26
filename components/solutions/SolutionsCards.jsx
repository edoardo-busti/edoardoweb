// components/SolutionsCards.jsx
"use client";

import React from "react";
import { useActiveCard } from "@/utlis/useActiveCard";
import ServiceCard from "@/components/solutions/ServiceCard";
import MockupDisplay from "@/components/solutions/MockupDisplay";

/**
 * SolutionsCards — Client Component (thin wrapper)
 *
 * Unico punto "use client" che conosce lo stato attivo.
 * Riceve tutti i dati già pronti dal Server Component Solutions.
 *
 * @param {Array} services - [{ title, description, iconName }]
 * @param {Array} mockups  - [{ src, alt }]
 */
export default function SolutionsCards({ services, mockups }) {
  const { activeIndex, registerRef } = useActiveCard(services.length);

  return (
    <div className="row">
      {/* Colonna sinistra: Service Cards */}
      <div className="col-lg-8">
        {services.map((service, index) => (
          <ServiceCard
            key={index}
            service={service}
            index={index}
            isActive={activeIndex === index}
            registerRef={registerRef}
          />
        ))}
      </div>

      {/* Colonna destra: Mockup (sticky già gestito dal CSS esterno) */}
      <div className="col-lg-4">
        <div className="signle-side-bar">
          <MockupDisplay mockups={mockups} activeIndex={activeIndex} />
        </div>
      </div>
    </div>
  );
}
