/* eslint-disable @next/next/no-img-element */
import { connectDb } from "@/lib/db";
import { Product } from "@/models/Product";
import { Section } from "@/models/Section";

export const dynamic = "force-dynamic";

type SectionView = { _id: string; name: string };
type ProductView = { _id: string; name: string; images?: string[] };

export default async function Home() {
  await connectDb();
  const sections = (await Section.find({ visible: true }).sort({ order: 1 }).lean()) as unknown as SectionView[];
  const products = (await Product.find({ status: "active" }).limit(8).lean()) as unknown as ProductView[];

  return (
    <main className="mx-auto max-w-6xl space-y-8 p-4">
      <section className="hero-pattern rounded-3xl p-8">
        <h1 className="text-4xl font-semibold">Jaihind Textiles</h1>
        <p className="mt-2 max-w-2xl">Meesho-inspired textile storefront for retail and dealer orders.</p>
      </section>
      <section>
        <h2 className="mb-3 text-xl font-semibold">Categories</h2>
        <div className="flex gap-2 overflow-x-auto">
          {sections.map((s) => (
            <span key={String(s._id)} className="rounded-full bg-white px-4 py-2 text-sm">
              {s.name}
            </span>
          ))}
        </div>
      </section>
      <section>
        <h2 className="mb-3 text-xl font-semibold">Featured Products</h2>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {products.map((p) => (
            <a key={String(p._id)} href={`/products/${p._id}`} className="product-card rounded-xl bg-white p-2">
              <img src={p.images?.[0] || "https://picsum.photos/500/500"} className="h-32 w-full rounded object-cover" alt={p.name} />
              <p className="mt-2 text-sm">{p.name}</p>
            </a>
          ))}
        </div>
      </section>
    </main>
  );
}
