import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API_URL from "../config/api";

const AdminProducts = () => {
  // ======================================================
  // NAVIGATION
  // ======================================================

  const navigate = useNavigate();

  // ======================================================
  // PRODUCTS
  // ======================================================

  const [products, setProducts] = useState([]);

  // ======================================================
  // PAGINATION
  // ======================================================

  const [page, setPage] = useState(1);
  const [limit] = useState(5);

  const [totalProducts, setTotalProducts] = useState(0);
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
  // ADD / EDIT PRODUCT FORM
  // ======================================================

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [stock, setStock] = useState("");

  // ======================================================
  // EDIT PRODUCT
  // ======================================================

  const [editingProductId, setEditingProductId] = useState(null);

  // ======================================================
  // FETCH PRODUCTS
  // ======================================================

  const fetchProducts = async () => {
    try {
      setLoading(true);
      console.log("API_URL:", API_URL);

      const token = localStorage.getItem("token");

      const response = await fetch(
        `${API_URL}/api/admin/products?page=${page}&limit=${limit}&search=${encodeURIComponent(
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

      console.log("Products Response JSON:", JSON.stringify(data, null, 2));

      if (!response.ok) {
        alert(
          data.message ||
            "Failed to fetch products"
        );

        return;
      }

      setProducts(data.products || []);

      setTotalProducts(
        data.totalProducts || 0
      );

      setTotalPages(
        data.totalPages || 1
      );
    } catch (error) {
      console.error(
        "Fetch Products Error:",
        error
      );

      alert("Server error");
    } finally {
      setLoading(false);
    }
  };

  // ======================================================
  // ADD / UPDATE PRODUCT
  // ======================================================

  const handleSubmitProduct = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      const url = editingProductId
        ? `${API_URL}/api/admin/products/${editingProductId}`
        : `${API_URL}/api/admin/products`;

      const method = editingProductId
        ? "PATCH"
        : "POST";

      const response = await fetch(url, {
        method,

        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },

        body: JSON.stringify({
          name,
          description,
          price: Number(price),
          category,
          stock: Number(stock),
        }),
      });

      const data = await response.json();

      console.log(
        "Product Response:",
        data
      );

      if (!response.ok) {
        alert(
          data.message ||
            "Failed to save product"
        );

        return;
      }

      if (editingProductId) {
        alert(
          "Product updated successfully"
        );
      } else {
        alert(
          "Product added successfully"
        );
      }

      // ==================================================
      // CLEAR FORM
      // ==================================================

      setName("");
      setDescription("");
      setPrice("");
      setCategory("");
      setStock("");

      // ==================================================
      // EXIT EDIT MODE
      // ==================================================

      setEditingProductId(null);

      // ==================================================
      // REFRESH PRODUCTS
      // ==================================================

      fetchProducts();
    } catch (error) {
      console.error(
        "Save Product Error:",
        error
      );

      alert("Server error");
    }
  };

  // ======================================================
  // EDIT PRODUCT
  // ======================================================

  const handleEditProduct = (product) => {
    setEditingProductId(product._id);

    setName(product.name || "");

    setDescription(
      product.description || ""
    );

    setPrice(product.price ?? "");

    setCategory(
      product.category || ""
    );

    setStock(product.stock ?? "");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // ======================================================
  // VIEW PRODUCT
  // ======================================================

  const handleViewProduct = (productId) => {
    navigate(
      `/admin/products/${productId}`
    );
  };

  // ======================================================
  // DELETE PRODUCT
  // ======================================================

  const handleDeleteProduct = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `${API_URL}/api/admin/products/${id}`,
        {
          method: "DELETE",

          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      console.log(
        "Delete Product Response:",
        data
      );

      if (!response.ok) {
        alert(
          data.message ||
            "Failed to delete product"
        );

        return;
      }

      alert(
        "Product deleted successfully"
      );

      fetchProducts();
    } catch (error) {
      console.error(
        "Delete Product Error:",
        error
      );

      alert("Server error");
    }
  };

  // ======================================================
  // CANCEL EDIT
  // ======================================================

  const handleCancelEdit = () => {
    setEditingProductId(null);

    setName("");
    setDescription("");
    setPrice("");
    setCategory("");
    setStock("");
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
    fetchProducts();
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
        <h2>Loading Products...</h2>
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

          .products-page {
            width: 100%;
            max-width: 100%;
            overflow-x: hidden;
          }

          .products-heading {
            font-size: 32px;
            margin-top: 0;
            margin-bottom: 20px;
          }

          .product-form {
            width: 100%;
            max-width: 600px;
          }

          .form-field {
            width: 100%;
            margin-bottom: 15px;
          }

          .form-field label {
            display: block;
            font-weight: 600;
            margin-bottom: 5px;
          }

          .form-field input {
            width: 100%;
            padding: 10px;
            font-size: 14px;
            border: 1px solid #aaa;
            border-radius: 5px;
            box-sizing: border-box;
          }

          .form-buttons {
            display: flex;
            align-items: center;
            gap: 10px;
            flex-wrap: wrap;
          }

          .form-buttons button {
            padding: 9px 15px;
            cursor: pointer;
            border: none;
            border-radius: 5px;
          }

          .submit-product-button {
            background-color: #007bff;
            color: white;
          }

          .submit-product-button:hover {
            background-color: #0069d9;
          }

          .cancel-product-button {
            background-color: #6c757d;
            color: white;
          }

          .cancel-product-button:hover {
            background-color: #5a6268;
          }

          .search-product {
            width: 100%;
            max-width: 450px;
            display: flex;
            align-items: center;
            gap: 10px;
          }

          .search-product input {
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

          .products-table-wrapper {
            width: 100%;
            max-width: 100%;
            overflow-x: auto;
            overflow-y: hidden;
            -webkit-overflow-scrolling: touch;
            border: 1px solid #ddd;
          }

          .products-table {
            width: 100%;
            min-width: 1050px;
            border-collapse: collapse;
            background: #fff;
            color: #222;
          }

          .products-table th,
          .products-table td {
            padding: 10px;
            border: 1px solid #ddd;
            white-space: nowrap;
          }

          .products-table th {
            background-color: #ddd;
          }

          .product-actions {
            display: flex;
            gap: 8px;
            align-items: center;
          }

          .product-actions button {
            padding: 7px 12px;
            cursor: pointer;
            border: none;
            border-radius: 4px;
            font-weight: 600;
          }

          .view-button {
            background-color: #198754;
            color: white;
          }

          .view-button:hover {
            background-color: #157347;
          }

          .edit-button {
            background-color: #007bff;
            color: white;
          }

          .edit-button:hover {
            background-color: #0069d9;
          }

          .delete-button {
            background-color: #dc3545;
            color: white;
          }

          .delete-button:hover {
            background-color: #bb2d3b;
          }

          .products-pagination {
            display: flex;
            align-items: center;
            gap: 15px;
            flex-wrap: wrap;
          }

          .products-pagination button {
            padding: 8px 15px;
            cursor: pointer;
            border: 1px solid #aaa;
            border-radius: 5px;
            background-color: white;
          }

          .products-pagination button:disabled {
            cursor: not-allowed;
            opacity: 0.5;
          }

          @media (max-width: 600px) {

            .products-page {
              padding: 15px !important;
            }

            .products-heading {
              font-size: 25px;
              line-height: 1.2;
            }

            .product-form {
              width: 100%;
            }

            .form-field input {
              width: 100%;
              padding: 12px;
              font-size: 16px;
            }

            .form-buttons {
              width: 100%;
            }

            .form-buttons button {
              padding: 10px 14px;
            }

            .search-product {
              width: 100%;
              max-width: 100%;
            }

            .search-product input {
              width: 100%;
              padding: 12px;
              font-size: 16px;
            }

            .clear-search-button {
              padding: 12px 15px;
            }

            .products-table-wrapper {
              width: 100%;
              overflow-x: auto;
            }

            .products-table {
              min-width: 1050px;
            }

            .product-actions {
              gap: 6px;
            }

            .product-actions button {
              padding: 7px 10px;
            }

            .products-pagination {
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
        className="products-page"
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

        <h1 className="products-heading">
          Products Management
        </h1>

        {/* ==================================================
            ADD / EDIT PRODUCT
        ================================================== */}

        <h2>
          {editingProductId
            ? "Edit Product"
            : "Add New Product"}
        </h2>

        <form
          className="product-form"
          onSubmit={handleSubmitProduct}
        >
          {/* NAME */}

          <div className="form-field">
            <label>
              Product Name
            </label>

            <input
              type="text"
              placeholder="Enter product name"
              value={name}
              onChange={(e) =>
                setName(e.target.value)
              }
              required
            />
          </div>

          {/* DESCRIPTION */}

          <div className="form-field">
            <label>
              Description
            </label>

            <input
              type="text"
              placeholder="Enter product description"
              value={description}
              onChange={(e) =>
                setDescription(
                  e.target.value
                )
              }
              required
            />
          </div>

          {/* PRICE */}

          <div className="form-field">
            <label>
              Price
            </label>

            <input
              type="number"
              placeholder="Enter price"
              value={price}
              onChange={(e) =>
                setPrice(e.target.value)
              }
              required
            />
          </div>

          {/* CATEGORY */}

          <div className="form-field">
            <label>
              Category
            </label>

            <input
              type="text"
              placeholder="Enter category"
              value={category}
              onChange={(e) =>
                setCategory(
                  e.target.value
                )
              }
              required
            />
          </div>

          {/* STOCK */}

          <div className="form-field">
            <label>
              Stock
            </label>

            <input
              type="number"
              placeholder="Enter stock"
              value={stock}
              onChange={(e) =>
                setStock(e.target.value)
              }
              required
            />
          </div>

          {/* FORM BUTTONS */}

          <div className="form-buttons">
            <button
              type="submit"
              className="submit-product-button"
            >
              {editingProductId
                ? "Update Product"
                : "Add Product"}
            </button>

            {editingProductId && (
              <button
                type="button"
                className="cancel-product-button"
                onClick={
                  handleCancelEdit
                }
              >
                Cancel
              </button>
            )}
          </div>
        </form>

        <br />

        <hr />

        <br />

        {/* ==================================================
            TOTAL PRODUCTS
        ================================================== */}

        <h3>
          Total Products: {totalProducts}
        </h3>

        {/* ==================================================
            SEARCH
        ================================================== */}

        <div className="search-product">
          <input
            type="text"
            placeholder="Search product..."
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

        <br />

        {/* ==================================================
            PRODUCTS TABLE
        ================================================== */}

        <div className="products-table-wrapper">
          <table className="products-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Description</th>
                <th>Price</th>
                <th>Category</th>
                <th>Stock</th>
                <th>Created At</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {products.length > 0 ? (
                products.map((product) => (
                  <tr key={product._id}>
                    {/* NAME */}

                    <td>
                      {product.name}
                    </td>

                    {/* DESCRIPTION */}

                    <td>
                      {product.description}
                    </td>

                    {/* PRICE */}

                    <td>
                      ₹
                      {Number(
                        product.price || 0
                      ).toLocaleString(
                        "en-IN"
                      )}
                    </td>

                    {/* CATEGORY */}

                    <td>
                      {product.category}
                    </td>

                    {/* STOCK */}

                    <td>
                      {product.stock}
                    </td>

                    {/* CREATED AT */}

                    <td>
                      {product.createdAt
                        ? new Date(
                            product.createdAt
                          ).toLocaleDateString(
                            "en-IN"
                          )
                        : "N/A"}
                    </td>

                    {/* ACTIONS */}

                    <td>
                      <div className="product-actions">
                        {/* VIEW */}

                        <button
                          type="button"
                          className="view-button"
                          onClick={() =>
                            handleViewProduct(
                              product._id
                            )
                          }
                        >
                          View
                        </button>

                        {/* EDIT */}

                        <button
                          type="button"
                          className="edit-button"
                          onClick={() =>
                            handleEditProduct(
                              product
                            )
                          }
                        >
                          Edit
                        </button>

                        {/* DELETE */}

                        <button
                          type="button"
                          className="delete-button"
                          onClick={() =>
                            handleDeleteProduct(
                              product._id
                            )
                          }
                        >
                          Delete
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
                      ? "No products found for this search"
                      : "No products found"}
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

        <div className="products-pagination">
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
            Page {page} of {totalPages}
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
    </>
  );
};

export default AdminProducts;