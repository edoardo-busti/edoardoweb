import React from "react";

import { services } from "@/data/services";

import Link from "next/link";
export default function Services({ isLight = false }) {
  return (
    <div className="service-area mt--120">
      <section id="servizi" className="container">
        <div className="section-head mb--50">
          <div className="section-sub-title center-title tmp-scroll-trigger tmp-fade-in animation-order-1">
            <span className="subtitle">LA TUA IDEA, LA MIA ESPERIENZA</span>
          </div>
          <h2 className="title split-collab tmp-scroll-trigger tmp-fade-in animation-order-2">
            Costruiamo la tua identità digitale
          </h2>
          <p className="description section-sm tmp-scroll-trigger tmp-fade-in animation-order-3">
            Dalla prima idea al prodotto finito, seguo ogni aspetto del tuo
            progetto. Grafica, sviluppo, ottimizzazione e strategia, per un
            percorso verso il successo.
          </p>
        </div>
        <div className="row justify-content-center">
          {services.map((service) => (
            <div className="col-lg-3 col-md-4 col-sm-6" key={service.id}>
              <div
                className={`service-card-v1 tmp-scroll-trigger tmp-fade-in animation-order-${service.animationOrder} tmp-link-animation`}
              >
                <div className="service-card-icon">
                  <i className={service.icon} />
                </div>
                <h4 className="service-title">
                  <a href="/faq">{service.title}</a>
                </h4>
                <p className="service-para">{service.projects}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
