"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";

export default function SignupPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(formData: FormData) {
    if (formData.get("password") !== formData.get("confirmPassword")) {
      setError("Passwords do not match");
      return;
    }
    setLoading(true);
    const res = await fetch("/api/auth/signup", { method: "POST", body: formData });
    setLoading(false);
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error || "Signup failed");
      return;
    }
    router.push("/");
  }

  return (
    <div className="flex min-h-[80vh] items-center justify-center p-4">
      <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-xl border border-[#1A1A2E]/5">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-[#1A1A2E]">Create Account</h1>
          <p className="mt-2 text-sm text-[#1A1A2E]/70">Join Jaihind Textiles to unlock exclusive offers.</p>
        </div>
        <form action={onSubmit} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-[#1A1A2E]">Name</label>
            <input className="w-full rounded-xl border border-[#1A1A2E]/10 bg-[#fff8f0]/40 p-3 text-sm outline-none transition-colors focus:border-[#FF6B00] focus:ring-1 focus:ring-[#FF6B00]" name="name" required placeholder="Full Name" />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-[#1A1A2E]">Email</label>
            <input className="w-full rounded-xl border border-[#1A1A2E]/10 bg-[#fff8f0]/40 p-3 text-sm outline-none transition-colors focus:border-[#FF6B00] focus:ring-1 focus:ring-[#FF6B00]" type="email" name="email" required placeholder="you@example.com" />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-[#1A1A2E]">Phone</label>
            <input className="w-full rounded-xl border border-[#1A1A2E]/10 bg-[#fff8f0]/40 p-3 text-sm outline-none transition-colors focus:border-[#FF6B00] focus:ring-1 focus:ring-[#FF6B00]" name="phone" required placeholder="10-digit number" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-[#1A1A2E]">Password</label>
              <input className="w-full rounded-xl border border-[#1A1A2E]/10 bg-[#fff8f0]/40 p-3 text-sm outline-none transition-colors focus:border-[#FF6B00] focus:ring-1 focus:ring-[#FF6B00]" type="password" name="password" required placeholder="••••••••" />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-[#1A1A2E]">Confirm</label>
              <input className="w-full rounded-xl border border-[#1A1A2E]/10 bg-[#fff8f0]/40 p-3 text-sm outline-none transition-colors focus:border-[#FF6B00] focus:ring-1 focus:ring-[#FF6B00]" type="password" name="confirmPassword" required placeholder="••••••••" />
            </div>
          </div>
          
          {error && <p className="text-sm rounded bg-red-50 p-2 text-red-600 border border-red-100">{error}</p>}
          <button disabled={loading} className="mt-4 w-full rounded-xl bg-[#FF6B00] p-3 text-sm font-semibold text-white shadow-md shadow-[#FF6B00]/20 transition-all hover:bg-[#e65c00] active:scale-[0.98] disabled:opacity-70">
            {loading ? "Signing up..." : "Create your account"}
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-[#1A1A2E]/60">
          Already a member? <Link href="/login" className="font-semibold text-[#FF6B00] hover:underline">Log In Here</Link>
        </p>
      </div>
    </div>
  );
}
