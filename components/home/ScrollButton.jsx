"use client";

export default function ScrollButton({ targetId, className, children }) {
  function handleClick(e) {
    e.preventDefault();
    const target = document.getElementById(targetId);
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  return (
    <a className={className} href="/" onClick={handleClick} id="home-button">
      {children}
    </a>
  );
}
