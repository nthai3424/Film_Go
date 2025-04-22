import { Button, Form, Input } from "antd";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const CreatProvince = () => {
  const nav = useNavigate();
  const getAccessToken = () => {
    return localStorage.getItem("access_token");
  };
  const { mutate } = useMutation({
    mutationFn: async (province) => {
      const token = getAccessToken(); // Lấy token
      if (!token) {
        throw new Error("Không có access token");
      }

      // Gửi yêu cầu POST với access_token trong header
      await axios.post(
        `http://filmgo.io.vn/api/provinces/create`,
        province,

        {
          headers: {
            Authorization: `Bearer ${token}`, // Thêm Authorization header
          },
        }
      );
    },
    onSuccess: () => {
      nav(`/admin/list-province`);
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
      <Form.Item
        label="Khu vực"
        name="name"
        rules={[
          {
            required: true,
            message: "Không được bỏ trống!",
          },
          {
            min: 5,
            message: "Tên khu vực không được dưới 5 kí tự",
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item label={null}>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
};
export default CreatProvince;
