export const clientEnv = {
  API_URL: process.env.NEXT_PUBLIC_API_URL,
  NODE_ENV: process.env.NODE_ENV || "development",
  isDevelopment: process.env.NODE_ENV === "development",
  isProduction: process.env.NODE_ENV === "production",
  isTest: process.env.NODE_ENV === "test",
} as const;

export type ClientEnv = typeof clientEnv;

// Validação em runtime (apenas em desenvolvimento)
if (typeof window !== "undefined" && clientEnv.isDevelopment) {
  if (!clientEnv.API_URL) {
    console.error(
      "❌ [Client ENV] NEXT_PUBLIC_API_URL não está definida!\n" +
        "   1. Adicione NEXT_PUBLIC_API_URL no arquivo .env\n" +
        "   2. Reinicie o servidor Next.js (yarn dev)\n"
    );
  } else {
    console.log("✅ [Client ENV] API_URL:", clientEnv.API_URL);
  }
}
