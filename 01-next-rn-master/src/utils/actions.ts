'use server'

import { auth, signIn } from "@/auth";
import { revalidateTag } from 'next/cache'
import { sendRequest } from "./api";


export async function authenticate(username: string, password: string) {
    try {
        const r = await signIn("credentials", {
            username: username,
            password: password,
            // callbackUrl: "/",
            redirect: false,
        })
        console.log(">>> check r: ", r)
        return r;
    } catch (error) {
        if ((error as any).name === "InvalidEmailPasswordError") {
            return {
                error: (error as any).type,
                code: 1
            }

        } else if ((error as any).name === "InactiveAccountError") {
            return {
                error: (error as any).type,
                code: 2
            }
        } else {
            return {
                error: "Internal server error",
                code: 0
            }
        }

    }
}

export const handleCreateUserAction = async (data: any) => {
    const session = await auth();
    const res = await sendRequest<IBackendRes<any>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/users`,
        method: "POST",
        headers: {
            Authorization: `Bearer ${session?.user?.access_token}`,
        },
        body: { ...data }
    })
    revalidateTag("list-users")
    return res;
}

export const handleUpdateUserAction = async (data: any) => {
    const session = await auth();
    const res = await sendRequest<IBackendRes<any>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/users`,
        method: "PATCH",
        headers: {
            Authorization: `Bearer ${session?.user?.access_token}`,
        },
        body: { ...data }
    })
    revalidateTag("list-users")
    return res;
}

export const handleDeleteUserAction = async (id: any) => {
    const session = await auth();
    const res = await sendRequest<IBackendRes<any>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/users/${id}`,
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${session?.user?.access_token}`,
        },
    })

    revalidateTag("list-users")
    return res;
}

export const handleCreateTaskAction = async (data: any) => {
    const session = await auth();
    const res = await sendRequest<IBackendRes<any>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/tasks`,
        method: "POST",
        headers: { Authorization: `Bearer ${session?.user?.access_token}` },
        body: { ...data }
    });
    revalidateTag("list-tasks");
    return res;
}

export const handleUpdateTaskAction = async (data: any) => {
    const session = await auth();
    const res = await sendRequest<IBackendRes<any>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/tasks`,
        method: "PATCH",
        headers: { Authorization: `Bearer ${session?.user?.access_token}` },
        body: { ...data }
    });
    revalidateTag("list-tasks");
    return res;
}

export const handleDeleteTaskAction = async (id: any) => {
    const session = await auth();
    const res = await sendRequest<IBackendRes<any>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/tasks/${id}`,
        method: "DELETE",
        headers: { Authorization: `Bearer ${session?.user?.access_token}` },
    });
    revalidateTag("list-tasks");
    return res;
}


export interface TaskMeta {
    total: number;
    pageSize: number;
    current: number;
}

export interface Task {
    id: number;
    title: string;
    description?: string;
    status: string;
}

export async function fetchTasks(
    // BỎ 'token: string' khỏi tham số
    params: { current: number; pageSize: number; search: string }
): Promise<{ tasks: Task[]; meta: TaskMeta }> {

    // BƯỚC 1: LẤY SESSION TRÊN SERVER
    const session = await auth();
    const token = session?.user?.access_token; // Giả sử token nằm ở đây

    // Nếu không có token (chưa đăng nhập), báo lỗi
    if (!token) {
        console.error("fetchTasks Error: Not authenticated");
        return { tasks: [], meta: { total: 0, current: 1, pageSize: 10 } };
    }

    // BƯỚC 2: LOGIC CŨ CỦA BẠN
    const { current, pageSize, search } = params;

    const query = new URLSearchParams();
    query.set("current", current.toString());
    query.set("pageSize", pageSize.toString());
    if (search) query.set("search", search);

    const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/tasks?${query.toString()}`;

    // DÒNG DEBUG: Kiểm tra xem server gọi đi đâu
    console.log(`[Server Action fetchTasks] Calling: ${url} with token: ${token.substring(0, 10)}...`);

    const res = await fetch(url, {
        headers: {
            // BƯỚC 3: DÙNG TOKEN TỪ SESSION
            Authorization: `Bearer ${token}`, // <-- SỬA Ở ĐÂY
            "Content-Type": "application/json",
        },
    });

    if (!res.ok) {
        console.error(`Fetch tasks failed: ${res.status}`);
        return { tasks: [], meta: { total: 0, current, pageSize } };
    }

    const jsonResponse = await res.json();
    const data = jsonResponse.data?.data;

    return {
        tasks: data?.results ?? [],
        meta: data?.meta ?? { total: 0, current, pageSize },
    };
}

