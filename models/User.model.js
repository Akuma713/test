// userModel.js

import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
import bcrypt from "bcrypt";

// Define the User schema
const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
  },
  lastName: {
    type: String,
  },
  type: {
    type: String,
    enum: ["student", "faculty"],
  },
  profilePictureUrl: {
    type: String,
  },
  email: {
    type: String,
  },
  password: {
    type: String,
    select: false, // Make sure the password is not returned when querying users
  },
});

// Hash the password before saving
userSchema.pre("save", async function (next) {
  try {
    const saltRounds = 10; // Adjust as needed
    const hashedPassword = await bcrypt.hash(this.password, saltRounds);
    this.password = hashedPassword;
    next();
  } catch (error) {
    next(error);
  }
});

// Apply the mongoose-paginate-v2 plugin to the schema
userSchema.plugin(mongoosePaginate);

// Create the User model
const User = mongoose.model("users", userSchema);

export default User;
