import React, { useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPosts, resetPosts } from "../../../store/postSlice";
import { Link } from "react-router-dom";
import Skeleton from "../../../components/ui/Skeleton";
import EmptyState from "../../../components/ui/EmptyState";

export default function Home() {
  const dispatch = useDispatch();
  const { posts, loading, currentPage, hasMore, error } = useSelector((state) => state.post);

  const loadMorePosts = useCallback(() => {
    if (!loading && hasMore) {
      dispatch(fetchPosts({ page: currentPage + 1, limit: 10 }));
    }
  }, [dispatch, loading, hasMore, currentPage]);

  useEffect(() => {
    dispatch(resetPosts());
    dispatch(fetchPosts({ page: 1, limit: 10 }));
  }, [dispatch]);

  const handleScroll = useCallback(() => {
    if (
      window.innerHeight + document.documentElement.scrollTop >=
        document.documentElement.offsetHeight - 80 &&
      !loading
    ) {
      loadMorePosts();
    }
  }, [loadMorePosts, loading]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  // Strip HTML function to calculate reading time and show clean preview
  const stripHtml = (html) => {
    const tmp = document.createElement("DIV");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
  };

  return (
    <div className="w-full">
      {/* Premium Hero Banner */}
      <section className="text-center py-20 md:py-32 max-w-3xl mx-auto flex flex-col items-center">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-semibold mb-6 uppercase tracking-wider">
          <i className="fas fa-sparkles mr-1"></i> Welcome to the Future of Blogging
        </div>
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white mb-6 leading-tight">
          Discover stories, code, and <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">creative ideas.</span>
        </h1>
        <p className="text-gray-400 text-lg md:text-xl leading-relaxed max-w-xl">
          A premium space designed for developers, designers, and creators to share modular thoughts.
        </p>
      </section>

      {/* Main Feed Header */}
      <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-8">
        <h2 className="text-2xl font-bold text-white tracking-wide">Latest Articles</h2>
        <span className="text-xs text-gray-500">{posts.length} articles found</span>
      </div>

      {/* Error state */}
      {error && (
        <div className="text-center py-12">
          <p className="text-red-400 font-medium mb-4">Error loading feed: {error}</p>
          <button
            onClick={() => dispatch(fetchPosts({ page: 1, limit: 10 }))}
            className="px-5 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium transition"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Posts Grid */}
      {!error && posts.length === 0 && !loading ? (
        <EmptyState
          title="No articles posted"
          description="It looks like there are no published posts yet. Be the first to write something!"
          actionText="Create an article"
          actionLink="/add-post"
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => {
            const cleanContent = stripHtml(post.content || "");
            const wordCount = cleanContent.split(/\s+/).filter(Boolean).length;
            const readTime = Math.max(1, Math.ceil(wordCount / 200));

            return (
              <article
                key={post._id}
                className="group relative flex flex-col rounded-2xl glass-effect border border-white/5 overflow-hidden transition-all duration-300 hover:border-white/10 hover:shadow-xl hover:shadow-purple-500/5 hover:-translate-y-1"
              >
                {/* Image Cover */}
                <div className="h-52 w-full overflow-hidden relative">
                  <img
                    src={post.featuredImg || "https://via.placeholder.com/800x400"}
                    alt={post.title}
                    className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 text-xs font-semibold uppercase tracking-wider bg-black/60 backdrop-blur-md text-purple-300 rounded-full border border-white/5">
                      {readTime} min read
                    </span>
                  </div>
                </div>

                {/* Article Info */}
                <div className="p-6 flex flex-col flex-1">
                  <div className="flex items-center space-x-2 text-xs text-gray-500 mb-3">
                    <span>By {post.ownerDetails?.username || "Unknown"}</span>
                    <span>•</span>
                    <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                  </div>

                  <h3 className="text-xl font-bold text-white mb-2 line-clamp-2 group-hover:text-purple-400 transition-colors duration-300">
                    {post.title}
                  </h3>

                  <p className="text-gray-400 text-sm leading-relaxed mb-6 line-clamp-3">
                    {cleanContent || "No preview text available."}
                  </p>

                  <div className="mt-auto pt-4 border-t border-white/5 flex items-center justify-between">
                    <Link
                      to={`/${post._id}`}
                      className="text-sm font-semibold text-indigo-400 hover:text-indigo-300 flex items-center group/link"
                    >
                      Read full article
                      <i className="fas fa-arrow-right ml-2 text-xs transform group-hover/link:translate-x-1 transition-transform"></i>
                    </Link>
                  </div>
                </div>
              </article>
            );
          })}

          {/* Loading Skeletons */}
          {loading && (
            <Skeleton count={3} className="h-[420px]" />
          )}
        </div>
      )}

      {/* End of Feed Message */}
      {!hasMore && !loading && posts.length > 0 && (
        <div className="text-center py-16 text-gray-500 text-sm">
          <i className="fas fa-check-circle mr-2 text-indigo-500/50"></i> You've caught up with all posts.
        </div>
      )}
    </div>
  );
}
