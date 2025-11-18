
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

    // const onFinish = async (values: any) => {
    //     if (dataUpdate) {
    //         const { name, phone, address } = values;
    //         const res = await handleUpdateUserAction({
    //             _id: dataUpdate._id, name, phone, address
    //         })
    //         if (res?.data) {
    //             handleCloseUpdateModal();
    //             message.success("Update user succeed")
    //         } else {
    //             notification.error({
    //                 message: "Update User error",
    //                 description: res?.message
    //             })
    //         }

    //     }
    // };

    // const onFinish = async (values: any) => {
    //     if (!dataUpdate) return;
    //     const { name, phone, address } = values;

    //     // 1) update basic fields first (existing action)
    //     const res = await handleUpdateUserAction({
    //         _id: dataUpdate._id, name, phone, address
    //     });

    //     if (!res?.data) {
    //         notification.error({
    //             message: "Update User error",
    //             description: res?.message
    //         });
    //         return;
    //     }

    //     // 2) if file is selected -> upload avatar
    //     if (selectedFile) {
    //         // build FormData
    //         const form = new FormData();
    //         form.append('avatar', selectedFile);
    //         // include user id (controller will accept id from req.user or form)
    //         form.append('_id', dataUpdate._id);

    //         // get session for token (you already use auth() in helpers)
    //         const session = await auth();
    //         const token = session?.user?.access_token;

    //         const uploadRes = await sendRequestFile<any>({
    //             url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/users/avatar`,
    //             method: 'PATCH',
    //             body: form,
    //             headers: {
    //                 Authorization: `Bearer ${token}`
    //                 // DON'T set content-type; browser will set multipart boundary automatically
    //             },
    //         });

    //         if (uploadRes?.statusCode || uploadRes?.error) {
    //             notification.error({
    //                 message: "Upload avatar failed",
    //                 description: uploadRes?.message || 'Unknown error'
    //             });
    //             return;
    //         }
    //     }

    //     handleCloseUpdateModal();
    //     message.success("Update user succeed");
    // };

    const onFinish = async (values: any) => {
        try {
            const formData = new FormData();
            formData.append('_id', dataUpdate._id);
            formData.append('name', values.name);
            formData.append('email', values.email);
            formData.append('phone', values.phone ?? '');
            formData.append('address', values.address ?? '');
            if (selectedFile) {
                formData.append('avatar', selectedFile);
            }

            // gọi server action (không cần token)
            await handleUpdateUserAction(formData);

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