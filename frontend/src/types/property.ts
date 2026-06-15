export type PropertyType = "Apartment" | "House" | "Studio";
export type ListingPurpose = "rent" | "sale";

export interface PropertyOwner {
  _id: string;
  username: string;
  avatarUrl?: string;
  phone?: string;
  email?: string;
}

export interface Property {
  _id: string;
  title: string;
  description: string;
  price: number;
  purpose: ListingPurpose;
  city: string;
  country: string;
  propertyType: PropertyType;
  images: string[];
  owner: PropertyOwner | string;
  createdAt: string;
  updatedAt: string;
}

export interface PropertyFilters {
  city?: string;
  minPrice?: string;
  maxPrice?: string;
  purpose?: string;
  propertyType?: string;
}
