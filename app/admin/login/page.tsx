"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = (await res.json()) as { error?: string };
      if (!res.ok) throw new Error(data.error || "Login failed");

      router.push("/admin");
      router.refresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: 24 }}>
      <form onSubmit={onSubmit} style={{ width: "100%", maxWidth: 420, display: "grid", gap: 12, border: "1px solid #ddd", borderRadius: 10, padding: 20 }}>
        <h1 style={{ margin: 0 }}>Satyam Trders Admin Login</h1>
        <input type="email" placeholder="Admin email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        {error ? <p style={{ color: "#b91c1c", margin: 0 }}>{error}</p> : null}
        <button type="submit" disabled={loading}>{loading ? "Signing in..." : "Login"}</button>
      </form>
    </main>
  );
}
