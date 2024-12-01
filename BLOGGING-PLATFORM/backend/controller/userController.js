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
    "SELECT username,id FROM users WHERE username=? or email=?", [username, email]

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
module.exports = register