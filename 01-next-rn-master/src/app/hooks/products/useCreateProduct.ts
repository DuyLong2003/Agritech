// src/app/hooks/products/useCreateProduct.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createProduct } from "@/app/apis/products.api";
import { message } from "antd";

export const useCreateProduct = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ data, token }: { data: any, token: string }) => createProduct(data, token),
        onSuccess: () => {
            message.success("Tạo sản phẩm thành công");
            queryClient.invalidateQueries({ queryKey: ['products'] }); // Refresh list
        },
        onError: (error: any) => {
            message.error(error?.message || "Có lỗi xảy ra");
        }
    });
};