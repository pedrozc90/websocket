import { settings, logger } from "./config/index.ts";
import { createServer } from "./server.ts";

const { environment, port, version } = settings;

const server = createServer();

server.listen(port, "0.0.0.0");

server.on("listening", () => {
    if (!server.listening) return;

    const addr = server.address();
    logger.info("Address:", addr);

    const bind = addr ? (typeof addr === "string" ? `Pipe ${addr}` : `http://${addr.address}:${addr.port}`) : null;

    logger.info("----------------------------------------------------------------------");
    logger.info(`Application running on ${bind}`);
    logger.info("To shut it down, press CTRL + C at any time.");
    logger.info("----------------------------------------------------------------------");
    logger.info(`Process PID: ${process.pid}`);
    logger.info(`Environment: ${environment}`);
    logger.info(`Version    : ${version}`);
    logger.info("----------------------------------------------------------------------");
});

server.on("error", (err: Error) => {
    const syscall = "syscall" in err ? err.syscall : null;
    if (syscall !== "listen") {
        throw err;
    }

    const bind: string = typeof port === "string" ? "Pipe " + port : "Port " + port;
    const code = "code" in err ? err.code : null;

    // handle specific listen errors with friendly messages
    switch (code) {
        case "EACCES": {
            console.error(bind + " requires elevated privileges");
            return process.exit(1);
        }
        case "EADDRINUSE": {
            console.error(bind + " is already in use");
            return process.exit(1);
        }
        default:
            throw err;
    }
});

let shuttingDown: boolean = false;

const shutdown = async (signal: string): Promise<void> => {
    if (shuttingDown) return;
    shuttingDown = true;

    logger.info(`${signal} received. Shutting down gracefully...`);

    const forceExitTimer = setTimeout(() => {
        logger.info("Graceful shutdown timed out. Forcing exit.");
        process.exit(1);
    }, 10_000);

    forceExitTimer.unref();

    try {
        await new Promise<void>((resolve, reject) => {
            server.close((error) => {
                if (error) {
                    return reject(error);
                }
                resolve();
            });
        });

        logger.info("Shutdown complete");
        process.exit(0);
    } catch (e) {
        console.error("Error during shutdown:", e);
        process.exit(1);
    }
};

process.on("SIGINT", () => void shutdown("SIGINT"));
process.on("SIGTERM", () => void shutdown("SIGTERM"));
