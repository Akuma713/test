// user.routes.js

import express from "express";
import * as UserController from "../controllers/User.controller.js";
import { verifyToken } from "../middlewares/auth.js";

const userRouter = express.Router();

// Route to sign up a new user
userRouter.post("/signup", UserController.signup);

// Route to log in a user (authentication route)
userRouter.post("/login", UserController.login);

// Route to fetch users with pagination
userRouter.get("/users", verifyToken, UserController.getUsers);

// Route to edit a user by ID
userRouter.put("/users", verifyToken, UserController.editUser);

// Route to delete a user by ID
userRouter.delete("/users", verifyToken, UserController.deleteUser);

export default userRouter;
