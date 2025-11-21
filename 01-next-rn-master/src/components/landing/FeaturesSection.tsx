"use client";

import React from "react";
import { Card, Col, Row, Typography, theme } from "antd";
import {
    CloudOutlined,
    ThunderboltOutlined,
    SmileOutlined,
    ArrowRightOutlined
} from "@ant-design/icons";

const { Title, Paragraph, Text } = Typography;

const features = [
    {
        id: 1,
        icon: <CloudOutlined />,
        title: "Phân tích thời tiết",
        desc: "Cập nhật dữ liệu vi khí hậu theo thời gian thực, dự báo chính xác giúp nông dân chủ động kế hoạch gieo trồng.",
    },
    {
        id: 2,
        icon: <ThunderboltOutlined />,
        title: "Tự động hóa IoT",
        desc: "Hệ thống cảm biến thông minh tự động điều chỉnh tưới tiêu và bón phân, tối ưu hóa chi phí vận hành.",
    },
    {
        id: 3,
        icon: <SmileOutlined />,
        title: "Dashboard trực quan",
        desc: "Báo cáo số liệu được đơn giản hóa bằng biểu đồ, giúp ra quyết định canh tác nhanh chóng và chính xác.",
    },
];

export default function FeaturesSection() {
    const { token } = theme.useToken();

    return (
        <section
            id="features"
            aria-labelledby="features-heading"
            style={{
                padding: '100px 24px',
                backgroundColor: token.colorBgContainer,
                scrollMarginTop: '80px'
            }}
        >
            <div style={{ maxWidth: 1200, margin: '0 auto' }}>
                {/* HEADER SECTION */}
                <div style={{ textAlign: 'center', marginBottom: '64px', maxWidth: 700, margin: '0 auto 64px auto' }}>
                    <Title level={2} style={{ color: token.colorPrimary, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 8 }}>
                        Giải pháp công nghệ
                    </Title>
                    <Title level={2} id="features-heading" style={{ marginTop: 0, marginBottom: 16, fontSize: '36px' }}>
                        Nông nghiệp thông minh 4.0
                    </Title>
                    <Paragraph style={{ fontSize: '18px', lineHeight: 1.6, color: token.colorText }}>
                        Chúng tôi mang đến bộ công cụ toàn diện giúp chuyển đổi số quy trình canh tác truyền thống.
                    </Paragraph>
                </div>

                <Row gutter={[32, 32]}>
                    {features.map((f) => (
                        <Col xs={24} md={8} key={f.id}>
                            <article style={{ height: '100%' }}>
                                <Card
                                    hoverable
                                    bordered={false}
                                    style={{
                                        height: '100%',
                                        borderRadius: '16px',
                                        transition: 'all 0.3s ease',
                                        overflow: 'hidden'
                                    }}
                                    styles={{
                                        body: {
                                            padding: '40px 32px',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'flex-start',
                                            height: '100%'
                                        }
                                    }}
                                >
                                    {/* ICON WRAPPER */}
                                    <div
                                        aria-hidden="true"
                                        style={{
                                            width: 64,
                                            height: 64,
                                            borderRadius: '50%',
                                            backgroundColor: token.colorSuccessBg,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            marginBottom: 24,
                                            color: token.colorSuccess
                                        }}
                                    >
                                        {React.cloneElement(f.icon as React.ReactElement, {
                                            style: { fontSize: '28px' }
                                        })}
                                    </div>

                                    <Title level={3} style={{ marginBottom: 12, fontSize: '20px' }}>
                                        {f.title}
                                    </Title>

                                    <Paragraph style={{ fontSize: '16px', lineHeight: 1.6, flex: 1, marginBottom: 24, color: token.colorText }}>
                                        {f.desc}
                                    </Paragraph>

                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: token.colorPrimary, fontWeight: 600 }}>
                                        <Text strong style={{ color: token.colorPrimary, cursor: 'pointer' }}>Tìm hiểu thêm</Text>
                                        <ArrowRightOutlined aria-hidden="true" style={{ fontSize: 12 }} />
                                    </div>
                                </Card>
                            </article>
                        </Col>
                    ))}
                </Row>
            </div>
        </section>
    );
}