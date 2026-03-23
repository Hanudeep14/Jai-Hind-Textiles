import { Schema, model, models } from "mongoose";

const productSchema = new Schema(
  {
    productCode: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    productType: { type: String, required: true },
    description: String,
    sectionId: { type: Schema.Types.ObjectId, ref: "Section", required: true },
    mrp: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    discountedPrice: { type: Number, required: true },
    stock: { type: Number, default: 0 },
    sizes: [String],
    colors: [{ name: String, hex: String }],
    material: String,
    fabricCare: String,
    pattern: String,
    fit: String,
    images: [String],
    videos: [String],
    tags: [String],
    specifications: [{ label: String, value: String }],
    weight: Number,
    status: { type: String, enum: ["active", "out_of_stock", "hidden"], default: "active" },
  },
  { timestamps: true },
);

export const Product = models.Product || model("Product", productSchema);
