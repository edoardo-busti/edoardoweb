"use client";

import { closeMobilemenu2 } from "@/utlis/toggleMobilemenu";

import React, { useEffect, useRef } from "react";
import OnepageNavMobile from "./OnepageNavMobile";

export default function MobileMenuOnepage() {
  const menuRef = useRef(null);
  const innerRef = useRef(null);

  useEffect(() => {
    function handleClick(event) {
      if (menuRef.current && menuRef.current.contains(event.target)) {
        if (innerRef.current && innerRef.current.contains(event.target)) {
        } else {
          closeMobilemenu2();
        }
      }
    }

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  return (
    <div className="d-block d-xl-none">
      <div ref={menuRef} className="tmp-popup-mobile-menu mobile-menu-onepage">
        <div ref={innerRef} className="inner">
          <div className="header-top">
            <div className="logo">
              <a href="index.html" className="logo-area">
                <img
                  className="logo-dark"
                  alt="Reeni - Personal Portfolio HTML Template for developers and freelancers"
                  src="/assets/images/logo/logo.png"
                  width={121}
                  height={41}
                />
                <img
                  className="logo-white"
                  alt="Reeni - Personal Portfolio HTML Template for developers and freelancers"
                  src="/assets/images/logo/logo.png"
                  width={121}
                  height={40}
                />
              </a>
            </div>
            <div className="close-menu">
              <button
                className="close-button tmp-round-action-btn"
                onClick={closeMobilemenu2}
              >
                <i className="fa-sharp fa-light fa-xmark" />
              </button>
            </div>
          </div>
          <OnepageNavMobile />

          {/* social area end */}
        </div>
      </div>
    </div>
  );
}
