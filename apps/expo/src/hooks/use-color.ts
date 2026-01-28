import { useCSSVariable } from "uniwind";

export function useColor(color: string) {
  const cssVariable = useCSSVariable(`--${color}`);
  if (cssVariable === undefined) {
    throw new Error(`Color variable ${color} not found`);
  }
  return cssVariable as string;
}
