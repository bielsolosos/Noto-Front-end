const getServerEnv = (key: string): string => {
  const value = process.env[key];
  if (!value) {
    throw new Error(
      `[Server ENV] Variável ${key} não encontrada. Verifique o arquivo .env`
    );
  }
  return value;
};

export const serverEnv = {
  AUTH_API_KEY: getServerEnv("AUTH_API_KEY"),
  API_URL: process.env.API_URL || process.env.NEXT_PUBLIC_API_URL,
} as const;

export type ServerEnv = typeof serverEnv;
