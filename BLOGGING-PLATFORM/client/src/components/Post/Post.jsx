import React, { useState, useContext } from "react";
import axios from "../axios";
import bgimage from "../../assets/images/postbg.webp"
import { userProvider } from "../../Context/UserProvider";

function Post() {
  const [user, setUser] = useContext(userProvider)
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imageFile, setImageFile] = useState(null); // Store file object
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState("");
  const [views, setViews] = useState(0);
  const token = localStorage.getItem('token')
  const userId =user.userId

  async function postBlog(e) {
    e.preventDefault();

    const formData = new FormData();
    formData.append("user_id", userId);
    formData.append("title", title);
    formData.append("content", content);
    formData.append("file", imageFile); // Attach the file
    formData.append("category", category);
    formData.append("status", status || "draft");
    formData.append("views", views || 0);

    try {
      await axios.post("/posts/post", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization:`Bearer ${token}` // Required for file upload
        },
      });
      alert("Post submitted successfully!");
    } catch (error) {
      console.error("Error posting blog:", error);
      alert("Failed to submit the post.");
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-40 sm:px-6 lg:px-8 w-full" style={{ backgroundImage: `url(${bgimage})` }}>
      <div className="max-w-md w-full space-y-8">
        <h2 className="text-center text-3xl font-extrabold text-gray-900">
          Create a New Post
        </h2>
        <form
          onSubmit={postBlog}
          className="bg-white p-6 shadow-lg rounded-lg space-y-4"
        >
         
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title"
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Content"
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-32"
            required
          />
          <input
            type="file"
            onChange={(e) => setImageFile(e.target.files[0])} // Capture the file
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="Category"
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <input
            type="text"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            placeholder="Status (e.g., draft, published)"
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="number"
            value={views}
            onChange={(e) => setViews(e.target.value)}
            placeholder="Views"
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="w-full bg-blue-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Submit Post
          </button>
        </form>
      </div>
    </div>
  );
}

export default Post;
