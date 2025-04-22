import { useState } from "react";
import { TagTwoTone } from "@ant-design/icons";
import { Breadcrumb, Layout, Menu, theme } from "antd";
import { Link, Outlet, useNavigate } from "react-router-dom";
import PageNotFound from "./../PageNotFound";
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
  getItem(<Link to="/staff/list-ticket">Vé</Link>, "7", <TagTwoTone />),
];

const LayoutStaff = () => {
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
  if (!user || user[0].role_name !== "staff") {
    return (
      <>
        <PageNotFound />
      </>
    );
  }

  return (
    <Layout
      style={{
        minHeight: "100vh",
      }}
    >
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
      >
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
            padding: 0,
            background: colorBgContainer,
          }}
        >
          <div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                fontSize: "30px",
                padding: "10px",
              }}
            >
              <h1 style={{ margin: 0 }}>Hello @{user[0].name}</h1>
              <button
                className="btn btn-danger"
                onClick={handleLogout}
                style={{ fontSize: "15px" }}
              >
                Đăng xuất
              </button>
            </div>
          </div>
        </Header>

        <Content
          style={{
            margin: "0 16px",
          }}
        >
          <Breadcrumb
            style={{
              margin: "16px 0",
            }}
          >
            {/* <Breadcrumb.Item>User</Breadcrumb.Item> */}
            {/* <Breadcrumb.Item>Bill</Breadcrumb.Item> */}
          </Breadcrumb>
          <div
            style={{
              padding: 24,
              minHeight: 360,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            <Outlet />
          </div>
        </Content>
        <Footer
          style={{
            textAlign: "center",
          }}
        ></Footer>
      </Layout>
    </Layout>
  );
};
export default LayoutStaff;
