import { Button, Form, Input, message, Select } from "antd";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import axios from "axios";

const AddSeatForm = ({ screenId, setShowAddForm, refetchSeats }) => {
  const nav = useNavigate();
  const [form] = Form.useForm();

  const getAccessToken = () => {
    return localStorage.getItem("access_token");
  };

  const { mutate } = useMutation({
    mutationFn: async (seat) => {
      const token = getAccessToken();
      await axios.post(`http://filmgo.io.vn/api/seats/create`, seat, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
    },
    onSuccess: () => {
      nav(`/admin/seats`);
      message.success("Thêm ghế thành công!"); // Hiển thị thông báo thành công
      refetchSeats();
      setShowAddForm(false); // Tắt model
    },
  });
  const onFinish = (values) => {
    mutate(values);
  };

  return (
    <>
      <h4 className="text-center mb-3">Tạo sơ đồ ghế</h4>
      <Form
        form={form}
        className="m-auto"
        name="basic"
        labelCol={{
          span: 8,
        }}
        wrapperCol={{
          span: 16,
        }}
        style={{
          maxWidth: 300,
        }}
        initialValues={{
          remember: true,
          screen_id: screenId,
        }}
        onFinish={onFinish}
        autoComplete="off"
      >
        <Form.Item
          label="Hàng ghế"
          name="row"
          rules={[
            {
              required: true,
              message: "Không được bỏ trống!",
            },
          ]}
        >
          <Select placeholder="Chọn hàng ghế">
            <Select.Option value="A">A</Select.Option>
            <Select.Option value="B">B</Select.Option>
            <Select.Option value="C">C</Select.Option>
            <Select.Option value="D">D</Select.Option>
            <Select.Option value="E">E</Select.Option>
            <Select.Option value="F">F</Select.Option>
            <Select.Option value="G">G</Select.Option>
            <Select.Option value="H">H</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item
          label="Số lượng ghế"
          name="number"
          rules={[
            {
              required: true,
              message: "Không được bỏ trống",
            },
          ]}
        >
          <Input placeholder="Nhập số lượng ghế" type="number" max={20} min={1}/>
        </Form.Item>

        <Form.Item
          label="Loại ghế"
          name="type"
          rules={[{ required: true, message: "Vui lòng chọn loại ghế!" }]}
        >
          <Select placeholder="Chọn loại ghế">
            <Select.Option value="Ghế VIP">Ghế VIP</Select.Option>
            <Select.Option value="Ghế thường">Ghế thường</Select.Option>
            <Select.Option value="Ghế đôi">Ghế đôi</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item
          label="Nhập giá ghế"
          name="price"
          rules={[
            {
              required: true,
              message: "Không được bỏ trống",
            },
          ]}
        >
          <Input placeholder="Nhập giá" />
        </Form.Item>

        <Form.Item label="Phòng" name="screen_id" hidden>
          <Input placeholder={screenId} value={screenId} disabled />
        </Form.Item>

        <Form.Item label={null}>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </>
  );
};

AddSeatForm.propTypes = {
  screenId: PropTypes.number.isRequired, // Thay 'array' bằng kiểu dữ liệu cụ thể nếu có thể
  setShowAddForm: PropTypes.func.isRequired,
  refetchSeats: PropTypes.func.isRequired,
};

export default AddSeatForm;
