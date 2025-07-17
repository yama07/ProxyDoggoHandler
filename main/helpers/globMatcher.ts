import { Minimatch } from "minimatch";

export function buildMatcher(patterns: string) {
  const compiled = patterns
    .split(",")
    .map((pattern) => pattern.trim())
    .map((pattern) => new Minimatch(pattern, { nocase: true }));

  return (input: string) => compiled.some((m) => m.match(input));
}
