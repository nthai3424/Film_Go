import {
  Button,
  message,
  Popconfirm,
  Skeleton,
  Space,
  Table,
  DatePicker,
  Select,
  Row,
  Col, // Import thêm Row và Col từ Ant Design để sắp xếp layout
} from "antd";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Link } from "react-router-dom";
import moment from "moment"; // Để xử lý ngày tháng dễ dàng hơn
import { useState } from "react";

const { Option } = Select;

const ListShow = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const queryClient = useQueryClient();
  const [selectedDate, setSelectedDate] = useState(null); // Trạng thái lưu trữ ngày được chọn
  const [selectedMovie, setSelectedMovie] = useState(null); // Trạng thái lưu trữ phim được chọn
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
        `http://filmgo.io.vn/api/showtimes/delete/${id}`,

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
        content: "Bạn đã xóa suất chiếu thành công",
      });
      queryClient.invalidateQueries({ queryKey: ["showtimes"] });
    },
    onError: (error) => {
      let errorMessage = "Đã có lỗi xảy ra";

      // Kiểm tra lỗi từ phía backend (thông báo từ "message")
      if (error.response?.data) {
        const data = error.response.data;

        // Kiểm tra nếu có trường "message" trong phản hồi lỗi
        if (data.message) {
          errorMessage = data.message; // Hiển thị thông báo lỗi từ backend
        }
      }

      messageApi.open({
        type: "error",
        content: errorMessage,
      });
    },
  });

  const { isLoading, data } = useQuery({
    queryKey: ["showtimes"],
    queryFn: async () => {
      const response = await axios.get(`http://filmgo.io.vn/api/showtimes`);
      return response.data.data.map((showtime) => ({
        ...showtime,
        key: showtime.id,
      }));
    },
  });

  const { data: movies } = useQuery({
    queryKey: ["movies"],
    queryFn: async () => {
      const response = await axios.get(`http://filmgo.io.vn/api/movies`);
      return response.data.data.map((movie) => ({
        ...movie,
        key: movie.id,
      }));
    },
  });

  const { data: screens } = useQuery({
    queryKey: ["screens"],
    queryFn: async () => {
      const response = await axios.get(`http://filmgo.io.vn/api/screens`);
      return response.data.data.map((screen) => ({
        ...screen,
        key: screen.id,
      }));
    },
  });

  const handleDateChange = (date, dateString) => {
    setSelectedDate(dateString); // Cập nhật ngày đã chọn
  };

  const handleMovieChange = (movieId) => {
    setSelectedMovie(movieId); // Cập nhật phim đã chọn
  };

  // Lọc dữ liệu showtimes theo ngày và phim được chọn
  const filteredData = data
    ? data.filter((showtime) => {
        const isSameDate = selectedDate
          ? moment(showtime.date).isSame(selectedDate, "day")
          : true;
        const isSameMovie = selectedMovie
          ? showtime.movie_id === selectedMovie
          : true;
        return isSameDate && isSameMovie;
      })
    : [];

  const columns = [
    {
      title: "Tên phim",
      dataIndex: "movie_id",
      key: "movie_id",
      render: (movieId) => {
        const movie = movies?.find((movie) => movie.id === movieId);
        return movie ? movie.title : "Rạp không xác định"; // Hiển thị tên phim nếu tìm thấy
      },
    },
    {
      title: "Phòng chiếu",
      dataIndex: "screen_id",
      key: "screen_id",
      render: (screenId) => {
        const screen = screens?.find((screen) => screen.id === screenId);
        return screen ? screen.name : "Rạp không xác định";
      },
    },
    {
      title: "Giờ bắt đầu",
      dataIndex: "start_time",
      key: "start_time",
      render: (text) => <a>{text}</a>,
    },
    {
      title: "Giờ kết thúc",
      dataIndex: "end_time",
      key: "end_time",
      render: (text) => <a>{text}</a>,
    },
    {
      title: "Ngày chiếu",
      dataIndex: "date",
      key: "date",
      render: (text) => <a>{text}</a>,
    },
    {
      title: "",
      key: "action",
      render: (_, showtime) => (
        <Space>
          <Popconfirm
            title="Bạn có chắc muốn xoá phòng chiếu này?"
            onConfirm={() => mutate(showtime.id)}
            okText="Có"
            cancelText="Không"
          >
            <Button danger>Xoá</Button>
          </Popconfirm>
          <Link to={`/admin/update-showtime/${showtime.id}`}>
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
        <h1 className="text-3xl mb-5">Quản lý suất chiếu</h1>
      </center>
      <Link to="/admin/creat-showtime" className="btn btn-primary">
        Thêm suất chiếu
      </Link>
      <br />
      <br />
      {/* Sử dụng Row và Col để đặt các nút cạnh nhau */}
      <Row gutter={16}>
        <Col span={3}>
          {/* Thêm DatePicker để chọn ngày */}
          <DatePicker
            value={selectedDate ? moment(selectedDate, "YYYY-MM-DD") : null}
            onChange={handleDateChange}
            format="YYYY-MM-DD"
            placeholder="Chọn ngày"
            style={{ width: "100%" }}
          />
        </Col>
        <Col span={5}>
          {/* Thêm Select để chọn tên phim */}
          <Select
            value={selectedMovie}
            onChange={handleMovieChange}
            placeholder="Chọn phim"
            style={{ width: "100%" }}
          >
            <Option value={null}>Tất cả</Option>
            {movies?.map((movie) => (
              <Option key={movie.id} value={movie.id}>
                {movie.title}
              </Option>
            ))}
          </Select>
        </Col>
      </Row>
      <br />
      {isLoading ? (
        <Skeleton active />
      ) : (
        <Table columns={columns} dataSource={filteredData} rowKey="key" />
      )}
    </>
  );
};

export default ListShow;
