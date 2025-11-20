import type { ThemeConfig } from 'antd';
import { theme } from 'antd';

//DESIGN TOKENS

// --- 1. BRAND PALETTE (Bảng màu thương hiệu) ---
const COLORS = {
    primary: '#1F7A1F',    // Xanh lá đậm (Brand Color)
    success: '#22c55e',    // Green-500 (Sáng hơn để báo thành công)
    warning: '#f59e0b',    // Amber-500
    error: '#ef4444',      // Red-500
    info: '#3b82f6',       // Blue-500
};

// --- 2. TYPOGRAPHY & SHAPE (Font & Hình dáng) ---
const TYPOGRAPHY = {
    fontFamily: `'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif`,
    fontSize: 14,
};

const SHAPE = {
    borderRadius: 6, // Chuẩn bo góc
};
//Hết Design Tokens

/**
 * Hàm sinh cấu hình theme AntD
 * @param mode 'light' | 'dark'
 * @returns ThemeConfig
 */
export const getAntdTheme = (mode: 'light' | 'dark'): ThemeConfig => {
    const isDarkMode = mode === 'dark';

    return {
        // A. Thuật toán sinh màu tự động của Antd
        algorithm: isDarkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,

        // B. Global Tokens (Áp dụng toàn app)
        // Radius & Font theo Guideline
        token: {
            // 1. Colors: Biến thể màu thương hiệu
            colorPrimary: COLORS.primary,
            colorSuccess: COLORS.success,
            colorWarning: COLORS.warning,
            colorError: COLORS.error,
            colorInfo: COLORS.info,

            // Màu nền cơ bản (Tùy chỉnh sâu hơn cho Dark Mode)
            colorBgBase: isDarkMode ? '#00150a' : '#ffffff',
            colorTextBase: isDarkMode ? '#e5e7eb' : '#1f2937',

            //RADIUS VÀ FONT THEO GUIDELINE
            // 2. Typography: Font
            fontFamily: TYPOGRAPHY.fontFamily,
            fontSize: TYPOGRAPHY.fontSize,
            lineHeight: 1.5,

            // 3. Shape
            borderRadius: SHAPE.borderRadius,

            // 4. Others
            wireframe: false, // không viền bao quanh input/card
        },

        // Tuỳ biến Theme Ant Design (ConfigProvider) => Component Tokens (Tùy biến chi tiết từng component)
        components: {
            Button: {
                controlHeight: 40,       // Nút cao 40px (chuẩn hiện đại)
                algorithm: true,         // Tự động tính màu hover/active
                fontWeight: 500,
                primaryShadow: 'none',   // Flat design
            },
            Input: {
                controlHeight: 40,
                activeShadow: `0 0 0 2px ${COLORS.primary}20`, // Shadow mờ 20% khi focus
            },
            Select: {
                controlHeight: 40,
            },
            Table: {
                headerBg: isDarkMode ? '#1a2e1f' : '#f0fdf4', // Header bảng theo tông xanh
                headerColor: isDarkMode ? '#fff' : COLORS.primary,
                headerBorderRadius: SHAPE.borderRadius,
            },
            Card: {
                headerFontSize: 16,
                borderRadiusLG: 12, // Card bo góc lớn hơn nút chút
            },
            Typography: {
                // Định nghĩa các cấp độ Title
                fontSizeHeading1: 38,
                fontSizeHeading2: 30,
                fontSizeHeading3: 24,
                fontSizeHeading4: 20,
                fontSizeHeading5: 16,
            }
        },
    };
};