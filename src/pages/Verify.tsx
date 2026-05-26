import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AuthService } from "../services/AuthService";

import {
    Button,
    Form,
    Input,
    Typography,
} from "antd";
import {
    SafetyCertificateOutlined,
    NumberOutlined,
} from "@ant-design/icons";

import { AxiosError } from "axios";
import type { BackendErrorResponse } from "../types/Verify.type";

const { Title, Text } = Typography;

export default function VerifyPage() {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const location = useLocation();

    const email = location.state?.email ?? "";



const handleVerify = async (values: { code: string }): Promise<void> => {
    setLoading(true);

    try {
        const response = await AuthService.verifyEmail({
            email,
            code: values.code,
        });

        localStorage.setItem("token", response.data.accessToken);
        navigate("/home");

    } catch (err) {
        // err obyektini birbaşa AxiosError olaraq tanıadırıq
        const axiosError = err as AxiosError<BackendErrorResponse>;
        
        // İndi həm .response, həm də onun içindəki .data tam tiplidir
        console.log(axiosError.response?.data); 
        
        alert("Kod səhvdir!");
    } finally {
        setLoading(false);
    }
};

    return (
        <div className="min-h-screen .bg-gradient-to-br from-slate-100 via-slate-50 to-slate-200 flex items-center justify-center p-4 overflow-hidden relative">
            <div className="absolute top-0 left-0 w-96 h-96 bg-slate-300/20 blur-[120px] rounded-full" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-slate-400/20 blur-[120px] rounded-full" />

            <div className="relative w-full max-w-7xl bg-white/80 backdrop-blur-xl border border-white rounded-2rem shadow-[0_20px_80px_rgba(0,0,0,0.12)] overflow-hidden grid lg:grid-cols-2">
                {/* Left Side */}
                <div className="hidden lg:flex relative bg-slate-900 text-white p-14 flex-col justify-between overflow-hidden">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.2),transparent_35%)]" />

                    <div className="relative z-10">
                        <span className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/10 border border-white/20 backdrop-blur-sm text-sm">
                            <SafetyCertificateOutlined />
                            Secure Authentication
                        </span>

                        <Title
                            level={1}
                            className="text-white! mt-10! mb-6! text-6xl! leading-tight!"
                        >
                            Verify <br />
                            Your Code.
                        </Title>

                        <Text className="text-slate-300! text-lg! leading-8! block max-w-lg">
                            A verification code has been sent to your Telegram bot. Enter it below to complete registration.
                        </Text>

                        <div className="mt-10 grid grid-cols-2 gap-5">
                            <div className="bg-white/10 rounded-1.5rem border border-white/10 p-5 backdrop-blur-md">
                                <h3 className="text-3xl font-bold">99.9%</h3>
                                <p className="text-slate-300 text-sm mt-1">
                                    Security Protection
                                </p>
                            </div>

                            <div className="bg-white/10 rounded-1.5rem border border-white/10 p-5 backdrop-blur-md">
                                <h3 className="text-3xl font-bold">24/7</h3>
                                <p className="text-slate-300 text-sm mt-1">
                                    System Monitoring
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="relative z-10 bg-white/10 border border-white/20 rounded-2rem p-6 backdrop-blur-md flex gap-4 items-start">
                        <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center text-2xl shrink-0">
                            🔐
                        </div>

                        <div>
                            <h3 className="font-semibold text-lg">
                                Trusted by thousands
                            </h3>
                            <p className="text-slate-300 text-sm mt-1 leading-6">
                                A beautiful and secure authentication interface for modern web apps.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Right Side */}
                <div className="flex items-center justify-center p-8 md:p-14 bg-white/70 backdrop-blur-xl">
                    <div className="w-full max-w-md">
                        <div className="mb-8 text-center lg:text-left">
                            <Title level={2} className="mb-2! text-slate-900! text-4xl!">
                                Enter Code
                            </Title>
                            <Text className="text-slate-500! text-base">
                                Check your Telegram bot and enter the verification code sent to{' '}
                                <span className="font-semibold text-slate-900">{email}</span>
                            </Text>
                        </div>

                        <Form
                            layout="vertical"
                            size="large"
                            onFinish={handleVerify}
                        >
                            <Form.Item
                                label="Verification Code"
                                name="code"
                                rules={[
                                    {
                                        required: true,
                                        message: "Please enter the verification code!",
                                    },
                                ]}
                            >
                                <Input
                                    prefix={<NumberOutlined />}
                                    placeholder="Enter code from Telegram"
                                    className="rounded-2xl1 h-14!"
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
                                Verify
                            </Button>
                        </Form>

                        <div className="mt-8 text-center">
                            <Text className="text-slate-500! text-base">
                                Want to go back?{' '}
                                <span
                                    className="font-semibold text-slate-900 cursor-pointer hover:underline"
                                    onClick={() => navigate('/')}
                                >
                                    Sign In
                                </span>
                            </Text>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
