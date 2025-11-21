"use client";

import React from "react";
import Link from "next/link";
import { Layout, Row, Col, Typography, Space, Input, Button, Divider, Grid } from "antd";
import {
    FacebookFilled,
    LinkedinFilled,
    TwitterSquareFilled,
    YoutubeFilled,
    SendOutlined,
    MailOutlined,
    PhoneOutlined,
    EnvironmentOutlined
} from "@ant-design/icons";

const { Footer } = Layout;
const { Title, Text } = Typography;
const { useBreakpoint } = Grid;

export default function LandingFooter() {
    const screens = useBreakpoint();

    const footerBg = '#002c1b';
    // SỬA: Dùng màu xám sáng (Gray-200) thay vì rgba để contrast tốt nhất
    const footerText = '#e5e7eb';
    const footerTitle = '#ffffff';

    return (
        <Footer
            style={{
                backgroundColor: footerBg,
                color: footerText,
                padding: '64px 24px 24px',
                fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial'
            }}
        >
            <div style={{ maxWidth: 1200, margin: '0 auto' }}>
                <Row gutter={[48, 48]}>
                    {/* CỘT 1 */}
                    <Col xs={24} lg={8}>
                        <div style={{ marginBottom: 24 }}>
                            <Space align="center" size={8}>
                                <span style={{ fontSize: 32 }}>🌱</span>
                                <Title level={3} style={{ color: 'white', margin: 0, letterSpacing: '-0.5px' }}>
                                    Agritech
                                </Title>
                            </Space>
                        </div>
                        <Text style={{ color: footerText, display: 'block', marginBottom: 24, lineHeight: 1.6 }}>
                            Nền tảng công nghệ cao giúp tối ưu hóa quy trình sản xuất nông nghiệp, mang lại giá trị bền vững.
                        </Text>

                        <Space direction="vertical" size="middle" style={{ color: footerText }}>
                            <Space>
                                <EnvironmentOutlined aria-hidden="true" />
                                <span>Tòa nhà TechPark, Q. Cầu Giấy, Hà Nội</span>
                            </Space>
                            <Space>
                                <PhoneOutlined aria-hidden="true" />
                                <span>(84) 24 3333 8888</span>
                            </Space>
                            <Space>
                                <MailOutlined aria-hidden="true" />
                                <span>contact@agritech.vn</span>
                            </Space>
                        </Space>
                    </Col>

                    {/* CỘT 2 */}
                    <Col xs={12} sm={8} lg={4}>
                        <Title level={4} style={{ color: footerTitle, marginBottom: 24, fontSize: 18 }}>SẢN PHẨM</Title>
                        <Space direction="vertical" size="middle">
                            <FooterLink href="#">Phân tích IoT</FooterLink>
                            <FooterLink href="#">Quản lý nông trại</FooterLink>
                            <FooterLink href="#">Truy xuất nguồn gốc</FooterLink>
                            <FooterLink href="#">Sàn thương mại</FooterLink>
                        </Space>
                    </Col>

                    {/* CỘT 3 */}
                    <Col xs={12} sm={8} lg={4}>
                        <Title level={4} style={{ color: footerTitle, marginBottom: 24, fontSize: 18 }}>CÔNG TY</Title>
                        <Space direction="vertical" size="middle">
                            <FooterLink href="#">Câu chuyện</FooterLink>
                            <FooterLink href="#">Đội ngũ</FooterLink>
                            <FooterLink href="#">Tuyển dụng</FooterLink>
                            <FooterLink href="#">Đối tác</FooterLink>
                            <FooterLink href="#">Liên hệ</FooterLink>
                        </Space>
                    </Col>

                    {/* CỘT 4 */}
                    <Col xs={24} sm={8} lg={8}>
                        <Title level={4} style={{ color: footerTitle, marginBottom: 24, fontSize: 18 }}>ĐĂNG KÝ NHẬN TIN</Title>
                        <Text style={{ color: footerText, display: 'block', marginBottom: 16 }}>
                            Nhận những cập nhật mới nhất và ưu đãi độc quyền.
                        </Text>
                        <Space.Compact style={{ width: '100%', maxWidth: 300 }}>
                            <Input
                                placeholder="Email của bạn"
                                size="large"
                                style={{ borderRadius: '6px 0 0 6px' }}
                                aria-label="Nhập email đăng ký"
                            />
                            <Button
                                type="primary"
                                size="large"
                                icon={<SendOutlined aria-hidden="true" />}
                                style={{
                                    borderRadius: '0 6px 6px 0',
                                    color: '#fff' // Ép màu chữ trắng cho nút Gửi
                                }}
                                aria-label="Gửi đăng ký"
                            >
                                Gửi
                            </Button>
                        </Space.Compact>

                        <div style={{ marginTop: 32 }}>
                            <Space size="large">
                                <SocialIcon icon={<FacebookFilled aria-hidden="true" />} label="Facebook" />
                                <SocialIcon icon={<LinkedinFilled aria-hidden="true" />} label="LinkedIn" />
                                <SocialIcon icon={<TwitterSquareFilled aria-hidden="true" />} label="Twitter" />
                                <SocialIcon icon={<YoutubeFilled aria-hidden="true" />} label="Youtube" />
                            </Space>
                        </div>
                    </Col>
                </Row>

                <Divider style={{ borderColor: 'rgba(255,255,255,0.15)', margin: '48px 0 24px' }} />

                <Row justify="space-between" align="middle" gutter={[16, 16]}>
                    <Col xs={24} md={12} style={{ textAlign: screens.md ? 'left' : 'center' }}>
                        <Text style={{ color: 'rgba(255,255,255,0.65)', fontSize: 14 }}>
                            © {new Date().getFullYear()} Agritech Inc. Bảo lưu mọi quyền.
                        </Text>
                    </Col>
                    <Col xs={24} md={12} style={{ textAlign: screens.md ? 'right' : 'center' }}>
                        <Space size="large" split={<Divider type="vertical" style={{ borderColor: 'rgba(255,255,255,0.3)' }} />}>
                            <FooterLink href="#" small>Điều khoản</FooterLink>
                            <FooterLink href="#" small>Bảo mật</FooterLink>
                            <FooterLink href="#" small>Cookie</FooterLink>
                        </Space>
                    </Col>
                </Row>
            </div>
        </Footer>
    );
}

// Helper Components
const FooterLink = ({ href, children, small }: { href: string, children: React.ReactNode, small?: boolean }) => (
    <Link href={href} style={{ textDecoration: 'none' }}>
        <Text
            style={{
                color: '#d1d5db', // Gray-300 (Sáng hơn một chút cho link)
                fontSize: small ? 14 : 16,
                transition: 'color 0.3s',
                display: 'block'
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = '#4ade80'}
            onMouseLeave={(e) => e.currentTarget.style.color = '#d1d5db'}
        >
            {children}
        </Text>
    </Link>
);

const SocialIcon = ({ icon, label }: { icon: React.ReactNode, label: string }) => (
    <div
        role="button"
        aria-label={label}
        style={{
            fontSize: 24,
            color: 'rgba(255,255,255,0.9)',
            cursor: 'pointer',
            transition: 'all 0.3s'
        }}
        onMouseEnter={(e) => {
            e.currentTarget.style.color = '#16a34a';
            e.currentTarget.style.transform = 'translateY(-3px)';
        }}
        onMouseLeave={(e) => {
            e.currentTarget.style.color = 'rgba(255,255,255,0.9)';
            e.currentTarget.style.transform = 'translateY(0)';
        }}
    >
        {icon}
    </div>
);