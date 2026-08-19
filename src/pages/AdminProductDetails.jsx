import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const AdminProductDetails = () => {
  // ======================================================
  // NAVIGATION
  // ======================================================

  const navigate = useNavigate();

  // ======================================================
  // PRODUCT ID
  // ======================================================

  const { id } = useParams();

  // ======================================================
  // STATES
  // ======================================================

  const [product, setProduct] = useState(null);

  const [loading, setLoading] = useState(true);

  // ======================================================
  // FETCH PRODUCT
  // ======================================================

  const fetchProduct = async () => {
    try {
      setLoading(true);

      const token =
        localStorage.getItem("token");

      const response = await fetch(
        `http://localhost:5000/api/admin/products/${id}`,
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
        "Product Details Response:",
        data
      );

      if (!response.ok) {
        alert(
          data.message ||
            "Failed to fetch product"
        );

        return;
      }

      /*
        Backend response agar:

        {
          message: "...",
          product: {...}
        }

        hai to product use hoga.
      */

      setProduct(
        data.product || null
      );

    } catch (error) {
      console.error(
        "Fetch Product Details Error:",
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
    if (id) {
      fetchProduct();
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
        }}
      >
        <h2>
          Loading Product...
        </h2>
      </div>
    );
  }

  // ======================================================
  // PRODUCT NOT FOUND
  // ======================================================

  if (!product) {
    return (
      <div
        style={{
          padding: "20px",
          color: "#222",
        }}
      >
        <h2>
          Product not found
        </h2>

        <button
          onClick={() =>
            navigate("/admin/products")
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
          Back to Products
        </button>
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

          .product-details-page {
            width: 100%;
            min-height: 100vh;
            background-color: #f5f5f5;
            color: #222;
            padding: 20px;
            box-sizing: border-box;
          }

          .product-details-heading {
            margin-top: 0;
            margin-bottom: 25px;
            font-size: 32px;
          }

          .product-details-card {
            width: 100%;
            max-width: 800px;
            background-color: white;
            border: 1px solid #ddd;
            border-radius: 10px;
            padding: 25px;
            box-sizing: border-box;
            box-shadow: 0 3px 10px rgba(0,0,0,0.08);
          }

          .product-detail-row {
            display: grid;
            grid-template-columns: 180px 1fr;
            gap: 20px;
            padding: 15px 0;
            border-bottom: 1px solid #eee;
          }

          .product-detail-row:last-child {
            border-bottom: none;
          }

          .product-detail-label {
            font-weight: 700;
            color: #555;
          }

          .product-detail-value {
            color: #222;
            word-break: break-word;
          }

          .product-price {
            font-size: 22px;
            font-weight: 700;
            color: #198754;
          }

          .product-stock {
            font-weight: 700;
          }

          .product-details-actions {
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

          .edit-product-button {
            padding: 10px 18px;
            border: none;
            border-radius: 5px;
            background-color: #007bff;
            color: white;
            cursor: pointer;
            font-weight: 600;
          }

          .edit-product-button:hover {
            background-color: #0069d9;
          }

          @media (max-width: 600px) {

            .product-details-page {
              padding: 15px;
            }

            .product-details-heading {
              font-size: 25px;
            }

            .product-details-card {
              padding: 18px;
            }

            .product-detail-row {
              grid-template-columns: 1fr;
              gap: 5px;
            }

            .product-detail-label {
              font-size: 14px;
            }

          }

        `}
      </style>

      {/* ==================================================
          MAIN CONTAINER
      ================================================== */}

      <div className="product-details-page">

        {/* ==================================================
            HEADING
        ================================================== */}

        <h1 className="product-details-heading">
          Product Details
        </h1>

        {/* ==================================================
            PRODUCT CARD
        ================================================== */}

        <div className="product-details-card">

          {/* NAME */}

          <div className="product-detail-row">

            <div className="product-detail-label">
              Product Name
            </div>

            <div className="product-detail-value">
              {product.name || "N/A"}
            </div>

          </div>

          {/* DESCRIPTION */}

          <div className="product-detail-row">

            <div className="product-detail-label">
              Description
            </div>

            <div className="product-detail-value">
              {product.description || "N/A"}
            </div>

          </div>

          {/* PRICE */}

          <div className="product-detail-row">

            <div className="product-detail-label">
              Price
            </div>

            <div className="product-detail-value product-price">
              ₹
              {Number(
                product.price || 0
              ).toLocaleString("en-IN")}
            </div>

          </div>

          {/* CATEGORY */}

          <div className="product-detail-row">

            <div className="product-detail-label">
              Category
            </div>

            <div className="product-detail-value">
              {product.category || "N/A"}
            </div>

          </div>

          {/* STOCK */}

          <div className="product-detail-row">

            <div className="product-detail-label">
              Stock
            </div>

            <div className="product-detail-value product-stock">
              {product.stock ?? 0}
            </div>

          </div>

          {/* PRODUCT ID */}

          <div className="product-detail-row">

            <div className="product-detail-label">
              Product ID
            </div>

            <div className="product-detail-value">
              {product._id || "N/A"}
            </div>

          </div>

          {/* CREATED AT */}

          <div className="product-detail-row">

            <div className="product-detail-label">
              Created At
            </div>

            <div className="product-detail-value">

              {product.createdAt
                ? new Date(
                    product.createdAt
                  ).toLocaleString(
                    "en-IN"
                  )
                : "N/A"}

            </div>

          </div>

          {/* UPDATED AT */}

          <div className="product-detail-row">

            <div className="product-detail-label">
              Updated At
            </div>

            <div className="product-detail-value">

              {product.updatedAt
                ? new Date(
                    product.updatedAt
                  ).toLocaleString(
                    "en-IN"
                  )
                : "N/A"}

            </div>

          </div>

          {/* ==================================================
              ACTION BUTTONS
          ================================================== */}

          <div className="product-details-actions">

            {/* BACK */}

            <button
              type="button"
              className="back-button"
              onClick={() =>
                navigate("/admin/products")
              }
            >
              ← Back to Products
            </button>

            {/* EDIT */}

            <button
              type="button"
              className="edit-product-button"
              onClick={() =>
                navigate(
                  "/admin/products"
                )
              }
            >
              Edit Product
            </button>

          </div>

        </div>

      </div>
    </>
  );
};

export default AdminProductDetails;