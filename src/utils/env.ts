export function optionalEnv(name: string): string | undefined;
export function optionalEnv(name: string, defaultValue: string): string;
export function optionalEnv(name: string, defaultValue: number): number;
export function optionalEnv(name: string, defaultValue?: string | number): string | number | undefined {
    const value = process.env[name];
    if (value === undefined) return defaultValue;
    if (typeof defaultValue === "number") {
        const parsed = parseInt(value, 10);
        return Number.isNaN(parsed) ? defaultValue : parsed;
    }
    return value;
}

export const requireEnv = (name: string): string => {
    const value = optionalEnv(name);
    if (value === undefined) {
        throw new Error(`Environment '${name}' is not configured`);
    }
    return value;
};
