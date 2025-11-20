'use client';

import React from 'react';
import { Table, TableProps, theme } from 'antd';

// Kế thừa toàn bộ props của Antd Table
interface AppTableProps<T> extends TableProps<T> {
    // Có thể thêm props custom ở đây nếu cần
}

export default function AppTable<T extends object>({ scroll, ...props }: AppTableProps<T>) {
    const { token } = theme.useToken();

    return (
        <div
            style={{
                background: token.colorBgContainer,
                borderRadius: token.borderRadiusLG,
                padding: '16px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.04)' // Bóng đổ nhẹ cho bảng
            }}
        >
            <Table<T>
                // Cấu hình phân trang chuẩn
                pagination={{
                    defaultPageSize: 10,
                    showSizeChanger: true,
                    pageSizeOptions: ['10', '20', '50'],
                    showTotal: (total) => `Tổng ${total} kết quả`,
                }}
                // Scroll mặc định để tránh vỡ layout trên mobile
                scroll={{ x: 1000, ...scroll }}
                size="middle" // Kích thước vừa phải
                {...props}
            />
        </div>
    );
}