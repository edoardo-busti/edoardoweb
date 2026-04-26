"use client";
import { menuItems } from "@/data/menu";
import { closeMobilemenu } from "@/utlis/toggleMobilemenu";

import { usePathname } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";

const SECTION_MAP = {
  "/home": "home",
  "/servizi": "servizi",
  "/soluzioni": "soluzioni",
  "/calcola-preventivo": "calcola-preventivo",
};

function isActive(href, pathname) {
  if (!href || href.startsWith("http") || href === "#") return false;
  if (href in SECTION_MAP) return pathname === "/";
  const hrefSegment = href.split("/")[1];
  const pathSegment = pathname.split("/")[1];
  return hrefSegment && pathSegment && hrefSegment === pathSegment;
}

function scrollToSection(sectionId) {
  const target = document.getElementById(sectionId);
  if (target) {
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

export default function MobileMenu() {
  const pathname = usePathname();
  const menuRef = useRef(null);
  const innerRef = useRef(null);
  const [activeParent, setActiveParent] = useState(-1);

  useEffect(() => {
    function handleClick(event) {
      if (menuRef.current && menuRef.current.contains(event.target)) {
        if (innerRef.current && innerRef.current.contains(event.target)) {
        } else {
          closeMobilemenu();
        }
      }
    }

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  function handleNavClick(e, href) {
    e.preventDefault();

    const sectionId = SECTION_MAP[href];

    if (sectionId) {
      sessionStorage.setItem("scrollTo", sectionId);
      closeMobilemenu();
      if (pathname === "/") {
        setTimeout(() => {
          scrollToSection(sectionId);
          sessionStorage.removeItem("scrollTo");
        }, 400);
      } else {
        window.location.href = "/";
      }
    } else if (href && href !== "#") {
      closeMobilemenu();
      window.location.href = href;
    }
  }

  return (
    <div className="d-block d-xl-none">
      <div ref={menuRef} className="tmp-popup-mobile-menu">
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
                onClick={closeMobilemenu}
              >
                <i className="fa-sharp fa-light fa-xmark" />
              </button>
            </div>
          </div>
          <ul className="tmp-mainmenu">
            {menuItems.map((item, index) => {
              const isSectionLink = item.href in SECTION_MAP;

              let linkElement;

              if (item.isLink) {
                linkElement = (
                  <a
                    className={isActive(item.href, pathname) ? "active" : ""}
                    href={isSectionLink ? "/" : item.href}
                    onClick={(e) => handleNavClick(e, item.href)}
                  >
                    {item.label}
                  </a>
                );
              } else if (isSectionLink) {
                linkElement = (
                  <a href="/" onClick={(e) => handleNavClick(e, item.href)}>
                    {item.label}
                    {item.hasDropdown && (
                      <i className="fa-regular fa-chevron-down" />
                    )}
                  </a>
                );
              } else {
                linkElement = (
                  <a
                    href={item.href}
                    onClick={(e) => {
                      if (item.hasDropdown) {
                        e.preventDefault();
                        setActiveParent((pre) => (pre === index ? -1 : index));
                      }
                    }}
                    className={activeParent === index ? "open" : ""}
                  >
                    {item.label}
                    {item.hasDropdown && (
                      <i className="fa-regular fa-chevron-down" />
                    )}
                  </a>
                );
              }

              return (
                <li
                  key={index}
                  className={`${item.hasDropdown ? "has-dropdown" : ""} ${
                    item.submenu?.some((elm) => isActive(elm.href, pathname))
                      ? "menu-item-open"
                      : ""
                  }`}
                >
                  {linkElement}

                  {item.hasDropdown && (
                    <ul
                      className="submenu"
                      style={{
                        display: activeParent === index ? "block" : "none",
                      }}
                    >
                      {item.submenu.map((subItem, subIndex) => (
                        <li key={subIndex}>
                          <a
                            className={
                              isActive(subItem.href, pathname) ? "active" : ""
                            }
                            href={subItem.href}
                            onClick={(e) => handleNavClick(e, subItem.href)}
                          >
                            {subItem.label}
                          </a>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              );
            })}
          </ul>

          <div className="copyright-mobile-sidebar">
            Copyright {new Date().getFullYear()} @ Edoardo Busti <br /> P. IVA
            IT 13419130011
          </div>

          <div className="content-wrapper-mobile">
            <div className="short-contact-area">
              <div className="single-contact">
                <i className="fa-solid fa-phone" />
                <div className="information tmp-link-animation">
                  <span>telefono</span>
                  <span className="number">+39 3751458896</span>
                </div>
              </div>
              <div className="single-contact">
                <i className="fa-solid fa-envelope" />
                <div className="information tmp-link-animation">
                  <span>E-mail</span>
                  <span className="number">info@edoardoweb.it</span>
                </div>
              </div>
              <div className="single-contact">
                <i className="fa-solid fa-location-crosshairs" />
                <div className="information tmp-link-animation">
                  <span>Città</span>
                  <span className="number">
                    Via Sagra di S. Michele 45, Torino
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
