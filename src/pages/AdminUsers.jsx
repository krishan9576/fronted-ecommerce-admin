import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const AdminUsers = () => {
  // ======================================================
  // NAVIGATION
  // ======================================================

  const navigate = useNavigate();

  // ======================================================
  // USERS
  // ======================================================

  const [users, setUsers] = useState([]);

  // ======================================================
  // PAGINATION
  // ======================================================

  const [page, setPage] = useState(1);
  const [limit] = useState(5);

  const [totalUsers, setTotalUsers] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  // ======================================================
  // SEARCH
  // ======================================================

  const [search, setSearch] = useState("");

  // ======================================================
  // LOADING
  // ======================================================

  const [loading, setLoading] = useState(true);

  // ======================================================
  // DELETE LOADING
  // ======================================================

  const [deletingUserId, setDeletingUserId] = useState(null);

  // ======================================================
  // FETCH USERS
  // ======================================================

  const fetchUsers = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      const response = await fetch(
        `http://localhost:5000/api/admin/users?page=${page}&limit=${limit}&search=${encodeURIComponent(
          search
        )}`,
        {
          method: "GET",

          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      console.log("Users Response:", data);

      // ==================================================
      // RESPONSE ERROR
      // ==================================================

      if (!response.ok) {
        alert(data.message || "Failed to fetch users");
        return;
      }

      // ==================================================
      // SET USERS
      // ==================================================

      setUsers(data.users || []);

      setTotalUsers(data.totalUsers || 0);

      setTotalPages(data.totalPages || 1);
    } catch (error) {
      console.error("Fetch Users Error:", error);

      alert("Server error");
    } finally {
      setLoading(false);
    }
  };

  // ======================================================
  // VIEW USER
  // ======================================================

  const handleViewUser = (userId) => {
    if (!userId) {
      alert("Invalid user ID");
      return;
    }

    navigate(`/admin/users/${userId}`);
  };

  // ======================================================
  // DELETE USER
  // ======================================================

  const handleDeleteUser = async (userId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this user?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      setDeletingUserId(userId);

      const token = localStorage.getItem("token");

      const response = await fetch(
        `http://localhost:5000/api/admin/users/${userId}`,
        {
          method: "DELETE",

          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      console.log("Delete User Response:", data);

      // ==================================================
      // ERROR
      // ==================================================

      if (!response.ok) {
        alert(data.message || "Failed to delete user");
        return;
      }

      // ==================================================
      // SUCCESS
      // ==================================================

      alert("User deleted successfully");

      // ==================================================
      // REFRESH USERS
      // ==================================================

      fetchUsers();
    } catch (error) {
      console.error("Delete User Error:", error);

      alert("Server error");
    } finally {
      setDeletingUserId(null);
    }
  };

  // ======================================================
  // SEARCH HANDLER
  // ======================================================

  const handleSearch = (e) => {
    setSearch(e.target.value);

    setPage(1);
  };

  // ======================================================
  // CLEAR SEARCH
  // ======================================================

  const handleClearSearch = () => {
    setSearch("");

    setPage(1);
  };

  // ======================================================
  // FETCH WHEN PAGE / SEARCH CHANGES
  // ======================================================

  useEffect(() => {
    fetchUsers();
  }, [page, search]);

  // ======================================================
  // LOADING
  // ======================================================

  if (loading) {
    return (
      <div
        style={{
          padding: "20px",
          color: "#222",
        }}
      >
        <h2>Loading Users...</h2>
      </div>
    );
  }

  // ======================================================
  // UI
  // ======================================================

  return (
    <>
      {/* ==================================================
          RESPONSIVE CSS
      ================================================== */}

      <style>
        {`

          .users-page {
            width: 100%;
            max-width: 100%;
            overflow-x: hidden;
          }

          .users-heading {
            font-size: 32px;
            margin-top: 0;
            margin-bottom: 20px;
          }

          .users-search {
            width: 100%;
            max-width: 500px;

            display: flex;
            align-items: center;

            gap: 10px;

            margin-bottom: 20px;
          }

          .users-search input {
            flex: 1;

            width: 100%;

            padding: 10px;

            font-size: 14px;

            border: 1px solid #aaa;

            border-radius: 5px;

            box-sizing: border-box;
          }

          .clear-search-button {
            padding: 10px 15px;

            background-color: #6c757d;

            color: #fff;

            border: none;

            border-radius: 5px;

            cursor: pointer;

            white-space: nowrap;
          }

          .clear-search-button:hover {
            background-color: #5a6268;
          }

          .users-table-wrapper {
            width: 100%;
            max-width: 100%;

            overflow-x: auto;
            overflow-y: hidden;

            -webkit-overflow-scrolling: touch;

            border: 1px solid #ddd;
          }

          .users-table {
            width: 100%;

            min-width: 1000px;

            border-collapse: collapse;

            background-color: #fff;

            color: #222;
          }

          .users-table th,
          .users-table td {
            padding: 10px;

            border: 1px solid #ddd;

            white-space: nowrap;
          }

          .users-table th {
            background-color: #ddd;

            font-weight: 700;
          }

          .user-actions {
            display: flex;

            align-items: center;

            gap: 8px;
          }

          .view-user-button {
            padding: 7px 12px;

            border: none;

            border-radius: 5px;

            background-color: #0d6efd;

            color: white;

            cursor: pointer;

            font-weight: 600;
          }

          .view-user-button:hover {
            background-color: #0b5ed7;
          }

          .delete-user-button {
            padding: 7px 12px;

            border: none;

            border-radius: 5px;

            background-color: #dc3545;

            color: white;

            cursor: pointer;

            font-weight: 600;
          }

          .delete-user-button:hover {
            background-color: #c82333;
          }

          .delete-user-button:disabled {
            opacity: 0.6;

            cursor: not-allowed;
          }

          .users-pagination {
            display: flex;

            align-items: center;

            gap: 15px;

            flex-wrap: wrap;
          }

          .users-pagination button {
            padding: 8px 15px;

            cursor: pointer;

            border: 1px solid #aaa;

            border-radius: 5px;

            background-color: white;
          }

          .users-pagination button:hover:not(:disabled) {
            background-color: #f0f0f0;
          }

          .users-pagination button:disabled {
            cursor: not-allowed;

            opacity: 0.5;
          }

          .users-count {
            margin-bottom: 15px;
          }

          @media (max-width: 600px) {

            .users-page {
              padding: 15px !important;
            }

            .users-heading {
              font-size: 25px;

              line-height: 1.2;
            }

            .users-search {
              width: 100%;

              max-width: 100%;
            }

            .users-search input {
              padding: 12px;

              font-size: 16px;
            }

            .clear-search-button {
              padding: 12px 15px;
            }

            .users-table-wrapper {
              width: 100%;

              overflow-x: auto;
            }

            .users-table {
              min-width: 1000px;
            }

            .users-pagination {
              justify-content: center;

              gap: 10px;
            }

          }

        `}
      </style>

      {/* ==================================================
          MAIN CONTAINER
      ================================================== */}

      <div
        className="users-page"
        style={{
          color: "#222",

          backgroundColor: "#f5f5f5",

          minHeight: "100vh",

          padding: "20px",

          boxSizing: "border-box",
        }}
      >
        {/* ==================================================
            HEADING
        ================================================== */}

        <h1 className="users-heading">
          Users Management
        </h1>

        {/* ==================================================
            TOTAL USERS
        ================================================== */}

        <h3 className="users-count">
          Total Users: {totalUsers}
        </h3>

        {/* ==================================================
            SEARCH
        ================================================== */}

        <div className="users-search">
          <input
            type="text"
            placeholder="Search user name or email..."
            value={search}
            onChange={handleSearch}
          />

          {/* CLEAR */}

          {search && (
            <button
              type="button"
              className="clear-search-button"
              onClick={handleClearSearch}
            >
              Clear
            </button>
          )}
        </div>

        {/* ==================================================
            USERS TABLE
        ================================================== */}

        <div className="users-table-wrapper">
          <table className="users-table">
            <thead>
              <tr>
                <th>User ID</th>

                <th>Name</th>

                <th>Email</th>

                <th>Role</th>

                <th>Created At</th>

                <th>Updated At</th>

                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {users.length > 0 ? (
                users.map((user) => (
                  <tr key={user._id}>
                    {/* USER ID */}

                    <td>{user._id}</td>

                    {/* NAME */}

                    <td>{user.name || "N/A"}</td>

                    {/* EMAIL */}

                    <td>{user.email || "N/A"}</td>

                    {/* ROLE */}

                    <td>{user.role || "user"}</td>

                    {/* CREATED AT */}

                    <td>
                      {user.createdAt
                        ? new Date(
                            user.createdAt
                          ).toLocaleString("en-IN")
                        : "N/A"}
                    </td>

                    {/* UPDATED AT */}

                    <td>
                      {user.updatedAt
                        ? new Date(
                            user.updatedAt
                          ).toLocaleString("en-IN")
                        : "N/A"}
                    </td>

                    {/* ACTIONS */}

                    <td>
                      <div className="user-actions">
                        {/* VIEW */}

                        <button
                          type="button"
                          className="view-user-button"
                          onClick={() =>
                            handleViewUser(user._id)
                          }
                        >
                          👁 View
                        </button>

                        {/* DELETE */}

                        <button
                          type="button"
                          className="delete-user-button"
                          disabled={
                            deletingUserId === user._id
                          }
                          onClick={() =>
                            handleDeleteUser(user._id)
                          }
                        >
                          {deletingUserId === user._id
                            ? "Deleting..."
                            : "Delete"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="7"
                    style={{
                      textAlign: "center",

                      padding: "20px",
                    }}
                  >
                    {search
                      ? "No users found for this search"
                      : "No users found"}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <br />

        {/* ==================================================
            PAGINATION
        ================================================== */}

        <div className="users-pagination">
          {/* PREVIOUS */}

          <button
            type="button"
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
          >
            Previous
          </button>

          {/* PAGE */}

          <span>
            Page {page} of {totalPages}
          </span>

          {/* NEXT */}

          <button
            type="button"
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
          >
            Next
          </button>
        </div>
      </div>
    </>
  );
};

export default AdminUsers;