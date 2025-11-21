// 'use client'
// import { AdminContext } from '@/library/admin.context';
// import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
// import { Button, Layout } from 'antd';
// import { useContext } from 'react';
// import { DownOutlined, SmileOutlined } from '@ant-design/icons';
// import type { MenuProps } from 'antd';
// import { Dropdown, Space } from 'antd';
// import { useSession } from "next-auth/react"
// import { signOut } from "next-auth/react"

// const AdminHeader = (props: any) => {
//     // const { data: session, status } = useSession();
//     const { session } = props;

//     const { Header } = Layout;
//     const { collapseMenu, setCollapseMenu } = useContext(AdminContext)!;

//     const items: MenuProps['items'] = [
//         {
//             key: '1',
//             label: (
//                 <span>
//                     Settings
//                 </span>
//             ),
//         },

//         {
//             key: '4',
//             danger: true,
//             label: <span onClick={() => signOut()}>Đăng xuất</span>,
//         },
//     ];

//     return (
//         <>
//             <Header
//                 style={{
//                     padding: 0,
//                     display: "flex",
//                     background: "#f5f5f5",
//                     justifyContent: "space-between",
//                     alignItems: "center"
//                 }} >

//                 <Button
//                     type="text"
//                     icon={collapseMenu ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
//                     onClick={() => setCollapseMenu(!collapseMenu)}
//                     style={{
//                         fontSize: '16px',
//                         width: 64,
//                         height: 64,
//                     }}
//                 />
//                 <Dropdown menu={{ items }} >
//                     <a onClick={(e) => e.preventDefault()}
//                         style={{ color: "unset", lineHeight: "0 !important", marginRight: 20 }}
//                     >
//                         <Space>
//                             Welcome {session?.user?.email ?? ""}
//                             <DownOutlined />
//                         </Space>
//                     </a>
//                 </Dropdown>
//             </Header>
//         </>
//     )
// }

// export default AdminHeader;


'use client';

import React from 'react';
import { Layout, Button, Dropdown, Avatar, Space, theme, Breadcrumb } from 'antd';
import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    UserOutlined,
    LogoutOutlined,
    SettingOutlined
} from '@ant-design/icons';
import { signOut } from 'next-auth/react';

const { Header } = Layout;

interface AdminHeaderProps {
    collapsed: boolean;
    setCollapsed: (collapsed: boolean) => void;
    session: any;
}

export default function AdminHeader({ collapsed, setCollapsed, session }: AdminHeaderProps) {
    const { token } = theme.useToken();

    const handleLogout = () => {
        signOut({ callbackUrl: '/' });
    };

    const userMenuItems = [
        {
            key: 'profile',
            label: 'Hồ sơ cá nhân',
            icon: <UserOutlined />,
        },
        {
            key: 'settings',
            label: 'Cài đặt',
            icon: <SettingOutlined />,
        },
        {
            type: 'divider' as const,
        },
        {
            key: 'logout',
            label: 'Đăng xuất',
            icon: <LogoutOutlined />,
            danger: true,
            onClick: handleLogout
        },
    ];

    return (
        <Header
            style={{
                padding: '0 24px',
                background: token.colorBgContainer,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                position: 'sticky',
                top: 0,
                zIndex: 1000,
                boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
            }}
        >
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <Button
                    type="text"
                    icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                    onClick={() => setCollapsed(!collapsed)}
                    style={{ fontSize: '16px', width: 64, height: 64, marginRight: 16 }}
                />
                <Breadcrumb
                    items={[{ title: 'Admin' }, { title: 'Dashboard' }]}
                    style={{ display: collapsed ? 'none' : 'block' }}
                />
            </div>

            <Dropdown menu={{ items: userMenuItems }} trigger={['click']}>
                <Space style={{ cursor: 'pointer' }}>
                    <Avatar
                        style={{ backgroundColor: token.colorPrimary }}
                        icon={<UserOutlined />}
                        src={session?.user?.image}
                    >
                        {session?.user?.name?.charAt(0)?.toUpperCase()}
                    </Avatar>
                    <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.2 }}>
                        <span style={{ fontWeight: 600 }}>{session?.user?.name || 'Admin'}</span>
                        <span style={{ fontSize: 11, color: token.colorTextSecondary }}>{session?.user?.email}</span>
                    </div>
                </Space>
            </Dropdown>
        </Header>
    );
}