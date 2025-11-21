'use client';

import React from 'react';
import { ProTable, ActionType, ProColumns } from '@ant-design/pro-components';
import { Tag, Popconfirm, message, Button } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { fetchTasks, handleDeleteTaskAction, Task } from '@/utils/actions';
import ProTaskCreate from './ProTaskCreate';
import ProTaskUpdate from './ProTaskUpdate';

interface Props {
    actionRef?: React.MutableRefObject<ActionType | undefined>;
}

export default function ProTaskTable({ actionRef }: Props) {
    const columns: ProColumns<Task>[] = [
        {
            title: 'STT',
            valueType: 'indexBorder',
            width: 48,
        },
        {
            title: 'Tên công việc',
            dataIndex: 'title',
            copyable: true,
            ellipsis: true,
            formItemProps: {
                rules: [{ required: true, message: 'Vui lòng nhập tiêu đề' }],
            },
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            valueType: 'select',
            width: 120,
            valueEnum: {
                todo: { text: 'Cần làm', status: 'Default', color: 'blue' },
                doing: { text: 'Đang làm', status: 'Processing', color: 'orange' },
                done: { text: 'Hoàn thành', status: 'Success', color: 'green' },
            },
            render: (_, record) => {
                let color = 'default';
                let text = record.status;
                if (record.status === 'todo') { color = 'blue'; text = 'Cần làm'; }
                else if (record.status === 'doing') { color = 'orange'; text = 'Đang làm'; }
                else if (record.status === 'done') { color = 'green'; text = 'Hoàn thành'; }
                return <Tag color={color}>{text}</Tag>;
            }
        },
        {
            title: 'Người được giao',
            dataIndex: 'assignee',
            render: (dom) => dom ? <Tag>{dom}</Tag> : '-',
        },
        {
            title: 'Hạn chót',
            dataIndex: 'dueDate',
            valueType: 'date',
            sorter: true,
            search: false,
        },
        {
            title: 'Ngày tạo',
            dataIndex: 'createdAt',
            valueType: 'dateTime',
            sorter: true,
            search: false,
            width: 160,
        },
        {
            title: 'Hành động',
            valueType: 'option',
            key: 'option',
            width: 120,
            render: (_, record, __, action) => [
                <ProTaskUpdate
                    key="edit"
                    task={record}
                    onSuccess={() => action?.reload()}
                />,
                <Popconfirm
                    key="delete"
                    title="Xác nhận xóa?"
                    description="Hành động này không thể hoàn tác"
                    onConfirm={async () => {
                        try {
                            const id = (record as any)._id || (record as any).id;
                            if (!id) {
                                message.error("Không tìm thấy ID");
                                return;
                            }

                            const res = await handleDeleteTaskAction(id);
                            if (res?.data) {
                                message.success('Đã xóa thành công');
                                action?.reload();
                            } else {
                                message.error(res?.message || 'Xóa thất bại');
                            }
                        } catch (err) {
                            message.error('Lỗi hệ thống');
                        }
                    }}
                    okText="Xóa"
                    cancelText="Hủy"
                >
                    <a style={{ color: '#ff4d4f' }}><DeleteOutlined /></a>
                </Popconfirm>,
            ],
        },
    ];

    return (
        <ProTable<Task>
            columns={columns}
            actionRef={actionRef}
            cardBordered

            // --- LOGIC GỌI API ---
            request={async (params, sort, filter) => {
                // console.log('ProTable Request:', params);
                const searchQuery = params.title || params.assignee || params.status;

                const res = await fetchTasks({
                    current: params.current || 1,
                    pageSize: params.pageSize || 10,
                    search: params.title || "",
                    status: params.status,
                    assignee: params.assignee,
                });

                return {
                    data: res.tasks, // Lúc này Type đã khớp
                    success: true,
                    total: res.meta.total,
                };
            }}
            // ---------------------

            // Xử lý rowKey linh hoạt: ưu tiên _id, fallback sang id hoặc index
            rowKey={(record) => (record as any)._id || (record as any).id || Math.random()}

            search={{
                labelWidth: 'auto',
            }}
            pagination={{
                pageSize: 10,
                showSizeChanger: true,
            }}
            dateFormatter="string"
            headerTitle="Danh sách công việc"

            toolBarRender={() => [
                <ProTaskCreate
                    key="create"
                    onSuccess={() => actionRef?.current?.reload()}
                />
            ]}
        />
    );
}