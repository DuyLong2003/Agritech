"use client";

import React from "react";
import { Avatar, Card, Col, Rate, Row, Typography, theme } from "antd";
import { StarFilled, UserOutlined } from "@ant-design/icons";

const { Title, Paragraph, Text } = Typography;

// Dữ liệu mẫu (Giữ nguyên Data URI SVG của bạn vì nó nhẹ và tốt)
const testimonials = [
    {
        id: 1,
        quote: "Hệ thống IoT của AgriTech giúp tôi giảm 30% lượng nước tưới mà năng suất vẫn tăng. Rất đáng đầu tư!",
        name: "Anh Minh",
        title: "Chủ trang trại VinaFarm",
        avatar: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='64' height='64'><rect rx='32' width='64' height='64' fill='%2316a34a'/><text x='50%' y='55%' font-size='28' text-anchor='middle' fill='white' font-family='Arial' dy='.3em'>M</text></svg>",
        rating: 5
    },
    {
        id: 2,
        quote: "Phân tích dữ liệu giúp tôi tối ưu phân bón theo từng lô, chi phí giảm mà chất lượng tốt hơn trước.",
        name: "Cô Lan",
        title: "Quản lý Trang trại An Phát",
        avatar: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='64' height='64'><rect rx='32' width='64' height='64' fill='%2310b981'/><text x='50%' y='55%' font-size='28' text-anchor='middle' fill='white' font-family='Arial' dy='.3em'>L</text></svg>",
        rating: 5
    },
    {
        id: 3,
        quote: "Hệ thống cảnh báo sớm giúp phát hiện sâu bệnh kịp thời, nhờ đó giảm mất mát mùa vụ.",
        name: "Ông Hùng",
        title: "Chủ trang trại Hùng Thịnh",
        avatar: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='64' height='64'><rect rx='32' width='64' height='64' fill='%2314b8a6'/><text x='50%' y='55%' font-size='28' text-anchor='middle' fill='white' font-family='Arial' dy='.3em'>H</text></svg>",
        rating: 4
    },
];

export default function TestimonialsSection() {
    const { token } = theme.useToken();

    // Biến tấu màu nền một chút cho dịu mắt (Green-50 equivalent)
    const bgSection = '#f0fdf4';

    // Helper function để render sao thủ công (Fix lỗi Lighthouse)
    const renderStars = (rating: number) => {
        return (
            // role="img" và aria-label giúp Screen Reader đọc đúng: "Đánh giá 5 trên 5 sao"
            <div role="img" aria-label={`Đánh giá ${rating} trên 5 sao`} style={{ display: 'flex', gap: 4, marginBottom: 16 }}>
                {[...Array(5)].map((_, index) => (
                    <StarFilled
                        key={index}
                        style={{
                            fontSize: 14,
                            // Nếu index nhỏ hơn rating thì màu vàng, ngược lại màu xám nhạt
                            color: index < rating ? '#faad14' : '#f0f0f0'
                        }}
                    />
                ))}
            </div>
        );
    };

    return (
        <section
            id="testimonials"
            style={{
                padding: '100px 24px',
                background: token.colorBgLayout,
                scrollMarginTop: '80px'
            }}
        >
            <div style={{ maxWidth: 1200, margin: '0 auto', textAlign: 'center' }}>

                {/* --- HEADER --- */}
                <div style={{ marginBottom: 64 }}>
                    <Title level={2} style={{ color: token.colorPrimary, textTransform: 'uppercase', letterSpacing: '1px' }}>
                        Khách hàng nói gì
                    </Title>
                    <Title level={2} style={{ marginTop: 8, marginBottom: 16 }}>
                        Niềm tin từ những người nông dân
                    </Title>
                    <Paragraph type="secondary" style={{ fontSize: 16, maxWidth: 600, margin: '0 auto' }}>
                        Những câu chuyện thực tế từ các đối tác đã áp dụng thành công giải pháp công nghệ của Agritech.
                    </Paragraph>
                </div>

                {/* --- GRID --- */}
                <Row gutter={[32, 32]}>
                    {testimonials.map((t) => (
                        <Col xs={24} md={8} key={t.id}>
                            {/* Thẻ figure cho semantic A11y */}
                            <figure style={{ margin: 0, height: '100%' }}>
                                <Card
                                    hoverable
                                    bordered={false}
                                    style={{
                                        height: '100%',
                                        borderRadius: 16,
                                        textAlign: 'left',
                                        position: 'relative',
                                        overflow: 'hidden'
                                    }}
                                    styles={{
                                        body: {
                                            padding: 32,
                                            display: 'flex',
                                            flexDirection: 'column',
                                            height: '100%',
                                            justifyContent: 'space-between'
                                        }
                                    }}
                                >
                                    {/* Decorative Quote Icon (Dấu ngoặc kép mờ nền) */}
                                    <div
                                        aria-hidden="true"
                                        style={{
                                            position: 'absolute',
                                            top: 10,
                                            right: 20,
                                            fontSize: 100,
                                            fontFamily: 'serif',
                                            color: 'rgba(0,0,0,0.03)',
                                            lineHeight: 1,
                                            pointerEvents: 'none'
                                        }}
                                    >
                                        ”
                                    </div>

                                    {/* Nội dung chính */}
                                    <div>
                                        {/* Rating Stars */}
                                        {/* <Rate

                                            disabled
                                            defaultValue={t.rating}
                                            style={{ fontSize: 14, color: '#faad14', marginBottom: 16 }}
                                        /> */}

                                        {renderStars(t.rating)}

                                        <blockquote style={{ margin: 0 }}>
                                            <Paragraph
                                                style={{
                                                    fontSize: 16,
                                                    lineHeight: 1.6,
                                                    color: token.colorText,
                                                    fontStyle: 'italic',
                                                    marginBottom: 24
                                                }}
                                            >
                                                "{t.quote}"
                                            </Paragraph>
                                        </blockquote>
                                    </div>

                                    {/* Footer: Avatar & Info */}
                                    <figcaption style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                                        <Avatar
                                            alt="avatar"
                                            src={t.avatar}
                                            size={48}
                                            icon={<UserOutlined />}
                                            style={{ border: `2px solid ${token.colorBgContainer}` }}
                                        />
                                        <div>
                                            <Text strong style={{ display: 'block', fontSize: 16 }}>
                                                {t.name}
                                            </Text>
                                            <Text type="secondary" style={{ fontSize: 13 }}>
                                                {t.title}
                                            </Text>
                                        </div>
                                    </figcaption>
                                </Card>
                            </figure>
                        </Col>
                    ))}
                </Row>
            </div>
        </section>
    );
}