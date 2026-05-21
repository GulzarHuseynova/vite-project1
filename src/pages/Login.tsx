import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthService } from "../services/AuthService";
import type { LoginForm } from "../types/Login.type";
import type { RegisterForm } from "../types/Register.type";
import { Button, Form, Input, Typography, message } from "antd";

import {
  LockOutlined,
  MailOutlined,
  EyeInvisibleOutlined,
  EyeTwoTone,
  SafetyCertificateOutlined,
  UserOutlined,
} from "@ant-design/icons";

interface Props {
  onLoginSuccess: () => void;
}

interface ApiErrorResponse {
  message?: string | string[];
  error?: string;
  title?: string;
}

const { Title, Text } = Typography;

export default function LoginPage({ onLoginSuccess }: Props) {
  const [loading, setLoading] = useState(false);
  const [view, setView] = useState<"login" | "register">("login");
  const [messageApi, contextHolder] = message.useMessage();

  const navigate = useNavigate();

  const getErrorMessage = (error: unknown, fallback: string) => {
    if (!axios.isAxiosError<ApiErrorResponse>(error)) {
      return fallback;
    }

    const apiError =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.response?.data?.title;

    if (Array.isArray(apiError)) {
      return apiError.join(", ");
    }

    if (typeof apiError === "string" && apiError.trim()) {
      return apiError;
    }

    return fallback;
  };

  const handleLogin = async (values: LoginForm) => {
    setLoading(true);

    try {
      const response = await AuthService.login(values);
      const data = response.data;

      const accessToken =
        data?.accessToken ||
        data?.data?.accessToken ||
        data?.result?.accessToken;

      const refreshToken =
        data?.refreshToken ||
        data?.data?.refreshToken ||
        data?.result?.refreshToken;

      if (!accessToken) {
        messageApi.error("Email və ya şifrə yanlışdır!");
        return;
      }

      localStorage.setItem("accessToken", accessToken);

      if (refreshToken) {
        localStorage.setItem("refreshToken", refreshToken);
      }

      try {
        const profileResponse = await AuthService.getProfile();

        const user =
          profileResponse?.data?.user ||
          profileResponse?.data?.data ||
          profileResponse?.data;

        if (user) {
          localStorage.setItem("user", JSON.stringify(user));
        }
      } catch {
        messageApi.warning("Profil məlumatı yüklənmədi.");
      }

      messageApi.success("Uğurla daxil oldunuz!");
      onLoginSuccess();
    } catch (error: unknown) {
      messageApi.error(
        getErrorMessage(error, "Email və ya şifrə yanlışdır!")
      );
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (values: RegisterForm) => {
    setLoading(true);

    try {
      await AuthService.register(values);

      messageApi.success(
        "Qeydiyyat uğurludur! OTP Telegram botuna göndərildi."
      );

      navigate("/verify", {
        state: { email: values.email },
      });
    } catch (error: unknown) {
      messageApi.error(
        getErrorMessage(error, "Qeydiyyat zamanı xəta baş verdi!")
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {contextHolder}

      <div className="min-h-screen .bg-gradient-to-br from-slate-100 via-slate-50 to-slate-200 flex items-center justify-center p-4 overflow-hidden relative">
        <div className="absolute top-0 left-0 w-96 h-96 bg-slate-300/20 blur-[120px] rounded-full" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-slate-400/20 blur-[120px] rounded-full" />

        <div className="relative w-full max-w-7xl bg-white/80 backdrop-blur-xl border border-white rounded-2rem shadow-[0_20px_80px_rgba(0,0,0,0.12)] overflow-hidden grid lg:grid-cols-2">
          <div className="hidden lg:flex relative bg-slate-900 text-white p-14 flex-col justify-between overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.2),transparent_35%)]" />

            <div className="relative z-10">
              <span className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/10 border border-white/20 backdrop-blur-sm text-sm">
                <SafetyCertificateOutlined />
                Təhlükəsiz Giriş
              </span>

              <Title
                level={1}
                className="text-white! mt-10! mb-6! text-6xl! leading-tight!"
              >
                Yenidən <br />
                Xoş Gəlmisiniz.
              </Title>

              <div className="mt-10 grid grid-cols-2 gap-5">
                <div className="bg-white/10 rounded-2xl border border-white/10 p-5 backdrop-blur-md">
                  <h3 className="text-3xl font-bold">99.9%</h3>
                  <p className="text-slate-300 text-sm mt-1">
                    Təhlükəsizlik Qoruması
                  </p>
                </div>

                <div className="bg-white/10 rounded-2xl border border-white/10 p-5 backdrop-blur-md">
                  <h3 className="text-3xl font-bold">24/7</h3>
                  <p className="text-slate-300 text-sm mt-1">
                    Sistem Nəzarəti
                  </p>
                </div>
              </div>
            </div>

            <div className="relative z-10 bg-white/10 border border-white/20 rounded-2xl p-6 backdrop-blur-md flex gap-4 items-start">
              <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center text-2xl shrink-0">
                🔐
              </div>

              <div>
                <h3 className="font-semibold text-lg">
                  Minlərlə istifadəçinin etibarı
                </h3>
                <p className="text-slate-300 text-sm mt-1 leading-6">
                  Müasir veb tətbiqləri üçün gözəl və təhlükəsiz autentifikasiya
                  interfeysi.
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center p-8 md:p-14 bg-white/70 backdrop-blur-xl">
            <div className="w-full max-w-md">
              {view === "login" ? (
                <>
                  <div className="mb-8 text-center lg:text-left">
                    <Title
                      level={2}
                      className="mb-2! text-slate-900! text-4xl!"
                    >
                      Daxil Ol
                    </Title>
                    <Text className="text-slate-500! !text-base!">
                      Davam etmək üçün məlumatlarınızı daxil edin.
                    </Text>
                  </div>

                  <Form
                    layout="vertical"
                    size="large"
                    onFinish={handleLogin}
                    autoComplete="off"
                  >
                    <Form.Item
                      label="E-poçt Ünvanı"
                      name="email"
                      rules={[
                        {
                          required: true,
                          message: "Zəhmət olmasa e-poçtunuzu daxil edin!",
                        },
                        {
                          type: "email",
                          message: "E-poçt formatı yanlışdır!",
                        },
                      ]}
                    >
                      <Input
                        prefix={<MailOutlined />}
                        placeholder="example@gmail.com"
                        className="rounded-2xl h-14!"
                      />
                    </Form.Item>

                    <Form.Item
                      label="Şifrə"
                      name="password"
                      rules={[
                        {
                          required: true,
                          message: "Zəhmət olmasa şifrənizi daxil edin!",
                        },
                        {
                          min: 6,
                          message: "Şifrə minimum 6 simvol olmalıdır!",
                        },
                      ]}
                    >
                      <Input.Password
                        prefix={<LockOutlined />}
                        iconRender={(visible) =>
                          visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                        }
                        placeholder="Şifrənizi daxil edin"
                        className="rounded-2xl h-14!"
                      />
                    </Form.Item>

                    <Button
                      htmlType="submit"
                      type="primary"
                      block
                      loading={loading}
                      size="large"
                      className="h-14! rounded-2xl! font-semibold!"
                    >
                      Daxil Ol
                    </Button>
                  </Form>

                  <div className="mt-8 text-center">
                    <Text className="text-slate-500! text-base!">
                      Hesabınız yoxdur?{" "}
                      <span
                        className="font-semibold text-slate-900 cursor-pointer hover:underline"
                        onClick={() => setView("register")}
                      >
                        Hesab Yarat
                      </span>
                    </Text>
                  </div>
                </>
              ) : (
                <>
                  <div className="mb-8 text-center lg:text-left">
                    <Title
                      level={2}
                      className="mb-2! !text-slate-900! text-4xl!"
                    >
                      Hesab Yarat
                    </Title>
                    <Text className="text-slate-500! !text-base!">
                      Başlamaq üçün qeydiyyatdan keçin. Təsdiq kodu Telegram-a
                      göndəriləcək.
                    </Text>
                  </div>

                  <Form
                    layout="vertical"
                    size="large"
                    onFinish={handleRegister}
                    autoComplete="off"
                  >
                    <Form.Item
                      label="Ad"
                      name="firstName"
                      rules={[
                        {
                          required: true,
                          message: "Zəhmət olmasa adınızı daxil edin!",
                        },
                      ]}
                    >
                      <Input
                        prefix={<UserOutlined />}
                        placeholder="Ad"
                        className="rounded-2xl h-14!"
                      />
                    </Form.Item>

                    <Form.Item
                      label="Soyad"
                      name="lastName"
                      rules={[
                        {
                          required: true,
                          message: "Zəhmət olmasa soyadınızı daxil edin!",
                        },
                      ]}
                    >
                      <Input
                        prefix={<UserOutlined />}
                        placeholder="Soyad"
                        className="rounded-2xl h-14!"
                      />
                    </Form.Item>

                    <Form.Item
                      label="E-poçt Ünvanı"
                      name="email"
                      rules={[
                        {
                          required: true,
                          message: "Zəhmət olmasa e-poçtunuzu daxil edin!",
                        },
                        {
                          type: "email",
                          message: "E-poçt formatı yanlışdır!",
                        },
                      ]}
                    >
                      <Input
                        prefix={<MailOutlined />}
                        placeholder="example@gmail.com"
                        className="rounded-2xl h-14!"
                      />
                    </Form.Item>

                    <Form.Item
                      label="Şifrə"
                      name="password"
                      rules={[
                        {
                          required: true,
                          message: "Zəhmət olmasa şifrənizi daxil edin!",
                        },
                        {
                          min: 6,
                          message: "Şifrə minimum 6 simvol olmalıdır!",
                        },
                      ]}
                    >
                      <Input.Password
                        prefix={<LockOutlined />}
                        iconRender={(visible) =>
                          visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                        }
                        placeholder="Şifrənizi daxil edin"
                        className="rounded-2xl h-14!"
                      />
                    </Form.Item>

                    <Button
                      htmlType="submit"
                      type="primary"
                      block
                      loading={loading}
                      size="large"
                      className="h-14! rounded-2xl! font-semibold!"
                    >
                      Hesab Yarat
                    </Button>
                  </Form>

                  <div className="mt-8 text-center">
                    <Text className="text-slate-500! text-base!">
                      Artıq hesabınız var?{" "}
                      <span
                        className="font-semibold text-slate-900 cursor-pointer hover:underline"
                        onClick={() => setView("login")}
                      >
                        Daxil Ol
                      </span>
                    </Text>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}