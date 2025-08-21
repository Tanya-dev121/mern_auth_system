import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import DBconnection from "./utils/databaseConnection.js";
import { protectRoute } from "./utils/Verify.js";
import generateToken from "./utils/generateToken.js";
import { SocialUser } from "./models/UserModel.js";
import router from "./Routes/router.js";
// import path from "path";

//Connect to database
DBconnection();

const app = express();
// const _dirname = path.resolve();

//Using the Middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);

// Google Login Config
app.use(passport.initialize());

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${process.env.SERVER_URL}/auth/google/callback`,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Find or create the user in the SocialUser collection
        let user = await SocialUser.findOne({ googleId: profile.id });
        if (!user) {
          user = new SocialUser({
            name: profile.displayName,
            email: profile.emails[0].value,
            googleId: profile.id,
          });
          await user.save();
        }
        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }
  )
);

app.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: ["email", "profile"],
    prompt: "select_account",
  })
);

app.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    failureRedirect: `${process.env.CLIENT_URL}/login`,
    session: false,
  }),
  (req, res, next) => {
    // Generate the token and set the cookie here
    const accessToken = generateToken(req.user.email, req.user.name);
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Set to true in production
      sameSite: "lax",
      maxAge: 1000 * 60 * 60 * 24 * 7,
    });
    res.redirect(`${process.env.CLIENT_URL}/profile`);
  }
);

app.get("/profile", protectRoute, (req, res) => {
  res.json({
    message: `Welcome, ${req.user.name}! This is a protected route.`,
  });
});

app.use("/api", router);
// app.use(express.static(path.join(_dirname, "/frontend/dist")));
// app.get("*", (req, res) => {
//   res.sendFile(path.resolve(_dirname, "Frontend", "dist", "index.html"));
// });
const PORT = process.env.PORT || 2000;
app.listen(PORT);
