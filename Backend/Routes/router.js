import express from "express";
import dotenv from "dotenv";
dotenv.config();
import {
  ForgotPassRoute,
  LoginRoute,
  LogoutRoute,
  RegisterRoute,
  UpdatePassRoute,
} from "../Controllers/controller.js";
const router = express.Router();

//Register Route

router.post("/register", RegisterRoute);

//Login Route

router.post("/login", LoginRoute);

//forgot password route

router.post("/forgot/password", ForgotPassRoute);

//UpdatePassword Route

router.post("/update/password", UpdatePassRoute);

//Logout Router

router.post("/logout", LogoutRoute);

export default router;
