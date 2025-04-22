import { useQuery } from "@tanstack/react-query";
import { Button, Input, message, Skeleton, Space, Table } from "antd";
import axios from "axios";
import { Link } from "react-router-dom";
import { useState } from "react";

const StaffTiket = () => {
  const [searchTerm, setSearchTerm] = useState(""); // Lưu ticket_code cần tìm

  // Lấy token từ localStorage
  const getAccessToken = () => {
    return localStorage.getItem("access_token");
  };

  const { data, isLoading } = useQuery({
    queryKey: ["tickets"],
    queryFn: async () => {
      const token = getAccessToken();
      if (!token) throw new Error("Token không hợp lệ hoặc không tồn tại");

      const response = await axios.get(
        `http://filmgo.io.vn/api/admin/tickets`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data.data.map((ticket) => ({
        ...ticket,
        key: ticket.id,
      }));
    },
  });

  // Lọc dữ liệu theo ticket_code
  const filteredData = data?.filter((ticket) =>
    ticket.ticket_code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns = [
    {
      title: "Mã vé",
      dataIndex: "ticket_id",
      key: "ticket_id",
    },
    {
      title: "Code",
      dataIndex: "ticket_code",
      key: "ticket_code",
    },
    {
      title: "Tên người dùng",
      dataIndex: "user_name",
      key: "user_name",
    },
    {
      title: "Tên phim",
      dataIndex: "movie_name",
      key: "movie_name",
    },
    {
      title: "Thời gian",
      dataIndex: "showtime",
      key: "showtime",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
    },
    {
      title: "",
      key: "action",
      render: (_, ticket) => (
        <Space>
          <Link to={`/staff/detail-ticket/${ticket.ticket_id}`}>
            <Button type="primary">Xem chi tiết</Button>
          </Link>
        </Space>
      ),
    },
  ];

  return (
    <>
      <h1 className="text-3xl mb-5">Quản lý vé</h1>
      <div className="mb-4 flex gap-4 items-center">
        <Button type="primary">
          <Link to="/staff/check-ticket">Quét mã barcode</Link>
        </Button>
        <Input.Search
          placeholder="Tìm theo ticket code..."
          onSearch={(value) => setSearchTerm(value)}
          onChange={(e) => setSearchTerm(e.target.value)}
          enterButton
          style={{ maxWidth: 300 }}
        />
      </div>
      <Skeleton active loading={isLoading}>
        <Table columns={columns} dataSource={filteredData} />
      </Skeleton>
    </>
  );
};

export default StaffTiket;
