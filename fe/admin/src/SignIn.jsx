// import { useMutation } from "@tanstack/react-query";
// import { Button, Form, Input, message, Card, Col } from "antd";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import googleIcon from "@/assets/images/Google_Icons-09-512.webp";
// import { getUrlLoginWithGoogle } from "@/api/authService";

// const Signin = () => {
//   const nav = useNavigate();
//   const [form] = Form.useForm();
//   const [messageApi, contextHolder] = message.useMessage();
//   const { mutate, isPending } = useMutation({
//     mutationFn: async (formData) => {
//       return await axios.post(`http://filmgo.io.vn/api/auth/login`, formData);
//     },

//     onSuccess: (data) => {
//       const { access_token } = data.data; // Tùy thuộc vào API, có thể thay đổi theo cách trả về của server
//       localStorage.setItem("access_token", access_token); // Lưu token vào localStorage
//       localStorage.setItem("user", JSON.stringify({ ...data.data.user }));

//       form.resetFields();
//       messageApi.open({
//         type: "success",
//         content: "Đăng nhập thành công!",
//       });
//       const user = JSON.parse(localStorage.getItem("user") || "[]");

//       if (user[0].role_name === "admin") {
//         nav(`/admin`); // Redirect to the admin page if role is 'admin'
//       } else {
//         nav(`/`); // Redirect to the homepage or another page if the user is not admin
//       }
//     },
//     onError: () => {
//       messageApi.open({
//         type: "error",
//         content: "Email hoặc mật khẩu không đúng",
//       });
//     },
//   });

//   const onFinish = (values) => {
//     mutate(values);
//   };
//   const handleLoginWithGoogle = async () => {
//     try {
//       const response = await getUrlLoginWithGoogle();
//       // Xử lý response, ví dụ: chuyển hướng người dùng đến URL đăng nhập Google
//       // console.log(response);
//       window.location.href = response.url;
//     } catch (error) {
//       // Xử lý lỗi, ví dụ: hiển thị thông báo lỗi cho người dùng
//       console.error("Lỗi đăng nhập Google:", error);
//     }
//   };

//   return (
//     <div
//       style={{ display: "flex", justifyContent: "center", marginTop: "50px" }}
//     >
//       {contextHolder}
//       <Card
//         title="ĐĂNG NHẬP"
//         bordered={false}
//         style={{
//           width: "100%",
//           maxWidth: "450px",
//           boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
//           borderRadius: "8px",
//           padding: "30px 40px",
//           textAlign: "center",
//         }}
//       >
//         <Form
//           name="signin-form"
//           form={form}
//           labelAlign="top"
//           labelCol={{ span: 24 }}
//           wrapperCol={{ span: 24 }}
//           onFinish={onFinish}
//           disabled={isPending}
//         >
//           <Col span={24}>
//             <Form.Item
//               label="Email"
//               name="email"
//               rules={[
//                 {
//                   required: true,
//                   message: "Bắt buộc nhập",
//                 },
//                 {
//                   type: "email",
//                   message: "Định dạng email không đúng",
//                 },
//               ]}
//             >
//               <Input placeholder="Nhập email" />
//             </Form.Item>

//             <Form.Item
//               label="Mật khẩu"
//               name="password"
//               rules={[
//                 {
//                   required: true,
//                   message: "Bắt buộc nhập",
//                 },
//                 {
//                   min: 6,
//                   message: "Mật khẩu phải có ít nhất 6 ký tự",
//                 },
//               ]}
//             >
//               <Input.Password placeholder="Nhập mật khẩu" />
//             </Form.Item>
//           </Col>

//           <Form.Item>
//             <Button
//               type="primary"
//               htmlType="submit"
//               block
//               style={{
//                 backgroundColor: "#1890ff",
//                 borderColor: "#1890ff",
//                 borderRadius: "8px",
//                 fontWeight: "bold",
//                 padding: "12px 0",
//                 transition: "all 0.3s ease",
//                 width: "100%",
//               }}
//               onMouseEnter={(e) => (e.target.style.backgroundColor = "#40a9ff")}
//               onMouseLeave={(e) => (e.target.style.backgroundColor = "#1890ff")}
//             >
//               Đăng nhập
//             </Button>
//           </Form.Item>
//           <Form.Item>
//             <Button
//               style={{
//                 borderRadius: "8px",
//                 fontWeight: "bold",
//                 padding: "12px 0",
//                 transition: "all 0.3s ease",
//                 width: "100%",
//               }}
//               onClick={handleLoginWithGoogle}
//             >
//               Đăng nhập bằng Google
//               <img src={googleIcon} alt="Google Icon" className="w-[24px]" />
//             </Button>
//           </Form.Item>
//         </Form>
//       </Card>
//     </div>
//   );
// };

// export default Signin;
import { useMutation } from "@tanstack/react-query";
import { Button, Form, Input, message, Card, Col } from "antd";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Signin = () => {
  const nav = useNavigate();
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();
  const { mutate, isPending } = useMutation({
    mutationFn: async (formData) => {
      return await axios.post(`http://filmgo.io.vn/api/auth/login`, formData);
    },

    onSuccess: (data) => {
      const { access_token } = data.data; // Tùy thuộc vào API, có thể thay đổi theo cách trả về của server
      localStorage.setItem("access_token", access_token); // Lưu token vào localStorage
      localStorage.setItem("user", JSON.stringify({ ...data.data.user }));

      form.resetFields();
      messageApi.open({
        type: "success",
        content: "Đăng nhập thành công!",
      });
      const user = JSON.parse(localStorage.getItem("user") || "[]");

      if (user[0].role_name === "admin") {
        nav("/admin");
      } else if (user[0].role_name === "staff") {
        nav("/staff");
      } else {
        nav("/pagenot");
      }
    },
    onError: () => {
      messageApi.open({
        type: "error",
        content: "Email hoặc mật khẩu không đúng",
      });
    },
  });

  const onFinish = (values) => {
    mutate(values);
  };

  return (
    <div
      style={{ display: "flex", justifyContent: "center", marginTop: "50px" }}
    >
      {contextHolder}
      <Card
        title="ĐĂNG NHẬP ADMIN"
        bordered={false}
        style={{
          width: "100%",
          maxWidth: "450px",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
          borderRadius: "8px",
          padding: "30px 40px",
          textAlign: "center",
        }}
      >
        <Form
          name="signin-form"
          form={form}
          labelAlign="top"
          labelCol={{ span: 24 }}
          wrapperCol={{ span: 24 }}
          onFinish={onFinish}
          disabled={isPending}
        >
          <Col span={24}>
            <Form.Item
              label="Email"
              name="email"
              rules={[
                {
                  required: true,
                  message: "Bắt buộc nhập",
                },
                {
                  type: "email",
                  message: "Định dạng email không đúng",
                },
              ]}
            >
              <Input placeholder="Nhập email" />
            </Form.Item>

            <Form.Item
              label="Mật khẩu"
              name="password"
              rules={[
                {
                  required: true,
                  message: "Bắt buộc nhập",
                },
                {
                  min: 6,
                  message: "Mật khẩu phải có ít nhất 6 ký tự",
                },
              ]}
            >
              <Input.Password placeholder="Nhập mật khẩu" />
            </Form.Item>
          </Col>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              block
              style={{
                backgroundColor: "#1890ff",
                borderColor: "#1890ff",
                borderRadius: "8px",
                fontWeight: "bold",
                padding: "12px 0",
                transition: "all 0.3s ease",
                width: "100%",
              }}
              onMouseEnter={(e) => (e.target.style.backgroundColor = "#40a9ff")}
              onMouseLeave={(e) => (e.target.style.backgroundColor = "#1890ff")}
            >
              Đăng nhập
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default Signin;
