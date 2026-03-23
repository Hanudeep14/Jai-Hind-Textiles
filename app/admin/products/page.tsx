/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useState } from "react";

type Product = {
  _id: string;
  sectionId?: { _id: string; name: string } | string;
  productCode: string;
  name: string;
  productType: string;
  description: string;
  material: string;
  pattern: string;
  fit: string;
  fabricCare: string;
  weight: number;
  sizes?: string[];
  images?: string[];
  videos?: string[];
  tags?: string[];
  colors?: { name: string; hex: string }[];
  specifications?: { label: string; value: string }[];
  mrp: number;
  discount: number;
  discountedPrice: number;
  stock: number;
  status: string;
  updatedAt?: string;
};

type Section = { _id: string; name: string };

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [sections, setSections] = useState<Section[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadingVideo, setUploadingVideo] = useState(false);

  async function loadProducts() {
    const data = await fetch("/api/admin/products").then((r) => r.json());
    setProducts(data);
  }

  useEffect(() => {
    fetch("/api/admin/products").then((r) => r.json()).then(setProducts);
    fetch("/api/admin/sections").then((r) => r.json()).then(setSections);
  }, []);

  async function saveProduct(formData: FormData) {
    setSaving(true);
    setError("");
    const sizesRaw = String(formData.get("sizes") || "");
    const imagesRaw = String(formData.get("images") || "");
    const videosRaw = String(formData.get("videos") || "");
    const tagsRaw = String(formData.get("tags") || "");
    const colorsRaw = String(formData.get("colors") || "");
    const specificationsRaw = String(formData.get("specifications") || "");

    const payload = {
      productCode: String(formData.get("productCode") || "").trim(),
      name: String(formData.get("name") || "").trim(),
      productType: String(formData.get("productType") || "").trim(),
      description: String(formData.get("description") || "").trim(),
      sectionId: String(formData.get("sectionId") || "").trim(),
      mrp: Number(formData.get("mrp") || 0),
      discount: Number(formData.get("discount") || 0),
      stock: Number(formData.get("stock") || 0),
      material: String(formData.get("material") || "").trim(),
      pattern: String(formData.get("pattern") || "").trim(),
      fit: String(formData.get("fit") || "").trim(),
      fabricCare: String(formData.get("fabricCare") || "").trim(),
      weight: Number(formData.get("weight") || 0),
      sizes: sizesRaw ? sizesRaw.split(",").map((x) => x.trim()).filter(Boolean) : [],
      images: imagesRaw ? imagesRaw.split(",").map((x) => x.trim()).filter(Boolean) : [],
      videos: videosRaw ? videosRaw.split(",").map((x) => x.trim()).filter(Boolean) : [],
      tags: tagsRaw ? tagsRaw.split(",").map((x) => x.trim()).filter(Boolean) : [],
      colors: colorsRaw
        ? colorsRaw.split(",").map((entry) => entry.trim()).filter(Boolean).map((entry) => {
            const [name, hex] = entry.split(":").map((v) => v.trim());
            return { name, hex };
          })
        : [],
      specifications: specificationsRaw
        ? specificationsRaw.split(",").map((entry) => entry.trim()).filter(Boolean).map((entry) => {
            const [label, value] = entry.split(":").map((v) => v.trim());
            return { label, value };
          })
        : [],
      status: String(formData.get("status") || "active"),
    };

    if (payload.images.length > 5) {
      setError("Maximum 5 images allowed per product.");
      setSaving(false);
      return;
    }
    if (payload.videos.length > 3) {
      setError("Maximum 3 videos allowed per product.");
      setSaving(false);
      return;
    }

    const isEdit = !!editingProduct;
    const url = isEdit ? `/api/admin/products/${editingProduct._id}` : "/api/admin/products";
    const method = isEdit ? "PUT" : "POST";

    const response = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      setError(data.error || "Failed to save product");
      setSaving(false);
      return;
    }

    setEditingProduct(null);
    await loadProducts();
    setSaving(false);
  }

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    const newUrls: string[] = [];

    for (let i = 0; i < files.length; i++) {
      const formData = new FormData();
      formData.append("file", files[i]);
      try {
        const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
        if (res.ok) {
          const data = await res.json();
          if (data.url) newUrls.push(data.url);
        }
      } catch (err) {
        console.error("Upload error", err);
      }
    }

    const imagesInput = document.getElementById("imagesInput") as HTMLInputElement;
    if (imagesInput) {
      const current = imagesInput.value.trim();
      imagesInput.value = current ? `${current}, ${newUrls.join(", ")}` : newUrls.join(", ");
    }
    setUploading(false);
  }

  async function handleVideoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingVideo(true);
    const newUrls: string[] = [];

    for (let i = 0; i < files.length; i++) {
      const formData = new FormData();
      formData.append("file", files[i]);
      try {
        const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
        if (res.ok) {
          const data = await res.json();
          if (data.url) newUrls.push(data.url);
        }
      } catch (err) {
        console.error("Upload error", err);
      }
    }

    const videosInput = document.getElementById("videosInput") as HTMLInputElement;
    if (videosInput) {
      const current = videosInput.value.trim();
      videosInput.value = current ? `${current}, ${newUrls.join(", ")}` : newUrls.join(", ");
    }
    setUploadingVideo(false);
  }

  async function deleteProduct(id: string) {
    if (!confirm("Are you sure you want to delete this product?")) return;
    await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
    await loadProducts();
  }

  return (
    <div className="space-y-4">
      <div className="rounded-xl bg-white p-4 shadow-sm">
        <h1 className="mb-1 text-2xl font-semibold">{editingProduct ? "Edit Product" : "Add Product"}</h1>
        <p className="mb-4 text-sm text-[#1A1A2E]/70">Admin can create and manage products in the catalog.</p>
        <form key={editingProduct ? editingProduct._id : "new"} action={saveProduct} className="grid gap-3 md:grid-cols-2">
          <input name="productCode" defaultValue={editingProduct?.productCode} placeholder="Product ID (e.g. JH-SA-1001)" className="rounded border p-2" required />
          <input name="name" defaultValue={editingProduct?.name} placeholder="Product name" className="rounded border p-2" required />
          <input name="productType" defaultValue={editingProduct?.productType} placeholder="Product type (e.g. Silk Saree)" className="rounded border p-2" required />
          <select name="sectionId" className="rounded border p-2" required defaultValue={typeof editingProduct?.sectionId === "object" ? editingProduct?.sectionId._id : editingProduct?.sectionId || ""}>
            <option value="" disabled>Select section</option>
            {sections.map((section) => (
              <option key={section._id} value={section._id}>{section.name}</option>
            ))}
          </select>
          <input name="mrp" defaultValue={editingProduct?.mrp} placeholder="MRP" type="number" min={1} className="rounded border p-2" required />
          <input name="discount" defaultValue={editingProduct?.discount} placeholder="Discount %" type="number" min={0} max={95} className="rounded border p-2" />
          <input name="stock" defaultValue={editingProduct?.stock} placeholder="Stock quantity" type="number" min={0} className="rounded border p-2" required />
          <input name="material" defaultValue={editingProduct?.material} placeholder="Material / fabric" className="rounded border p-2" />
          <input name="pattern" defaultValue={editingProduct?.pattern} placeholder="Pattern" className="rounded border p-2" />
          <input name="fit" defaultValue={editingProduct?.fit} placeholder="Fit" className="rounded border p-2" />
          <input name="fabricCare" defaultValue={editingProduct?.fabricCare} placeholder="Fabric care" className="rounded border p-2" />
          <input name="weight" defaultValue={editingProduct?.weight} placeholder="Weight (kg)" type="number" step="0.01" className="rounded border p-2" />
          <input name="sizes" defaultValue={editingProduct?.sizes?.join(", ")} placeholder="Sizes comma-separated: S,M,L,XL" className="rounded border p-2 md:col-span-2" />
          <input name="colors" defaultValue={editingProduct?.colors?.map((c) => `${c.name}:${c.hex}`).join(", ")} placeholder="Colors: Red:#ff0000,Navy:#1a1a2e" className="rounded border p-2 md:col-span-2" />
          
          <div className="md:col-span-2 rounded border p-3 space-y-2 bg-[#fff7ef]/30">
            <p className="text-sm font-medium">Product Images (Max 5)</p>
            <div className="flex items-center gap-3">
              <input type="file" multiple accept="image/*" onChange={handleFileUpload} disabled={uploading} className="text-sm" />
              {uploading && <span className="text-xs text-[#FF6B00]">Uploading to secure cloud...</span>}
            </div>
            <input id="imagesInput" name="images" defaultValue={editingProduct?.images?.join(", ")} placeholder="Or paste Image URLs (comma-separated)" className="w-full rounded border p-2" />
          </div>

          <div className="md:col-span-2 rounded border p-3 space-y-2 bg-[#fff7ef]/30">
            <p className="text-sm font-medium">Product Videos (Max 3)</p>
            <div className="flex items-center gap-3">
              <input type="file" multiple accept="video/*" onChange={handleVideoUpload} disabled={uploadingVideo} className="text-sm" />
              {uploadingVideo && <span className="text-xs text-[#FF6B00]">Uploading to secure cloud...</span>}
            </div>
            <input id="videosInput" name="videos" defaultValue={editingProduct?.videos?.join(", ")} placeholder="Or paste Video URLs (comma-separated)" className="w-full rounded border p-2" />
          </div>

          <input name="tags" defaultValue={editingProduct?.tags?.join(", ")} placeholder="Tags comma-separated: trending,new arrival" className="rounded border p-2 md:col-span-2" />
          <input name="specifications" defaultValue={editingProduct?.specifications?.map((s) => `${s.label}:${s.value}`).join(", ")} placeholder="Specs: Sleeve:Half,Occasion:Party" className="rounded border p-2 md:col-span-2" />
          <textarea name="description" defaultValue={editingProduct?.description} placeholder="Description" className="min-h-20 rounded border p-2 md:col-span-2" />
          <select name="status" defaultValue={editingProduct?.status || "active"} className="rounded border p-2">
            <option value="active">Active</option>
            <option value="out_of_stock">Out of Stock</option>
            <option value="hidden">Hidden</option>
          </select>
          <div className="flex gap-2">
            <button disabled={saving} type="submit" className="rounded bg-[#FF6B00] px-4 py-2 font-medium text-white disabled:opacity-60">
              {saving ? "Saving..." : editingProduct ? "Update Product" : "Add Product"}
            </button>
            {editingProduct && (
              <button type="button" onClick={() => setEditingProduct(null)} className="rounded bg-gray-200 px-4 py-2 font-medium text-[#1A1A2E]">
                Cancel
              </button>
            )}
          </div>
          {error ? <p className="text-sm text-red-600 md:col-span-2">{error}</p> : null}
        </form>
      </div>

      <div className="rounded-xl bg-white p-4 shadow-sm">
        <h1 className="mb-1 text-2xl font-semibold">Products Catalog</h1>
        <p className="mb-4 text-sm text-[#1A1A2E]/70">Manage all existing products here.</p>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-[#fff5eb] text-left text-xs uppercase tracking-wide text-[#1A1A2E]/80">
              <tr>
                <th className="p-3">Preview</th>
                <th className="p-3">Product</th>
                <th className="p-3">Type</th>
                <th className="p-3">Section</th>
                <th className="p-3">ID</th>
                <th className="p-3">Prices</th>
                <th className="p-3">Stock</th>
                <th className="p-3">Last Updated</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => {
                const secName = typeof p.sectionId === "object" ? p.sectionId?.name || "" : "";
                const tags = [secName, p.productType, "fashion", "clothing"].map(s => String(s || "").trim().split(" ")[0]).filter(Boolean).join(",");
                const keyword = encodeURIComponent(tags.toLowerCase());
                return (
                  <tr key={p._id} className="border-b border-[#1A1A2E]/10 align-top">
                    <td className="p-3">
                      <img src={p.images?.[0] || `https://loremflickr.com/120/120/${keyword}`} alt={p.name} className="h-12 w-12 rounded object-cover" />
                    </td>
                    <td className="p-3 font-medium">{p.name}</td>
                    <td className="p-3">{p.productType}</td>
                    <td className="p-3">{typeof p.sectionId === "string" ? p.sectionId : p.sectionId?.name || "-"}</td>
                    <td className="p-3 text-xs">{p.productCode}</td>
                    <td className="p-3 text-xs">INR {Math.round(p.discountedPrice || p.mrp)}</td>
                    <td className="p-3">{p.stock}</td>
                    <td className="p-3 text-xs">{p.updatedAt ? new Date(p.updatedAt).toLocaleDateString() + " " + new Date(p.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "-"}</td>
                    <td className="p-3 space-x-2">
                      <button onClick={() => { setEditingProduct(p); window.scrollTo(0, 0); }} className="text-[#FF6B00] hover:underline">Edit</button>
                      <button onClick={() => deleteProduct(p._id)} className="text-red-500 hover:underline">Delete</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
