import { Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  HomeOutlined, ShoppingOutlined, UserOutlined, HeartOutlined,
  SettingOutlined, LogoutOutlined, MenuFoldOutlined, MenuUnfoldOutlined,
  CheckCircleOutlined, MoonOutlined, SunOutlined
} from "@ant-design/icons";
import { Button, Layout, Menu, Avatar, Tooltip } from "antd";
import { useState, useEffect } from "react";
import { type NestedUserData } from "../types/User.type"; 
import { useSelector, useDispatch } from "react-redux";
import { clearUser } from "../redux/authSlice"; 
import type { RootState } from "../redux/store";

const { Header, Sider, Content } = Layout;

const MENU = [
  { key: "/home",     icon: <HomeOutlined />,         label: "Ana Səhifə"    },
  { key: "/product",  icon: <ShoppingOutlined />,      label: "Məhsullar"     },
  { key: "/favorites", icon: <HeartOutlined />,         label: "Seçilmişlər"  },
  { key: "/profile",  icon: <UserOutlined />,          label: "Profil"        },
  { key: "/category", icon: <CheckCircleOutlined />,   label: "Kategoriyalar" },
  { key: "/settings", icon: <SettingOutlined />,       label: "Tənzimləmələr" },
];



export default function MainLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobile, setMobile]       = useState(window.innerWidth < 768);
  const [theme, setTheme]         = useState(() => localStorage.getItem("theme") || "light");
  
  const navigate   = useNavigate();
  const { pathname } = useLocation();
  const dispatch = useDispatch();
  
  const userData = useSelector((state: RootState) => state.auth.user) as NestedUserData | null;

  useEffect(() => {
    const fn = () => {
      const m = window.innerWidth < 768;
      setMobile(m);
      if (m) setCollapsed(true);
    };
    fn();
    window.addEventListener("resize", fn);
    return () => window.removeEventListener("resize", fn);
  }, []);

  useEffect(() => {
    const root = window.document.documentElement;
    const styleId = "global-dark-override";
    let styleEl = document.getElementById(styleId);

    if (theme === "dark") {
      root.classList.add("dark");
      if (!styleEl) {
        styleEl = document.createElement("style");
        styleEl.id = styleId;
        styleEl.innerHTML = `
          .dark .bg-white, .dark .ant-card, .dark .ant-table, .dark .ant-table-cell { 
            background-color: #1e293b !important; 
            border-color: #334155 !important; 
          }
          .dark .bg-white *, .dark .ant-card *, .dark .ant-table * { 
            color: #ffffff !important; 
          }
          .dark .ant-table-thead > tr > th { 
            background-color: #0f172a !important; 
          }
        `;
        document.head.appendChild(styleEl);
      }
    } else {
      root.classList.remove("dark");
      if (styleEl) styleEl.remove();
    }
  }, [theme]);

  const toggleTheme = () => {
    const nextTheme = theme === "light" ? "dark" : "light";
    setTheme(nextTheme);
    localStorage.setItem("theme", nextTheme);
  };

  // İkiqat obyekti açırıq
  const actualUser = userData?.user || userData;

  // ── MƏLUMATLARIN AYRILMASI ──
  // Sol tərəf üçün Ad və Soyad birləşməsini hazırlayırıq
  const firstName = actualUser?.firstName || "";
  const lastName = actualUser?.lastName || "";
  const fullName = `${firstName} ${lastName}`.trim() || actualUser?.name || actualUser?.username || "İstifadəçi";

  // Sağ tərəf üçün yalnız e-poçt
  const email  = actualUser?.email || "istifadeci@gmail.com";
  const role   = actualUser?.role || "Premium";
  
  // Avatar hərfi olaraq Adın ilk hərfini götürürük
  const letter = fullName.charAt(0).toUpperCase();

  const logout = () => { 
    localStorage.clear(); 
    dispatch(clearUser()); 
    window.location.href = "/login"; 
  };

  const isDark = theme === "dark";

  return (
    <Layout className={`min-h-screen font-[Sora,sans-serif] transition-colors duration-300 ${isDark ? "dark bg-[#0f172a]" : "bg-[#f8fafc]"}`}>
      
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800&display=swap'); body{font-family:'Sora',sans-serif}`}</style>

      {mobile && !collapsed && (
        <div onClick={() => setCollapsed(true)} className="fixed inset-0 bg-black/40 backdrop-blur-sm z-999" />
      )}

      <Sider
        collapsed={collapsed}
        trigger={null}
        width={256}
        collapsedWidth={mobile ? 0 : 76}
        style={{
          position: mobile ? "fixed" : "sticky",
          top: 0, left: 0, height: "100vh", zIndex: 1000,
          background: isDark ? "#1e293b" : "#ffffff",
          borderRight: isDark ? "1px solid #334155" : "1px solid #f1f5f9",
          boxShadow: isDark ? "none" : "4px 0 24px rgba(0,0,0,0.02)",
          transition: "all .25s ease", overflow: "hidden",
        }}
      >
        <div className="h-full flex flex-col">
          <div className={`h-16 flex items-center justify-center border-b shrink-0 ${isDark ? "border-[#334155]" : "border-[#f1f5f9]"}`}>
            <div className="flex items-center gap-2 font-black text-lg tracking-wider text-transparent bg-clip-text .bg-gradient-to-r from-blue-500 to-cyan-500">
              ⚡ {!collapsed && "DASHBOARD"}
            </div>
          </div>
          {!collapsed && (
            <div className={`mx-4 mt-4 mb-2 p-3.5 rounded-2xl border flex items-center gap-3 shrink-0 shadow-sm transition-all ${
              isDark ? ".bg-blue-500/[0.04] border-blue-500/20" : "bg-slate-50 border-slate-100"
            }`}>
              <Avatar 
                size={40} 
                className="shadow-sm shrink-0"
                style={{ background: "linear-gradient(135deg, #3b82f6, #06b6d4)", color: "#fff", fontWeight: 700 }}
              >
                {letter}
              </Avatar>
              <div className="overflow-hidden flex flex-col">
                <Tooltip title={fullName} placement="topLeft">
                  <div className={`font-semibold text-[14px] truncate ${isDark ? "text-slate-200" : "text-slate-800"}`}>
                    {fullName}
                  </div>
                </Tooltip>
                <div className="text-blue-500 text-[11px] font-bold tracking-wide mt-0.5 uppercase">{role}</div>
              </div>
            </div>
          )}

          <div className={`flex-1 overflow-y-auto mt-2 ${collapsed ? "px-2 py-3" : "px-3 py-1"}`}>
            <Menu
              mode="inline"
              inlineCollapsed={collapsed}
              selectedKeys={[pathname]}
              onClick={({ key }) => { navigate(key); if (mobile) setCollapsed(true); }}
              items={MENU}
              className="border-none bg-transparent"
              theme={isDark ? "dark" : "light"}
            />
          </div>

          <div className={`p-4 border-t shrink-0 ${isDark ? "border-[#334155]" : "border-[#f1f5f9]"}`}>
            <Button
              danger 
              block={!collapsed}
              icon={<LogoutOutlined />}
              onClick={logout}
              className={`w-full rounded-xl! h-42px! font-medium border-none! transition-all flex items-center justify-center ${
                isDark ? "bg-red-500/10! text-red-400!" : "bg-red-50! text-red-500! hover:bg-red-100!"
              }`}
            >
              {!collapsed && "Çıxış Et"}
            </Button>
          </div>
        </div>
      </Sider>

      <Layout className="bg-transparent">
        <Header
          className="sticky top-0 z-50 border-b flex items-center justify-between px-6"
          style={{
            height: 64,
            background: isDark ? "rgba(30,41,59,.85)" : "rgba(255,255,255,.85)",
            borderColor: isDark ? "#334155" : "#f1f5f9",
            backdropFilter: "blur(16px)",
            boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.03)"
          }}
        >
          <div className="flex items-center gap-3">
            <Button
              type="text"
              onClick={() => setCollapsed(!collapsed)}
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              className={`w-0! h-9! right-6 rounded-xl! flex items-center justify-center transition-colors ${
                isDark ? "text-slate-400! hover:text-white! hover:bg-slate-800!" : "text-slate-500! hover:text-slate-900! hover:bg-slate-100!"
              }`}
            />
         
          </div>

        
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block max-w-200px">
              <div className={`text-[13px] font-medium tracking-wide truncate ${isDark ? "text-slate-300" : "text-slate-600"}`}>
                {email}
              </div>
            </div>

            <Tooltip title={isDark ? "İşıqlı Rejim" : "Qaranlıq Rejim"}>
              <Button
                type="text"
                onClick={toggleTheme}
                icon={isDark ? <SunOutlined className="text-amber-400" /> : <MoonOutlined className="text-slate-600" />}
                className={`w-9! h-9! rounded-xl! border! flex items-center justify-center transition-all ${
                  isDark ? "border-slate-700! text-slate-400! hover:bg-slate-800!" : "border-slate-200! text-slate-600! hover:bg-slate-50!"
                }`}
              />
            </Tooltip>
          </div>
        </Header>

        {/* ── İçlik Kontent ── */}
        <Content className={`${mobile ? "p-3" : "p-6"}`}>
          <div
            className={`rounded-2xl border p-6 min-h-[calc(100vh-112px)] transition-all duration-300 shadow-[0_4px_20px_rgba(0,0,0,0.01)] ${
              isDark ? "bg-[#1e293b] border-[#334155]" : "bg-white border-[#f1f5f9]"
            }`}
          >
            <Outlet />
          </div>
        </Content>
      </Layout>
    </Layout>
  );
}