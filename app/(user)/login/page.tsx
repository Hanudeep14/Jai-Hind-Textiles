"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");

  async function onSubmit(formData: FormData) {
    const res = await fetch("/api/auth/login", { method: "POST", body: formData });
    if (!res.ok) {
      setError("Invalid credentials");
      return;
    }
    router.push("/");
  }

  return (
    <form action={onSubmit} className="mx-auto max-w-sm rounded-xl bg-white p-6">
      <h1 className="text-xl font-semibold">User Login</h1>
      <input className="mt-3 w-full border p-2" name="identifier" placeholder="Email or phone" />
      <input className="mt-2 w-full border p-2" type="password" name="password" placeholder="Password" />
      {error ? <p className="mt-2 text-sm text-red-600">{error}</p> : null}
      <button className="mt-3 w-full rounded bg-[#FF6B00] p-2 text-white">Login</button>
    </form>
  );
}
