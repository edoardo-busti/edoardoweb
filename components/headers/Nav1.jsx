"use client";
import React from "react";
import { menuItems, menuItemsLight } from "@/data/menu";
import { usePathname, useRouter } from "next/navigation";

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

export default function Nav1() {
  const pathname = usePathname();

  function handleClick(e, href) {
    e.preventDefault();

    const sectionId = SECTION_MAP[href];

    if (sectionId) {
      sessionStorage.setItem("scrollTo", sectionId);
      if (pathname === "/") {
        scrollToSection(sectionId);
        sessionStorage.removeItem("scrollTo");
      } else {
        window.location.href = "/";
      }
    } else if (href && href !== "#") {
      window.location.href = href;
    }
  }

  const renderMenu = (items) =>
    items.map((item, index) => {
      const isSectionLink = item.href in SECTION_MAP;

      let linkElement;

      if (item.isLink) {
        linkElement = (
          <a
            className={isActive(item.href, pathname) ? "active" : ""}
            href={isSectionLink ? "/" : item.href}
            onClick={(e) => handleClick(e, item.href)}
          >
            {item.label}
          </a>
        );
      } else if (isSectionLink) {
        linkElement = (
          <a href="/" onClick={(e) => handleClick(e, item.href)}>
            {item.label}
            {item.hasDropdown && <i className="fa-regular fa-chevron-down" />}
          </a>
        );
      } else {
        linkElement = (
          <a href={item.href}>
            {item.label}
            {item.hasDropdown && <i className="fa-regular fa-chevron-down" />}
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
            <ul className="submenu">
              {item.submenu.map((subItem, subIndex) => (
                <li key={subIndex}>
                  <a
                    className={isActive(subItem.href, pathname) ? "active" : ""}
                    href={subItem.href}
                    onClick={(e) => handleClick(e, subItem.href)}
                  >
                    {subItem.label}
                  </a>
                </li>
              ))}
            </ul>
          )}
        </li>
      );
    });

  return (
    <>
      <ul className="tmp-mainmenu dark-content">{renderMenu(menuItems)}</ul>
      <ul className="tmp-mainmenu light-content">
        {renderMenu(menuItemsLight)}
      </ul>
    </>
  );
}
