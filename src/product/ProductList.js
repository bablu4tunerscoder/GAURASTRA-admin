import React, { useState } from "react";

const ProductList = ({ products }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 8;

  console.log(products)

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);

  const totalPages = Math.ceil(products.length / productsPerPage);

  return (
    <div>
      <h3 className="text-2xl font-semibold text-gray-800 mb-6">
        Saved Products <span className="text-sm font-normal text-gray-500">(Ready to Submit)</span>
      </h3>

      {/* Product List */}
      <div>
        {currentProducts.map((product, index) => (
          <div
            key={index}
            className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition"
          >
            <div className="p-5 space-y-2">
              <h4 className="text-lg font-semibold text-gray-900 truncate">
                {product.product_name}
              </h4>

              <p className="text-sm text-gray-600">
                Category: <span className="font-medium text-gray-800">{product.category_name}</span>
              </p>

              <p className="text-sm text-gray-600">
                Subcategory: <span className="font-medium text-gray-800">{product.Subcategory_name}</span>
              </p>

              <p className="text-sm text-gray-600">
                Price: <span className="font-semibold text-green-600">₹{product.pricing.original_price}</span>
              </p>

              <p className="text-sm text-gray-600">
                Media files: <span className="font-medium text-indigo-600">{product.mediaUrls.length}</span>
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {products.length > productsPerPage && (
        <div className="flex items-center justify-between mt-8 bg-white border rounded-lg px-4 py-3">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 text-sm font-medium rounded-md border 
                   disabled:opacity-50 disabled:cursor-not-allowed
                   hover:bg-gray-100 transition"
          >
            Previous
          </button>

          <span className="text-sm text-gray-700">
            Page <span className="font-medium">{currentPage}</span> of{" "}
            <span className="font-medium">{totalPages}</span>
          </span>

          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 text-sm font-medium rounded-md border 
                   disabled:opacity-50 disabled:cursor-not-allowed
                   hover:bg-gray-100 transition"
          >
            Next
          </button>
        </div>
      )}
    </div>

  );
};

export default ProductList;