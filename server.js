const express = require("express");

const postRouter = require("./posts/postRouter");
const userRouter = require("./users/userRouter");

const server = express();

server.use(logger);
server.use(express.json());

server.use("/api/posts", logger, postRouter);
server.use("/api/users", logger, userRouter);

server.get("/", logger, (req, res) => {
  res.status(200).json({ message: "Welcome" });
});

//custom middleware

function logger(req, res, next) {
  const method = req.method;
  const endpoint = req.originalUrl;
  const time = new Date().toString();

  console.log(`${method} to ${endpoint} at ${time}`);

  next();
}

module.exports = server;