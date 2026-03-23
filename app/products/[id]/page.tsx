/* eslint-disable @next/next/no-img-element */
import { notFound } from "next/navigation";
import { connectDb } from "@/lib/db";
import { Product } from "@/models/Product";
import { Review } from "@/models/Review";

export const dynamic = "force-dynamic";

type ProductView = {
  _id: string;
  productCode: string;
  sectionId?: { _id: string; name: string } | string;
  productType: string;
  name: string;
  description?: string;
  mrp: number;
  discountedPrice?: number;
  material?: string;
  pattern?: string;
  fit?: string;
  sizes?: string[];
  specifications?: { label: string; value: string }[];
  images?: string[];
  videos?: string[];
};
type ReviewView = { _id: string; userName: string; rating: number; comment: string };

export default async function ProductDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await connectDb();
  const product = (await Product.findById(id).lean()) as unknown as ProductView | null;
  if (!product) return notFound();
  const reviews = (await Review.find({ productId: id, approved: true }).sort({ createdAt: -1 }).lean()) as unknown as ReviewView[];

  return (
    <main className="mx-auto grid max-w-6xl gap-6 p-4 md:grid-cols-2">
      <div className="space-y-3">
        <img src={product.images?.[0] || `https://loremflickr.com/600/600/${encodeURIComponent([typeof product.sectionId === "object" ? product.sectionId?.name : "", product.productType, "fashion", "clothing"].map(s => String(s || "").trim().split(" ")[0]).filter(Boolean).join(",").toLowerCase())}`} alt={product.name} className="rounded-2xl" />
        {product.videos?.[0] ? (
          <video src={product.videos[0]} controls className="w-full rounded-2xl bg-black/80" />
        ) : null}
      </div>
      <div>
        <h1 className="text-2xl font-semibold">{product.name}</h1>
        <p className="mt-1 text-xs text-[#1A1A2E]/70">Product ID: {product.productCode}</p>
        <p className="mt-1 text-sm text-[#1A1A2E]/75">Type: {product.productType}</p>
        <p className="mt-2 text-sm text-gray-700">{product.description}</p>
        <p className="mt-3 text-xl font-semibold text-[#FF6B00]">INR {product.discountedPrice || product.mrp}</p>
        <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-[#1A1A2E]/80">
          <div className="rounded-lg bg-white p-2">Sizes: {product.sizes?.join(", ") || "Free Size"}</div>
          <div className="rounded-lg bg-white p-2">Material: {product.material || "Textile Blend"}</div>
          <div className="rounded-lg bg-white p-2">Pattern: {product.pattern || "Printed"}</div>
          <div className="rounded-lg bg-white p-2">Fit: {product.fit || "Regular"}</div>
        </div>
        <form action="/api/orders" method="post" className="mt-4 rounded-xl bg-white p-3">
          <input type="hidden" name="productId" value={String(product._id)} />
          <input className="w-full border p-2" type="number" min={1} name="quantity" defaultValue={1} />
          <button className="mt-2 w-full rounded bg-[#FF6B00] p-2 text-white">Buy Now</button>
        </form>
        <div className="mt-5 rounded-xl bg-white p-3">
          <h3 className="text-sm font-semibold">Specifications</h3>
          <div className="mt-2 space-y-1 text-xs">
            {product.specifications?.map((spec, index) => (
              <p key={`${spec.label}-${index}`}>
                <span className="font-medium">{spec.label}:</span> {spec.value}
              </p>
            ))}
          </div>
        </div>
        <div className="mt-6 space-y-2">
          <h2 className="font-semibold">Reviews</h2>
          {reviews.map((r) => (
            <div key={String(r._id)} className="rounded-xl bg-white p-3 text-sm">
              <p className="font-medium">{r.userName} ({r.rating}/5)</p>
              <p>{r.comment}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
