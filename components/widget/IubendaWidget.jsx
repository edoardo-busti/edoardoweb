/**
 * IubendaPrivacyControls
 *
 * Carica lo script Iubenda dopo un intervallo fisso dal load della
 * pagina (QUIET_PERIOD + DELAY).
 *
 * ── CSS Override (doppia strategia) ──
 *
 * 1. Tag <style> renderizzato dal componente:
 *    Sempre nel DOM dal primo render, applica le regole istantaneamente
 *    quando gli elementi Iubenda compaiono.
 *
 * 2. MutationObserver mirato (subtree: false):
 *    Osserva SOLO i figli diretti di document.body.
 *    Scatta unicamente quando Iubenda aggiunge i suoi container
 *    (banner, iframe). Ad ogni apertura applica gli stili inline
 *    con !important.
 */

"use client";

import { useEffect } from "react";

// ── Configurazione ──────────────────────────────────────────────────

const SCRIPT_SRC =
  "https://embeds.iubenda.com/widgets/77d4d17c-edac-4f17-8bdf-b76a69add06f.js";

/** Attesa dopo il load della pagina prima di iniettare lo script */
const DELAY = 1000;

/** Sottostringa per riconoscere i nodi Iubenda */
const IUBENDA_MARKER = "iubenda";

/** ID del tag <style> per il ri-append dopo s.onload */
const STYLE_ID = "iubenda-custom-overrides";

/** Path del logo custom (sostituisce quello di default Iubenda) */
const CUSTOM_LOGO_SRC = "/assets/images/logo/logo-dark.png";

// ── CSS e selettori ─────────────────────────────────────────────────

const CUSTOM_SELECTORS = [
  "#iubenda-iframe.iubenda-iframe-branded .iubenda-modal-navigation-brand",
  "#iubenda-iframe.iubenda-iframe-branded .purposes-header",
  "#iubenda-iframe.iubenda-iframe-branded .purposes-header .iub-btn-cp",
  "#iubenda-iframe.iubenda-iframe-branded .purposes-header .iub-btn-back",
  "#iubenda-iframe.iubenda-iframe-branded .iub-cmp-header",
  "#purposes-content-container .purposes-header",
  "#iubenda-cs-banner .iubenda-cs-brand",
];

const LOGO_SELECTOR =
  "#iubenda-iframe .iubenda-modal-navigation.iubenda-modal-navigation-brand .iubenda-modal-navigation-logo img";

const CUSTOM_CSS = `
${CUSTOM_SELECTORS.join(",\n")} {
  background-color: #fff !important;
  color: #000 !important;
}
${LOGO_SELECTOR} {
  content: url("${CUSTOM_LOGO_SRC}") !important;
  max-width: 192px !important;
  max-height: 56px !important;
  min-width: auto !important;
  min-height: auto !important;
}
`;

// ── Stato globale (singleton) ───────────────────────────────────────

let injected = false;

// ── Helpers ─────────────────────────────────────────────────────────

function applyInlineStyles() {
  for (const sel of CUSTOM_SELECTORS) {
    for (const el of document.querySelectorAll(sel)) {
      el.style.setProperty("background-color", "#fff", "important");
      el.style.setProperty("color", "#000", "important");
    }
  }

  for (const img of document.querySelectorAll(LOGO_SELECTOR)) {
    if (img.getAttribute("src") !== CUSTOM_LOGO_SRC) {
      img.setAttribute("src", CUSTOM_LOGO_SRC);
    }
  }
}

function isIubendaContainer(node) {
  return (
    node.nodeType === Node.ELEMENT_NODE &&
    (node.id?.includes(IUBENDA_MARKER) ||
      node.className?.toString().includes(IUBENDA_MARKER))
  );
}

// ── Iniezione ───────────────────────────────────────────────────────

function inject() {
  if (injected) return;
  injected = true;

  const s = document.createElement("script");
  s.src = SCRIPT_SRC;
  s.async = true;

  s.onload = () => {
    const style = document.getElementById(STYLE_ID);
    if (style) document.head.appendChild(style);

    applyInlineStyles();

    const observer = new MutationObserver((mutations) => {
      for (const m of mutations) {
        for (const node of m.addedNodes) {
          if (isIubendaContainer(node)) {
            requestAnimationFrame(applyInlineStyles);
            return;
          }
        }
      }
    });

    observer.observe(document.body, { childList: true, subtree: false });
  };

  document.body.appendChild(s);
}

// ── Componente: preconnessione DNS ──────────────────────────────────

export function IubendaPreload() {
  return (
    <>
      <link rel="preconnect" href="https://embeds.iubenda.com" />
      <link rel="preconnect" href="https://cdn.iubenda.com" />
      <link rel="dns-prefetch" href="https://embeds.iubenda.com" />
      <link rel="dns-prefetch" href="https://cdn.iubenda.com" />
    </>
  );
}

// ── Componente principale ───────────────────────────────────────────

/**
 *   page load
 *     └─ DELAY (4s)
 *          └─ inject()
 *               └─ s.onload
 *                    ├─ ri-appende <style> in fondo al <head>
 *                    ├─ applyInlineStyles() immediato
 *                    └─ observer (childList, subtree: false)
 *                         └─ ogni apertura → applyInlineStyles()
 */
export default function IubendaPrivacyControls() {
  useEffect(() => {
    if (injected) return;

    let timer = null;

    function onLoad() {
      timer = setTimeout(inject, DELAY);
    }

    if (document.readyState === "complete") {
      onLoad();
    } else {
      window.addEventListener("load", onLoad, { once: true });
    }

    return () => {
      clearTimeout(timer);
      window.removeEventListener("load", onLoad);
    };
  }, []);

  return <style id={STYLE_ID}>{CUSTOM_CSS}</style>;
}
