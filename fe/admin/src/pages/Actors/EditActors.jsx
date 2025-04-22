// import React, { useState, useEffect } from "react";
// import { Form, Input, Button, Upload, message, Card } from "antd";
// import { UploadOutlined } from "@ant-design/icons";
// import { useNavigate, useParams } from "react-router-dom";

// const API_GET_ACTOR = "http://filmgo.io.vn/api/actors/show/";
// const API_UPDATE_ACTOR = "http://filmgo.io.vn/api/actors/update/";

// const EditActor = () => {
//   const { id } = useParams();
//   const nav = useNavigate();
//   const [form] = Form.useForm();
//   const [loading, setLoading] = useState(false);
//   const [fileList, setFileList] = useState([]);
//   const [actor, setActor] = useState(null);
//   useEffect(() => {
//     const fetchActor = async () => {
//       try {
//         const response = await fetch(`${API_GET_ACTOR}${id}`);
//         const result = await response.json();
//         console.log("Dữ liệu diễn viên:", result);

//         if (response.ok) {
//           setActor(result.data); // Lưu dữ liệu vào state actor
//         } else {
//           message.error("Không tìm thấy diễn viên!");
//           nav("/admin/actors");
//         }
//       } catch (error) {
//         message.error("Lỗi kết nối API!");
//       }
//     };

//     if (id) fetchActor();
//   }, [id, nav]);
//   useEffect(() => {
//     if (actor) {
//       form.setFieldsValue({ name: actor.name });

//       if (actor.avatar) {
//         setFileList([
//           {
//             uid: "-1",
//             name: "avatar.jpg",
//             status: "done",
//             url: actor.avatar, // Đường dẫn ảnh đã đúng từ API
//           },
//         ]);
//       }
//     }
//   }, [actor, form]);

//   // Kiểm tra file hợp lệ
//   const beforeUpload = (file) => {
//     const isValid =
//       file.type === "image/jpeg" ||
//       file.type === "image/jpg" ||
//       file.type === "image/png";

//     if (!isValid) {
//       message.error("Chỉ chấp nhận file JPG, JPEG hoặc PNG!");
//       return false;
//     }

//     setFileList([file]); // Cập nhật file mới
//     return false; // Chặn upload tự động
//   };

//   // Xử lý khi chọn ảnh mới
//   const handleChange = ({ fileList }) => setFileList(fileList);

//   const handleSubmit = async (values) => {
//     const formData = new FormData();
//     formData.append("_method", "PUT");
//     formData.append("name", values.name);

//     if (fileList.length > 0 && fileList[0].originFileObj) {
//       formData.append("avatar", fileList[0].originFileObj);
//     }

//     // Kiểm tra dữ liệu trước khi gửi
//     for (let [key, value] of formData.entries()) {
//       console.log(key, value);
//     }

//     try {
//       setLoading(true);
//       const response = await fetch(`${API_UPDATE_ACTOR}${id}`, {
//         method: "POST", // Laravel yêu cầu POST + _method=PUT
//         body: formData,
//       });

//       const result = await response.json();
//       console.log("Kết quả API:", result);

//       if (response.ok) {
//         message.success("Cập nhật diễn viên thành công!");
//         nav("/admin/list-actors");
//       } else {
//         message.error(result.message || "Cập nhật thất bại!");
//       }
//     } catch (error) {
//       message.error("Lỗi kết nối API!");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <Card title="Chỉnh sửa diễn viên" style={{ maxWidth: 500, margin: "auto" }}>
//       <Form form={form} onFinish={handleSubmit} layout="vertical">
//         <Form.Item
//           label="Tên diễn viên"
//           name="name"
//           rules={[{ required: true, message: "Vui lòng nhập tên diễn viên!" }]}
//         >
//           <Input placeholder="Nhập tên diễn viên" />
//         </Form.Item>

//         <Form.Item label="Ảnh đại diện (JPG, PNG)" name="avatar">
//           <Upload
//             beforeUpload={beforeUpload}
//             maxCount={1}
//             accept=".jpg,.jpeg,.png"
//             listType="picture"
//             fileList={fileList}
//             onChange={handleChange}
//           >
//             <Button icon={<UploadOutlined />}>Chọn ảnh mới</Button>
//           </Upload>

//           {/* Hiển thị ảnh cũ */}
//           {actor?.avatar && !fileList.length && (
//             <div style={{ marginTop: 10 }}>
//               <img
//                 src={`http://filmgo.io.vn/storage/${actor.avatar}`}
//                 alt="avatar"
//                 width={100}
//                 style={{ borderRadius: 8 }}
//               />
//             </div>
//           )}
//         </Form.Item>

//         <Form.Item>
//           <Button type="primary" htmlType="submit" loading={loading}>
//             Cập nhật diễn viên
//           </Button>
//         </Form.Item>
//       </Form>
//     </Card>
//   );
// };

// export default EditActor;
import React, { useState, useEffect } from "react";
import { Form, Input, Button, Upload, message, Card } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useNavigate, useParams } from "react-router-dom";

const API_GET_ACTOR = "http://filmgo.io.vn/api/actors/show/";
const API_UPDATE_ACTOR = "http://filmgo.io.vn/api/actors/update/";

const EditActor = () => {
  const { id } = useParams();
  const nav = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [fileList, setFileList] = useState([]);
  const [actor, setActor] = useState(null);

  // Hàm lấy access token từ localStorage
  const getAccessToken = () => localStorage.getItem("access_token");

  useEffect(() => {
    const fetchActor = async () => {
      const token = getAccessToken();
      if (!token) {
        message.error("Bạn cần đăng nhập để chỉnh sửa diễn viên!");
        nav("/login");
        return;
      }

      try {
        const response = await fetch(`${API_GET_ACTOR}${id}`, {
          headers: {
            Authorization: `Bearer ${token}`, // Thêm token vào header
          },
        });

        const result = await response.json();
        console.log("Dữ liệu diễn viên:", result);

        if (response.ok) {
          setActor(result.data); // Lưu dữ liệu vào state actor
        } else {
          message.error("Không tìm thấy diễn viên!");
          nav("/admin/actors");
        }
      } catch (error) {
        message.error("Lỗi kết nối API!");
      }
    };

    if (id) fetchActor();
  }, [id, nav]);

  useEffect(() => {
    if (actor) {
      form.setFieldsValue({ name: actor.name });

      if (actor.avatar) {
        setFileList([
          {
            uid: "-1",
            name: "avatar.jpg",
            status: "done",
            url: actor.avatar, // Đường dẫn ảnh từ API
          },
        ]);
      }
    }
  }, [actor, form]);

  // Kiểm tra file hợp lệ
  const beforeUpload = (file) => {
    const isValid =
      file.type === "image/jpeg" ||
      file.type === "image/jpg" ||
      file.type === "image/png";

    if (!isValid) {
      message.error("Chỉ chấp nhận file JPG, JPEG hoặc PNG!");
      return false;
    }

    setFileList([file]); // Cập nhật file mới
    return false; // Chặn upload tự động
  };

  // Xử lý khi chọn ảnh mới
  const handleChange = ({ fileList }) => setFileList(fileList);

  const handleSubmit = async (values) => {
    const token = getAccessToken();
    if (!token) {
      message.error("Bạn cần đăng nhập để cập nhật diễn viên!");
      nav("/login");
      return;
    }

    const formData = new FormData();
    formData.append("_method", "PUT");
    formData.append("name", values.name);

    if (fileList.length > 0 && fileList[0].originFileObj) {
      formData.append("avatar", fileList[0].originFileObj);
    }

    // Kiểm tra dữ liệu trước khi gửi
    for (let [key, value] of formData.entries()) {
      console.log(key, value);
    }

    try {
      setLoading(true);
      const response = await fetch(`${API_UPDATE_ACTOR}${id}`, {
        method: "POST", // Laravel yêu cầu POST + _method=PUT
        body: formData,
        headers: {
          Authorization: `Bearer ${token}`, // Thêm token vào header
        },
      });

      const result = await response.json();
      console.log("Kết quả API:", result);

      if (response.ok) {
        message.success("Cập nhật diễn viên thành công!");
        nav("/admin/list-actors");
      } else {
        message.error(result.message || "Cập nhật thất bại!");
      }
    } catch (error) {
      message.error("Lỗi kết nối API!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card title="Chỉnh sửa diễn viên" style={{ maxWidth: 500, margin: "auto" }}>
      <Form form={form} onFinish={handleSubmit} layout="vertical">
        <Form.Item
          label="Tên diễn viên"
          name="name"
          rules={[{ required: true, message: "Vui lòng nhập tên diễn viên!" }]}
        >
          <Input placeholder="Nhập tên diễn viên" />
        </Form.Item>

        <Form.Item label="Ảnh đại diện (JPG, PNG)" name="avatar">
          <Upload
            beforeUpload={beforeUpload}
            maxCount={1}
            accept=".jpg,.jpeg,.png"
            listType="picture"
            fileList={fileList}
            onChange={handleChange}
          >
            <Button icon={<UploadOutlined />}>Chọn ảnh mới</Button>
          </Upload>

          {/* Hiển thị ảnh cũ */}
          {actor?.avatar && !fileList.length && (
            <div style={{ marginTop: 10 }}>
              <img
                src={`http://filmgo.io.vn/storage/${actor.avatar}`}
                alt="avatar"
                width={100}
                style={{ borderRadius: 8 }}
              />
            </div>
          )}
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            Cập nhật diễn viên
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default EditActor;
