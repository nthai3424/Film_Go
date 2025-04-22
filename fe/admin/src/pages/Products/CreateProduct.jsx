import React, { useState } from "react";
import { Form, Input, Button, Upload, message, InputNumber } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const API_ADD_PRODUCT = "http://filmgo.io.vn/api/products/create";

const CreateProduct = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [fileList, setFileList] = useState([]);
  const token = localStorage.getItem("access_token"); // Lấy token từ localStorage

  const beforeUpload = (file) => {
    const isValid = ["image/jpeg", "image/jpg", "image/png"].includes(
      file.type
    );
    if (!isValid) {
      message.error("Chỉ chấp nhận file JPG, JPEG hoặc PNG!");
      return false;
    }
    setFileList([file]);
    return false;
  };

  const handleSubmit = async (values) => {
    if (fileList.length === 0) {
      message.error("Vui lòng chọn ảnh!");
      return;
    }

    const formData = new FormData();
    formData.append("name", values.name);
    formData.append("image", fileList[0]);
    formData.append("code", values.code);
    formData.append("price", String(values.price));

    try {
      setLoading(true);
      const response = await fetch(API_ADD_PRODUCT, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`, // Thêm token vào header
        },
        body: formData,
      });
      const result = await response.json();

      if (response.ok) {
        message.success("Thêm combo thành công!");
        form.resetFields();
        setFileList([]);
        navigate("/admin/list-product");
      } else {
        message.error(result.message || "Thêm thất bại!");
      }
    } catch (error) {
      message.error("Lỗi kết nối API!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <center>
        <h2>Thêm Combo</h2>
      </center>
      <Form form={form} onFinish={handleSubmit} layout="vertical">
        <Form.Item
          label="Mã"
          name="code"
          rules={[{ required: true, message: "Vui lòng nhập mã!" }]}
        >
          <Input maxLength={10} placeholder="Nhập mã" />
        </Form.Item>

        <Form.Item
          label="Tên Combo"
          name="name"
          rules={[
            { required: true, message: "Vui lòng nhập tên combo!" },
            { min: 5, message: "Tên combo phải có ít nhất 5 ký tự!" },
          ]}
        >
          <Input placeholder="Nhập tên combo" />
        </Form.Item>

        <Form.Item
          label="Ảnh combo"
          name="image"
          rules={[{ required: true, message: "Vui lòng tải lên ảnh!" }]}
        >
          <Upload
            beforeUpload={beforeUpload}
            maxCount={1}
            accept=".jpg,.jpeg,.png"
            fileList={fileList}
            listType="picture"
          >
            <Button icon={<UploadOutlined />}>Chọn ảnh</Button>
          </Upload>
        </Form.Item>

        <Form.Item
          label="Giá combo"
          name="price"
          rules={[{ required: true, message: "Vui lòng nhập giá combo!" }]}
        >
          <InputNumber
            min={1}
            placeholder="Nhập giá combo"
            style={{ width: "100%" }}
          />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            Thêm combo
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default CreateProduct;
