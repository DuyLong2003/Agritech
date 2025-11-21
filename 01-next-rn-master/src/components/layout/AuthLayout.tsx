'use client';

import React from 'react';
import { Card, theme } from 'antd';
import Link from 'next/link';

export default function AuthLayout({ children, title }: { children: React.ReactNode, title: string }) {
    const { token } = theme.useToken();

    return (
        <div
            style={{
                minHeight: '100vh',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
                padding: '20px'
            }}
        >
            <div style={{ width: '100%', maxWidth: 420 }}>
                <div style={{ textAlign: 'center', marginBottom: 24 }}>
                    <Link href="/" style={{ textDecoration: 'none' }}>
                        <span style={{ fontSize: 48 }}>🌱</span>
                        <h1 style={{ color: token.colorPrimary, margin: 0, fontSize: 24, fontWeight: 'bold' }}>
                            Agritech
                        </h1>
                    </Link>
                </div>

                <Card
                    title={title}
                    bordered={false}
                    style={{ boxShadow: '0 4px 24px rgba(0,0,0,0.08)' }}
                    headStyle={{ textAlign: 'center', fontSize: 18 }}
                >
                    {children}
                </Card>

                <div style={{ textAlign: 'center', marginTop: 24, color: '#666', fontSize: 12 }}>
                    © {new Date().getFullYear()} Agritech - Nông nghiệp thông minh
                </div>
            </div>
        </div>
    );
}