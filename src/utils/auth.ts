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
