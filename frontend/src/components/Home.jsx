import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllPosts } from "../store/postSlice"; // Update with correct path
import { Link } from "react-router-dom";

const Home = () => {
  const dispatch = useDispatch();
  const { posts, loading, error } = useSelector((state) => state.post);
  //console.log("pst", posts);

  useEffect(() => {
    dispatch(fetchAllPosts()); // Fetch all posts
  }, [dispatch]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full text-blue-500"></div>
        <span className="ml-2 text-gray-500">Loading posts...</span>
      </div>
    );
  }

  if (error) {
    const errorMessage = typeof error === "string" ? error : error.message || "An unexpected error occurred.";
    return (
      <div className="text-center text-red-500 mt-6">
        <p>Error: {errorMessage}</p>
        <button onClick={() => dispatch(fetchAllPosts())} className="mt-2 text-blue-500 underline">
          Try Again
        </button>
      </div>
    );
  }

  const postsArray = posts || []; // Safely access docs array
  //console.log("arr", postsArray);

  return (
    <div className="container bg-white mx-auto my-8 px-4 " >
      <h1 className="text-3xl font-bold text-center text-gray-800 my-20 pt-4">All Posts</h1>

      {postsArray.length === 0 ? (
        <div className="text-center">
          <p className="text-gray-600">No posts available.</p>
          <Link to="/create-post" className="text-blue-500 underline mt-2 inline-block">
            Create a new post
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {postsArray.map((post) => (
            <div
              key={post._id}
              className="bg-white shadow-lg rounded-lg border border-gray-300 overflow-hidden transition-transform transform hover:scale-105 hover:shadow-xl group"
            >
              <img
                src={`${post?.featuredImg}?q_auto:low&w_800`}
                alt={post.title}
                className="h-[225px] w-full object-cover rounded-t-md"
                  loading="lazy"
              />
              <div className="p-4">
                <h3 className="text-xl font-semibold text-gray-800 truncate">
                  {post.title}
                </h3>
                <p className="text-sm text-gray-500 mt-2">
                  {post.content ? post.content.slice(0, 100) : "No content available"}...
                </p>
                <p className="text-sm text-gray-500 mt-4">
                  Posted by: {post.ownerDetails?.username || "Unknown"} on{" "}
                  {new Date(post.createdAt).toLocaleDateString()}
                </p>
                <Link to={`/${post._id}`} className="text-blue-500 underline mt-2 block">
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

export default Home;
