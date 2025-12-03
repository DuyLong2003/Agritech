# Changelog

Mọi thay đổi quan trọng của dự án sẽ được ghi lại tại đây.

## [1.0.0] - 2025-12-03
### Phiên bản phát hành chính thức (MVP)

### 🚀 Tính năng mới (Features)
- **Hệ thống xác thực (Auth):** Đăng nhập/Đăng ký qua JWT, bảo mật mật khẩu với Bcrypt.
- **Quản lý Task (CRUD):** Thêm, sửa, xóa công việc; phân trang và tìm kiếm.
- **Xử lý nền (Background Job):** Tích hợp BullMQ & Redis để gửi email chào mừng (Welcome Email) bất đồng bộ.
- **Upload file:** API upload ảnh (tích hợp MinIO/S3).

### 🏗 Hạ tầng & Hiệu năng (Infrastructure & Performance)
- **Caching:** Áp dụng Redis Cache-Aside cho API danh sách, đạt Cache Hit Rate > 99%.
- **Scaling:** Cấu hình Docker Compose chạy 2 Worker song song (Horizontal Scaling).
- **Monitoring:** Tích hợp Health Check (`/health`) và UptimeRobot.
- **Logging:** Chuẩn hóa Log JSON với Pino và Correlation ID để truy vết lỗi.

### 🛡 Bảo mật (Security)
- Tích hợp **Helmet** để bảo vệ HTTP Headers.
- Cấu hình **Rate Limiting** (Throttler) chống spam/DDoS.
- Cấu hình **CORS** chặt chẽ cho Frontend.

### 🔧 Công nghệ sử dụng
- **BE:** NestJS, MongoDB, Redis, BullMQ.
- **FE:** Next.js, Ant Design, React Query.
- **DevOps:** Docker, Vercel, Render.