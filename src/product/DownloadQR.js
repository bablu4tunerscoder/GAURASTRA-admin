import { QRCodeSVG } from "qrcode.react";
import { useState } from "react";
import { FiDownload } from "react-icons/fi";
import { useDispatch } from "react-redux";
import Sidebar from "../Components/Sidebar/sidebar";
import { useFetchProductsQuery } from "../Redux/Slices/productSlice";
import "./DownloadQR.scss";

const DownloadQR = () => {
  const dispatch = useDispatch();
  const { data: products = [], isLoading, isError } = useFetchProductsQuery();
  const [downloadCounts, setDownloadCounts] = useState({});


  // ✅ Sanitize product name for valid filename
  const sanitizeFileName = (name) => {
    return name.replace(/[^a-z0-9]/gi, "_").toLowerCase();
  };

  const downloadQR = (productId, productName) => {
    const svg = document.querySelector(`#qr-${productId} svg`);
    if (!svg) return;

    const serializer = new XMLSerializer();
    const source = serializer.serializeToString(svg);
    const svgBlob = new Blob([source], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(svgBlob);

    // ✅ Use sanitized product name for filename
    const safeName = sanitizeFileName(productName);
    const fileName = `${safeName}_QRCode.svg`;

    const downloadLink = document.createElement("a");
    downloadLink.href = url;
    downloadLink.download = fileName;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);

    setDownloadCounts((prev) => ({
      ...prev,
      [productId]: (prev[productId] || 0) + 1,
    }));
  };

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl font-bold mb-6">Product QR Codes</h2>

        {isLoading ? (
          <p className="text-gray-500">Loading...</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {products.map((product) => (
              <div
                key={product.product_id}
                className="bg-white rounded-xl shadow p-4 flex flex-col items-center"
              >
                <h3 className="font-medium text-lg text-center mb-4">
                  {product.product_name}
                </h3>

                {product.qrCode ? (
                  <>
                    <div
                      id={`qr-${product.product_id}`}
                      className="mb-4 p-2 border rounded-lg bg-gray-50"
                    >
                      <QRCodeSVG
                        value={product.qrCode}
                        size={150}
                        level="L"
                        includeMargin
                      />
                    </div>
                    <button
                      className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg transition"
                      onClick={() =>
                        downloadQR(product.product_id, product.product_name)
                      }
                    >
                      <FiDownload size={16} />
                      Download QR
                    </button>
                  </>
                ) : (
                  <p className="text-gray-400">No QR Code Available</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>

  );
};

export default DownloadQR;
