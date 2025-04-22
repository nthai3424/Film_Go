// import { useState, useEffect } from "react";
// import { Card, Form, Input, Button, message } from "antd";
// import { useNavigate, useParams } from "react-router-dom";
// import { useQueryClient } from "@tanstack/react-query";

// const EditGenres = () => {
//   const [form] = Form.useForm();
//   const [loading, setLoading] = useState(false);
//   const [genre, setGenre] = useState(null);
//   const queryClient = useQueryClient();
//   const navigate = useNavigate();
//   const { id } = useParams();

//   useEffect(() => {
//     const fetchGenre = async () => {
//       try {
//         const res = await fetch(`http://filmgo.io.vn/api/genres/show/${id}`);
//         const result = await res.json();
//         console.log("Dữ liệu API:", result); // Kiểm tra API trả về

//         if (res.ok && result.data) {
//           setGenre(result.data); // Lưu vào state
//           form.setFieldsValue({ name: result.data.name }); // Cập nhật form
//         } else {
//           message.error("Không tìm thấy thể loại!");
//           navigate("/admin/genres");
//         }
//       } catch (error) {
//         console.error("Lỗi tải dữ liệu:", error);
//         message.error("Có lỗi xảy ra khi tải dữ liệu!");
//       }
//     };

//     fetchGenre();
//   }, [id, form, navigate]);

//   const handleSubmit = async (values) => {
//     setLoading(true);
//     const formData = new FormData();
//     formData.append("_method", "PUT");
//     formData.append("name", values.name);

//     try {
//       const response = await fetch(
//         `http://filmgo.io.vn/api/genres/update/${id}`,
//         {
//           method: "POST",
//           body: formData,
//         }
//       );

//       const data = await response.json();
//       if (response.ok) {
//         message.success("Cập nhật thể loại thành công!");
//         queryClient.invalidateQueries({ queryKey: ["genres"] });

//         setTimeout(() => {
//           navigate("/admin/list-genres");
//         }, 1000);
//       } else {
//         message.error(`Lỗi: ${data.message || "Không thể cập nhật!"}`);
//       }
//     } catch (error) {
//       message.error("Có lỗi xảy ra, vui lòng thử lại!");
//     }
//     setLoading(false);
//   };

//   return (
//     <Card
//       title="Chỉnh sửa thể loại phim"
//       style={{ maxWidth: 500, margin: "auto" }}
//     >
//       {genre ? ( // Chỉ hiển thị form khi có dữ liệu
//         <Form form={form} onFinish={handleSubmit} layout="vertical">
//           <Form.Item
//             label="Tên thể loại"
//             name="name"
//             rules={[{ required: true, message: "Vui lòng nhập tên thể loại!" }]}
//           >
//             <Input placeholder="Nhập tên thể loại" />
//           </Form.Item>

//           <Form.Item>
//             <Button type="primary" htmlType="submit" loading={loading}>
//               Cập nhật thể loại
//             </Button>
//           </Form.Item>
//         </Form>
//       ) : (
//         <p>Đang tải dữ liệu...</p>
//       )}
//     </Card>
//   );
// };

// export default EditGenres;
import { useState, useEffect } from "react";
import { Card, Form, Input, Button, message } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";

const EditGenres = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [genre, setGenre] = useState(null);
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { id } = useParams();

  // Lấy token từ localStorage
  const accessToken = localStorage.getItem("access_token");

  useEffect(() => {
    const fetchGenre = async () => {
      try {
        const res = await fetch(`http://filmgo.io.vn/api/genres/show/${id}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`, // Thêm token vào header
          },
        });

        const result = await res.json();
        console.log("Dữ liệu API:", result);

        if (res.ok && result.data) {
          setGenre(result.data);
          form.setFieldsValue({ name: result.data.name });
        } else {
          message.error("Không tìm thấy thể loại!");
          navigate("/admin/genres");
        }
      } catch (error) {
        console.error("Lỗi tải dữ liệu:", error);
        message.error("Có lỗi xảy ra khi tải dữ liệu!");
      }
    };

    fetchGenre();
  }, [id, form, navigate, accessToken]);

  const handleSubmit = async (values) => {
    setLoading(true);
    const formData = new FormData();
    formData.append("_method", "PUT");
    formData.append("name", values.name);

    try {
      const response = await fetch(
        `http://filmgo.io.vn/api/genres/update/${id}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`, // Thêm token vào header
          },
          body: formData,
        }
      );

      const data = await response.json();
      if (response.ok) {
        message.success("Cập nhật thể loại thành công!");
        queryClient.invalidateQueries({ queryKey: ["genres"] });

        setTimeout(() => {
          navigate("/admin/list-genres");
        }, 1000);
      } else {
        message.error(`Lỗi: ${data.message || "Không thể cập nhật!"}`);
      }
    } catch (error) {
      message.error("Có lỗi xảy ra, vui lòng thử lại!");
    }
    setLoading(false);
  };

  return (
    <Card
      title="Chỉnh sửa thể loại phim"
      style={{ maxWidth: 500, margin: "auto" }}
    >
      {genre ? (
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
              Cập nhật thể loại
            </Button>
          </Form.Item>
        </Form>
      ) : (
        <p>Đang tải dữ liệu...</p>
      )}
    </Card>
  );
};

export default EditGenres;
