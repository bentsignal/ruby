const envVars = {
  CONVEX_URL: process.env.EXPO_PUBLIC_CONVEX_URL,
  CONVEX_SITE_URL: process.env.EXPO_PUBLIC_CONVEX_SITE_URL,
} as const;

export function env(variable: keyof typeof envVars): string {
  const value = envVars[variable];
  if (value === undefined || value.length === 0) {
    throw new Error("Missing environment variable: " + variable);
  }
  return value;
}
