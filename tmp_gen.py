from pathlib import Path
root=Path(r"D:/Jai Hind Textiles")
files={
"app/layout.tsx":'''import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const poppins = Poppins({ subsets: ["latin"], variable: "--font-poppins", weight: ["400", "500", "600", "700"] });

export const metadata: Metadata = {
  title: "Jaihind Textiles",
  description: "Modern textile shopping platform",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${inter.variable} ${poppins.variable}`}>
      <body>{children}</body>
    </html>
  );
}
''',
"app/globals.css":'''@import "tailwindcss";
:root { --saffron: #ff6b00; --cream: #fff8f0; --charcoal: #1a1a2e; }
body { font-family: var(--font-inter), sans-serif; background: var(--cream); color: var(--charcoal); }
h1,h2,h3,h4,h5,h6 { font-family: var(--font-poppins), sans-serif; }
.hero-pattern { background-image: radial-gradient(circle at 15% 20%, rgba(255, 107, 0, 0.15), transparent 40%), radial-gradient(circle at 85% 30%, rgba(26, 26, 46, 0.08), transparent 35%), repeating-linear-gradient(45deg, rgba(255, 107, 0, 0.05), rgba(255, 107, 0, 0.05) 2px, transparent 2px, transparent 8px); }
.product-card { transition: transform 180ms ease, box-shadow 180ms ease; }
.product-card:hover { transform: scale(1.02); box-shadow: 0 10px 30px rgba(26, 26, 46, 0.15); }
''',
"lib/db.ts":'''import mongoose from "mongoose";
const MONGODB_URI = process.env.MONGODB_URI || "";
if (!MONGODB_URI) throw new Error("Missing MONGODB_URI");
let cached = (global as typeof globalThis & { mongoose?: { conn: typeof mongoose | null; promise: Promise<typeof mongoose> | null } }).mongoose;
if (!cached) cached = global.mongoose = { conn: null, promise: null };
export async function connectDb() { if (cached.conn) return cached.conn; if (!cached.promise) cached.promise = mongoose.connect(MONGODB_URI, { dbName: "jaihind-textiles" }); cached.conn = await cached.promise; return cached.conn; }
''',
"models/User.ts":'''import { Schema, model, models } from "mongoose";
const userSchema = new Schema({ name: { type: String, required: true }, email: { type: String, required: true, unique: true }, phone: { type: String, required: true, unique: true }, passwordHash: { type: String, required: true },}, { timestamps: true });
export const User = models.User || model("User", userSchema);
''',
"app/page.tsx":'''export default function Home(){return <main className="p-8">Jaihind Textiles scaffold initialized. Continue implementation.</main>}
'''
}
for rel,content in files.items():
  p=root/rel
  p.parent.mkdir(parents=True,exist_ok=True)
  p.write_text(content,encoding="utf-8")
