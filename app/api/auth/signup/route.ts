import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDb } from "@/lib/db";
import { User } from "@/models/User";
import { createToken } from "@/lib/auth";

export async function POST(request: Request) {
  await connectDb();
  const form = await request.formData();
  const name = String(form.get("name") || "");
  const email = String(form.get("email") || "").toLowerCase();
  const phone = String(form.get("phone") || "");
  const password = String(form.get("password") || "");
  const confirmPassword = String(form.get("confirmPassword") || "");

  if (!name || !email || !phone || !password || password !== confirmPassword) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  const exists = await User.findOne({ $or: [{ email }, { phone }] });
  if (exists) return NextResponse.json({ error: "User already exists" }, { status: 409 });

  const user = await User.create({ name, email, phone, passwordHash: await bcrypt.hash(password, 10) });
  const token = await createToken({ sub: user._id.toString(), role: "user", email });

  const res = NextResponse.json({ ok: true });
  res.cookies.set("jh_user_token", token, { httpOnly: true, path: "/", sameSite: "lax", secure: process.env.NODE_ENV === "production" });
  return res;
}
