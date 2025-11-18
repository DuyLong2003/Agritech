"use client";
import { Modal, Form, Input, Select } from "antd";
import React, { useEffect } from "react";

export default function TaskUpdate({ open, setOpen, data, onUpdate }: any) {
    const [form] = Form.useForm();

    useEffect(() => {
        if (data) {
            form.setFieldsValue({
                title: data.title,
                description: data.description,
                status: data.status,
                assignee: data.assignee,
                _id: data._id,
            });
        } else {
            form.resetFields();
        }
    }, [data]);

    return (
        <Modal
            title="Cập nhật công việc"
            open={open}
            onOk={() => {
                form.validateFields().then(values => {
                    onUpdate(values);
                    setOpen(false);
                });
            }}
            onCancel={() => setOpen(false)}
        >
            <Form form={form} layout="vertical">
                <Form.Item name="_id" hidden>
                    <Input />
                </Form.Item>
                <Form.Item name="title" label="Tên công việc" rules={[{ required: true }]}>
                    <Input />
                </Form.Item>
                <Form.Item name="description" label="Mô tả">
                    <Input.TextArea />
                </Form.Item>
                <Form.Item name="status" label="Trạng thái">
                    <Select options={[{ label: 'Cần làm', value: 'todo' }, { label: 'Đang thực hiện', value: 'doing' }, { label: 'Hoàn thành', value: 'done' }]} />
                </Form.Item>
                <Form.Item name="assignee" label="Người được giao">
                    <Input />
                </Form.Item>
            </Form>
        </Modal>
    );
}
