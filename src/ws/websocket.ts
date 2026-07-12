import http from "http";
import SocketIO, { type Server, type Socket } from "socket.io";
import { createLogger } from "../config/index.ts";
import { findUser } from "./auth.ts";

interface AuthedSocket extends Socket {
    userId?: number;
}

const logger = createLogger("ws");

const parsePayload = (value: unknown): string => {
    if (Buffer.isBuffer(value)) {
        return value.toString("utf8");
    }

    if (typeof value === "string") {
        return value;
    }

    if (Array.isArray(value)) {
        return Buffer.from(value).toString("utf8");
    }

    if (
        typeof value === "object" &&
        value !== null &&
        "type" in value &&
        "data" in value &&
        (value as { type: unknown }).type === "Buffer" &&
        Array.isArray((value as { data: unknown }).data)
    ) {
        return Buffer.from((value as { data: number[] }).data).toString("utf8");
    }

    return JSON.stringify(value);
};

export const createWebSocketServer = (server: http.Server): Server => {
    const io = SocketIO(server, {
        path: "/ws",
        transports: ["websocket", "polling"],
        pingInterval: 25_000,
        pingTimeout: 60_000,
        upgradeTimeout: 60_000,
        origins: "*:*",
        handlePreflightRequest: (req, res) => {
            const origin = req.headers.origin;
            res.writeHead(200, {
                "Access-Control-Allow-Origin": origin ?? "*",
                "Access-Control-Allow-Credentials": "true",
                "Access-Control-Allow-Headers": "Content-Type, Authorization",
            });
            res.end();
        },
    });

    io.use(async (socket: AuthedSocket, next) => {
        const { query } = socket.handshake;

        const token = query?.["token"];
        if (!token) {
            return next(new Error("Unauthorized. Token is missing."));
        }

        try {
            const res = await findUser(token);
            socket.userId = res.userId;
            next();
        } catch (err) {
            logger.error(`Client '${socket.id}' authenticate failed`, err);
            next(new Error("Unauthorized", { cause: err }));
        }
    });

    io.on("connection", (socket: AuthedSocket) => {
        logger.info(`Client '${socket.id}' connected`, { usedId: socket.userId });

        socket.join(`user:${socket.userId}`);

        socket.on("message", (args) => {
            // TODO: handle incoming message
            const payload = parsePayload(args);
            try {
                const obj = JSON.parse(payload);
                logger.info("Message received:", obj);
            } catch (e) {
                logger.error("Failed to parse message payload as JSON", e, payload);
            }
        });

        socket.on("error", (args) => {
            // TODO: handle socket error
            logger.error(`Client '${socket.id}' connection failed.`, typeof args, args);
        });

        socket.on("disconnecting", (args) => {
            // TODO: handle pre-disconnect cleanup (rooms still available here)
            logger.info(`Client '${socket.id}' is disconnecting.`, typeof args, args);
        });

        socket.on("disconnect", (reason: string) => {
            console.log(`Client disconnected: ${socket.id} (${reason})`);
            // TODO: handle post-disconnect cleanup
        });

        socket.on("reconnect_attempt", (args) => {
            // TODO: handle reconnect attempt (client-side event, listed for completeness)
            logger.info(`Client '${socket.id}' is attempting connection`, typeof args, args);
        });

        // send message back to user
        io.to(`user:${socket.userId}`).emit("message", { message: "Sanity Check" });
    });

    io.on("error", (err: unknown) => {
        // TODO: handle server-level io error
        if (err instanceof Error) {
            logger.error("Server error", err);
        } else {
            logger.error("An unexpected error happened", err);
        }
    });

    return io;
};
