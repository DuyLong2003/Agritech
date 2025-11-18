import { sendRequest } from "@/utils/api";

export const getTasks = async ({ current = 1, pageSize = 10, search = '', token }: any) => {
    const res = await sendRequest<IBackendRes<any>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/tasks`,
        method: 'GET',
        queryParams: { current, pageSize, search },
        headers: { Authorization: `Bearer ${token}` }
    });
    return res;
}

export const createTask = async ({ data, token }: any) => {
    const res = await sendRequest<IBackendRes<any>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/tasks`,
        method: 'POST',
        body: data,
        headers: { Authorization: `Bearer ${token}` }
    });
    return res;
}

export const updateTask = async ({ data, token }: any) => {
    const res = await sendRequest<IBackendRes<any>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/tasks`,
        method: 'PATCH',
        body: data,
        headers: { Authorization: `Bearer ${token}` }
    });
    return res;
}

export const deleteTask = async ({ id, token }: any) => {
    const res = await sendRequest<IBackendRes<any>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/tasks/${id}`,
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
    });
    return res;
}


