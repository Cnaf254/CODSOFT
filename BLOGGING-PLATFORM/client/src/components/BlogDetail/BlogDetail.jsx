import React, { useState, useEffect, useContext } from "react";
import { useLocation } from "react-router-dom";
import { userProvider } from "../../Context/UserProvider";
import axios from "../axios";

function BlogDetail() {
  const location = useLocation();
  const { postId } = location.state || {};
  const [post, setPost] = useState({});
  const [comments, setComments] = useState([]);
  const [user] = useContext(userProvider);
  const [comment, setComment] = useState("");
  const token = localStorage.getItem("token");

  useEffect(() => {
    async function fetchPostData() {
      try {
        const [postResult, commentsResult] = await Promise.all([
          axios.get("/posts/singlepost", {
            params: { post_id: postId },
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("/comments/all_comments", {
            params: { post_id: postId },
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);
        setPost(postResult.data.data);
        setComments(commentsResult.data.comments);
      } catch (error) {
        console.error("Error fetching post or comments:", error);
      }
    }
    fetchPostData();
  }, [postId]);

  const handleInputChange = (e) => setComment(e.target.value);

  async function postComment(e) {
    e.preventDefault();
    try {
      await axios.post(
        "/comments/comment",
        { post_id: postId, user_id: user.userId, content: comment },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setComments([{ content: comment, user_id: user.userId }, ...comments]);
      setComment("");
    } catch (error) {
      console.error("Error posting comment:", error);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      {/* Main Wrapper */}
      <div className="max-w-4xl mx-auto">
        {/* Post Content */}
        <div className="bg-gray-100 rounded-lg shadow-md p-6 mb-8">
          <img
            src={post.image_file || "https://via.placeholder.com/200"}
            alt={post.title || "Post Image"}
            className="w-full max-h-48 object-cover rounded-md mb-4"
          />
          <h1 className="text-2xl font-semibold text-gray-800 mb-3">{post.title}</h1>
          <div className="text-sm text-gray-600 mb-6">
            <span>By {post.username || "Unknown Author"}</span>
            <span className="mx-2">•</span>
            <span>{post.views || 0} Views</span>
          </div>
          <p className="text-gray-700 leading-relaxed">{post.content}</p>
        </div>

        {/* Comment Form */}
        <div className="bg-gray-100 rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Leave a Comment</h2>
          <form
            onSubmit={postComment}
            className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4"
          >
            <input
              type="text"
              value={comment}
              onChange={handleInputChange}
              placeholder="Write a comment..."
              className="flex-1 p-3 bg-gray-200 text-gray-800 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="px-5 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none"
            >
              Submit
            </button>
          </form>
        </div>

        {/* Comments Section */}
        <div className="bg-gray-100 rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Comments</h2>
          {comments.length > 0 ? (
            <div className="space-y-4">
              {comments.map((comment, index) => (
                <div
                  key={index}
                  className="bg-gray-200 p-4 rounded-md shadow-sm text-gray-700"
                >
                  <p>{comment.content}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600">No comments yet. Be the first to comment!</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default BlogDetail;
