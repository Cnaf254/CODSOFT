import React, { useState, useEffect, useContext } from "react";
import { userProvider } from "../../Context/UserProvider";
import axios from "../axios";

export default function MyProfile() {
  const [user, setUser] = useContext(userProvider);
  const [posts, setPosts] = useState([]);
  const [editingUser, setEditingUser] = useState(false);
  const [updatedUserName, setUpdatedUserName] = useState(user.userName);
  const [editingPost, setEditingPost] = useState(null); // Track the post being edited
  const token = localStorage.getItem("token");

  useEffect(() => {
    async function fetchUserPosts() {
      try {
        const result = await axios.get("/posts/user_posts", {
          params: { user_id: user.userId },
          headers: { Authorization: `Bearer ${token}` },
        });
        setPosts(result.data.posts);
      } catch (error) {
        console.error("Error fetching user posts:", error);
      }
    }
    fetchUserPosts();
  }, [user.userId]);

  async function handleDeletePost(postId) {
    try {
      await axios.delete(`/posts/delete`, {
        params: { postId },
        headers: { Authorization: `Bearer ${token}` },
      });
      setPosts((prevPosts) => prevPosts.filter((post) => post.post_id !== postId));
      alert("Post deleted successfully!");
    } catch (error) {
      console.error("Error deleting post:", error.response?.data?.msg || error.message);
    }
  }

  async function handleUserNameUpdate(e) {
    e.preventDefault();
    try {
      const result = await axios.put(
        `/users/userupdate`,
        { user_id: user.userId, user_name: updatedUserName },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUser((prev) => ({ ...prev, userName: result.data.userName }));
      setEditingUser(false);
      alert("Username updated successfully!");
    } catch (error) {
      console.error("Error updating username:", error);
    }
  }

  async function handleEditPostSubmit(e) {
    e.preventDefault();

    try {
      const result = await axios.put(
        "/posts/update",
        {
          post_id: editingPost.post_id,
          title: editingPost.title,
          content: editingPost.content,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.post_id === result.data.post_id ? result.data : post
        )
      );
      setEditingPost(null); // Close edit form
      alert("Post updated successfully!");
    } catch (error) {
      console.error("Error updating post:", error);
      alert("Failed to update post.");
    }
  }

  return (
    <div className="bg-gray-50 min-h-screen p-6">
      {/* Profile Section */}
      <div className="max-w-5xl mx-auto bg-white shadow-lg rounded-lg p-6 mb-8">
        <div className="flex flex-col items-center">
          <img
            src={user.profilePicture || "https://via.placeholder.com/150"}
            alt="Profile"
            className="w-32 h-32 rounded-full border-4 border-blue-500 shadow-lg mb-4"
          />
          {editingUser ? (
            <form onSubmit={handleUserNameUpdate} className="flex flex-col items-center">
              <input
                type="text"
                value={updatedUserName}
                onChange={(e) => setUpdatedUserName(e.target.value)}
                className="border p-2 rounded mb-2"
                placeholder="Enter new username"
              />
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Save
              </button>
            </form>
          ) : (
            <>
              <h1 className="text-2xl font-semibold text-gray-800">{user.userName}</h1>
              <button
                onClick={() => setEditingUser(true)}
                className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Edit Username
              </button>
            </>
          )}
        </div>
      </div>

      {/* Posts Section */}
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">My Posts ({posts.length})</h2>
        <div className="grid grid-cols-1 gap-6">
          {posts.map((post) =>
            editingPost?.post_id === post.post_id ? (
              // Edit Form for the Selected Post
              <form
                key={post.post_id}
                onSubmit={handleEditPostSubmit}
                className="bg-white border border-gray-300 rounded-lg shadow-lg p-4"
              >
                <div className="flex flex-col space-y-4">
                  <input
                    type="text"
                    value={editingPost.title}
                    onChange={(e) =>
                      setEditingPost((prev) => ({ ...prev, title: e.target.value }))
                    }
                    className="border p-2 rounded"
                    placeholder="Title"
                  />
                  <textarea
                    value={editingPost.content}
                    onChange={(e) =>
                      setEditingPost((prev) => ({ ...prev, content: e.target.value }))
                    }
                    className="border p-2 rounded h-24"
                    placeholder="Content"
                  />
                  <div className="flex justify-end space-x-4">
                    <button
                      type="button"
                      onClick={() => setEditingPost(null)}
                      className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                      Save
                    </button>
                  </div>
                </div>
              </form>
            ) : (
              // Default Post Card
              <div
                key={post.post_id}
                className="bg-white border border-gray-300 rounded-lg shadow-lg p-4 cursor-pointer hover:shadow-xl transition"
              >
                <div className="flex items-start">
                  {/* Image section on the left */}
                  <img
                    src={post.image_file}
                    alt={post.image_name || post.title}
                    className="w-16 h-16 object-cover rounded-md mr-4"
                  />
                  <div className="flex flex-col w-full">
                    {/* Title in bold */}
                    <h3 className="text-xl font-bold text-gray-800">{post.title}</h3>
                    {/* Author, Date, and Views in the same line */}
                    <div className="flex items-center text-sm text-gray-600 mt-2">
                      <span className="font-bold">{user.userName}</span>
                      <span className="mx-2">•</span>
                      <span className="font-bold">
                        {new Date(post.created_at).toLocaleDateString()}
                      </span>
                      <span className="mx-2">•</span>
                      <span className="font-bold">{post.views} views</span>
                    </div>
                    {/* Post content */}
                    <p className="text-gray-700 mt-2 text-sm">{post.content.slice(0, 100)}...</p>
                    {/* Edit/Delete buttons */}
                    <div className="flex justify-between items-center mt-4">
                      <button
                        onClick={() => setEditingPost(post)}
                        className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeletePost(post.post_id)}
                        className="px-4 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}
