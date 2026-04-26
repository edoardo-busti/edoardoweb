"use client";

import { useRef, useState } from "react";

export default function AccordionItem({ question, answers }) {
  const [isActive, setIsActive] = useState(false);
  const contentRef = useRef(null);

  const toggle = () => setIsActive((prev) => !prev);

  return (
    <div className="accordion__item">
      <header
        className={`item__header ${isActive ? "active" : ""}`}
        onClick={toggle}
      >
        <h2 className="item__question mb--0">{question}</h2>
        <div className="item__icon">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </div>
      </header>
      <div
        className="item__content"
        ref={contentRef}
        style={{
          maxHeight: isActive ? `${contentRef.current?.scrollHeight}px` : "0px",
        }}
      >
        {answers.map((answer, i) => (
          <p key={i} className="item__answer">
            {answer}
          </p>
        ))}
      </div>
    </div>
  );
}
