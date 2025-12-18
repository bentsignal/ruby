const vars = [
  "EXPO_PUBLIC_SITE_URL",
  "EXPO_PUBLIC_CONVEX_URL",
  "EXPO_PUBLIC_CONVEX_SITE_URL",
] as const;

const env = vars.reduce(
  (acc, name) => {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    acc[name] = process.env[name]!;
    return acc;
  },
  {} as Record<(typeof vars)[number], string>,
);

const verifyEnv = () => {
  vars.forEach((name) => {
    const value = process.env[name];
    if (value === undefined) {
      throw new Error("Missing environment variable: " + name);
    }
  });
};

export { env, verifyEnv };
