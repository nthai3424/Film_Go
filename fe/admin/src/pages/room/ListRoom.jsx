import {
  Button,
  message,
  Popconfirm,
  Skeleton,
  Space,
  Table,
  Select,
} from "antd";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Link } from "react-router-dom";
import { useState } from "react";

const ListRoom = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const queryClient = useQueryClient();
  const [selectedCinema, setSelectedCinema] = useState(null); // State để lưu rạp phim đã chọn
  const getAccessToken = () => {
    return localStorage.getItem("access_token");
  };
  const { mutate } = useMutation({
    mutationFn: async (id) => {
      const token = getAccessToken(); // Lấy token
      if (!token) {
        throw new Error("Không có access token");
      }

      // Gửi yêu cầu POST với access_token trong header
      await axios.delete(
        `http://filmgo.io.vn/api/screens/delete/${id}`,

        {
          headers: {
            Authorization: `Bearer ${token}`, // Thêm Authorization header
          },
        }
      );
    },
    onSuccess: () => {
      messageApi.open({
        type: "success",
        content: "Bạn đã xoá phòng chiếu thành công",
      });
      queryClient.invalidateQueries({ queryKey: ["screens"] });
    },
    onError: () => {
      messageApi.open({
        type: "error",
        content: "Xoá phòng chiếu thất bại, vui lòng thử lại sau",
      });
    },
  });

  const { isLoading, data } = useQuery({
    queryKey: ["screens"],
    queryFn: async () => {
      const response = await axios.get(`http://filmgo.io.vn/api/screens`);
      return response.data.data.map((screen) => ({
        ...screen,
        key: screen.id,
      }));
    },
  });

  const { isLoading: isCinemaLoading, data: cinemas } = useQuery({
    queryKey: ["cinemas"],
    queryFn: async () => {
      const response = await axios.get(`http://filmgo.io.vn/api/cinemas`);
      return response.data.data.map((cinema) => ({
        ...cinema,
        key: cinema.id,
      }));
    },
  });

  // Lọc dữ liệu phòng chiếu theo cinema_id
  const filteredData = selectedCinema
    ? data?.filter((screen) => screen.cinema_id === selectedCinema)
    : data;

  const columns = [
    {
      title: "Phòng chiếu",
      dataIndex: "name",
      key: "name",
      render: (text) => <a>{text}</a>,
    },
    {
      title: "Rạp phim", // Cột tên rạp
      dataIndex: "cinema_id",
      key: "cinema_id",
      render: (cinemaId) => {
        const cinema = cinemas?.find((cinema) => cinema.id === cinemaId);
        return cinema ? cinema.name : "Rạp không xác định"; // Hiển thị tên rạp nếu tìm thấy
      },
    },

    {
      title: "",
      key: "action",
      render: (_, screen) => (
        <Space>
          <Popconfirm
            title="Bạn có chắc muốn xoá phòng chiếu này?"
            onConfirm={() => mutate(screen.id)}
            okText="Có"
            cancelText="Không"
          >
            <Button danger>Xoá</Button>
          </Popconfirm>
          <Link to={`/admin/update-screen/${screen.id}`}>
            <Button type="primary">Sửa</Button>
          </Link>
        </Space>
      ),
    },
  ];

  return (
    <>
      {contextHolder}
      <center>
        <h1 className="text-3xl mb-5">Quản lý phòng chiếu</h1>
      </center>
      <Link to="/admin/creat-screen" className="btn btn-primary">
        Thêm phòng chiếu
      </Link>
      <br />
      <br />

      {/* Dropdown lọc rạp phim */}
      <div style={{ marginBottom: "20px" }}>
        <Select
          placeholder="Chọn rạp phim"
          style={{ width: 200 }}
          onChange={(value) => setSelectedCinema(value)}
          allowClear
          loading={isCinemaLoading}
        >
          {cinemas?.map((cinema) => (
            <Select.Option key={cinema.key} value={cinema.id}>
              {cinema.name} {/* Hiển thị tên rạp phim */}
            </Select.Option>
          ))}
        </Select>
      </div>

      {isLoading ? (
        <Skeleton active />
      ) : (
        <Table columns={columns} dataSource={filteredData} rowKey="key" />
      )}
    </>
  );
};

export default ListRoom;
