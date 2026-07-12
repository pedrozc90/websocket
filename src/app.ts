import http from "http";
import SocketIO, { type Server } from "socket.io";
import { createLogger } from "./config/index.ts";
import { findUser } from "./ws/index.ts";
import type { AuthenticatedSocket } from "./types/index.ts";
import { resolveRooms } from "./utils/index.ts";

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

    io.use(async (socket: AuthenticatedSocket, next) => {
        const { query } = socket.handshake;

        const token = query?.["token"];
        if (!token) {
            return next(new Error("Unauthorized. Token is missing."));
        }

        try {
            const res = await findUser(token);
            socket.principal = {
                kind: "user",
                userId: res.userId,
                events: [],
            };
            next();
        } catch (err) {
            logger.error(`Client '${socket.id}' authenticate failed`, err);
            next(new Error("Unauthorized", { cause: err }));
        }
    });

    io.on("connection", (socket: AuthenticatedSocket) => {
        const principal = socket.principal;

        if (principal?.kind === "user") {
            logger.info(`Client '${socket.id}' connected`, { principal });

            const room = resolveRooms(principal);
            if (typeof room === "string" && room.length) {
                socket.join(room);
                logger.debug(`Socket '${socket.id} joined room '${room}'`, { principal });
            } else {
                logger.debug(`Socket '${socket.id} did not joined any room`, { principal });
            }

            // TODO: handle incoming message
            socket.on("message", (args) => {
                const payload = parsePayload(args);
                try {
                    const obj = JSON.parse(payload);
                    logger.info("Message received:", obj);
                } catch (e) {
                    logger.error("Failed to parse message payload as JSON", e, payload);
                }
            });

            // TODO: handle socket error
            socket.on("error", (args) => {
                logger.error(`Client '${socket.id}' connection failed.`, typeof args, args);
            });

            // TODO: handle pre-disconnect cleanup (rooms still available here)
            socket.on("disconnecting", (args) => {
                logger.info(`Client '${socket.id}' is disconnecting.`, typeof args, args);
            });

            // TODO: handle post-disconnect cleanup
            socket.on("disconnect", (reason: string) => {
                console.log(`Client disconnected: ${socket.id} (${reason})`);
            });

            // TODO: handle reconnect attempt (client-side event, listed for completeness)
            socket.on("reconnect_attempt", (args) => {
                logger.info(`Client '${socket.id}' is attempting connection`, typeof args, args);
            });
        }
    });

    // TODO: handle server-level io error
    io.on("error", (err: unknown) => {
        if (err instanceof Error) {
            logger.error("Server error", err);
        } else {
            logger.error("An unexpected error happened", err);
        }
    });

    return io;
};

export const createServer = (): http.Server => {
    return http.createServer((req, res) => {
        const url = req.url;
        if (url?.startsWith("/ws")) return;

        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(
            JSON.stringify({
                message: "Sanity Check",
            }),
        );
    });
};
