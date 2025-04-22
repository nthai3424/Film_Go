import React, { useEffect, useState } from "react";
import {
  Table,
  Avatar,
  Typography,
  Card,
  Button,
  Popconfirm,
  message,
} from "antd";
import { Link, useNavigate } from "react-router-dom";

const { Title } = Typography;
const API_ACTORS = "http://filmgo.io.vn/api/actors";

const ApiList = () => {
  const [actors, setActors] = useState([]);
  const navigate = useNavigate();

  const getAccessToken = () => localStorage.getItem("access_token");

  useEffect(() => {
    const token = getAccessToken();
    if (!token) {
      message.error("Bạn cần đăng nhập để xem danh sách diễn viên!");
      navigate("/login");
      return;
    }

    fetch(API_ACTORS, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setActors(data.data || []))
      .catch(() => message.error("Lỗi khi tải danh sách diễn viên!"));
  }, [navigate]);

  const handleDelete = (id) => {
    const token = getAccessToken();
    fetch(`${API_ACTORS}/delete/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then(() => {
        message.success("Diễn viên đã được xoá thành công");
        setActors((prevActors) =>
          prevActors.filter((actor) => actor.id !== id)
        );
      })
      .catch(() => message.error("Xoá diễn viên thất bại"));
  };

  const columns = [
    { title: "ID", dataIndex: "id", key: "id" },
    {
      title: "Avatar",
      dataIndex: "avatar",
      key: "avatar",
      render: (avatar) => <Avatar src={avatar} />,
    },
    { title: "Name", dataIndex: "name", key: "name" },
    {
      title: "Actions",
      key: "actions",
      render: (_, actor) => (
        <div style={{ display: "flex", gap: "10px" }}>
          <Popconfirm
            title="Bạn có chắc muốn xoá diễn viên này?"
            onConfirm={() => handleDelete(actor.id)}
            okText="Có"
            cancelText="Không"
          >
            <Button danger>Xoá</Button>
          </Popconfirm>
          <Link to={`/admin/update-actors/${actor.id}`}>
            <Button type="primary">Sửa</Button>
          </Link>
        </div>
      ),
    },
  ];

  return (
    <div style={{ padding: "20px" }}>
      <Link to="/admin/create-actors">
        <Button type="primary" style={{ marginBottom: "15px" }}>
          Thêm diễn viên
        </Button>
      </Link>
      <Card title={<Title level={2}>Actors List</Title>}>
        <Table columns={columns} dataSource={actors} rowKey="id" />
      </Card>
    </div>
  );
};

export default ApiList;
