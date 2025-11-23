// 'use client';

// import React, { useState, useEffect } from 'react';
// import { ConfigProvider, FloatButton } from 'antd';
// import { MoonOutlined, SunOutlined } from '@ant-design/icons';
// import { getAntdTheme } from '@/library/theme.config';
// import viVN from 'antd/locale/vi_VN';

// export default function AntdProvider({ children }: { children: React.ReactNode }) {
//     // State quản lý theme: mặc định là 'light' (false)
//     const [isDarkMode, setIsDarkMode] = useState(false);

//     // Hàm chuyển đổi theme
//     const toggleTheme = () => {
//         setIsDarkMode((prev) => !prev);
//     };

//     // Đồng bộ màu nền body của HTML với theme
//     useEffect(() => {
//         if (isDarkMode) {
//             document.body.style.backgroundColor = '#00150a'; // Màu nền dark (khớp theme config)
//             document.body.style.color = '#ffffff';
//         } else {
//             document.body.style.backgroundColor = '#ffffff'; // Màu nền light
//             document.body.style.color = '#000000';
//         }
//     }, [isDarkMode]);

//     return (
//         <ConfigProvider theme={getAntdTheme(isDarkMode ? 'dark' : 'light')} locale={viVN}>
//             {children}

//             {/* Nút nổi chuyển đổi theme nằm góc phải dưới */}
//             <FloatButton
//                 icon={isDarkMode ? <SunOutlined /> : <MoonOutlined />}
//                 onClick={toggleTheme}
//                 tooltip={isDarkMode ? "Chuyển sang giao diện sáng" : "Chuyển sang giao diện tối"}
//                 type="primary"
//                 style={{ left: 24, bottom: 24 }}
//             />
//         </ConfigProvider>
//     );
// }
'use client';

import React, { useState, useEffect } from 'react';
import { App, ConfigProvider, FloatButton, theme as antTheme } from 'antd';
import { ProConfigProvider } from '@ant-design/pro-components'; // 1. Import ProConfigProvider
import { MoonOutlined, SunOutlined } from '@ant-design/icons';
import { getAntdTheme } from '@/library/theme.config';

// Import gói ngôn ngữ tiếng Việt
import viVN from 'antd/locale/vi_VN';

export default function AntdProvider({ children }: { children: React.ReactNode }) {
    const [isDarkMode, setIsDarkMode] = useState(false);

    const toggleTheme = () => {
        setIsDarkMode((prev) => !prev);
    };

    const currentThemeConfig = getAntdTheme(isDarkMode ? 'dark' : 'light');

    // Đồng bộ CSS Variable cho Tailwind (nếu dùng)
    useEffect(() => {
        const r = document.documentElement;
        r.style.setProperty('--ant-primary', currentThemeConfig.token?.colorPrimary as string);
        r.style.setProperty('--ant-bg-base', currentThemeConfig.token?.colorBgBase as string);
    }, [isDarkMode, currentThemeConfig]);

    // Đồng bộ màu body
    useEffect(() => {
        if (isDarkMode) {
            document.body.style.backgroundColor = '#00150a';
            document.body.style.color = '#ffffff';
        } else {
            document.body.style.backgroundColor = '#ffffff';
            document.body.style.color = '#000000';
        }
    }, [isDarkMode]);

    return (
        // 2. Bọc ProConfigProvider bên trong ConfigProvider
        <ConfigProvider theme={currentThemeConfig} locale={viVN}>
            <ProConfigProvider
                token={{
                    // Đồng bộ token màu sắc của ProComponents với Antd thuần
                    colorPrimary: currentThemeConfig.token?.colorPrimary,
                }}
            >
                <App>
                    {children}
                </App>

                <FloatButton

                    icon={isDarkMode ? <SunOutlined /> : <MoonOutlined />}
                    onClick={toggleTheme}
                    tooltip={isDarkMode ? "Chuyển sang giao diện sáng" : "Chuyển sang giao diện tối"}
                    type="primary"
                    style={{ left: 10, bottom: 24, zIndex: 2147483647 }}
                />
            </ProConfigProvider>
        </ConfigProvider>
    );
}