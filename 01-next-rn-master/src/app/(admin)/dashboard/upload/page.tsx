'use client'

import React from 'react';
import { InboxOutlined } from "@ant-design/icons";
import { message, Upload, UploadProps } from "antd";
// Import kiểu RcFile để TypeScript hiểu đúng về file object của Antd
import type { RcFile } from 'antd/es/upload';

const { Dragger } = Upload;

const UploadPage = () => {

    // Cấu hình Props nằm trong Component để dễ quản lý logic hoặc dùng Env biến
    const props: UploadProps = {
        name: 'file',
        multiple: true,
        maxCount: 10,
        accept: 'image/*,video/*,.rar,application/pdf',

        // --- 1. LOGIC VALIDATION ---
        beforeUpload: (file: RcFile, fileList: RcFile[]) => {
            // A. Check số lượng Batch (Mỗi lần thả)
            if (fileList.length > 5) {
                message.warning('Bạn chỉ được chọn tối đa 5 file cho mỗi lần upload!');
                return Upload.LIST_IGNORE;
            }

            const fileExt = file.name.split('.').pop()?.toLowerCase();
            const fileType = file.type;

            // B. Cấu hình giới hạn
            const LIMITS = {
                IMAGE: 5,   // 5MB
                PDF: 10,    // 10MB
                VIDEO: 100, // 100MB
                RAR: 50,    // 50MB
            };

            // C. Xác định loại file và gán giới hạn
            let maxLimit = 0;
            let typeName = '';
            let isValidType = false;

            if (fileType.startsWith('image/')) {
                maxLimit = LIMITS.IMAGE;
                typeName = 'Ảnh';
                isValidType = true;
            } else if (fileType.startsWith('video/')) {
                maxLimit = LIMITS.VIDEO;
                typeName = 'Video';
                isValidType = true;
            } else if (fileType === 'application/pdf') {
                maxLimit = LIMITS.PDF;
                typeName = 'PDF';
                isValidType = true;
            } else if (fileExt === 'rar') {
                maxLimit = LIMITS.RAR;
                typeName = 'RAR';
                isValidType = true;
            }

            // D. Chặn file Docs (Word)
            const isDocs = fileExt === 'doc' || fileExt === 'docx' ||
                fileType === 'application/msword' ||
                fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';

            if (isDocs) {
                message.error(`${file.name} là file Word, bị cấm!`);
                return Upload.LIST_IGNORE;
            }

            // E. Nếu không thuộc danh sách cho phép
            if (!isValidType) {
                message.error(`${file.name} sai định dạng (Chỉ nhận Ảnh, Video, PDF, RAR)!`);
                return Upload.LIST_IGNORE;
            }

            // F. CHECK DUNG LƯỢNG (Đã có biến maxLimit từ bước C)
            const isLtLimit = file.size / 1024 / 1024 < maxLimit;
            if (!isLtLimit) {
                message.error(`${file.name} quá nặng! ${typeName} tối đa ${maxLimit}MB.`);
                return Upload.LIST_IGNORE;
            }

            return true;
        },

        // --- 2. LOGIC UPLOAD (MinIO Presigned URL) ---
        customRequest: async (options) => {
            const { onSuccess, onError, file } = options;
            const targetFile = file as RcFile; // Ép kiểu cho an toàn

            try {
                // Bước 1: Gọi NestJS để lấy Presigned URL
                // Giả sử API NestJS của bạn là: POST /api/upload/presigned
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/upload/presigned`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        fileName: targetFile.name,
                        fileType: targetFile.type,
                    }),
                });

                if (!response.ok) throw new Error('Không lấy được URL upload');

                const { url } = await response.json();
                // url này là link MinIO có kèm token xác thực

                // Bước 2: Upload Binary trực tiếp lên MinIO
                const uploadResult = await fetch(url, {
                    method: 'PUT',
                    body: targetFile,
                    headers: {
                        'Content-Type': targetFile.type, // Quan trọng: Phải khớp với lúc xin presigned
                    },
                });

                if (!uploadResult.ok) throw new Error('Lỗi khi đẩy file lên MinIO');

                // Bước 3: Báo cho Antd biết đã xong
                if (onSuccess) onSuccess("ok");

            } catch (err) {
                console.error(err);
                if (onError) onError(err as Error);
                message.error(`${targetFile.name} upload thất bại.`);
            }
        },

        onChange(info) {
            const { status } = info.file;
            if (status === 'done') {
                message.success(`${info.file.name} tải lên thành công.`);
            } else if (status === 'error') {
                // Error message đã được handle trong customRequest, ở đây để log thôi
                console.log(`${info.file.name} tải lên thất bại.`);
            }
        },
    };

    return (
        <div style={{ padding: 20 }}>
            <Dragger {...props}>
                <p className="ant-upload-drag-icon">
                    <InboxOutlined />
                </p>
                <p className="ant-upload-text">Kéo thả hoặc click để chọn file</p>
                <p className="ant-upload-hint">
                    Hỗ trợ: Ảnh (5MB), PDF (10MB), RAR (50MB), Video (100MB). <br />
                    Tối đa 10 file tổng cộng. Nghiêm cấm file Word.
                </p>
            </Dragger>
        </div>
    );
}

export default UploadPage;