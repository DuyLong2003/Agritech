import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateProduct } from "@/app/apis/products.api";
import { message } from "antd";

export const useUpdateProduct = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data, token }: { id: string; data: any; token: string }) =>
            updateProduct(id, data, token),
        onSuccess: (res) => {
            if (res && +res.statusCode === 200) {
                message.success("Cập nhật sản phẩm thành công");
                // Refresh lại list product để hiển thị data mới nhất
                queryClient.invalidateQueries({ queryKey: ['products'] });
            } else {
                // Trường hợp API trả về 200 nhưng logic backend báo lỗi
                message.error(res.message || "Cập nhật thất bại");
            }
        },
        onError: (error: any) => {
            message.error(error?.message || "Có lỗi xảy ra khi cập nhật");
        },
    });
};