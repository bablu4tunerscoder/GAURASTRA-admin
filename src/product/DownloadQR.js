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
    <div className="qr-page-layout">
      <Sidebar />
      <div className="download-qr-container">
        <h2 className="title">Product QR Codes</h2>
        {isLoading ? (
          <p className="loading-text">Loading...</p>
        ) : (
          <div className="qr-grid">
            {products.map((product) => (
              <div key={product.product_id} className="qr-card">
                <h3 className="product-name">{product.product_name}</h3>
                {product.qrCode ? (
                  <>
                    <div id={`qr-${product.product_id}`} className="qr-box">
                      <QRCodeSVG
                        value={product.qrCode}
                        size={150}
                        level="L"
                        includeMargin
                      />
                    </div>
                    <button
                      className="download-btn"
                      onClick={() =>
                        downloadQR(product.product_id, product.product_name)
                      }
                    >
                      <FiDownload size={16} style={{ marginRight: "6px" }} />
                      Download QR
                    </button>
                  </>
                ) : (
                  <p className="no-qr">No QR Code Available</p>
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
