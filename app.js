const express = require("express");
const path = require("path");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const db = require("./mongodb");
const authRouter = require("./controllers/auth");
const blogRouter = require("./controllers/blog");
const userRouter = require("./controllers/user");
dotenv.config();
const app = express();
const PORT = 7701;


db();

app.use(express.json());
app.use(express.json());app.use(express.urlencoded({ extended: true }));
app.use("/auth", authRouter);
app.use("/blog", blogRouter);
app.use("/user", userRouter);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});


app.listen(PORT, () => {
  console.log(`Server successfully running on ${PORT}`);
});
