import { useEffect } from "react";
import { Modal, Form, Input, Select, message, Button } from "antd";
import PropTypes from "prop-types"; // Import PropTypes

const UpdateSeatForm = ({ seat, visible, onCancel, onUpdate,onDelete }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (seat) {
      form.setFieldsValue(seat);
    }
  }, [form, seat]);

  const handleUpdate = () => {
    form
      .validateFields()
      .then((values) => {
        // Hiển thị thông báo thành công
        message.success("Cập nhật ghế thành công!");
        onUpdate(values);
        form.resetFields();
      })
      .catch((info) => {
        console.log("Lỗi validate:", info);
      });
  };

  return (
    <Modal
      title="Cập nhật ghế"
      visible={visible}
      onCancel={onCancel}
      footer={[
        <Button key="delete" onClick={onDelete} type="danger" className="float-left" style={{ backgroundColor: 'red' }}>
          Xóa
        </Button>,
        <Button key="cancel" onClick={onCancel}>
          Hủy bỏ
        </Button>,
        <Button key="update" type="primary" onClick={handleUpdate}>
          Cập nhập
        </Button>,
      ]}
    >
      <Form form={form} layout="vertical" onFinish={handleUpdate}>
        <Form.Item
          hidden
          label="Id"
          name="id"
          rules={[{ required: true, message: "Vui lòng nhập id!" }]}
        >
          <Input disabled />
        </Form.Item>

        <Form.Item
          label="Hàng"
          name="row"
          rules={[{ required: true, message: "Vui lòng nhập hàng!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Số ghế"
          name="number"
          rules={[{ required: true, message: "Vui lòng nhập số ghế!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Loại ghế"
          name="type"
          rules={[{ required: true, message: "Vui lòng chọn loại ghế!" }]}
        >
          <Select>
            <Select.Option value="Ghế VIP">Ghế VIP</Select.Option>
            <Select.Option value="Ghế thường">Ghế thường</Select.Option>
            <Select.Option value="Ghế đôi">Ghế đôi</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item
          label="Gía ghế"
          name="price"
          rules={[{ required: true, message: "Vui lòng nhập giá ghế!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Trạng thái ghế"
          name="status"
          rules={[{ required: true, message: "Vui lòng chọn trạng thái ghế!" }]}
        >
          <Select>
            <Select.Option value="available">available</Select.Option>
            <Select.Option value="reserved">reserved</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item
          label="Số phòng"
          name="screen_id"
          rules={[{ required: true, message: "Vui lòng nhập số phòng!" }]}
          hidden
        >
          <Input disabled />
        </Form.Item>
      </Form>
    </Modal>
  );
};

UpdateSeatForm.propTypes = {
  seat: PropTypes.object,
  visible: PropTypes.bool.isRequired,
  onCancel: PropTypes.func.isRequired,
  onUpdate: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default UpdateSeatForm;
