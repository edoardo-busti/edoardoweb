"use client";
import { useEffect } from "react";

export default function ScrollToSection() {
  useEffect(() => {
    const pending = sessionStorage.getItem("scrollTo");
    if (pending) {
      sessionStorage.removeItem("scrollTo");
      const target = document.getElementById(pending);
      if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  }, []);

  return null;
}
