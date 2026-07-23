"use client";

interface FieldLabelProps {
  children: React.ReactNode;
}

export function FieldLabel({ children }: FieldLabelProps) {
  return <label className="label-eyebrow mb-2.5 block">{children}</label>;
}

export function TextInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={`w-full border-b border-line bg-transparent py-3 text-base text-bone placeholder:text-mute/60 focus-visible:border-brass focus-visible:outline-none ${props.className ?? ""}`}
    />
  );
}

export function TextArea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className={`w-full resize-none border-b border-line bg-transparent py-3 text-base text-bone placeholder:text-mute/60 focus-visible:border-brass focus-visible:outline-none ${props.className ?? ""}`}
    />
  );
}

interface PillOptionProps {
  label: string;
  selected: boolean;
  onClick: () => void;
}

export function PillOption({ label, selected, onClick }: PillOptionProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      data-cursor="link"
      aria-pressed={selected}
      className={`rounded-full border-2 px-5 py-2.5 text-sm font-medium transition-all duration-300 ${
        selected
          ? "border-brass bg-brass text-ink shadow-[0_6px_18px_rgba(217,164,65,0.35)]"
          : "border-line bg-transparent text-mute hover:border-bone/30 hover:text-bone"
      }`}
    >
      {label}
    </button>
  );
}
