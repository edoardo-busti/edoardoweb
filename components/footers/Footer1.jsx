"use client";
import Image from "next/image";

import { footerLinks, footerLinksWhite } from "@/data/footerLinks";
export default function Footer1({
  darkLogo = "/assets/images/logo/logo.png",
  lightLogo = "/assets/images/logo/logo-white.png",
}) {
  return (
    <>
      <footer className="footer-area footer-style-one-wrapper bg-color-footer bg_images">
        <div className="container">
          <div className="footer-main footer-style-one">
            <div className="row g-5">
              <div className="col-lg-5 col-md-6">
                <div className="single-footer-wrapper border-right mr--20">
                  <div className="logo">
                    <a href={`/`}>
                      <Image
                        className="logo-dark"
                        alt="Reeni - Personal Portfolio HTML Template for developers and freelancers"
                        src={darkLogo}
                        width={121}
                        height={41}
                      />
                      <Image
                        className="logo-white"
                        alt="Reeni - Personal Portfolio HTML Template for developers and freelancers"
                        src={lightLogo}
                        width={121}
                        height={40}
                      />
                    </a>
                  </div>
                  <p className="description">
                    <span>Affidati</span> a un professionista
                  </p>
                </div>
              </div>
              <div className="col-lg-4 col-md-6">
                <div className="single-footer-wrapper quick-link-wrap">
                  <h4 className="ft-title">Link utili</h4>
                  <ul className="ft-link tmp-link-animation dark-content">
                    {footerLinks.map((item, index) => (
                      <li key={index}>
                        <a href={item.href} className={item.class}>
                          {item.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                  <ul className="ft-link tmp-link-animation light-content2">
                    {footerLinksWhite.map((item, index) => (
                      <li key={index}>
                        <a href={item.href}>{item.label}</a>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="col-lg-3 col-md-6">
                <div className="single-footer-wrapper contact-wrap">
                  <h4 className="ft-title">Contatti</h4>
                  <ul className="ft-link tmp-link-animation">
                    <li>
                      <span className="ft-icon">
                        <i className="fa-solid fa-envelope" />
                      </span>
                      info@edoardoweb.com
                    </li>
                    <li>
                      <span className="ft-icon">
                        <i className="fa-solid fa-location-dot" />
                      </span>
                      Via Sagra di S. Michele 45, Torino, TO
                    </li>
                    <li>
                      <span className="ft-icon">
                        <i className="fa-solid fa-phone" />
                      </span>
                      +39 3751458896
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>{" "}
    </>
  );
}
