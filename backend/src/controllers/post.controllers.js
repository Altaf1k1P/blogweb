import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { Post } from "../models/post.models.js";
import { ApiResponse } from "../utils/ApiResponce.js";
import { uploadOnCloudinary, deleteFromCloudinary } from "../utils/cloudinary.js";
import mongoose, { isValidObjectId } from "mongoose";


// Get all published posts with pagination
const getAllPosts = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10 } = req.query;

  // Define the aggregation pipeline
  const pipeline = [
    { 
      $match: { isPublished: true } // Match only published posts
    },
    { 
      $lookup: {
        from: "users", // Collection name for users
        localField: "owner", // Field in Post collection
        foreignField: "_id", // Field in User collection
        as: "ownerDetails" // Output field where the owner details will be stored
      }
    },
    { 
      $unwind: "$ownerDetails" // Deconstruct the array created by $lookup to an object
    },
    { 
      $project: {
        title: 1,
        content: 1,
        featuredImg: 1,
        tags: 1,
        createdAt: 1,
        "ownerDetails._id": 1,
        "ownerDetails.username": 1,
        "ownerDetails.email": 1, // Include additional fields as needed
      }
    },
    { 
      $sort: { createdAt: -1 } // Sort posts by createdAt in descending order
    },
  ];

  // Pagination options
  const options = {
    page: parseInt(page, 10),
    limit: parseInt(limit, 10),
  };

  // Paginate using aggregatePaginate
  const posts = await Post.aggregatePaginate(Post.aggregate(pipeline), options);

  if (!posts) {
    throw new ApiError(404, "No published posts found");
  }

  // Return the paginated posts with owner details
  res.status(200).json(new ApiResponse(200, posts, "Published posts fetched successfully"));
});



const getMyPosts = asyncHandler(async (req, res) => {
  const {userId} = req.params;
  if (!isValidObjectId(userId)) {
    throw new ApiError(400, "Invalid user ID");
  }
  const posts = await Post.find({ owner: userId })
    .select("title content featuredImg tags owner isPublished createdAt")
    .sort({ createdAt: -1 });
    if(!posts || posts.length===0){
      throw new ApiError(404, "No posts found for the given user");
    }
    if(userId !== req.user?._id.toString()){
      throw new ApiError(403, "Unauthorized to access the posts of this user");
    }
  res.status(200).json(new ApiResponse(200, posts, "Your posts fetched successfully"));
});

const addPost = asyncHandler(async (req, res) => {
  const { title, content, tags, isPublished } = req.body;

  // Handle the featured image upload if exists
  let featuredImgUrl = null;
  if (req.files?.featuredImg) {
    featuredImgUrl = await uploadOnCloudinary(req.files.featuredImg[0].path);
  }

  const post = await Post.create({
    title,
    content,
    tags: tags?.split(",").map((tag) => tag.trim()).filter(Boolean) || [],
    featuredImg: featuredImgUrl ? featuredImgUrl.url : null, // Save Cloudinary URL
    owner: req.user._id,
    isPublished: isPublished || false,
  });

  res.status(201).json(new ApiResponse(201, post, "Post created successfully"));
});


const editPost = asyncHandler(async (req, res) => {
  const { title, content, tags } = req.body;
  const { id } = req.params;

  // Check if postId is valid
  if (!isValidObjectId(id)) {
    throw new ApiError(400, "Invalid post ID");
  }

  // Find the post by its ID
  const post = await Post.findById(id);

  // If the post doesn't exist or the user is not authorized, return an error
  if (!post) {
    throw new ApiError(404, "Post not found");
  }

  if (post.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "Unauthorized to edit this post");
  }

  // Update post fields with the provided data, keeping existing values if not provided
  post.title = title || post.title;
  post.content = content || post.content;

  // Ensure tags is a string before splitting, and handle null/undefined
  if (tags) {
    post.tags = typeof tags === 'string'
      ? tags.split(",").map((tag) => tag.trim()).filter(Boolean)
      : post.tags;
  }

  // Save the updated post
  await post.save();

  // Return success response
  res.status(200).json(new ApiResponse(200, post, "Post updated successfully"));
});


const deletePost = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);

  if (!post || post.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "Unauthorized or Post not found");
  }

  if (post.featuredImg) {
    const publicId = post.featuredImg.split("/").pop().split(".")[0];
    await deleteFromCloudinary(publicId);
  }

  await Post.findByIdAndDelete(req.params.id);
  res.status(200).json(new ApiResponse(200, {}, "Post deleted successfully"));
});

const togglePublishStatus = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);

  if (!post || post.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "Unauthorized or Post not found");
  }

  post.isPublished = !post.isPublished;
  await post.save();
  res.status(200).json(new ApiResponse(200, { isPublished: post.isPublished }, "Publish status toggled"));
});

const getPostById = asyncHandler(async(req, res) => {
  const {id} = req.params;
  if(!isValidObjectId(id)){
    throw new ApiError(400, "Invalid post ID");
  }
  const post = await Post.findById(id)
   .select("title content featuredImg tags isPublished createdAt")
   .populate("owner", "username email");
   if(!post){
     throw new ApiError(404, "Post not found");
   }
   res.status(200).json(new ApiResponse(200, post, "Post fetched successfully"));
})

export { getAllPosts, getMyPosts, addPost, editPost, deletePost,getPostById, togglePublishStatus };
