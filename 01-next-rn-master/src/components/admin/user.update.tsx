
import { auth } from '@/auth';
import { handleUpdateUserAction } from '@/utils/actions';
import { sendRequestFile } from '@/utils/api';
import {
    Modal, Input,
    Form, Row, Col, message,
    notification
} from 'antd';
import { useEffect } from 'react';
import React, { useState } from 'react';

interface IProps {
    isUpdateModalOpen: boolean;
    setIsUpdateModalOpen: (v: boolean) => void;
    dataUpdate: any;
    setDataUpdate: any;
}

const UserUpdate = (props: IProps) => {

    const {
        isUpdateModalOpen, setIsUpdateModalOpen,
        dataUpdate, setDataUpdate
    } = props;

    const [form] = Form.useForm();

    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);

    useEffect(() => {
        if (dataUpdate) {
            //code
            form.setFieldsValue({
                name: dataUpdate.name,
                email: dataUpdate.email,
                phone: dataUpdate.phone,
                address: dataUpdate.address
            })
        }
    }, [dataUpdate])

    const handleCloseUpdateModal = () => {
        form.resetFields()
        setIsUpdateModalOpen(false);
        setDataUpdate(null)
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const f = e.target.files?.[0] ?? null;
        setSelectedFile(f);
        if (f) {
            const url = URL.createObjectURL(f);
            setPreview(url);
        } else {
            setPreview(dataUpdate?.image || null);
        }
    };

    const onFinish = async (values: any) => {
        try {
            if (!dataUpdate) return;

            // 1) update basic fields as JSON
            const { name, phone, address } = values;
            const res = await handleUpdateUserAction({ _id: dataUpdate._id, name, phone, address });

            if (!res?.data) {
                notification.error({ message: 'Update User error', description: res?.message });
                return;
            }

            // 2) if a file selected, upload separately as form-data
            if (selectedFile) {
                const form = new FormData();
                form.append('_id', dataUpdate._id);
                form.append('avatar', selectedFile);
                // const upRes = await handleUploadAvatarAction(form);

                // if (!upRes?.data) {
                //     notification.error({ message: 'Upload avatar failed', description: upRes?.message });
                //     return;
                // }
            }

            message.success('Cập nhật user thành công');
            setIsUpdateModalOpen(false);
            setDataUpdate(null);

        } catch (error: any) {
            console.error(error);
            message.error(error?.message || 'Cập nhật thất bại');
        }
    };


    return (
        <Modal
            title="Update a user"
            open={isUpdateModalOpen}
            onOk={() => form.submit()}
            onCancel={() => handleCloseUpdateModal()}
            maskClosable={false}
        >
            <Form
                name="basic"
                onFinish={onFinish}
                layout="vertical"
                form={form}
            >
                <Row gutter={[15, 15]}>
                    <Col span={24} md={12}>
                        <Form.Item
                            label="Email"
                            name="email"
                        >
                            <Input type='email' disabled />
                        </Form.Item>
                    </Col>

                    <Col span={24} md={12}>
                        <Form.Item
                            label="Name"
                            name="name"
                            rules={[{ required: true, message: 'Please input your name!' }]}
                        >
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col span={24} md={12}>
                        <Form.Item
                            label="Phone"
                            name="phone"
                        >
                            <Input />
                        </Form.Item>
                    </Col>

                    <Col span={24} md={12}>
                        <Form.Item
                            label="Address"
                            name="address"
                        >
                            <Input />
                        </Form.Item>
                    </Col>

                    <Col span={24} md={12}>
                        <Form.Item label="Image">
                            <input type="file" accept="image/*" onChange={handleFileChange} />
                            {preview && (
                                <div style={{ marginTop: 8 }}>
                                    <img src={preview} alt="preview" style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 8 }} />
                                </div>
                            )}
                        </Form.Item>
                    </Col>


                </Row>
            </Form>
        </Modal>
    )
}

export default UserUpdate;