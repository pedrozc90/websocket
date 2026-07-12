import { describe, test } from "node:test";
import assert from "node:assert";
import { extractBearerToken, extractCookie, timingSafeStringEqual, validateSecret } from "./auth.ts";

describe("cookies utils", () => {
    const secrets: Record<string, string> = {
        secret: "name",
    };

    test("Extract bearer token", () => {
        const authorization = "Bearer TOKEN";
        const result = extractBearerToken(authorization);
        assert.strictEqual(result, "TOKEN");
    });

    test("Extract token from 'AccessToken' cookie", () => {
        const headers: Record<string, unknown> = {
            cookie: "AccessToken=TOKEN",
        };
        const res = extractCookie(headers);
        assert.strictEqual(res, "TOKEN");
    });

    test("'a' and 'b' are not equal secrets", () => {
        const res = timingSafeStringEqual("a", "b");
        assert.strictEqual(res, false);
    });

    test("'none' matches with environment SECRET", () => {
        const res = validateSecret(secrets, "secret");
        assert.strictEqual(res, true);
    });
});
