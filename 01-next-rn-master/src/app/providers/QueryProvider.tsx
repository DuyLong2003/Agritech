"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useState } from "react";

export default function QueryProvider({ children }: { children: React.ReactNode }) {
    const [qc] = useState(
        () =>
            new QueryClient({
                defaultOptions: {
                    queries: {
                        retry: 3,
                        retryDelay: attempt => Math.min(1000 * 2 ** attempt, 30000),
                        refetchOnWindowFocus: false,
                        staleTime: 5000,
                    },
                    mutations: {
                        retry: 2,
                        retryDelay: attempt => Math.min(500 * 2 ** attempt, 30000),
                    },
                },
            })
    );

    return (
        <QueryClientProvider client={qc}>
            {children}
            <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
    );
}
