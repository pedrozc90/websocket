export class HttpRequestError extends Error {
    public readonly status?: number | undefined;

    constructor({ message, status, cause }: { message: string; status?: number | undefined; cause?: unknown }) {
        super(message, { cause });
        this.status = status;
    }
}
