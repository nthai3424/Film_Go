// import { useState } from "react";
// import { Card, Form, Input, Button, message } from "antd";
// import { useNavigate } from "react-router-dom"; // Import useNavigate
// import { useQueryClient } from "@tanstack/react-query";

// const AddGenres = () => {
//   const [form] = Form.useForm();
//   const [loading, setLoading] = useState(false);
//   const queryClient = useQueryClient();
//   const navigate = useNavigate(); // Hook chuyển hướng

//   const handleSubmit = async (values) => {
//     setLoading(true);
//     const formData = new FormData();
//     formData.append("name", values.name);

//     try {
//       const response = await fetch("http://filmgo.io.vn/api/genres/create", {
//         method: "POST",
//         body: formData,
//       });

//       const data = await response.json();
//       if (response.ok) {
//         message.success("Thêm thể loại thành công!"); // Hiển thị thông báo

//         // Cập nhật danh sách
//         queryClient.invalidateQueries({ queryKey: ["genres"] });

//         // Reset form
//         form.resetFields();

//         // ⏳ Chờ 1 giây rồi mới chuyển hướng (để thông báo hiển thị đủ lâu)
//         setTimeout(() => {
//           navigate("/admin/list-genres"); // Chuyển hướng đến trang danh sách thể loại
//         }, 1000);
//       } else {
//         message.error(`Lỗi: ${data.message || "Không thể thêm thể loại!"}`);
//       }
//     } catch (error) {
//       message.error("Có lỗi xảy ra, vui lòng thử lại sau!");
//     }
//     setLoading(false);
//   };

//   return (
//     <Card title="Thêm thể loại phim" style={{ maxWidth: 500, margin: "auto" }}>
//       <Form form={form} onFinish={handleSubmit} layout="vertical">
//         <Form.Item
//           label="Tên thể loại"
//           name="name"
//           rules={[{ required: true, message: "Vui lòng nhập tên thể loại!" }]}
//         >
//           <Input placeholder="Nhập tên thể loại" />
//         </Form.Item>

//         <Form.Item>
//           <Button type="primary" htmlType="submit" loading={loading}>
//             Thêm thể loại
//           </Button>
//         </Form.Item>
//       </Form>
//     </Card>
//   );
// };

// export default AddGenres;
import { useState } from "react";
import { Card, Form, Input, Button, message } from "antd";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";

const AddGenres = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const handleSubmit = async (values) => {
    setLoading(true);
    const formData = new FormData();
    formData.append("name", values.name);

    // Lấy access token từ localStorage (hoặc thay thế bằng cách lấy từ context)
    const accessToken = localStorage.getItem("access_token");

    try {
      const response = await fetch("http://filmgo.io.vn/api/genres/create", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`, // Thêm access token vào header
        },
        body: formData,
      });

      const data = await response.json();
      if (response.ok) {
        message.success("Thêm thể loại thành công!");

        // Cập nhật danh sách thể loại
        queryClient.invalidateQueries({ queryKey: ["genres"] });

        // Reset form
        form.resetFields();

        // Chuyển hướng sau khi thêm thành công
        setTimeout(() => {
          navigate("/admin/list-genres");
        }, 1000);
      } else {
        message.error(`Lỗi: ${data.message || "Không thể thêm thể loại!"}`);
      }
    } catch (error) {
      message.error("Có lỗi xảy ra, vui lòng thử lại sau!");
    }
    setLoading(false);
  };

  return (
    <Card title="Thêm thể loại phim" style={{ maxWidth: 500, margin: "auto" }}>
      <Form form={form} onFinish={handleSubmit} layout="vertical">
        <Form.Item
          label="Tên thể loại"
          name="name"
          rules={[{ required: true, message: "Vui lòng nhập tên thể loại!" }]}
        >
          <Input placeholder="Nhập tên thể loại" />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            Thêm thể loại
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default AddGenres;
