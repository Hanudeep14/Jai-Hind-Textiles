import { NextResponse } from "next/server";
import { connectDb } from "@/lib/db";
import { Product } from "@/models/Product";
import { currentAdmin } from "@/lib/auth";

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const admin = await currentAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await connectDb();
  const { id } = await params;
  const body = await request.json();

  const mrp = Number(body.mrp);
  const discount = Number(body.discount || 0);
  const discountedPrice = Number((mrp - (mrp * discount) / 100).toFixed(2));

  const updateData = {
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
    images: Array.isArray(body.images) && body.images.length > 0 ? body.images : [],
    videos: Array.isArray(body.videos) ? body.videos : [],
    tags: Array.isArray(body.tags) ? body.tags : [],
    specifications: Array.isArray(body.specifications) ? body.specifications : [],
    weight: Number(body.weight || 0),
    status: body.status || "active",
  };

  // If no images are provided, don't overwrite with an empty array if we don't want to. But in our form, we supply all images.
  if (updateData.images.length === 0) {
    delete updateData.images;
  }

  const updatedProduct = await Product.findByIdAndUpdate(id, updateData, { new: true });
  if (!updatedProduct) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  return NextResponse.json(updatedProduct);
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const admin = await currentAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await connectDb();
  const { id } = await params;

  const deletedProduct = await Product.findByIdAndDelete(id);
  if (!deletedProduct) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  return NextResponse.json({ message: "Product deleted successfully" });
}
