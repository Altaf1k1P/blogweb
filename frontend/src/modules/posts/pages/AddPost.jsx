import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addPost } from "../../../store/postSlice";
import { useNavigate } from "react-router-dom";
import Input from "../../../components/ui/Input";
import Button from "../../../components/ui/Button";

export default function AddPost() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, error } = useSelector((state) => state.post);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  const [featuredImg, setFeaturedImg] = useState(null);
  const [featuredImgPreview, setFeaturedImgPreview] = useState(null);
  const [isPublished, setIsPublished] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;

    setSubmitting(true);

    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    formData.append("tags", tags);
    formData.append("isPublished", isPublished);
    if (featuredImg) {
      formData.append("featuredImg", featuredImg);
    }

    try {
      await dispatch(addPost(formData)).unwrap();
      navigate("/");
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFeaturedImg(file);
      setFeaturedImgPreview(URL.createObjectURL(file));
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-8 glass-effect rounded-2xl border border-white/5 shadow-2xl">
      <h1 className="text-3xl font-extrabold text-white text-center mb-8">
        Create New Article
      </h1>
      
      {error && (
        <div className="p-4 mb-6 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <Input
          label="Title"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          placeholder="Enter a catchy title..."
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
            placeholder="Write your article contents here..."
            className="w-full px-4 py-3 rounded-lg glass-effect text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 border border-white/5 hover:border-white/10 transition-all duration-300"
          />
        </div>

        <Input
          label="Tags"
          id="tags"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          placeholder="e.g. tech, code, tutorial (comma separated)"
        />

        {/* Custom Upload Area */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2 pl-1">
            Featured Image
          </label>
          <div className="flex flex-col items-center justify-center border border-dashed border-white/10 hover:border-white/20 rounded-xl p-6 transition-all duration-300 bg-white/2">
            {featuredImgPreview ? (
              <div className="relative w-full h-44 rounded-lg overflow-hidden">
                <img
                  src={featuredImgPreview}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => {
                    setFeaturedImg(null);
                    setFeaturedImgPreview(null);
                  }}
                  className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white rounded-full p-2 text-xs transition"
                >
                  <i className="fas fa-trash"></i>
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center cursor-pointer w-full">
                <i className="fas fa-cloud-upload-alt text-3xl text-gray-500 mb-2"></i>
                <span className="text-sm text-gray-400">Click to upload featured image</span>
                <span className="text-xs text-gray-600 mt-1">Supported formats: JPEG, PNG, WEBP</span>
                <input
                  type="file"
                  id="featuredImg"
                  onChange={handleFileChange}
                  className="hidden"
                  accept="image/*"
                  required
                />
              </label>
            )}
          </div>
        </div>

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

        <Button
          type="submit"
          disabled={loading || submitting}
          className="w-full py-3"
        >
          {loading || submitting ? (
            <>
              <i className="fas fa-spinner animate-spin mr-2"></i> Creating article...
            </>
          ) : (
            "Add Article"
          )}
        </Button>
      </form>
    </div>
  );
}
