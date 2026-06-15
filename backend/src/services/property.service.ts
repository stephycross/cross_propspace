import { propertyRepository, PropertyFilter } from "../repositories/property.repository";
import { ApiError } from "../utils/ApiError";
import {
  isNonEmptyString,
  isPositiveNumber,
} from "../utils/validators";
import {
  PROPERTY_TYPES,
  LISTING_PURPOSES,
  PropertyDocument,
  PropertyType,
  ListingPurpose,
} from "../models/property.model";

// Once validatePropertyInput has run, the string fields are guaranteed to be
// valid enum members, so this narrows them for the typed model layer.
function toModelPayload(input: PropertyInput) {
  return {
    ...input,
    purpose: input.purpose as ListingPurpose,
    propertyType: input.propertyType as PropertyType,
  };
}

export interface PropertyInput {
  title: string;
  description: string;
  price: number;
  purpose: string;
  city: string;
  country: string;
  propertyType: string;
  images: string[];
}

function validatePropertyInput(input: PropertyInput): void {
  if (!isNonEmptyString(input.title)) throw ApiError.badRequest("Title is required");
  if (!isNonEmptyString(input.description)) throw ApiError.badRequest("Description is required");
  if (!isPositiveNumber(input.price)) throw ApiError.badRequest("Price must be a positive number");
  if (!isNonEmptyString(input.city)) throw ApiError.badRequest("City is required");
  if (!isNonEmptyString(input.country)) throw ApiError.badRequest("Country is required");
  if (!LISTING_PURPOSES.includes(input.purpose as never)) {
    throw ApiError.badRequest("Purpose must be either rent or sale");
  }
  if (!PROPERTY_TYPES.includes(input.propertyType as never)) {
    throw ApiError.badRequest("Property type must be Apartment, House, or Studio");
  }
}

export class PropertyService {
  list(filter: PropertyFilter): Promise<PropertyDocument[]> {
    return propertyRepository.findMany(filter);
  }

  listForOwner(ownerId: string): Promise<PropertyDocument[]> {
    return propertyRepository.findByOwner(ownerId);
  }

  async getById(id: string): Promise<PropertyDocument> {
    const property = await propertyRepository.findById(id);
    if (!property) {
      throw ApiError.notFound("Property not found");
    }
    return property;
  }

  async create(ownerId: string, input: PropertyInput): Promise<PropertyDocument> {
    validatePropertyInput(input);
    return propertyRepository.create({ ...toModelPayload(input), owner: ownerId as never });
  }

  async update(
    id: string,
    ownerId: string,
    input: PropertyInput
  ): Promise<PropertyDocument> {
    const existing = await propertyRepository.findById(id);
    if (!existing) {
      throw ApiError.notFound("Property not found");
    }
    // Ownership is enforced at the service level, never trusting the client.
    if (existing.owner._id.toString() !== ownerId) {
      throw ApiError.forbidden("You can only modify your own listings");
    }

    validatePropertyInput(input);
    const updated = await propertyRepository.update(id, toModelPayload(input));
    if (!updated) {
      throw ApiError.notFound("Property not found");
    }
    return updated;
  }

  async remove(id: string, ownerId: string): Promise<void> {
    const existing = await propertyRepository.findById(id);
    if (!existing) {
      throw ApiError.notFound("Property not found");
    }
    if (existing.owner._id.toString() !== ownerId) {
      throw ApiError.forbidden("You can only delete your own listings");
    }
    await propertyRepository.delete(id);
  }
}

export const propertyService = new PropertyService();
