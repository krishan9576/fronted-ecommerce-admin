import { Navigate } from "react-router-dom";

const AdminRoute = ({ children }) => {
  const token = localStorage.getItem("token");

  const userData = localStorage.getItem("user");

  // Token नहीं है
  if (!token) {
    return (
      <Navigate
        to="/admin/login"
        replace
      />
    );
  }

  // User data नहीं है
  if (!userData) {
    return (
      <Navigate
        to="/admin/login"
        replace
      />
    );
  }

  let user;

  try {
    user = JSON.parse(userData);
  } catch (error) {
    localStorage.removeItem("user");

    return (
      <Navigate
        to="/admin/login"
        replace
      />
    );
  }

  // User admin नहीं है
  if (user?.role !== "admin") {
    return (
      <Navigate
        to="/admin/login"
        replace
      />
    );
  }

  // Admin है
  return children;
};

export default AdminRoute;

