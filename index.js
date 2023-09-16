import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";

import userRouter from "./routes/User.routes.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 8081;

app.use(cors());

app.use(bodyParser.urlencoded({ extended: true }));

app.use(bodyParser.json());

mongoose
  .connect(process.env.MONGO_DB_URL, {
    useNewUrlParser: true,
  })
  .then(() => {
    console.log("Successfully connected to MongoDB");
  })
  .catch((error) => {
    console.log("MongoDB connection failed", error);
  });

app.get("/", (req, res) => {
  res.send("Hello, Express App!");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

app.use("/api", userRouter);
