import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import { connectDb } from "../lib/db";
import { Admin } from "../models/Admin";
import { Section } from "../models/Section";
import { Product } from "../models/Product";

dotenv.config({ path: ".env.local" });
dotenv.config();

type SectionItem = { _id: string };

async function run() {
  await connectDb();
  const hash = await bcrypt.hash("Admin@123", 10);
  await Admin.updateOne(
    { email: "admin@jaihindtextiles.com" },
    { $set: { name: "Admin", email: "admin@jaihindtextiles.com", passwordHash: hash, role: "admin" } },
    { upsert: true },
  );

  const names = ["Sarees", "Dress Materials", "Kurtis", "Blouses", "Kids Wear"];
  const sections: SectionItem[] = [];

  for (let i = 0; i < names.length; i++) {
    const name = names[i];
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const section = await Section.findOneAndUpdate(
      { slug },
      { $set: { name, slug, visible: true, order: i } },
      { upsert: true, returnDocument: "after" },
    );
    sections.push(section as unknown as SectionItem);
  }

  await Product.deleteMany({});

  const sectionCatalog: Record<string, { baseName: string; types: string[]; materials: string[] }> = {
    Sarees: {
      baseName: "Saree",
      types: ["Silk Saree", "Cotton Saree", "Banarasi Saree", "Printed Saree", "Wedding Saree", "Party Saree"],
      materials: ["Silk", "Cotton", "Georgette", "Chiffon"],
    },
    "Dress Materials": {
      baseName: "Dress Material",
      types: ["Anarkali Set", "Kurta Set", "Unstitched Set", "Printed Suit", "Designer Suit", "Casual Suit"],
      materials: ["Rayon", "Cotton Blend", "Viscose", "Crepe"],
    },
    Kurtis: {
      baseName: "Kurti",
      types: ["Straight Kurti", "A-Line Kurti", "Flared Kurti", "Festival Kurti", "Office Kurti", "Daily Kurti"],
      materials: ["Cotton", "Rayon", "Linen", "Khadi"],
    },
    Blouses: {
      baseName: "Blouse",
      types: ["Padded Blouse", "Designer Blouse", "Boat Neck Blouse", "Sleeveless Blouse", "Party Blouse", "Cotton Blouse"],
      materials: ["Silk Blend", "Cotton", "Satin", "Velvet"],
    },
    "Kids Wear": {
      baseName: "Kids Wear",
      types: ["Girls Frock", "Boys Kurta Set", "Kids Ethnic Set", "Kids Party Wear", "Kids Casual Set", "Festival Kids Set"],
      materials: ["Cotton", "Soft Silk", "Linen", "Denim Blend"],
    },
  };

  let runningNumber = 1;
  for (let sectionIndex = 0; sectionIndex < names.length; sectionIndex++) {
    const sectionName = names[sectionIndex];
    const section = sections[sectionIndex];
    const config = sectionCatalog[sectionName];

    for (let i = 0; i < 6; i++) {
      const productNo = runningNumber++;
      const type = config.types[i];
      const mrp = 700 + productNo * 55;
      const discount = i % 2 === 0 ? 22 : 14;
      const code = `JH-${sectionName.slice(0, 2).toUpperCase()}-${String(productNo).padStart(4, "0")}`;

      await Product.create({
        productCode: code,
        name: `${sectionName} ${config.baseName} ${i + 1}`,
        productType: type,
        description: `Premium ${type.toLowerCase()} for ${sectionName.toLowerCase()} customers with elegant finish and comfortable wear.`,
        sectionId: section._id,
        mrp,
        discount,
        discountedPrice: mrp - (mrp * discount) / 100,
        stock: 15 + i * 2,
        sizes: sectionName === "Kids Wear" ? ["2-3Y", "4-5Y", "6-7Y", "8-9Y"] : ["S", "M", "L", "XL", "XXL", "Free Size"],
        colors: [
          { name: "Saffron", hex: "#FF6B00" },
          { name: "Navy", hex: "#1A1A2E" },
          { name: "Cream", hex: "#FFF8F0" },
        ],
        material: config.materials[i % config.materials.length],
        fabricCare: "Machine wash cold, dry in shade",
        pattern: i % 2 === 0 ? "Printed" : "Embroidered",
        fit: i % 2 === 0 ? "Regular Fit" : "Comfort Fit",
        images: [
          `https://loremflickr.com/900/900/${encodeURIComponent((type).split(" ")[0].toLowerCase())}?lock=${i + 1}`,
          `https://loremflickr.com/900/900/${encodeURIComponent((sectionName).split(" ")[0].toLowerCase())}?lock=${i + 1 + 10}`,
        ],
        videos: ["https://samplelib.com/lib/preview/mp4/sample-5s.mp4"],
        tags: i % 2 === 0 ? ["trending", "festive"] : ["new arrival", "best seller"],
        specifications: [
          { label: "Sleeve", value: i % 2 === 0 ? "3/4 Sleeve" : "Half Sleeve" },
          { label: "Neck", value: i % 2 === 0 ? "Round Neck" : "V Neck" },
          { label: "Occasion", value: i % 2 === 0 ? "Festival" : "Daily Wear" },
        ],
        weight: 0.35 + i * 0.03,
        status: "active",
      });
    }
  }
  console.log("Seed completed");
}

run()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
