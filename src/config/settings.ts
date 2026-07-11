import pkg from "../../package.json" with { type: "json" };
import type { Environment, LoggerSettings, LogLevel, Settings } from "../types/index.ts";
import { optionalEnv } from "../utils/index.ts";

const environment = optionalEnv("NODE_ENV", "development");
const port = optionalEnv("PORT", 4000);

const createLoggerSettings = (): LoggerSettings => {
    return {
        level: optionalEnv("LOGGER_LEVEL", "debug").toLowerCase() as LogLevel,
    };
};

export const settings: Settings = {
    name: pkg.name,
    version: pkg.version,
    environment: environment as Environment,
    port: port,
    logger: createLoggerSettings(),
};
