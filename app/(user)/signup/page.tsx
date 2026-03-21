"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SignupPage() {
  const router = useRouter();
  const [error, setError] = useState("");

  async function onSubmit(formData: FormData) {
    const res = await fetch("/api/auth/signup", { method: "POST", body: formData });
    if (!res.ok) {
      setError("Signup failed");
      return;
    }
    router.push("/");
  }

  return (
    <form action={onSubmit} className="mx-auto max-w-sm rounded-xl bg-white p-6">
      <h1 className="text-xl font-semibold">Create account</h1>
      <input className="mt-3 w-full border p-2" name="name" placeholder="Name" />
      <input className="mt-2 w-full border p-2" type="email" name="email" placeholder="Email" />
      <input className="mt-2 w-full border p-2" name="phone" placeholder="Phone" />
      <input className="mt-2 w-full border p-2" type="password" name="password" placeholder="Password" />
      <input className="mt-2 w-full border p-2" type="password" name="confirmPassword" placeholder="Confirm password" />
      {error ? <p className="mt-2 text-sm text-red-600">{error}</p> : null}
      <button className="mt-3 w-full rounded bg-[#FF6B00] p-2 text-white">Sign up</button>
    </form>
  );
}
