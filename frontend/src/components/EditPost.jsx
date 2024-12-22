import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPostById, editPost } from "../store/postSlice"; // Adjust paths as necessary
import { useNavigate, useParams } from "react-router-dom";

const EditPost = () => {
  const { id } = useParams(); // Get postId from route
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
  //console.log("id",id);
  

  useEffect(() => {
    // Fetch the post data if it's not already loaded
    if (id) {
      dispatch(fetchPostById(id));
    }
  }, [dispatch, id]);

  useEffect(() => {
    // Prepopulate form fields when post data is available
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

    setFormError(""); // Clear previous errors
    setSubmitting(true);

    // Create a postData object instead of using FormData
    const postData = {
      title,
      content,
      tags: tags.split(",").map((tag) => tag.trim()),
      isPublished,
    };

    try {
      // Dispatch editPost action with the postData
      await dispatch(editPost({ id, postData })).unwrap();
      navigate(`/${id}`); // Navigate to the post's detail page
    } catch (err) {
      //console.error(err);
      setFormError("Failed to update the post.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleTogglePublish = () => {
    setIsPublished((prevState) => !prevState);
  };

  // Loading, error, or empty post handling
  if (loading) {
    return <div>Loading post...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!post) {
    return <div>No post found.</div>; // If the post doesn't exist or failed to load
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-3xl font-semibold text-center text-gray-800 mb-6">
        Edit Post
      </h1>
      <form onSubmit={handleSubmit}>
        {formError && <div className="mb-4 text-red-500">{formError}</div>}

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
          <label htmlFor="publish-status" className="block text-lg font-semibold text-gray-700">
            Publish Status
          </label>
          <button
            type="button"
            className={`w-full p-3 border border-gray-300 rounded-md mt-2 ${isPublished ? "bg-green-500 text-white" : "bg-gray-500 text-white"}`}
            onClick={handleTogglePublish}
          >
            {isPublished ? "Unpublish" : "Publish"}
          </button>
        </div>

        <div className="mb-6">
          <button
            type="submit"
            disabled={loading || submitting}
            className={`w-full p-3 text-white rounded-md ${loading || submitting ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-600"}`}
          >
            {loading || submitting ? "Updating..." : "Update Post"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditPost;
