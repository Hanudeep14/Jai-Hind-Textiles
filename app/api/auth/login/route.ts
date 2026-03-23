import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDb } from "@/lib/db";
import { User } from "@/models/User";
import { createToken } from "@/lib/auth";

export async function POST(request: Request) {
  await connectDb();
  const form = await request.formData();
  const identifier = String(form.get("identifier") || "");
  const password = String(form.get("password") || "");
  const user = await User.findOne({ $or: [{ email: identifier.toLowerCase() }, { phone: identifier }] });
  if (!user) return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  if (!(await bcrypt.compare(password, user.passwordHash))) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const token = await createToken({ sub: user._id.toString(), role: "user", email: user.email });
  const res = NextResponse.json({ ok: true });
  res.cookies.set("jh_user_token", token, { httpOnly: true, path: "/", sameSite: "lax", secure: process.env.NODE_ENV === "production" });
  return res;
}
