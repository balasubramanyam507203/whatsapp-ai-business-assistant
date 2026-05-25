"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function signIn() {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      alert(error.message);
    } else {
      alert("Login successful");
      window.location.href = "/";
    }
  }

  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="bg-zinc-900 p-8 rounded-2xl w-full max-w-md border border-zinc-800">
        <h1 className="text-3xl font-bold mb-2">
          WhatsApp AI Assistant
        </h1>

        <p className="text-zinc-400 mb-6">
          Login to access your SaaS dashboard
        </p>

        <input
          type="email"
          placeholder="Enter email"
          className="w-full p-3 rounded bg-zinc-800 mb-4 outline-none"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Enter password"
          className="w-full p-3 rounded bg-zinc-800 mb-4 outline-none"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={signIn}
          className="w-full bg-green-600 hover:bg-green-700 p-3 rounded font-semibold"
        >
          Login
        </button>
      </div>
    </main>
  );
}