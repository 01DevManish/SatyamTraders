import { NextRequest, NextResponse } from "next/server";
import { hashPassword } from "@/lib/auth";
import { neonHeaders, neonRequiredUrl } from "@/lib/neon";

export async function POST(request: NextRequest) {
  try {
    const setupKey = request.headers.get("x-setup-key");
    const expectedKey = process.env.ADMIN_SETUP_KEY;

    if (!expectedKey || setupKey !== expectedKey) {
      return NextResponse.json({ error: "Unauthorized setup request" }, { status: 401 });
    }

    const { email, password } = (await request.json()) as { email?: string; password?: string };
    if (!email || !password || password.length < 6) {
      return NextResponse.json({ error: "Valid email and password (min 6 chars) required" }, { status: 400 });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const passwordHash = await hashPassword(password);

    const response = await fetch(`${neonRequiredUrl()}/admin_users`, {
      method: "POST",
      headers: neonHeaders(true),
      body: JSON.stringify({
        email: normalizedEmail,
        password_hash: passwordHash,
        role: "admin",
        is_active: true,
      }),
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error: unknown) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
