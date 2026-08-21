import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const AdminUserDetails = () => {
  // ======================================================
  // API BASE URL
  // ======================================================

  const API_BASE_URL =
    "https://ecommerce-admin-bcrm.onrender.com";

  // ======================================================
  // NAVIGATION
  // ======================================================

  const navigate = useNavigate();

  // ======================================================
  // USER ID
  // ======================================================

  const { id } = useParams();

  // ======================================================
  // STATES
  // ======================================================

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ======================================================
  // FETCH USER
  // ======================================================

  const fetchUser = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      console.log("Token exists:", !!token);
      console.log(
        "Fetching User Details From:",
        `${API_BASE_URL}/api/admin/users/${id}`
      );

      if (!token) {
        alert("Admin login token not found. Please login again.");
        navigate("/admin/login");
        return;
      }

      const response = await fetch(
        `${API_BASE_URL}/api/admin/users/${id}`,
        {
          method: "GET",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(
        "User Details Response Status:",
        response.status
      );

      const data = await response.json();

      console.log(
        "User Details Response:",
        data
      );

      // ==================================================
      // RESPONSE ERROR
      // ==================================================

      if (!response.ok) {
        alert(
          data.message ||
            "Failed to fetch user"
        );

        setUser(null);

        return;
      }

      // ==================================================
      // SET USER
      // ==================================================

      setUser(
        data.user || null
      );
    } catch (error) {
      console.error(
        "Fetch User Details Error:",
        error
      );

      alert(
        "Unable to connect to backend server."
      );

      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // ======================================================
  // USE EFFECT
  // ======================================================

  useEffect(() => {
    if (id) {
      fetchUser();
    }
  }, [id]);

  // ======================================================
  // LOADING
  // ======================================================

  if (loading) {
    return (
      <div
        style={{
          padding: "20px",
          color: "#222",
          backgroundColor: "#f5f5f5",
          minHeight: "100vh",
        }}
      >
        <h2>
          Loading User...
        </h2>
      </div>
    );
  }

  // ======================================================
  // USER NOT FOUND
  // ======================================================

  if (!user) {
    return (
      <div
        style={{
          padding: "20px",
          color: "#222",
          backgroundColor: "#f5f5f5",
          minHeight: "100vh",
        }}
      >
        <h2>
          User not found
        </h2>

        <button
          type="button"
          onClick={() =>
            navigate("/admin/users")
          }
          style={{
            marginTop: "15px",
            padding: "10px 18px",
            border: "none",
            borderRadius: "5px",
            backgroundColor: "#007bff",
            color: "#fff",
            cursor: "pointer",
          }}
        >
          ← Back to Users
        </button>
      </div>
    );
  }

  // ======================================================
  // UI
  // ======================================================

  return (
    <>
      <style>
        {`

          .user-details-page {
            width: 100%;
            min-height: 100vh;
            background-color: #f5f5f5;
            color: #222;
            padding: 20px;
            box-sizing: border-box;
          }

          .user-details-heading {
            margin-top: 0;
            margin-bottom: 25px;
            font-size: 32px;
          }

          .user-details-card {
            width: 100%;
            max-width: 800px;
            background-color: #fff;
            border: 1px solid #ddd;
            border-radius: 10px;
            padding: 25px;
            box-sizing: border-box;
            box-shadow: 0 3px 10px rgba(0,0,0,0.08);
          }

          .user-detail-row {
            display: grid;
            grid-template-columns: 180px 1fr;
            gap: 20px;
            padding: 15px 0;
            border-bottom: 1px solid #eee;
          }

          .user-detail-row:last-child {
            border-bottom: none;
          }

          .user-detail-label {
            font-weight: 700;
            color: #555;
          }

          .user-detail-value {
            color: #222;
            word-break: break-word;
          }

          .user-details-actions {
            display: flex;
            gap: 10px;
            flex-wrap: wrap;
            margin-top: 25px;
          }

          .back-button {
            padding: 10px 18px;
            border: none;
            border-radius: 5px;
            background-color: #6c757d;
            color: white;
            cursor: pointer;
            font-weight: 600;
          }

          .back-button:hover {
            background-color: #5a6268;
          }

          .edit-user-button {
            padding: 10px 18px;
            border: none;
            border-radius: 5px;
            background-color: #007bff;
            color: white;
            cursor: pointer;
            font-weight: 600;
          }

          .edit-user-button:hover {
            background-color: #0069d9;
          }

          @media (max-width: 600px) {

            .user-details-page {
              padding: 15px;
            }

            .user-details-heading {
              font-size: 25px;
            }

            .user-details-card {
              padding: 18px;
            }

            .user-detail-row {
              grid-template-columns: 1fr;
              gap: 5px;
            }

          }

        `}
      </style>

      <div className="user-details-page">

        {/* HEADING */}

        <h1 className="user-details-heading">
          User Details
        </h1>

        {/* CARD */}

        <div className="user-details-card">

          {/* NAME */}

          <div className="user-detail-row">

            <div className="user-detail-label">
              Name
            </div>

            <div className="user-detail-value">
              {user.name || "N/A"}
            </div>

          </div>

          {/* EMAIL */}

          <div className="user-detail-row">

            <div className="user-detail-label">
              Email
            </div>

            <div className="user-detail-value">
              {user.email || "N/A"}
            </div>

          </div>

          {/* ROLE */}

          <div className="user-detail-row">

            <div className="user-detail-label">
              Role
            </div>

            <div className="user-detail-value">
              {user.role || "user"}
            </div>

          </div>

          {/* USER ID */}

          <div className="user-detail-row">

            <div className="user-detail-label">
              User ID
            </div>

            <div className="user-detail-value">
              {user._id || "N/A"}
            </div>

          </div>

          {/* CREATED AT */}

          <div className="user-detail-row">

            <div className="user-detail-label">
              Created At
            </div>

            <div className="user-detail-value">

              {user.createdAt
                ? new Date(
                    user.createdAt
                  ).toLocaleString("en-IN")
                : "N/A"}

            </div>

          </div>

          {/* UPDATED AT */}

          <div className="user-detail-row">

            <div className="user-detail-label">
              Updated At
            </div>

            <div className="user-detail-value">

              {user.updatedAt
                ? new Date(
                    user.updatedAt
                  ).toLocaleString("en-IN")
                : "N/A"}

            </div>

          </div>

          {/* ACTIONS */}

          <div className="user-details-actions">

            {/* BACK */}

            <button
              type="button"
              className="back-button"
              onClick={() =>
                navigate("/admin/users")
              }
            >
              ← Back to Users
            </button>

            {/* EDIT */}

            <button
              type="button"
              className="edit-user-button"
              onClick={() =>
                navigate("/admin/users")
              }
            >
              Edit User
            </button>

          </div>

        </div>

      </div>
    </>
  );
};

export default AdminUserDetails;