'use client';

import { useTaskSocket } from '@/utils/customHook';

interface TaskSocketWrapperProps {
    token: string;
    children: React.ReactNode;
}

export default function TaskSocketWrapper({ token, children }: TaskSocketWrapperProps) {
    useTaskSocket(token); // Hook sẽ lắng nghe event

    return <>{children}</>;
}
