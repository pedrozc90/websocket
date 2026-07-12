import crypto from "crypto";

export const extractBearerToken = (authorization: string | undefined): string | undefined => {
    if (typeof authorization === "string" && authorization.length) {
        const index = authorization.indexOf("Bearer");
        if (index >= 0) {
            return authorization.substring(index);
        }
    }
    return undefined;
};

export const extractCookie = (cookie: unknown, name = "AccessToken"): string | undefined => {
    if (typeof cookie === "string") {
        const prefix = `${name}=`;

        const match = cookie
            .split(";")
            .map((c) => c.trim())
            .find((c) => c.startsWith(prefix));

        // slice (not split+index) so tokens containing "=" (e.g. base64 padding) survive intact
        if (match) {
            return decodeURIComponent(match.slice(prefix.length));
        }
    }
    return undefined;
};

export const timingSafeStringEqual = (a: string, b: string): boolean => {
    const bufA = Buffer.from(a);
    const bufB = Buffer.from(b);
    if (bufA.length !== bufB.length) {
        // dummy comparison so length mismatches don't return measurably faster
        crypto.timingSafeEqual(bufA, bufA);
        return false;
    }
    return crypto.timingSafeEqual(bufA, bufB);
};

export const validateSecret = (secrets: Record<string, string>, secret: string | null | undefined): string | undefined => {
    if (typeof secret === "string" && secret.length) {
        for (const [known, name] of Object.entries(secrets)) {
            if (timingSafeStringEqual(known, secret)) {
                return name;
            }
        }
    }
    return undefined;
};
