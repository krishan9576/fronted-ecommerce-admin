import { useEffect, useState } from "react";

const AdminOrders = () => {
  // ======================================================
  // ORDERS
  // ======================================================

  const [orders, setOrders] = useState([]);

  // ======================================================
  // PAGINATION
  // ======================================================

  const [page, setPage] = useState(1);
  const [limit] = useState(5);

  const [totalOrders, setTotalOrders] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  // ======================================================
  // SEARCH
  // ======================================================

  const [search, setSearch] = useState("");

  // ======================================================
  // STATUS FILTER
  // ======================================================

  const [status, setStatus] = useState("All");

  // ======================================================
  // LOADING
  // ======================================================

  const [loading, setLoading] = useState(true);

  // ======================================================
  // VIEW ORDER
  // ======================================================

  const [selectedOrder, setSelectedOrder] =
    useState(null);

  const [showViewModal, setShowViewModal] =
    useState(false);

  // ======================================================
  // STATUS OPTIONS
  // ======================================================

  const statusOptions = [
    "All",
    "Pending",
    "Processing",
    "Shipped",
    "Delivered",
    "Cancelled",
  ];

  // ======================================================
  // FETCH ORDERS
  // ======================================================

  const fetchOrders = async () => {
    try {
      setLoading(true);

      const token =
        localStorage.getItem("token");

      const response = await fetch(
        `http://localhost:5000/api/admin/orders?page=${page}&limit=${limit}&search=${encodeURIComponent(
          search
        )}&status=${encodeURIComponent(status)}`,
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
        "Orders Response:",
        data
      );

      if (!response.ok) {
        alert(
          data.message ||
            "Failed to fetch orders"
        );

        return;
      }

      setOrders(
        data.orders || []
      );

      setTotalOrders(
        data.totalOrders || 0
      );

      setTotalPages(
        data.totalPages || 1
      );

    } catch (error) {
      console.error(
        "Fetch Orders Error:",
        error
      );

      alert("Server error");

    } finally {
      setLoading(false);
    }
  };

  // ======================================================
  // UPDATE ORDER STATUS
  // ======================================================

  const handleUpdateStatus = async (
    orderId,
    newStatus
  ) => {
    try {
      const token =
        localStorage.getItem("token");

      const response = await fetch(
        `http://localhost:5000/api/admin/orders/${orderId}/status`,
        {
          method: "PATCH",

          headers: {
            "Content-Type":
              "application/json",

            Authorization:
              `Bearer ${token}`,
          },

          body: JSON.stringify({
            status: newStatus,
          }),
        }
      );

      const data =
        await response.json();

      console.log(
        "Update Order Status Response:",
        data
      );

      if (!response.ok) {
        alert(
          data.message ||
            "Failed to update order status"
        );

        return;
      }

      alert(
        "Order status updated successfully"
      );

      fetchOrders();

    } catch (error) {
      console.error(
        "Update Order Status Error:",
        error
      );

      alert("Server error");
    }
  };

  // ======================================================
  // VIEW ORDER
  // ======================================================

  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    setShowViewModal(true);
  };

  // ======================================================
  // CLOSE VIEW MODAL
  // ======================================================

  const handleCloseViewModal = () => {
    setShowViewModal(false);
    setSelectedOrder(null);
  };

  // ======================================================
  // SEARCH HANDLER
  // ======================================================

  const handleSearch = (e) => {
    setSearch(
      e.target.value
    );

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
  // STATUS HANDLER
  // ======================================================

  const handleStatusChange = (e) => {
    setStatus(
      e.target.value
    );

    setPage(1);
  };

  // ======================================================
  // FETCH ON PAGE / SEARCH / STATUS CHANGE
  // ======================================================

  useEffect(() => {
    fetchOrders();
  }, [page, search, status]);

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
        <h2>
          Loading Orders...
        </h2>
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

          .orders-page {
            width: 100%;
            max-width: 100%;
            overflow-x: hidden;
          }

          .orders-heading {
            font-size: 32px;
            margin-top: 0;
            margin-bottom: 20px;
          }

          .orders-filters {
            display: flex;
            align-items: center;
            gap: 15px;
            flex-wrap: wrap;
            margin-bottom: 20px;
          }

          .orders-search {
            display: flex;
            align-items: center;
            gap: 10px;
            width: 100%;
            max-width: 450px;
          }

          .orders-search input {
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
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
          }

          .status-filter {
            padding: 10px;
            font-size: 14px;
            border: 1px solid #aaa;
            border-radius: 5px;
            background-color: white;
            cursor: pointer;
          }

          .orders-table-wrapper {
            width: 100%;
            max-width: 100%;
            overflow-x: auto;
            overflow-y: hidden;
            -webkit-overflow-scrolling: touch;
            border: 1px solid #ddd;
          }

          .orders-table {
            width: 100%;
            min-width: 1250px;
            border-collapse: collapse;
            background-color: white;
            color: #222;
          }

          .orders-table th,
          .orders-table td {
            padding: 10px;
            border: 1px solid #ddd;
            white-space: nowrap;
          }

          .orders-table th {
            background-color: #ddd;
          }

          .status-select {
            padding: 7px;
            border: 1px solid #aaa;
            border-radius: 4px;
            cursor: pointer;
          }

          .order-items {
            white-space: normal !important;
            min-width: 250px;
          }

          /* ==================================================
             ACTION BUTTONS
          ================================================== */

          .order-actions {
            display: flex;
            align-items: center;
            gap: 8px;
          }

          .view-order-button {
            padding: 7px 12px;
            border: none;
            border-radius: 4px;
            background-color: #198754;
            color: white;
            cursor: pointer;
            font-weight: 600;
          }

          .view-order-button:hover {
            background-color: #157347;
          }

          /* ==================================================
             PAGINATION
          ================================================== */

          .orders-pagination {
            display: flex;
            align-items: center;
            gap: 15px;
            flex-wrap: wrap;
          }

          .orders-pagination button {
            padding: 8px 15px;
            cursor: pointer;
            border: 1px solid #aaa;
            border-radius: 5px;
            background-color: white;
          }

          .orders-pagination button:disabled {
            cursor: not-allowed;
            opacity: 0.5;
          }

          /* ==================================================
             ORDER MODAL
          ================================================== */

          .order-modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.55);
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 20px;
            box-sizing: border-box;
            z-index: 9999;
          }

          .order-modal {
            width: 100%;
            max-width: 650px;
            max-height: 90vh;
            overflow-y: auto;
            background-color: white;
            border-radius: 12px;
            padding: 25px;
            box-sizing: border-box;
            box-shadow: 0 10px 35px rgba(0, 0, 0, 0.25);
          }

          .order-modal-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 15px;
            border-bottom: 1px solid #ddd;
            padding-bottom: 15px;
            margin-bottom: 15px;
          }

          .order-modal-header h2 {
            margin: 0;
            color: #222;
          }

          .modal-close-icon {
            width: 35px;
            height: 35px;
            border: none;
            border-radius: 50%;
            background-color: #f1f1f1;
            color: #333;
            font-size: 20px;
            cursor: pointer;
          }

          .modal-close-icon:hover {
            background-color: #ddd;
          }

          .order-detail-row {
            display: grid;
            grid-template-columns: 150px 1fr;
            gap: 15px;
            padding: 12px 0;
            border-bottom: 1px solid #eee;
          }

          .order-detail-label {
            font-weight: 700;
            color: #333;
          }

          .order-detail-value {
            color: #555;
            word-break: break-word;
          }

          .modal-products {
            margin-top: 15px;
            border: 1px solid #ddd;
            border-radius: 8px;
            overflow: hidden;
          }

          .modal-products-header {
            display: grid;
            grid-template-columns: 1fr 100px 120px;
            background-color: #f3f4f6;
            font-weight: 700;
            padding: 10px;
          }

          .modal-product-row {
            display: grid;
            grid-template-columns: 1fr 100px 120px;
            padding: 10px;
            border-top: 1px solid #ddd;
          }

          .modal-close-wrapper {
            display: flex;
            justify-content: flex-end;
            margin-top: 20px;
          }

          .modal-close-button {
            padding: 10px 20px;
            border: none;
            border-radius: 6px;
            background-color: #6c757d;
            color: white;
            cursor: pointer;
            font-weight: 600;
          }

          .modal-close-button:hover {
            background-color: #5a6268;
          }

          @media (max-width: 600px) {

            .orders-page {
              padding: 15px !important;
            }

            .orders-heading {
              font-size: 25px;
            }

            .orders-filters {
              width: 100%;
            }

            .orders-search {
              width: 100%;
              max-width: 100%;
            }

            .orders-search input {
              padding: 12px;
              font-size: 16px;
            }

            .clear-search-button {
              padding: 12px 15px;
            }

            .status-filter {
              width: 100%;
              padding: 12px;
              font-size: 16px;
            }

            .orders-table {
              min-width: 1250px;
            }

            .orders-pagination {
              justify-content: center;
            }

            .order-modal {
              padding: 20px;
            }

            .order-detail-row {
              grid-template-columns: 1fr;
              gap: 5px;
            }

            .modal-products-header,
            .modal-product-row {
              grid-template-columns: 1fr 70px 100px;
              font-size: 14px;
            }

          }

        `}
      </style>

      {/* ==================================================
          MAIN CONTAINER
      ================================================== */}

      <div
        className="orders-page"
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

        <h1 className="orders-heading">
          Orders Management
        </h1>

        {/* ==================================================
            TOTAL ORDERS
        ================================================== */}

        <h3>
          Total Orders: {totalOrders}
        </h3>

        {/* ==================================================
            FILTERS
        ================================================== */}

        <div className="orders-filters">

          {/* SEARCH */}

          <div className="orders-search">

            <input
              type="text"
              placeholder="Search user name or email..."
              value={search}
              onChange={handleSearch}
            />

            {search && (
              <button
                type="button"
                className="clear-search-button"
                onClick={
                  handleClearSearch
                }
              >
                Clear
              </button>
            )}

          </div>

          {/* STATUS */}

          <select
            className="status-filter"
            value={status}
            onChange={
              handleStatusChange
            }
          >

            {statusOptions.map(
              (option) => (
                <option
                  key={option}
                  value={option}
                >
                  {option}
                </option>
              )
            )}

          </select>

        </div>

        {/* ==================================================
            ORDERS TABLE
        ================================================== */}

        <div className="orders-table-wrapper">

          <table className="orders-table">

            <thead>

              <tr>

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
                  Items
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

                <th>
                  Actions
                </th>

              </tr>

            </thead>

            <tbody>

              {orders.length > 0 ? (

                orders.map(
                  (order) => (

                    <tr
                      key={
                        order._id
                      }
                    >

                      {/* ORDER ID */}

                      <td>
                        {order._id}
                      </td>

                      {/* USER */}

                      <td>
                        {order.user?.name ||
                          "N/A"}
                      </td>

                      {/* EMAIL */}

                      <td>
                        {order.user?.email ||
                          "N/A"}
                      </td>

                      {/* ITEMS */}

                      <td className="order-items">

                        {order.products?.length >
                        0 ? (

                          order.products.map(
                            (
                              item,
                              index
                            ) => (

                              <div
                                key={
                                  item.product?._id ||
                                  index
                                }
                                style={{
                                  marginBottom:
                                    "5px",
                                }}
                              >

                                {item.product
                                  ?.name ||
                                  "Product"}

                                {" × "}

                                {item.quantity ||
                                  0}

                              </div>

                            )
                          )

                        ) : (

                          "No items"

                        )}

                      </td>

                      {/* TOTAL AMOUNT */}

                      <td>

                        ₹
                        {Number(
                          order.totalAmount ||
                            0
                        ).toLocaleString(
                          "en-IN"
                        )}

                      </td>

                      {/* STATUS */}

                      <td>

                        <select
                          className="status-select"
                          value={
                            order.status ||
                            "Pending"
                          }
                          onChange={(e) =>
                            handleUpdateStatus(
                              order._id,
                              e.target.value
                            )
                          }
                        >

                          {statusOptions
                            .filter(
                              (
                                option
                              ) =>
                                option !==
                                "All"
                            )
                            .map(
                              (
                                option
                              ) => (

                                <option
                                  key={
                                    option
                                  }
                                  value={
                                    option
                                  }
                                >
                                  {option}
                                </option>

                              )
                            )}

                        </select>

                      </td>

                      {/* CREATED AT */}

                      <td>

                        {order.createdAt
                          ? new Date(
                              order.createdAt
                            ).toLocaleDateString(
                              "en-IN"
                            )
                          : "N/A"}

                      </td>

                      {/* ACTIONS */}

                      <td>

                        <div className="order-actions">

                          <button
                            type="button"
                            className="view-order-button"
                            onClick={() =>
                              handleViewOrder(
                                order
                              )
                            }
                          >
                            View
                          </button>

                        </div>

                      </td>

                    </tr>

                  )
                )

              ) : (

                <tr>

                  <td
                    colSpan="8"
                    style={{
                      textAlign:
                        "center",
                      padding:
                        "20px",
                    }}
                  >

                    {search ||
                    status !== "All"
                      ? "No orders found for selected filter"
                      : "No orders found"}

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

        <div className="orders-pagination">

          <button
            disabled={
              page === 1
            }
            onClick={() =>
              setPage(
                page - 1
              )
            }
          >
            Previous
          </button>

          <span>
            Page {page} of{" "}
            {totalPages}
          </span>

          <button
            disabled={
              page === totalPages
            }
            onClick={() =>
              setPage(
                page + 1
              )
            }
          >
            Next
          </button>

        </div>

      </div>

      {/* ==================================================
          VIEW ORDER MODAL
      ================================================== */}

      {showViewModal &&
        selectedOrder && (

          <div
            className="order-modal-overlay"
            onClick={
              handleCloseViewModal
            }
          >

            <div
              className="order-modal"
              onClick={(e) =>
                e.stopPropagation()
              }
            >

              {/* MODAL HEADER */}

              <div className="order-modal-header">

                <h2>
                  Order Details
                </h2>

                <button
                  type="button"
                  className="modal-close-icon"
                  onClick={
                    handleCloseViewModal
                  }
                >
                  ×
                </button>

              </div>

              {/* ORDER ID */}

              <div className="order-detail-row">

                <div className="order-detail-label">
                  Order ID
                </div>

                <div className="order-detail-value">
                  {selectedOrder._id ||
                    "N/A"}
                </div>

              </div>

              {/* USER */}

              <div className="order-detail-row">

                <div className="order-detail-label">
                  User
                </div>

                <div className="order-detail-value">
                  {selectedOrder.user
                    ?.name ||
                    "N/A"}
                </div>

              </div>

              {/* EMAIL */}

              <div className="order-detail-row">

                <div className="order-detail-label">
                  Email
                </div>

                <div className="order-detail-value">
                  {selectedOrder.user
                    ?.email ||
                    "N/A"}
                </div>

              </div>

              {/* TOTAL AMOUNT */}

              <div className="order-detail-row">

                <div className="order-detail-label">
                  Total Amount
                </div>

                <div className="order-detail-value">
                  ₹
                  {Number(
                    selectedOrder.totalAmount ||
                      0
                  ).toLocaleString(
                    "en-IN"
                  )}
                </div>

              </div>

              {/* STATUS */}

              <div className="order-detail-row">

                <div className="order-detail-label">
                  Status
                </div>

                <div className="order-detail-value">
                  {selectedOrder.status ||
                    "N/A"}
                </div>

              </div>

              {/* CREATED AT */}

              <div className="order-detail-row">

                <div className="order-detail-label">
                  Created At
                </div>

                <div className="order-detail-value">

                  {selectedOrder.createdAt
                    ? new Date(
                        selectedOrder.createdAt
                      ).toLocaleDateString(
                        "en-IN"
                      )
                    : "N/A"}

                </div>

              </div>

              {/* PRODUCTS */}

              <h3
                style={{
                  marginTop: "25px",
                  marginBottom: "10px",
                }}
              >
                Order Items
              </h3>

              {selectedOrder.products?.length >
              0 ? (

                <div className="modal-products">

                  <div className="modal-products-header">

                    <div>
                      Product
                    </div>

                    <div>
                      Qty
                    </div>

                    <div>
                      Price
                    </div>

                  </div>

                  {selectedOrder.products.map(
                    (
                      item,
                      index
                    ) => (

                      <div
                        className="modal-product-row"
                        key={
                          item.product?._id ||
                          item._id ||
                          index
                        }
                      >

                        <div>
                          {item.product
                            ?.name ||
                            "Product"}
                        </div>

                        <div>
                          {item.quantity ||
                            0}
                        </div>

                        <div>
                          ₹
                          {Number(
                            item.price ||
                              item.product
                                ?.price ||
                              0
                          ).toLocaleString(
                            "en-IN"
                          )}
                        </div>

                      </div>

                    )
                  )}

                </div>

              ) : (

                <p>
                  No order items found.
                </p>

              )}

              {/* CLOSE BUTTON */}

              <div className="modal-close-wrapper">

                <button
                  type="button"
                  className="modal-close-button"
                  onClick={
                    handleCloseViewModal
                  }
                >
                  Close
                </button>

              </div>

            </div>

          </div>

        )}

    </>
  );
};

export default AdminOrders;