import React from "react";
import Image from "next/image";
import Link from "next/link";
import TypeWriterWrapper from "./TypeWriterWrapper";
import BookingButton from "./booking/BookingButton";
import ScrollButton from "./ScrollButton";
export default function Hero() {
  return (
    <section className="tmp-banner-one-area" id="home">
      <div className="container">
        <div className="banner-one-main-wrapper">
          <div className="row align-items-center">
            <div className="col-lg-6 order-lg-2">
              <div className="banner-right-content">
                <Image
                  className="tmp-scroll-trigger tmp-zoom-in animation-order-1 hero-foto"
                  alt="banner-img"
                  src="/assets/images/banner/sito-web-foto-elegante_1.png"
                  width={3840}
                  height={4628}
                  quality={100}
                  style={{ width: "auto", height: "auto" }}
                  unoptimized
                />
                {/**<h2 className="banner-big-text-1 up-down">WEB DESIGNER</h2>
                <h2 className="banner-big-text-2 up-down-2">WEB DESIGNER</h2> */}
              </div>
            </div>
            <div className="col-lg-6 order-lg-1">
              <div className="inner">
                <h1>
                  <span
                    className="title tmp-scroll-trigger tmp-fade-in animation-order-1"
                    style={{ display: "block" }}
                  >
                    Sono Edoardo Busti,
                  </span>
                  <span
                    className="title tmp-scroll-trigger tmp-fade-in animation-order-2 mt--5"
                    style={{ display: "block" }}
                  >
                    esperto{" "}
                    <span className="cd-headline clip is-full-width">Web </span>
                    <span className="cd-headline clip is-full-width">
                      <TypeWriterWrapper />
                    </span>
                  </span>
                </h1>
                <p className="disc tmp-scroll-trigger tmp-fade-in animation-order-3">
                  Progetto e sviluppo siti aziendali, e-commerce e applicazioni
                  personalizzate. Per imprese e professionisti che vogliono
                  farsi trovare dai clienti giusti e costruire una presenza
                  digitale che porta risultati.
                </p>
                <div className="button-area-banner-one tmp-scroll-trigger tmp-fade-in animation-order-4">
                  <BookingButton>
                    <Link
                      className="tmp-btn call-btn"
                      href={""}
                      id="home-button"
                    >
                      <span className="call-btn-wrap">
                        <span className="btn-icon call-btn-icon">
                          <i
                            className="fa-solid fa-phone"
                            id="home-button-icon-phone"
                          ></i>
                        </span>
                        <span className="btn-text">Prenota una call</span>
                      </span>
                    </Link>
                  </BookingButton>
                  <ScrollButton
                    targetId="calcola-preventivo"
                    className="tmp-btn hover-icon-reverse"
                  >
                    <span className="icon-reverse-wrapper">
                      <span className="btn-text">Calcola un preventivo</span>
                      <span className="btn-icon">
                        <i
                          className="fa-sharp fa-regular fa-arrow-right"
                          id="home-button-icon"
                        />
                      </span>
                      <span className="btn-icon">
                        <i
                          className="fa-sharp fa-regular fa-arrow-right"
                          id="home-button-icon"
                        />
                      </span>
                    </span>
                  </ScrollButton>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
