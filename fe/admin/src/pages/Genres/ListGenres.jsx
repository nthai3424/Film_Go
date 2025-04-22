import React from "react";
import {
  Button,
  Image,
  message,
  Popconfirm,
  Skeleton,
  Space,
  Table,
  Tag,
} from "antd";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Link } from "react-router-dom";

const ListGenres = () => {
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
      await axios.delete(`http://filmgo.io.vn/api/genres/delete/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`, // Thêm Authorization header
        },
      });
    },
    onSuccess: () => {
      messageApi.open({
        type: "success",
        content: "Bạn đã xoá thành công",
      });
      queryClient.invalidateQueries({ queryKey: ["genres"] });
    },
    onError: () => {
      messageApi.open({
        type: "error",
        content: "Xoá thất bại, vui lòng thử lại sau",
      });
    },
  });

  const { isLoading, isError, data, error } = useQuery({
    queryKey: ["genres"],
    queryFn: async () => {
      const response = await axios.get(`http://filmgo.io.vn/api/genres`);
      return response.data.data.map((genre) => ({
        ...genre,
        key: genre.id,
      }));
    },
  });

  const columns = [
    {
      title: "STT",
      dataIndex: "id",
      key: "id",
      render: (text) => <a>{text}</a>,
    },
    {
      title: "Tên",
      dataIndex: "name",
      key: "name",
      render: (text) => <a>{text}</a>,
    },
    {
      title: "Hành động",
      key: "action",
      render: (_, genre) => (
        <Space>
          <Popconfirm
            title="Bạn có chắc muốn xoá không?"
            onConfirm={() => mutate(genre.id)}
            okText="Có"
            cancelText="Không"
          >
            <Button danger>Xoá</Button>
          </Popconfirm>
          <Link to={`/admin/update-genres/${genre.id}`}>
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
        <h1>Quản lý thể loại</h1>
      </center>
      <Link to="/admin/create-genres" className="btn btn-primary">
        Thêm
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

export default ListGenres;
