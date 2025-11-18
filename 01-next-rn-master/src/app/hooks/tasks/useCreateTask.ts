"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createTask } from "@/app/apis/tasks.api";

export const useCreateTask = (token: string) => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: async (data: any) => {
            const r = await createTask({ data, token });
            if (+r.statusCode !== 201) throw new Error(r.message || 'Create failed');
            return r.data;
        },
        onSuccess: () => qc.invalidateQueries({ queryKey: ['tasks'] }),
    });
};
