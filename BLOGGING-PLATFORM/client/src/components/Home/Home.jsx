import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../axios";

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [popularPosts, setPopularPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      try {
        const [postsRes, popularRes, categoriesRes] = await Promise.all([
          axios.get("/posts/all_posts", { headers: { Authorization: `Bearer ${token}` } }),
          axios.get("/posts/popularPost", { headers: { Authorization: `Bearer ${token}` } }),
          axios.get("/posts/category", { headers: { Authorization: `Bearer ${token}` } }),
        ]);
        setPosts(postsRes.data.data);
        setPopularPosts(popularRes.data.data);
        setCategories(categoriesRes.data.data);
      } catch (error) {
        console.error(error.message);
      }
    }
    fetchData();
  }, [token]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toISOString().split("T")[0];
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.get(`/posts/search?searchTerm=${searchTerm}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPosts(response.data.data);
    } catch (error) {
      console.error("Search error:", error);
    }
  };

  const goToBlogDetail = async (post) => {
    try {
      await axios.post(
        "/posts/updateviews",
        { post_id: post.post_id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      navigate("/blogdetail", { state: { postId: post.post_id } });
    } catch (error) {
      console.error("Error updating views:", error);
    }
  };

  return (
    <div className="bg-gray-100 text-gray-800 min-h-screen py-8 px-4 lg:px-12">
      {/* Main Content */}
      <div className="flex flex-wrap lg:flex-nowrap">
        {/* Posts Section */}
        <div className="w-full lg:w-3/4 pr-0 lg:pr-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Latest Posts</h1>
          <div className="grid grid-cols-1 gap-6">
            {posts.map((post, index) => (
              <div
                key={index}
                className="bg-white border border-gray-300 rounded-lg shadow-lg p-4 cursor-pointer hover:shadow-xl transition"
                onClick={() => goToBlogDetail(post)}
              >
                <div className="flex items-start">
                  {/* Image section on the left */}
                  <img
                    src={post.image_file}
                    alt={post.image_name}
                    className="w-16 h-16 object-cover rounded-md mr-4"
                  />
                  <div className="flex flex-col w-full">
                    {/* Title in bold */}
                    <h3 className="text-xl font-bold text-gray-800">{post.title}</h3>
                    {/* Author, Date, and Views in the same line */}
                    <div className="flex items-center text-sm text-gray-600 mt-2">
                      <span className="font-bold">{post.username}</span>
                      <span className="mx-2">•</span>
                      <span className="font-bold">{formatDate(post.created_at)}</span>
                      <span className="mx-2">•</span>
                      <span className="font-bold">{post.views} views</span>
                    </div>
                    {/* Post content */}
                    <p className="text-gray-700 mt-2 text-sm">{post.content.slice(0, 100)}...</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <div className="w-full lg:w-1/4 mt-auto lg:mt-0">
  {/* Search Box */}
  <div className="mb-8">
    <form onSubmit={handleSearchSubmit} className="flex items-center">
      <input
        type="text"
        placeholder="Search posts..."
        value={searchTerm}
        onChange={handleSearchChange}
        className="w-full p-3 border border-gray-300 rounded-l-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
      />
      <button
        type="submit"
        className="px-6 py-3 bg-blue-500 text-white rounded-r-lg hover:bg-blue-600 transition duration-300 ease-in-out transform hover:scale-105"
      >
        Search
      </button>
    </form>
  </div>

  {/* Popular Posts */}
  <div className="mb-8">
    <h2 className="text-xl font-semibold text-gray-900 mb-4">Popular Posts</h2>
    <ul>
      {popularPosts.map((post) => (
        <li
          key={post.post_id}
          className="flex items-center gap-4 p-4 mb-4 bg-white border border-gray-300 rounded-lg shadow-sm hover:shadow-lg transition"
          onClick={() => goToBlogDetail(post)}
        >
          <img
            src={post.image_file}
            alt={post.title}
            className="w-16 h-16 object-cover rounded-md"
          />
          <div>
            <h3 className="text-sm font-semibold text-gray-800">{post.title}</h3>
            <p className="text-xs text-gray-600">
              {formatDate(post.created_at)} • {post.views} views
            </p>
          </div>
        </li>
      ))}
    </ul>
  </div>

  {/* Categories */}
  <div className="bg-white p-6 rounded-lg shadow-sm">
    <h2 className="text-xl font-semibold text-gray-900 mb-4">Categories</h2>
    <ul>
      {categories.map((category, index) => (
        <li
          key={index}
          className="flex justify-between items-center mb-3 p-3 border border-gray-300 rounded-md"
        >
          <span className="text-gray-800">{category.category}</span>
          <span className="text-xs text-gray-500">{category.category_count}</span>
        </li>
      ))}
    </ul>
  </div>
</div>


      </div>
    </div>
  );
}
