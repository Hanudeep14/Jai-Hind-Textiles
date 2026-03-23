import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
const secret = new TextEncoder().encode(process.env.JWT_SECRET || "dev-secret");
export async function createToken(payload: { sub: string; role: "user" | "admin"; email: string }) { return new SignJWT(payload).setProtectedHeader({ alg: "HS256" }).setIssuedAt().setExpirationTime("7d").sign(secret); }
export async function currentAdmin() { const c = await cookies(); const token = c.get("jh_admin_token")?.value; if (!token) return null; try { const { payload } = await jwtVerify(token, secret); return payload.role === "admin" ? payload : null; } catch { return null; } }
