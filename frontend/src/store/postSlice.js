import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../helper/axiosInstance";


// Async Thunks

// Fetch All Posts
export const fetchPosts = createAsyncThunk(
  "posts/fetchPosts",
  async ({ page, limit }, { rejectWithValue }) => {
    try {
      const response = await API.get("/home", { params: { page, limit } });
     // console.log("Fetching posts:", response.data);

      // Ensure that response.data.message is an array of posts
      if (Array.isArray(response.data.message)) {
        return response.data.message;
      } else {
        return rejectWithValue("Invalid response format");
      }
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
      //console.log("Fetching posts:", response.data);
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
      //console.log("Updated post", response.data.message);
      
      return response.data.message; // Assuming this is the updated post object
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
    currentPage: 1,
    hasMore: true,
    loading: false,
    error: null,
  },
  reducers: {
    resetPosts(state) {
      state.posts = [];
      state.currentPage = 1;
      state.hasMore = true;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch All Posts
      .addCase(fetchPosts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.loading = false;
       // console.log("Response from API:", action.payload);

        // Check for duplicates before adding new posts
        const existingPosts = state.posts.map(post => post._id); // Array of existing post IDs
        const newPosts = action.payload.filter(newPost => 
          !existingPosts.includes(newPost._id) // Check if new post ID is not in existing posts
        );

        //console.log('existing posts:', existingPosts);
        //console.log('new posts:', newPosts); // Log new posts to verify the filtering

        // Add the new posts (that are not duplicates)
        state.posts = [...state.posts, ...newPosts];

        // Check if there are more posts to load
        state.hasMore = action.payload.length > 0;
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch posts";
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
        state.posts.unshift(payload); // Add the new post to the beginning
      })

      // Edit Post
      .addCase(editPost.fulfilled, (state, { payload }) => {
        state.posts = state.posts.map((post) =>
          post._id === payload._id ? payload : post
        );
        state.currentPost = payload; // Update currentPost with the updated post
      })

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

export const { resetPosts } = postSlice.actions;

export default postSlice.reducer;
