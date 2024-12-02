const dbConnection = require('../db/dbConfig');
const StatusCodes = require('http-status-codes');
const multer = require('multer');
const path = require('path');

// Configure Multer for Local Storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads'); // Save files in the 'uploads' directory
    },
    filename: (req, file, cb) => {
        const uniqueName = `${Date.now()}-${file.originalname}`;
        cb(null, uniqueName);
    }
});

const upload = multer({ storage });

// Post Function
async function post(req, res) {
    const { user_id, title, content, category, status, views } = req.body;

    if (!user_id || !title || !content) {
        return res
            .status(StatusCodes.BAD_REQUEST)
            .json({ msg: "Please provide all required fields" });
    }

    let img_url = null;

    // Check if a file is uploaded
    if (req.file) {
        img_url = `/uploads/${req.file.filename}`; // Save relative path to the file
    }

    try {
        await dbConnection.query(
            "INSERT INTO posts(user_id, title, content, image_url, category, status, views) VALUES(?, ?, ?, ?, ?, ?, ?)",
            [user_id, title, content, img_url, category, status || 'draft', views || 0]
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
        const query = "SELECT title, content, image_url FROM posts;";
        const [result] = await dbConnection.query(query);
        return res.status(StatusCodes.OK).json({ data: result });
    } catch (error) {
        console.error("Fetching error:", error);
        return res
            .status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json({ msg: "Something went wrong. Try again later." });
    }
}

async function searchPosts(req, res) {
    const { searchTerm } = req.query;  // Get the search term from query parameters

    if (!searchTerm) {
        return res.status(StatusCodes.BAD_REQUEST).json({ msg: 'Please provide a search term' });
    }

    try {
        // SQL query to search for the term in title, content, and category
        const query = `
            SELECT post_id, title, content, image_url, category, status, created_at
            FROM posts
            WHERE title LIKE ? OR content LIKE ? OR category LIKE ?
        `;
        const searchPattern = `%${searchTerm}%`;  // Surround the search term with % for partial matching

        const [posts] = await dbConnection.query(query, [searchPattern, searchPattern, searchPattern]);

        if (posts.length === 0) {
            return res.status(StatusCodes.NOT_FOUND).json({ msg: 'No posts found matching the search term' });
        }

        return res.status(StatusCodes.OK).json({ data: posts });
    } catch (error) {
        console.error(error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: 'Something went wrong, please try again later' });
    }
}

module.exports = {
    post: [upload.single('file'), post], // Use Multer middleware for file uploads
    allPosts,
    searchPosts,
};
