import React, { useState } from "react";
import BarcodeScannerComponent from "react-qr-barcode-scanner";
import { Link, useNavigate } from "react-router-dom"; // Thêm useNavigate

const StaffCheck = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [barcode, setBarcode] = useState(null);
  const [ticketInfo, setTicketInfo] = useState(null); // Dữ liệu vé
  const [error, setError] = useState(null);
  const [cameraActive, setCameraActive] = useState(false); // Trạng thái camera (mở/đóng)
  const navigate = useNavigate(); // Khai báo useNavigate

  // Hàm xử lý quét barcode
  const handleBarcodeScan = (data) => {
    if (data) {
      setBarcode(data.text); // Lưu mã barcode khi quét được
    }
  };

  // Hàm kiểm tra vé
  const checkTicket = async () => {
    if (!barcode) {
      setMessage("Vui lòng quét mã barcode trước!");
      return;
    }

    setLoading(true);
    setMessage("");
    setError(null);
    setTicketInfo(null);

    // Lấy access_token từ localStorage
    const accessToken = localStorage.getItem("access_token");

    if (!accessToken) {
      setMessage("Chưa đăng nhập, vui lòng đăng nhập lại.");
      setLoading(false);
      return;
    }

    try {
      // Gửi yêu cầu đến API kiểm tra vé
      const response = await fetch(
        "http://filmgo.io.vn/api/admin/tickets/check",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`, // Thêm token vào header Authorization
          },
          body: JSON.stringify({ barcode }), // Gửi mã barcode để kiểm tra vé
        }
      );

      const data = await response.json();
      console.log(data); //kiểm tra dữ liệu data trả về

      if (response.ok) {
        // Nếu API trả về vé hợp lệ, hiển thị thông tin vé
        setTicketInfo(data.data); // Giả sử `data.ticket` chứa thông tin vé
        setMessage("Vé hợp lệ!");

        // Tự động chuyển đến trang chi tiết vé
        navigate(`/staff/detail-ticket/${data.data.ticket_id}`);
      } else {
        setMessage(`Lỗi: ${data.message || "Có lỗi xảy ra."}`);
        setError(data.message || "Có lỗi xảy ra.");
      }
    } catch (error) {
      setMessage("Không thể kết nối tới máy chủ.");
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Hàm mở/đóng camera
  const toggleCamera = () => {
    setCameraActive(!cameraActive);
  };

  const styles = {
    container: {
      fontFamily: "Arial, sans-serif",
      textAlign: "center",
      maxWidth: "500px",
      margin: "20px auto",
      padding: "20px",
      border: "1px solid #ccc",
      borderRadius: "10px",
      backgroundColor: "#f9f9f9",
    },
    heading: {
      fontSize: "24px",
      color: "#333",
    },
    button: {
      backgroundColor: "#007bff",
      color: "white",
      border: "none",
      padding: "12px 20px",
      fontSize: "16px",
      cursor: "pointer",
      borderRadius: "5px",
      margin: "10px",
      transition: "background-color 0.3s",
    },
    buttonActive: {
      backgroundColor: "#dc3545", // Khi camera đang mở
    },
    buttonHover: {
      backgroundColor: "#0056b3",
    },
    scannerContainer: {
      marginTop: "20px",
    },
    ticketInfo: {
      marginTop: "20px",
      textAlign: "left",
      fontSize: "16px",
    },
    errorMessage: {
      color: "red",
      fontWeight: "bold",
    },
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Kiểm tra Vé Xem Phim</h1>

      {/* Nút mở/đóng camera */}
      <button
        style={{
          ...styles.button,
          ...(cameraActive ? styles.buttonActive : {}),
          ":hover": styles.buttonHover,
        }}
        onClick={toggleCamera}
      >
        {cameraActive ? "Tắt Camera" : "Mở Camera"}
      </button>

      {/* Hiển thị camera nếu đang mở */}
      {cameraActive && (
        <div style={styles.scannerContainer}>
          <BarcodeScannerComponent
            onUpdate={(err, result) => handleBarcodeScan(result)}
            width="300px"
            height="200px"
          />
        </div>
      )}

      {/* Hiển thị mã barcode đã quét */}
      {barcode && !loading && <p>Mã Barcode: {barcode}</p>}

      <button
        style={styles.button}
        onClick={checkTicket}
        disabled={loading || !barcode}
      >
        {loading ? "Đang kiểm tra..." : "Kiểm tra Vé"}
      </button>

      {/* Hiển thị lỗi nếu có */}
      {error && <p style={styles.errorMessage}>Lỗi: {error}</p>}
    </div>
  );
};

export default StaffCheck;
