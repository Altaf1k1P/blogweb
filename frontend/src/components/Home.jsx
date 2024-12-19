import React, { useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPosts, resetPosts } from "../store/postSlice"; // Import resetPosts action
import { Link } from "react-router-dom";
import Skeleton from "react-loading-skeleton";

const Home = () => {
  const dispatch = useDispatch();
  const { posts, loading, currentPage, hasMore, error } = useSelector((state) => state.post);

  // Load more posts when user scrolls to the bottom of the page
  const loadMorePosts = useCallback(() => {
    if (!loading && hasMore) {
      dispatch(fetchPosts({ page: currentPage, limit: 10 })); // Load next page
    }
  }, [dispatch, loading, hasMore, currentPage]);

  useEffect(() => {
    // Reset posts state when the component mounts to ensure a fresh load
    dispatch(resetPosts());
    dispatch(fetchPosts({ page: 1, limit: 10 }));

    return () => {
      // Optionally reset posts when the component unmounts
      dispatch(resetPosts());
    };
  }, [dispatch]);

  const handleScroll = () => {
    if (
      window.innerHeight + document.documentElement.scrollTop >=
        document.documentElement.offsetHeight - 50 &&
      !loading
    ) {
      loadMorePosts();
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  if (error) {
    return (
      <div className="text-center text-red-500 mt-6">
        <p>Error: {error}</p>
        <button onClick={() => dispatch(fetchPosts({ page: 1, limit: 10 }))} className="text-blue-500 underline mt-2">
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="container bg-white mx-auto my-8 px-4">
      <h1 className="text-3xl font-bold text-center text-gray-800 my-20 pt-4">All Posts</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {posts.map((post) => (
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
              <h3 className="text-xl font-semibold text-gray-800 truncate">{post.title}</h3>
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

        {loading &&
          Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="bg-white shadow-lg rounded-lg border border-gray-300 overflow-hidden">
              <Skeleton height={225} />
              <div className="p-4">
                <Skeleton width="70%" height={20} className="mb-2" />
                <Skeleton count={2} height={15} />
              </div>
            </div>
          ))}

      </div>

      {/* Display "No More Posts" message */}
      {!hasMore && !loading && posts.length > 0 && (
        <div className="text-center mt-6">
          <p className="text-gray-500">No more posts to load.</p>
        </div>
      )}
    </div>
  );
};

export default Home;
