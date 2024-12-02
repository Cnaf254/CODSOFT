-- Users Table
CREATE TABLE IF NOT EXISTS users (
    user_id INT AUTO_INCREMENT PRIMARY KEY, -- Unique user identifier
    username VARCHAR(50) NOT NULL UNIQUE, -- Unique username
    email VARCHAR(100) NOT NULL UNIQUE, -- Unique email
    password_hash VARCHAR(255) NOT NULL, -- Encrypted password
    role ENUM('user', 'admin') DEFAULT 'user', -- User roles
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Creation timestamp
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP -- Update timestamp
);

CREATE TABLE IF NOT EXISTS posts (
    post_id INT AUTO_INCREMENT PRIMARY KEY, -- Unique post identifier
    user_id INT NOT NULL, -- Foreign key to users table
    title VARCHAR(255) NOT NULL, -- Title of the post
    content TEXT NOT NULL, -- Content of the post
    image_url VARCHAR(255), -- Optional image URL
    category VARCHAR(100), -- Category as a string column
    status ENUM('draft', 'published') DEFAULT 'draft', -- Post status
    views INT DEFAULT 0, -- View count
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Creation timestamp
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, -- Update timestamp
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE -- Delete posts if user is deleted
);


-- Comments Table
CREATE TABLE IF NOT EXISTS comments (
    comment_id INT AUTO_INCREMENT PRIMARY KEY, -- Unique comment identifier
    post_id INT NOT NULL, -- Foreign key to posts table
    user_id INT NOT NULL, -- Foreign key to users table
    content TEXT NOT NULL, -- Comment content
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Creation timestamp
    FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE, -- Delete comments if post is deleted
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE -- Delete comments if user is deleted
);





-- Password Reset Tokens Table (Optional for user password recovery)
CREATE TABLE IF NOT EXISTS password_reset_tokens (
    reset_id INT AUTO_INCREMENT PRIMARY KEY, -- Unique token identifier
    user_id INT NOT NULL, -- Foreign key to users table
    token VARCHAR(255) NOT NULL, -- Password reset token
    expires_at DATETIME NOT NULL, -- Expiration datetime for the token
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Creation timestamp
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE -- Delete token if user is deleted
);
