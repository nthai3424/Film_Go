import React, { useEffect, useState } from "react";
import { Table, Typography, Button, Popconfirm, message, Image } from "antd";
import { Link } from "react-router-dom";

const { Title } = Typography;
const API_PRODUCTS = "http://filmgo.io.vn/api/products";

const ListProduct = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("access_token"); // Lấy token từ localStorage

  useEffect(() => {
    fetch(API_PRODUCTS, {
      headers: {
        Authorization: `Bearer ${token}`, // Thêm token vào header
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.data) {
          setProducts(data.data);
        } else {
          message.error("Không có dữ liệu sản phẩm!");
        }
      })
      .catch(() => message.error("Lỗi khi tải sản phẩm!"))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = (id) => {
    fetch(`${API_PRODUCTS}/delete/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then(() => {
        message.success("Combo đã được xoá thành công");
        setProducts((prev) => prev.filter((p) => p.id !== id));
      })
      .catch(() => message.error("Xoá combo thất bại"));
  };

  const columns = [
    { title: "Mã", dataIndex: "code", key: "code" },
    { title: "Combo", dataIndex: "name", key: "name" },
    {
      title: "Hình ảnh",
      dataIndex: "image",
      key: "image",
      render: (image) => <Image src={image} width={100} />,
    },
    {
      title: "Giá combo",
      dataIndex: "price",
      key: "price",
      render: (price) => <span>{parseInt(price).toLocaleString()} VNĐ</span>,
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, product) => (
        <>
          <Popconfirm
            title="Bạn có chắc muốn xoá combo này?"
            onConfirm={() => handleDelete(product.id)}
            okText="Có"
            cancelText="Không"
          >
            <Button danger>Xoá</Button>
          </Popconfirm>
          <Link to={`/admin/update-product/${product.id}`}>
            <Button type="primary">Sửa</Button>
          </Link>
        </>
      ),
    },
  ];

  return (
    <div style={{ padding: "20px" }}>
      <center>
        <Title level={2}>Quản lý Combo</Title>
      </center>
      <Link to="/admin/creat-product">
        <Button type="primary">Thêm Combo</Button>
      </Link>
      <Table
        columns={columns}
        dataSource={products}
        rowKey="id"
        loading={loading}
      />
    </div>
  );
};

export default ListProduct;
