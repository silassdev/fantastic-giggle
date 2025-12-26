import mongoose, { Document, Model, Schema } from "mongoose";

export interface IProduct extends Document {
  name: string;
  slug: string;
  description: string;
  price: number;
  images: string[];
  stock: number;
  category: string;
  tags: string[];
  colors: string[];
  isActive: boolean;
  outOfStock: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema = new Schema({
  name: { type: String, required: true },
  slug: { type: String, index: true },
  description: { type: String, default: '' },
  price: { type: Number, required: true, default: 0 },
  images: { type: [String], default: [] },
  stock: { type: Number, default: 0 },
  category: { type: String, default: '' },
  tags: { type: [String], default: [] },
  colors: { type: [String], default: [] },
  isActive: { type: Boolean, default: true },
  outOfStock: { type: Boolean, default: false },
}, { timestamps: true });

export default mongoose.models.Product || mongoose.model('Product', ProductSchema);

