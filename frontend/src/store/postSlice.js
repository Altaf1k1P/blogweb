import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../helper/axiosInstance";

// Async Thunks

// Fetch All Posts
export const fetchAllPosts = createAsyncThunk(
  "posts/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await API.get("/home");
      return response.data.message.docs; // Ensure this is the expected array of posts
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch posts");
    }
  }
);

// Fetch User's Posts
export const fetchMyPosts = createAsyncThunk(
  "posts/fetchMyPosts",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await API.get(`/myposts/${userId}`);
      return response.data.message; // Assuming this is an array of posts
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch user posts");
    }
  }
);

// Fetch Single Post by ID
export const fetchPostById = createAsyncThunk(
  "posts/fetchPostById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await API.get(`/post/${id}`);
      //console.log("api response: " , response.data);
      
      return response.data.message; // Assuming this is a single post object
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch single post");
    }
  }
);

// Add a New Post
export const addPost = createAsyncThunk(
  "posts/add",
  async (postData, { rejectWithValue }) => {
    try {
      const response = await API.post("/add-post", postData);
      return response.data; // Assuming this is the created post object
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to add post");
    }
  }
);

// Edit a Post
export const editPost = createAsyncThunk(
  "posts/edit",
  async ({ id, postData }, { rejectWithValue }) => {
    try {
      const response = await API.patch(`/post/${id}`, postData);
      return response.data.message; // Return the updated post object
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to edit post");
    }
  }
);

// Delete a Post
export const deletePost = createAsyncThunk(
  "posts/delete",
  async (id, { rejectWithValue }) => {
    try {
      await API.delete(`/post/${id}`);
      return id; // Return the deleted post's ID
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to delete post");
    }
  }
);

// Toggle Publish Status
export const togglePublishStatus = createAsyncThunk(
  "posts/togglePublish",
  async (id, { rejectWithValue }) => {
    try {
      const response = await API.put(`/add-post/${id}/publish`);
      return response.data; // Assuming this is the updated post object
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to toggle publish status");
    }
  }
);

// Post Slice
const postSlice = createSlice({
  name: "posts",
  initialState: {
    posts: [],
    currentPost: null, // Separate state for a single post
    myPosts: [], // User's posts
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch All Posts
      .addCase(fetchAllPosts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllPosts.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.posts = payload;
      })
      .addCase(fetchAllPosts.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      })

      // Fetch User's Posts
      .addCase(fetchMyPosts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyPosts.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.myPosts = payload;
      })
      .addCase(fetchMyPosts.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      })

      // Fetch Post By ID
      .addCase(fetchPostById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPostById.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.currentPost = payload;
      })
      .addCase(fetchPostById.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      })

      // Add Post
      .addCase(addPost.fulfilled, (state, { payload }) => {
        state.posts.unshift(payload);
      })

      .addCase(editPost.fulfilled, (state, { payload }) => {
        state.posts = state.posts.map((post) =>
          post._id === payload._id ? payload : post
        );
        state.currentPost = payload; // Update currentPost with the updated post
      })

      // Delete Post
     // Delete Post
.addCase(deletePost.fulfilled, (state, { payload }) => {
  state.myPosts = state.myPosts.filter((post) => post._id !== payload);
  state.posts = state.posts.filter((post) => post._id !== payload); // Optional: Remove from all posts if needed
})


      // Toggle Publish Status
      .addCase(togglePublishStatus.fulfilled, (state, { payload }) => {
        state.posts = state.posts.map((post) =>
          post._id === payload._id ? payload : post
        );
      })

      // Handle Errors for All Rejected Cases
      .addMatcher(
        (action) => action.type.endsWith("/rejected"),
        (state, { payload }) => {
          state.loading = false;
          state.error = payload;
        }
      );
  },
});

export default postSlice.reducer;
