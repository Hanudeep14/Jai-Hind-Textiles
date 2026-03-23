"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function LoginPrompt() {
  const [show, setShow] = useState(false);
  const pathname = usePathname();
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Hide on admin routes, auth routes, and checkout
    if (
      pathname.startsWith("/admin") || 
      pathname.startsWith("/login") || 
      pathname.startsWith("/signup") || 
      pathname.startsWith("/checkout")
    ) {
      if (timerRef.current) clearTimeout(timerRef.current);
      return;
    }

    // Attempt to prompt 3 seconds after page load
    setupNextPrompt(3000);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [pathname]);

  const checkAuthAndPrompt = async () => {
    try {
      const res = await fetch("/api/auth/me").catch(() => null);
      if (res && res.ok) {
        // User is authenticated, do not show prompt
        return;
      }
      setShow(true);
    } catch {
      setShow(true);
    }
  };

  const setupNextPrompt = (delayMs: number) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(async () => {
      await checkAuthAndPrompt();
    }, delayMs);
  };

  function handleSkip() {
    setShow(false);
    // User skipped, so prompt them again in exactly 5 minutes (300,000ms)
    setupNextPrompt(300000);
  }

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1A1A2E]/50 backdrop-blur-md px-4">
      <div className="w-full max-w-sm rounded-3xl bg-white p-8 shadow-2xl animate-in fade-in zoom-in duration-300">
        <h2 className="mb-2 text-2xl font-bold text-[#1A1A2E] text-center">Join Our Community!</h2>
        <p className="mb-6 text-sm text-[#1A1A2E]/70 text-center">
          Unlock exclusive offers, track your favorite styles, and checkout faster. Log in or create an account today.
        </p>
        <div className="flex flex-col gap-3">
          <Link href="/login" onClick={() => setShow(false)} className="w-full rounded-xl bg-[#FF6B00] px-4 py-3 text-center text-sm font-semibold text-white shadow-md shadow-[#FF6B00]/20 transition-transform hover:scale-105">
            Log In Securely
          </Link>
          <Link href="/signup" onClick={() => setShow(false)} className="w-full rounded-xl border border-[#1A1A2E]/10 bg-[#fff8f0]/40 px-4 py-3 text-center text-sm font-semibold text-[#1A1A2E] transition-transform hover:scale-105">
            Create an Account
          </Link>
        </div>
        <button onClick={handleSkip} className="mt-6 w-full text-center text-xs font-medium text-[#1A1A2E]/50 transition-colors hover:text-[#1A1A2E] hover:underline">
          Maybe Later
        </button>
      </div>
    </div>
  );
}
