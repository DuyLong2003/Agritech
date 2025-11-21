'use client';

import React, { useState } from 'react';
import { Layout, theme } from 'antd';
import AdminSidebar from './AdminSidebar';
import AdminHeader from './AdminHeader';

const { Content } = Layout;

export default function DashboardLayout({
    children,
    session
}: {
    children: React.ReactNode;
    session: any;
}) {
    const [collapsed, setCollapsed] = useState(false);
    const { token } = theme.useToken();

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <AdminSidebar collapsed={collapsed} />
            <Layout>
                <AdminHeader
                    collapsed={collapsed}
                    setCollapsed={setCollapsed}
                    session={session}
                />
                <Content style={{ margin: '24px 16px', padding: 24, minHeight: 280 }}>
                    {children}
                </Content>
                <div style={{ textAlign: 'center', padding: '10px 0', color: '#999', fontSize: 12 }}>
                    Agritech Admin System ©2024
                </div>
            </Layout>
        </Layout>
    );
}