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
      console.log(posts)
     
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

module.exports = {
    post: [upload.single('file'), post], // Use Multer middleware for file uploads
    allPosts,
    searchPosts,
    popularPost,
    category,
};
