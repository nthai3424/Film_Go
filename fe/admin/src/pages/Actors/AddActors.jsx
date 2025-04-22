// import React, { useState } from "react";
// import { Form, Input, Button, Upload, message, Card } from "antd";
// import { UploadOutlined } from "@ant-design/icons";
// import { useNavigate } from "react-router-dom";

// const API_ADD_ACTOR = "http://filmgo.io.vn/api/actors/create";

// const AddActor = () => {
//   const nav = useNavigate();
//   const [form] = Form.useForm();
//   const [loading, setLoading] = useState(false);
//   const [file, setFile] = useState(null);

//   // Kiểm tra file hợp lệ trước khi upload
//   const beforeUpload = (file) => {
//     const isValid =
//       file.type === "image/jpeg" ||
//       file.type === "image/jpg" ||
//       file.type === "image/png";
//     if (!isValid) {
//       message.error("Chỉ chấp nhận file JPG, JPEG hoặc PNG!");
//       return false;
//     }
//     setFile(file); // Lưu file vào state
//     return false; // Chặn upload tự động
//   };

//   const handleSubmit = async (values) => {
//     if (!file) {
//       message.error("Vui lòng chọn ảnh hợp lệ!");
//       return;
//     }

//     const formData = new FormData();
//     formData.append("name", values.name);
//     formData.append("avatar", file); // Gửi file lên API

//     try {
//       setLoading(true);
//       const response = await fetch(API_ADD_ACTOR, {
//         method: "POST",
//         body: formData, // Gửi đúng kiểu `multipart/form-data`
//       });

//       const result = await response.json();
//       if (response.ok) {
//         message.success("Thêm diễn viên thành công!");
//         form.resetFields();
//         setFile(null);
//       } else {
//         message.error(result.message || "Thêm thất bại!");
//       }
//     } catch (error) {
//       message.error("Lỗi kết nối API!");
//     } finally {
//       setLoading(false);
//     }
//     nav("/admin/list-actors");
//   };

//   return (
//     <Card title="Thêm diễn viên mới" style={{ maxWidth: 500, margin: "auto" }}>
//       <Form form={form} onFinish={handleSubmit} layout="vertical">
//         <Form.Item
//           label="Tên diễn viên"
//           name="name"
//           rules={[{ required: true, message: "Vui lòng nhập tên diễn viên!" }]}
//         >
//           <Input placeholder="Nhập tên diễn viên" />
//         </Form.Item>

//         <Form.Item
//           label="Ảnh đại diện (JPG, PNG)"
//           name="avatar"
//           rules={[{ required: true, message: "Vui lòng tải lên ảnh!" }]}
//         >
//           <Upload
//             beforeUpload={beforeUpload}
//             maxCount={1}
//             accept=".jpg,.jpeg,.png"
//             listType="picture"
//           >
//             <Button icon={<UploadOutlined />}>Chọn ảnh</Button>
//           </Upload>
//         </Form.Item>

//         <Form.Item>
//           <Button type="primary" htmlType="submit" loading={loading}>
//             Thêm diễn viên
//           </Button>
//         </Form.Item>
//       </Form>
//     </Card>
//   );
// };

// export default AddActor;
import React, { useState } from "react";
import { Form, Input, Button, Upload, message, Card } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const API_ADD_ACTOR = "http://filmgo.io.vn/api/actors/create";

const AddActor = () => {
  const nav = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);

  // Hàm lấy access token
  const getAccessToken = () => localStorage.getItem("access_token");

  // Kiểm tra file hợp lệ trước khi upload
  const beforeUpload = (file) => {
    const isValid =
      file.type === "image/jpeg" ||
      file.type === "image/jpg" ||
      file.type === "image/png";
    if (!isValid) {
      message.error("Chỉ chấp nhận file JPG, JPEG hoặc PNG!");
      return false;
    }
    setFile(file); // Lưu file vào state
    return false; // Chặn upload tự động
  };

  const handleSubmit = async (values) => {
    if (!file) {
      message.error("Vui lòng chọn ảnh hợp lệ!");
      return;
    }

    const token = getAccessToken();
    if (!token) {
      message.error("Bạn cần đăng nhập để thêm diễn viên!");
      nav("/login");
      return;
    }

    const formData = new FormData();
    formData.append("name", values.name);
    formData.append("avatar", file); // Gửi file lên API

    try {
      setLoading(true);
      const response = await fetch(API_ADD_ACTOR, {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Bearer ${token}`, // Thêm token vào header
        },
      });

      const result = await response.json();
      if (response.ok) {
        message.success("Thêm diễn viên thành công!");
        form.resetFields();
        setFile(null);
        nav("/admin/list-actors");
      } else {
        message.error(result.message || "Thêm thất bại!");
      }
    } catch (error) {
      message.error("Lỗi kết nối API!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card title="Thêm diễn viên mới" style={{ maxWidth: 500, margin: "auto" }}>
      <Form form={form} onFinish={handleSubmit} layout="vertical">
        <Form.Item
          label="Tên diễn viên"
          name="name"
          rules={[{ required: true, message: "Vui lòng nhập tên diễn viên!" }]}
        >
          <Input placeholder="Nhập tên diễn viên" />
        </Form.Item>

        <Form.Item
          label="Ảnh đại diện (JPG, PNG)"
          name="avatar"
          rules={[{ required: true, message: "Vui lòng tải lên ảnh!" }]}
        >
          <Upload
            beforeUpload={beforeUpload}
            maxCount={1}
            accept=".jpg,.jpeg,.png"
            listType="picture"
          >
            <Button icon={<UploadOutlined />}>Chọn ảnh</Button>
          </Upload>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            Thêm diễn viên
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default AddActor;
