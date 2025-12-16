import React, { useState } from "react";

const ProductList = ({ products }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 8;

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);

  const totalPages = Math.ceil(products.length / productsPerPage);

  return (
    <div className="product-list-container">
      <h3>Saved Products (Ready to Submit)</h3>
      <div className="product-list">
        {currentProducts.map((product, index) => (
          <div key={index} className="product-item">
            <div className="product-info">
              <h4>{product.product_name}</h4>
              <p>Category: <span>{product.category_name}</span></p>
              <p>Subcategory: <span>{product.Subcategory_name}</span></p>
              <p>Price: <span>₹{product.pricing.original_price}</span></p>
              <p>Media files: <span>{product.mediaUrls.length}</span></p>
            </div>
          </div>
        ))}
      </div>

      {products.length > productsPerPage && (
        <div className="pagination">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <span>Page {currentPage} of {totalPages}</span>
          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductList;