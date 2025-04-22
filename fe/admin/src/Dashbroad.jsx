import { useQuery } from "@tanstack/react-query";
import { Skeleton, Table, Card, Row, Col, Statistic, DatePicker } from "antd";
import moment from "moment";
import axios from "axios";
import { useState } from "react";

const Dashboard = () => {
  // Lấy token từ localStorage
  const getAccessToken = () => {
    return localStorage.getItem("access_token");
  };

  // State for the selected month
  const [selectedMonth, setSelectedMonth] = useState(null);

  // Handle month selection
  const handleMonthChange = (date) => {
    if (date) {
      const monthYear = date.format("MM/YYYY");
      setSelectedMonth(monthYear);
    } else {
      setSelectedMonth(null);
    }
  };

  // Fetch dữ liệu từ API
  const { data, isLoading } = useQuery({
    queryKey: ["tikets"],
    queryFn: async () => {
      const token = getAccessToken();
      if (!token) throw new Error("Token không hợp lệ hoặc không tồn tại");

      const response = await axios.get(
        `http://filmgo.io.vn/api/admin/tickets`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data.data.map((ticket) => ({
        key: ticket.id,
        ...ticket,
      }));
    },
  });

  // Lọc data theo tháng đã chọn (dựa vào created_at)
  const filteredDataByMonth = selectedMonth
    ? data?.filter(
        (ticket) =>
          moment(ticket.created_at).format("MM/YYYY") === selectedMonth
      )
    : data;

  // Doanh thu tổng
  const totalRevenue = data?.reduce(
    (acc, ticket) =>
      acc + parseFloat(ticket.total_amount.replace(".", "").replace(",", ".")),
    0
  );

  // Doanh thu theo tháng
  const revenueByMonth = data?.reduce((acc, ticket) => {
    const monthYear = moment(ticket.created_at).format("MM/YYYY");
    const revenue = parseFloat(
      ticket.total_amount.replace(".", "").replace(",", ".")
    );
    acc[monthYear] = (acc[monthYear] || 0) + revenue;
    return acc;
  }, {});

  const filteredRevenue = selectedMonth
    ? revenueByMonth?.[selectedMonth] || 0
    : totalRevenue;

  // ✅ Doanh thu theo phim dựa trên data đã lọc theo tháng
  const revenueByMovie = filteredDataByMonth?.reduce((acc, ticket) => {
    const movieName = ticket.movie_name;
    const revenue = parseFloat(
      ticket.total_amount.replace(".", "").replace(",", ".")
    );

    acc[movieName] = (acc[movieName] || 0) + revenue;
    return acc;
  }, {});

  const movieRevenueTableData = Object.entries(revenueByMovie || {}).map(
    ([movie, revenue], index) => ({
      key: index,
      movie,
      revenue,
    })
  );

  const movieRevenueColumns = [
    {
      title: "Tên phim",
      dataIndex: "movie",
      key: "movie",
    },
    {
      title: "Tổng doanh thu",
      dataIndex: "revenue",
      key: "revenue",
      render: (value) =>
        value.toLocaleString("vi-VN", {
          style: "currency",
          currency: "VND",
        }),
    },
  ];

  const columns = [
    {
      title: "Mã vé",
      dataIndex: "ticket_code",
      key: "ticket_code",
    },
    {
      title: "Mã vé",
      dataIndex: "ticket_id",
      key: "ticket_id",
    },
    {
      title: "Tên người dùng",
      dataIndex: "user_name",
      key: "user_name",
    },
    {
      title: "Tên phim",
      dataIndex: "movie_name",
      key: "movie_name",
    },
    {
      title: "Thời gian",
      dataIndex: "showtime",
      key: "showtime",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
    },
    {
      title: "Ngày mua",
      dataIndex: "created_at",
      key: "created_at",
      render: (text) => <a>{moment(text).format("DD/MM/YYYY")}</a>,
    },
    {
      title: "Đơn giá",
      dataIndex: "total_amount",
      key: "total_amount",
      render: (text) => <span>{text.toLocaleString()} VNĐ</span>,
    },
  ];

  return (
    <>
      <h1 className="text-3xl mb-5">Thống kê</h1>

      {/* Tổng & theo tháng */}
      <Row gutter={16}>
        <Col span={12}>
          <Card>
            <Statistic
              title="Doanh thu Tổng"
              value={totalRevenue || 0}
              precision={0}
              valueStyle={{ color: "#3f8600" }}
              prefix="₫"
              suffix="VND"
            />
          </Card>
        </Col>

        <Col span={12}>
          <Card>
            <Row align="middle">
              <Col span={12}>
                <DatePicker
                  picker="month"
                  onChange={handleMonthChange}
                  format="MM/YYYY"
                  placeholder="Chọn tháng"
                  style={{ width: "100%" }}
                />
              </Col>
              <Col span={12} style={{ textAlign: "right" }}>
                <Statistic
                  title={`Doanh thu tháng ${selectedMonth || "Tất cả"}`}
                  value={filteredRevenue}
                  precision={0}
                  valueStyle={{ color: "#3f8600" }}
                  prefix="₫"
                  suffix="VND"
                />
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>

      {/* Bảng thống kê doanh thu theo phim */}
      <Card style={{ marginTop: 24 }}>
        <Skeleton active loading={isLoading}>
          <Table
            columns={movieRevenueColumns}
            dataSource={movieRevenueTableData}
            pagination={{ pageSize: 5 }}
          />
        </Skeleton>
      </Card>

      {/* Bảng chi tiết vé (nếu muốn dùng) */}
      {/* 
      <Skeleton active loading={isLoading}>
        <Table columns={columns} dataSource={data} />
      </Skeleton> 
      */}
    </>
  );
};

export default Dashboard;
