import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const poppins = Poppins({ subsets: ["latin"], variable: "--font-poppins", weight: ["400", "500", "600", "700"] });

export const metadata: Metadata = {
  title: "Jaihind Textiles",
  description: "Modern textile shopping platform",
};

import { SplashAnimation } from "./components/Splash";
import { Navbar } from "./components/Navbar";
import { LoginPrompt } from "./components/LoginPrompt";

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${inter.variable} ${poppins.variable}`}>
      <body className="antialiased selection:bg-[#FF6B00]/20 selection:text-[#FF6B00]">
        <SplashAnimation />
        <Navbar />
        {children}
        <LoginPrompt />
      </body>
    </html>
  );
}
