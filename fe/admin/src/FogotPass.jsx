import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const FogotPass = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Kiểm tra nếu email không rỗng
    if (!email) {
      setMessage("Vui lòng nhập email của bạn!");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      // Gửi yêu cầu tới backend để yêu cầu reset mật khẩu
      const response = await axios.post(
        "http://filmgo.io.vn/api/auth/forgot-password/get-token",
        { email }
      );

      // Xử lý nếu yêu cầu thành công
      if (response.status === 200) {
        setMessage(
          "Đã gửi email reset mật khẩu! Vui lòng kiểm tra email của bạn."
        );

        // Điều hướng người dùng đến trang nhập mã khôi phục
        nav("/changepass");
      }
    } catch (error) {
      // Xử lý khi có lỗi (ví dụ email không tồn tại)
      setMessage("Đã có lỗi xảy ra! Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="reset-password">
      <h2>Lấy lại mật khẩu</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={handleEmailChange}
            placeholder="Nhập email của bạn"
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? "Đang xử lý..." : "Gửi yêu cầu"}
        </button>
      </form>

      {message && <p>{message}</p>}
    </div>
  );
};

export default FogotPass;
