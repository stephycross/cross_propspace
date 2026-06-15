import { Router } from "express";
import { userController } from "../controllers/user.controller";
import { requireAuth } from "../middleware/auth.middleware";
import { asyncHandler } from "../utils/asyncHandler";

const router = Router();

// Every profile route is gated behind a valid token.
router.use(requireAuth);

router.get("/me", asyncHandler(userController.getProfile.bind(userController)));
router.put("/me", asyncHandler(userController.updateProfile.bind(userController)));
router.put("/me/password", asyncHandler(userController.changePassword.bind(userController)));

export default router;
