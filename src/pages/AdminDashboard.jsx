import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

const AdminDashboard = () => {
  // ======================================================
  // NAVIGATE
  // ======================================================

  const navigate = useNavigate();

  // ======================================================
  // DASHBOARD STATS
  // ======================================================

  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProducts: 0,
    totalOrders: 0,
    totalPayments: 0,

    orderStatus: {
      Pending: 0,
      Processing: 0,
      Shipped: 0,
      Delivered: 0,
      Cancelled: 0,
    },

    recentOrders: [],
  });

  // ======================================================
  // STATES
  // ======================================================

  const [loading, setLoading] = useState(true);

  const [statusFilter, setStatusFilter] =
    useState("All");

  const [searchOrder, setSearchOrder] =
    useState("");

  // ======================================================
  // PAGINATION
  // ======================================================

  const [orderPage, setOrderPage] =
    useState(1);

  const ordersPerPage = 5;

  // ======================================================
  // FETCH DASHBOARD
  // ======================================================

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);

      const token =
        localStorage.getItem("token");

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/admin/dashboard`,
        {
          method: "GET",

          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

      const data =
        await response.json();

      console.log(
        "Dashboard Response:",
        data
      );

      if (!response.ok) {
        alert(
          data.message ||
            "Failed to fetch dashboard"
        );

        return;
      }

      setStats(
        data.stats || {
          totalUsers: 0,
          totalProducts: 0,
          totalOrders: 0,
          totalPayments: 0,

          orderStatus: {
            Pending: 0,
            Processing: 0,
            Shipped: 0,
            Delivered: 0,
            Cancelled: 0,
          },

          recentOrders: [],
        }
      );

    } catch (error) {
      console.error(
        "Dashboard Error:",
        error
      );

      alert("Server error");

    } finally {
      setLoading(false);
    }
  };

  // ======================================================
  // USE EFFECT
  // ======================================================

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  // ======================================================
  // STATUS STYLE
  // ======================================================

  const getStatusStyle = (status) => {
    switch (status) {
      case "Pending":
        return {
          backgroundColor: "#fff3cd",
          color: "#856404",
          padding: "5px 10px",
          borderRadius: "15px",
          fontWeight: "bold",
          display: "inline-block",
        };

      case "Processing":
        return {
          backgroundColor: "#cfe2ff",
          color: "#084298",
          padding: "5px 10px",
          borderRadius: "15px",
          fontWeight: "bold",
          display: "inline-block",
        };

      case "Shipped":
        return {
          backgroundColor: "#e2d9f3",
          color: "#432874",
          padding: "5px 10px",
          borderRadius: "15px",
          fontWeight: "bold",
          display: "inline-block",
        };

      case "Delivered":
        return {
          backgroundColor: "#d1e7dd",
          color: "#0f5132",
          padding: "5px 10px",
          borderRadius: "15px",
          fontWeight: "bold",
          display: "inline-block",
        };

      case "Cancelled":
        return {
          backgroundColor: "#f8d7da",
          color: "#842029",
          padding: "5px 10px",
          borderRadius: "15px",
          fontWeight: "bold",
          display: "inline-block",
        };

      default:
        return {
          backgroundColor: "#e5e7eb",
          color: "#374151",
          padding: "5px 10px",
          borderRadius: "15px",
          fontWeight: "bold",
          display: "inline-block",
        };
    }
  };

  // ======================================================
  // LOADING
  // ======================================================

  if (loading) {
    return (
      <div
        style={{
          padding: "20px",
          color: "#111827",
        }}
      >
        <h2>
          Loading Dashboard...
        </h2>
      </div>
    );
  }

  // ======================================================
  // FILTER ORDERS
  // ======================================================

  const filteredOrders =
    (stats.recentOrders || [])
      .filter((order) => {

        const statusMatch =
          statusFilter === "All" ||
          order.status ===
            statusFilter;

        const search =
          searchOrder
            .toLowerCase()
            .trim();

        const orderId =
          order._id?.toLowerCase() ||
          "";

        const userName =
          order.user?.name
            ?.toLowerCase() || "";

        const userEmail =
          order.user?.email
            ?.toLowerCase() || "";

        const searchMatch =
          orderId.includes(search) ||
          userName.includes(search) ||
          userEmail.includes(search);

        return (
          statusMatch &&
          searchMatch
        );
      });

  // ======================================================
  // PAGINATION
  // ======================================================

  const totalOrderPages =
    Math.max(
      1,
      Math.ceil(
        filteredOrders.length /
          ordersPerPage
      )
    );

  const safeOrderPage =
    Math.min(
      orderPage,
      totalOrderPages
    );

  const startIndex =
    (safeOrderPage - 1) *
    ordersPerPage;

  const endIndex =
    startIndex +
    ordersPerPage;

  const currentOrders =
    filteredOrders.slice(
      startIndex,
      endIndex
    );

  // ======================================================
  // SEARCH HANDLER
  // ======================================================

  const handleSearch = (e) => {
    setSearchOrder(
      e.target.value
    );

    setOrderPage(1);
  };

  // ======================================================
  // STATUS FILTER HANDLER
  // ======================================================

  const handleStatusChange = (e) => {
    setStatusFilter(
      e.target.value
    );

    setOrderPage(1);
  };

  // ======================================================
  // BAR CHART DATA
  // ======================================================

  const barChartData = [
    {
      status: "Pending",
      orders:
        stats.orderStatus
          ?.Pending || 0,
    },
    {
      status: "Processing",
      orders:
        stats.orderStatus
          ?.Processing || 0,
    },
    {
      status: "Shipped",
      orders:
        stats.orderStatus
          ?.Shipped || 0,
    },
    {
      status: "Delivered",
      orders:
        stats.orderStatus
          ?.Delivered || 0,
    },
    {
      status: "Cancelled",
      orders:
        stats.orderStatus
          ?.Cancelled || 0,
    },
  ];

  // ======================================================
  // PIE CHART DATA
  // ======================================================

  const pieChartData = [
    {
      name: "Pending",
      value:
        stats.orderStatus
          ?.Pending || 0,
    },
    {
      name: "Processing",
      value:
        stats.orderStatus
          ?.Processing || 0,
    },
    {
      name: "Shipped",
      value:
        stats.orderStatus
          ?.Shipped || 0,
    },
    {
      name: "Delivered",
      value:
        stats.orderStatus
          ?.Delivered || 0,
    },
    {
      name: "Cancelled",
      value:
        stats.orderStatus
          ?.Cancelled || 0,
    },
  ];

  // ======================================================
  // PIE COLORS
  // ======================================================

  const PIE_COLORS = [
    "#f59e0b",
    "#3b82f6",
    "#8b5cf6",
    "#10b981",
    "#ef4444",
  ];

  // ======================================================
  // CARD STYLE
  // ======================================================

  const cardStyle = {
    border: "1px solid #ddd",
    padding: "20px",
    borderRadius: "10px",
    backgroundColor: "#fff",
    boxSizing: "border-box",
    cursor: "pointer",
    transition:
      "transform 0.2s ease, box-shadow 0.2s ease",
  };

  // ======================================================
  // UI
  // ======================================================

  return (
    <div
      style={{
        padding: "20px",
        width: "100%",
        maxWidth: "100%",
        boxSizing: "border-box",
        overflowX: "hidden",
        color: "#111827",
      }}
    >

      {/* ==================================================
          DASHBOARD HEADING
      ================================================== */}

      <div
        style={{
          display: "flex",
          justifyContent:
            "space-between",
          alignItems: "center",
          gap: "15px",
          flexWrap: "wrap",
          marginBottom: "20px",
        }}
      >
        <h1
          style={{
            margin: 0,
            fontSize: "28px",
          }}
        >
          Admin Dashboard
        </h1>

        <button
          onClick={
            fetchDashboardStats
          }
          style={{
            padding: "9px 15px",
            border: "none",
            borderRadius: "6px",
            backgroundColor:
              "#2563eb",
            color: "#fff",
            cursor: "pointer",
            fontWeight: "600",
          }}
        >
          Refresh Dashboard
        </button>
      </div>

      {/* ==================================================
          STATS CARDS
      ================================================== */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "15px",
          marginBottom: "35px",
          width: "100%",
        }}
      >

        {/* USERS */}

        <div
          onClick={() =>
            navigate("/admin/users")
          }
          style={cardStyle}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform =
              "translateY(-4px)";
            e.currentTarget.style.boxShadow =
              "0 6px 15px rgba(0,0,0,0.12)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform =
              "translateY(0)";
            e.currentTarget.style.boxShadow =
              "none";
          }}
        >
          <h3
            style={{
              marginTop: 0,
            }}
          >
            👥 Total Users
          </h3>

          <p
            style={{
              fontSize: "32px",
              fontWeight: "700",
              margin: "10px 0",
            }}
          >
            {stats.totalUsers}
          </p>

          <span
            style={{
              color: "#2563eb",
              fontSize: "14px",
            }}
          >
            View Users →
          </span>
        </div>

        {/* PRODUCTS */}

        <div
          onClick={() =>
            navigate("/admin/products")
          }
          style={cardStyle}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform =
              "translateY(-4px)";
            e.currentTarget.style.boxShadow =
              "0 6px 15px rgba(0,0,0,0.12)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform =
              "translateY(0)";
            e.currentTarget.style.boxShadow =
              "none";
          }}
        >
          <h3
            style={{
              marginTop: 0,
            }}
          >
            📦 Total Products
          </h3>

          <p
            style={{
              fontSize: "32px",
              fontWeight: "700",
              margin: "10px 0",
            }}
          >
            {stats.totalProducts}
          </p>

          <span
            style={{
              color: "#2563eb",
              fontSize: "14px",
            }}
          >
            View Products →
          </span>
        </div>

        {/* ORDERS */}

        <div
          onClick={() =>
            navigate("/admin/orders")
          }
          style={cardStyle}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform =
              "translateY(-4px)";
            e.currentTarget.style.boxShadow =
              "0 6px 15px rgba(0,0,0,0.12)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform =
              "translateY(0)";
            e.currentTarget.style.boxShadow =
              "none";
          }}
        >
          <h3
            style={{
              marginTop: 0,
            }}
          >
            🛒 Total Orders
          </h3>

          <p
            style={{
              fontSize: "32px",
              fontWeight: "700",
              margin: "10px 0",
            }}
          >
            {stats.totalOrders}
          </p>

          <span
            style={{
              color: "#2563eb",
              fontSize: "14px",
            }}
          >
            View Orders →
          </span>
        </div>

        {/* PAYMENTS */}

        <div
          onClick={() =>
            navigate("/admin/payments")
          }
          style={cardStyle}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform =
              "translateY(-4px)";
            e.currentTarget.style.boxShadow =
              "0 6px 15px rgba(0,0,0,0.12)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform =
              "translateY(0)";
            e.currentTarget.style.boxShadow =
              "none";
          }}
        >
          <h3
            style={{
              marginTop: 0,
            }}
          >
            💳 Total Payments
          </h3>

          <p
            style={{
              fontSize: "32px",
              fontWeight: "700",
              margin: "10px 0",
            }}
          >
            {stats.totalPayments}
          </p>

          <span
            style={{
              color: "#2563eb",
              fontSize: "14px",
            }}
          >
            View Payments →
          </span>
        </div>

      </div>

      {/* ==================================================
          ORDER STATUS
      ================================================== */}

      <h2>
        Order Status
      </h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(130px, 1fr))",
          gap: "15px",
          marginBottom: "40px",
          width: "100%",
        }}
      >

        {[
          "Pending",
          "Processing",
          "Shipped",
          "Delivered",
          "Cancelled",
        ].map((status) => (
          <div
            key={status}
            style={{
              border:
                "1px solid #ddd",
              padding: "18px",
              borderRadius: "10px",
              textAlign: "center",
              backgroundColor:
                "#fff",
            }}
          >
            <h3>{status}</h3>

            <p
              style={{
                fontSize: "28px",
                fontWeight: "bold",
                marginBottom: 0,
              }}
            >
              {stats.orderStatus?.[
                status
              ] || 0}
            </p>
          </div>
        ))}

      </div>

      {/* ==================================================
          BAR CHART
      ================================================== */}

      <h2>
        Order Status Chart
      </h2>

      <div
        style={{
          width: "100%",
          height: "350px",
          marginBottom: "40px",
        }}
      >
        <ResponsiveContainer
          width="100%"
          height="100%"
        >
          <BarChart
            data={barChartData}
          >
            <CartesianGrid
              strokeDasharray="3 3"
            />

            <XAxis
              dataKey="status"
            />

            <YAxis
              allowDecimals={false}
            />

            <Tooltip />

            <Bar
              dataKey="orders"
              name="Orders"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* ==================================================
          PIE CHART
      ================================================== */}

      <h2>
        Order Status Distribution
      </h2>

      <div
        style={{
          width: "100%",
          height: "350px",
          marginBottom: "40px",
        }}
      >
        <ResponsiveContainer
          width="100%"
          height="100%"
        >
          <PieChart>

            <Pie
              data={pieChartData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={120}
              label
            >
              {pieChartData.map(
                (entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={
                      PIE_COLORS[
                        index %
                          PIE_COLORS.length
                      ]
                    }
                  />
                )
              )}
            </Pie>

            <Tooltip />

            <Legend />

          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* ==================================================
          RECENT ORDERS
      ================================================== */}

      <h2>
        Recent Orders
      </h2>

      {/* ==================================================
          FILTERS
      ================================================== */}

      <div
        style={{
          display: "flex",
          gap: "15px",
          flexWrap: "wrap",
          marginBottom: "20px",
          width: "100%",
        }}
      >

        {/* STATUS FILTER */}

        <div
          style={{
            flex:
              "1 1 180px",
            minWidth: 0,
          }}
        >
          <label
            style={{
              display: "block",
              marginBottom: "6px",
            }}
          >
            Filter by Status:
          </label>

          <select
            value={
              statusFilter
            }
            onChange={
              handleStatusChange
            }
            style={{
              padding: "9px",
              width: "100%",
              maxWidth: "250px",
              boxSizing:
                "border-box",
            }}
          >
            <option value="All">
              All
            </option>

            <option value="Pending">
              Pending
            </option>

            <option value="Processing">
              Processing
            </option>

            <option value="Shipped">
              Shipped
            </option>

            <option value="Delivered">
              Delivered
            </option>

            <option value="Cancelled">
              Cancelled
            </option>
          </select>
        </div>

        {/* SEARCH */}

        <div
          style={{
            flex:
              "1 1 250px",
            minWidth: 0,
          }}
        >
          <label
            style={{
              display: "block",
              marginBottom: "6px",
            }}
          >
            Search Orders:
          </label>

          <input
            type="text"
            placeholder="Search Order / User / Email..."
            value={
              searchOrder
            }
            onChange={
              handleSearch
            }
            style={{
              padding: "9px",
              width: "100%",
              maxWidth: "300px",
              boxSizing:
                "border-box",
            }}
          />
        </div>

      </div>

      {/* ==================================================
          RESULT COUNT
      ================================================== */}

      <p
        style={{
          marginBottom:
            "15px",
        }}
      >
        Showing{" "}
        {currentOrders.length}{" "}
        of{" "}
        {filteredOrders.length}{" "}
        orders
      </p>

      {/* ==================================================
          ORDERS TABLE
      ================================================== */}

      <div
        style={{
          width: "100%",
          overflowX: "auto",
          WebkitOverflowScrolling:
            "touch",
          border:
            "1px solid #ddd",
        }}
      >

        <table
          border="1"
          cellPadding="10"
          style={{
            width: "100%",
            minWidth: "900px",
            borderCollapse:
              "collapse",
            backgroundColor:
              "#fff",
          }}
        >

          <thead>
            <tr
              style={{
                backgroundColor:
                  "#f3f4f6",
              }}
            >
              <th>
                Order ID
              </th>

              <th>
                User
              </th>

              <th>
                Email
              </th>

              <th>
                Products
              </th>

              <th>
                Total Amount
              </th>

              <th>
                Status
              </th>

              <th>
                Created At
              </th>
            </tr>
          </thead>

          <tbody>

            {currentOrders.length >
            0 ? (

              currentOrders.map(
                (order) => (

                  <tr
                    key={
                      order._id
                    }
                  >

                    <td>
                      {order._id?.slice(
                        0,
                        8
                      )}
                      ...
                    </td>

                    <td>
                      {order.user
                        ?.name ||
                        "N/A"}
                    </td>

                    <td>
                      {order.user
                        ?.email ||
                        "N/A"}
                    </td>

                    <td>

                      {order.products
                        ?.length >
                      0 ? (

                        order.products.map(
                          (
                            item,
                            index
                          ) => (

                            <div
                              key={
                                item._id ||
                                index
                              }
                              style={{
                                marginBottom:
                                  "8px",
                              }}
                            >

                              <div
                                style={{
                                  fontWeight:
                                    "bold",
                                }}
                              >
                                {item
                                  .product
                                  ?.name ||
                                  "Product"}
                              </div>

                              <div>
                                ₹
                                {Number(
                                  item.price ||
                                    item
                                      .product
                                      ?.price ||
                                    0
                                ).toLocaleString(
                                  "en-IN"
                                )}

                                {" × "}

                                {
                                  item.quantity
                                }
                              </div>

                            </div>

                          )
                        )

                      ) : (

                        "No products"

                      )}

                    </td>

                    <td>
                      ₹
                      {Number(
                        order.totalAmount ||
                          0
                      ).toLocaleString(
                        "en-IN"
                      )}
                    </td>

                    <td>

                      <span
                        style={getStatusStyle(
                          order.status
                        )}
                      >
                        {
                          order.status
                        }
                      </span>

                    </td>

                    <td>

                      {order.createdAt
                        ? new Date(
                            order.createdAt
                          ).toLocaleDateString()
                        : "N/A"}

                    </td>

                  </tr>

                )
              )

            ) : (

              <tr>

                <td
                  colSpan="7"
                  style={{
                    textAlign:
                      "center",
                    padding:
                      "20px",
                  }}
                >
                  No orders found
                </td>

              </tr>

            )}

          </tbody>

        </table>

      </div>

      {/* ==================================================
          PAGINATION
      ================================================== */}

      <div
        style={{
          display: "flex",
          alignItems:
            "center",
          justifyContent:
            "center",
          flexWrap: "wrap",
          gap: "12px",
          marginTop:
            "20px",
          marginBottom:
            "30px",
        }}
      >

        <button
          disabled={
            safeOrderPage === 1
          }
          onClick={() =>
            setOrderPage(
              safeOrderPage - 1
            )
          }
          style={{
            padding:
              "8px 14px",
            cursor:
              safeOrderPage ===
              1
                ? "not-allowed"
                : "pointer",
          }}
        >
          Previous
        </button>

        <span>
          Page{" "}
          {safeOrderPage}{" "}
          of{" "}
          {totalOrderPages}
        </span>

        <button
          disabled={
            safeOrderPage ===
            totalOrderPages
          }
          onClick={() =>
            setOrderPage(
              safeOrderPage + 1
            )
          }
          style={{
            padding:
              "8px 14px",
            cursor:
              safeOrderPage ===
              totalOrderPages
                ? "not-allowed"
                : "pointer",
          }}
        >
          Next
        </button>

      </div>

    </div>
  );
};

export default AdminDashboard;