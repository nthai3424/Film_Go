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

const ListBanner = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: async (id) => {
      await axios.delete(`http://filmgo.io.vn/api/banners/delete/${id}`);
    },
    onSuccess: () => {
      messageApi.open({
        type: "success",
        content: "Bạn đã xoá thành công",
      });
      queryClient.invalidateQueries({ queryKey: ["banners"] });
    },
    onError: () => {
      messageApi.open({
        type: "error",
        content: "Xoá phim thất bại, vui lòng thử lại sau",
      });
    },
  });

  const { isLoading, isError, data, error } = useQuery({
    queryKey: ["banners"],
    queryFn: async () => {
      const response = await axios.get(`http://filmgo.io.vn/api/banners`);
      return response.data.data.map((banner) => ({
        ...banner,
        key: banner.id,
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
      title: "Ảnh bìa",
      dataIndex: "image",
      key: "image",
      render: (poster) => <Image width={50} src={poster} />,
    },
    {
      title: "Hành động",
      key: "action",
      render: (_, banner) => (
        <Space>
          <Popconfirm
            title="Bạn có chắc muốn xoá ảnh này?"
            onConfirm={() => mutate(banner.id)}
            okText="Có"
            cancelText="Không"
          >
            <Button danger>Xoá</Button>
          </Popconfirm>
          {/* <Link to={`/admin/movies/${movie.id}/update`}> */}
          {/* <Link to={`/admin/update-banners/${banner.id}`}>
            <Button type="primary">Sửa</Button>
          </Link> */}
        </Space>
      ),
    },
  ];

  return (
    <>
      {contextHolder}
      <center>
        <h1>Quản lý </h1>
      </center>
      <Link to="/admin/create-banners" className="btn btn-primary">
        Thêm banner
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

export default ListBanner;
