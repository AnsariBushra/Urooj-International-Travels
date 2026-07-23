"use client";

import { PlannerAnswers } from "@/lib/usePlannerForm";
import { destinations } from "@/data/destinations";
import { FieldLabel, TextInput, TextArea, PillOption } from "@/components/ui/PlannerFields";

interface StepProps {
  answers: PlannerAnswers;
  update: <K extends keyof PlannerAnswers>(key: K, value: PlannerAnswers[K]) => void;
}

export function StepDestination({ answers, update }: StepProps) {
  return (
    <div>
      <span className="label-eyebrow mb-2 block text-brass">Step 1 of 4</span>
      <h3 className="font-display text-3xl font-normal text-bone md:text-4xl">Which package?</h3>
      <p className="mt-2 text-sm text-mute">Pick the service closest to what you have in mind.</p>
      <div className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-3">
        {destinations.map((destination) => {
          const isSelected = answers.destinationSlug === destination.slug;
          return (
            <button
              key={destination.slug}
              type="button"
              onClick={() => update("destinationSlug", destination.slug)}
              data-cursor="link"
              aria-pressed={isSelected}
              className={`relative rounded-sm border-2 px-4 py-5 text-left transition-all duration-300 ${
                isSelected
                  ? "border-brass bg-brass text-ink shadow-[0_6px_20px_rgba(217,164,65,0.35)]"
                  : "border-line bg-transparent hover:border-bone/30"
              }`}
            >
              {isSelected && (
                <span className="absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full bg-ink text-[10px] text-cream">
                  ✓
                </span>
              )}
              <span className={`block font-display text-lg ${isSelected ? "text-ink" : "text-bone"}`}>
                {destination.name}
              </span>
              <span className={`mt-1 block text-xs ${isSelected ? "text-ink/70" : "text-mute"}`}>
                {destination.region}
              </span>
            </button>
          );
        })}
        {(() => {
          const isSelected = answers.destinationSlug === "undecided";
          return (
            <button
              type="button"
              onClick={() => update("destinationSlug", "undecided")}
              data-cursor="link"
              aria-pressed={isSelected}
              className={`relative rounded-sm border-2 px-4 py-5 text-left transition-all duration-300 ${
                isSelected
                  ? "border-brass bg-brass text-ink shadow-[0_6px_20px_rgba(217,164,65,0.35)]"
                  : "border-line bg-transparent hover:border-bone/30"
              }`}
            >
              {isSelected && (
                <span className="absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full bg-ink text-[10px] text-cream">
                  ✓
                </span>
              )}
              <span className={`block font-display text-lg ${isSelected ? "text-ink" : "text-bone"}`}>
                Not sure yet
              </span>
              <span className={`mt-1 block text-xs ${isSelected ? "text-ink/70" : "text-mute"}`}>
                Help me decide
              </span>
            </button>
          );
        })()}
      </div>
    </div>
  );
}

export function StepDatesTravelers({ answers, update }: StepProps) {
  return (
    <div>
      <span className="label-eyebrow mb-2 block text-brass">Step 2 of 4</span>
      <h3 className="font-display text-3xl font-normal text-bone md:text-4xl">When, and with how many?</h3>
      <p className="mt-2 text-sm text-mute">Rough dates are fine — we&apos;ll refine them with you.</p>

      <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
        <div>
          <FieldLabel>Start date</FieldLabel>
          <TextInput
            type="date"
            value={answers.startDate}
            onChange={(e) => update("startDate", e.target.value)}
          />
        </div>
        <div>
          <FieldLabel>End date</FieldLabel>
          <TextInput
            type="date"
            value={answers.endDate}
            onChange={(e) => update("endDate", e.target.value)}
            min={answers.startDate || undefined}
          />
        </div>
      </div>

      <div className="mt-8">
        <FieldLabel>Pilgrims</FieldLabel>
        <div className="flex items-center gap-5">
          <button
            type="button"
            data-cursor="link"
            onClick={() => update("travelers", Math.max(1, answers.travelers - 1))}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-line text-bone hover:border-brass"
            aria-label="Decrease pilgrims"
          >
            −
          </button>
          <span className="w-8 text-center font-display text-xl text-bone">{answers.travelers}</span>
          <button
            type="button"
            data-cursor="link"
            onClick={() => update("travelers", Math.min(12, answers.travelers + 1))}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-line text-bone hover:border-brass"
            aria-label="Increase pilgrims"
          >
            +
          </button>
        </div>
      </div>
    </div>
  );
}

const BUDGET_BRACKETS = [
  { id: "under-50k", label: "Under ₹50,000" },
  { id: "50-100k", label: "₹50,000 – ₹1,00,000" },
  { id: "100-200k", label: "₹1,00,000 – ₹2,00,000" },
  { id: "200k-plus", label: "₹2,00,000+" },
];

export function StepBudget({ answers, update }: StepProps) {
  return (
    <div>
      <span className="label-eyebrow mb-2 block text-brass">Step 3 of 4</span>
      <h3 className="font-display text-3xl font-normal text-bone md:text-4xl">What&apos;s the budget, per person?</h3>
      <p className="mt-2 text-sm text-mute">This shapes the package — not a commitment.</p>
      <div className="mt-8 flex flex-wrap gap-3">
        {BUDGET_BRACKETS.map((bracket) => (
          <PillOption
            key={bracket.id}
            label={bracket.label}
            selected={answers.budget === bracket.id}
            onClick={() => update("budget", bracket.id)}
          />
        ))}
      </div>
    </div>
  );
}

export function StepContact({ answers, update }: StepProps) {
  return (
    <div>
      <span className="label-eyebrow mb-2 block text-brass">Step 4 of 4</span>
      <h3 className="font-display text-3xl font-normal text-bone md:text-4xl">Last thing — how do we reach you?</h3>
      <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
        <div>
          <FieldLabel>Full name</FieldLabel>
          <TextInput
            type="text"
            placeholder="Your name"
            value={answers.name}
            onChange={(e) => update("name", e.target.value)}
          />
        </div>
        <div>
          <FieldLabel>Email</FieldLabel>
          <TextInput
            type="email"
            placeholder="you@email.com"
            value={answers.email}
            onChange={(e) => update("email", e.target.value)}
          />
        </div>
        <div>
          <FieldLabel>Phone (optional)</FieldLabel>
          <TextInput
            type="tel"
            placeholder="+91 99713 37283"
            value={answers.phone}
            onChange={(e) => update("phone", e.target.value)}
          />
        </div>
      </div>
      <div className="mt-6">
        <FieldLabel>Anything else we should know? (optional)</FieldLabel>
        <TextArea
          rows={3}
          placeholder="Group size, visa status, special assistance needs..."
          value={answers.notes}
          onChange={(e) => update("notes", e.target.value)}
        />
      </div>
    </div>
  );
}
