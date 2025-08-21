import mongoose from "mongoose";

const LocalUserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true, // This field is required
      unique: true, // This ensures every user has a unique email
    },
    password: {
      type: String,
      required: true,
    },

    // Fields for Password Reset Functionality
    passwordResetToken: String,
    passwordResetExpires: Date,
  },
  { timestamps: true }
);

export const User = mongoose.model("User", LocalUserSchema);

const SocialUserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  googleId: {
    type: String,
    required: true,
    unique: true,
  },
});
export const SocialUser = mongoose.model("SocialUser", SocialUserSchema);
