import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteProduct } from "@/app/apis/products.api";
import { message } from "antd";

export const useDeleteProduct = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, token }: { id: string; token: string }) =>
            deleteProduct(id, token),
        onSuccess: (res) => {
            if (res && +res.statusCode === 200) {
                message.success("Xóa sản phẩm thành công");
                // Refresh lại list product ngay lập tức
                queryClient.invalidateQueries({ queryKey: ['products'] });
            } else {
                message.error(res.message || "Xóa thất bại");
            }
        },
        onError: (error: any) => {
            message.error(error?.message || "Có lỗi xảy ra khi xóa");
        },
    });
};