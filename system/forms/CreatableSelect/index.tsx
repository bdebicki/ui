"use client";
import { ChoiceField, normalizeChoice, type ChoiceProps } from "../ChoiceField";

type CreatableSelectProps = Omit<ChoiceProps, "options"> & { options: readonly string[] };

export function CreatableSelect({ options, ...props }: CreatableSelectProps) {
  const unique = new Map<string, string>();
  for (const option of options) {
    const label = normalizeChoice(option);
    if (label && !unique.has(label.toLocaleLowerCase("pl"))) unique.set(label.toLocaleLowerCase("pl"), label);
  }
  return <ChoiceField {...props} creatable options={[...unique.values()].map(label => ({ value: label, label }))} />;
}
