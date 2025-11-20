'use client';

import React, { useState, useEffect } from 'react';
import { ConfigProvider, FloatButton } from 'antd';
import { MoonOutlined, SunOutlined } from '@ant-design/icons';
import { getAntdTheme } from '@/library/theme.config';

export default function AntdProvider({ children }: { children: React.ReactNode }) {
    // State quản lý theme: mặc định là 'light' (false)
    const [isDarkMode, setIsDarkMode] = useState(false);

    // Hàm chuyển đổi theme
    const toggleTheme = () => {
        setIsDarkMode((prev) => !prev);
    };

    // Đồng bộ màu nền body của HTML với theme
    useEffect(() => {
        if (isDarkMode) {
            document.body.style.backgroundColor = '#00150a'; // Màu nền dark (khớp theme config)
            document.body.style.color = '#ffffff';
        } else {
            document.body.style.backgroundColor = '#ffffff'; // Màu nền light
            document.body.style.color = '#000000';
        }
    }, [isDarkMode]);

    return (
        <ConfigProvider theme={getAntdTheme(isDarkMode ? 'dark' : 'light')}>
            {children}

            {/* Nút nổi chuyển đổi theme nằm góc phải dưới */}
            <FloatButton
                icon={isDarkMode ? <SunOutlined /> : <MoonOutlined />}
                onClick={toggleTheme}
                tooltip={isDarkMode ? "Chuyển sang giao diện sáng" : "Chuyển sang giao diện tối"}
                type="primary"
                style={{ left: 24, bottom: 24 }}
            />
        </ConfigProvider>
    );
}