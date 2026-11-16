"use client";
import { ChoiceField, type ChoiceProps } from "../ChoiceField";
export type { SelectOption } from "../ChoiceField";
export type SelectProps = Omit<ChoiceProps, "onCommit">;
export function Select(props: SelectProps) { return <ChoiceField {...props} />; }
