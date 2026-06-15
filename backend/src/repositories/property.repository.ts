import { FilterQuery } from "mongoose";
import { PropertyModel, PropertyDocument } from "../models/property.model";

export interface PropertyFilter {
  city?: string;
  minPrice?: number;
  maxPrice?: number;
  purpose?: string;
  propertyType?: string;
}

export class PropertyRepository {
  findMany(filter: PropertyFilter): Promise<PropertyDocument[]> {
    const query: FilterQuery<PropertyDocument> = {};

    if (filter.city) {
      query.city = { $regex: filter.city, $options: "i" };
    }
    if (filter.purpose) {
      query.purpose = filter.purpose;
    }
    if (filter.propertyType) {
      query.propertyType = filter.propertyType;
    }
    if (filter.minPrice !== undefined || filter.maxPrice !== undefined) {
      query.price = {};
      if (filter.minPrice !== undefined) query.price.$gte = filter.minPrice;
      if (filter.maxPrice !== undefined) query.price.$lte = filter.maxPrice;
    }

    return PropertyModel.find(query)
      .populate("owner", "username avatarUrl phone")
      .sort({ createdAt: -1 })
      .exec();
  }

  findByOwner(ownerId: string): Promise<PropertyDocument[]> {
    return PropertyModel.find({ owner: ownerId }).sort({ createdAt: -1 }).exec();
  }

  findById(id: string): Promise<PropertyDocument | null> {
    return PropertyModel.findById(id)
      .populate("owner", "username avatarUrl phone email")
      .exec();
  }

  create(data: Partial<PropertyDocument>): Promise<PropertyDocument> {
    return PropertyModel.create(data);
  }

  update(id: string, data: Partial<PropertyDocument>): Promise<PropertyDocument | null> {
    return PropertyModel.findByIdAndUpdate(id, data, { new: true }).exec();
  }

  delete(id: string): Promise<PropertyDocument | null> {
    return PropertyModel.findByIdAndDelete(id).exec();
  }
}

export const propertyRepository = new PropertyRepository();
