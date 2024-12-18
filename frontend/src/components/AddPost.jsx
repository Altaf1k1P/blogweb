import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addPost } from "../store/postSlice";
import { useNavigate } from "react-router-dom";

const AddPost = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const postState = useSelector((state) => state.post);
  //console.log(postState);

  const { loading, error } = postState;

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  const [featuredImg, setFeaturedImg] = useState(null);
  const [isPublished, setIsPublished] = useState(false);
  const [submitting, setSubmitting] = useState(false); // Local state to prevent multiple submissions

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prevent form resubmission if already submitting
    if (submitting) return;

    setSubmitting(true); // Set submitting to true to lock form

    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    formData.append("tags", tags);
    formData.append("isPublished", isPublished);
    if (featuredImg) {
      formData.append("featuredImg", featuredImg);
    }

    try {
      await dispatch(addPost(formData)).unwrap(); // Using .unwrap() ensures you wait for promise resolution
      navigate("/"); // Navigate after successful post addition
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false); // Reset submitting state after success or failure
    }
  };

  const handleTogglePublish = () => {
    setIsPublished((prevState) => !prevState);
  };

  const handleFileChange = (e) => {
    setFeaturedImg(e.target.files[0]);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-3xl font-semibold text-center text-gray-800 mb-6">
        Add New Post
      </h1>
      {error && <p className="text-red-500 text-center mb-4">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <label htmlFor="title" className="block text-lg font-semibold text-gray-700">
            Title
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full p-3 border border-gray-300 rounded-md mt-2"
          />
        </div>

        <div className="mb-6">
          <label htmlFor="content" className="block text-lg font-semibold text-gray-700">
            Content
          </label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            className="w-full p-3 border border-gray-300 rounded-md mt-2"
          />
        </div>

        <div className="mb-6">
          <label htmlFor="tags" className="block text-lg font-semibold text-gray-700">
            Tags
          </label>
          <input
            type="text"
            id="tags"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="Comma separated"
            className="w-full p-3 border border-gray-300 rounded-md mt-2"
          />
        </div>

        <div className="mb-6">
          <label htmlFor="featuredImg" className="block text-lg font-semibold text-gray-700">
            Featured Image
          </label>
          <input
            type="file"
            id="featuredImg"
            onChange={handleFileChange}
            className="w-full p-3 border border-gray-300 rounded-md mt-2"
          />
        </div>

        <div className="mb-6">
          <label htmlFor="publish-status" className="block text-lg font-semibold text-gray-700">
            Publish Status
          </label>
          <button
            type="button"
            className={`w-full p-3 border border-gray-300 rounded-md mt-2 ${
              isPublished ? "bg-green-500 text-white" : "bg-gray-500 text-white"
            }`}
            onClick={handleTogglePublish}
          >
            {isPublished ? "Unpublish" : "Publish"}
          </button>
        </div>

        <div className="mb-6">
          <button
            type="submit"
            disabled={loading || submitting}
            className={`w-full p-3 text-white rounded-md ${
              loading || submitting ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-600"
            }`}
          >
            {loading || submitting ? "Adding..." : "Add Post"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddPost;
