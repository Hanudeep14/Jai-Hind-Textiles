import { NextResponse } from "next/server";
import { connectDb } from "@/lib/db";
import { Product } from "@/models/Product";
import { Order } from "@/models/Order";

export async function POST(request: Request) {
  await connectDb();
  const form = await request.formData();
  const productId = String(form.get("productId") || "");
  const quantity = Number(form.get("quantity") || 1);
  const product = await Product.findById(productId);
  if (!product) return NextResponse.json({ error: "Product not found" }, { status: 404 });

  const order = await Order.create({
    items: [{
      productId: product._id,
      productName: product.name,
      image: product.images?.[0],
      quantity,
      size: "Free Size",
      color: product.colors?.[0]?.name || "Default",
      price: product.discountedPrice || product.mrp,
    }],
    customer: { name: "Guest User", email: "guest@example.com", phone: "9999999999" },
    deliveryType: "home",
    paymentStatus: "cod",
    orderStatus: "pending",
    unreadByAdmin: true,
  });

  return NextResponse.redirect(new URL(`/orders?placed=${order._id}`, request.url));
}
