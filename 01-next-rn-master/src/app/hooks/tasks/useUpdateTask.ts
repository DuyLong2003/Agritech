"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateTask } from "@/app/apis/tasks.api";

export const useUpdateTask = (token: string) => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: async (data: any) => {
            const r = await updateTask({ data, token });
            if (+r.statusCode !== 200) throw new Error(r.message || 'Update failed');
            return { data: r.data, updated: data };
        },
        onMutate: async (newData: any) => {
            await qc.cancelQueries({ queryKey: ['tasks'] });
            const snapshot: any = qc.getQueryData(['tasks']);
            qc.setQueryData(['tasks'], (old: any) => {
                if (!old) return old;
                return {
                    ...old,
                    results: old.results.map((t: any) => (t._id === newData._id ? { ...t, ...newData } : t)),
                };
            });
            return { snapshot };
        },
        onError: (_err, _vars, ctx: any) => {
            if (ctx?.snapshot) qc.setQueryData(['tasks'], ctx.snapshot);
        },
        onSettled: () => qc.invalidateQueries({ queryKey: ['tasks'] }),
    });
};
