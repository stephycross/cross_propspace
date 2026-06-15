import { Schema, model, Document, Types } from "mongoose";

export const PROPERTY_TYPES = ["Apartment", "House", "Studio"] as const;
export type PropertyType = (typeof PROPERTY_TYPES)[number];

export const LISTING_PURPOSES = ["rent", "sale"] as const;
export type ListingPurpose = (typeof LISTING_PURPOSES)[number];

export interface PropertyDocument extends Document {
  _id: Types.ObjectId;
  title: string;
  description: string;
  price: number;
  purpose: ListingPurpose;
  city: string;
  country: string;
  propertyType: PropertyType;
  images: string[];
  owner: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const propertySchema = new Schema<PropertyDocument>(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    purpose: { type: String, enum: LISTING_PURPOSES, required: true },
    city: { type: String, required: true, trim: true },
    country: { type: String, required: true, trim: true },
    propertyType: { type: String, enum: PROPERTY_TYPES, required: true },
    images: { type: [String], default: [] },
    // Reference linking each listing to the account that authored it.
    owner: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
  },
  { timestamps: true }
);

// Text index keeps city/title search fast as the collection grows.
propertySchema.index({ city: "text", title: "text" });

export const PropertyModel = model<PropertyDocument>("Property", propertySchema);
