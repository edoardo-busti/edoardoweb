"use client";

import { useState } from "react";
import BookingModal from "./BookingModal";

export default function BookingButton({ children }) {
  const [isOpen, setIsOpen] = useState(false);

  const open = (e) => {
    e.preventDefault();
    setIsOpen(true);
  };
  const close = () => setIsOpen(false);

  return (
    <>
      <div onClick={open} style={{ display: "contents" }}>
        {children}
      </div>
      <BookingModal
        isOpen={isOpen}
        onClose={close}
        bannerSrc="/assets/images/booking/turin.jpg"
        avatarSrc="/assets/images/banner/sito-web-foto-bg.png"
        name="Edoardo Busti"
        title="Appuntamento per valutazione progetto"
        duration="30 minuti"
        description="Analizziamo insieme la tua idea, che si tratti di un sito vetrina, e-commerce, branding o strategia online. Parliamo del tuo progetto e vediamo come posso aiutarti. "
      />
    </>
  );
}
