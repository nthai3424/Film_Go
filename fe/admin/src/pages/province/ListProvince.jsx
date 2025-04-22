import { Button, message, Popconfirm, Skeleton, Space, Table } from "antd";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Link } from "react-router-dom";

const ListProvince = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const queryClient = useQueryClient();
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
        `http://filmgo.io.vn/api/provinces/delete/${id}`,

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
        content: "Bạn đã xoá khu vực thành công",
      });
      queryClient.invalidateQueries({ queryKey: ["provinces"] });
    },
    onError: () => {
      messageApi.open({
        type: "error",
        content: "Xoá khu vực thất bại, vui lòng thử lại sau",
      });
    },
  });

  const { isLoading, data } = useQuery({
    queryKey: ["provinces"],
    queryFn: async () => {
      const response = await axios.get(`http://filmgo.io.vn/api/provinces`);
      return response.data.data.map((province) => ({
        ...province,
        key: province.id,
      }));
    },
  });

  const columns = [
    {
      title: "Tên khu vực",
      dataIndex: "name",
      key: "name",
      render: (text) => <a>{text}</a>,
    },
    {
      title: "",
      key: "action",
      render: (_, province) => (
        <Space>
          <Popconfirm
            title="Bạn có chắc muốn xoá phòng chiếu này?"
            onConfirm={() => mutate(province.id)}
            okText="Có"
            cancelText="Không"
          >
            <Button danger>Xoá</Button>
          </Popconfirm>
          <Link to={`/admin/update-province/${province.id}`}>
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
      <Link to="/admin/creat-province" className="btn btn-primary">
        Thêm khu vực
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

export default ListProvince;
