import { useEffect, useState } from "react";
import { Button, Form, Input, Select } from "antd";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const { Option } = Select;
const CreatRoom = () => {
  const nav = useNavigate();
  const [cinemas, setCinemas] = useState([]);
  useEffect(() => {
    axios
      .get("http://filmgo.io.vn/api/cinemas")
      .then((res) => setCinemas(res.data.data));
  }, []);
  const getAccessToken = () => {
    return localStorage.getItem("access_token");
  };
  const { mutate } = useMutation({
    mutationFn: async (screen) => {
      const token = getAccessToken(); // Lấy token
      if (!token) {
        throw new Error("Không có access token");
      }

      // Gửi yêu cầu POST với access_token trong header
      await axios.post(`http://filmgo.io.vn/api/screens/create`, screen, {
        headers: {
          Authorization: `Bearer ${token}`, // Thêm Authorization header
        },
      });
    },
    onSuccess: () => {
      nav(`/admin/list-screen`);
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
      <h1 className="text-3xl mb-5">Thêm phòng chiếu</h1>
      <Form.Item
        label="Tên phòng"
        name="name"
        rules={[
          {
            required: true,
            message: "Không được bỏ trống!",
          },
        ]}
      >
        <Input placeholder="Nhập tên phòng" />
      </Form.Item>
      <Form.Item
        name="cinema_id"
        label="Chọn rạp"
        rules={[{ required: true, message: "Vui lòng Không bỏ trống" }]}
      >
        <Select placeholder="Chọn rạp">
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
export default CreatRoom;
