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

const ListCinema = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const queryClient = useQueryClient();

  const [selectedProvince, setSelectedProvince] = useState(null); // State để lưu khu vực đã chọn
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
        `http://filmgo.io.vn/api/cinemas/delete/${id}`,

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
        content: "Bạn đã xoá rạp phim thành công",
      });
      queryClient.invalidateQueries({ queryKey: ["cinemas"] });
    },
    onError: () => {
      messageApi.open({
        type: "error",
        content: "Xoá rạp phim thất bại, vui lòng thử lại sau",
      });
    },
  });

  const { isLoading, data } = useQuery({
    queryKey: ["cinemas"],
    queryFn: async () => {
      const response = await axios.get(`http://filmgo.io.vn/api/cinemas`);
      return response.data.data.map((cinema) => ({
        ...cinema,
        key: cinema.id,
      }));
    },
  });
  const { isLoading: isProvinceLoading, data: provinces } = useQuery({
    queryKey: ["provinces"],
    queryFn: async () => {
      const response = await axios.get(`http://filmgo.io.vn/api/provinces`);
      return response.data.data.map((province) => ({
        ...province,
        key: province.id,
      }));
    },
  });

  // Lọc dữ liệu phòng chiếu theo province_id
  const filteredData = selectedProvince
    ? data?.filter((cinema) => cinema.province_id === selectedProvince)
    : data;

  const columns = [
    {
      title: "Tên rạp",
      dataIndex: "name",
      key: "name",
      render: (text) => <a>{text}</a>,
    },
    {
      title: "Địa chỉ",
      dataIndex: "address",
      key: "address",
      render: (text) => <a>{text}</a>,
    },
    {
      title: "Liên hệ",
      dataIndex: "contact",
      key: "contact",
      render: (text) => <a>{text}</a>,
    },

    {
      title: "",
      key: "action",
      render: (_, cinema) => (
        <Space>
          <Popconfirm
            title="Bạn có chắc muốn xoá phim này?"
            onConfirm={() => mutate(cinema.id)}
            okText="Có"
            cancelText="Không"
          >
            <Button danger>Xoá</Button>
          </Popconfirm>
          <Link to={`/admin/update-cinema/${cinema.id}`}>
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
        <h1 className="text-3xl mb-5">Quản lý rạp phim</h1>
      </center>
      <Link to="/admin/creat-cinema" className="btn btn-primary">
        Thêm rạp phim
      </Link>
      <br />
      <br />

      {/* Dropdown lọc khu vực */}
      <div style={{ marginBottom: "20px" }}>
        <Select
          placeholder="Chọn khu vực"
          style={{ width: 200 }}
          onChange={(value) => setSelectedProvince(value)}
          allowClear
          loading={isProvinceLoading}
        >
          {provinces?.map((province) => (
            <Select.Option key={province.key} value={province.id}>
              {province.name} {/* Hiển thị tên rạp phim */}
            </Select.Option>
          ))}
        </Select>
      </div>

      {isLoading ? (
        <Skeleton active />
      ) : (
        <Table
          columns={columns}
          dataSource={filteredData} // Hiển thị dữ liệu đã lọc
          rowKey="key"
          pagination={false}
        />
      )}
    </>
  );
};

export default ListCinema;
