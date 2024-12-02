const dbConnection = require('../db/dbConfig.js')
const {StatusCodes} = require('http-status-codes')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')



// Password validation function
function validatePassword(password) {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return regex.test(password);
}

async function register(req,res){

    const {username, email, password} = req.body
    if (!username || !email || !password){
        return res.status(StatusCodes.BAD_REQUEST).json({msg: "please provide all value"});
    }

     //Validate password strength
     if (!validatePassword(password)) {
        return res.status(400).json({
            error: "Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one digit, and one special character.",
        });
    }

try{
 const [user] = await dbConnection.query(
    "SELECT username,user_id FROM users WHERE username=? or email=?", [username, email]

 );
if (user.length > 0){
    return res.status(StatusCodes.BAD_REQUEST).json({msg: "user already exist"});
}
const salt = await bcrypt.genSalt(10);
const password_hashed = await bcrypt.hash(password, salt)

await dbConnection.query(
"INSERT INTO users(username, email, password_hash) VALUES(?,?,?)",[username, email, password_hashed]
);
return res.status(StatusCodes.CREATED).json({msg: "user created"});
} catch (error){
console.log(error)
return res
.status(StatusCodes.INTERNAL_SERVER_ERROR)
.json({ msg: "something went wrong try again later" });
}
}
async function logIn(req,res){
const {email, password} = req.body
if(!email || !password){
    return res
    .status(StatusCodes.BAD_REQUEST)
    .json({ msg: "Please enter all required inputs" });
}
try {
const [user] = await dbConnection.query(
    "SELECT username,password_hash,user_id FROM users WHERE email=?",[email]
);
if (user.length == 0) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: "invalid credential" });
  }
 //compare password
 const isMatch = await bcrypt.compare(password, user[0].password_hash);
 if (!isMatch) {
   return res
     .status(StatusCodes.BAD_REQUEST)
     .json({ msg: "invalid credential" });
 } 
 //jwt generation
 const username = user[0].username;
 
 const userid = user[0].user_id;
 
 const token = jwt.sign({ username, userid }, process.env.JWT_SECRET, {
   expiresIn: "1d",
 });
 return res
   .status(StatusCodes.OK)
   .json({
     msg: "user successfuly log in ",
     token: token,
     userName: username,
     userid,
   });
} catch(error){
    console.log(error);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "something went wrong try again later" });
}
}
function checkUser(req, res) {
    const { userid, username } = req.user;
  
    res.status(StatusCodes.OK).json({ username, userid });
  }
 

// Update password endpoint
async function updatePassword(req, res) {
    const { currentPassword, newPassword } = req.body;
    const { userid, username } = req.user; // Extract user ID from the JWT token (using middleware)
    console.log(userid)

    if (!currentPassword || !newPassword) {
        return res.status(StatusCodes.BAD_REQUEST).json({ msg: 'Please provide both current and new password' });
    }

    try {
        // Find the user by ID
        const query = 'SELECT * FROM users WHERE user_id = ?';
        const [user] = await dbConnection.query(query, [userid]);
        

        if (!user) {
            return res.status(StatusCodes.NOT_FOUND).json({ msg: 'User not found' });
        }

        // Check if current password matches the stored password
        const isMatch = await bcrypt.compare(currentPassword, user[0].password_hash); // Compare with stored hashed password
        if (!isMatch) {
            return res.status(StatusCodes.UNAUTHORIZED).json({ msg: 'Incorrect current password' });
        }

        // Hash the new password
        const salt = await bcrypt.genSalt(10);
        const hashedNewPassword = await bcrypt.hash(newPassword, salt);

        // Update the password in the database
        await dbConnection.query('UPDATE users SET password_hash = ? WHERE user_id = ?', [hashedNewPassword, userid]);

        return res.status(StatusCodes.OK).json({ msg: 'Password updated successfully' });
    } catch (error) {
        console.log(error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: 'Something went wrong. Please try again later.' });
    }
}



module.exports = {register, logIn, checkUser, updatePassword};