import express from "express";
import dotenv from "dotenv";
dotenv.config();
import { User } from "../models/UserModel.js";
import bcrypt from "bcrypt";
import crypto from "crypto";
import nodemailer from "nodemailer";
import generateToken from "../utils/generateToken.js";

export const RegisterRoute = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res
        .status(400)
        .json({ message: "User with that email already exists." });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      name: name,
      email: email,
      password: hashedPassword,
    });
    await newUser.save();

    res.status(201).json({ message: "User Created Successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error during registration." });
  }
};

export const LoginRoute = async (req, res) => {
  try {
    const { email, password } = req.body;
    const existingUser = await User.findOne({ email });

    if (!existingUser) {
      return res.status(401).json({ message: "Invalid email." });
    }

    const validPassword = await bcrypt.compare(password, existingUser.password);

    if (!validPassword) {
      return res.status(401).json({ message: "Invalid password." });
    }

    const accessToken = generateToken(existingUser.email, existingUser.name);
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "None",
      maxAge: 1000 * 60 * 60 * 24 * 7,
    });

    res.status(200).json({ message: "Logged in successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Server error during login." });
  }
};

export const ForgotPassRoute = async (req, res) => {
  try {
    const { email } = req.body;
    const existingUser = await User.findOne({ email });

    if (!existingUser) {
      return res.status(404).json({ message: "User not found." });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    const tokenExpiration = Date.now() + 3600000;

    existingUser.passwordResetToken = resetToken;
    existingUser.passwordResetExpires = tokenExpiration;

    await existingUser.save();

    const resetURL = `${CLIENT_URL}/updatePassword?token=${resetToken}`;

    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: "goyaltanya539@gmail.com",
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });

    const mailOptions = {
      from: "goyaltanya539@gmail.com",
      to: existingUser.email,
      subject: "Password Reset",
      html: `
            <h1>Password Reset Request</h1>
            <p>Click the link to reset your password:</p>
            <a href="${resetURL}">Reset Password</a>
          `,
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: "Password reset link sent." });
  } catch (error) {
     console.error(error); 
    res.status(500).json({ message: "Server error." });
  }
};

export const UpdatePassRoute = async (req, res) => {
  try {
    const { token, password } = req.body;
    const verifyToken = await User.findOne({
      passwordResetToken: token,
      passwordResetExpires: { $gt: Date.now() },
    });

    if (!verifyToken) {
      return res.status(400).json({ message: "Invalid or Expired Token" });
    }

    const salt = await bcrypt.genSalt(10);
    verifyToken.password = await bcrypt.hash(password, salt);
    verifyToken.passwordResetToken = undefined;
    verifyToken.passwordResetExpires = undefined;

    await verifyToken.save();
    res.status(200).json({ message: "Password Updated Successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Server error." });
  }
};

export const LogoutRoute = async (req, res) => {
  res.clearCookie("accessToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "None",
  });

  res.status(200).json({ message: "Logged out successfully." });
};
