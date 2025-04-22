import { useQuery } from "@tanstack/react-query";
import { Button, Skeleton, Space, Table } from "antd";
import axios from "axios";
import { Link } from "react-router-dom";

const UserList = () => {
  // Lấy token từ localStorage
  const getAccessToken = () => {
    return localStorage.getItem("access_token");
  };

  const { data, isLoading } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const token = getAccessToken();

      // Kiểm tra token có hợp lệ không
      if (!token) {
        throw new Error("Token không hợp lệ hoặc không tồn tại");
      }

      // Thêm token vào header của yêu cầu
      const response = await axios.get(`http://filmgo.io.vn/api/users`, {
        headers: {
          Authorization: `Bearer ${token}`, // Thêm token vào header
        },
      });

      return response.data.data.map((user) => ({
        key: user.id,
        ...user,
      }));
    },
  });

  const columns = [
    {
      title: "Tên người dùng",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Số điện thoại",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "Vai trò",
      dataIndex: "role_name",
      key: "role",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
    },
    {
      title: "",
      key: "action",
      render: (_, user) => (
        <Space>
          <Link to={`/admin/update-user/${user.id}`}>
            <Button type="primary">Sửa</Button>
          </Link>
        </Space>
      ),
    },
  ];

  return (
    <>
      <h1 className="text-3xl mb-5">Quản lý người dùng</h1>
      <Skeleton active loading={isLoading}>
        <Table columns={columns} dataSource={data} />
      </Skeleton>
    </>
  );
};

export default UserList;
