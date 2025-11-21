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
    assignee: string;
    dueDate: Date;
}

// Định nghĩa lại type params
interface FetchTasksParams {
    current: number;
    pageSize: number;
    search?: string;
    status?: string;
    assignee?: string;
}

export async function fetchTasks(params: FetchTasksParams): Promise<{ tasks: Task[]; meta: TaskMeta }> {
    const session = await auth();
    const token = session?.user?.access_token;

    if (!token) {
        console.error("fetchTasks Error: Not authenticated");
        return { tasks: [], meta: { total: 0, current: 1, pageSize: 10 } };
    }

    const { current, pageSize, search, status, assignee } = params;

    const query = new URLSearchParams();
    query.set("current", current.toString());
    query.set("pageSize", pageSize.toString());

    // Chỉ append nếu có giá trị
    if (search) query.set("search", search); // Backend thường map search này với title
    if (status) query.set("status", status);
    if (assignee) query.set("assignee", assignee);

    // API URL: http://backend/api/v1/tasks?current=1&pageSize=10&status=doing...
    const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/tasks?${query.toString()}`;

    try {
        const res = await fetch(url, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            cache: "no-store", // Đảm bảo không cache dữ liệu cũ
            next: { tags: ["list-tasks"] } // Nếu dùng Next.js Cache
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
    } catch (error) {
        console.error("Fetch error:", error);
        return { tasks: [], meta: { total: 0, current, pageSize } };
    }
}
