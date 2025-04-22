import React from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  Card,
  Skeleton,
  message,
  Row,
  Col,
  Typography,
  Space,
  Button,
} from "antd";
import axios from "axios";

// Function to get the access token from localStorage
const getAccessToken = () => {
  return localStorage.getItem("access_token");
};

const { Title, Text } = Typography;

const DetailTicket = () => {
  // Get ticket ID from the URL using useParams hook
  const { id } = useParams();

  // Fetch ticket details based on ticketId
  const { data, isLoading, error } = useQuery({
    queryKey: ["ticket", id],
    queryFn: async () => {
      const token = getAccessToken();
      if (!token) {
        throw new Error("Token không hợp lệ hoặc không tồn tại");
      }

      const response = await axios.get(
        `http://filmgo.io.vn/api/admin/tickets/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data.data;
    },
    onError: (err) => {
      message.error(err.message || "Có lỗi xảy ra!");
    },
  });

  // Hiển thị khi đang tải
  if (isLoading) {
    return <Skeleton active />;
  }

  // Hiển thị lỗi khi có sự cố trong việc tải dữ liệu
  if (error) {
    return (
      <div style={{ textAlign: "center", marginTop: "20px" }}>
        <Title level={3}>Lỗi tải dữ liệu</Title>
        <Text type="danger">{error.message}</Text>
      </div>
    );
  }

  // Hàm in thông tin vé
  const handlePrint = () => {
    // Lưu lại nội dung cần in trong một phần tử div
    const printContent = document.getElementById("ticket-detail").innerHTML;
    const printWindow = window.open("", "", "width=800,height=600");
    printWindow.document.write(`
      <html>
        <head>
          <title>In Thông Tin Vé</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              margin: 20px;
            }
            .print-container {
              max-width: 800px;
              margin: 0 auto;
            }
            .ticket-info p {
              font-size: 16px;
            }
            @media print {
              .no-print { display: none; }
            }
          </style>
        </head>
        <body>
          <div class="print-container">
            <h1>Thông Tin Vé</h1>
            ${printContent}
            <div class="no-print">
              <button onclick="window.print()">In</button>
            </div>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  // Hiển thị thông tin vé sau khi tải thành công
  return (
    <div style={{ padding: "20px" }}>
      <Title level={2} style={{ marginBottom: "20px", textAlign: "center" }}>
        Chi Tiết Vé
      </Title>

      <Card
        title="Thông Tin Vé"
        bordered={false}
        style={{ maxWidth: 800, margin: "0 auto" }}
        headStyle={{ backgroundColor: "#f0f2f5" }}
      >
        <Row gutter={[16, 16]}>
          <Col span={12}>
            <Text strong>Mã Vé:</Text>
            <p>{data.ticket_id}</p>
          </Col>
          <Col span={12}>
            <Text strong>Code:</Text>
            <p>{data.ticket_code}</p>
          </Col>
          <Col span={12}>
            <Text strong>Phòng chiếu:</Text>
            <p>{data.screen}</p>
          </Col>
          <Col span={12}>
            <Text strong>Rạp:</Text>
            <p>{data.cinema}</p>
          </Col>
          <Col span={12}>
            <Text strong>Tên Phim:</Text>
            <p>{data.movie_name}</p>
          </Col>
          <Col span={12}>
            <Text strong>Thời Gian Chiếu:</Text>
            <p>{data.showtime}</p>
          </Col>
        </Row>

        <Title level={4} style={{ marginTop: "20px" }}>
          Thông Tin Ghế
        </Title>

        {data.seats && data.seats.length > 0 ? (
          <Row gutter={[16, 16]}>
            {data.seats.map((seat, index) => (
              <Col span={8} key={index}>
                <Card bordered={false} style={{ backgroundColor: "#fafafa" }}>
                  <Row>
                    <Col span={12}>
                      <Text strong>Ghế:</Text> {seat.seat_row}
                      {seat.seat_number}
                    </Col>
                    <Col span={12} style={{ textAlign: "right" }}>
                      <Text strong>Giá:</Text> {seat.price}
                    </Col>
                  </Row>
                </Card>
              </Col>
            ))}
          </Row>
        ) : (
          <Text type="danger">Không có thông tin ghế.</Text>
        )}
      </Card>

      <div style={{ textAlign: "center", marginTop: "20px" }}>
        <Button type="primary" onClick={handlePrint}>
          In Thông Tin Vé
        </Button>
      </div>

      {/* Phần thông tin vé sẽ được in */}
      <div id="ticket-detail" style={{ display: "none" }}>
        <Row gutter={[16, 16]}>
          <Col span={12}>
            <Text strong>Mã Vé:</Text>
            <p>{data.ticket_id}</p>
          </Col>
          <Col span={12}>
            <Text strong>Code:</Text>
            <p>{data.ticket_code}</p>
          </Col>
          <Col span={12}>
            <Text strong>Phòng chiếu:</Text>
            <p>{data.screen}</p>
          </Col>
          <Col span={12}>
            <Text strong>Rạp:</Text>
            <p>{data.cinema}</p>
          </Col>
          <Col span={12}>
            <Text strong>Tên Phim:</Text>
            <p>{data.movie_name}</p>
          </Col>
          <Col span={12}>
            <Text strong>Thời Gian Chiếu:</Text>
            <p>{data.showtime}</p>
          </Col>
        </Row>

        <Title level={4} style={{ marginTop: "20px" }}>
          Thông Tin Ghế
        </Title>

        {data.seats && data.seats.length > 0 ? (
          <Row gutter={[16, 16]}>
            {data.seats.map((seat, index) => (
              <Col span={8} key={index}>
                <Card bordered={false} style={{ backgroundColor: "#fafafa" }}>
                  <Row>
                    <Col span={12}>
                      <Text strong>Ghế:</Text> {seat.seat_row}
                      {seat.seat_number}
                    </Col>
                    <Col span={12} style={{ textAlign: "right" }}>
                      <Text strong>Giá:</Text> {seat.price}
                    </Col>
                  </Row>
                </Card>
              </Col>
            ))}
          </Row>
        ) : (
          <Text type="danger">Không có thông tin ghế.</Text>
        )}
      </div>
    </div>
  );
};

export default DetailTicket;
