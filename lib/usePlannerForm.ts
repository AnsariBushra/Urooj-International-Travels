"use client";

import { useState, useCallback } from "react";

export interface PlannerAnswers {
  destinationSlug: string;
  startDate: string;
  endDate: string;
  travelers: number;
  budget: string; // bracket id, e.g. "50-100k"
  name: string;
  email: string;
  phone: string;
  notes: string;
}

export const initialAnswers: PlannerAnswers = {
  destinationSlug: "",
  startDate: "",
  endDate: "",
  travelers: 2,
  budget: "",
  name: "",
  email: "",
  phone: "",
  notes: "",
};

export const STEP_COUNT = 4;

/**
 * Per-step validation. Kept centralized so the "Next" button and the
 * step components agree on what "complete" means without duplicating
 * rules in multiple places.
 */
function validateStep(step: number, answers: PlannerAnswers): boolean {
  switch (step) {
    case 0:
      return answers.destinationSlug.length > 0;
    case 1:
      return (
        answers.startDate.length > 0 &&
        answers.endDate.length > 0 &&
        answers.endDate >= answers.startDate &&
        answers.travelers > 0
      );
    case 2:
      return answers.budget.length > 0;
    case 3:
      return (
        answers.name.trim().length > 1 &&
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(answers.email.trim())
      );
    default:
      return false;
  }
}

export function usePlannerForm() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<PlannerAnswers>(initialAnswers);
  const [submitted, setSubmitted] = useState(false);
  const [direction, setDirection] = useState<1 | -1>(1);

  const update = useCallback(<K extends keyof PlannerAnswers>(key: K, value: PlannerAnswers[K]) => {
    setAnswers((prev) => ({ ...prev, [key]: value }));
  }, []);

  const isStepValid = validateStep(step, answers);
  const isLastStep = step === STEP_COUNT - 1;

  const goNext = useCallback(() => {
    if (!validateStep(step, answers)) return;
    if (isLastStep) {
      setSubmitted(true);
      return;
    }
    setDirection(1);
    setStep((s) => Math.min(s + 1, STEP_COUNT - 1));
  }, [step, answers, isLastStep]);

  const goBack = useCallback(() => {
    setDirection(-1);
    setStep((s) => Math.max(s - 1, 0));
  }, []);

  return {
    step,
    direction,
    answers,
    update,
    goNext,
    goBack,
    isStepValid,
    isLastStep,
    submitted,
  };
}
