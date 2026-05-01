"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import "./login.css";

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
    <main className="loginRoot">
      <form onSubmit={onSubmit} className="loginCard">
        <h1 className="loginTitle">Satyam Trders</h1>
        <p className="loginSub">Admin Login</p>
        <input className="input" type="email" placeholder="Admin email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input className="input" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        {error ? <p className="err">{error}</p> : null}
        <button className="btn" type="submit" disabled={loading}>{loading ? "Signing in..." : "Login"}</button>
      </form>
    </main>
  );
}
