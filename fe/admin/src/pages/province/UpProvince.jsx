import { Button, Form, Input, Skeleton } from "antd";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const UpProvince = () => {
  const nav = useNavigate();
  const queryClient = useQueryClient();
  const { id } = useParams(); // Lấy ID từ URL
  const getAccessToken = () => {
    return localStorage.getItem("access_token");
  };
  const { data, isLoading } = useQuery({
    queryKey: ["provinces", id],
    queryFn: async () => {
      const response = await axios.get(
        `http://filmgo.io.vn/api/provinces/show/${id}`
      );
      return response.data.data;
    },
  });
  const { mutate } = useMutation({
    mutationFn: async (province) => {
      const token = getAccessToken(); // Lấy token
      if (!token) {
        throw new Error("Không có access token");
      }

      // Gửi yêu cầu POST với access_token trong header
      await axios.put(
        `http://filmgo.io.vn/api/provinces/update/${id}`,
        province,

        {
          headers: {
            Authorization: `Bearer ${token}`, // Thêm Authorization header
          },
        }
      );
    },
    onSuccess: () => {
      nav(`/admin/list-province`);
      queryClient.invalidateQueries({
        queryKey: ["provinces", id],
      });
    },
  });

  const onFinish = (values) => {
    mutate(values);
  };
  if (isLoading) return <Skeleton active />;
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
      initialValues={data} // Sử dụng dữ liệu rạp phim làm initialValues
      onFinish={onFinish}
      autoComplete="off"
    >
      <h1 className="text-3xl mb-5">Cập nhật khu vực</h1>
      <Form.Item
        label="Tên Khu vực"
        name="name"
        rules={[
          {
            required: true,
            message: "Không được bỏ trống!",
          },
          {
            min: 5,
            message: "Tên khu vực không được dưới 5 kí tự",
          },
        ]}
      >
        <Input placeholder="Nhập tên khu vực" />
      </Form.Item>

      <Form.Item label={null}>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
};
export default UpProvince;
