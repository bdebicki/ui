import { Input, type InputProps } from "../Input";

type NumberInputProps = Omit<
  InputProps,
  "type" | "value" | "onChange" | "min"
> & {
  value: number | undefined;
  onValueChange: (value: number) => void;
  min?: number;
  /** Reported when the field is cleared. Defaults to `min`. */
  emptyValue?: number;
};

/** Clamped numeric input that never reports NaN. */
export function NumberInput({
  value,
  onValueChange,
  min = 0,
  emptyValue = min,
  align = "right",
  ...props
}: NumberInputProps) {
  return (
    <Input
      type="number"
      min={min}
      align={align}
      value={value ?? ""}
      onChange={(event) =>
        onValueChange(
          event.target.value === ""
            ? emptyValue
            : Math.max(min, Number(event.target.value)),
        )
      }
      {...props}
    />
  );
}
