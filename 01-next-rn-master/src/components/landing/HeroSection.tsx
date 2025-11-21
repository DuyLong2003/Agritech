"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Button, Typography, theme, Grid, Space } from "antd";
import {
    ArrowRightOutlined,
    InfoCircleOutlined,
    CheckCircleFilled
} from "@ant-design/icons";

import farmHeroImg from "../../assets/farm-smart.jpg"

const { Title, Paragraph, Text } = Typography;
const { useBreakpoint } = Grid;

export default function HeroSection() {
    const { token } = theme.useToken();
    const screens = useBreakpoint();

    // SỬA: Dùng màu xanh đậm mới (#116a38) thay vì màu cũ
    const brandColor = token.colorPrimary;

    return (
        <section
            style={{
                position: 'relative',
                overflow: 'hidden',
                background: token.colorBgLayout,
                padding: screens.md ? '120px 24px 100px' : '80px 16px 60px',
            }}
        >
            <style jsx global>{`
                @keyframes fadeInUp {
                    from { opacity: 0; transform: translateY(30px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in-up {
                    animation: fadeInUp 0.8s ease-out forwards;
                    opacity: 0;
                }
                .delay-100 { animation-delay: 0.1s; }
                .delay-200 { animation-delay: 0.2s; }
                .delay-300 { animation-delay: 0.3s; }
                .delay-500 { animation-delay: 0.5s; }
            `}</style>

            {/* BACKGROUND ACCENT */}
            <div
                aria-hidden="true"
                style={{
                    position: 'absolute',
                    top: -100,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '800px',
                    height: '600px',
                    // Giảm opacity gradient một chút để không làm lóa chữ
                    background: 'radial-gradient(circle, rgba(22, 163, 74, 0.1) 0%, rgba(255,255,255,0) 70%)',
                    filter: 'blur(60px)',
                    zIndex: 0,
                    pointerEvents: 'none'
                }}
            />

            <div style={{ position: 'relative', zIndex: 1, maxWidth: 1200, margin: '0 auto', textAlign: 'center' }}>

                {/* HEADLINE */}
                <div className="animate-fade-in-up">
                    <Title
                        level={1}
                        style={{
                            fontSize: screens.md ? '64px' : '36px',
                            fontWeight: 800,
                            lineHeight: 1.1,
                            marginBottom: 24,
                            color: token.colorTextHeading,
                            letterSpacing: '-1px'
                        }}
                    >
                        Giải pháp <span style={{ color: brandColor }}>nông nghiệp thông minh</span>
                        <br />
                        <span style={{ display: 'block', marginTop: screens.md ? 16 : 8 }}>
                            ứng dụng công nghệ cao
                        </span>
                    </Title>
                </div>

                {/* SUBTITLE */}
                <div className="animate-fade-in-up delay-100">
                    <Paragraph
                        style={{
                            fontSize: screens.md ? '20px' : '16px',
                            color: token.colorTextSecondary, // Đã được làm đậm ở theme config
                            maxWidth: 700,
                            margin: '0 auto 40px',
                            lineHeight: 1.6
                        }}
                    >
                        Agritech mang đến nền tảng kết nối nông dân, doanh nghiệp và nhà quản lý — hướng đến nền nông nghiệp{' '}
                        <Text strong style={{ color: '#15803d', fontSize: '20px' }}>bền vững</Text>,{' '}
                        <Text strong style={{ color: '#15803d', fontSize: '20px' }}>hiệu quả</Text> và{' '}
                        <Text strong style={{ color: '#15803d', fontSize: '20px' }}>hiện đại</Text>.
                    </Paragraph>
                </div>

                {/* CTA BUTTONS */}
                <div className="animate-fade-in-up delay-200">
                    <Space size="middle" wrap style={{ justifyContent: 'center', marginBottom: 64 }}>
                        <Link href="/auth/register">
                            <Button
                                type="primary"
                                size="large"
                                shape="round"
                                icon={<ArrowRightOutlined />}
                                style={{
                                    height: 56,
                                    padding: '0 32px',
                                    fontSize: '18px',
                                    fontWeight: 600,
                                    // Tự động dùng màu primary mới
                                    boxShadow: '0 8px 20px rgba(17, 106, 56, 0.25)'
                                }}
                            >
                                Bắt đầu ngay
                            </Button>
                        </Link>

                        <Link href="#features">
                            <Button
                                size="large"
                                shape="round"
                                icon={<InfoCircleOutlined />}
                                style={{
                                    height: 56,
                                    padding: '0 32px',
                                    fontSize: '18px',
                                    fontWeight: 600,
                                    color: brandColor,      // Màu chữ xanh đậm
                                    borderColor: brandColor, // Viền xanh đậm
                                }}
                                className="hover:bg-green-50"
                            >
                                Tìm hiểu thêm
                            </Button>
                        </Link>
                    </Space>
                </div>

                {/* HERO IMAGE */}
                <div
                    className="animate-fade-in-up delay-300"
                    style={{ position: 'relative', display: 'inline-block', width: '100%' }}
                >
                    <div
                        style={{
                            padding: 8,
                            background: 'rgba(255,255,255,0.6)',
                            borderRadius: 24,
                            backdropFilter: 'blur(10px)',
                            boxShadow: '0 20px 50px -10px rgba(0,0,0,0.15)',
                            maxWidth: '40%',
                            margin: '0 auto'
                        }}
                    >
                        <Image
                            src={farmHeroImg}
                            alt="Mô hình nông nghiệp thông minh Agritech"
                            priority
                            placeholder="blur"
                            style={{
                                width: '100%',
                                height: 'auto',
                                borderRadius: 16,
                                display: 'block'
                            }}
                        />
                    </div>

                    {/* FLOATING BADGE */}
                    <div
                        className="animate-fade-in-up delay-500"
                        style={{
                            position: 'absolute',
                            bottom: screens.md ? -25 : -15,
                            left: '50%',
                            transform: 'translateX(-50%)',
                            zIndex: 2,
                            width: 'max-content'
                        }}
                    >
                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 10,
                                backgroundColor: 'rgba(255, 255, 255, 0.98)', // Tăng độ đục nền để dễ đọc
                                padding: '12px 24px',
                                borderRadius: 50,
                                boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
                                border: '1px solid rgba(22, 163, 74, 0.2)',
                            }}
                        >
                            <CheckCircleFilled style={{ color: brandColor, fontSize: 20 }} />
                            <Text strong style={{ color: '#064e3b', fontSize: 16 }}>
                                Hơn 1.000+ nông trại tin dùng
                            </Text>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}