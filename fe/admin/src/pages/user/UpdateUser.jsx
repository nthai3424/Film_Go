import { Form, Input, Button, message, Card, Row, Col, Select } from "antd";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";

const UpdateUser = () => {
  const phoneRegex = /^0\d{9,10}$/;
  const nav = useNavigate();
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();
  const { id } = useParams();

  const getAccessToken = () => localStorage.getItem("access_token");

  // Lấy thông tin người dùng theo ID
  const { data, isLoading } = useQuery({
    queryKey: ["users", id],
    queryFn: async () => {
      const token = getAccessToken();
      if (!token) throw new Error("Token không hợp lệ hoặc không tồn tại");

      const response = await axios.get(
        `http://filmgo.io.vn/api/users/show/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data.data;
    },
  });

  // Cập nhật người dùng
  const { mutate, isPending } = useMutation({
    mutationFn: async (user) => {
      const token = getAccessToken();
      if (!token) throw new Error("Không có access token");

      await axios.put(`http://filmgo.io.vn/api/users/update/${id}`, user, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    },
    onSuccess: () => {
      messageApi.success("Cập nhật thông tin thành công!");
      nav("/admin/list-user"); // Chuyển về danh sách người dùng (hoặc trang tùy ý)
    },
    onError: () => {
      messageApi.error("Cập nhật thất bại! Vui lòng kiểm tra lại.");
    },
  });

  const onFinish = (values) => {
    mutate(values);
  };

  useEffect(() => {
    if (data) {
      form.setFieldsValue(data);
    }
  }, [data, form]);

  return (
    <div
      style={{ display: "flex", justifyContent: "center", marginTop: "50px" }}
    >
      {contextHolder}
      <Card
        title="Cập nhật tài khoản"
        bordered={false}
        style={{
          width: 800,
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
          borderRadius: "8px",
        }}
      >
        <Form
          name="update-user-form"
          form={form}
          labelAlign="top"
          labelCol={{ span: 24 }}
          wrapperCol={{ span: 24 }}
          onFinish={onFinish}
          disabled={isPending || isLoading}
        >
          <Row gutter={32}>
            <Col span={12}>
              <Form.Item
                label="Họ và tên"
                name="name"
                rules={[{ required: true, message: "Bắt buộc nhập" }]}
              >
                <Input disabled placeholder="Nhập họ và tên" />
              </Form.Item>

              <Form.Item
                label="Số điện thoại"
                name="phone"
                rules={[
                  { required: true, message: "Bắt buộc nhập" },
                  {
                    pattern: phoneRegex,
                    message: "Số điện thoại không hợp lệ",
                  },
                ]}
              >
                <Input disabled placeholder="Nhập số điện thoại" />
              </Form.Item>

              <Form.Item
                label="Email"
                name="email"
                rules={[
                  { required: true, message: "Bắt buộc nhập" },
                  { type: "email", message: "Email không hợp lệ" },
                ]}
              >
                <Input disabled placeholder="Nhập email" />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label="Ngày sinh"
                name="birthday"
                rules={[{ required: true, message: "Bắt buộc chọn ngày sinh" }]}
              >
                <Input disabled type="date" placeholder="YYYY-MM-DD" />
              </Form.Item>

              <Form.Item
                label="Tỉnh/Thành phố"
                name="address"
                rules={[{ required: true, message: "Bắt buộc nhập địa chỉ" }]}
              >
                <Input disabled placeholder="Nhập địa chỉ" />
              </Form.Item>

              <Form.Item
                label="Trạng thái "
                name="status"
                rules={[
                  { required: true, message: "Bắt buộc chọn trạng thái" },
                ]}
              >
                <Select placeholder="Chọn trạng thái">
                  <Select.Option value="active">Active</Select.Option>
                  <Select.Option value="inactive">InActive</Select.Option>
                </Select>
              </Form.Item>

              <Form.Item
                label="Vai trò "
                name="role_id"
                rules={[{ required: true, message: "Bắt buộc chọn vai trò" }]}
              >
                <Select placeholder="Chọn vai trò">
                  <Select.Option value={1}>Admin</Select.Option>
                  <Select.Option value={2}>Staff</Select.Option>
                  <Select.Option value={3}>Member</Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={isPending}>
              Cập nhật
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default UpdateUser;
