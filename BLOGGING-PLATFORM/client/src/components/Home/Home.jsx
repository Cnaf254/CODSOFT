import React, { useEffect, useState } from "react";
import axios from "../axios";

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(9); // Number of posts per page
  const [expandedPosts, setExpandedPosts] = useState({}); // Tracks expanded content state
  const [searchTerm, setSearchTerm] = useState(""); // State for search term
  const [popularPosts, setPopularPosts] = useState([]); // Popular posts data
  const [categories, setCategories] = useState([]); // Categories data


  useEffect(() => {
    async function fetchPosts() {
      try {
        const result = await axios.get("/posts/all_posts");
        setPosts(result.data.data);
      } catch (error) {
        console.error(error);
      }
    }

    async function getPopularPost() {
      try {
        const result = await axios.get("/posts/popularPost"); 
         // Fetch the popular post
         console.log(result.data.data)
        setPopularPosts(result.data.data);  // Store the popular post in the state
      } catch (error) {
        console.error(error);
        console.log("please what happen here")
      }
    }
async function fetchCategory(){
  try {
    const result = await axios.get("/posts/category");
    setCategories(result.data.data);
  } catch (error) {
    console.error(error);
  }
}
    fetchPosts();
    getPopularPost();
    fetchCategory();
  }, []);

  const totalPages = Math.ceil(posts.length / postsPerPage);

  // Calculate the range of posts for the current page
  const startIndex = (currentPage - 1) * postsPerPage;
  const currentPosts = posts.slice(startIndex, startIndex + postsPerPage);

  const handleReadMore = (index) => {
    setExpandedPosts((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0]; // Format as YYYY-MM-DD
  };

  // Search functionality
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);  // Update the search term on input change
  };

  const handleSearchSubmit = async (e) => {
    e.preventDefault();  // Prevent default form submission

    try {
      const response = await axios.get(`/posts/search?searchTerm=${searchTerm}`); // Send the searchTerm to the backend
      setPosts(response.data.data);  // Update the posts state with the search results
    } catch (error) {
      console.error("Search error:", error);
    }
  };

  return (
    <div className="text-black w-4/5 bg-gray-400 flex flex-wrap justify-between py-4 px-12">
      {/* Main Content Area */}
      <div className="w-full md:w-2/3 bg-gray-400 flex flex-col py-2 px-8">
        <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {currentPosts.map((post, index) => (
            <div key={index} className="border p-1 rounded-md bg-gray-400 text-sm">
              <img
                src={post.image_file}
                alt={post.image_name}
                className="w-full h-32 object-cover rounded-md"
              />
              <h3 className="mt-1 font-semibold text-base">{post.title}</h3>
              <div className="flex gap-2">
                <div>{post.username}</div>
                <div>{formatDate(post.created_at)}</div>
                <div>{post.views} views</div>
              </div>
              <p className="text-gray-700 mt-1 text-xs">
                {expandedPosts[startIndex + index]
                  ? post.content
                  : `${post.content.slice(0, 50)}...`}
                {post.content.length > 50 && (
                  <button
                    className="text-blue-500 ml-1"
                    onClick={() => handleReadMore(startIndex + index)}
                  >
                    {expandedPosts[startIndex + index] ? "Read Less" : "Read More"}
                  </button>
                )}
              </p>
            </div>
          ))}
        </div>

        {/* Pagination Controls */}
        <div className="flex justify-between mt-4">
          <button
            className="bg-blue-600 text-white px-3 py-1 rounded-md text-sm"
            onClick={handlePrevious}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <button
            className="bg-blue-600 text-white px-3 py-1 rounded-md text-sm"
            onClick={handleNext}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      </div>

      {/* Sidebar */}
      <div className="w-full md:w-1/3 bg-gray-400 p-4 rounded-md">
        {/* Search Box */}
        <div>
  <form onSubmit={handleSearchSubmit} className="mb-4 flex items-center">
    <input
      type="text"
      className="flex-1 p-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
      placeholder="Search posts..."
      value={searchTerm}
      onChange={handleSearchChange}
    />
    <button
      type="submit"
      className="ml-2 bg-blue-600 text-white p-2 rounded-md"
    >
      Search
    </button>
  </form>
</div>


        {/* Popular Posts */}
        <div className="mb-6">
  <h2 className="text-lg font-bold mb-4">Popular Post</h2>
  <ul>
    {popularPosts.length > 0 ? (
      popularPosts.map((post) => (
        <li
          key={post.post_id}
          className="flex flex-col md:flex-row items-center gap-4 p-4 border border-gray-200 shadow-sm rounded-lg mb-4"
        >
          {/* Image */}
          <img
            src={post.image_file}
            alt={post.title || "Post Image"}
            className="w-40 h-48 object-cover rounded-md"
          />

          {/* Content */}
          <div className="flex-1">
            <h3 className="text-md font-semibold mb-1">{post.title || "Untitled Post"}</h3>
            <p className="text-sm text-gray-500 mb-1">Views: {post.views || 0}</p>
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
        <div class="bg-white p-8 rounded-lg">
          <h2 className="text-lg font-bold mb-2">Categories</h2>
          <ul>
    {categories.map((category, index) => (
      <li
        key={index}
        className="mb-2 flex justify-between items-center p-2 border border-gray-200 rounded-md"
      >
        {/* Category Name */}
        <span className="text-md font-medium">{category.category}</span>
        
        {/* Category Count */}
        <span className="text-sm text-gray-500 ml-auto">{category.category_count}</span>
      </li>
    ))}
  </ul>
        </div>
      </div>
    </div>
  );
}
