import { env } from "@/lib/env";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const { email, password } = await request.json();

  const res = await fetch(`${env.NEXT_PUBLIC_API_URL}/auth`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password, apiKey: env.AUTH_API_KEY }),
  });

  if (!res.ok) {
    console.error("[Login Route] Auth failed:", res.status, res.statusText);
    return NextResponse.json({ error: "Login falhou" }, { status: 401 });
  }

  const data = await res.json();

  // Retorna para o front só o necessário (token, refreshToken)
  return NextResponse.json(data);
}
