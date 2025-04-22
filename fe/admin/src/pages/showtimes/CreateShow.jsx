import { useEffect, useState } from "react";
import { Button, Form, Input, message, Select } from "antd";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const { Option } = Select;

const CreateShow = () => {
  const nav = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();

  const [cinemas, setCinemas] = useState([]); // Danh sách các rạp
  const [screens, setScreens] = useState([]); // Danh sách phòng chiếu
  const [movies, setMovies] = useState([]); // Danh sách các phim
  const [selectedCinema, setSelectedCinema] = useState(null); // Rạp đã chọn

  useEffect(() => {
    // Lấy danh sách các phim
    axios
      .get("http://filmgo.io.vn/api/movies")
      .then((res) => setMovies(res.data.data));
  }, []);

  useEffect(() => {
    // Lấy danh sách phòng chiếu và nhóm chúng theo cinema_id
    axios.get("http://filmgo.io.vn/api/screens").then((res) => {
      const screensData = res.data.data;

      // Nhóm phòng chiếu theo cinema_id
      const groupedCinemas = screensData.reduce((acc, screen) => {
        const cinemaId = screen.cinema.id;
        if (!acc[cinemaId]) {
          acc[cinemaId] = {
            cinemaId,
            name: screen.cinema.name,
            screens: [],
          };
        }
        acc[cinemaId].screens.push(screen);
        return acc;
      }, {});

      // Lấy danh sách các rạp (cinema)
      setCinemas(Object.values(groupedCinemas));

      // Set lại phòng chiếu (sẽ được lọc khi chọn rạp)
      setScreens([]);
    });
  }, []);

  useEffect(() => {
    if (selectedCinema) {
      // Khi đã chọn rạp, lọc phòng chiếu của rạp đó
      const cinemaScreens =
        cinemas.find((cinema) => cinema.cinemaId === selectedCinema)?.screens ||
        [];
      setScreens(cinemaScreens);
    }
  }, [selectedCinema, cinemas]);
  const getAccessToken = () => {
    return localStorage.getItem("access_token"); // Hoặc bạn có thể lấy từ Cookies hoặc bất kỳ nguồn lưu trữ nào khác
  };

  const { mutate } = useMutation({
    mutationFn: async (showtime) => {
      const token = getAccessToken(); // Lấy token
      if (!token) {
        throw new Error("Không có access token");
      }

      // Gửi yêu cầu POST với access_token trong header
      await axios.post(`http://filmgo.io.vn/api/showtimes/create`, showtime, {
        headers: {
          Authorization: `Bearer ${token}`, // Thêm Authorization header
        },
      });
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
        remember: true,
      }}
      onFinish={onFinish}
      autoComplete="off"
    >
      {contextHolder}
      <h1 className="text-3xl mb-5">Thêm xuất chiếu</h1>

      {/* Chọn phim */}
      <Form.Item
        name="movie_id"
        label="Chọn phim"
        rules={[{ required: true, message: "Vui lòng chọn phim" }]}
      >
        <Select placeholder="Chọn phim">
          {movies.map((movie) => (
            <Option key={movie.id} value={movie.id}>
              {movie.title}
            </Option>
          ))}
        </Select>
      </Form.Item>
      {/* Chọn rạp */}
      <Form.Item
        name="cinema_id"
        label="Chọn rạp"
        rules={[{ required: true, message: "Vui lòng chọn rạp" }]}
      >
        <Select
          placeholder="Chọn rạp"
          onChange={(value) => setSelectedCinema(value)} // Cập nhật rạp đã chọn
        >
          {cinemas.map((cinema) => (
            <Option key={cinema.cinemaId} value={cinema.cinemaId}>
              {cinema.name}
            </Option>
          ))}
        </Select>
      </Form.Item>

      {/* Chọn phòng chiếu từ rạp đã chọn */}
      <Form.Item
        name="screen_id"
        label="Chọn phòng chiếu"
        rules={[{ required: true, message: "Vui lòng chọn phòng chiếu" }]}
      >
        <Select placeholder="Chọn phòng chiếu">
          {screens.map((screen) => (
            <Option key={screen.id} value={screen.id}>
              {screen.name}
            </Option>
          ))}
        </Select>
      </Form.Item>

      {/* Chọn giờ chiếu */}
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

      {/* Chọn giờ kết thúc */}
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

      {/* Chọn ngày chiếu */}
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
        <Input type="date" format="yyyy-mm-dd" style={{ width: "100%" }} />
      </Form.Item>

      {/* Nút submit */}
      <Form.Item label={null}>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
};

export default CreateShow;
