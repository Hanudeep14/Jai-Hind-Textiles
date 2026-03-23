/* eslint-disable @next/next/no-img-element */
import { connectDb } from "@/lib/db";
import { Product } from "@/models/Product";

export const dynamic = "force-dynamic";

type ProductView = {
  _id: string;
  name: string;
  productCode: string;
  productType: string;
  sectionId?: { _id: string; name: string } | string;
  sizes?: string[];
  discountedPrice: number;
  mrp: number;
  images?: string[];
};

export default async function ProductsPage({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  await connectDb();
  
  const params = await searchParams;
  const filter: any = { status: { $ne: "hidden" } };
  
  if (params.section) {
    filter.sectionId = params.section;
  }
  
  // Renamed 'products' to 'filtered' as per instruction, and added .populate('sectionId')
  const filtered = (await Product.find(filter).populate('sectionId').sort({ createdAt: -1 }).lean()) as unknown as ProductView[];
  return (
    <main className="mx-auto max-w-6xl p-4">
      <h1 className="mb-1 text-3xl font-semibold">{params.section ? "Filtered Products" : "All Products"}</h1>
      <p className="mb-5 text-sm text-[#1A1A2E]/70">Rich textile catalog with product ID, type, sizes, pricing, images and media-ready fields.</p>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {filtered.map((p) => {
          const secName = typeof p.sectionId === "object" ? (p.sectionId as any)?.name || "" : "";
          const tags = [secName, p.productType, "fashion", "clothing"].map(s => String(s || "").trim().split(" ")[0]).filter(Boolean).join(",");
          const keyword = encodeURIComponent(tags.toLowerCase());
          return (
          <a key={String(p._id)} href={`/products/${p._id}`} className="product-card rounded-2xl border border-[#1A1A2E]/10 bg-white p-2 shadow-sm">
            <img src={p.images?.[0] || `https://loremflickr.com/500/500/${keyword}`} className="h-36 w-full rounded-xl object-cover" alt={p.name} />
            <div className="mt-2 space-y-1">
              <p className="line-clamp-1 text-sm font-semibold">{p.name}</p>
              <p className="text-xs text-[#1A1A2E]/70">{p.productType}</p>
              <p className="text-[11px] text-[#1A1A2E]/70">ID: {p.productCode}</p>
              <p className="text-[11px] text-[#1A1A2E]/70">Sizes: {p.sizes?.slice(0, 3).join(", ")}</p>
              <p className="text-sm font-semibold text-[#FF6B00]">INR {Math.round(p.discountedPrice || p.mrp)}</p>
            </div>
          </a>
        )})}
      </div>
    </main>
  );
}
