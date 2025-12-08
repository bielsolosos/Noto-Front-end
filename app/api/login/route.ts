import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const { email, password } = await request.json();

  // No servidor Next.js, usar o nome do container na rede Docker
  const apiUrl = "http://backend:8080";
  const apiKey = process.env.AUTH_API_KEY || process.env.API_KEY || "batatinha123";

  console.log("[Login Route] API URL:", apiUrl);
  console.log("[Login Route] API Key:", apiKey ? "✓" : "✗");

  const res = await fetch(`${apiUrl}/auth`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password, apiKey }),
  });

  if (!res.ok) {
    console.error("[Login Route] Auth failed:", res.status, res.statusText);
    return NextResponse.json({ error: "Login falhou" }, { status: 401 });
  }

  const data = await res.json();

  // Retorna para o front só o necessário (token, refreshToken)
  return NextResponse.json(data);
}
