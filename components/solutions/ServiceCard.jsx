// components/ServiceCard.jsx
"use client";

import React from "react";
import Image from "next/image";

/**
 * ServiceCard — Client Component
 *
 * @param {object}   service      - Oggetto servizio dal data array
 * @param {number}   index        - Indice della card
 * @param {boolean}  isActive     - True se questa card è attualmente attiva
 * @param {function} registerRef  - Ref callback da useActiveCard
 */

export default function ServiceCard({ service, index, isActive, registerRef }) {
  return (
    <div
      ref={(node) => registerRef(node, index)}
      className={`service-card-v2 tmp-scroll-trigger tmp-fade-in ${isActive ? " is-active" : ""}`}
    >
      {service.icon && (
        <div className="service-card-v2__icon">{service.icon}</div>
      )}

      <div className="service-card-v2__content">
        <h3 className="service-card-v2__title">{service.title}</h3>
        {service.description && (
          <p className="service-card-v2__description">{service.description}</p>
        )}

        {service.features?.length > 0 && (
          <ul className="features">
            {service.features.map((feature, i) => (
              <li key={i} className="feature">
                <Image
                  src={feature.icon}
                  alt={feature.label}
                  width={28}
                  height={28}
                />
                <span>{feature.label}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="service-card-v2__indicator" aria-hidden="true" />
    </div>
  );
}
