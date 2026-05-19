import { Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  HomeOutlined,
  ShoppingOutlined,
  UserOutlined,
  HeartOutlined,
  SettingOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import { Button, Layout, Menu, Avatar } from "antd";
import { useState, useEffect } from "react";

const { Header, Sider, Content } = Layout;

export default function MainLayout() {
  const [collapsed, setCollapsed] =
    useState(false);

  const [isMobile, setIsMobile] =
    useState(window.innerWidth < 768);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleResize = () => {
      const mobile =
        window.innerWidth < 768;

      setIsMobile(mobile);

      if (mobile) {
        setCollapsed(true);
      }
    };

    handleResize();

    window.addEventListener(
      "resize",
      handleResize
    );

    return () =>
      window.removeEventListener(
        "resize",
        handleResize
      );
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  const menuItems = [
    {
      key: "/home",
      icon: <HomeOutlined />,
      label: "Ana Səhifə",
    },
    {
      key: "/products",
      icon: <ShoppingOutlined />,
      label: "Məhsullar",
    },
    {
      key: "/favorites",
      icon: <HeartOutlined />,
      label: "Seçilmişlər",
    },
    {
      key: "/profile",
      icon: <UserOutlined />,
      label: "Profil",
    },
    {
      key: "/settings",
      icon: <SettingOutlined />,
      label: "Tənzimləmələr",
    },
    {
      key: "/category",
      icon: <CheckCircleOutlined />,
      label: "Kategoriyalar",
    },
  ];

  return (
    <Layout className="min-h-screen bg-slate-100">
      {isMobile && !collapsed && (
        <div
          className="fixed inset-0 bg-slate-950/50 backdrop-blur-sm z-999"
          onClick={() =>
            setCollapsed(true)
          }
        />
      )}

      <Sider
        collapsible
        collapsed={collapsed}
        trigger={null}
        width={280}
        collapsedWidth={
          isMobile ? 0 : 85
        }
        className="bg-slate-900! border-r border-slate-800 shadow-2xl"
        style={{
          position: isMobile
            ? "fixed"
            : "sticky",
          height: "100vh",
          left: 0,
          top: 0,
          zIndex: 1000,
        }}
      >
        <div className="h-full flex flex-col">
          {/* LOGO */}
          <div className="px-6 py-7 border-b border-slate-800">
            <h1 className="text-white text-3xl font-black tracking-wide transition-all duration-300">
              {collapsed ? (
                "N"
              ) : (
                <>
                  Nova
                  <span className="text-sky-400">
                    Shop
                  </span>
                </>
              )}
            </h1>
          </div>

          {/* USER */}
          <div className="px-5 py-6 flex items-center gap-4 border-b border-slate-800">
            <Avatar
              size={58}
              className=".bg-gradient-to-r from-sky-500 to-cyan-400 text-white shadow-lg"
            >
              G
            </Avatar>

            {!collapsed && (
              <div>
                <h3 className="text-white font-semibold text-lg">
                  Xoş Gəlmisiniz
                </h3>

                <p className="text-slate-400 text-sm">
                  Premium User
                </p>
              </div>
            )}
          </div>

          {/* MENU */}
          <div className="flex-1 px-3 py-5 overflow-hidden">
            <Menu
              mode="inline"
              selectedKeys={[
                location.pathname,
              ]}
              onClick={({ key }) => {
                navigate(key);

                if (isMobile) {
                  setCollapsed(true);
                }
              }}
              items={menuItems}
              theme="dark"
              className="bg-transparent! border-none text-base"

              style={{
                background: "transparent",
              }}
            />
          </div>

          
          <div className="p-4 border-t border-slate-800">
            <Button
              danger
              block
              size="large"
              icon={
                <LogoutOutlined />
              }
              onClick={handleLogout}
              className="rounded-2xl! h-12! font-semibold"
            >
              {!collapsed &&
                "Çıxış Et"}
            </Button>
          </div>
        </div>
      </Sider>

      <Layout>
      
        <Header className="bg-white/80! backdrop-blur-xl px-6! flex items-center justify-between border-b border-slate-200 shadow-sm sticky top-0 z-50">
          <div className="flex items-center gap-4">
            <Button
              type="text"
              icon={
                collapsed ? (
                  <MenuUnfoldOutlined />
                ) : (
                  <MenuFoldOutlined />
                )
              }
              onClick={() =>
                setCollapsed(
                  !collapsed
                )
              }
              className="text-xl! hover:bg-slate-100! rounded-xl!"
            />

            <div>
              <h2 className="text-xl font-bold text-slate-800">
                Dashboard
              </h2>

              <p className="text-slate-500 text-sm">
                Xoş gəlmisiniz 👋
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Avatar
              size={46}
              className="bg-slate-800! shadow-md"
            >
              G
            </Avatar>
          </div>
        </Header>

        {/* CONTENT */}
        <Content className="bg-slate-100 p-6 min-h-[calc(100vh-64px)]">
          <div className="bg-white rounded-32px p-6 min-h-full shadow-sm border border-slate-200">
            <Outlet />
          </div>
        </Content>
      </Layout>
    </Layout>
  );
}