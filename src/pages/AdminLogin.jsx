import { useState } from "react";
import { useNavigate } from "react-router-dom";

import API_URL from "../config/api";

const AdminLogin = () => {
  const navigate = useNavigate();

  // ======================================================
  // LOGIN FORM
  // ======================================================

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // ======================================================
  // LOGIN
  // ======================================================

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      // ==================================================
      // LOGIN API
      // ==================================================

      const response = await fetch(
        `${API_URL}/api/auth/login`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            email,
            password,
          }),
        }
      );

      // ==================================================
      // RESPONSE
      // ==================================================

      const data = await response.json();

      console.log("Login Response:", data);

      // ==================================================
      // LOGIN FAILED
      // ==================================================

      if (!response.ok) {
        alert(
          data.message ||
            "Login failed"
        );

        return;
      }

      // ==================================================
      // CHECK TOKEN
      // ==================================================

      if (!data.token) {
        alert("Token not received");

        return;
      }

      // ==================================================
      // CHECK USER
      // ==================================================

      if (!data.user) {
        alert(
          "User information not found"
        );

        return;
      }

      // ==================================================
      // ADMIN CHECK
      // ==================================================

      if (data.user.role !== "admin") {
        alert(
          "Access denied. Admin only."
        );

        // Remove login data
        localStorage.removeItem(
          "token"
        );

        localStorage.removeItem(
          "user"
        );

        return;
      }

      // ==================================================
      // SAVE TOKEN
      // ==================================================

      localStorage.setItem(
        "token",
        data.token
      );

      // ==================================================
      // SAVE USER
      // ==================================================

      localStorage.setItem(
        "user",
        JSON.stringify(data.user)
      );

      // ==================================================
      // SUCCESS
      // ==================================================

      alert(
        "Admin Login successful"
      );

      // ==================================================
      // GO TO ADMIN DASHBOARD
      // ==================================================

      navigate(
        "/admin/dashboard",
        {
          replace: true,
        }
      );

    } catch (error) {
      console.error(
        "Login Error:",
        error
      );

      alert(
        "Server error. Please try again."
      );
    }
  };

  // ======================================================
  // UI
  // ======================================================

  return (
    <div
      style={{
        minHeight: "100vh",

        display: "flex",

        justifyContent: "center",

        alignItems: "center",

        backgroundColor: "#f5f5f5",

        padding: "20px",

        boxSizing: "border-box",
      }}
    >

      {/* ==================================================
          LOGIN CARD
      ================================================== */}

      <div
        style={{
          width: "100%",

          maxWidth: "400px",

          backgroundColor: "#ffffff",

          padding: "30px",

          borderRadius: "10px",

          boxShadow:
            "0 4px 15px rgba(0,0,0,0.1)",

          boxSizing: "border-box",
        }}
      >

        {/* ==================================================
            HEADING
        ================================================== */}

        <h1
          style={{
            textAlign: "center",

            marginBottom: "25px",

            color: "#222",
          }}
        >
          Admin Login
        </h1>

        {/* ==================================================
            FORM
        ================================================== */}

        <form
          onSubmit={handleLogin}
        >

          {/* ==================================================
              EMAIL
          ================================================== */}

          <div
            style={{
              marginBottom: "20px",
            }}
          >

            <label
              style={{
                display: "block",

                marginBottom: "7px",

                fontWeight: "600",

                color: "#333",
              }}
            >
              Email
            </label>

            <input
              type="email"
              placeholder="Enter admin email"
              value={email}
              onChange={(e) =>
                setEmail(
                  e.target.value
                )
              }
              required
              style={{
                width: "100%",

                padding: "11px",

                border:
                  "1px solid #aaa",

                borderRadius: "5px",

                fontSize: "15px",

                boxSizing:
                  "border-box",
              }}
            />

          </div>

          {/* ==================================================
              PASSWORD
          ================================================== */}

          <div
            style={{
              marginBottom: "20px",
            }}
          >

            <label
              style={{
                display: "block",

                marginBottom: "7px",

                fontWeight: "600",

                color: "#333",
              }}
            >
              Password
            </label>

            <input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) =>
                setPassword(
                  e.target.value
                )
              }
              required
              style={{
                width: "100%",

                padding: "11px",

                border:
                  "1px solid #aaa",

                borderRadius: "5px",

                fontSize: "15px",

                boxSizing:
                  "border-box",
              }}
            />

          </div>

          {/* ==================================================
              LOGIN BUTTON
          ================================================== */}

          <button
            type="submit"
            style={{
              width: "100%",

              padding: "12px",

              border: "none",

              borderRadius: "5px",

              backgroundColor:
                "#2563eb",

              color: "#ffffff",

              fontSize: "16px",

              fontWeight: "600",

              cursor: "pointer",
            }}
          >
            Login
          </button>

        </form>

      </div>

    </div>
  );
};

export default AdminLogin;