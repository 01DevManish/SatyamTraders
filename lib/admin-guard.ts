import { NextRequest } from "next/server";
import { verifyAdminToken } from "@/lib/auth";

export function isAdminRequest(request: NextRequest): boolean {
  const token = request.cookies.get("admin_token")?.value;
  if (!token) return false;
  return Boolean(verifyAdminToken(token));
}
