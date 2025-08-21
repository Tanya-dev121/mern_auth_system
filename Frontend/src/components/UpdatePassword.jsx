import React, { useState } from "react";
import {
  TextField,
  Button,
  CircularProgress,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { GrPowerReset } from "react-icons/gr";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Link } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { toast } from "react-toastify";
import "./updatePassword.css";

export default function UpdatePassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [loading, setLoading] = useState(false);
  const [showpassword, setshowpassword] = useState(false);
  const API_URL = import.meta.env.VITE_API_URL;

  const handleClick = () => {
    setshowpassword(!showpassword);
  };

  const validationSchema = Yup.object({
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), null], "Passwords must match")
      .required("Confirm password is required"),
  });

  const formik = useFormik({
    initialValues: {
      password: "",
      confirmPassword: "",
    },
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      setLoading(true);
      try {
        const response = await fetch(`${API_URL}/api/update/password`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            token: token,
            password: values.password,
          }),
        });

        if (response.ok) {
          toast.success("Password has been updated successfully!");
          navigate("/login");
        } else {
          const result = await response.json();
          toast.error(`Error: ${result.message}`);
        }
      } catch (error) {
        toast.error("An error occurred. Please try again.");
      } finally {
        setLoading(false);
        resetForm();
      }
    },
  });

  if (!token) {
    return (
      <div className="invalid-link-page">
        <p className="invalid-link-message">
          Invalid link. Please request a new password reset.
        </p>
      </div>
    );
  }

  return (
    <div className="update-password-page">
      <div className="update-password-container">
        <div className="update-password-header">
          <GrPowerReset size={48} color="#6B73FF" />
          <h2 className="update-password-title">Update Your Password</h2>
          <p className="update-password-subtitle">
            Enter and confirm your new password
          </p>
        </div>

        <form onSubmit={formik.handleSubmit}>
          {/* New Password Field */}
          <div className="form-group">
            <TextField
              type={showpassword ? "text" : "password"}
              label="New Password"
              fullWidth
              size="small"
              variant="outlined"
              id="password"
              name="password"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClick}
                      onMouseDown={(e) => e.preventDefault()}
                      edge="end"
                    >
                      {showpassword ? <FaEye /> : <FaEyeSlash />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            {formik.touched.password && formik.errors.password && (
              <div className="form-error">{formik.errors.password}</div>
            )}
          </div>

          {/* Confirm Password Field */}
          <div className="form-group">
            <TextField
              type={showpassword ? "text" : "password"}
              label="Confirm New Password"
              fullWidth
              size="small"
              variant="outlined"
              id="confirmPassword"
              name="confirmPassword"
              value={formik.values.confirmPassword}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClick}
                      onMouseDown={(e) => e.preventDefault()}
                      edge="end"
                    >
                      {showpassword ? <FaEye /> : <FaEyeSlash />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            {formik.touched.confirmPassword &&
              formik.errors.confirmPassword && (
                <div className="form-error">
                  {formik.errors.confirmPassword}
                </div>
              )}
          </div>

          {/* Update Button */}
          <Button
            type="submit"
            variant="contained"
            fullWidth
            disabled={loading}
            className="submit-button"
            sx={{
              background: "linear-gradient(45deg, #6B73FF, #000DFF)",
              textTransform: "none",
              fontWeight: "bold",
              borderRadius: "8px",
              marginBottom: "18px",
              "&:hover": {
                background: "linear-gradient(45deg, #000DFF, #6B73FF)",
              },
            }}
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Update Password"
            )}
          </Button>
        </form>

        {/* Back to Login Button */}
        <div className="back-button-container">
          <Button
            variant="outlined"
            fullWidth
            className="back-button"
            sx={{
              textTransform: "none",
              fontWeight: "bold",
              color: "#6B73FF",
              borderColor: "#6B73FF",
              borderRadius: "8px",
              "&:hover": {
                backgroundColor: "#6B73FF",
                color: "#fff",
              },
            }}
            component={Link}
            to="/login"
          >
            Back to Login
          </Button>
        </div>
      </div>
    </div>
  );
}
