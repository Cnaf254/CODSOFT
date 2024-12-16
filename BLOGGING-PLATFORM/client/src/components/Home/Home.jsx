import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../axios";

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [expandedPosts, setExpandedPosts] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [popularPosts, setPopularPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchPosts() {
      try {
        const result = await axios.get("/posts/all_posts", {
          headers: {
            Authorization: "Bearer " + token,
          },
        });
        setPosts(result.data.data);
      } catch (error) {
        console.error(error.response.data.msg);
      }
    }

    async function getPopularPost() {
      try {
        const result = await axios.get("/posts/popularPost", {
          headers: {
            Authorization: "Bearer " + token,
          },
        });
        setPopularPosts(result.data.data);
      } catch (error) {
        console.error(error.response.data.msg);
      }
    }

    async function fetchCategory() {
      try {
        const result = await axios.get("/posts/category", {
          headers: {
            Authorization: "Bearer " + token,
          },
        });
        setCategories(result.data.data);
      } catch (error) {
        console.error(error.response.data.msg);
      }
    }

    fetchPosts();
    getPopularPost();
    fetchCategory();
  }, []);

  const handleReadMore = (index) => {
    setExpandedPosts((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

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
      const response = await axios.get(`/posts/search?searchTerm=${searchTerm}`,{
        headers:{
          Authorization:`Bearer ${token}`
        }
      });
      setPosts(response.data.data);
    } catch (error) {
      console.error("Search error:", error);
    }
  };

  async function goToBlogDetail(post) {
    try {
      await axios.post(
        "/posts/updateviews",
        {
          post_id: post.post_id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      navigate("/blogdetail", { state: { postId: post.post_id } });
    } catch (error) {
      console.error("Error updating views:", error);
    }
  }

  return (
    <div className="text-white w-full bg-black flex flex-wrap py-4 px-4 lg:px-12">
      {/* Main Content Area */}
      <div className="w-full lg:w-3/4 flex flex-col py-4 px-4">
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {posts.map((post, index) => (
            <div
              key={index}
              className="border border-gray-700 p-4 rounded-md bg-gray-900 text-sm cursor-pointer hover:shadow-lg transition"
              onClick={() => goToBlogDetail(post)}
            >
              <img
                src={post.image_file}
                alt={post.image_name}
                className="w-full h-48 object-cover rounded-md"
              />
              <h3 className="mt-2 font-semibold text-base">{post.title}</h3>
              <div className="flex gap-2 text-xs text-white mt-1">
                <div>{post.username}</div>
                <div>{formatDate(post.created_at)}</div>
                <div>{post.views} views</div>
              </div>
              <p className="text-gray-400 mt-2">
                {expandedPosts[index]
                  ? post.content
                  : `${post.content.slice(0, 50)}...`}
                {post.content.length > 50 && (
                  <button
                    className="text-blue-500 ml-1"
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent click propagation
                      handleReadMore(index);
                    }}
                  >
                    {expandedPosts[index] ? "Read Less" : "Read More"}
                  </button>
                )}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Sidebar */}
      <div className="w-full lg:w-1/4 bg-black p-4 rounded-md">
        {/* Search Box */}
        <div>
          <form onSubmit={handleSearchSubmit} className="mb-4 flex items-center">
            <input
              type="text"
              className="flex-1 p-2 rounded-md border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
              placeholder="Search posts..."
              value={searchTerm}
              onChange={handleSearchChange}
            />
            <button
              type="submit"
              className="ml-2 bg-blue-600 text-black p-2 rounded-md"
            >
              Search
            </button>
          </form>
        </div>

        {/* Popular Posts */}
        <div className="mb-6">
          <h2 className="text-lg font-bold mb-4">Popular Posts</h2>
          <ul>
            {popularPosts.length > 0 ? (
              popularPosts.map((post) => (
                <li
                  key={post.post_id}
                  className="flex flex-col md:flex-row items-center gap-4 p-4 border border-gray-700 shadow-sm rounded-lg mb-4"
                >
                  <img
                    src={post.image_file}
                    alt={post.title || "Post Image"}
                    className="w-40 h-40 object-cover rounded-md"
                  />
                  <div className="flex-1">
                    <h3 className="text-md font-semibold mb-1">{post.title}</h3>
                    <p className="text-sm text-gray-300 mb-1">
                      Views: {post.views || 0}
                    </p>
                    <p className="text-sm text-gray-500">
                      {formatDate(post.created_at)}
                    </p>
                  </div>
                </li>
              ))
            ) : (
              <li className="text-gray-500">No popular posts available</li>
            )}
          </ul>
        </div>

        {/* Categories */}
        <div className="bg-gray-700 p-4 rounded-lg">
          <h2 className="text-lg font-bold mb-2">Categories</h2>
          <ul>
            {categories.map((category, index) => (
              <li
                key={index}
                className="mb-2 flex justify-between items-center p-2 border border-gray-500 rounded-md"
              >
                <span className="text-md font-medium">{category.category}</span>
                <span className="text-sm text-gray-300 ml-auto">
                  {category.category_count}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
