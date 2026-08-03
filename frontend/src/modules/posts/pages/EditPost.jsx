import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPostById, editPost } from "../../../store/postSlice";
import { useNavigate, useParams } from "react-router-dom";
import Input from "../../../components/ui/Input";
import Button from "../../../components/ui/Button";

export default function EditPost() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, error } = useSelector((state) => state.post);
  const post = useSelector((state) => state.post.currentPost);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  const [isPublished, setIsPublished] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  useEffect(() => {
    if (id) {
      dispatch(fetchPostById(id));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (post) {
      setTitle(post.title || "");
      setContent(post.content || "");
      setTags(post.tags?.join(", ") || "");
      setIsPublished(post.isPublished || false);
    }
  }, [post]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;

    if (!title || !content) {
      setFormError("Title and content are required.");
      return;
    }

    setFormError("");
    setSubmitting(true);

    const postData = {
      title,
      content,
      tags: tags.split(",").map((tag) => tag.trim()).filter(Boolean),
      isPublished,
    };

    try {
      await dispatch(editPost({ id, postData })).unwrap();
      navigate(`/${id}`);
    } catch (err) {
      setFormError("Failed to update the article.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-indigo-500"></div>
        <p className="text-gray-400 mt-4 text-xs">Loading article details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20 text-red-500">
        <i className="fas fa-exclamation-circle text-3xl mb-3"></i>
        <p className="font-semibold">Error: {error}</p>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="text-center py-20 text-gray-500">
        <p>No article found.</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-8 glass-effect rounded-2xl border border-white/5 shadow-2xl">
      <h1 className="text-3xl font-extrabold text-white text-center mb-8">
        Edit Article
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {formError && (
          <div className="p-4 mb-6 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">
            {formError}
          </div>
        )}

        <Input
          label="Title"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <div>
          <label htmlFor="content" className="block text-sm font-medium text-gray-300 mb-1.5 pl-1">
            Content
          </label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            rows={8}
            className="w-full px-4 py-3 rounded-lg glass-effect text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 border border-white/5 hover:border-white/10 transition-all duration-300"
          />
        </div>

        <Input
          label="Tags"
          id="tags"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          placeholder="Comma separated"
        />

        {/* Publish Status Toggle */}
        <div className="flex items-center justify-between p-4 glass-effect rounded-xl border border-white/5">
          <div>
            <span className="text-sm font-medium text-white block">Publish Article</span>
            <span className="text-xs text-gray-500">Allow other users to read this post immediately</span>
          </div>
          <button
            type="button"
            onClick={() => setIsPublished((prev) => !prev)}
            className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
              isPublished ? "bg-purple-600" : "bg-gray-700"
            }`}
          >
            <span
              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                isPublished ? "translate-x-5" : "translate-x-0"
              }`}
            />
          </button>
        </div>

        <div className="flex space-x-4 pt-4">
          <Button
            type="button"
            variant="secondary"
            onClick={() => navigate(-1)}
            className="flex-1 py-3"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={submitting}
            className="flex-1 py-3"
          >
            {submitting ? (
              <>
                <i className="fas fa-spinner animate-spin mr-2"></i> Saving...
              </>
            ) : (
              "Save Changes"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
