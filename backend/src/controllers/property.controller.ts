import { Request, Response } from "express";
import { propertyService, PropertyInput } from "../services/property.service";
import { PropertyFilter } from "../repositories/property.repository";

// Builds an absolute URL for each uploaded file so the frontend can render it
// regardless of where the API is hosted.
function buildImageUrls(req: Request): string[] {
  const files = (req.files as Express.Multer.File[]) ?? [];
  const base = `${req.protocol}://${req.get("host")}`;
  return files.map((file) => `${base}/uploads/${file.filename}`);
}

// A multipart form delivers everything as strings; numbers need parsing.
function parsePropertyBody(req: Request): PropertyInput {
  const uploaded = buildImageUrls(req);
  const linked: string[] =
    typeof req.body.imageUrls === "string" && req.body.imageUrls.trim()
      ? req.body.imageUrls.split(",").map((url: string) => url.trim()).filter(Boolean)
      : [];

  return {
    title: req.body.title,
    description: req.body.description,
    price: Number(req.body.price),
    purpose: req.body.purpose,
    city: req.body.city,
    country: req.body.country,
    propertyType: req.body.propertyType,
    images: [...uploaded, ...linked],
  };
}

export class PropertyController {
  async list(req: Request, res: Response): Promise<void> {
    const filter: PropertyFilter = {
      city: req.query.city as string | undefined,
      purpose: req.query.purpose as string | undefined,
      propertyType: req.query.propertyType as string | undefined,
      minPrice: req.query.minPrice ? Number(req.query.minPrice) : undefined,
      maxPrice: req.query.maxPrice ? Number(req.query.maxPrice) : undefined,
    };
    const properties = await propertyService.list(filter);
    res.status(200).json(properties);
  }

  async listMine(req: Request, res: Response): Promise<void> {
    const properties = await propertyService.listForOwner(req.userId as string);
    res.status(200).json(properties);
  }

  async getOne(req: Request, res: Response): Promise<void> {
    const property = await propertyService.getById(req.params.id);
    res.status(200).json(property);
  }

  async create(req: Request, res: Response): Promise<void> {
    const property = await propertyService.create(req.userId as string, parsePropertyBody(req));
    res.status(201).json(property);
  }

  async update(req: Request, res: Response): Promise<void> {
    const property = await propertyService.update(
      req.params.id,
      req.userId as string,
      parsePropertyBody(req)
    );
    res.status(200).json(property);
  }

  async remove(req: Request, res: Response): Promise<void> {
    await propertyService.remove(req.params.id, req.userId as string);
    res.status(200).json({ message: "Listing deleted" });
  }
}

export const propertyController = new PropertyController();
