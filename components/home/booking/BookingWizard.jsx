"use client";

import { useState, useCallback } from "react";
import StepCalendar from "./steps/StepCalendar";
import StepSlots from "./steps/StepSlots";
import StepForm from "./steps/StepForm";
import StepConfirm from "./steps/StepConfirm";
import StepSuccess from "./steps/StepSuccess";
import BookingProgress from "./BookingProgress";
import BookingFooter from "./BookingFooter";
import { format } from "date-fns";

const STEPS = ["calendar", "slots", "form", "confirm", "success"];

export default function BookingWizard({ onClose, onStepChange }) {
  const [stepIndex, setStepIndex] = useState(0);
  const [direction, setDirection] = useState("forward");
  const [animating, setAnimating] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  const [booking, setBooking] = useState({
    type: null,
    date: null,
    slot: null,
    name: "",
    email: "",
    phone: "",
    privacyAccepted: false,
    termsAccepted: false,
    meetLink: null,
  });

  const currentStep = STEPS[stepIndex];

  const canProceed = useCallback(() => {
    switch (currentStep) {
      case "calendar":
        return !!booking.date;
      case "slots":
        return !!booking.slot;
      case "form": {
        const { name, email, phone, type, privacyAccepted } = booking;
        if (!name.trim() || !email.trim() || !type) return false;
        if (type === "phone" && !phone.trim()) return false;
        if (!privacyAccepted) return false;
        return true;
      }
      case "confirm":
        return true;
      default:
        return false;
    }
  }, [currentStep, booking]);

  const goTo = useCallback(
    (index, dir) => {
      setDirection(dir);
      setAnimating(true);
      setStepIndex(index);
      onStepChange?.(STEPS[index]);
      setTimeout(() => setAnimating(false), 320);
    },
    [onStepChange],
  );

  const handleSubmit = async () => {
    setSubmitting(true);
    setSubmitError(null);

    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date: format(booking.date, "yyyy-MM-dd"),
          slot: booking.slot,
          type: booking.type,
          name: booking.name,
          email: booking.email,
          phone: booking.phone ?? null,
          privacyAccepted: booking.privacyAccepted,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Errore nella prenotazione");

      setBooking((prev) => ({ ...prev, meetLink: data.meetLink }));
      goTo(stepIndex + 1, "forward");
    } catch (err) {
      setSubmitError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const goNext = useCallback(() => {
    if (animating) return;
    if (currentStep === "confirm") {
      handleSubmit();
      return;
    }
    goTo(stepIndex + 1, "forward");
  }, [animating, currentStep, stepIndex, goTo]);

  const goBack = useCallback(() => {
    if (animating || stepIndex === 0) return;
    goTo(stepIndex - 1, "back");
  }, [animating, stepIndex, goTo]);

  const updateBooking = (patch) =>
    setBooking((prev) => ({ ...prev, ...patch }));

  const isSuccess = currentStep === "success";

  return (
    <>
      <BookingProgress currentStep={currentStep} />

      <div className="bm-body">
        <div
          className={`bm-slide ${direction === "forward" ? "bm-slide--enter-right" : "bm-slide--enter-left"}`}
          key={currentStep}
        >
          {currentStep === "calendar" && (
            <StepCalendar
              value={booking.date}
              onChange={(date) => updateBooking({ date, slot: null })}
            />
          )}
          {currentStep === "slots" && (
            <StepSlots
              date={booking.date}
              value={booking.slot}
              onChange={(slot) => updateBooking({ slot })}
            />
          )}
          {currentStep === "form" && (
            <StepForm booking={booking} onChange={updateBooking} />
          )}
          {currentStep === "confirm" && <StepConfirm booking={booking} />}
          {currentStep === "success" && <StepSuccess booking={booking} />}
        </div>

        {submitError && <p className="bm-submit-error">{submitError}</p>}
      </div>

      {!isSuccess && (
        <BookingFooter
          stepIndex={stepIndex}
          canProceed={canProceed()}
          onBack={goBack}
          onNext={goNext}
          isConfirm={currentStep === "confirm"}
          submitting={submitting}
        />
      )}
    </>
  );
}
