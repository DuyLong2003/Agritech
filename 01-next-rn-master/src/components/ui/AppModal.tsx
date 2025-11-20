'use client';

import React from 'react';
import { Modal, ModalProps } from 'antd';

interface AppModalProps extends ModalProps {
    children: React.ReactNode;
}

export default function AppModal({ children, ...props }: AppModalProps) {
    return (
        <Modal
            centered // Luôn căn giữa màn hình
            destroyOnClose // Tự hủy nội dung khi đóng (Reset form)
            maskClosable={true} // Bấm ra ngoài là đóng
            width={600} // Độ rộng chuẩn mặc định
            {...props}
        >
            {children}
        </Modal>
    );
}