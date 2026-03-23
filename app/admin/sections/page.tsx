"use client";

import { useEffect, useState } from "react";

type Section = { _id: string; name: string; visible: boolean };

export default function AdminSectionsPage() {
  const [sections, setSections] = useState<Section[]>([]);

  useEffect(() => {
    fetch("/api/admin/sections")
      .then((r) => r.json())
      .then((data: Section[]) => setSections(data));
  }, []);

  async function add(formData: FormData) {
    await fetch("/api/admin/sections", { method: "POST", body: formData });
    const updated = await fetch("/api/admin/sections").then((r) => r.json());
    setSections(updated);
  }

  return (
    <div>
      <form action={add} className="mb-3 flex gap-2">
        <input name="name" className="border p-2" placeholder="Add section" />
        <button className="bg-[#FF6B00] px-3 text-white">Add</button>
      </form>
      {sections.map((section) => (
        <div key={section._id} className="mb-2 rounded bg-white p-2">
          {section.name}
        </div>
      ))}
    </div>
  );
}
