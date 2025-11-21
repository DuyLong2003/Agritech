'use client';

import React from 'react';
import { ModalForm, ProFormText, ProFormSelect, ProFormDatePicker } from '@ant-design/pro-components';
import { Button, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { handleCreateTaskAction } from '@/utils/actions'; // Import server action của bạn

interface ProTaskCreateProps {
    onSuccess?: () => void; // Callback khi tạo thành công để reload bảng
}

export default function ProTaskCreate({ onSuccess }: ProTaskCreateProps) {
    return (
        <ModalForm
            title="Tạo công việc mới"
            trigger={
                <Button type="primary" icon={<PlusOutlined />}>
                    Tạo mới
                </Button>
            }
            autoFocusFirstInput
            modalProps={{
                destroyOnClose: true,
                centered: true,
            }}
            submitTimeout={2000}
            onFinish={async (values) => {
                try {
                    // Gọi Server Action tạo task
                    const res = await handleCreateTaskAction(values);

                    if (res?.data) {
                        message.success('Tạo công việc thành công');
                        onSuccess?.(); // Gọi callback để reload bảng bên ngoài nếu cần
                        return true; // Trả về true để đóng modal
                    } else {
                        message.error(res?.message || 'Tạo thất bại');
                        return false; // Giữ modal mở nếu lỗi
                    }
                } catch (error) {
                    console.error(error);
                    message.error('Có lỗi xảy ra');
                    return false;
                }
            }}
        >
            <ProFormText
                name="title"
                label="Tên công việc"
                placeholder="Nhập tên công việc..."
                rules={[{ required: true, message: 'Vui lòng nhập tên công việc!' }]}
            />

            <ProFormSelect
                name="status"
                label="Trạng thái"
                valueEnum={{
                    todo: { text: 'Cần làm', status: 'Default' },
                    doing: { text: 'Đang làm', status: 'Processing' },
                    done: { text: 'Hoàn thành', status: 'Success' },
                }}
                placeholder="Chọn trạng thái"
                rules={[{ required: true, message: 'Vui lòng chọn trạng thái!' }]}
                initialValue="todo"
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
            />
        </ModalForm>
    );
}