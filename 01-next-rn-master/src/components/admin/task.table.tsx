'use client';

import React, { useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Button, Table, Popconfirm, Input, message, Space, Tag } from "antd";
import { EditTwoTone, DeleteTwoTone } from "@ant-design/icons";

import TaskCreate from "./task.create";
import TaskUpdate from "./task.update";
import { handleDeleteTaskAction } from "@/utils/actions";

const { Search } = Input;

interface TaskType {
    _id?: string;
    id?: number;
    title: string;
    description?: string;
    status: string;
    assignee?: string;
    dueDate?: string | Date;
    createdAt?: string | Date;
    [key: string]: any;
}

interface Meta {
    current: number;
    pageSize: number;
    pages?: number;
    total: number;
}

interface Props {
    tasks: TaskType[];
    meta: Meta;
}

export default function TaskTable({ tasks = [], meta }: Props) {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { replace } = useRouter();

    const [isCreateOpen, setIsCreateOpen] = useState<boolean>(false);
    const [isUpdateOpen, setIsUpdateOpen] = useState<boolean>(false);
    const [updateData, setUpdateData] = useState<TaskType | null>(null);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const onSearch = (value: string) => {
        const params = new URLSearchParams(searchParams.toString());
        if (value && value.trim() !== "") {
            params.set("search", value.trim());
        } else {
            params.delete("search");
        }
        params.set("current", "1");
        replace(`${pathname}?${params.toString()}`);
    };

    const onTableChange = (pagination: any) => {
        if (pagination && pagination.current) {
            const params = new URLSearchParams(searchParams.toString());
            params.set("current", String(pagination.current));
            // keep pageSize if changed
            if (pagination.pageSize) params.set("pageSize", String(pagination.pageSize));
            replace(`${pathname}?${params.toString()}`);
        }
    };

    const handleDelete = async (id?: string) => {
        if (!id) return;
        try {
            setDeletingId(id);
            const res = await handleDeleteTaskAction(id);
            if (res?.data) {
                message.success("Xóa thành công");

                // const params = new URLSearchParams(searchParams.toString());
                // replace(`${pathname}?${params.toString()}`);
            } else {
                message.error(res?.message || "Xóa thất bại");
            }
        } catch (err) {
            console.error(err);
            message.error("Lỗi!");
        } finally {
            setDeletingId(null);
        }
    };

    const columns = [
        {
            title: "STT",
            key: "index",
            render: (_: any, __: any, index: number) => {
                return <>{(index + 1) + (meta.current - 1) * (meta.pageSize)}</>;
            },
            width: 80,
        },
        // {
        //     title: "_id",
        //     dataIndex: "_id",
        //     key: "_id",
        //     render: (v: any) => <span style={{ fontSize: 12 }}>{v}</span>,
        // },
        {
            title: "Tên",
            dataIndex: "title",
            key: "title",
            render: (v: any) => <strong>{v}</strong>,
        },
        {
            title: "Người được giao",
            dataIndex: "assignee",
            key: "assignee",
            render: (v: any) => v ?? "-",
        },
        {
            title: "Trạng thái",
            dataIndex: "status",
            key: "status",
            render: (v: string) => {
                const color = v === "done" ? "green" : v === "doing" ? "orange" : "blue";
                return <Tag color={color} style={{ textTransform: "capitalize" }}>{v}</Tag>;
            },
        },
        {
            title: "Hạn cuối",
            dataIndex: "dueDate",
            key: "dueDate",
            render: (v: any) => v ? new Date(v).toLocaleString() : "-",
        },
        {
            title: "Ngày tạo",
            dataIndex: "createdAt",
            key: "createdAt",
            render: (v: any) => v ? new Date(v).toLocaleString() : "-",
        },
        {
            title: "Hành động",
            key: "actions",
            width: 140,
            render: (_: any, record: TaskType) => (
                <Space>
                    <EditTwoTone
                        twoToneColor="#f57800"
                        style={{ cursor: "pointer" }}
                        onClick={() => {
                            setUpdateData(record);
                            setIsUpdateOpen(true);
                        }}
                    />
                    <Popconfirm
                        placement="topRight"
                        title="Xác nhận xóa task?"
                        onConfirm={() => handleDelete(record?._id)}
                        okText="Xác nhận"
                        cancelText="Hủy"
                    >
                        <span style={{ cursor: "pointer" }}>
                            <DeleteTwoTone twoToneColor="#ff4d4f" />
                        </span>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <>
            <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 16
            }}>
                <span style={{ fontWeight: 600 }}>Quản lý công việc</span>

                <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                    <Search
                        placeholder="Tìm kiếm với tên hoặc người được giao"
                        allowClear
                        defaultValue={searchParams.get("search") ?? undefined}
                        onSearch={onSearch}
                        style={{ width: 320 }}
                    />
                    <Button type="primary" onClick={() => setIsCreateOpen(true)}>Tạo mới</Button>
                </div>
            </div>

            <Table
                bordered
                dataSource={tasks}
                columns={columns}
                rowKey={(record: any) => record._id ?? record.id}
                pagination={{
                    current: meta.current,
                    pageSize: meta.pageSize,
                    showSizeChanger: true,
                    total: meta.total,
                    showTotal: (total: number, range: [number, number]) => `${range[0]}-${range[1]} trên ${total} rows`
                }}
                onChange={onTableChange}
            />

            <TaskCreate
                open={isCreateOpen}
                setOpen={setIsCreateOpen}
                onCreate={async (values: any) => {
                    // delegate to server action; the server action will revalidate tag "list-tasks"
                    // and TaskPage (server component) will fetch fresh data.
                    // but show optimistic message
                    try {
                        const res = await (await import('@/utils/actions')).handleCreateTaskAction(values);
                        if (res?.data) {
                            message.success("Tạo công việc thành công");
                        } else {
                            message.error(res?.message || "Tạo thất bại");
                        }
                    } catch (err) {
                        console.error(err);
                        message.error("Lỗi");
                    }
                    // finally {
                    //     // trigger refresh by re-navigating to same route with current params
                    //     const params = new URLSearchParams(searchParams.toString());
                    //     replace(`${pathname}?${params.toString()}`);
                    // }
                }}
            />

            <TaskUpdate
                open={isUpdateOpen}
                setOpen={setIsUpdateOpen}
                data={updateData}
                onUpdate={async (values: any) => {
                    try {
                        const res = await (await import('@/utils/actions')).handleUpdateTaskAction(values);
                        if (res?.data) {
                            message.success("Update thành công");
                        } else {
                            message.error(res?.message || "Update thất bại");
                        }
                    } catch (err) {
                        console.error(err);
                        message.error("Lỗi update");
                    }
                    // finally {
                    //     const params = new URLSearchParams(searchParams.toString());
                    //     replace(`${pathname}?${params.toString()}`);
                    // }
                }}
            />
        </>
    );
}
