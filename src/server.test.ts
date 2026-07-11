import { test, describe, before, after } from "node:test";
import assert from "node:assert/strict";
import type { AddressInfo } from "node:net";
import { createServer } from "./server.ts";

describe("http server", () => {
    let server: ReturnType<typeof createServer>;
    let baseUrl: string;

    before(async () => {
        server = createServer();
        await new Promise<void>((resolve) => server.listen(0, "127.0.0.1", resolve));
        const { port } = server.address() as AddressInfo;
        baseUrl = `http://127.0.0.1:${port}`;
    });

    after(async () => {
        await new Promise<void>((resolve, reject) => {
            server.close((err) => (err ? reject(err) : resolve()));
        });
    });

    test("responds with 200 and correct content-type", async () => {
        const res = await fetch(`${baseUrl}/`);
        assert.strictEqual(res.status, 200);
        assert.strictEqual(res.headers.get("content-type"), "application/json");
    });

    test("responds with sanity check message", async () => {
        const res = await fetch(`${baseUrl}/`);
        const body = await res.json();
        assert.deepStrictEqual(body, { message: "Sanity Check" });
    });

    test("responds the same regardless of path/method (current behavior)", async () => {
        const res = await fetch(`${baseUrl}/anything`, { method: "POST" });
        assert.strictEqual(res.status, 200);
    });
});
