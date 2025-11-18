"use client";
import { Modal, Form, Input, Select } from "antd";
import React from "react";

export default function TaskCreate({ open, setOpen, onCreate }: any) {
    const [form] = Form.useForm();

    return (
        <Modal
            title="Tạo mới công việc"
            open={open}
            onOk={() => {
                form.validateFields().then(values => {
                    onCreate(values);
                    setOpen(false);
                    form.resetFields();
                });
            }}
            onCancel={() => setOpen(false)}
        >
            <Form form={form} layout="vertical">
                <Form.Item name="title" label="Tên công việc" rules={[{ required: true }]}>
                    <Input />
                </Form.Item>
                <Form.Item name="description" label="Mô tả">
                    <Input.TextArea />
                </Form.Item>
                <Form.Item name="status" label="Trạng thái" initialValue="todo">
                    <Select options={[{ label: 'Cần thực hiện', value: 'todo' }, { label: 'Đang thực hiện', value: 'doing' }, { label: 'Hoàn thành', value: 'done' }]} />
                </Form.Item>
                <Form.Item name="assignee" label="Người được giao">
                    <Input />
                </Form.Item>
            </Form>
        </Modal>
    );
}
