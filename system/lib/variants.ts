import { cn, type ClassValue } from "./cn";

type VariantGroups = Record<string, Record<string, string>>;

type VariantSelection<G extends VariantGroups> = {
  [K in keyof G]?: keyof G[K];
};

type VariantConfig<G extends VariantGroups> = {
  base?: string;
  variants: G;
  defaults: { [K in keyof G]: keyof G[K] };
};

/**
 * Turns a base class plus one class map per variant group into a class-name
 * builder, so a component describes how it looks as data instead of repeating
 * the same lookup-and-fallback wiring. Unset groups fall back to `defaults`,
 * and `className` is always appended last so callers can still override.
 */
export function variants<G extends VariantGroups>(config: VariantConfig<G>) {
  const groups = Object.keys(config.variants) as (keyof G)[];

  return (
    selection: VariantSelection<G> & { className?: ClassValue } = {},
  ): string =>
    cn(
      config.base,
      ...groups.map((group) => {
        const key = selection[group] ?? config.defaults[group];
        return config.variants[group][key as string];
      }),
      selection.className,
    );
}
