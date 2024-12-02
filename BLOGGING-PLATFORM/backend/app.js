//import modules
const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
//import files
const userRouter = require("./routes/userRoutes.js");
const postRouter = require('./routes/postRoutes.js')


const commentRouter = require('./routes/commentRoutes.js')
// const post_likeRouter = require('./routes/post_likeRoutes.js')
// const password_reset_tokenRouter = require('./routes/password_reset_tokenRoutes.js')

const dbConnection = require("./db/dbConfig.js");
const authMiddleware = require('./middleware/authMiddleware.js')

const port = 3003;

app.use(cors());
app.use(express.json());

app.use("/api/users", userRouter);
app.use("/api/posts",authMiddleware, postRouter);
app.use("/api/comments",authMiddleware, commentRouter);

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
