import React from "react";
import Image from "next/image";
import { services5 } from "@/data/services";
export default function Services3() {
  return (
    <section className="latest-service-area tmp-section-gapTop" id="service">
      <div className="container">
        <div className="section-head mb--50">
          <div className="section-sub-title center-title tmp-scroll-trigger tmp-fade-in animation-order-1">
            <span className="subtitle">Migliora la tua attività</span>
          </div>
          <h2 className="title split-collab tmp-scroll-trigger tmp-fade-in animation-order-2">
            Costruiamo qualcosa di unico
          </h2>
          <p className="description section-sm tmp-scroll-trigger tmp-fade-in animation-order-3">
            La scelta di una soluzione digitale richiede cura e strategia. Creo
            siti che parlano al posto tuo: eleganti, professionali e pensati per
            convertire i visitatori in clienti.
          </p>
        </div>
        <div className="row">
          <div className="col-lg-6">
            {services5.map((service, index) => (
              <div
                key={index}
                className={`service-card-v2 tmponhover tmp-scroll-trigger tmp-fade-in animation-order-${
                  index + 1
                }`}
              >
                <h2 className="service-card-num">
                  <span>{`0${index + 1}.`}</span>
                  {service.title}
                </h2>
                <p className="service-para">{service.description}</p>
              </div>
            ))}
          </div>
          <div className="col-lg-6">
            <div className="service-card-user-image">
              <Image
                className="tmp-scroll-trigger tmp-zoom-in animation-order-1"
                alt="latest-user-image"
                src="/assets/images/services/latest-services-user-image-two.png"
                width={1134}
                height={1176}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
