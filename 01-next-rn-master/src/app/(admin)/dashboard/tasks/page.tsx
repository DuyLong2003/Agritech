// "use client";

// import TaskTable from "@/components/admin/task.table";
// import { useSearchParams } from "next/navigation";
// import { useQuery } from "@tanstack/react-query";
// import { fetchTasks, TaskMeta, Task } from "@/utils/actions";
// import { useEffect } from "react";
// import io from "socket.io-client";

// export default function TaskPage() {
//     const searchParams = useSearchParams();
//     const current = Number(searchParams.get("current") ?? 1);
//     const pageSize = Number(searchParams.get("pageSize") ?? 10);
//     const search = searchParams.get("search") ?? "";

//     //const token = typeof window !== "undefined" ? localStorage.getItem("token") ?? "" : "";

//     const { data, isLoading, refetch } = useQuery<{
//         tasks: Task[];
//         meta: TaskMeta;
//     }>({
//         queryKey: ["tasks", current, pageSize, search],
//         queryFn: () =>
//             // BỎ 'token' KHI GỌI HÀM
//             fetchTasks({ current, pageSize, search }),
//     });

//     useEffect(() => {
//         const socketURL = process.env.NEXT_PUBLIC_SOCKET_URL || "";
//         console.log("Socket connecting to:", socketURL); // Vẫn giữ log

//         const socket = io(process.env.NEXT_PUBLIC_BACKEND_URL || "", {
//             transports: ["websocket"],
//             // path: "/api/v1/socket.io/",
//         });

//         // Code debug của bạn
//         socket.on("connect", () => {
//             console.log("✅ FRONTEND: Socket connected!");
//         });
//         socket.on("connect_error", (err) => {
//             console.error("❌ FRONTEND: Socket connection error:", err.message);
//         });

//         socket.on("task:created", refetch);
//         socket.on("task:updated", refetch);
//         socket.on("task:deleted", refetch);

//         return () => {
//             socket.disconnect();
//         };
//     }, [refetch]);

//     return (
//         <div style={{ padding: 24 }}>
//             <TaskTable
//                 tasks={data?.tasks ?? []}
//                 meta={data?.meta ?? { total: 0, current, pageSize }}
//             />
//         </div>
//     );
// }

"use client";

import React, { useEffect, useRef } from "react";
import { PageContainer, ActionType } from "@ant-design/pro-components";
import io from "socket.io-client";
import { message, Spin } from "antd";
import dynamic from "next/dynamic";
import NoSSR from "@/components/NoSSR";

// FIX: Sử dụng dynamic import với ssr: false để tránh lỗi Hydration (lệch class col-8 vs col-6)
const ProTaskTable = dynamic(
    () => import("@/components/admin/ProComponent/ProTaskTable"),
    {
        ssr: false,
        loading: () => (
            // FIX: Sửa lỗi [antd: Spin] tip only work in nest...
            // Thay vì dùng prop 'tip', ta render text thủ công bên dưới
            <div style={{ padding: '100px 0', textAlign: 'center' }}>
                <Spin size="large" />
                <div style={{ marginTop: 16, color: 'rgba(0,0,0,0.45)' }}>
                    Đang tải dữ liệu...
                </div>
            </div>
        )
    }
);

export default function TaskPage() {
    const actionRef = useRef<ActionType>();

    useEffect(() => {
        const socketURL = process.env.NEXT_PUBLIC_BACKEND_URL || "";

        // Kết nối Socket
        const socket = io(socketURL, {
            transports: ["websocket"],
        });

        socket.on("connect", () => {
            console.log("✅ FRONTEND: Socket connected!");
        });

        // Hàm xử lý khi có sự kiện thay đổi dữ liệu
        const handleRefetch = () => {
            if (actionRef.current) {
                actionRef.current.reload(); // Reload bảng ProTable
                message.info("Dữ liệu vừa được cập nhật từ hệ thống");
            }
        };

        // Lắng nghe sự kiện CRUD task
        socket.on("task:created", handleRefetch);
        socket.on("task:updated", handleRefetch);
        socket.on("task:deleted", handleRefetch);

        return () => {
            socket.disconnect();
        };
    }, []);

    return (
        <NoSSR>
            <PageContainer
                title="Quản lý Công việc"
                subTitle="Theo dõi tiến độ và trạng thái dự án Agritech"
                breadcrumb={{
                    items: [
                        { path: '/dashboard', title: 'Dashboard' },
                        { title: 'Quản lý Task' },
                    ],
                }}
            >
                <ProTaskTable actionRef={actionRef} />
            </PageContainer>
        </NoSSR>
    );
}