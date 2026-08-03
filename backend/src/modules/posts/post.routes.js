import { Router } from "express";
import { verifyJWT } from "../../middleware/auth.middleware.js";
import { upload } from "../../middleware/upload.middleware.js";
import {
  getAllPosts,
  getMyPosts,
  addPost,
  editPost,
  deletePost,
  togglePublishStatus,
  getPostById,
} from "./post.controller.js";

const router = Router();

// Public routes
router.get("/home", getAllPosts);
router.get("/post/:id", getPostById);

// Protected routes
router.get("/myposts/:userId", verifyJWT, getMyPosts);
router.post(
  "/add-post",
  verifyJWT,
  upload.fields([{ name: "featuredImg", maxCount: 1 }]),
  addPost
);
router.patch(
  "/post/:id",
  verifyJWT,
  upload.fields([{ name: "featuredImg", maxCount: 1 }]),
  editPost
);
router.delete("/post/:id", verifyJWT, deletePost);
router.put("/add-post/:id/publish", verifyJWT, togglePublishStatus);

export default router;
