import { Router } from "express";
import { register, login, logout, refreshAccessToken, getCurrentUser } from "./user.controller.js";
import { verifyJWT } from "../../middleware/auth.middleware.js";
import { authLimiter } from "../../middleware/rateLimiter.middleware.js";

const router = Router();

// Registration and Login routes with rate limiting
router.post("/signup", authLimiter, register);
router.post("/login", authLimiter, login);

router.post("/refresh-token", refreshAccessToken);

// Protected routes
router.post("/logout", verifyJWT, logout);
router.get("/current-user", verifyJWT, getCurrentUser);

export default router;
