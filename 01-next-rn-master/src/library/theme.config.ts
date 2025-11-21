import type { ThemeConfig } from 'antd';
import { theme } from 'antd';

// --- 1. BRAND PALETTE (Design Tokens) ---
const COLORS = {
    // SỬA: Màu xanh đậm hơn để đạt chuẩn Contrast AAA cho chữ trắng trên nền xanh
    primary: '#116a38',
    success: '#15803d',    // Green-700 (Đậm hơn mặc định)
    warning: '#b45309',    // Amber-700
    error: '#b91c1c',      // Red-700
    info: '#1d4ed8',       // Blue-700
};

const TYPOGRAPHY = {
    fontFamily: `'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif`,
    fontSize: 14,
};

const SHAPE = {
    borderRadius: 6,
};

/**
 * Hàm sinh cấu hình theme AntD
 */
export const getAntdTheme = (mode: 'light' | 'dark'): ThemeConfig => {
    const isDarkMode = mode === 'dark';

    return {
        algorithm: isDarkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,

        token: {
            // 1. Colors
            colorPrimary: COLORS.primary,
            colorSuccess: COLORS.success,
            colorWarning: COLORS.warning,
            colorError: COLORS.error,
            colorInfo: COLORS.info,

            // FIX LỖI LIGHTHOUSE: 
            // Ép dùng màu Xám Đậm (#475569) thay vì để Antd tự tính (ra màu nhạt)
            // Màu này đọc tốt trên cả nền trắng và nền xanh nhạt
            colorTextSecondary: isDarkMode ? '#a3a3a3' : '#374151',

            // Màu chữ chính đậm hơn (#0f172a - Slate 900)
            colorText: isDarkMode ? '#e5e5e5' : '#111827',

            // Background
            colorBgBase: isDarkMode ? '#00150a' : '#ffffff',
            colorTextBase: isDarkMode ? '#e5e7eb' : '#0f172a',

            // 2. Typography
            fontFamily: TYPOGRAPHY.fontFamily,
            fontSize: TYPOGRAPHY.fontSize,
            lineHeight: 1.6,

            // 3. Shape
            borderRadius: SHAPE.borderRadius,

            // 4. Others
            wireframe: false,
        },

        components: {
            Button: {
                controlHeight: 44,
                algorithm: true,
                fontWeight: 600,
                primaryShadow: 'none',
                contentFontSize: 15,
            },
            Input: {
                controlHeight: 44,
                activeShadow: `0 0 0 2px ${COLORS.primary}20`,
                colorTextPlaceholder: '#64748b',
            },
            Select: {
                controlHeight: 44,
            },
            Table: {
                headerBg: isDarkMode ? '#1a2e1f' : '#f0fdf4',
                headerColor: isDarkMode ? '#fff' : '#166534',
                headerBorderRadius: SHAPE.borderRadius,
            },
            Card: {
                headerFontSize: 16,
                borderRadiusLG: 12,
            },
            Typography: {
                fontWeightStrong: 700,
                fontSizeHeading1: 38,
                fontSizeHeading2: 30,
                fontSizeHeading3: 24,
                fontSizeHeading4: 20,
                fontSizeHeading5: 16,
            }
        },
    };
};