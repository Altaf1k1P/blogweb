import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, Link } from "react-router-dom";
import { fetchPostById } from "../../../store/postSlice";
import useCopyClipboard from "../../../hooks/useCopyClipboard";
import parse from "html-react-parser";

export default function PostDetails() {
  const dispatch = useDispatch();
  const { id } = useParams();
  const { currentPost: post, loading, error } = useSelector((state) => state.post);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isCopied, copy] = useCopyClipboard();

  // Scroll listener for reading progress
  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (totalScroll > 0) {
        const progress = (window.pageYOffset / totalScroll) * 100;
        setScrollProgress(progress);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    dispatch(fetchPostById(id));
  }, [dispatch, id]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-indigo-500"></div>
        <p className="text-gray-400 mt-4 text-sm">Fetching article details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20 text-red-500">
        <i className="fas fa-exclamation-circle text-4xl mb-4"></i>
        <p className="text-lg font-semibold">Error: {error}</p>
        <Link to="/" className="text-indigo-400 underline mt-4 block">
          Return to Feed
        </Link>
      </div>
    );
  }

  // Calculate reading time
  const getReadingTime = (content) => {
    if (!content) return 1;
    const cleanText = content.replace(/<[^>]*>/g, ""); // Strip HTML
    const words = cleanText.trim().split(/\s+/).length;
    return Math.max(1, Math.ceil(words / 200));
  };

  const handleCopyLink = () => {
    copy(window.location.href);
  };

  // Share builders
  const encodedUrl = encodeURIComponent(window.location.href);
  const encodedTitle = encodeURIComponent(post?.title || "");
  const twitterShare = `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`;
  const linkedinShare = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
  const whatsappShare = `https://api.whatsapp.com/send?text=${encodedTitle}%20${encodedUrl}`;

  return (
    <div className="w-full relative">
      {/* Reading Progress Indicator */}
      <div
        className="fixed top-16 left-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 z-50 transition-all duration-100"
        style={{ width: `${scrollProgress}%` }}
      ></div>

      {post && (
        <article className="max-w-3xl mx-auto py-10">
          
          {/* Cover Photo */}
          <div className="w-full h-[320px] md:h-[480px] rounded-3xl overflow-hidden mb-10 border border-white/5 shadow-2xl relative">
            <img
              src={post.featuredImg || "https://via.placeholder.com/800x400"}
              alt={post.title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Heading Metadata */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center space-x-2 text-xs font-semibold uppercase tracking-wider text-purple-400 mb-4 bg-purple-500/10 border border-purple-500/20 px-3.5 py-1 rounded-full">
              <span>{getReadingTime(post.content)} min read</span>
            </div>
            
            <h1 className="text-3xl md:text-5xl font-extrabold text-white leading-tight mb-6">
              {post.title}
            </h1>

            <div className="flex items-center justify-center space-x-3 text-sm text-gray-400">
              <span className="font-medium text-white">{post.owner?.username || "Unknown Author"}</span>
              <span>•</span>
              <span>{new Date(post.createdAt).toLocaleDateString()}</span>
            </div>
          </div>

          {/* Shared Action Toolbar */}
          <div className="flex items-center justify-between border-y border-white/5 py-4 my-8">
            {/* Copy button */}
            <button
              onClick={handleCopyLink}
              className="text-xs font-semibold flex items-center space-x-2 py-1.5 px-3 rounded-lg glass-effect text-gray-300 hover:text-white transition-all duration-300"
              aria-label="Copy link to clipboard"
            >
              <i className={`fas ${isCopied ? "fa-check text-green-400" : "fa-link text-indigo-400"}`}></i>
              <span>{isCopied ? "Link Copied!" : "Copy Link"}</span>
            </button>

            {/* Social Share links */}
            <div className="flex items-center space-x-4">
              <span className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Share:</span>
              <a
                href={twitterShare}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="Share on Twitter"
              >
                <i className="fab fa-twitter text-sm"></i>
              </a>
              <a
                href={linkedinShare}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="Share on LinkedIn"
              >
                <i className="fab fa-linkedin-in text-sm"></i>
              </a>
              <a
                href={whatsappShare}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="Share on WhatsApp"
              >
                <i className="fab fa-whatsapp text-sm"></i>
              </a>
            </div>
          </div>

          {/* Article Contents */}
          <div className="prose prose-invert max-w-none text-gray-300 text-base md:text-lg leading-relaxed space-y-6">
            {post.content ? parse(post.content) : <p>No content in this post.</p>}
          </div>

          {/* Footer Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="mt-12 pt-6 border-t border-white/5 flex flex-wrap gap-2">
              {post.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 rounded-full text-xs bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 font-medium"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

        </article>
      )}
    </div>
  );
}
