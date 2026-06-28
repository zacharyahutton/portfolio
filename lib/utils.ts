export function cn(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

export const typeBadgeColors: Record<string, string> = {
  personal: "border-[var(--color-slate)] text-[var(--color-pearl)]",
  coursework: "border-[var(--color-slate)] text-[var(--color-pearl)]",
  professional: "border-[var(--color-pearl)] text-[var(--color-paper)]",
  security: "border-[var(--terminal-green)]/40 text-[var(--terminal-green)]",
};

export const typeLabels: Record<string, string> = {
  personal: "Personal",
  coursework: "Coursework",
  professional: "Contract",
  security: "Security",
};

export const bentoSpans: Record<string, string> = {
  large: "md:col-span-2 md:row-span-2",
  wide: "md:col-span-2",
  tall: "md:row-span-2",
  default: "",
};
