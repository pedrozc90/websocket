export type Environment = "development" | "stage" | "production" | "test";

export type LogLevel = "debug" | "info" | "error" | "warn";

export interface LoggerSettings {
    level: LogLevel;
}

export interface Settings {
    name: string;
    version: string;
    environment: Environment;
    port: number;
    logger: LoggerSettings;
}
