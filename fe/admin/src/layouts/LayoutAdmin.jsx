import { useState } from "react";
import {
  BankTwoTone,
  ClockCircleTwoTone,
  ContactsTwoTone,
  FireTwoTone,
  GiftTwoTone,
  IdcardTwoTone,
  PieChartTwoTone,
  PlaySquareTwoTone,
  ProjectTwoTone,
  TagTwoTone,
  VideoCameraTwoTone,
} from "@ant-design/icons";
import { Breadcrumb, Layout, Menu, theme } from "antd";
import { Link, Outlet, useNavigate } from "react-router-dom";
import PageNotFound from "./../PageNotFound";
import { MdChair } from "react-icons/md";

const { Header, Content, Footer, Sider } = Layout;
function getItem(label, key, icon, children) {
  return {
    key,
    icon,
    children,
    label,
  };
}
const items = [
  getItem(<Link to="/admin">Thống kê</Link>, "1", <PieChartTwoTone />),
  getItem(
    <Link to="/admin/list-movies">Phim</Link>,
    "2",
    <PlaySquareTwoTone />
  ),

  getItem(
    <Link to="/admin/list-cinema">Rạp phim</Link>,
    "3",
    <VideoCameraTwoTone />
  ),
  getItem(
    <Link to="/admin/list-province">Khu vực</Link>,
    "15",
    <BankTwoTone />
  ),
  getItem(
    <Link to="/admin/list-screen">Phòng chiếu</Link>,
    "14",
    <ProjectTwoTone />
  ),

  // getItem(" Lịch chiếu", "4", <CalendarTwoTone />),

  getItem(
    <Link to="/admin/list-showtime">Suất chiếu</Link>,
    "5",
    <ClockCircleTwoTone />
  ),
  getItem(
    <Link to="/admin/seats">
      <div style={{ display: "flex", alignItems: "center" }}>
        <MdChair size={15} color="blue" />
        <h1 style={{ marginLeft: "10px" }}>Ghế</h1>
      </div>
    </Link>,
    "16"
  ),
  // getItem(" Vé", "7", <TagTwoTone />),
  getItem(<Link to="/admin/list-ticket">Vé</Link>, "7", <TagTwoTone />),
  getItem(<Link to="/admin/list-promo">Khuyến mãi</Link>, "8", <FireTwoTone />),
  getItem(<Link to="/admin/list-product">Combo</Link>, "9", <GiftTwoTone />),
  // getItem(<Link to="/admin/list-banners">Banners</Link>, "10", <LikeTwoTone />),
  getItem(
    <Link to="/admin/list-user">Người dùng</Link>,
    "11",
    <IdcardTwoTone />
  ),
  getItem(
    <Link to="/admin/list-actors">Diễn viên</Link>,
    "12",
    <ContactsTwoTone />
  ),
  getItem(
    <Link to="/admin/list-genres">Thể loại</Link>,
    "13",
    <PlaySquareTwoTone />
  ),
];

const LayoutAdmin = () => {
  const nav = useNavigate();
  const handleLogout = () => {
    // Xóa thông tin người dùng trong localStorage
    localStorage.removeItem("user");
    localStorage.removeItem("access_token");

    // Cập nhật trạng thái đăng nhập

    // Chuyển hướng về trang đăng nhập
    nav(`/signin`);
  };
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const user = JSON.parse(localStorage.getItem("user") || "[]");
  // console.log(user);
  // const role = user[0].role_name;
  // console.log(role);
  if (!user || user[0].role_name !== "admin") {
    return (
      <>
        <PageNotFound />
      </>
    );
  }

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider collapsible collapsed={collapsed} onCollapse={setCollapsed}>
        <div className="demo-logo-vertical" />
        <Menu
          theme="dark"
          defaultSelectedKeys={["1"]}
          mode="inline"
          items={items}
        />
      </Sider>

      <Layout>
        <Header
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "0 16px",
            background: "#fff",
          }}
        >
          <h2 style={{ color: "#000", margin: 0 }}></h2>
          <button className="btn btn-primary" onClick={handleLogout}>
            Đăng xuất
          </button>
        </Header>

        <Content style={{ margin: "16px" }}>
          <Breadcrumb style={{ margin: "10px 0" }}>
            {/* <Breadcrumb.Item>User</Breadcrumb.Item>
          <Breadcrumb.Item>Bill</Breadcrumb.Item> */}
          </Breadcrumb>
          <div
            style={{
              padding: 24,
              minHeight: 360,
              background: "#fff",
              borderRadius: "8px",
            }}
          >
            <Outlet />
          </div>
        </Content>

        <Footer style={{ textAlign: "center" }}>FilmGo ©2025</Footer>
      </Layout>
    </Layout>
  );
};
export default LayoutAdmin;
