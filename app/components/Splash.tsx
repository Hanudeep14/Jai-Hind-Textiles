"use client";

import { useEffect, useState } from "react";

export function SplashAnimation() {
  const [show, setShow] = useState(true);

  useEffect(() => {
    // Hide the splash after the blast animation completes (e.g. 1.8 seconds)
    const timer = setTimeout(() => {
      setShow(false);
    }, 1800);
    return () => clearTimeout(timer);
  }, []);

  if (!show) return null;

  return (
    <div className="splash-overlay fixed inset-0 z-50 flex items-center justify-center bg-white">
      <div className="blast-ring absolute rounded-full bg-[#FF6B00]"></div>
      <div className="blast-ring-2 absolute rounded-full bg-[#e65c00]"></div>
      <div className="relative z-10 scale-0 animate-[splash-logo_1.5s_cubic-bezier(0.19,1,0.22,1)_forwards]">
        <h1 className="text-4xl font-bold tracking-tight text-white md:text-6xl drop-shadow-md">
          Jaihind Textiles
        </h1>
      </div>
    </div>
  );
}
