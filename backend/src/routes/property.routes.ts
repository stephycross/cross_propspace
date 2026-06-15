import { Router } from "express";
import { propertyController } from "../controllers/property.controller";
import { requireAuth } from "../middleware/auth.middleware";
import { uploadImages } from "../middleware/upload.middleware";
import { asyncHandler } from "../utils/asyncHandler";

const router = Router();

// Public reads: anyone can browse and search the marketplace feed.
router.get("/", asyncHandler(propertyController.list.bind(propertyController)));

// Private collection of the authenticated author's own listings.
router.get("/mine", requireAuth, asyncHandler(propertyController.listMine.bind(propertyController)));

router.get("/:id", asyncHandler(propertyController.getOne.bind(propertyController)));

// Writes require a token; uploadImages parses any attached image files.
router.post(
  "/",
  requireAuth,
  uploadImages.array("images", 8),
  asyncHandler(propertyController.create.bind(propertyController))
);
router.put(
  "/:id",
  requireAuth,
  uploadImages.array("images", 8),
  asyncHandler(propertyController.update.bind(propertyController))
);
router.delete("/:id", requireAuth, asyncHandler(propertyController.remove.bind(propertyController)));

export default router;
