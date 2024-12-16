import React, { useState, useEffect, useContext } from 'react';
import { userProvider } from '../../Context/UserProvider';
import { Link } from 'react-router-dom';
import axios from '../axios';

export default function MyProfile() {
  const [user, setUser] = useContext(userProvider);
  const [posts, setPosts] = useState([]);
  const token = localStorage.getItem('token');

  // Fetch user posts
  useEffect(() => {
    async function fetchUserPosts() {
      try {
        const result = await axios.get('/posts/user_posts', {
          params: { user_id: user.userId },
          headers: { Authorization: `Bearer ${token}` },
        });
        setPosts(result.data.posts);
      } catch (error) {
        console.error('Error fetching user posts:', error);
      }
    }
    fetchUserPosts();
  }, [user.userId]);

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col items-center p-6">
      {/* Profile Section */}
      <div className="w-full max-w-4xl bg-white shadow-md rounded-lg p-6 flex flex-col items-center">
        <img
          src={user.profilePicture || 'https://via.placeholder.com/150'}
          alt="Profile"
          className="w-32 h-32 rounded-full border-4 border-blue-500 shadow-lg mb-4"
        />
        <h1 className="text-2xl font-semibold text-gray-800">{user.userName}</h1>
        <p className="text-gray-600">{user.email}</p>
        <Link
          to="/edit-profile"
          className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Edit Profile
        </Link>
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
              <img
                src={post.image_file}
                alt={post.title}
                className="w-full h-32 object-cover"
              />
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-800">{post.title}</h3>
                <p className="text-sm text-gray-500">
                  {new Date(post.created_at).toLocaleDateString()}
                </p>
                <div className="mt-2 flex justify-between items-center">
                  <Link
                    to={`/edit-post/${post.post_id}`}
                    className="text-blue-500 hover:underline"
                  >
                    Edit
                  </Link>
                  <button
                    className="text-red-500 hover:underline"
                    onClick={() => handleDeletePost(post.post_id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // Handle post deletion
  async function handleDeletePost(postId) {
    try {
      await axios.delete(`/posts/delete/${postId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPosts((prevPosts) => prevPosts.filter((post) => post.post_id !== postId));
      alert('Post deleted successfully!');
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  }
}
