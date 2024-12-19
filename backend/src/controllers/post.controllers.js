import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { Post } from "../models/post.models.js";
import { ApiResponse } from "../utils/ApiResponce.js";
import { uploadOnCloudinary, deleteFromCloudinary } from "../utils/cloudinary.js";
import mongoose, { isValidObjectId } from "mongoose";

// Get all published posts with pagination
const getAllPosts = asyncHandler(async (req, res) => {
  const page = Math.max(1, parseInt(req.query.page, 10) || 1);
  const limit = Math.min(100, parseInt(req.query.limit, 10) || 10);

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
    { $skip: (page - 1) * limit }, // Skip already fetched posts
    { $limit: limit }, // Limit to the required number of posts per page
  ];

  const posts = await Post.aggregate(pipeline);
  if (!posts || posts.length === 0) {
    throw new ApiError(404, "No published posts found");
  }

  res.status(200).json(new ApiResponse(200, posts, "Published posts fetched successfully"));
});


// Get a user's posts
const getMyPosts = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  if (!isValidObjectId(userId)) {
    throw new ApiError(400, "Invalid user ID");
  }

  if (userId !== req.user._id.toString()) {
    throw new ApiError(403, "Unauthorized to access these posts");
  }

  const posts = await Post.find({ owner: userId })
    .select("title content featuredImg tags owner isPublished createdAt")
    .sort({ createdAt: -1 });

  if (!posts || posts.length === 0) {
    throw new ApiError(404, "No posts found for the given user");
  }

  res.status(200).json(new ApiResponse(200, posts, "Your posts fetched successfully"));
});

// Add a new post
const addPost = asyncHandler(async (req, res) => {
  const { title, content, tags, isPublished } = req.body;

  if (!title || !content) {
    throw new ApiError(400, "Title and content are required to create a post");
  }

  let featuredImgUrl = null;
  if (req.files?.featuredImg) {
    const file = req.files.featuredImg[0];
    const allowedTypes = ["image/jpeg", "image/png"];
    if (!allowedTypes.includes(file.mimetype)) {
      throw new ApiError(400, "Unsupported file format. Only JPEG and PNG are allowed.");
    }
    featuredImgUrl = await uploadOnCloudinary(file.path);
  }

  const post = await Post.create({
    title,
    content,
    tags: tags?.split(",").map((tag) => tag.trim()).filter(Boolean) || [],
    featuredImg: featuredImgUrl ? featuredImgUrl.url : null,
    owner: req.user._id,
    isPublished: isPublished || false,
  });

  res.status(201).json(new ApiResponse(201, post, "Post created successfully"));
});

// Edit an existing post
const editPost = asyncHandler(async (req, res) => {
  const { title, content, tags } = req.body;
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

  post.title = title || post.title;
  post.content = content || post.content;
  post.tags = tags
    ? tags.split(",").map((tag) => tag.trim()).filter(Boolean)
    : post.tags;

  await post.save();

  res.status(200).json(new ApiResponse(200, post, "Post updated successfully"));
});

// Delete a post
const deletePost = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const post = await Post.findById(id);
  if (!post || post.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "Unauthorized or Post not found");
  }

  if (post.featuredImg) {
    const publicId = post.featuredImg.split("/").pop().split(".")[0];
    await deleteFromCloudinary(publicId);
  }

  await Post.findByIdAndDelete(id);
  res.status(200).json(new ApiResponse(200, {}, "Post deleted successfully"));
});

// Toggle publish status of a post
const togglePublishStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const post = await Post.findById(id);
  if (!post || post.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "Unauthorized or Post not found");
  }

  post.isPublished = !post.isPublished;
  await post.save();

  res.status(200).json(new ApiResponse(200, { isPublished: post.isPublished }, "Publish status toggled"));
});

// Get a post by ID
const getPostById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!isValidObjectId(id)) {
    throw new ApiError(400, "Invalid post ID");
  }

  const post = await Post.findById(id)
    .select("title content featuredImg tags isPublished createdAt")
    .populate("owner", "username email");

  if (!post) {
    throw new ApiError(404, "Post not found");
  }

  res.status(200).json(new ApiResponse(200, post, "Post fetched successfully"));
});

export {
  getAllPosts,
  getMyPosts,
  addPost,
  editPost,
  deletePost,
  togglePublishStatus,
  getPostById,
};
