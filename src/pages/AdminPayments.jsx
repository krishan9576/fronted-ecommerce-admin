import { useEffect, useState } from "react";
import API_URL from "../config/api";

const AdminPayments = () => {
  // ======================================================
  // PAYMENTS
  // ======================================================

  const [payments, setPayments] = useState([]);

  // ======================================================
  // PAGINATION
  // ======================================================

  const [page, setPage] = useState(1);
  const [limit] = useState(5);

  const [totalPayments, setTotalPayments] = useState(0);
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
  // PAYMENT METHOD FILTER
  // ======================================================

  const [method, setMethod] = useState("All");

  // ======================================================
  // LOADING
  // ======================================================

  const [loading, setLoading] = useState(true);

  // ======================================================
  // VIEW PAYMENT
  // ======================================================

  const [selectedPayment, setSelectedPayment] = useState(null);

  const [showViewModal, setShowViewModal] = useState(false);

  // ======================================================
  // STATUS OPTIONS
  // ======================================================

  const statusOptions = [
    "All",
    "Pending",
    "Paid",
    "Failed",
    "Refunded",
    "Cancelled",
  ];

  // ======================================================
  // PAYMENT METHOD OPTIONS
  // ======================================================

  const methodOptions = [
    "All",
    "COD",
    "UPI",
    "Card",
    "Net Banking",
    "Wallet",
  ];

  // ======================================================
  // FETCH PAYMENTS
  // ======================================================

  const fetchPayments = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      const response = await fetch(
        `${API_URL}/api/admin/payments?page=${page}&limit=${limit}&search=${encodeURIComponent(
          search
        )}&status=${encodeURIComponent(
          status
        )}&method=${encodeURIComponent(method)}`,
        {
          method: "GET",

          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      console.log("Payments Response:", data);

      // ==================================================
      // RESPONSE ERROR
      // ==================================================

      if (!response.ok) {
        alert(
          data.message ||
            "Failed to fetch payments"
        );

        return;
      }

      // ==================================================
      // SET PAYMENTS
      // ==================================================

      setPayments(data.payments || []);

      setTotalPayments(
        data.totalPayments || 0
      );

      setTotalPages(
        data.totalPages || 1
      );
    } catch (error) {
      console.error(
        "Fetch Payments Error:",
        error
      );

      alert("Server error");
    } finally {
      setLoading(false);
    }
  };

  // ======================================================
  // VIEW PAYMENT
  // ======================================================

  const handleViewPayment = (payment) => {
    setSelectedPayment(payment);
    setShowViewModal(true);
  };

  // ======================================================
  // CLOSE VIEW MODAL
  // ======================================================

  const handleCloseViewModal = () => {
    setShowViewModal(false);
    setSelectedPayment(null);
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
  // STATUS HANDLER
  // ======================================================

  const handleStatusChange = (e) => {
    setStatus(e.target.value);
    setPage(1);
  };

  // ======================================================
  // METHOD HANDLER
  // ======================================================

  const handleMethodChange = (e) => {
    setMethod(e.target.value);
    setPage(1);
  };

  // ======================================================
  // FETCH WHEN FILTERS CHANGE
  // ======================================================

  useEffect(() => {
    fetchPayments();
  }, [page, search, status, method]);

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
        <h2>Loading Payments...</h2>
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

          .payments-page {
            width: 100%;
            max-width: 100%;
            overflow-x: hidden;
          }

          .payments-heading {
            font-size: 32px;
            margin-top: 0;
            margin-bottom: 20px;
          }

          .payments-filters {
            display: flex;
            align-items: center;
            gap: 15px;
            flex-wrap: wrap;
            margin-bottom: 20px;
          }

          .payments-search {
            display: flex;
            align-items: center;
            gap: 10px;
            width: 100%;
            max-width: 450px;
          }

          .payments-search input {
            flex: 1;
            width: 100%;
            padding: 10px;
            font-size: 14px;
            border: 1px solid #aaa;
            border-radius: 5px;
            box-sizing: border-box;
          }

          .clear-payment-search-button {
            padding: 10px 15px;
            background-color: #6c757d;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            white-space: nowrap;
          }

          .clear-payment-search-button:hover {
            background-color: #5a6268;
          }

          .payment-filter {
            padding: 10px;
            font-size: 14px;
            border: 1px solid #aaa;
            border-radius: 5px;
            background-color: white;
            cursor: pointer;
          }

          .payments-table-wrapper {
            width: 100%;
            max-width: 100%;
            overflow-x: auto;
            overflow-y: hidden;
            -webkit-overflow-scrolling: touch;
            border: 1px solid #ddd;
          }

          .payments-table {
            width: 100%;
            min-width: 1200px;
            border-collapse: collapse;
            background-color: white;
            color: #222;
          }

          .payments-table th,
          .payments-table td {
            padding: 10px;
            border: 1px solid #ddd;
            white-space: nowrap;
          }

          .payments-table th {
            background-color: #ddd;
            font-weight: 700;
          }

          .payment-actions {
            display: flex;
            align-items: center;
            gap: 8px;
          }

          .view-payment-button {
            padding: 7px 12px;
            border: none;
            border-radius: 4px;
            background-color: #198754;
            color: white;
            cursor: pointer;
            font-weight: 600;
          }

          .view-payment-button:hover {
            background-color: #157347;
          }

          .payment-status {
            display: inline-block;
            padding: 5px 9px;
            border-radius: 5px;
            font-weight: 600;
          }

          .payment-status-paid {
            background-color: #d1e7dd;
            color: #0f5132;
          }

          .payment-status-pending {
            background-color: #fff3cd;
            color: #664d03;
          }

          .payment-status-failed {
            background-color: #f8d7da;
            color: #842029;
          }

          .payment-status-refunded {
            background-color: #cfe2ff;
            color: #084298;
          }

          .payment-status-cancelled {
            background-color: #e2e3e5;
            color: #41464b;
          }

          .payment-status-default {
            background-color: #e2e3e5;
            color: #41464b;
          }

          .payments-pagination {
            display: flex;
            align-items: center;
            gap: 15px;
            flex-wrap: wrap;
          }

          .payments-pagination button {
            padding: 8px 15px;
            cursor: pointer;
            border: 1px solid #aaa;
            border-radius: 5px;
            background-color: white;
          }

          .payments-pagination button:hover:not(:disabled) {
            background-color: #f0f0f0;
          }

          .payments-pagination button:disabled {
            cursor: not-allowed;
            opacity: 0.5;
          }

          /* ==================================================
             PAYMENT MODAL
          ================================================== */

          .payment-modal-overlay {
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

          .payment-modal {
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

          .payment-modal-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 15px;
            border-bottom: 1px solid #ddd;
            padding-bottom: 15px;
            margin-bottom: 15px;
          }

          .payment-modal-header h2 {
            margin: 0;
            color: #222;
          }

          .payment-close-icon {
            width: 35px;
            height: 35px;
            border: none;
            border-radius: 50%;
            background-color: #f1f1f1;
            color: #333;
            font-size: 20px;
            cursor: pointer;
          }

          .payment-close-icon:hover {
            background-color: #ddd;
          }

          .payment-detail-row {
            display: grid;
            grid-template-columns: 160px 1fr;
            gap: 15px;
            padding: 12px 0;
            border-bottom: 1px solid #eee;
          }

          .payment-detail-label {
            font-weight: 700;
            color: #333;
          }

          .payment-detail-value {
            color: #555;
            word-break: break-word;
          }

          .payment-close-wrapper {
            display: flex;
            justify-content: flex-end;
            margin-top: 20px;
          }

          .payment-close-button {
            padding: 10px 20px;
            border: none;
            border-radius: 6px;
            background-color: #6c757d;
            color: white;
            cursor: pointer;
            font-weight: 600;
          }

          .payment-close-button:hover {
            background-color: #5a6268;
          }

          @media (max-width: 600px) {

            .payments-page {
              padding: 15px !important;
            }

            .payments-heading {
              font-size: 25px;
              line-height: 1.2;
            }

            .payments-filters {
              width: 100%;
            }

            .payments-search {
              width: 100%;
              max-width: 100%;
            }

            .payments-search input {
              padding: 12px;
              font-size: 16px;
            }

            .clear-payment-search-button {
              padding: 12px 15px;
            }

            .payment-filter {
              width: 100%;
              padding: 12px;
              font-size: 16px;
            }

            .payments-table {
              min-width: 1200px;
            }

            .payments-pagination {
              justify-content: center;
              gap: 10px;
            }

            .payment-modal {
              padding: 20px;
            }

            .payment-detail-row {
              grid-template-columns: 1fr;
              gap: 5px;
            }

          }

        `}
      </style>

      {/* ==================================================
          MAIN CONTAINER
      ================================================== */}

      <div
        className="payments-page"
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

        <h1 className="payments-heading">
          Payments Management
        </h1>

        {/* ==================================================
            TOTAL PAYMENTS
        ================================================== */}

        <h3>
          Total Payments: {totalPayments}
        </h3>

        {/* ==================================================
            FILTERS
        ================================================== */}

        <div className="payments-filters">

          {/* SEARCH */}

          <div className="payments-search">

            <input
              type="text"
              placeholder="Search user name or email..."
              value={search}
              onChange={handleSearch}
            />

            {search && (
              <button
                type="button"
                className="clear-payment-search-button"
                onClick={handleClearSearch}
              >
                Clear
              </button>
            )}

          </div>

          {/* STATUS */}

          <select
            className="payment-filter"
            value={status}
            onChange={handleStatusChange}
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

          {/* METHOD */}

          <select
            className="payment-filter"
            value={method}
            onChange={handleMethodChange}
          >
            {methodOptions.map(
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
            PAYMENTS TABLE
        ================================================== */}

        <div className="payments-table-wrapper">

          <table className="payments-table">

            <thead>

              <tr>

                <th>
                  Payment ID
                </th>

                <th>
                  User
                </th>

                <th>
                  Email
                </th>

                <th>
                  Order ID
                </th>

                <th>
                  Amount
                </th>

                <th>
                  Method
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

              {payments.length > 0 ? (

                payments.map(
                  (payment) => {

                    const paymentStatus =
                      payment.status ||
                      "N/A";

                    return (
                      <tr
                        key={
                          payment._id
                        }
                      >

                        {/* PAYMENT ID */}

                        <td>
                          {payment._id}
                        </td>

                        {/* USER */}

                        <td>
                          {payment.user?.name ||
                            payment.userName ||
                            "N/A"}
                        </td>

                        {/* EMAIL */}

                        <td>
                          {payment.user?.email ||
                            payment.email ||
                            "N/A"}
                        </td>

                        {/* ORDER ID */}

                        <td>
                          {payment.order?._id ||
                            payment.order ||
                            payment.orderId ||
                            "N/A"}
                        </td>

                        {/* AMOUNT */}

                        <td>
                          ₹
                          {Number(
                            payment.amount ||
                              0
                          ).toLocaleString(
                            "en-IN"
                          )}
                        </td>

                        {/* METHOD */}

                        <td>
                          {payment.method ||
                            payment.paymentMethod ||
                            "N/A"}
                        </td>

                        {/* STATUS */}

                        <td>

                          <span
                            className={`payment-status ${
                              paymentStatus ===
                              "Paid"
                                ? "payment-status-paid"
                                : paymentStatus ===
                                  "Pending"
                                ? "payment-status-pending"
                                : paymentStatus ===
                                  "Failed"
                                ? "payment-status-failed"
                                : paymentStatus ===
                                  "Refunded"
                                ? "payment-status-refunded"
                                : paymentStatus ===
                                  "Cancelled"
                                ? "payment-status-cancelled"
                                : "payment-status-default"
                            }`}
                          >
                            {paymentStatus}
                          </span>

                        </td>

                        {/* CREATED AT */}

                        <td>

                          {payment.createdAt
                            ? new Date(
                                payment.createdAt
                              ).toLocaleString(
                                "en-IN"
                              )
                            : "N/A"}

                        </td>

                        {/* ACTIONS */}

                        <td>

                          <div className="payment-actions">

                            <button
                              type="button"
                              className="view-payment-button"
                              onClick={() =>
                                handleViewPayment(
                                  payment
                                )
                              }
                            >
                              View
                            </button>

                          </div>

                        </td>

                      </tr>
                    );
                  }
                )

              ) : (

                <tr>

                  <td
                    colSpan="9"
                    style={{
                      textAlign:
                        "center",
                      padding:
                        "20px",
                    }}
                  >
                    {search ||
                    status !== "All" ||
                    method !== "All"
                      ? "No payments found for selected filter"
                      : "No payments found"}
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

        <div className="payments-pagination">

          <button
            type="button"
            disabled={page === 1}
            onClick={() =>
              setPage(page - 1)
            }
          >
            Previous
          </button>

          <span>
            Page {page} of{" "}
            {totalPages}
          </span>

          <button
            type="button"
            disabled={
              page === totalPages
            }
            onClick={() =>
              setPage(page + 1)
            }
          >
            Next
          </button>

        </div>

      </div>

      {/* ==================================================
          VIEW PAYMENT MODAL
      ================================================== */}

      {showViewModal &&
        selectedPayment && (

          <div
            className="payment-modal-overlay"
            onClick={
              handleCloseViewModal
            }
          >

            <div
              className="payment-modal"
              onClick={(e) =>
                e.stopPropagation()
              }
            >

              {/* MODAL HEADER */}

              <div className="payment-modal-header">

                <h2>
                  Payment Details
                </h2>

                <button
                  type="button"
                  className="payment-close-icon"
                  onClick={
                    handleCloseViewModal
                  }
                >
                  ×
                </button>

              </div>

              {/* PAYMENT ID */}

              <div className="payment-detail-row">

                <div className="payment-detail-label">
                  Payment ID
                </div>

                <div className="payment-detail-value">
                  {selectedPayment._id ||
                    "N/A"}
                </div>

              </div>

              {/* USER */}

              <div className="payment-detail-row">

                <div className="payment-detail-label">
                  User
                </div>

                <div className="payment-detail-value">
                  {selectedPayment.user
                    ?.name ||
                    selectedPayment.userName ||
                    "N/A"}
                </div>

              </div>

              {/* EMAIL */}

              <div className="payment-detail-row">

                <div className="payment-detail-label">
                  Email
                </div>

                <div className="payment-detail-value">
                  {selectedPayment.user
                    ?.email ||
                    selectedPayment.email ||
                    "N/A"}
                </div>

              </div>

              {/* ORDER ID */}

              <div className="payment-detail-row">

                <div className="payment-detail-label">
                  Order ID
                </div>

                <div className="payment-detail-value">
                  {selectedPayment.order
                    ?._id ||
                    selectedPayment.order ||
                    selectedPayment.orderId ||
                    "N/A"}
                </div>

              </div>

              {/* AMOUNT */}

              <div className="payment-detail-row">

                <div className="payment-detail-label">
                  Amount
                </div>

                <div className="payment-detail-value">
                  ₹
                  {Number(
                    selectedPayment.amount ||
                      0
                  ).toLocaleString(
                    "en-IN"
                  )}
                </div>

              </div>

              {/* METHOD */}

              <div className="payment-detail-row">

                <div className="payment-detail-label">
                  Payment Method
                </div>

                <div className="payment-detail-value">
                  {selectedPayment.method ||
                    selectedPayment.paymentMethod ||
                    "N/A"}
                </div>

              </div>

              {/* STATUS */}

              <div className="payment-detail-row">

                <div className="payment-detail-label">
                  Payment Status
                </div>

                <div className="payment-detail-value">
                  {selectedPayment.status ||
                    "N/A"}
                </div>

              </div>

              {/* CREATED AT */}

              <div className="payment-detail-row">

                <div className="payment-detail-label">
                  Created At
                </div>

                <div className="payment-detail-value">

                  {selectedPayment.createdAt
                    ? new Date(
                        selectedPayment.createdAt
                      ).toLocaleString(
                        "en-IN"
                      )
                    : "N/A"}

                </div>

              </div>

              {/* UPDATED AT */}

              <div className="payment-detail-row">

                <div className="payment-detail-label">
                  Updated At
                </div>

                <div className="payment-detail-value">

                  {selectedPayment.updatedAt
                    ? new Date(
                        selectedPayment.updatedAt
                      ).toLocaleString(
                        "en-IN"
                      )
                    : "N/A"}

                </div>

              </div>

              {/* CLOSE BUTTON */}

              <div className="payment-close-wrapper">

                <button
                  type="button"
                  className="payment-close-button"
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

export default AdminPayments;