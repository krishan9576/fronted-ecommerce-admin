import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

// ======================================================
// ADMIN LAYOUT
// ======================================================

import AdminLayout from "./pages/AdminLayout";

// ======================================================
// ADMIN PROTECTED ROUTE
// ======================================================

import AdminProtectedRoute from "./pages/AdminProtectedRoute";

// ======================================================
// ADMIN LOGIN
// ======================================================

import AdminLogin from "./pages/AdminLogin";

// ======================================================
// ADMIN PAGES
// ======================================================

import AdminDashboard from "./pages/AdminDashboard";
import AdminUsers from "./pages/AdminUsers";
import AdminUserDetails from "./pages/AdminUserDetails";
import AdminProducts from "./pages/AdminProducts";
import AdminProductDetails from "./pages/AdminProductDetails";
import AdminOrders from "./pages/AdminOrders";
import AdminPayments from "./pages/AdminPayments";

// ======================================================
// APP
// ======================================================

function App() {
  return (
    <BrowserRouter>

      <Routes>

        {/* ==================================================
            ROOT
        ================================================== */}

        <Route
          path="/"
          element={
            <Navigate
              to="/admin/login"
              replace
            />
          }
        />

        {/* ==================================================
            ADMIN LOGIN
        ================================================== */}

        <Route
          path="/admin/login"
          element={
            <AdminLogin />
          }
        />

        {/* ==================================================
            ADMIN PANEL
        ================================================== */}

        <Route
          path="/admin"
          element={
            <AdminLayout />
          }
        >

          {/* ==================================================
              PROTECTED ADMIN ROUTES
          ================================================== */}

          <Route
            element={
              <AdminProtectedRoute />
            }
          >

            {/* ==================================================
                DASHBOARD
            ================================================== */}

            <Route
              path="dashboard"
              element={
                <AdminDashboard />
              }
            />

            {/* ==================================================
                USERS
            ================================================== */}

            <Route
              path="users"
              element={
                <AdminUsers />
              }
            />

            {/* ==================================================
                USER DETAILS
            ================================================== */}

            <Route
              path="users/:id"
              element={
                <AdminUserDetails />
              }
            />

            {/* ==================================================
                PRODUCTS
            ================================================== */}

            <Route
              path="products"
              element={
                <AdminProducts />
              }
            />

            {/* ==================================================
                PRODUCT DETAILS
            ================================================== */}

            <Route
              path="products/:id"
              element={
                <AdminProductDetails />
              }
            />

            {/* ==================================================
                ORDERS
            ================================================== */}

            <Route
              path="orders"
              element={
                <AdminOrders />
              }
            />

            {/* ==================================================
                PAYMENTS
            ================================================== */}

            <Route
              path="payments"
              element={
                <AdminPayments />
              }
            />

          </Route>

        </Route>

        {/* ==================================================
            INVALID ROUTE
        ================================================== */}

        <Route
          path="*"
          element={
            <Navigate
              to="/admin/login"
              replace
            />
          }
        />

      </Routes>

    </BrowserRouter>
  );
}

export default App;