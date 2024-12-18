import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { fetchPostById } from "../store/postSlice";

const PostDetails = () => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const { currentPost: post, loading, error } = useSelector((state) => state.post);

  useEffect(() => {
    dispatch(fetchPostById(id));
  }, [dispatch, id]);

  if (loading) {
    return <p className="text-center mt-8">Loading post details...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500 mt-8">Error: {error}</p>;
  }

  return (
    <div className="container min-h-full min-w-full text-white bg-black">
      {post && (
        <>
          {/* Image */}
          <div className="w-full p-10">
            <img
              src={post.featuredImg || "https://via.placeholder.com/800x400"}
              alt={post.title}
              className="w-full h-full object-cover rounded-lg"
            />
          </div>

          {/* Tag */}
          <p className="italic text-lg text-center text-gray-400 mb-4">{post.tags}</p>

          {/* Title */}
          <h1 className="text-5xl font-bold text-center mb-6 leading-tight">
            {post.title}
          </h1>

          {/* User and Date */}
          <p className="text-center text-gray-500 mb-8">
            Posted by:{" "}
            <span className="text-white font-medium">
              {post.owner?.username || "Unknown"}
            </span>{" "}
            on {new Date(post.createdAt).toLocaleDateString()}
          </p>

          {/* Description */}
          <div className="text-center text-lg leading-relaxed px-4 sm:px-16">
            <p>{post.content}</p>
          </div>
        </>
      )}
    </div>
  );
};

export default PostDetails;
