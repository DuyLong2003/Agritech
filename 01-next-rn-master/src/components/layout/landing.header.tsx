'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';
import {
    Layout,
    Button,
    Dropdown,
    Avatar,
    MenuProps,
    Space,
    Typography,
    Flex,
    theme,
    Grid,
    Skeleton
} from 'antd';
import {
    LogoutOutlined,
    UserOutlined,
    DashboardOutlined,
    DownOutlined,
    LoginOutlined
} from '@ant-design/icons';

const { Header } = Layout;
const { Text, Title } = Typography;
const { useBreakpoint } = Grid;

export default function LandingHeader() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const screens = useBreakpoint(); // Hook để check màn hình (Mobile/PC)

    // Lấy token màu từ theme config để đồng bộ
    const {
        token: { colorBgContainer, colorBorderSecondary, colorPrimary },
    } = theme.useToken();

    const isLoading = status === "loading";

    // Xử lý đăng xuất
    const handleLogout = async () => {
        await signOut({ redirect: false });
        router.push('/');
        router.refresh();
    };

    // Menu Dropdown
    const userMenuItems: MenuProps['items'] = [
        {
            key: 'dashboard',
            label: <Link href="/dashboard">Vào Dashboard</Link>,
            icon: <DashboardOutlined />,
        },
        {
            type: 'divider',
        },
        {
            key: 'logout',
            label: 'Đăng xuất',
            icon: <LogoutOutlined />,
            danger: true,
            onClick: handleLogout,
        },
    ];

    // Style cho Link menu
    const navLinkStyle: React.CSSProperties = {
        color: 'rgba(0, 0, 0, 0.65)',
        fontWeight: 500,
        fontSize: '16px',
        textDecoration: 'none',
        cursor: 'pointer',
        transition: 'color 0.3s'
    };
    return (
        <Header
            style={{
                position: 'sticky',
                top: 0,
                zIndex: 1000,
                width: '100%',
                padding: '0 24px',
                background: colorBgContainer,
                borderBottom: `1px solid ${colorBorderSecondary}`,
                height: 72,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}
        >
            <div style={{ width: '100%', maxWidth: 1280 }}>
                <Flex justify="space-between" align="center">

                    {/* --- LOGO --- */}
                    <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ fontSize: 28 }}>🌱</span>
                        <Title level={4} style={{ margin: 0, color: '#16a34a', letterSpacing: '-0.5px' }}>
                            Agritech
                        </Title>
                    </Link>

                    {/* --- NAVIGATION (Chỉ hiện trên Desktop) --- */}
                    {/* screens.md = true khi màn hình >= 768px */}
                    {screens.md && (
                        <Space size="large">
                            <Link href="#features" style={navLinkStyle}>Tính năng</Link>
                            <Link href="#pricing" style={navLinkStyle}>Bảng giá</Link>
                            <Link href="#contact" style={navLinkStyle}>Liên hệ</Link>
                        </Space>
                    )}

                    {/* --- AUTH ACTIONS --- */}
                    <Space>
                        {isLoading ? (
                            <Space>
                                <Skeleton.Avatar active size="default" shape="circle" />
                                <Skeleton.Button active size="default" shape="round" style={{ width: 80 }} />
                            </Space>
                        ) : session?.user ? (
                            // --- ĐÃ LOGIN ---
                            <Dropdown menu={{ items: userMenuItems }} trigger={['click']} placement="bottomRight">
                                <Space
                                    style={{
                                        cursor: 'pointer',
                                        padding: '6px 12px',
                                        borderRadius: 8,
                                        border: `1px solid transparent`,
                                    }}
                                    className="user-dropdown-trigger"
                                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.04)'}
                                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                                >
                                    <Avatar
                                        style={{ backgroundColor: '#16a34a' }}
                                        icon={<UserOutlined />}
                                        src={session.user.image}
                                    >
                                        {session.user.name?.charAt(0)?.toUpperCase()}
                                    </Avatar>

                                    {/* Ẩn tên user trên mobile cho gọn */}
                                    {screens.sm && (
                                        <Flex vertical align="flex-start" style={{ lineHeight: 1.2, marginLeft: 4 }}>
                                            <Text strong style={{ fontSize: 14 }}>
                                                {session.user.name || "Người dùng"}
                                            </Text>
                                            <Text style={{ fontSize: 11 }}>
                                                {session.user.email}
                                            </Text>
                                        </Flex>
                                    )}
                                    <DownOutlined style={{ fontSize: 10, color: '#999' }} />
                                </Space>
                            </Dropdown>
                        ) : (
                            // --- CHƯA LOGIN ---
                            <Space size="small">
                                <Link href="/auth/login">
                                    <Button type="text" size="large" style={{ color: '#555' }}>
                                        Đăng nhập
                                    </Button>
                                </Link>
                                <Link href="/auth/register">
                                    <Button
                                        type="primary"
                                        size="large"
                                        icon={<LoginOutlined />}
                                        style={{
                                            backgroundColor: '#16a34a',
                                            borderColor: '#16a34a',
                                            boxShadow: '0 2px 5px rgba(22, 163, 74, 0.2)'
                                        }}
                                    >
                                        Đăng ký
                                    </Button>
                                </Link>
                            </Space>
                        )}
                    </Space>
                </Flex>
            </div>
        </Header>
    );
}