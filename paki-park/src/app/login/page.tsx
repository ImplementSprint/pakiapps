"use client"

import React, { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    try {
      // Placeholder: replace with real API call
      await new Promise((res) => setTimeout(res, 600));
      if (!email || !password) {
        setMessage("Please provide email and password.");
      } else {
        setMessage("Login simulated (replace with API call).");
      }
    } catch (err) {
      setMessage("An error occurred.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={{maxWidth: 480, margin: "48px auto", padding: 16}}>
      <h1>Login</h1>
      <form onSubmit={handleSubmit} style={{display: "grid", gap: 12}}>
        <label>
          Email
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{width: "100%", padding: 8, marginTop: 6}}
          />
        </label>

        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{width: "100%", padding: 8, marginTop: 6}}
          />
        </label>

        <button type="submit" disabled={loading} style={{padding: "10px 14px"}}>
          {loading ? "Signing in..." : "Sign In"}
        </button>
      </form>

      {message && (
        <p style={{marginTop: 16}}>{message}</p>
      )}
    </main>
  );
}
