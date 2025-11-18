"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteTask } from "@/app/apis/tasks.api";

export const useDeleteTask = (token: string) => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: async (id: string) => {
            const r = await deleteTask({ id, token });
            if (+r.statusCode !== 200) throw new Error(r.message || 'Delete failed');
            return r.data;
        },
        onMutate: async (id: string) => {
            await qc.cancelQueries({ queryKey: ['tasks'] });
            const snapshot: any = qc.getQueryData(['tasks']);
            qc.setQueryData(['tasks'], (old: any) => {
                if (!old) return old;
                return {
                    ...old,
                    results: old.results.filter((t: any) => t._id !== id),
                };
            });
            return { snapshot };
        },
        onError: (_err, _id, ctx: any) => {
            if (ctx?.snapshot) qc.setQueryData(['tasks'], ctx.snapshot);
        },
        onSettled: () => qc.invalidateQueries({ queryKey: ['tasks'] }),
    });
};
