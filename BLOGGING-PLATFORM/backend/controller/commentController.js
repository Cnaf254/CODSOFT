const dbConnection = require('../db/dbConfig'); // Your DB connection
const StatusCodes = require('http-status-codes');

// Function to add a comment to a post
async function comment(req, res) {
    const { post_id, user_id, content } = req.body;

    // Check if all required fields are provided
    if (!post_id || !user_id || !content) {
        return res.status(StatusCodes.BAD_REQUEST).json({ msg: 'Please provide post_id, user_id, and content' });
    }

    try {
        // Insert the comment into the database
        const result = await dbConnection.query(
            "INSERT INTO comments (post_id, user_id, content) VALUES (?, ?, ?)",
            [post_id, user_id, content]
        );

        // Send a success response
        return res.status(StatusCodes.CREATED).json({ msg: 'Comment added successfully' });
    } catch (error) {
        console.error("Error adding comment: ", error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: 'Something went wrong, try again later' });
    }
}

async function comment(req, res) {
    const { post_id, user_id, content } = req.body;

    // Check if all required fields are provided
    if (!post_id || !user_id || !content) {
        return res.status(StatusCodes.BAD_REQUEST).json({ msg: 'Please provide post_id, user_id, and content' });
    }

    try {
        // Insert the comment into the database
        const result = await dbConnection.query(
            "INSERT INTO comments (post_id, user_id, content) VALUES (?, ?, ?)",
            [post_id, user_id, content]
        );

        // Send a success response
        return res.status(StatusCodes.CREATED).json({ msg: 'Comment added successfully' });
    } catch (error) {
        console.error("Error adding comment: ", error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: 'Something went wrong, try again later' });
    }
}
// Function to retrieve all comments for a specific post
async function allComments(req, res) {
    const { post_id } = req.query;

    // Check if post_id is provided
    if (!post_id) {
        return res.status(StatusCodes.BAD_REQUEST).json({ msg: 'Please provide post_id' });
    }

    try {
        // Query to fetch all comments for the given post_id
        const [comments] = await dbConnection.query(
            "SELECT c.comment_id, c.user_id, c.content, c.created_at, u.username FROM comments c JOIN users u ON c.user_id = u.user_id WHERE c.post_id = ? ORDER BY c.created_at DESC",
            [post_id]
        );

        // Send the list of comments as a response
        return res.status(StatusCodes.OK).json({ comments });
    } catch (error) {
        console.error("Error fetching comments: ", error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: 'Something went wrong, try again later' });
    }
}

module.exports = { comment, allComments };
