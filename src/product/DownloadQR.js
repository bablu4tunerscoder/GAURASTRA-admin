import { QRCodeSVG } from "qrcode.react";
import { useState } from "react";
import { FiDownload, FiAlertTriangle, FiLoader } from "react-icons/fi";
import { useFetchProductsQuery } from "../Redux/Slices/productSlice";
import "./DownloadQR.scss";

const DownloadQR = () => {
  const { data: products = [], isLoading, isError } = useFetchProductsQuery();
  const [downloadCounts, setDownloadCounts] = useState({});

  const sanitizeFileName = (name) => {
    return name
      ?.replace(/[^a-z0-9\s]/gi, "")
      ?.trim()
      ?.replace(/\s+/g, "_")
      ?.toLowerCase();
  };

  const downloadQR = (productId, productName) => {
    const svgWrapper = document.querySelector(`#qr-${productId}`);
    if (!svgWrapper) return;

    const svg = svgWrapper.querySelector("svg");
    if (!svg) return;

    const serializer = new XMLSerializer();
    const source = serializer.serializeToString(svg);
    const svgBlob = new Blob([source], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(svgBlob);

    const safeName = sanitizeFileName(productName);
    const fileName = `${safeName}_QRCode.svg`;

    const downloadLink = document.createElement("a");
    downloadLink.href = url;
    downloadLink.download = fileName;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);

    URL.revokeObjectURL(url);

    setDownloadCounts((prev) => ({
      ...prev,
      [productId]: (prev[productId] || 0) + 1,
    }));
  };

  // --- Rendering UI based on State ---

  if (isLoading) {
    return (
      <div className="min-h-screen p-8 flex justify-center items-center bg-gray-50">
        <div className="flex items-center text-xl text-blue-600">
          <FiLoader className="animate-spin mr-3" size={24} />
          <p>Loading Product Data...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen p-8 flex justify-center items-center bg-red-50">
        <div className="flex items-center text-xl text-red-700 bg-white p-6 rounded-lg shadow-md">
          <FiAlertTriangle className="mr-3" size={24} />
          <p>Error loading products. Please try again.</p>
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="min-h-screen p-8 flex justify-center items-center bg-gray-50">
        <div className="text-xl text-gray-500 bg-white p-6 rounded-lg shadow-md">
          <p>No products found to generate QR codes for.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-extrabold text-gray-800 mb-2">
          Product QR Code Generator
        </h1>
        <p className="text-gray-500 mb-10">
          Download high-quality SVG QR codes for all your available products.
        </p>

        {/* *** FLEXBOX IMPLEMENTATION START ***
          - flex and flex-wrap enable wrapping.
          - justify-center helps center items when they don't fill a row perfectly.
          - -6 margin compensation for inner padding/gap.
        */}
        <div className="flex flex-wrap -mx-3 justify-center">
          {products.map((product) => (
            <div
              key={product.product_id}
              // Width classes for responsive wrapping using Flexbox:
              // Mobile: 100% width (1 column) - use min-w-[280px] instead for better flow
              // sm: 1/2 width (2 columns)
              // md: 1/3 width (3 columns)
              // lg: 1/4 width (4 columns)
              // xl: 1/5 width (5 columns)
              className="p-3 w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5 min-w-[220px]"
            >
              <div
                // Card Styling applied to the inner div
                className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 p-5 flex flex-col items-center h-full border border-gray-100"
              >
                <h3 className="font-semibold text-center text-gray-800 mb-3 line-clamp-2">
                  {product.product_name}
                </h3>

                {product.qrCode ? (
                  <>
                    <div
                      id={`qr-${product.product_id}`}
                      className="mb-4 p-3 border-4 border-gray-100 rounded-xl bg-white shadow-inner"
                    >
                      <QRCodeSVG
                        value={product.qrCode}
                        size={140}
                        level="M"
                        includeMargin={false}
                      />
                    </div>
                    <button
                      className="mt-auto w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                      onClick={() =>
                        downloadQR(product.product_id, product.product_name)
                      }
                    >
                      <FiDownload size={18} />
                      Download SVG
                    </button>
                    {downloadCounts[product.product_id] > 0 && (
                      <p className="text-xs text-gray-500 mt-2">
                        Downloaded: **{downloadCounts[product.product_id]}** time(s)
                      </p>
                    )}
                  </>
                ) : (
                  <div className="h-[140px] w-full flex items-center justify-center bg-gray-100 rounded-lg my-4">
                    <p className="text-sm text-gray-400 p-2 text-center">
                      No QR Code Data
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DownloadQR;