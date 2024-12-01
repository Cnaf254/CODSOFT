//import modules
const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
//import files
const userRouter = require("./routes/userRoutes.js");
const dbConnection = require("./db/dbConfig.js");
const authMiddleware = require('./middleware/authMiddleware.js')

const port = 3003;

app.use(cors());
app.use(express.json());

app.use("/api/users", userRouter);

async function start() {
  try {
    const result = await dbConnection.execute("select 'test' ");
    console.log(result);

    await app.listen(port);
    console.log(`listening ${port}`);
  } catch (error) {
    console.log(error);
  }
}
start();
