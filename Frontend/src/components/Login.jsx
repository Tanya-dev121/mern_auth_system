import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import "./Login.css"; // Import the new CSS file
import { useFormik } from "formik";
import loginValidateSchema from "../schemas/validateLogin.jsx";
import { toast } from "react-toastify";

const Login = () => {
  const [showpassword, setshowpassword] = useState(false);
  const API_URL = import.meta.env.VITE_API_URL;
  const handleClick = () => {
    setshowpassword(!showpassword);
  };

  const handleGoogleClick = () => {
    window.location.href = `${API_URL}/auth/google`;
  };

  const initialValues = {
    email: "",
    password: "",
  };

  const { values, handleBlur, handleChange, handleSubmit, errors, touched } =
    useFormik({
      initialValues: initialValues,
      validationSchema: loginValidateSchema,
      onSubmit: async (values, action) => {
        try {
          const response = await fetch(`${API_URL}/api/login`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({
              email: values.email,
              password: values.password,
            }),
          });

          const result = await response.json();

          if (response.ok) {
            action.resetForm();
            toast.success("Login Successful");
            setTimeout(() => {
              window.location.href = "/profile";
            }, 1000);
          } else {
            toast.error(`Login failed: ${result.message}`);
          }
        } catch (error) {
          toast.error("An error occurred. Please try again.");
        }
      },
    });

  return (
    <div className="login-page">
      <div className="login-container">
        <h2 className="login-title">Welcome Back</h2>

        <form onSubmit={handleSubmit}>
          {/* Email */}
          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              type="email"
              autoComplete="off"
              name="email"
              value={values.email}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Enter your email"
              className={`form-input ${
                errors.email && touched.email ? "input-error" : ""
              }`}
            />
            {errors.email && touched.email && (
              <p className="form-error">{errors.email}</p>
            )}
          </div>

          {/* Password */}
          <div className="form-group">
            <label className="form-label">Password</label>
            <div className="input-container">
              <input
                type={showpassword ? "text" : "password"}
                autoComplete="off"
                name="password"
                value={values.password}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Enter password"
                className={`form-input ${
                  errors.password && touched.password ? "input-error" : ""
                }`}
              />
              <span onClick={handleClick} className="password-toggle-icon">
                {showpassword ? <FaEye /> : <FaEyeSlash />}
              </span>
            </div>
            {errors.password && touched.password && (
              <p className="form-error">{errors.password}</p>
            )}
          </div>

          {/* Forgot Password Link */}
          <p className="forgot-password-link">
            <Link to="/forgotPassword" className="forgot-password-anchor">
              Forgot password?
            </Link>
          </p>

          {/* Submit Button */}
          <button type="submit" className="submit-button">
            Login
          </button>
        </form>

        {/* Divider */}
        <div className="divider">
          <span>OR</span>
        </div>

        {/* Google Button */}
        <button
          onClick={handleGoogleClick}
          type="button"
          className="google-button"
        >
          <FcGoogle size={20} /> Continue with Google
        </button>

        {/* Register Link */}
        <p className="create-account-link">
          Don't have an account?{" "}
          <Link to="/register" className="create-account-anchor">
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
