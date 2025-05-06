import { useEffect, useState } from "react";
import { Button, Form, Input, message, Select } from "antd";
import { useMutation } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
const { Option } = Select;

const UpdateRoom = () => {
  const [messageApi, contextHolder] = message.useMessage();

  const nav = useNavigate();
  const { id } = useParams(); // Lấy ID từ URL
  const [cinemas, setCinemas] = useState([]);
  const [screenData, setScreenData] = useState(null); // State để lưu dữ liệu rạp phim cần cập nhật

  useEffect(() => {
    axios
      .get("http://filmgo.io.vn/api/cinemas")
      .then((res) => setCinemas(res.data.data));
  }, []);

  useEffect(() => {
    if (id) {
      axios.get(`http://filmgo.io.vn/api/screens/show/${id}`).then((res) => {
        setScreenData(res.data.data); // Lưu dữ liệu rạp phim vào state
      });
    }
  }, [id]);
  const getAccessToken = () => {
    return localStorage.getItem("access_token"); // Hoặc bạn có thể lấy từ Cookies hoặc bất kỳ nguồn lưu trữ nào khác
  };

  const { mutate } = useMutation({
    mutationFn: async (screen) => {
      const token = getAccessToken(); // Lấy token
      if (!token) {
        throw new Error("Không có access token");
      }

      // Gửi yêu cầu POST với access_token trong header
      await axios.put(`http://filmgo.io.vn/api/screens/update/${id}`, screen, {
        headers: {
          Authorization: `Bearer ${token}`, // Thêm Authorization header
        },
      });
    },
    onSuccess: () => {
      nav(`/admin/list-screen`);
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

  if (!screenData && id) return <div>Loading...</div>; // Hiển thị loading nếu đang tải dữ liệu

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
      initialValues={screenData || {}} // Sử dụng dữ liệu rạp phim làm initialValues
      onFinish={onFinish}
      autoComplete="off"
    >
      {contextHolder}
      <h1 className="text-3xl mb-5">Cập nhật phòng chiếu</h1>
      <Form.Item
        label="Tên phòng chiếu"
        name="name"
        rules={[
          {
            required: true,
            message: "Không được bỏ trống!",
          },
        ]}
      >
        <Input placeholder="Nhập tên rạp" />
      </Form.Item>

      <Form.Item
        name="cinema_id"
        label="Rạp chiếu"
        rules={[{ required: true, message: "Vui lòng Không bỏ trống" }]}
      >
        <Select placeholder="Chọn rạp chiếu">
          {cinemas.map((cinema) => (
            <Option key={cinema.id} value={cinema.id}>
              {cinema.name}
            </Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item label={null}>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
};
export default UpdateRoom;
