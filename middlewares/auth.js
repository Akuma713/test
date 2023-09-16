// auth.js

import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET_KEY; // Replace with your own secret key
const ACCESS_TOKEN_EXPIRATION = "1h"; // Access token expiration time
const REFRESH_TOKEN_EXPIRATION = "7d"; // Refresh token expiration time

// Function to generate an access token
export function generateAccessToken(user) {
  return jwt.sign({ userId: user._id }, JWT_SECRET, {
    // expiresIn: ACCESS_TOKEN_EXPIRATION,
  });
}

// Function to generate a refresh token
export function generateRefreshToken(user) {
  return jwt.sign({ userId: user._id }, JWT_SECRET, {
    // expiresIn: REFRESH_TOKEN_EXPIRATION,
  });
}

// Middleware to verify JWT token
export function verifyToken(req, res, next) {
  let token = req.header("Authorization");

  if (!token) {
    return res.status(401).json({ error: "Token is missing" });
  }

  try {
    token = token.replace("Bearer ", "");
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    return res.status(401).json({ error: "Invalid token" });
  }
}
