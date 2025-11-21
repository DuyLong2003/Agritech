// 'use client'
// import Layout from "antd/es/layout";
// import Menu from "antd/es/menu";
// import {
//     AppstoreOutlined,
//     CarryOutOutlined,
//     MailOutlined,
//     SettingOutlined,
//     TeamOutlined,

// } from '@ant-design/icons';
// import React, { useContext } from 'react';
// import { AdminContext } from "@/library/admin.context";
// import type { MenuProps } from 'antd';
// import Link from 'next/link'

// type MenuItem = Required<MenuProps>['items'][number];
// const AdminSideBar = () => {
//     const { Sider } = Layout;
//     const { collapseMenu } = useContext(AdminContext)!;

//     const items: MenuItem[] = [

//         {
//             key: 'grp',
//             label: 'FullStack',
//             type: 'group',
//             children: [
//                 {
//                     key: "dashboard",
//                     label: <Link href={"/dashboard"}>Dashboard</Link>,
//                     icon: <AppstoreOutlined />,
//                 },
//                 {
//                     key: "users",
//                     label: <Link href={"/dashboard/user"}>Manage Users</Link>,
//                     icon: <TeamOutlined />,
//                 },
//                 {
//                     key: "task",
//                     label: <Link href={"/dashboard/tasks"}>Manage Tasks</Link>,
//                     icon: <CarryOutOutlined />,
//                 },
//                 {
//                     key: 'sub1',
//                     label: 'Navigation One',
//                     icon: <MailOutlined />,
//                     children: [
//                         {
//                             key: 'g1',
//                             label: 'Item 1',
//                             type: 'group',
//                             children: [
//                                 { key: '1', label: 'Option 1' },
//                                 { key: '2', label: 'Option 2' },
//                             ],
//                         },
//                         {
//                             key: 'g2',
//                             label: 'Item 2',
//                             type: 'group',
//                             children: [
//                                 { key: '3', label: 'Option 3' },
//                                 { key: '4', label: 'Option 4' },
//                             ],
//                         },
//                     ],
//                 },
//                 {
//                     key: 'sub2',
//                     label: 'Navigation Two',
//                     icon: <AppstoreOutlined />,
//                     children: [
//                         { key: '5', label: 'Option 5' },
//                         { key: '6', label: 'Option 6' },
//                         {
//                             key: 'sub3',
//                             label: 'Submenu',
//                             children: [
//                                 { key: '7', label: 'Option 7' },
//                                 { key: '8', label: 'Option 8' },
//                             ],
//                         },
//                     ],
//                 },
//                 {
//                     type: 'divider',
//                 },
//                 {
//                     key: 'sub4',
//                     label: 'Navigation Three',
//                     icon: <SettingOutlined />,
//                     children: [
//                         { key: '9', label: 'Option 9' },
//                         { key: '10', label: 'Option 10' },
//                         { key: '11', label: 'Option 11' },
//                         { key: '12', label: 'Option 12' },
//                     ],
//                 },
//             ],
//         },
//     ];

//     return (
//         <Sider
//             collapsed={collapseMenu}
//         >

//             <Menu
//                 mode="inline"
//                 defaultSelectedKeys={['dashboard']}
//                 items={items}
//                 style={{ height: '100vh' }}
//             />
//         </Sider>
//     )
// }

// export default AdminSideBar;


'use client';

import React from 'react';
import Link from 'next/link';
import { Layout, Menu, theme } from 'antd';
import {
    CarryOutOutlined,
    MailOutlined,
    TeamOutlined,
    DashboardOutlined,
    FileAddOutlined
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { usePathname } from 'next/navigation';

const { Sider } = Layout;

interface AdminSidebarProps {
    collapsed: boolean;
}

type MenuItem = Required<MenuProps>['items'][number];

export default function AdminSidebar({ collapsed }: AdminSidebarProps) {
    const { token } = theme.useToken();
    const pathname = usePathname();

    const items: MenuItem[] = [
        {
            key: 'grp',
            label: 'FullStack Next/Nest',
            type: 'group',
            children: [
                {
                    key: '/dashboard',
                    label: <Link href="/dashboard">Dashboard</Link>,
                    icon: <DashboardOutlined />,
                },
                {
                    key: '/dashboard/user',
                    label: <Link href="/dashboard/user">Manage Users</Link>,
                    icon: <TeamOutlined />,
                },
                {
                    key: '/dashboard/tasks',
                    label: <Link href="/dashboard/tasks">Manage Tasks</Link>,
                    icon: <CarryOutOutlined />,
                },
                {
                    key: '/dashboard/upload',
                    label: <Link href="/dashboard/upload">Upload File</Link>,
                    icon: <FileAddOutlined />,
                },
                {
                    key: 'sub1',
                    label: 'Features',
                    icon: <MailOutlined />,
                    children: [
                        { key: '1', label: 'Option 1' },
                        { key: '2', label: 'Option 2' },
                    ],
                },
            ],
        },
    ];

    return (
        <Sider
            trigger={null}
            collapsible
            collapsed={collapsed}
            width={250}
            style={{
                background: token.colorBgContainer,
                borderRight: `1px solid ${token.colorBorderSecondary}`,
                height: '100vh',
                position: 'sticky',
                top: 0,
                left: 0,
                zIndex: 1001
            }}
        >
            <div style={{
                height: 64,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderBottom: `1px solid ${token.colorBorderSecondary}`
            }}>
                <span style={{ fontSize: 24, marginRight: collapsed ? 0 : 8 }}>🌱</span>
                {!collapsed && (
                    <span style={{ fontSize: 18, fontWeight: 'bold', color: token.colorPrimary }}>
                        Agritech
                    </span>
                )}
            </div>

            <Menu
                mode="inline"
                defaultSelectedKeys={[pathname]}
                selectedKeys={[pathname]}
                items={items}
                style={{ borderRight: 0 }}
            />
        </Sider>
    );
}