import { io } from "socket.io-client";

const socket = io(process.env.NEXT_PUBLIC_WS_URL!, {
    transports: ["websocket"],
});

export default socket;
