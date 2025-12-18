export const vars = [
  "CONVEX_SITE_URL",
  "SITE_URL",
  "BETTER_AUTH_SECRET",
] as const;

export const env = vars.reduce(
  (acc, name) => {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    acc[name] = process.env[name]!;
    return acc;
  },
  {} as Record<(typeof vars)[number], string>,
);

export const verifyEnv = () => {
  vars.forEach((name) => {
    const value = process.env[name];
    if (value === undefined) {
      throw new Error("Missing environment variable: " + name);
    }
  });
};
