// components/MockupDisplay.jsx
"use client";

import React from "react";
import Image from "next/image";

/**
 * MockupDisplay — Client Component
 *
 * @param {Array}  mockups     - [{ src, alt, label }]
 * @param {number} activeIndex - Indice del mockup da mostrare
 */
export default function MockupDisplay({ mockups, activeIndex }) {
  return (
    <div
      id="mockup-box"
      className="mockup-display tmp-scroll-trigger tmp-fade-in"
      aria-live="polite"
    >
      {mockups.map(({ src, alt, label }, index) => (
        <div
          key={index}
          className={`mockup-display__slide${
            index === activeIndex ? " mockup-display__slide--active" : ""
          }`}
          aria-hidden={index !== activeIndex}
        >
          {/* Immagine — invariata, solo opacity transition */}
          <Image
            src={src}
            alt={alt}
            fill
            style={{ objectFit: "contain" }}
            priority={index === 0}
            sizes="(max-width: 768px) 100vw, 50vw"
          />

          {/* Label — animazione CSS keyframe, riparte ad ogni attivazione */}
          {label && <h4 className="mockup-display__label">{label}</h4>}
        </div>
      ))}
    </div>
  );
}
