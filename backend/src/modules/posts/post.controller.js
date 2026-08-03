import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponce.js";
import { Post } from "./post.model.js";
import { uploadOnCloudinary, deleteFromCloudinary } from "../../services/storage.service.js";
import { cacheManager } from "../../cache/cache.manager.js";
import mongoose, { isValidObjectId } from "mongoose";

// TTL Constants
const FEED_TTL = 300; // 5 minutes
const POST_TTL = 900; // 15 minutes
const USER_POSTS_TTL = 1800; // 30 minutes

// Get all published posts with pagination and Redis/Memory Cache
export const getAllPosts = asyncHandler(async (req, res) => {
  const page = Math.max(1, parseInt(req.query.page, 10) || 1);
  const limit = Math.min(100, parseInt(req.query.limit, 10) || 10);

  const cacheKey = `posts:page:${page}:limit:${limit}`;
  const cachedData = await cacheManager.get(cacheKey);
  if (cachedData) {
    return res.status(200).json(new ApiResponse(200, cachedData, "Published posts fetched from cache successfully"));
  }

  const pipeline = [
    { $match: { isPublished: true } },
    {
      $lookup: {
        from: "users",
        localField: "owner",
        foreignField: "_id",
        as: "ownerDetails",
      },
    },
    { $unwind: "$ownerDetails" },
    {
      $project: {
        title: 1,
        content: 1,
        featuredImg: 1,
        tags: 1,
        createdAt: 1,
        "ownerDetails._id": 1,
        "ownerDetails.username": 1,
        "ownerDetails.email": 1,
      },
    },
    { $sort: { createdAt: -1 } },
    { $skip: (page - 1) * limit },
    { $limit: limit },
  ];

  const posts = await Post.aggregate(pipeline);

  // We save to cache even if empty array, to prevent database spam
  await cacheManager.set(cacheKey, posts, FEED_TTL);

  res.status(200).json(new ApiResponse(200, posts, "Published posts fetched successfully"));
});

// Get a user's posts
export const getMyPosts = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  if (!isValidObjectId(userId)) {
    throw new ApiError(400, "Invalid user ID");
  }

  if (userId !== req.user._id.toString()) {
    throw new ApiError(403, "Unauthorized to access these posts");
  }

  const cacheKey = `posts:user:${userId}`;
  const cachedData = await cacheManager.get(cacheKey);
  if (cachedData) {
    return res.status(200).json(new ApiResponse(200, cachedData, "Your posts fetched from cache successfully"));
  }

  const posts = await Post.find({ owner: userId })
    .select("title content featuredImg tags owner isPublished createdAt")
    .sort({ createdAt: -1 })
    .lean();

  await cacheManager.set(cacheKey, posts, USER_POSTS_TTL);

  res.status(200).json(new ApiResponse(200, posts, "Your posts fetched successfully"));
});

// Add a new post
export const addPost = asyncHandler(async (req, res) => {
  const { title, content, tags, isPublished } = req.body;

  if (!title || !content) {
    throw new ApiError(400, "Title and content are required to create a post");
  }

  let featuredImgUrl = null;
  if (req.files?.featuredImg) {
    const file = req.files.featuredImg[0];
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.mimetype)) {
      throw new ApiError(400, "Unsupported file format. Only webp, JPEG and PNG are allowed.");
    }
    featuredImgUrl = await uploadOnCloudinary(file.path);
  }

  // Set default placeholder if no image uploaded
  const featuredImgPath = featuredImgUrl ? featuredImgUrl.url : "https://via.placeholder.com/800x400";

  const parsedTags = Array.isArray(tags)
    ? tags.flatMap((tag) => tag.split(" ").map((t) => t.trim()).filter(Boolean))
    : typeof tags === "string"
    ? tags.split(",").map((t) => t.trim()).filter(Boolean)
    : [];

  const post = await Post.create({
    title,
    content,
    tags: parsedTags,
    featuredImg: featuredImgPath,
    owner: req.user._id,
    isPublished: isPublished === "true" || isPublished === true || false,
  });

  // Invalidate feed & user post cache
  await cacheManager.invalidatePattern("posts:page:*");
  await cacheManager.invalidatePattern(`posts:user:${req.user._id}`);

  res.status(201).json(new ApiResponse(201, post, "Post created successfully"));
});

// Edit an existing post
export const editPost = asyncHandler(async (req, res) => {
  const { title, content, tags, isPublished } = req.body;
  const { id } = req.params;

  if (!isValidObjectId(id)) {
    throw new ApiError(400, "Invalid post ID");
  }

  const post = await Post.findById(id);
  if (!post) {
    throw new ApiError(404, "Post not found");
  }

  if (post.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "Unauthorized to edit this post");
  }

  // Update image if new one provided
  let featuredImgUrl = null;
  if (req.files?.featuredImg) {
    const file = req.files.featuredImg[0];
    featuredImgUrl = await uploadOnCloudinary(file.path);
    if (featuredImgUrl && post.featuredImg && !post.featuredImg.includes("placeholder")) {
      const publicId = post.featuredImg.split("/").pop().split(".")[0];
      await deleteFromCloudinary(publicId);
    }
    post.featuredImg = featuredImgUrl.url;
  }

  post.title = title || post.title;
  post.content = content || post.content;
  if (isPublished !== undefined) {
    post.isPublished = isPublished === "true" || isPublished === true;
  }

  if (tags !== undefined) {
    post.tags = Array.isArray(tags)
      ? tags.flatMap((tag) => tag.split(" ").map((t) => t.trim()).filter(Boolean))
      : typeof tags === "string"
      ? tags.split(",").map((t) => t.trim()).filter(Boolean)
      : post.tags;
  }

  await post.save();

  // Invalidate details, feed & user post cache
  await cacheManager.del(`post:id:${id}`);
  await cacheManager.invalidatePattern("posts:page:*");
  await cacheManager.invalidatePattern(`posts:user:${req.user._id}`);

  res.status(200).json(new ApiResponse(200, post, "Post updated successfully"));
});

// Delete a post
export const deletePost = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!isValidObjectId(id)) {
    throw new ApiError(400, "Invalid post ID");
  }

  const post = await Post.findById(id);
  if (!post || post.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "Unauthorized or Post not found");
  }

  if (post.featuredImg && !post.featuredImg.includes("placeholder")) {
    const publicId = post.featuredImg.split("/").pop().split(".")[0];
    await deleteFromCloudinary(publicId);
  }

  await Post.findByIdAndDelete(id);

  // Invalidate details, feed & user post cache
  await cacheManager.del(`post:id:${id}`);
  await cacheManager.invalidatePattern("posts:page:*");
  await cacheManager.invalidatePattern(`posts:user:${req.user._id}`);

  res.status(200).json(new ApiResponse(200, {}, "Post deleted successfully"));
});

// Toggle publish status
export const togglePublishStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!isValidObjectId(id)) {
    throw new ApiError(400, "Invalid post ID");
  }

  const post = await Post.findById(id);
  if (!post || post.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "Unauthorized or Post not found");
  }

  post.isPublished = !post.isPublished;
  await post.save();

  // Invalidate details, feed & user post cache
  await cacheManager.del(`post:id:${id}`);
  await cacheManager.invalidatePattern("posts:page:*");
  await cacheManager.invalidatePattern(`posts:user:${req.user._id}`);

  res.status(200).json(new ApiResponse(200, { isPublished: post.isPublished }, "Publish status toggled"));
});

// Get post by ID
export const getPostById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!isValidObjectId(id)) {
    throw new ApiError(400, "Invalid post ID");
  }

  const cacheKey = `post:id:${id}`;
  const cachedData = await cacheManager.get(cacheKey);
  if (cachedData) {
    return res.status(200).json(new ApiResponse(200, cachedData, "Post fetched from cache successfully"));
  }

  const post = await Post.findById(id)
    .select("title content featuredImg tags isPublished createdAt")
    .populate("owner", "username email")
    .lean();

  if (!post) {
    throw new ApiError(404, "Post not found");
  }

  await cacheManager.set(cacheKey, post, POST_TTL);

  res.status(200).json(new ApiResponse(200, post, "Post fetched successfully"));
});
