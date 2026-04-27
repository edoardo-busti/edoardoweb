"use client";

import { closeSidebar } from "@/utlis/toggleSidebar";

export default function Sidebar() {
  return (
    <div className="d-none d-xl-block">
      <div className="tmp-sidebar-area tmp_side_bar">
        <div className="inner">
          <div className="top-area">
            <a href="index.html" className="logo">
              <img
                className="logo-dark"
                alt="EB - Soluzioni Web"
                src="/assets/images/logo/logo.png"
                width={121}
                height={70}
              />
              <img
                className="logo-white"
                alt="Reeni - Personal Portfolio HTML Template for developers and freelancers"
                src="/assets/images/logo/logo.png"
                width={121}
                height={40}
              />
            </a>
            <div className="close-icon-area">
              <button
                className="tmp-round-action-btn close_side_menu_active"
                onClick={closeSidebar}
              >
                <i className="fa-sharp fa-light fa-xmark" />
              </button>
            </div>
          </div>
          <div className="content-wrapper">
            <div className="image-area-feature">
              <a href="index.html">
                {/**<Image
                    alt="personal-logo"
                    src="/assets/images/banner/banner-user-image-04.png"
                    width={525}
                    height={525}
                  /> */}
              </a>
            </div>
            <h4 className="title mt--30">Soluzioni web su misura</h4>
            <p className="disc">
              Trasformo brief ambiziosi in prodotti digitali concreti, curati e
              costruiti per durare.
            </p>
            <div className="short-contact-area">
              {/* single contact information */}
              <div className="single-contact">
                <i className="fa-solid fa-phone" />
                <div className="information tmp-link-animation">
                  <span>telefono</span>
                  <span href="#" className="number">
                    +39 3751458896
                  </span>
                </div>
              </div>
              {/* single contact information end */}
              {/* single contact information */}
              <div className="single-contact">
                <i className="fa-solid fa-envelope" />
                <div className="information tmp-link-animation">
                  <span>E-mail</span>
                  <span className="number">info@edoardoweb.it</span>
                </div>
              </div>
              {/* single contact information end */}
              {/* single contact information */}
              <div className="single-contact">
                <i className="fa-solid fa-location-crosshairs" />
                <div className="information tmp-link-animation">
                  <span>Città</span>
                  <span className="number">
                    Via Sagra S. Michele 45, Torino, TO
                  </span>
                </div>
              </div>
              {/* single contact information end */}
            </div>
            {/* social area start */}

            {/* social area end */}
          </div>
        </div>
      </div>
      <a
        className="overlay_close_side_menu close_side_menu_active"
        onClick={closeSidebar}
        href="#"
      />
    </div>
  );
}
