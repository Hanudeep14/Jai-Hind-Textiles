import { NextResponse } from "next/server";
import { connectDb } from "@/lib/db";
import { Product } from "@/models/Product";
import { currentAdmin } from "@/lib/auth";

export async function GET() {
  await connectDb();
  const list = await Product.find().populate("sectionId", "name").sort({ createdAt: -1 }).lean();
  return NextResponse.json(list);
}

export async function POST(request: Request) {
  const admin = await currentAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await connectDb();
  const body = await request.json();

  const required = ["name", "productType", "productCode", "sectionId", "mrp", "stock"];
  for (const field of required) {
    if (!body[field]) return NextResponse.json({ error: `Missing field: ${field}` }, { status: 400 });
  }

  const mrp = Number(body.mrp);
  const discount = Number(body.discount || 0);
  const discountedPrice = Number((mrp - (mrp * discount) / 100).toFixed(2));

  const product = await Product.create({
    productCode: body.productCode,
    name: body.name,
    productType: body.productType,
    description: body.description || "",
    sectionId: body.sectionId,
    mrp,
    discount,
    discountedPrice,
    stock: Number(body.stock),
    sizes: Array.isArray(body.sizes) ? body.sizes : [],
    colors: Array.isArray(body.colors) ? body.colors : [],
    material: body.material || "",
    fabricCare: body.fabricCare || "",
    pattern: body.pattern || "",
    fit: body.fit || "",
    images: Array.isArray(body.images) && body.images.length ? body.images : [`https://loremflickr.com/900/900/${encodeURIComponent([body.productType, "fashion", "clothing"].map(s => String(s || "").trim().split(" ")[0]).filter(Boolean).join(",").toLowerCase())}`],
    videos: Array.isArray(body.videos) ? body.videos : [],
    tags: Array.isArray(body.tags) ? body.tags : [],
    specifications: Array.isArray(body.specifications) ? body.specifications : [],
    weight: Number(body.weight || 0),
    status: body.status || "active",
  });

  return NextResponse.json(product, { status: 201 });
}
