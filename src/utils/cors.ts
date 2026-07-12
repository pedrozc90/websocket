import { settings } from "../config/index.ts";

/**
 * Converts a wildcard pattern like "*.contare.app" or "*.hub.contare.app"
 * into a RegExp that matches an origin's hostname exactly.
 * "*" matches exactly one subdomain label (no dots), mirroring typical
 * cert/CORS wildcard semantics.
 */
export const patternToRegExp = (pattern: string): RegExp => {
    const escaped = pattern
        .split(".")
        .map((label) => (label === "*" ? "[^.]+" : label.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")))
        .join("\\.");
    const regexp = new RegExp(`^${escaped}$`);
    console.log("PATTERN:", pattern, "ESCAPED", escaped, "REGEXP", regexp);
    return regexp;
};

export const isOriginAllowed = (origin: string | undefined): boolean => {
    if (!origin) return false;

    let hostname: string;
    try {
        hostname = new URL(origin).hostname;
    } catch {
        return false;
    }

    return settings.cors.allowedOrigins.length > 0 && settings.cors.allowedOrigins.some((origin) => origin.test(hostname));
};
