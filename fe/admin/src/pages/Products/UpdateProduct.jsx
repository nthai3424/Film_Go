import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Form, Input, Button, message, Select } from "antd";

const { Option } = Select;
const API_PRODUCTS = "http://filmgo.io.vn/api/products";

const UpdateProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("access_token"); // Lấy token từ localStorage

  useEffect(() => {
    fetch(`${API_PRODUCTS}/show/${id}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`, // Thêm token vào header
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data && data.data) {
          form.setFieldsValue(data.data);
        } else {
          message.error("Không tìm thấy sản phẩm!");
          navigate("/admin/list-products");
        }
      })
      .catch(() => message.error("Lỗi khi lấy dữ liệu sản phẩm!"));
  }, [id, form, navigate, token]);

  const handleUpdate = (values) => {
    setLoading(true);

    // Ép kiểu price thành số
    const updatedValues = {
      ...values,
      price: Number(values.price), // Chắc chắn gửi số thay vì chuỗi
    };

    fetch(`${API_PRODUCTS}/update/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // Thêm token vào header
      },
      body: JSON.stringify(updatedValues),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status) {
          message.success("Cập nhật sản phẩm thành công!");
          navigate("/admin/list-product");
        } else {
          message.error(data.message || "Cập nhật thất bại!");
        }
      })
      .catch(() => message.error("Cập nhật thất bại!"))
      .finally(() => setLoading(false));
  };

  return (
    <div style={{ maxWidth: "500px", margin: "auto", padding: "20px" }}>
      <h2>Chỉnh sửa Combo</h2>
      <Form form={form} layout="vertical" onFinish={handleUpdate}>
        <Form.Item
          name="code"
          label="Mã Combo"
          rules={[{ required: true, message: "Vui lòng nhập mã combo!" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="name"
          label="Tên Combo"
          rules={[{ required: true, message: "Vui lòng nhập tên combo!" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="price"
          label="Giá Combo"
          rules={[{ required: true, message: "Vui lòng nhập giá!" }]}
        >
          <Input type="number" />
        </Form.Item>
        <Form.Item
          name="image"
          label="Hình ảnh (URL)"
          rules={[{ required: true, message: "Vui lòng nhập link ảnh!" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="status"
          label="Trạng thái"
          rules={[{ required: true, message: "Vui lòng chọn trạng thái!" }]}
        >
          <Select>
            <Option value="active">Hoạt động</Option>
            <Option value="inactive">Không hoạt động</Option>
          </Select>
        </Form.Item>
        <Button type="primary" htmlType="submit" loading={loading}>
          Lưu
        </Button>
      </Form>
    </div>
  );
};

export default UpdateProduct;
