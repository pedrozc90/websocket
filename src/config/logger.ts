import winston from "winston";
import { settings } from "./settings.ts";
import { fitWidth, stringify } from "../utils/string.ts";

const formatter = winston.format.printf(({ level, message, timestamp, service, module, ...meta }) => {
    const levelCol = fitWidth("[" + level + "]", 7);
    const extra = Object.keys(meta).length ? ` ${stringify(meta)}` : "";
    return `${timestamp} ${levelCol} ${service} ${message}${extra}`;
});

export const logger = winston.createLogger({
    level: settings.logger.level,
    format: winston.format.combine(winston.format.timestamp(), winston.format.splat(), formatter),
    defaultMeta: {
        service: settings.name,
    },
    transports: [
        new winston.transports.Console({
            format: winston.format.combine(winston.format.colorize(), formatter),
        }),
        new winston.transports.File({ filename: "logs/application.log" }),
    ],
});

export const createLogger = (name: string) => {
    return logger.child({ module: name });
};
