import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMyPosts, deletePost } from "../../../store/postSlice";
import { Link, useParams, useNavigate } from "react-router-dom";
import Button from "../../../components/ui/Button";
import EmptyState from "../../../components/ui/EmptyState";
import Skeleton from "../../../components/ui/Skeleton";

export default function MyPosts() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userId } = useParams();
  const { loading, error } = useSelector((state) => state.post);
  const posts = useSelector((state) => state.post.myPosts);

  useEffect(() => {
    if (!userId) {
      navigate("/login");
    } else {
      dispatch(fetchMyPosts(userId));
    }
  }, [dispatch, userId, navigate]);

  const handleDelete = (postId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this article?");
    if (confirmDelete) {
      dispatch(deletePost(postId))
        .unwrap()
        .then(() => {
          alert("Article deleted successfully!");
        })
        .catch((err) => {
          console.error("Failed to delete post:", err);
          alert("An error occurred while deleting the article.");
        });
    }
  };

  const userPosts = posts?.filter((post) => post.owner === userId) || [];

  return (
    <div className="w-full py-8">
      <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-8">
        <h1 className="text-3xl font-extrabold text-white tracking-wide">My Articles</h1>
        <Link to="/add-post">
          <Button variant="primary">
            <i className="fas fa-plus mr-2 text-xs"></i> Write Article
          </Button>
        </Link>
      </div>

      {error && (
        <div className="text-center py-12">
          <p className="text-red-400 font-medium mb-4">Error loading articles: {error}</p>
          <button
            onClick={() => dispatch(fetchMyPosts(userId))}
            className="px-5 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium transition"
          >
            Try Again
          </button>
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <Skeleton count={3} className="h-[360px]" />
        </div>
      ) : userPosts.length === 0 ? (
        <EmptyState
          title="No articles written yet"
          description="Write code insights, notes or blogs and share them with the developer community."
          actionText="Create my first article"
          actionLink="/add-post"
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {userPosts.map((post) => (
            <div
              key={post._id}
              className="group relative flex flex-col rounded-2xl glass-effect border border-white/5 overflow-hidden transition-all duration-300 hover:border-white/10 hover:shadow-xl hover:shadow-purple-500/5"
            >
              <img
                src={post?.featuredImg || "https://via.placeholder.com/800x400"}
                alt={post.title}
                className="w-full h-48 object-cover group-hover:scale-102 transition-transform duration-500"
              />
              <div className="p-5 flex flex-col flex-1">
                <h3 className="text-lg font-bold text-white mb-2 line-clamp-1 group-hover:text-purple-400 transition-colors">
                  {post.title}
                </h3>
                <span className="text-xs text-gray-500 mb-4">
                  Created on {new Date(post.createdAt).toLocaleDateString()}
                </span>

                <div className="flex items-center justify-between border-t border-white/5 pt-4 mt-auto">
                  <Link
                    to={`/${post._id}`}
                    className="text-xs font-semibold text-indigo-400 hover:underline"
                  >
                    Read
                  </Link>
                  <div className="flex space-x-3">
                    <Link
                      to={`/edit-post/${post?._id}`}
                      className="text-xs text-purple-400 hover:text-purple-300 flex items-center"
                    >
                      <i className="fas fa-edit mr-1 text-2xs"></i> Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(post._id)}
                      className="text-xs text-red-400 hover:text-red-300 flex items-center"
                    >
                      <i className="fas fa-trash-alt mr-1 text-2xs"></i> Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
