// src/app/apis/products.api.ts
import { sendRequest } from "@/utils/api";

export const getProducts = async ({ current, pageSize, search, token }: { current: number; pageSize: number; search: string; token: string }) => {
    return await sendRequest<IBackendRes<IModelPaginate<IProduct>>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/products`,
        method: "GET",
        queryParams: {
            current,
            pageSize,
            // Giả sử BE dùng api-query-params, search theo tên
            ...(search && { name: `/${search}/i` }),
        },
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
};

export const createProduct = async (data: any, token: string) => {
    return await sendRequest<IBackendRes<IProduct>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/products`,
        method: "POST",
        body: data,
        headers: { Authorization: `Bearer ${token}` },
    });
};

export const updateProduct = async (id: string, data: any, token: string) => {
    return await sendRequest<IBackendRes<IProduct>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/products/${id}`,
        method: "PATCH",
        body: data,
        headers: { Authorization: `Bearer ${token}` },
    });
};

export const deleteProduct = async (id: string, token: string) => {
    return await sendRequest<IBackendRes<IProduct>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/products/${id}`,
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
    });
};