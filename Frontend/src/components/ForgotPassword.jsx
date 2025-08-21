import React, { useState } from "react";
import { TextField, Button, CircularProgress } from "@mui/material";
import { GrPowerReset } from "react-icons/gr";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import "./ForgotPassword.css";

export default function ForgotPassword() {
  const API_URL = import.meta.env.VITE_API_URL;
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSendResetLink = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/forgot/password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        toast.success("A password reset link has been sent successfully!");
      } else {
        const result = await response.json();
        toast.error(`Error: ${result.message}`);
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="forgot-password-page">
      <div className="forgot-password-container">
        {/* Header */}
        <div className="forgot-password-header">
          <h2 className="forgot-password-title">Find Your Account</h2>
          <p className="forgot-password-subtitle">
            Enter your registered email
          </p>
        </div>

        {/* Email Input */}
        <div className="form-group">
          <TextField
            type="email"
            label="Email Address"
            fullWidth
            size="small"
            variant="outlined"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            sx={{
              borderRadius: "8px",
              "& .MuiOutlinedInput-root": {
                borderRadius: "8px",
                boxShadow: "0 1px 4px rgba(107, 115, 255, 0.3)",
                transition: "box-shadow 0.3s ease",
                "&:hover": {
                  boxShadow: "0 2px 8px rgba(107, 115, 255, 0.5)",
                },
                "&.Mui-focused": {
                  boxShadow: "0 0 8px 2px rgba(107, 115, 255, 0.7)",
                },
              },
            }}
          />
        </div>

        {/* Send OTP Button */}
        <Button
          onClick={handleSendResetLink}
          disabled={loading}
          variant="contained"
          fullWidth
          className="submit-button"
          sx={{
            background: "linear-gradient(45deg, #6B73FF, #000DFF)",
            textTransform: "none",
            fontWeight: "bold",
            borderRadius: "8px",
            marginBottom: "18px",
            transition: "background 0.3s ease",
            "&:hover": {
              background: "linear-gradient(45deg, #000DFF, #6B73FF)",
            },
          }}
        >
          {loading ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            "Send Reset Link"
          )}
        </Button>

        {/* Back to Login Button */}
        <Link to="/login" style={{ textDecoration: "none" }}>
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
              transition: "all 0.3s ease",
              "&:hover": {
                backgroundColor: "#6B73FF",
                color: "#fff",
              },
            }}
          >
            Back to Login
          </Button>
        </Link>
      </div>
    </div>
  );
}
