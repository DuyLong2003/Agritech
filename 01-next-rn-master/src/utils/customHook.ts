import { useState, useEffect } from 'react';
import { io, Socket } from 'socket.io-client';

export const useHasMounted = () => {
    const [hasMounted, setHasMounted] = useState<boolean>(false);
    useEffect(() => {
        setHasMounted(true);
    }, []);

    return hasMounted;
}

// Singleton socket
let socket: Socket | null = null;

// Khởi tạo socket (có thể nhận token)
export const initSocket = (token: string) => {
    if (!socket) {
        socket = io(process.env.NEXT_PUBLIC_BACKEND_URL!, {
            transports: ['websocket'],
            auth: { token },
        });

        socket.on('connect', () => console.log('✅ Socket connected:', socket!.id));
        socket.on('disconnect', () => console.log('❌ Socket disconnected'));
    }
    return socket;
};

// Hook lắng nghe task
export const useTaskSocket = (token: string) => {
    useEffect(() => {
        if (!token) return;

        const s = initSocket(token);

        const handleTaskCreated = (task: any) => {
            console.log('📌 Task created event received:', task);
        };

        s.on('task:created', handleTaskCreated);

        return () => {
            s.off('task:created', handleTaskCreated);
            // Không disconnect singleton
        };
    }, [token]);
};