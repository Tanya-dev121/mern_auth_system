import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { useFormik } from "formik";
import validateSchema from "../schemas/validate";
import { toast } from "react-toastify";
import "./Register.css";

export default function Register() {
  const [showpassword, setshowpassword] = useState(false);

  const initialValues = {
    name: "",
    email: "",
    password: "",
    confirm_password: "",
  };

  const handleClick = () => {
    setshowpassword(!showpassword);
  };

  const API_URL = import.meta.env.VITE_API_URL;

  const handleGoogleClick = () => {
    window.location.href = `${API_URL}/auth/google`;
  };

  const { values, handleBlur, handleChange, handleSubmit, errors, touched } =
    useFormik({
      initialValues: initialValues,
      validationSchema: validateSchema,
      onSubmit: async (values, action) => {
        try {
          const response = await fetch(`${API_URL}/api/register`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              name: values.name,
              email: values.email,
              password: values.password,
            }),
          });

          const result = await response.json();

          if (response.ok) {
            toast.success("Registration successful! Please log in.");
            setTimeout(() => {
              window.location.href = "/login";
            }, 1000);
          } else {
            toast.error(`Registration failed: ${result.message}`);
          }
        } catch (error) {
          toast.error("An error occurred. Please try again.");
        }
        action.resetForm();
      },
    });

  return (
    <div className="register-page">
      <div className="register-container">
        <h2 className="register-title">Create Account</h2>

        <form onSubmit={handleSubmit}>
          {/* Name */}
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input
              type="name"
              autoComplete="off"
              name="name"
              value={values.name}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Enter your name"
              className={`form-input ${
                errors.name && touched.name ? "input-error" : ""
              }`}
            />
            {errors.name && touched.name && (
              <p className="form-error">{errors.name}</p>
            )}
          </div>

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

          {/* Confirm Password */}
          <div className="form-group">
            <label className="form-label">Confirm Password</label>
            <div className="input-container">
              <input
                type={showpassword ? "text" : "password"}
                autoComplete="off"
                placeholder="Confirm password"
                name="confirm_password"
                value={values.confirm_password}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`form-input ${
                  errors.confirm_password && touched.confirm_password
                    ? "input-error"
                    : ""
                }`}
              />
              <span onClick={handleClick} className="password-toggle-icon">
                {showpassword ? <FaEye /> : <FaEyeSlash />}
              </span>
            </div>
            {errors.confirm_password && touched.confirm_password && (
              <p className="form-error">{errors.confirm_password}</p>
            )}
          </div>

          {/* Submit Button */}
          <button type="submit" className="submit-button">
            Sign Up
          </button>

          {/* Google Button */}
          <button
            onClick={handleGoogleClick}
            type="button"
            className="google-button"
          >
            <FcGoogle size={20} /> Continue with Google
          </button>
        </form>

        {/* Login Link */}
        <p className="login-link">
          Already have an account?{" "}
          <Link to="/login" className="login-link-anchor">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
