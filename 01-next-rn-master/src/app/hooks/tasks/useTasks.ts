"use client";
import { useQuery } from "@tanstack/react-query";
import { getTasks } from "@/app/apis/tasks.api";

export const useTasks = ({ current = 1, pageSize = 10, search = '', token }: any) => {
    return useQuery({
        queryKey: ['tasks', { current, pageSize, search }],
        queryFn: async () => {
            const r = await getTasks({ current, pageSize, search, token });
            if (+r.statusCode !== 200) throw new Error(r.message || 'Get tasks failed');
            return r.data;
        },
        retry: 3,
        retryDelay: attempt => Math.min(1000 * 2 ** attempt, 30000),
    });
};
