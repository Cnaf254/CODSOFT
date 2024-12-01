const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()

port = 3003

// const corsOptions = {
//     origin: "https://your-frontend-domain.com", // Replace with your frontend URL
//     methods: ["GET", "POST", "PUT", "DELETE"],
//     allowedHeaders: ["Content-Type", "Authorization"],
//   };
//   app.use(cors(corsOptions));
app.use(cors)

const dbConnection = require('./db/dbConfig.js')

app.use(express.json())


async function start(){
    try{
        const result = await dbConnection.execute("select 'test' ")
    console.log(result)

    await app.listen(port)
    console.log(`listening ${port}`)
    } catch(error) {
         console.log(error)
    }
}
start()