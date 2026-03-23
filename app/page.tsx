/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { connectDb } from "@/lib/db";
import { Product } from "@/models/Product";
import { Section } from "@/models/Section";

export const dynamic = "force-dynamic";

type SectionView = { _id: string; name: string };
type ProductView = {
  _id: string;
  sectionId: string;
  name: string;
  productCode: string;
  productType: string;
  discountedPrice: number;
  mrp: number;
  sizes?: string[];
  images?: string[];
};

export default async function Home() {
  await connectDb();
  const sections = (await Section.find({ visible: true }).sort({ order: 1 }).lean()) as unknown as SectionView[];
  const products = (await Product.find({ status: "active" }).sort({ createdAt: -1 }).lean()) as unknown as ProductView[];

  return (
    <main className="mx-auto max-w-7xl space-y-10 px-4 py-6 md:px-6">
      <section className="hero-pattern overflow-hidden rounded-3xl border border-[#ff6b00]/10 bg-gradient-to-br from-[#fff7ef] via-white to-[#fff1e5] p-8 shadow-sm md:p-10">
        <div className="max-w-3xl">
          <p className="text-sm font-medium uppercase tracking-widest text-[#FF6B00]">Jaihind Textile Marketplace</p>
          <h1 className="mt-2 text-4xl font-semibold leading-tight md:text-5xl">Style-rich collections for every section</h1>
          <p className="mt-3 text-[#1A1A2E]/80">Explore curated sarees, dress materials, kurtis, blouses, and kids wear with section-wise catalogs and rich product details.</p>
        </div>
      </section>
      <section>
        <h2 className="mb-3 text-2xl font-semibold">Categories</h2>
        <div className="flex gap-3 overflow-x-auto pb-2">
          {sections.map((s) => (
            <Link href={`/products?section=${s._id}`} key={String(s._id)} className="rounded-full border border-[#ff6b00]/20 bg-white px-5 py-2 text-sm font-medium shadow-sm hover:bg-[#fff7ef] transition-colors">
              {s.name}
            </Link>
          ))}
        </div>
      </section>
      {sections.map((section) => {
        const sectionProducts = products.filter((p) => String(p.sectionId) === String(section._id)).slice(0, 6);
        return (
          <section key={String(section._id)}>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-2xl font-semibold">{section.name}</h2>
              <Link href="/products" className="text-sm font-medium text-[#FF6B00]">View all</Link>
            </div>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
              {sectionProducts.map((p) => {
                const secName = typeof p.sectionId === "object" ? (p.sectionId as any)?.name || "" : "";
                const tags = [secName, p.productType, "fashion", "clothing"].map(s => String(s || "").trim().split(" ")[0]).filter(Boolean).join(",");
                const keyword = encodeURIComponent(tags.toLowerCase());
                return (
                <a key={String(p._id)} href={`/products/${p._id}`} className="product-card rounded-2xl border border-[#1A1A2E]/10 bg-white p-2 shadow-sm">
                  <img src={p.images?.[0] || `https://loremflickr.com/500/500/${keyword}`} className="h-36 w-full rounded-xl object-cover" alt={p.name} />
                  <div className="mt-2 space-y-1">
                    <p className="line-clamp-1 text-sm font-semibold">{p.name}</p>
                    <p className="line-clamp-1 text-xs text-[#1A1A2E]/70">{p.productType}</p>
                    <p className="text-[11px] text-[#1A1A2E]/70">ID: {p.productCode}</p>
                    <p className="text-[11px] text-[#1A1A2E]/70">Sizes: {p.sizes?.slice(0, 3).join(", ")}</p>
                    <p className="text-sm font-semibold text-[#FF6B00]">INR {Math.round(p.discountedPrice || p.mrp)}</p>
                  </div>
                </a>
              )})}
            </div>
          </section>
        );
      })}
    </main>
  );
}
