import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Form, Input, Button, message } from "antd"; // Import Ant Design components

const Changepass = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // Hook để điều hướng

  // Hàm xử lý form submit
  const handleSubmit = async (values) => {
    const { token, email, password, password_confirm } = values;

    // Kiểm tra mật khẩu và xác nhận mật khẩu có trùng khớp không
    if (password !== password_confirm) {
      message.error("Mật khẩu xác nhận không trùng khớp!");
      return;
    }

    setLoading(true);

    try {
      // Gửi yêu cầu thay đổi mật khẩu
      const response = await axios.put(
        "http://filmgo.io.vn/api/auth/forgot-password/verify",
        {
          token,
          email,
          password,
          password_confirm,
        }
      );

      // Nếu yêu cầu thành công
      if (response.status === 200) {
        message.success("Mật khẩu đã được thay đổi thành công!");
        // Điều hướng người dùng đến trang đăng nhập
        navigate("/signin");
      }
    } catch (error) {
      message.error("Đã có lỗi xảy ra! Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="change-password"
      style={{ maxWidth: 400, margin: "0 auto", padding: "20px" }}
    >
      <h2>Thay đổi mật khẩu</h2>
      <Form
        name="change-password"
        onFinish={handleSubmit}
        initialValues={{ remember: true }}
        layout="vertical"
      >
        <Form.Item
          label="Mã khôi phục"
          name="token"
          rules={[{ required: true, message: "Vui lòng nhập mã khôi phục!" }]}
        >
          <Input placeholder="Nhập mã khôi phục" />
        </Form.Item>

        <Form.Item
          label="Email"
          name="email"
          rules={[
            { required: true, message: "Vui lòng nhập email của bạn!" },
            { type: "email", message: "Vui lòng nhập địa chỉ email hợp lệ!" },
          ]}
        >
          <Input placeholder="Nhập email của bạn" />
        </Form.Item>

        <Form.Item
          label="Mật khẩu mới"
          name="password"
          rules={[
            { required: true, message: "Vui lòng nhập mật khẩu mới!" },
            {
              min: 6,
              message: "Mật khẩu phải có ít nhất 6 ký tự!",
            },
          ]}
          hasFeedback
        >
          <Input.Password placeholder="Nhập mật khẩu mới" />
        </Form.Item>

        <Form.Item
          label="Xác nhận mật khẩu"
          name="password_confirm"
          dependencies={["password"]}
          rules={[
            { required: true, message: "Vui lòng xác nhận mật khẩu!" },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("password") === value) {
                  return Promise.resolve();
                }
                return Promise.reject(
                  new Error("Mật khẩu xác nhận không trùng khớp!")
                );
              },
            }),
          ]}
          hasFeedback
        >
          <Input.Password placeholder="Xác nhận mật khẩu" />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" block loading={loading}>
            Đổi mật khẩu
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Changepass;
