// user.controller.js

import bcrypt from "bcrypt";

import User from "../models/User.model.js";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../middlewares/auth.js";

// Function to sign up a new user
export async function signup(req, res) {
  try {
    const { firstName, lastName, type, profilePictureUrl, email, password } =
      req.body;

    // Check if a user with the same email already exists (you can use a unique field like email)
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    const newUser = new User({
      firstName,
      lastName,
      type,
      profilePictureUrl,
      email,
      password,
    });

    await newUser.save();

    // Generate access and refresh tokens
    const accessToken = generateAccessToken(newUser);
    const refreshToken = generateRefreshToken(newUser);

    res.status(201).json({ user: newUser, accessToken, refreshToken });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

// Function to log in a user
export async function login(req, res) {
  try {
    const { email, password } = req.body;

    // Find the user by email
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Check if the provided password matches the hashed password in the database
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Generate access and refresh tokens upon successful login
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    res.status(200).json({ user, accessToken, refreshToken });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

// Function to fetch users with pagination
export async function getUsers(req, res) {
  try {
    const page = req.query.page || 1;
    const limit = req.query.limit || 10;

    const options = {
      page: page,
      limit: limit,
    };

    const users = await User.paginate({}, options);
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// Function to edit a user by ID
export async function editUser(req, res) {
  try {
    const userId = req.userId;
    const updatedUser = await User.findByIdAndUpdate(userId, req.body, {
      new: true,
    });
    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

// Function to delete a user by ID
export async function deleteUser(req, res) {
  try {
    const userId = req.userId;
    await User.findByIdAndDelete(userId);
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}
