'use client';

import React, { useState } from 'react';
import { PageContainer, ProCard } from '@ant-design/pro-components';
import { Upload, message, Button, Image, List, Card, Typography, App } from 'antd';
import { InboxOutlined, CloudUploadOutlined, DeleteOutlined } from '@ant-design/icons';
import { useSession } from 'next-auth/react';
import { uploadFile } from '@/utils/api'; // Import hàm upload vừa tạo

const { Dragger } = Upload;
const { Text } = Typography;

export default function FileManagerPage() {
    const { data: session } = useSession();
    const [fileList, setFileList] = useState<any[]>([]);
    const [uploading, setUploading] = useState(false);
    const { message } = App.useApp();

    // Cấu hình cho component Upload
    const uploadProps = {
        name: 'file',
        multiple: true,
        showUploadList: false, // Tắt list mặc định để tự render cho đẹp
        customRequest: async (options: any) => {
            const { file, onSuccess, onError } = options;
            setUploading(true);

            try {
                const token = session?.user?.access_token || "";
                // Gọi API upload lên NestJS -> MinIO
                const response = await uploadFile(file, token);

                // Giả lập thêm file vào danh sách hiển thị (Thực tế nên lưu vào DB)
                const newFile = {
                    uid: file.uid,
                    name: file.name,
                    url: response.url, // URL từ MinIO trả về
                    status: 'done',
                };

                setFileList(prev => [newFile, ...prev]);
                message.success(`${file.name} upload thành công.`);
                onSuccess("Ok");
            } catch (err) {
                message.error(`${file.name} upload thất bại.`);
                onError({ err });
            } finally {
                setUploading(false);
            }
        },
    };

    return (
        <PageContainer title="Quản lý Tài liệu & Media">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                {/* CỘT TRÁI: UPLOAD AREA */}
                <div className="md:col-span-1">
                    <ProCard title="Tải lên tập tin" bordered headerBordered>
                        <Dragger {...uploadProps} disabled={uploading} style={{ padding: 20 }}>
                            <p className="ant-upload-drag-icon">
                                <InboxOutlined style={{ color: '#16a34a' }} />
                            </p>
                            <p className="ant-upload-text">Kéo thả hoặc click để tải lên</p>
                            <p className="ant-upload-hint">
                                Hỗ trợ tải lên nhiều file cùng lúc. Dung lượng tối đa 10MB.
                            </p>
                        </Dragger>
                    </ProCard>
                </div>

                {/* CỘT PHẢI: DANH SÁCH FILE */}
                <div className="md:col-span-2">
                    <ProCard title="Danh sách file vừa tải lên" bordered headerBordered>
                        {fileList.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: 40, color: '#999' }}>
                                <CloudUploadOutlined style={{ fontSize: 48, marginBottom: 16 }} />
                                <p>Chưa có file nào được tải lên</p>
                            </div>
                        ) : (
                            <List
                                grid={{ gutter: 16, xs: 1, sm: 2, md: 3, lg: 3, xl: 4, xxl: 4 }}
                                dataSource={fileList}
                                renderItem={(item) => (
                                    <List.Item>
                                        <Card
                                            hoverable
                                            cover={
                                                <div style={{ height: 150, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f5f5f5' }}>
                                                    {/* Nếu là ảnh thì hiện ảnh, không thì hiện icon */}
                                                    {item.name.match(/\.(jpeg|jpg|gif|png)$/) != null ? (
                                                        <Image
                                                            alt={item.name}
                                                            src={item.url}
                                                            style={{ objectFit: 'cover', height: '100%', width: '100%' }}
                                                        />
                                                    ) : (
                                                        <div style={{ fontSize: 40, color: '#16a34a' }}>FILE</div>
                                                    )}
                                                </div>
                                            }
                                            actions={[
                                                <DeleteOutlined key="delete" onClick={() => {
                                                    setFileList(prev => prev.filter(f => f.uid !== item.uid));
                                                    message.info('Đã xóa khỏi danh sách tạm');
                                                }} />
                                            ]}
                                            styles={{
                                                body: {
                                                    padding: 12
                                                }
                                            }}
                                        >
                                            <Card.Meta
                                                title={<Text ellipsis={{ tooltip: item.name }}>{item.name}</Text>}
                                                description={<a href={item.url} target="_blank" rel="noreferrer" style={{ color: '#16a34a' }}>Xem file</a>}
                                            />
                                        </Card>
                                    </List.Item>
                                )}
                            />
                        )}
                    </ProCard>
                </div>
            </div>
        </PageContainer>
    );
}