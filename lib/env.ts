/**
 * Variáveis de ambiente do projeto
 * Centraliza todas as env vars para facilitar o acesso e type-safety
 */

import { environment } from '@/environments/environment';

// Validação simples para garantir que variáveis críticas existem
const getEnvVar = (key: string, defaultValue?: string): string => {
  const value = process.env[key] || defaultValue;
  if (!value) {
    throw new Error(`Variável de ambiente ${key} não está definida`);
  }
  return value;
};

export const env = {
  // Exposto ao browser; usar NEXT_PUBLIC_ para estar disponível no cliente
  NEXT_PUBLIC_API_URL: environment.apiUrl,

  // Next.js Environment
  NODE_ENV: process.env.NODE_ENV || "development",

  // Flags úteis
  isDevelopment: process.env.NODE_ENV === "development",
  isProduction: process.env.NODE_ENV === "production",
  isTest: process.env.NODE_ENV === "test",
} as const;

// Type para autocomplete
export type Env = typeof env;
