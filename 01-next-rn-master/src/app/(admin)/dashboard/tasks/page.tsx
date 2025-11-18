"use client";

import TaskTable from "@/components/admin/task.table";
import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { fetchTasks, TaskMeta, Task } from "@/utils/actions";
import { useEffect } from "react";
import io from "socket.io-client";

export default function TaskPage() {
    const searchParams = useSearchParams();
    const current = Number(searchParams.get("current") ?? 1);
    const pageSize = Number(searchParams.get("pageSize") ?? 10);
    const search = searchParams.get("search") ?? "";

    //const token = typeof window !== "undefined" ? localStorage.getItem("token") ?? "" : "";

    const { data, isLoading, refetch } = useQuery<{
        tasks: Task[];
        meta: TaskMeta;
    }>({
        queryKey: ["tasks", current, pageSize, search],
        queryFn: () =>
            // BỎ 'token' KHI GỌI HÀM
            fetchTasks({ current, pageSize, search }),
    });

    useEffect(() => {
        const socketURL = process.env.NEXT_PUBLIC_SOCKET_URL || "";
        console.log("Socket connecting to:", socketURL); // Vẫn giữ log

        const socket = io(process.env.NEXT_PUBLIC_BACKEND_URL || "", {
            transports: ["websocket"],
            // path: "/api/v1/socket.io/",
        });

        // Code debug của bạn
        socket.on("connect", () => {
            console.log("✅ FRONTEND: Socket connected!");
        });
        socket.on("connect_error", (err) => {
            console.error("❌ FRONTEND: Socket connection error:", err.message);
        });

        socket.on("task:created", refetch);
        socket.on("task:updated", refetch);
        socket.on("task:deleted", refetch);

        return () => {
            socket.disconnect();
        };
    }, [refetch]);

    return (
        <div style={{ padding: 24 }}>
            <TaskTable
                tasks={data?.tasks ?? []}
                meta={data?.meta ?? { total: 0, current, pageSize }}
            />
        </div>
    );
}
