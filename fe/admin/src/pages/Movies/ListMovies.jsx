import React, { useEffect, useState } from "react";
import {
  Button,
  Image,
  Input,
  message,
  Popconfirm,
  Select,
  Skeleton,
  Space,
  Table,
  Tag,
} from "antd";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Link } from "react-router-dom";
import Search from "antd/es/transfer/search";

const ListMovies = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState(""); // 👈 Thêm state để tìm kiếm
  const [selectedGenre, setSelectedGenre] = useState("");
  const [allGenres, setAllGenres] = useState([]);

  const getAccessToken = () => {
    return localStorage.getItem("access_token");
  };

  const { mutate } = useMutation({
    mutationFn: async (id) => {
      const token = getAccessToken(); // Lấy token
      if (!token) {
        throw new Error("Không có access token");
      }
      await axios.delete(`http://filmgo.io.vn/api/movies/delete/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`, // Thêm Authorization header
        },
      });
    },
    onSuccess: () => {
      messageApi.open({
        type: "success",
        content: "Bạn đã xoá phim thành công",
      });
      queryClient.invalidateQueries({ queryKey: ["movies"] });
    },
    onError: () => {
      messageApi.open({
        type: "error",
        content: "Xoá phim thất bại, vui lòng thử lại sau",
      });
    },
  });

  const { isLoading, isError, data, error } = useQuery({
    queryKey: ["movies"],
    queryFn: async () => {
      const response = await axios.get(`http://filmgo.io.vn/api/movies`);
      return response.data.data.map((movie) => ({
        ...movie,
        key: movie.id,
      }));
    },
  });
  // Gọi API lấy danh sách thể loại
  useEffect(() => {
    axios
      .get("http://filmgo.io.vn/api/genres")
      .then((res) => {
        setAllGenres(res.data.data); // bạn có thể cần check lại cấu trúc data nếu khác
      })
      .catch((err) => {
        console.error("Lỗi lấy thể loại:", err);
      });
  }, []);

  // 👉 Lọc dữ liệu theo từ khoá tìm kiếm
  const filteredData = data?.filter((movie) => {
    const matchesSearch =
      movie.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      movie.id.toString().includes(searchTerm);
    const matchesGenre =
      !selectedGenre ||
      movie.genres.some((genre) => genre.name === selectedGenre);

    return matchesSearch && matchesGenre;
  });
  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      render: (text) => <a>{text}</a>,
    },
    {
      title: "Name",
      dataIndex: "title",
      key: "title",
      render: (text) => <a>{text}</a>,
    },
    {
      title: "Ảnh",
      dataIndex: "poster",
      key: "poster",
      render: (poster) => <Image width={50} src={poster} />,
    },
    {
      title: "Trailer",
      dataIndex: "trailer",
      key: "trailer",
      render: (trailer) => (
        <a href={trailer} target="_blank" rel="noopener noreferrer">
          Xem trailer
        </a>
      ),
    },
    {
      title: "Ngày phát hành",
      dataIndex: "release_date",
      key: "release_date",
      render: (text) => <Tag color="blue">{text}</Tag>,
    },
    {
      title: "Ngày kết thúc",
      dataIndex: "end_date",
      key: "end_date",
      render: (text) => <Tag color="blue">{text}</Tag>,
    },
    {
      title: "Thể loại",
      key: "genres",
      dataIndex: "genres",
      render: (genres) => (
        <>
          {genres.map((genre) => (
            <Tag key={genre.genre_id}>{genre.name}</Tag>
          ))}
        </>
      ),
    },
    {
      title: "Diễn viên",
      key: "actors",
      dataIndex: "actors",
      render: (actors) => (
        <>
          {actors.map((actor) => (
            <Tag key={actor.actor_id}>{actor.name}</Tag>
          ))}
        </>
      ),
    },
    {
      title: "Thời lượng",
      dataIndex: "duration",
      key: "duration",
      render: (text) => <Tag color="cyan">{text} phút</Tag>,
    },
    {
      title: "Đánh giá",
      dataIndex: "rating",
      key: "rating",
      render: (text) => <Tag color="gold">{text}</Tag>,
    },
    {
      title: "Hành động",
      key: "action",
      render: (_, movie) => (
        <Space direction="vertical">
          <Popconfirm
            title="Bạn có chắc muốn xoá phim này?"
            onConfirm={() => mutate(movie.id)}
            okText="Có"
            cancelText="Không"
          >
            <Button danger>Xoá</Button>
          </Popconfirm>
          <Link to={`/admin/update-movies/${movie.id}`}>
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
        <h1>Quản lý phim</h1>
      </center>
      <Link to="/admin/create-movies" className="btn btn-primary">
        Thêm phim
      </Link>
      <br />
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          margin: "20px 0",
          width: "400px",
        }}
      >
        {/* 🔍 Tìm kiếm */}
        <Search
          placeholder="Tìm kiếm theo tên hoặc ID..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          enterButton
          allowClear
          style={{ width: 300 }}
        />

        {/* 🎯 Lọc thể loại */}
        <Select
          allowClear
          style={{ width: 200 }}
          placeholder="Lọc theo thể loại"
          onChange={(value) => setSelectedGenre(value)}
          value={selectedGenre || undefined}
        >
          {allGenres.map((genre) => (
            <Select.Option key={genre.id} value={genre.name}>
              {genre.name}
            </Select.Option>
          ))}
        </Select>
      </div>

      {isLoading ? (
        <Skeleton active />
      ) : (
        <Table columns={columns} dataSource={filteredData} />
      )}
    </>
  );
};

export default ListMovies;
