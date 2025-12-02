// src/app/hooks/products/useProducts.ts
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { getProducts } from "@/app/apis/products.api";

export const useProducts = ({ current, pageSize, search, token }: { current: number; pageSize: number; search: string; token: string }) => {
    return useQuery({

        queryKey: ['products', { current, pageSize, search }],
        queryFn: () => getProducts({ current, pageSize, search, token }),
        placeholderData: keepPreviousData, // Giữ data cũ khi chuyển trang để không bị nháy loading
        enabled: !!token, // Chỉ fetch khi có token
    });
};