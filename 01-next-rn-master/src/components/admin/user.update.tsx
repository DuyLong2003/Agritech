import { sendRequestFile } from '@/utils/api';
import {
    Modal, Input,
    Form, Row, Col, message,
    notification
} from 'antd';
import { useEffect, useState } from 'react';
import { useSession } from "next-auth/react"; // <--- 1. IMPORT QUAN TRỌNG

interface IProps {
    isUpdateModalOpen: boolean;
    setIsUpdateModalOpen: (v: boolean) => void;
    dataUpdate: any;
    setDataUpdate: any;
    refreshTable: () => void;
}

const UserUpdate = (props: IProps) => {

    const {
        isUpdateModalOpen, setIsUpdateModalOpen,
        dataUpdate, setDataUpdate,
        refreshTable
    } = props;

    const [form] = Form.useForm();

    // <--- 2. LẤY SESSION ĐỂ CÓ TOKEN
    const { data: session } = useSession();

    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        if (dataUpdate) {
            form.setFieldsValue({
                name: dataUpdate.name,
                email: dataUpdate.email,
                phone: dataUpdate.phone,
                address: dataUpdate.address
            });
            setPreview(dataUpdate.image || "");
            setSelectedFile(null);
        }
    }, [dataUpdate, form]);

    const handleCloseUpdateModal = () => {
        form.resetFields();
        setIsUpdateModalOpen(false);
        setDataUpdate(null);
        setPreview(null);
        setSelectedFile(null);
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
        setLoading(true);
        try {
            const formData = new FormData();
            formData.append('_id', dataUpdate._id);
            formData.append('name', values.name);

            // Logic: Chỉ gửi nếu có giá trị
            if (values.phone) formData.append('phone', values.phone);
            if (values.address) formData.append('address', values.address);

            if (selectedFile) {
                formData.append('avatar', selectedFile);
            }

            // <--- 3. LẤY TOKEN (Check cả 2 trường hợp phổ biến)
            // Ép kiểu any để TypeScript không bắt bẻ cấu trúc session
            const token = (session as any)?.access_token ?? (session as any)?.user?.access_token;

            // <--- 4. GỬI REQUEST KÈM HEADER
            const res = await sendRequestFile<IBackendRes<any>>({
                url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/users`,
                method: "PATCH",
                body: formData,
                headers: {
                    Authorization: `Bearer ${token}`, // <--- QUAN TRỌNG NHẤT
                }
            });

            if (res.data || res.statusCode === 200) {
                message.success("Update user thành công!");
                handleCloseUpdateModal();
                refreshTable();
            } else {
                notification.error({
                    message: "Đã có lỗi xảy ra",
                    description: res.message
                });
            }
        } catch (error) {
            console.error(error);
            message.error("Có lỗi xảy ra khi kết nối server");
        }
        setLoading(false);
    };

    return (
        <Modal
            title="Update a user"
            open={isUpdateModalOpen}
            onOk={() => form.submit()}
            onCancel={() => handleCloseUpdateModal()}
            maskClosable={false}
            confirmLoading={loading}
        >
            <Form
                name="basic"
                onFinish={onFinish}
                layout="vertical"
                form={form}
            >
                <Row gutter={[15, 15]}>
                    <Col span={24} md={12}>
                        <Form.Item label="Email" name="email">
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
                        <Form.Item label="Phone" name="phone">
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col span={24} md={12}>
                        <Form.Item label="Address" name="address">
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col span={24} md={12}>
                        <Form.Item label="Avatar">
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                />
                                {preview && (
                                    <img
                                        src={preview}
                                        alt="Preview"
                                        style={{
                                            width: 100, height: 100,
                                            objectFit: 'cover', borderRadius: '50%',
                                            border: '1px solid #ccc'
                                        }}
                                    />
                                )}
                            </div>
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </Modal>
    )
}

export default UserUpdate;