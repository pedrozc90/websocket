import io from "socket.io-client";

const TOKEN = "Ar3kzjew5YWqCbmiQbQLYPwqKl83zunM";

const socket = io("http://localhost:4000", {
    path: "/ws",
    transports: ["websocket", "polling"],
    query: {
        token: TOKEN
    },
});

socket.on("connect", () => {
    console.log(`Socket '${socket.id}' connected`);
});

socket.on("disconnect", (reason: unknown) => {
    console.log("Socket disconnected:", reason);
});

// Example: listen for a custom event from server
socket.on("message", (data: unknown) => {
    console.log("Message received:", data);
    socket.emit("message", data);
});

socket.on("error", (err: Error) => {
    console.error("Socket connection error:", err);
});
