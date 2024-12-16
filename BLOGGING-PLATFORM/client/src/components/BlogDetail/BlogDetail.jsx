import React, { useState, useEffect, useContext } from 'react';
import { useLocation } from 'react-router-dom';
import { userProvider } from '../../Context/UserProvider';
import axios from '../axios';

function BlogDetail() {
  const location = useLocation();
  const { postId } = location.state || {};
  const [post, setPost] = useState({});
  const [comments, setComments] = useState([]);
  const [user, setUser] = useContext(userProvider);
  const [comment, setComment] = useState('');
  const token = localStorage.getItem('token');

  useEffect(() => {
    async function fetchSinglePost() {
      try {
        const result = await axios.get('/posts/singlepost', {
          params: { post_id: postId },
          headers: { Authorization: `Bearer ${token}` },
        });
        setPost(result.data.data);
      } catch (error) {
        console.error('Error fetching post:', error);
      }
    }

    async function fetchComments() {
      try {
        const result = await axios.get('/comments/all_comments', {
          params: { post_id: postId },
          headers: { Authorization: `Bearer ${token}` },
        });
        setComments(result.data.comments);
      } catch (error) {
        console.error('Error fetching comments:', error);
      }
    }

    fetchSinglePost();
    fetchComments();
  }, [postId]);

  const handleInputChange = (e) => {
    setComment(e.target.value);
  };

  async function postComment(e) {
    e.preventDefault();
    try {
      await axios.post(
        '/comments/comment',
        { post_id: postId, user_id: user.userId, content: comment },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setComments((prevComments) => [
        { content: comment, user_id: user.userId, post_id: postId },
        ...prevComments,
      ]);
      setComment('');
    } catch (error) {
      console.error('Error posting comment:', error);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white flex flex-col items-center">
      <div className="w-full max-w-5xl px-4 sm:px-6 lg:px-8 py-12">
        {/* Post Content */}
        <div className="bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
          <img
            src={post.image_file}
            alt={post.title || 'Post Image'}
            className="w-full h-auto rounded-lg mb-4"
          />
          <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
          <div className="flex items-center text-sm text-gray-400 space-x-4 mb-6">
            <span>By {post.username}</span>
            <span>{post.views} Views</span>
          </div>
          <p className="text-lg text-gray-300">{post.content}</p>
        </div>

        {/* Comment Form */}
        <div className="bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4">Leave a Comment</h2>
          <form onSubmit={postComment} className="flex flex-col sm:flex-row items-center gap-4">
            <input
              type="text"
              name="comment"
              value={comment}
              onChange={handleInputChange}
              placeholder="Write a comment"
              className="flex-1 p-3 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
            />
            <button
              type="submit"
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none"
            >
              Submit
            </button>
          </form>
        </div>

        {/* Comments Section */}
        <div className="bg-gray-800 rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-semibold mb-4">Comments</h2>
          {comments.length > 0 ? (
            <div className="space-y-4">
              {comments.map((comment, index) => (
                <div key={index} className="bg-gray-700 p-4 rounded-md shadow-md">
                  <p className="text-gray-300">{comment.content}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400">No comments yet. Be the first to comment!</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default BlogDetail;
