const dbConnection = require('../db/dbConfig');
const StatusCodes = require('http-status-codes');
const multer = require('multer');

// Configure Multer for Memory Storage
const storage = multer.memoryStorage(); // Store files in memory as a buffer
const upload = multer({ storage });

// Post Function to save data
async function post(req, res) {
    const { user_id, title, content, category, status, views } = req.body;

    if (!user_id || !title || !content) {
        return res
            .status(StatusCodes.BAD_REQUEST)
            .json({ msg: "Please provide all required fields" });
    }

    let fileBuffer = null;
    let fileName = null;

    // Check if a file is uploaded
    if (req.file) {
        fileBuffer = req.file.buffer; // Get the file buffer from Multer
        fileName = req.file.originalname; // Save the original file name for reference
    }

    try {
        // Insert data into the database
        await dbConnection.query(
            "INSERT INTO posts(user_id, title, content, image_file, image_name, category, status, views) VALUES(?, ?, ?, ?, ?, ?, ?, ?)",
            [
                user_id,
                title,
                content,
                fileBuffer,
                fileName,
                category,
                status || 'draft',
                views || 0,
            ]
        );
        return res.status(StatusCodes.CREATED).json({ msg: "Posted successfully" });
    } catch (error) {
        console.error("Post creation error:", error);
        return res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json({ msg: "Something went wrong. Try again later." });
    }
}

// Fetch All Posts
async function allPosts(req, res) {
    try {
        const query = `
        SELECT posts.*, users.username 
        FROM posts
        JOIN users ON posts.user_id = users.user_id;
    `;
        const [result] = await dbConnection.query(query);

        // Convert binary files to base64 URLs for display (if needed)
        const postsWithFileData = result.map(post => ({
            ...post,
            image_file: post.image_file
                ? `data:image/jpeg;base64,${post.image_file.toString('base64')}`
                : null, // Convert binary data to base64 string for use in HTML
        }));

        return res.status(StatusCodes.OK).json({ data: postsWithFileData });
    } catch (error) {
        console.error("Fetching error:", error);
        return res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json({ msg: "Something went wrong. Try again later." });
    }
}

async function singlePost(req, res) {
    // Extract post_id from the query string or route parameters (adjust as needed)
    const postId = req.query.post_id; // Use req.params.post_id if part of URL path
    if (!postId) {
        return res.status(400).json({ msg: "Post ID is required" });
    }
    try {
        

        const query = `
            SELECT posts.*, users.username 
            FROM posts
            JOIN users ON posts.user_id = users.user_id
            WHERE posts.post_id = ?;
        `;

        
        const [result] = await dbConnection.query(query, [postId]);

        // Handle case where no post is found
        if (!result.length) {
            return res.status(StatusCodes.NOT_FOUND).json({ msg: "Post not found" });
        }

        // Extract and format the single post
        const post = result[0];
        const postWithFileData = {
            ...post,
            image_file: post.image_file
                ? `data:image/jpeg;base64,${post.image_file.toString('base64')}`
                : null, // Convert binary data to base64 string for use in HTML
        };

        // Send the formatted post in the response
        return res.status(StatusCodes.OK).json({ data: postWithFileData });
    } catch (error) {
        console.error("Fetching error:", error);
        return res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json({ msg: "Something went wrong. Try again later." });
    }
}


async function popularPost(req,res) {
    try {
      const query = `SELECT post_id, title, content, image_file, image_name, category, status, created_at, views
                     FROM posts ORDER BY views DESC LIMIT 1`; // Order by views in descending order and limit to 1 post
  
      // Execute the query
      const [posts] = await dbConnection.query(query);
      const postsWithFileData = posts.map(post => ({
        ...post,
        image_file: post.image_file
            ? `data:image/jpeg;base64,${post.image_file.toString('base64')}`
            : null, // Convert binary data to base64 string for use in HTML
    }));
      return res.status(StatusCodes.OK).json({ data: postsWithFileData });
  
      
  
      
    } catch (error) {
      console.error(error);
      
    }
  }

  async function category(req,res) {
    try {
        const query = `SELECT category, COUNT(*) as category_count
        FROM posts
        GROUP BY category
        ORDER BY category_count DESC`; // Order by the number of posts in each category

  
      // Execute the query
      const [posts] = await dbConnection.query(query);
      
     
      return res.status(StatusCodes.OK).json({ data: posts });
  
      
  
      
    } catch (error) {
      console.error(error);
      
    }
  }

// Search Posts
async function searchPosts(req, res) {
    const { searchTerm } = req.query; // Get the search term from query parameters

    if (!searchTerm) {
        return res.status(StatusCodes.BAD_REQUEST).json({ msg: 'Please provide a search term' });
    }

    try {
        // SQL query to search for the term in title, content, and category
        const query = `SELECT post_id, title, content, image_file, image_name, category, status, created_at
                       FROM posts WHERE title LIKE ? OR content LIKE ? OR category LIKE ?`;
        const searchPattern = `%${searchTerm}%`; // Surround the search term with % for partial matching

        const [posts] = await dbConnection.query(query, [
            searchPattern,
            searchPattern,
            searchPattern,
        ]);

        if (posts.length === 0) {
            return res.status(StatusCodes.NOT_FOUND).json({ msg: 'No posts found matching the search term' });
        }

        // Convert binary files to base64 URLs for display (if needed)
        const postsWithFileData = posts.map(post => ({
            ...post,
            image_file: post.image_file
                ? `data:image/jpeg;base64,${post.image_file.toString('base64')}`
                : null, // Convert binary data to base64 string for use in HTML
        }));

        return res.status(StatusCodes.OK).json({ data: postsWithFileData });
    } catch (error) {
        console.error(error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: 'Something went wrong, please try again later' });
    }
}
async function updateViews(req, res) {
    const postId = req.body.post_id; // Correctly access post_id from the request body
    if (!postId) {
        return res.status(400).json({ msg: "Post ID is required" });
    }

    try {
        const query1 = `UPDATE posts SET views = views + 1 WHERE post_id = ?`;

        // Ensure dbConnection.query supports Promises
        await dbConnection.query(query1, [postId]);

        // Send a success response
        return res.status(200).json({ msg: "Views updated successfully" });
    } catch (error) {
        console.error("Database error:", error);
        return res
            .status(500) // Use 500 directly if `StatusCodes` is not available
            .json({ msg: "Something went wrong. Try again later." });
    }
}
async function userPosts(req, res) {
    const userId = req.query.user_id;
    if (!userId) {
        return res.status(400).json({ msg: "User ID is required" });
    }
    try {
        const query = `
        SELECT posts.*, users.username 
        FROM posts
        JOIN users ON posts.user_id = users.user_id
        WHERE posts.user_id=?;
        `;
        const [result] = await dbConnection.query(query, [userId]);

        const postsWithFileData = result.map(post => ({
            ...post,
            image_file: post.image_file
                ? `data:image/jpeg;base64,${post.image_file.toString('base64')}`
                : null,
        }));

        return res.status(StatusCodes.OK).json({ posts: postsWithFileData }); // Changed to `posts`
    } catch (error) {
        console.error("Fetching error:", error);
        return res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json({ msg: "Something went wrong. Try again later." });
    }
}
const deletePost = async (req, res) => {
    const postId = req.query.postId; // Extract postId from query parameters

    if (!postId) {
        return res.status(400).json({ msg: "Post ID is required" });
    }

    try {
        const query = "DELETE FROM posts WHERE post_id = ?";
        const [result] = await dbConnection.query(query, [postId]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ msg: "Post not found or already deleted" });
        }

        return res.status(200).json({ msg: "Post deleted successfully" });
    } catch (error) {
        console.error("Error deleting post:", error);
        return res.status(500).json({ msg: "Something went wrong. Please try again later." });
    }
};

const updatePost = async (req, res) => {
    const { post_id, title, content } = req.body;
  
    if (!post_id || (!title && !content)) {
      return res.status(400).json({ msg: "Post ID and at least one field to update are required." });
    }
  
    try {
      const query = `
        UPDATE posts
        SET title = COALESCE(?, title),
            content = COALESCE(?, content)
        WHERE post_id = ?
      `;
      const [result] = await dbConnection.query(query, [title, content, post_id]);
  
      if (result.affectedRows === 0) {
        return res.status(404).json({ msg: "Post not found." });
      }
  
      const [updatedPost] = await dbConnection.query("SELECT * FROM posts WHERE post_id = ?", [post_id]);
      return res.status(200).json(updatedPost[0]);
    } catch (error) {
      console.error("Error updating post:", error);
      return res.status(500).json({ msg: "Something went wrong." });
    }
  };
  


module.exports = {
    post: [upload.single('file'), post], // Use Multer middleware for file uploads
    allPosts,
    searchPosts,
    popularPost,
    category,
    singlePost,
    updateViews,
    userPosts,
    deletePost,
    updatePost,
};
