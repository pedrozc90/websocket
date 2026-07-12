import { describe, expect, test } from "vitest";
import { stringify } from "./strings.ts";

describe("string utils", () => {
    test("stringy json", () => {
        const obj = {
            name: "string",
            version: 1,
            number: 1n,
        };
        const result = stringify(obj);
        expect(result).toBeTypeOf("string");
    });
});
