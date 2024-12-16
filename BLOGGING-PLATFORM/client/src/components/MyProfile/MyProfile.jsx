import React, { useState, useEffect, useContext } from "react";
import { userProvider } from "../../Context/UserProvider";
import { Link } from "react-router-dom";
import axios from "../axios";

export default function MyProfile() {
  const [user, setUser] = useContext(userProvider);
  const [posts, setPosts] = useState([]);
  const [editingUser, setEditingUser] = useState(false); // To toggle the edit form for username
  const [editingPost, setEditingPost] = useState(null); // To toggle the edit form for a post
  const [updatedUserName, setUpdatedUserName] = useState(user.userName);
  const [updatedPostData, setUpdatedPostData] = useState({});
  const token = localStorage.getItem("token");

  // Fetch user posts
  useEffect(() => {
    async function fetchUserPosts() {
      try {
        const result = await axios.get("/posts/user_posts", {
          params: { user_id: user.userId },
          headers: { Authorization: `Bearer ${token}` },
        });
        setPosts(result.data.posts); // Access `posts` from the backend response
      } catch (error) {
        console.error("Error fetching user posts:", error);
      }
    }
    fetchUserPosts();
  }, [user.userId]);

  // Handle post deletion
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

  // Handle username update
  async function handleUserNameUpdate(e) {
    e.preventDefault();
    try {
      const result = await axios.put(
        `/users/update`,
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

  // Handle post update
  async function handlePostUpdate(e) {
    e.preventDefault();
    try {
      const result = await axios.put(
        `/posts/update`,
        updatedPostData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPosts((prev) =>
        prev.map((post) =>
          post.post_id === result.data.post_id ? result.data : post
        )
      );
      setEditingPost(null);
      alert("Post updated successfully!");
    } catch (error) {
      console.error("Error updating post:", error);
    }
  }

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col items-center p-6">
      {/* Profile Section */}
      <div className="w-full max-w-4xl bg-white shadow-md rounded-lg p-6 flex flex-col items-center">
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
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
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

      {/* Posts Section */}
      <div className="w-full max-w-4xl mt-8">
        <h2 className="text-xl font-bold text-gray-800 mb-4">
          My Posts ({posts.length})
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {posts.map((post) => (
            <div
              key={post.post_id}
              className="bg-white shadow-md rounded-lg overflow-hidden"
            >
              {editingPost === post.post_id ? (
                <form
                  onSubmit={handlePostUpdate}
                  className="p-4 flex flex-col"
                >
                  <input
                    type="text"
                    value={updatedPostData.title || post.title}
                    onChange={(e) =>
                      setUpdatedPostData((prev) => ({
                        ...prev,
                        post_id: post.post_id,
                        title: e.target.value,
                      }))
                    }
                    className="border p-2 rounded mb-2"
                    placeholder="Enter new title"
                  />
                  <textarea
                    value={updatedPostData.content || post.content}
                    onChange={(e) =>
                      setUpdatedPostData((prev) => ({
                        ...prev,
                        content: e.target.value,
                      }))
                    }
                    className="border p-2 rounded mb-2"
                    placeholder="Enter new content"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  >
                    Save
                  </button>
                </form>
              ) : (
                <>
                  <img
                    src={post.image_file}
                    alt={post.title}
                    className="w-full h-32 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-800">
                      {post.title}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {new Date(post.created_at).toLocaleDateString()}
                    </p>
                    <div className="mt-2 flex justify-between items-center">
                      <button
                        className="text-blue-500 hover:underline"
                        onClick={() => setEditingPost(post.post_id)}
                      >
                        Edit
                      </button>
                      <button
                        className="text-red-500 hover:underline"
                        onClick={() => handleDeletePost(post.post_id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
