/**
 * Get an environment variable or throw an error if it is not set.
 * @param key - The environment variable key.
 * @returns The environment variable value.
 */
const getOrThrow = (key: string) => {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Environment variable ${key} is not set.`);
  }
  return value;
};

export const configService = { getOrThrow };
