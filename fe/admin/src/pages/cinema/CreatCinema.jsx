import { useEffect, useState } from "react";
import { Button, Form, Input, Select } from "antd";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import axios from "axios";
const { Option } = Select;

const CreatCinema = () => {
  const nav = useNavigate();
  const [provinces, setProvinces] = useState([]);
  useEffect(() => {
    axios
      .get("http://filmgo.io.vn/api/provinces")
      .then((res) => setProvinces(res.data.data));
  }, []);
  const getAccessToken = () => {
    return localStorage.getItem("access_token"); // Hoặc bạn có thể lấy từ Cookies hoặc bất kỳ nguồn lưu trữ nào khác
  };
  const { mutate } = useMutation({
    mutationFn: async (cinema) => {
      const token = getAccessToken(); // Lấy token
      if (!token) {
        throw new Error("Không có access token");
      }

      // Gửi yêu cầu POST với access_token trong header
      await axios.post(`http://filmgo.io.vn/api/cinemas/create`, cinema, {
        headers: {
          Authorization: `Bearer ${token}`, // Thêm Authorization header
        },
      });
    },
    onSuccess: () => {
      nav(`/admin/list-cinema`);
    },
  });
  const onFinish = (values) => {
    mutate(values);
  };
  // if (isLoading) return <div>Loading...</div>;
  // if (isError) return <div>{error.message}</div>;

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
      <h1 className="text-3xl mb-5">Thêm rạp phim</h1>
      <Form.Item
        label="Tên rạp"
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
        label="Mã rạp"
        name="code"
        rules={[
          {
            required: true,
            message: "Không được bỏ trống!",
          },
        ]}
      >
        <Input placeholder="Nhập mã rạp" />
      </Form.Item>
      <Form.Item
        name="province_id"
        label="Khu vực"
        rules={[{ required: true, message: "Vui lòng Không bỏ trống" }]}
      >
        <Select placeholder="Chọn khu vực">
          {provinces.map((province) => (
            <Option key={province.id} value={province.id}>
              {province.name}
            </Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item
        label="Nhập địa chỉ"
        name="address"
        rules={[
          {
            required: true,
            message: "Bắt buộc nhập",
          },
        ]}
      >
        <Input placeholder="Nhập địa chỉ" />
      </Form.Item>

      <Form.Item
        label="Nhập số điện thoại"
        name="contact"
        rules={[
          {
            required: true,
            message: "Bắt buộc nhập",
          },
        ]}
      >
        <Input placeholder="Nhập số điện thoại" />
      </Form.Item>
      {/* <Form.Item
        name="image"
        label="Ảnh "
        valuePropName="fileList"
        getValueFromEvent={(e) => (e && e.fileList ? e.fileList : [])} // Fix lấy fileList đúng
        rules={[{ required: true, message: "Vui lòng chọn ảnh hợp lệ!" }]}
      >
        <Upload
          beforeUpload={() => false} // Không tự động upload
          listType="picture-card"
          accept=".jpg,.jpeg,.png"
        >
          <Button>Chọn ảnh</Button>
        </Upload>
      </Form.Item> */}
      <Form.Item label={null}>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
};
export default CreatCinema;
