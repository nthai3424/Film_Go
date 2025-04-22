import { Button, message, Popconfirm, Skeleton, Space, Table, Tag } from "antd";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Link } from "react-router-dom";

const PromoCodeList = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const queryClient = useQueryClient();
  const token = localStorage.getItem("access_token"); // Lấy token từ localStorage

  const axiosInstance = axios.create({
    baseURL: "http://filmgo.io.vn/api", // Cấu hình baseURL
    headers: {
      Authorization: `Bearer ${token}`, // Thêm Access Token vào headers
    },
  });

  const { mutate } = useMutation({
    mutationFn: async (id) => {
      await axiosInstance.delete(
        `http://filmgo.io.vn/api/promocodes/delete/${id}`
      );
    },
    onSuccess: () => {
      messageApi.open({
        type: "success",
        content: "Bạn đã xoá mã khuyến mãi thành công",
      });
      queryClient.invalidateQueries({ queryKey: ["promocodes"] });
    },
    onError: () => {
      messageApi.open({
        type: "error",
        content: "Xoá mã khuyến mãi thất bại, vui lòng thử lại sau",
      });
    },
  });

  const { isLoading, data } = useQuery({
    queryKey: ["promocodes"],
    queryFn: async () => {
      const response = await axiosInstance.get(
        `http://filmgo.io.vn/api/promocodes`
      );
      console.log("Dữ liệu từ API:", response.data); // Kiểm tra dữ liệu
      return response.data.data.map((promocode) => ({
        ...promocode,
        key: promocode.id,
      }));
    },
  });

  const columns = [
    {
      title: "Mã",
      dataIndex: "code",
      key: "code",
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Số tiền giảm",
      dataIndex: "discount_amount",
      key: "discount_amount",
      render: (amount) => `${parseInt(amount).toLocaleString("vi-VN")} VND`,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        if (typeof status === "boolean") {
          return status ? (
            <Tag color="green">Active</Tag>
          ) : (
            <Tag color="red">Inactive</Tag>
          );
        }
        if (typeof status === "number") {
          return status === 1 ? (
            <Tag color="green">Active</Tag>
          ) : (
            <Tag color="red">Inactive</Tag>
          );
        }
        if (typeof status === "string") {
          return status.toLowerCase() === "active" ? (
            <Tag color="green">Active</Tag>
          ) : (
            <Tag color="red">Inactive</Tag>
          );
        }
        return <Tag color="gray">Unknown</Tag>;
      },
    },
    {
      title: "Thời gian bắt đầu",
      dataIndex: "start_date",
      key: "start_date",
    },
    {
      title: "Thời gian kết thúc",
      dataIndex: "end_date",
      key: "end_date",
    },
    {
      title: "Hành động",
      key: "action",
      render: (_, promocode) => (
        <Space>
          <Popconfirm
            title="Bạn có chắc muốn xoá mã khuyến mãi này?"
            onConfirm={() => mutate(promocode.id)}
            okText="Có"
            cancelText="Không"
          >
            <Button danger type="primary">
              Xoá
            </Button>{" "}
            {/* Nút Xoá có màu đỏ */}
          </Popconfirm>
          <Link to={`/admin/update-promo/${promocode.id}`}>
            <Button
              type="default"
              style={{ backgroundColor: "#1890ff", color: "#fff" }}
            >
              Sửa
            </Button>{" "}
            {/* Nút Sửa có màu xanh */}
          </Link>
        </Space>
      ),
    },
  ];

  return (
    <>
      {contextHolder}
      <center>
        <h1 className="text-3xl mb-5">Quản lý mã khuyến mãi</h1>
      </center>
      <Link to="/admin/create-promo">
        <Button
          type="default"
          style={{ backgroundColor: "#52c41a", color: "#fff" }}
        >
          Thêm mã khuyến mãi
        </Button>{" "}
        {/* Nút Thêm có màu xanh lá */}
      </Link>
      <br />
      <br />
      {isLoading ? (
        <Skeleton active />
      ) : (
        <Table columns={columns} dataSource={data} />
      )}
    </>
  );
};

export default PromoCodeList;
