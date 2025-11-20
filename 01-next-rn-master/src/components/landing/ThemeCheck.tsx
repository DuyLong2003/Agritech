'use client'; // 👈 QUAN TRỌNG: Đánh dấu đây là Client Component

import React from 'react';
import { Button, Space, Alert, Typography } from 'antd';

export default function ThemeCheck() {
    return (
        <section style={{ padding: '40px', backgroundColor: '#f5f5f5', borderBottom: '1px dashed #ccc' }}>
            <Space direction="vertical" style={{ width: '100%' }} size="large">
                <Typography.Title level={3} style={{ margin: 0 }}>
                    🎨 Design System Check (Màu Brand: #1F7A1F)
                </Typography.Title>

                {/* 1. Test Buttons */}
                <Space wrap>
                    <Button type="primary">Primary Button</Button>
                    <Button>Default Button</Button>
                    <Button type="dashed">Dashed Button</Button>
                    <Button type="primary" danger>Danger Button</Button>
                    <Button type="primary" disabled>Disabled</Button>
                </Space>

                {/* 2. Test Alerts (Màu chức năng) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Alert message="Success Message" description="Màu xanh lá sáng (Success)" type="success" showIcon />
                    <Alert message="Info Message" description="Màu xanh dương (Info)" type="info" showIcon />
                    <Alert message="Warning Message" description="Màu vàng cam (Warning)" type="warning" showIcon />
                    <Alert message="Error Message" description="Màu đỏ (Error)" type="error" showIcon />
                </div>
            </Space>
        </section>
    );
}