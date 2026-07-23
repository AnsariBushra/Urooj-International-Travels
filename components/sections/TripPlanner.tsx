"use client";

import { useRef } from "react";
import { gsap } from "@/lib/gsap";
import { useGsap } from "@/lib/useGsap";
import SplitTextReveal from "@/components/animation/SplitTextReveal";
import Magnetic from "@/components/animation/Magnetic";
import StepTransition from "@/components/animation/StepTransition";
import GeometricPatternBackground from "@/components/three/GeometricPatternBackground";
import { usePlannerForm, STEP_COUNT } from "@/lib/usePlannerForm";
import { StepDestination, StepDatesTravelers, StepBudget, StepContact } from "./PlannerSteps";
import { destinations } from "@/data/destinations";

const STEP_LABELS = ["Destination", "Dates", "Budget", "Contact"];

function ProgressRail({ step }: { step: number }) {
  return (
    <div className="mb-10 flex items-center gap-2">
      {Array.from({ length: STEP_COUNT }).map((_, i) => (
        <div key={i} className="flex flex-1 flex-col gap-2">
          <div className="h-[3px] w-full overflow-hidden rounded-full bg-line">
            <div
              className="h-full bg-brass transition-all duration-500 ease-out"
              style={{ width: i < step ? "100%" : i === step ? "50%" : "0%" }}
            />
          </div>
          <span
            className={`hidden text-[0.7rem] tracking-[0.16em] uppercase transition-colors duration-300 md:block ${
              i === step ? "font-semibold text-brass" : i < step ? "text-mute" : "text-mute/50"
            }`}
          >
            {STEP_LABELS[i]}
          </span>
        </div>
      ))}
    </div>
  );
}

export default function TripPlanner() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const confirmRef = useRef<HTMLDivElement>(null);
  const { step, direction, answers, update, goNext, goBack, isStepValid, isLastStep, submitted } =
    usePlannerForm();

  useGsap(sectionRef, (_ctx, el) => {
    gsap.from(el.querySelector(".planner-panel"), {
      y: 40,
      opacity: 0,
      duration: 1,
      ease: "power3.out",
      scrollTrigger: {
        trigger: el,
        start: "top 80%",
        toggleActions: "play none none none",
      },
    });
  });

  useGsap(
    confirmRef,
    (_ctx, el) => {
      if (!submitted) return;
      gsap.fromTo(el, { opacity: 0, scale: 0.97 }, { opacity: 1, scale: 1, duration: 0.6, ease: "power3.out" });
    },
    [submitted]
  );

  const stepProps = { answers, update };
  const selectedDestination = destinations.find((d) => d.slug === answers.destinationSlug);

  return (
    <section ref={sectionRef} id="plan" className="relative overflow-hidden px-6 py-28 md:px-10 md:py-40">
      {/* Islamic geometric star motif — slow-drifting wireframe stars,
          themed to the brand rather than a generic abstract backdrop */}
      <GeometricPatternBackground />

      <div className="relative z-10 mx-auto max-w-3xl text-center">
        <span className="label-eyebrow mb-5 block">Plan Your Journey</span>
        <SplitTextReveal
          as="h2"
          lines={["Tell us about your trip.", "We'll handle the rest."]}
          className="font-display text-4xl font-normal leading-[1.05] tracking-tight text-bone md:text-5xl"
        />
      </div>

      <div className="planner-panel glass-panel relative z-10 mx-auto mt-14 max-w-3xl rounded-md p-7 md:p-12">
        {submitted ? (
          <div ref={confirmRef} className="py-10 text-center">
            <span className="label-eyebrow mb-4 block text-brass">Request received</span>
            <h3 className="font-display text-3xl text-bone md:text-4xl">
              Thank you, {answers.name.split(" ")[0] || "there"}.
            </h3>
            <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-mute">
              We&apos;ve noted your interest in{" "}
              {selectedDestination ? selectedDestination.name : "your journey"} for {answers.travelers}{" "}
              {answers.travelers === 1 ? "pilgrim" : "pilgrims"}. Someone from our team will reach out at{" "}
              {answers.email} within one business day, or you can call us directly at 9971337283.
            </p>
            {/*
              TODO: replace this confirmation-only state with a real submission —
              e.g. POST `answers` to an API route that forwards via email
              (Resend/SendGrid) or writes to a CRM/sheet. No backend exists yet,
              so nothing is currently sent anywhere.
            */}
          </div>
        ) : (
          <>
            <ProgressRail step={step} />
            <StepTransition stepKey={step} direction={direction}>
              {step === 0 && <StepDestination {...stepProps} />}
              {step === 1 && <StepDatesTravelers {...stepProps} />}
              {step === 2 && <StepBudget {...stepProps} />}
              {step === 3 && <StepContact {...stepProps} />}
            </StepTransition>

            <div className="mt-12 flex items-center justify-between border-t border-line pt-6">
              <button
                type="button"
                onClick={goBack}
                data-cursor="link"
                className={`text-sm text-mute transition-opacity hover:text-bone ${
                  step === 0 ? "pointer-events-none opacity-0" : "opacity-100"
                }`}
              >
                ← Back
              </button>
              <Magnetic
                as="button"
                onClick={goNext}
                data-cursor="view"
                className={`rounded-full border px-7 py-3 text-sm tracking-wide transition-colors ${
                  isStepValid
                    ? "border-brass bg-brass/10 text-brass hover:bg-brass/20"
                    : "border-line text-mute"
                }`}
              >
                {isLastStep ? "Send request" : "Continue"}
              </Magnetic>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
