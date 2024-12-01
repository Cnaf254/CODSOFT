const mysql = require('mysql2')


const dbConnection=mysql.createPool(
{
host:process.env.HOST,
user:process.env.USER,
database:process.env.DATABASE,
password:process.env.PASSWORD,
connectionLimit:10,
}
)
module.exports=dbConnection.promise()