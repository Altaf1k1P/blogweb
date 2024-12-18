import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMyPosts, deletePost } from "../store/postSlice"; // Update with correct path
import { Link, useParams, useNavigate } from "react-router-dom";

const MyPosts = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userId } = useParams(); // User ID from route params
  const { loading, error } = useSelector((state) => state.post);
  const posts  = useSelector((state) => state.post.myPosts); // Assuming posts are in post slice
  const { user } = useSelector((state) => state.auth); // Assuming current user info is in auth slice

  //console.log("user",user, posts);

  
  // Fetch user's posts on component mount
  useEffect(() => {
    if (!userId) {
      navigate("/login"); // Redirect to login if userId is missing
    } else {
      dispatch(fetchMyPosts(userId));
    }
  }, [dispatch, userId, navigate]);

  // Handle post deletion
  const handleDelete = (postId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this post?");
    if (confirmDelete) {
      dispatch(deletePost(postId))
        .unwrap()
        .then(() => {
          alert("Post deleted successfully!");
        })
        .catch((err) => {
          console.error("Failed to delete post:", err);
          alert("An error occurred while deleting the post.");
        });
    }
  };
  

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500"></div>
        <span className="ml-3 text-gray-500 text-lg">Loading posts...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center mt-20 text-red-500">
        <p className="text-lg">Error: {error.message || "Something went wrong"}</p>
        <button
          onClick={() => dispatch(fetchMyPosts(userId))}
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Retry
        </button>
      </div>
    );
  }

  // Filter posts to ensure they belong to the current user
  const userPosts = posts?.filter((post) => post.owner === userId) || [];
  //console.log('my', userPosts);
  

  return (
    <div className="container bg-white mx-auto px-4 my-12">
      <h1 className="text-4xl font-bold text-center text-gray-800 mb-12">My Posts</h1>

      {userPosts.length === 0 ? (
        <div className="text-center">
          <p className="text-lg text-gray-600">You haven't created any posts yet.</p>
          <Link
            to="/add-post"
            className="mt-4 inline-block bg-blue-500 text-white px-5 py-2 rounded hover:bg-blue-600 transition"
          >
            Create a New Post
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {userPosts.map((post) => (
            <div
              key={post._id}
              className="bg-white border border-gray-200 rounded-lg shadow-md hover:shadow-lg transition-transform transform hover:scale-105"
            >
              <img
                src={post?.featuredImg || "https://via.placeholder.com/400x225"}
                alt={post.title}
                className="w-full h-[225px] object-cover"
              />
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-800 truncate">{post.title}</h3>
                <p className="text-sm text-gray-500 mt-2">
                  {post.content ? post.content.slice(0, 100) : "No content available..."}
                </p>
                <p className="text-xs text-gray-500 mt-4">
                  Posted on: {new Date(post.createdAt).toLocaleDateString()}
                </p>

                {/* Edit and Delete Buttons */}
                <div className="flex justify-between items-center mt-4">
                  <Link
                    to={`/edit-post/${post?._id}`}
                    className="text-sm text-blue-600 hover:underline"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(post._id)}
                    className="text-sm text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                </div>

                {/* Read More */}
                <Link
                  to={`/${post._id}`}
                  className="block mt-4 text-blue-600 hover:underline font-medium"
                >
                  Read More
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyPosts;
