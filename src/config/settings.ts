import pkg from "../../package.json" with { type: "json" };
import type { CorsSettings, Environment, LoggerSettings, LogLevel, Settings } from "../types/index.ts";
import { optionalEnv, patternToRegExp } from "../utils/index.ts";

const environment = optionalEnv("NODE_ENV", "development");
const port = optionalEnv("PORT", 4000);

const createLoggerSettings = (): LoggerSettings => {
    return {
        level: optionalEnv("LOGGER_LEVEL", "debug").toLowerCase() as LogLevel,
    };
};

const createCorsSettings = (): CorsSettings => {
    const allowedOrigins = optionalEnv("ALLOWED_ORIGINS", "*")
        .split(/[,|;]/g)
        .map((o) => patternToRegExp(o.trim()));
    return {
        allowedOrigins: allowedOrigins,
    };
};

export const settings: Settings = {
    name: pkg.name,
    version: pkg.version,
    environment: environment as Environment,
    port: port,
    cors: createCorsSettings(),
    logger: createLoggerSettings(),
};
