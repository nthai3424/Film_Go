import { useEffect, useState } from "react";
import { Button, Form, Input, message, Select } from "antd";
import { useMutation } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";

import axios from "axios";
import dayjs from "dayjs";

const { Option } = Select;

const UpdateShow = () => {
  const [messageApi, contextHolder] = message.useMessage();

  const nav = useNavigate();
  const { id } = useParams(); // Get the showtime ID from the URL
  const [screens, setScreens] = useState([]);
  const [movies, setMovies] = useState([]);
  const [showtime, setShowtime] = useState(null);

  useEffect(() => {
    axios
      .get("http://filmgo.io.vn/api/screens")
      .then((res) => setScreens(res.data.data));
  }, []);

  useEffect(() => {
    axios
      .get("http://filmgo.io.vn/api/movies")
      .then((res) => setMovies(res.data.data));
  }, []);

  useEffect(() => {
    if (id) {
      axios.get(`http://filmgo.io.vn/api/showtimes/show/${id}`).then((res) => {
        const showtimeData = res.data.data;
        setShowtime(showtimeData);
      });
    }
  }, [id]);

  const getAccessToken = () => {
    return localStorage.getItem("access_token"); // Hoặc bạn có thể lấy từ Cookies hoặc bất kỳ nguồn lưu trữ nào khác
  };

  const { mutate } = useMutation({
    mutationFn: async (showtimeData) => {
      const token = getAccessToken(); // Lấy token
      if (!token) {
        throw new Error("Không có access token");
      }

      // Gửi yêu cầu POST với access_token trong header
      await axios.put(
        `http://filmgo.io.vn/api/showtimes/update/${id}`,
        showtimeData,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Thêm Authorization header
          },
        }
      );
    },
    onSuccess: () => {
      nav(`/admin/list-showtime`);
    },
    onError: (error) => {
      let errorMessage = "Đã có lỗi xảy ra";

      if (error.response?.data) {
        const data = error.response.data;

        // Laravel trả về errors (object) -> join tất cả messages
        if (data.errors) {
          const messages = Object.values(data.errors).flat();
          errorMessage = messages.join(", ");
        }
      }

      messageApi.open({
        type: "error",
        content: errorMessage,
      });
    },
  });

  const onFinish = (values) => {
    mutate(values);
  };

  if (!showtime && id) {
    return <div>Loading...</div>; // Show loading state while fetching data
  }

  return (
    <Form
      name="basic"
      labelCol={{
        span: 8,
      }}
      wrapperCol={{
        span: 16,
      }}
      style={{
        maxWidth: 600,
      }}
      initialValues={{
        movie_id: showtime?.movie_id,
        screen_id: showtime?.screen_id,
        start_time: showtime
          ? dayjs(showtime.start_time).format("HH:mm")
          : null,
        end_time: showtime ? dayjs(showtime.end_time).format("HH:mm") : null,
        date: showtime ? dayjs(showtime.date).format("YYYY-MM-DD") : null,
      }}
      onFinish={onFinish}
      autoComplete="off"
    >
      {contextHolder}
      <h1 className="text-3xl mb-5">Chỉnh sửa xuất chiếu</h1>

      <Form.Item
        name="movie_id"
        label="Chọn phim"
        rules={[{ required: true, message: "Vui lòng Không bỏ trống" }]}
      >
        <Select placeholder="Chọn phim" disabled>
          {movies.map((movie) => (
            <Option key={movie.id} value={movie.id}>
              {movie.title}
            </Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item
        name="screen_id"
        label="Chọn phòng chiếu"
        rules={[{ required: true, message: "Vui lòng Không bỏ trống" }]}
      >
        <Select placeholder="Chọn phòng chiếu" disabled>
          {screens.map((screen) => (
            <Option key={screen.id} value={screen.id}>
              {screen.name}
            </Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item
        label="Chọn giờ chiếu"
        name="start_time"
        rules={[
          {
            required: true,
            message: "Bắt buộc chọn giờ chiếu",
          },
        ]}
      >
        <Input type="time" />
      </Form.Item>

      <Form.Item
        label="Chọn giờ kết thúc"
        name="end_time"
        rules={[
          {
            required: true,
            message: "Bắt buộc chọn giờ kết thúc",
          },
        ]}
      >
        <Input type="time" />
      </Form.Item>

      <Form.Item
        label="Chọn ngày chiếu"
        name="date"
        rules={[
          {
            required: true,
            message: "Bắt buộc chọn ngày chiếu",
          },
        ]}
      >
        <Input type="date" style={{ width: "100%" }} />
      </Form.Item>

      <Form.Item label={null}>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
};

export default UpdateShow;
