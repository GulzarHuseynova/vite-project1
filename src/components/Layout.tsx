import { Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  HomeOutlined, ShoppingOutlined, UserOutlined, HeartOutlined,
  SettingOutlined, LogoutOutlined, MenuFoldOutlined, MenuUnfoldOutlined,
  CheckCircleOutlined, SunOutlined, MoonOutlined,
} from "@ant-design/icons";
import { Button, Layout, Menu, Avatar, Tooltip } from "antd";
import { useState, useEffect } from "react";

const { Header, Sider, Content } = Layout;

const MENU = [
  { key: "/home",      icon: <HomeOutlined />,        label: "Ana Səhifə"    },
  { key: "/product",   icon: <ShoppingOutlined />,    label: "Məhsullar"     },
  { key: "/favorites", icon: <HeartOutlined />,       label: "Seçilmişlər"   },
  { key: "/profile",   icon: <UserOutlined />,        label: "Profil"        },
  { key: "/category",  icon: <CheckCircleOutlined />, label: "Kategoriyalar" },
  { key: "/settings",  icon: <SettingOutlined />,     label: "Tənzimləmələr" },
];

export default function MainLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobile, setMobile]       = useState(window.innerWidth < 768);
  const [dark, setDark]           = useState(true);
  const navigate     = useNavigate();
  const { pathname } = useLocation();

  useEffect(() => {
    const fn = () => { const m = window.innerWidth < 768; setMobile(m); if (m) setCollapsed(true); };
    fn(); window.addEventListener("resize", fn); return () => window.removeEventListener("resize", fn);
  }, []);

  interface UserData { name?: string; username?: string; email?: string; role?: string; }
  const getUserData = (): UserData => {
    try {
      const r = localStorage.getItem("user") || localStorage.getItem("userData");
      return r ? (JSON.parse(r) as UserData) : {};
    } catch { return {}; }
  };
  const userData = getUserData();

  const name   = userData.name || userData.username || userData.email?.split("@")[0] || "İstifadəçi";
  const role   = userData.role || "Premium";
  const letter = name.charAt(0).toUpperCase();
  const page   = MENU.find(m => m.key === pathname)?.label || "Dashboard";

  const dk = dark;
  const c = {
    sider:  dk ? "#111827" : "#ffffff",
    bg:     dk ? "#0d1117" : "#f3f4f8",
    card:   dk ? "#161d2e" : "#ffffff",
    border: dk ? "#1f2d45" : "#e2e8f0",
    header: dk ? "rgba(17,24,39,.92)" : "rgba(255,255,255,.93)",
    text:   dk ? "#f0f4ff" : "#111827",
    muted:  dk ? "#7b8faf" : "#64748b",
    accent: "#4f8ef7",
    glow:   "rgba(79,142,247,.18)",
  };

  const css = `
    @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800&display=swap');
    body{font-family:'Sora',sans-serif!important}
    ::-webkit-scrollbar{width:3px}::-webkit-scrollbar-thumb{background:${c.border};border-radius:9px}

    /* menu */
    .sl-menu.ant-menu{background:transparent!important;border:none!important}
    .sl-menu .ant-menu-item{
      border-radius:10px!important;margin:2px 0!important;
      height:44px!important;line-height:44px!important;
      padding:0 14px!important;
      color:${c.muted}!important;font-size:13.5px!important;font-weight:500!important;
      transition:all .18s ease!important
    }
    .sl-menu .ant-menu-item:hover{background:rgba(79,142,247,.09)!important;color:${c.text}!important}
    .sl-menu .ant-menu-item:hover .anticon{color:${c.accent}!important}
    .sl-menu .ant-menu-item-selected{
      background:rgba(79,142,247,.14)!important;
      color:${c.text}!important;font-weight:600!important;
      box-shadow:inset 3px 0 0 ${c.accent}!important
    }
    .sl-menu .ant-menu-item-selected .anticon{color:${c.accent}!important}

    /* header icon buttons */
    .h-btn.ant-btn-text{
      width:36px!important;height:36px!important;border-radius:9px!important;
      border:1px solid ${c.border}!important;color:${c.muted}!important;
      display:flex!important;align-items:center!important;justify-content:center!important;
      transition:all .18s!important
    }
    .h-btn.ant-btn-text:hover{border-color:${c.accent}!important;color:${c.accent}!important;background:${c.glow}!important}

    /* toggle btn */
    .t-btn.ant-btn-text{width:36px!important;height:36px!important;border-radius:9px!important;color:${c.muted}!important}
    .t-btn.ant-btn-text:hover{background:rgba(79,142,247,.09)!important;color:${c.text}!important}

    /* logout */
    .lg-btn.ant-btn-dangerous{
      border-radius:10px!important;height:42px!important;font-weight:600!important;font-size:13px!important;
      background:rgba(239,68,68,.07)!important;border:1px solid rgba(239,68,68,.15)!important;color:#f87171!important;
      transition:all .18s!important
    }
    .lg-btn.ant-btn-dangerous:hover{background:rgba(239,68,68,.14)!important}

    .av{background:linear-gradient(135deg,#4f8ef7,#06b6d4)!important;color:#fff!important;font-weight:700!important}
    @keyframes fu{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
    .fu{animation:fu .28s ease forwards}
    @keyframes pl{0%,100%{opacity:1}50%{opacity:.5}}
    .pl{animation:pl 2.4s infinite}
  `;

  const logout = () => { localStorage.clear(); navigate("/"); };

  return (
    <>
      <style>{css}</style>
      <Layout style={{ minHeight:"100vh", background:c.bg, fontFamily:"'Sora',sans-serif" }}>

        {/* overlay */}
        {mobile && !collapsed && (
          <div onClick={() => setCollapsed(true)}
            style={{ position:"fixed", inset:0, background:"rgba(0,0,0,.5)", backdropFilter:"blur(3px)", zIndex:999 }} />
        )}

        {/* ── SIDER ── */}
        <Sider collapsed={collapsed} trigger={null} width={248} collapsedWidth={mobile ? 0 : 72}
          style={{
            position: mobile ? "fixed" : "sticky", top:0, left:0, height:"100vh", zIndex:1000,
            background:c.sider, borderRight:`1px solid ${c.border}`,
            transition:"all .25s ease", overflow:"hidden",
          }}>
          <div style={{ height:"100%", display:"flex", flexDirection:"column" }}>

            {/* ── Logo ── */}
            <div style={{
              height:64, display:"flex", alignItems:"center", justifyContent:"center",
              borderBottom:`1px solid ${c.border}`, flexShrink:0,
            }} />

            {/* ── User card ── */}
            {!collapsed && (
              <div style={{
                margin:"12px 12px 4px", padding:"12px 14px", borderRadius:12,
                background: dk ? "rgba(79,142,247,.07)" : "rgba(79,142,247,.06)",
                border:`1px solid ${dk ? "rgba(79,142,247,.15)" : "rgba(79,142,247,.12)"}`,
                display:"flex", alignItems:"center", gap:10, flexShrink:0,
              }}>
                <div style={{ position:"relative" }}>
                  <Avatar size={38} className="av">{letter}</Avatar>
                  <span className="pl" style={{ position:"absolute", bottom:0, right:0, width:8, height:8, borderRadius:"50%", background:"#22c55e", border:`2px solid ${c.sider}` }} />
                </div>
                <div style={{ overflow:"hidden" }}>
                  <div style={{ color:c.text, fontWeight:700, fontSize:13.5, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{name}</div>
                  <div style={{ color:c.accent, fontSize:11, fontWeight:600, letterSpacing:"0.04em" }}>{role}</div>
                </div>
              </div>
            )}

            {/* ── Menu label ── */}
            {!collapsed && (
              <div style={{ padding:"14px 20px 6px", fontSize:10.5, fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase", color:c.muted, flexShrink:0 }}>
                Menyu
              </div>
            )}

            {/* ── Menu ── */}
            <div style={{ flex:1, padding: collapsed ? "12px 8px" : "4px 10px", overflowY:"auto" }}>
              <Menu className="sl-menu" mode="inline" theme="dark" inlineCollapsed={collapsed}
                selectedKeys={[pathname]}
                onClick={({ key }) => { navigate(key); if (mobile) setCollapsed(true); }}
                items={MENU}
              />
            </div>

            {/* ── Logout ── */}
            <div style={{ padding:12, borderTop:`1px solid ${c.border}`, flexShrink:0 }}>
              {collapsed
                ? <Tooltip title="Çıxış Et" placement="right">
                    <Button danger type="text" icon={<LogoutOutlined />} onClick={logout}
                      style={{ width:"100%", height:42, borderRadius:10, background:"rgba(239,68,68,.07)", color:"#f87171", border:"none" }} />
                  </Tooltip>
                : <Button danger block className="lg-btn" icon={<LogoutOutlined />} onClick={logout}>Çıxış Et</Button>
              }
            </div>
          </div>
        </Sider>

        {/* ── MAIN ── */}
        <Layout style={{ background:c.bg }}>

          {/* ── Header ── */}
          <Header style={{
            position:"sticky", top:0, zIndex:50,
            background:c.header, backdropFilter:"blur(14px)",
            borderBottom:`1px solid ${c.border}`,
            height:64, padding:"0 20px",
            display:"flex", alignItems:"center", justifyContent:"space-between",
          }}>
            {/* left */}
            <div style={{ display:"flex", alignItems:"center", gap:8 }}>
              <Button type="text" className="t-btn" onClick={() => setCollapsed(!collapsed)}
                icon={collapsed ? <MenuUnfoldOutlined style={{ fontSize:17 }} /> : <MenuFoldOutlined style={{ fontSize:17 }} />} />
              <div style={{ lineHeight:1 }}>
                <div style={{ color:c.text, fontWeight:700, fontSize:15 }}>{page}</div>
                <div style={{ color:c.muted, fontSize:11.5, marginTop:3 }}>{name} 👋</div>
              </div>
            </div>

            {/* right */}
            <div style={{ display:"flex", alignItems:"center", gap:8 }}>
              <Tooltip title={dark ? "Tünd rejim" : "Açıq rejim"}>
                <Button type="text" className="h-btn" onClick={() => setDark(!dark)}
                  icon={dark ? <SunOutlined style={{ fontSize:14 }} /> : <MoonOutlined style={{ fontSize:14 }} />} />
              </Tooltip>
              <div style={{ position:"relative", cursor:"pointer", marginLeft:2 }} onClick={() => navigate("/profile")}>
                <Avatar size={34} className="av" style={{ fontSize:13 }}>{letter}</Avatar>
                <span style={{ position:"absolute", bottom:0, right:0, width:7, height:7, borderRadius:"50%", background:"#22c55e", border:`2px solid ${c.header}` }} />
              </div>
            </div>
          </Header>

          {/* ── Content ── */}
          <Content style={{ background:c.bg, padding: mobile ? "12px 10px" : "20px", minHeight:"calc(100vh - 64px)" }}>
            <div className="fu" style={{
              background:c.card, borderRadius:16, border:`1px solid ${c.border}`,
              padding: mobile ? "14px" : "24px",
              minHeight:"calc(100vh - 108px)",
              boxShadow: dk ? "0 4px 24px rgba(0,0,0,.35)" : "0 2px 16px rgba(0,0,0,.06)",
            }}>
              <Outlet />
            </div>
          </Content>
        </Layout>
      </Layout>
    </>
  );
}