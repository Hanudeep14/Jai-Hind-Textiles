"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(formData: FormData) {
    setLoading(true);
    const res = await fetch("/api/auth/login", { method: "POST", body: formData });
    setLoading(false);
    if (!res.ok) {
      setError("Invalid credentials. Please try again.");
      return;
    }
    router.push("/");
  }

  return (
    <div className="flex min-h-[80vh] items-center justify-center p-4">
      <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-xl border border-[#1A1A2E]/5">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-[#1A1A2E]">Welcome Back</h1>
          <p className="mt-2 text-sm text-[#1A1A2E]/70">Log in to track orders and checkout securely.</p>
        </div>
        <form action={onSubmit} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-[#1A1A2E]">Email or Phone</label>
            <input className="w-full rounded-xl border border-[#1A1A2E]/10 bg-[#fff8f0]/40 p-3 text-sm outline-none transition-colors focus:border-[#FF6B00] focus:ring-1 focus:ring-[#FF6B00]" name="identifier" required placeholder="Enter your email or phone" />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-[#1A1A2E]">Password</label>
            <input className="w-full rounded-xl border border-[#1A1A2E]/10 bg-[#fff8f0]/40 p-3 text-sm outline-none transition-colors focus:border-[#FF6B00] focus:ring-1 focus:ring-[#FF6B00]" type="password" name="password" required placeholder="Enter your password" />
          </div>
          {error && <p className="text-sm rounded bg-red-50 p-2 text-red-600 border border-red-100">{error}</p>}
          <button disabled={loading} className="mt-2 w-full rounded-xl bg-[#FF6B00] p-3 text-sm font-semibold text-white shadow-md shadow-[#FF6B00]/20 transition-all hover:bg-[#e65c00] active:scale-[0.98] disabled:opacity-70">
            {loading ? "Logging in..." : "Log In securely"}
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-[#1A1A2E]/60">
          Not registered yet? <Link href="/signup" className="font-semibold text-[#FF6B00] hover:underline">Create an Account</Link>
        </p>
      </div>
    </div>
  );
}
