"use client";

import Image from "next/image";

/**
 * BookingInfo
 * Props:
 * - bannerSrc:  string — URL o import dell'immagine banner
 * - avatarSrc:  string — URL o import della foto profilo
 * - name:       string — nome visualizzato sotto l'avatar
 * - title:      string — titolo della call
 * - duration:   string — es. "30 minuti"
 * - description: string — testo descrittivo
 */
export default function BookingInfo({
  bannerSrc,
  avatarSrc,
  name = "Il tuo nome",
  title = "Call gratuita",
  duration = "30 minuti",
  description = "Prenota una call conoscitiva gratuita.",
}) {
  return (
    <div className="bi-panel">
      {/* Banner + avatar sovrapposto */}
      <div className="bi-banner-wrap">
        {bannerSrc ? (
          <Image
            src={bannerSrc}
            alt="banner"
            fill
            className="bi-banner-img"
            sizes="460px"
            priority
          />
        ) : (
          <div className="bi-banner-placeholder" />
        )}

        {/* Avatar sul bordo inferiore del banner */}
        <div className="bi-avatar-wrap">
          {avatarSrc ? (
            <Image
              src={avatarSrc}
              alt={name}
              width={72}
              height={72}
              className="bi-avatar-img"
            />
          ) : (
            <div className="bi-avatar-placeholder">
              {name.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
      </div>

      {/* Contenuto */}
      <div className="bi-body">
        <p className="bi-name">{name}</p>
        <h2 className="bi-title">{title}</h2>
        <p className="bi-duration">
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
          {duration}
        </p>
        <p className="bi-description">{description}</p>
      </div>
    </div>
  );
}
