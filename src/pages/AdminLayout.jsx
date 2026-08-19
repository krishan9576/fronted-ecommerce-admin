import {
  Link,
  Outlet,
  useLocation,
  useNavigate,
} from "react-router-dom";

import "./AdminLayout.css";

const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // ======================================================
  // LOGOUT
  // ======================================================

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/admin/login", {
      replace: true,
    });
  };

  // ======================================================
  // ACTIVE LINK
  // ======================================================

  const isActive = (path) => {
    // Dashboard
    if (path === "/admin/dashboard") {
      return location.pathname === "/admin/dashboard";
    }

    // Products
    // /admin/products
    // /admin/products/:id
    if (path === "/admin/products") {
      return (
        location.pathname === "/admin/products" ||
        location.pathname.startsWith("/admin/products/")
      );
    }

    // Other pages
    return location.pathname === path;
  };

  // ======================================================
  // LINK STYLE
  // ======================================================

  const getLinkStyle = (path) => {
    const active = isActive(path);

    return {
      display: "block",

      padding: "12px 15px",

      marginBottom: "8px",

      borderRadius: "8px",

      textDecoration: "none",

      color: active
        ? "#ffffff"
        : "#374151",

      backgroundColor: active
        ? "#2563eb"
        : "transparent",

      fontWeight: active
        ? "600"
        : "400",

      whiteSpace: "nowrap",

      transition:
        "all 0.2s ease",
    };
  };

  // ======================================================
  // COMPONENT
  // ======================================================

  return (
    <div className="admin-container">

      {/* ==================================================
          SIDEBAR
      ================================================== */}

      <aside className="admin-sidebar">

        {/* ==================================================
            LOGO
        ================================================== */}

        <h2 className="admin-logo">
          Admin Panel
        </h2>


        {/* ==================================================
            NAVIGATION
        ================================================== */}

        <nav className="admin-nav">

          {/* DASHBOARD */}

          <Link
            to="/admin/dashboard"
            style={getLinkStyle(
              "/admin/dashboard"
            )}
          >
            Dashboard
          </Link>


          {/* USERS */}

          <Link
            to="/admin/users"
            style={getLinkStyle(
              "/admin/users"
            )}
          >
            Users
          </Link>


          {/* PRODUCTS */}

          <Link
            to="/admin/products"
            style={getLinkStyle(
              "/admin/products"
            )}
          >
            Products
          </Link>


          {/* ORDERS */}

          <Link
            to="/admin/orders"
            style={getLinkStyle(
              "/admin/orders"
            )}
          >
            Orders
          </Link>


          {/* PAYMENTS */}

          <Link
            to="/admin/payments"
            style={getLinkStyle(
              "/admin/payments"
            )}
          >
            Payments
          </Link>

        </nav>


        {/* ==================================================
            LOGOUT
        ================================================== */}

        <button
          type="button"
          onClick={handleLogout}
          className="admin-logout"
        >
          Logout
        </button>

      </aside>


      {/* ==================================================
          MAIN CONTENT
      ================================================== */}

      <main className="admin-main">

        <Outlet />

      </main>

    </div>
  );
};

export default AdminLayout;