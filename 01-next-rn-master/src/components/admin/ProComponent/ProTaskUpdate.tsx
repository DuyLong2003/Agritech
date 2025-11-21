'use client';

import React from 'react';
import { ModalForm, ProFormText, ProFormSelect, ProFormTextArea, ProFormDatePicker } from '@ant-design/pro-components';
import { message } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import { handleUpdateTaskAction, Task } from '@/utils/actions';
import dayjs from 'dayjs';

interface ProTaskUpdateProps {
    task: Task; // Dữ liệu task cần sửa lấy từ bảng
    onSuccess?: () => void; // Hàm reload bảng sau khi sửa xong
}

export default function ProTaskUpdate({ task, onSuccess }: ProTaskUpdateProps) {
    return (
        <ModalForm
            title="Cập nhật công việc"
            // Nút trigger đặt ngay tại đây, thay thế cho việc bấm icon ở bảng
            trigger={
                <a key="edit" style={{ color: '#faad14', cursor: 'pointer' }}>
                    <EditOutlined />
                </a>
            }
            autoFocusFirstInput
            modalProps={{
                destroyOnClose: true, // Reset form khi đóng
                centered: true,
            }}
            // Map dữ liệu từ props task vào form
            initialValues={{
                _id: (task as any)._id || (task as any).id,
                title: task.title,
                description: task.description,
                status: task.status,
                assignee: task.assignee,
                // Xử lý ngày tháng nếu có
                dueDate: task.dueDate ? dayjs(task.dueDate) : undefined,
            }}
            onFinish={async (values) => {
                try {
                    // Gọi server action update
                    const res = await handleUpdateTaskAction(values);

                    if (res?.data) {
                        message.success('Cập nhật thành công');
                        onSuccess?.(); // Reload bảng bên ngoài
                        return true; // Đóng modal
                    } else {
                        message.error(res?.message || 'Cập nhật thất bại');
                        return false; // Giữ modal mở
                    }
                } catch (error) {
                    console.error(error);
                    message.error('Lỗi hệ thống');
                    return false;
                }
            }}
        >
            {/* Trường ẩn để chứa ID (quan trọng để update đúng record) */}
            <ProFormText name="_id" hidden />

            <ProFormText
                name="title"
                label="Tên công việc"
                placeholder="Nhập tên công việc"
                rules={[{ required: true, message: 'Vui lòng nhập tên công việc!' }]}
            />

            <ProFormTextArea
                name="description"
                label="Mô tả"
                placeholder="Nhập mô tả công việc..."
            />

            <ProFormSelect
                name="status"
                label="Trạng thái"
                valueEnum={{
                    todo: { text: 'Cần làm', status: 'Default' },
                    doing: { text: 'Đang thực hiện', status: 'Processing' },
                    done: { text: 'Hoàn thành', status: 'Success' },
                }}
                placeholder="Chọn trạng thái"
                rules={[{ required: true, message: 'Vui lòng chọn trạng thái!' }]}
            />

            <ProFormText
                name="assignee"
                label="Người được giao"
                placeholder="Nhập tên người phụ trách"
            />

            <ProFormDatePicker
                name="dueDate"
                label="Hạn chót"
                width="md"
                fieldProps={{
                    format: 'YYYY-MM-DD',
                }}
            />
        </ModalForm>
    );
}