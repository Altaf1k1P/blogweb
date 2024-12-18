import { Router } from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { upload } from "../middleware/multer.middelware.js";
import {
  getAllPosts,
  getMyPosts,
  addPost,
  editPost,
  deletePost,
  togglePublishStatus,
  getPostById
} from "../controllers/post.controllers.js";

const router = Router();

router.get("/home", getAllPosts);
router.get("/post/:id", getPostById);
router.get("/myposts/:userId", verifyJWT, getMyPosts);
router.post("/add-post", verifyJWT, upload.fields([{ name: "featuredImg", maxCount:1}]), addPost);
router.patch("/post/:id", verifyJWT, editPost);
router.delete("/post/:id", verifyJWT, deletePost);
router.put("/add-post/:id/publish", verifyJWT, togglePublishStatus);

export default router;
