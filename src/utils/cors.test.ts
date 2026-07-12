import { describe, expect, test } from "vitest";
import { isOriginAllowed } from "./cors.ts";

describe("cors utils", () => {
    test("Origin 'http://localhost:4200' is allowed", () => {
        const res = isOriginAllowed("http://localhost:4200");
        expect(res).toBeTruthy();
    });

    test("Origin 'http://localhost:9000' is allowed", () => {
        const res = isOriginAllowed("http://localhost:9000");
        expect(res).toBeTruthy();
    });

    test("Origin 'http://google.com' is not allowed", () => {
        const res = isOriginAllowed("http://google.com");
        expect(res).toBeFalsy();
    });
});
