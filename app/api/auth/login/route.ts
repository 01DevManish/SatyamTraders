import { NextRequest, NextResponse } from "next/server";
import { comparePassword, signAdminToken } from "@/lib/auth";
import { neonHeaders, neonRequiredUrl } from "@/lib/neon";

type DbUser = {
  id: string;
  email: string;
  password_hash: string;
  role: string;
  is_active: boolean;
};

export async function POST(request: NextRequest) {
  try {
    const { email, password } = (await request.json()) as { email?: string; password?: string };

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const fallbackEmail = (process.env.ADMIN_EMAIL || "").trim().toLowerCase();
    const fallbackPassword = process.env.ADMIN_PASSWORD || "";

    if (fallbackEmail && fallbackPassword && normalizedEmail === fallbackEmail && password === fallbackPassword) {
      const token = signAdminToken({ id: "env-admin", email: fallbackEmail, role: "admin" });
      const response = NextResponse.json({ success: true });
      response.cookies.set("admin_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
      });
      return response;
    }

    const url = `${neonRequiredUrl()}/admin_users?select=id,email,password_hash,role,is_active&email=eq.${encodeURIComponent(normalizedEmail)}&limit=1`;
    const dbRes = await fetch(url, { headers: neonHeaders(), cache: "no-store" });
    const rows = (await dbRes.json()) as DbUser[];

    const user = rows[0];
    if (!user || !user.is_active || user.role !== "admin") {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const valid = await comparePassword(password, user.password_hash);
    if (!valid) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const token = signAdminToken({ id: user.id, email: user.email, role: "admin" });
    const response = NextResponse.json({ success: true });
    response.cookies.set("admin_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (error: unknown) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
