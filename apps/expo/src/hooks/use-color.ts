import { useCSSVariable } from "uniwind";

export function useVar(color: string) {
  return useCSSVariable(`--${color}`) as string;
}
