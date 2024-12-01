-- Users Table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY, -- Unique user identifier
    username VARCHAR(50) NOT NULL UNIQUE, -- Unique username
    email VARCHAR(100) NOT NULL UNIQUE, -- Unique email
    password_hash VARCHAR(255) NOT NULL, -- Encrypted password
    role ENUM('user', 'admin') DEFAULT 'user', -- User roles
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Creation timestamp
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP -- Update timestamp
);

-- Categories Table
CREATE TABLE IF NOT EXISTS categories (
    id INT AUTO_INCREMENT PRIMARY KEY, -- Unique category identifier
    name VARCHAR(100) NOT NULL UNIQUE, -- Unique category name
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP -- Creation timestamp
);

-- Posts Table
CREATE TABLE IF NOT EXISTS posts (
    id INT AUTO_INCREMENT PRIMARY KEY, -- Unique post identifier
    user_id INT NOT NULL, -- Foreign key to users table
    title VARCHAR(255) NOT NULL, -- Title of the post
    content TEXT NOT NULL, -- Content of the post
    image_url VARCHAR(255), -- Optional image URL
    category_id INT, -- Foreign key to categories table
    status ENUM('draft', 'published') DEFAULT 'draft', -- Post status
    views INT DEFAULT 0, -- View count
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Creation timestamp
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, -- Update timestamp
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE, -- Delete posts if user is deleted
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL -- Set category to NULL if deleted
);

-- Comments Table
CREATE TABLE IF NOT EXISTS comments (
    id INT AUTO_INCREMENT PRIMARY KEY, -- Unique comment identifier
    post_id INT NOT NULL, -- Foreign key to posts table
    user_id INT NOT NULL, -- Foreign key to users table
    content TEXT NOT NULL, -- Comment content
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Creation timestamp
    FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE, -- Delete comments if post is deleted
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE -- Delete comments if user is deleted
);

-- Post Likes Table
CREATE TABLE IF NOT EXISTS post_likes (
    id INT AUTO_INCREMENT PRIMARY KEY, -- Unique like identifier
    post_id INT NOT NULL, -- Foreign key to posts table
    user_id INT NOT NULL, -- Foreign key to users table
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Creation timestamp
    FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE, -- Delete likes if post is deleted
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE, -- Delete likes if user is deleted
    UNIQUE (post_id, user_id) -- Ensure a user can like a post only once
);

-- Admin Logs Table (Optional for audit purposes)
CREATE TABLE IF NOT EXISTS admin_logs (
    id INT AUTO_INCREMENT PRIMARY KEY, -- Unique log identifier
    admin_id INT NOT NULL, -- Foreign key to users table (admin)
    action VARCHAR(255) NOT NULL, -- Admin action description
    target_id INT, -- Target entity's ID (post, comment, or user)
    target_type ENUM('user', 'post', 'comment') DEFAULT NULL, -- Type of target
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Log creation timestamp
    FOREIGN KEY (admin_id) REFERENCES users(id) ON DELETE CASCADE -- Delete log if admin is deleted
);

-- Password Reset Tokens Table (Optional for user password recovery)
CREATE TABLE IF NOT EXISTS password_reset_tokens (
    id INT AUTO_INCREMENT PRIMARY KEY, -- Unique token identifier
    user_id INT NOT NULL, -- Foreign key to users table
    token VARCHAR(255) NOT NULL, -- Password reset token
    expires_at DATETIME NOT NULL, -- Expiration datetime for the token
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Creation timestamp
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE -- Delete token if user is deleted
);
