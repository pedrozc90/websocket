export const toInt = (value: unknown): number | undefined => {
    if (typeof value === "number" && Number.isFinite(value)) {
        return Math.trunc(value);
    }
    if (typeof value === "string" && value.length) {
        const result = parseInt(value.trim(), 10);
        if (!Number.isNaN(result)) {
            return result;
        }
    }
    return undefined;
};

export const toBigInt = (value: unknown): bigint | undefined => {
    if (typeof value === "bigint") return value;
    if (typeof value === "number" && Number.isInteger(value)) {
        return BigInt(value);
    }
    if (typeof value === "string") {
        try {
            return BigInt(value.trim());
        } catch (err) {
            console.error(`Error while converting '${value}' to bigint.`, err);
        }
    }
    return undefined;
};
