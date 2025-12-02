// src/components/admin/ProComponent/ProProductTable.tsx
"use client";

import React, { useState } from 'react';
import { Table, Button, Space, Popconfirm, Modal, Form, Input, InputNumber, Upload, Image, message } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, UploadOutlined } from '@ant-design/icons';
import { useSession } from 'next-auth/react';
import type { ColumnsType } from 'antd/es/table';
import { useProducts } from '@/app/hooks/products/useProducts';
import { useCreateProduct } from '@/app/hooks/products/useCreateProduct';
import { useUpdateProduct } from '@/app/hooks/products/useUpdateProduct';
import { useDeleteProduct } from '@/app/hooks/products/useDeleteProduct';
import { uploadFile } from '@/utils/api';
const ProProductTable = () => {
    const { data: session } = useSession();
    const token = session?.user?.access_token as string;

    // --- State ---
    const [meta, setMeta] = useState({ current: 1, pageSize: 10 });
    const [search, setSearch] = useState(""); // Nếu muốn làm search input
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<IProduct | null>(null);
    const [fileList, setFileList] = useState<any[]>([]);

    const [form] = Form.useForm();

    // --- TanStack Query ---
    const { data: productData, isFetching } = useProducts({
        current: meta.current,
        pageSize: meta.pageSize,
        search,
        token
    });

    const createMutation = useCreateProduct();
    const updateMutation = useUpdateProduct();
    const deleteMutation = useDeleteProduct();

    // --- Handlers ---
    const handleTableChange = (pagination: any) => {
        setMeta({ current: pagination.current, pageSize: pagination.pageSize });
    };
    const handleUpload = async ({ file, onSuccess, onError }: any) => {
        try {
            const res = await uploadFile(file, token);

            // Logic mới: Dựa vào cấu trúc trả về của MinioService + TransformInterceptor
            if (res && res.data && res.data.url) {
                // onSuccess cần truyền đúng URL để Antd hiển thị preview status 'done'
                // Tham số thứ 2 của onSuccess là object response gốc
                onSuccess(res.data.url, res);
                message.success("Upload ảnh thành công");
            } else {
                onError(new Error('Upload failed'));
                message.error("Lỗi upload ảnh");
            }
        } catch (err) {
            onError(err);
            message.error("Lỗi kết nối server upload");
        }
    };

    // const handleSubmit = async (values: any) => {
    //     // Xử lý ảnh: Lấy URL từ fileList nếu có upload mới, hoặc giữ nguyên url cũ
    //     let imageUrl = editingProduct?.image || "";
    //     if (fileList.length > 0 && fileList[0].response) {
    //         // Logic lấy link ảnh tùy thuộc vào response của uploadFile
    //         imageUrl = fileList[0].response.url || fileList[0].response;
    //     }

    //     const payload = { ...values, image: imageUrl };

    //     if (editingProduct) {
    //         updateMutation.mutate({ id: editingProduct._id, data: payload, token }, {
    //             onSuccess: () => closeModal()
    //         });
    //     } else {
    //         createMutation.mutate({ data: payload, token }, {
    //             onSuccess: () => closeModal()
    //         });
    //     }
    // };

    const handleSubmit = async (values: any) => {
        // Logic lấy link ảnh:
        // 1. Nếu người dùng upload ảnh mới -> Lấy từ fileList[0].response
        // 2. Nếu người dùng giữ nguyên ảnh cũ -> Lấy từ editingProduct.image
        // 3. Antd Upload có cơ chế: nếu upload mới, nó có prop 'response'. Nếu ảnh cũ load lên, nó chỉ có prop 'url'.

        let imageUrl = "";

        if (fileList.length > 0) {
            const file = fileList[0];
            if (file.response) {
                // Trường hợp vừa upload xong (Antd lưu kết quả onSuccess vào biến response)
                imageUrl = file.response; // Do ở trên mình onSuccess(res.data.url)
            } else if (file.url) {
                // Trường hợp ảnh cũ load từ DB lên
                imageUrl = file.url;
            }
        }

        const payload = { ...values, image: imageUrl };

        if (editingProduct) {
            updateMutation.mutate({ id: editingProduct._id, data: payload, token }, {
                onSuccess: () => closeModal()
            });
        } else {
            createMutation.mutate({ data: payload, token }, {
                onSuccess: () => closeModal()
            });
        }
    };

    const handleDelete = (id: string) => {
        deleteMutation.mutate({ id, token });
    };

    const openModal = (record: IProduct | null = null) => {
        setEditingProduct(record);
        if (record) {
            form.setFieldsValue(record);
            if (record.image) {
                setFileList([{ uid: '-1', name: 'image.png', status: 'done', url: record.image }]);
            } else {
                setFileList([]);
            }
        } else {
            form.resetFields();
            setFileList([]);
        }
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingProduct(null);
        form.resetFields();
        setFileList([]);
    };

    // --- Columns ---
    const columns: ColumnsType<IProduct> = [
        {
            title: 'Tên sản phẩm',
            dataIndex: 'name',
            key: 'name',
            render: (text) => <b>{text}</b>
        },
        {
            title: 'Ảnh',
            dataIndex: 'image',
            key: 'image',
            render: (url) => {
                // Check xem có url không, nếu có thì render component Image
                return url ? (
                    <Image
                        src={url}
                        width={50}
                        height={50}
                        style={{ objectFit: 'cover', borderRadius: 4 }}
                        alt="Product"
                    // fallback="đường_dẫn_ảnh_lỗi_nếu_muốn"
                    />
                ) : (
                    <span>Không có ảnh</span>
                );
            },
        },
        {
            title: 'Giá',
            dataIndex: 'price',
            key: 'price',
            render: (price) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price)
        },
        {
            title: 'Tồn kho',
            dataIndex: 'stock',
            key: 'stock',
        },
        {
            title: 'Danh mục',
            dataIndex: 'category',
            key: 'category',
        },
        {
            title: 'Hành động',
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    <Button icon={<EditOutlined />} onClick={() => openModal(record)} />
                    <Popconfirm title="Bạn có chắc chắn muốn xóa?" onConfirm={() => handleDelete(record._id)}>
                        <Button icon={<DeleteOutlined />} danger />
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <div>
            <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
                <h2>Quản lý sản phẩm</h2>
                <Button type="primary" icon={<PlusOutlined />} onClick={() => openModal(null)}>
                    Thêm mới
                </Button>
            </div>

            <Table
                columns={columns}
                dataSource={productData?.data?.result || []}
                rowKey="_id"
                loading={isFetching}
                pagination={{
                    current: meta.current,
                    pageSize: meta.pageSize,
                    total: productData?.data?.meta?.total || 0,
                    showSizeChanger: true,
                }}
                onChange={handleTableChange}
            />

            <Modal
                title={editingProduct ? "Cập nhật sản phẩm" : "Thêm sản phẩm mới"}
                open={isModalOpen}
                onCancel={closeModal}
                onOk={() => form.submit()}
                confirmLoading={createMutation.isPending || updateMutation.isPending}
            >
                <Form form={form} layout="vertical" onFinish={handleSubmit}>
                    <Form.Item name="name" label="Tên sản phẩm" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>

                    <Form.Item name="price" label="Giá" rules={[{ required: true }]}>
                        <InputNumber style={{ width: '100%' }} formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} parser={value => value!.replace(/\$\s?|(,*)/g, '')} />
                    </Form.Item>

                    <Form.Item name="stock" label="Số lượng tồn">
                        <InputNumber style={{ width: '100%' }} />
                    </Form.Item>

                    <Form.Item name="category" label="Danh mục">
                        <Input />
                    </Form.Item>

                    <Form.Item name="description" label="Mô tả">
                        <Input.TextArea rows={3} />
                    </Form.Item>

                    <Form.Item label="Hình ảnh">
                        <Upload
                            customRequest={handleUpload}
                            listType="picture-card"
                            fileList={fileList}
                            onChange={({ fileList }) => setFileList(fileList)}
                            maxCount={1}
                        >
                            {fileList.length < 1 && <div><UploadOutlined /><div style={{ marginTop: 8 }}>Upload</div></div>}
                        </Upload>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default ProProductTable;