import io from "socket.io-client";

export const socket = io(`${process.env.NEXT_PUBLIC_BACKEND_API}`);
