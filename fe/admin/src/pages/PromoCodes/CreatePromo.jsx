import { useMutation } from "@tanstack/react-query";
import {
  Button,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Switch,
  message,
} from "antd";
import TextArea from "antd/es/input/TextArea";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const PromoCodeAdd = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("access_token");

  const axiosInstance = axios.create({
    baseURL: "http://filmgo.io.vn/api",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const { mutate } = useMutation({
    mutationFn: async (promocode) => {
      const response = await axiosInstance.post(
        "/promocodes/create",
        promocode
      );
      return response.data;
    },
    onSuccess: () => {
      message.success("Thêm mã khuyến mãi thành công!");
      navigate("/admin/list-promo");
    },
    onError: (error) => {
      const errors = error.response?.data?.errors;
      const firstError = errors ? Object.values(errors)[0][0] : "Có lỗi xảy ra";
      message.error(firstError);

      console.error("Error submitting promocode:", error.response?.data);
      console.log("Validation Errors:", errors);
    },
  });

  const onFinish = (values) => {
    const formattedValues = {
      ...values,
      status: values.status ? "active" : "inactive",
      start_date: values.start_date
        ? values.start_date.format("YYYY-MM-DD")
        : null,
      end_date: values.end_date ? values.end_date.format("YYYY-MM-DD") : null,
    };

    console.log("Submitting:", formattedValues);
    mutate(formattedValues);
  };

  return (
    <div>
      <h1 className="text-4xl my-8">Thêm mới mã khuyến mãi</h1>
      <Form
        name="add-form"
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 14 }}
        layout="horizontal"
        style={{ maxWidth: 600 }}
        onFinish={onFinish}
        initialValues={{ status: false }}
      >
        <Form.Item
          label="Mã khuyến mãi"
          name="code"
          rules={[{ required: true, message: "Vui lòng nhập mã khuyến mãi" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Mô tả"
          name="description"
          rules={[
            { required: true, message: "Vui lòng nhập mô tả mã khuyến mãi" },
          ]}
        >
          <TextArea rows={4} />
        </Form.Item>

        <Form.Item
          label="Số tiền giảm"
          name="discount_amount"
          rules={[{ required: true, message: "Vui lòng nhập số tiền giảm" }]}
        >
          <InputNumber
            min={1000}
            step={1000}
            style={{ width: "100%" }}
            formatter={(value) =>
              `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ".")
            }
            parser={(value) => value.replace(/\./g, "")}
            addonAfter="VND"
          />
        </Form.Item>

        <Form.Item label="Trạng thái" name="status" valuePropName="checked">
          <Switch checkedChildren="Active" unCheckedChildren="Inactive" />
        </Form.Item>

        <Form.Item
          label="Ngày bắt đầu"
          name="start_date"
          rules={[{ required: true, message: "Vui lòng chọn ngày bắt đầu" }]}
        >
          <DatePicker format="YYYY-MM-DD" />
        </Form.Item>

        <Form.Item
          label="Ngày kết thúc"
          name="end_date"
          rules={[{ required: true, message: "Vui lòng chọn ngày kết thúc" }]}
        >
          <DatePicker format="YYYY-MM-DD" />
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 4, span: 14 }}>
          <Button type="primary" htmlType="submit">
            Thêm mới
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default PromoCodeAdd;
