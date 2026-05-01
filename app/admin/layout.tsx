import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifyAdminToken } from "@/lib/auth";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_token")?.value;

  if (!token || !verifyAdminToken(token)) {
    redirect("/login");
  }

  return <>{children}</>;
}
