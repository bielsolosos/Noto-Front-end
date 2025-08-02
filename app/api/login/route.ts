import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const { email, password } = await request.json();

  // A API Key está só aqui, no servidor!
  const apiUrl = process.env.AUTH_API_URL || "http://localhost:8080";
  const apiKey = process.env.AUTH_API_KEY || "batatinha123";

  const res = await fetch(`${apiUrl}/auth`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password, apiKey }),
  });

  console.log(apiKey);
  if (!res.ok) {
    return NextResponse.json({ error: "Login falhou" }, { status: 401 });
  }

  const data = await res.json();

  // Retorna para o front só o necessário (token, refreshToken)
  return NextResponse.json(data);
}
