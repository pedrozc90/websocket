const ANSI_PATTERN = /\x1b\[[0-9;]*m/g;

const visibleLength = (str: string): number => {
    return str.replace(ANSI_PATTERN, "").length;
};

export const truncate = (str: string, maxWidth: number, suffix = "…"): string => {
    if (visibleLength(str) <= maxWidth) return str;
    const cutoff = Math.max(0, maxWidth - suffix.length);
    return str.slice(0, cutoff) + suffix;
};

export const padEnd = (str: string, width: number): string => {
    return str + " ".repeat(Math.max(0, width - visibleLength(str)));
};

export const fitWidth = (str: string, width: number, suffix = "…"): string => {
    return padEnd(truncate(str, width, suffix), width);
};

export const stringify = (value: unknown): string => {
    return JSON.stringify(value, undefined, 1).replace(/\n\s*/g, " ");
};
