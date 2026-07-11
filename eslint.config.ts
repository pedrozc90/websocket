import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import json from "@eslint/json";
import { defineConfig, globalIgnores } from "eslint/config";

export default defineConfig([
    globalIgnores([
        // dependencies
        "dist/*",
        "node_modules/*",
        // test files
        "src/**/*.test.ts"
    ]),
    {
        files: ["**/*.{js,mjs,cjs,ts,mts,cts}"],
        plugins: { js },
        extends: ["js/recommended"],
        languageOptions: { globals: globals.node },
    },
    { files: ["**/*.json"], plugins: { json }, language: "json/json", extends: ["json/recommended"] },
    tseslint.configs.recommended,
    {
        rules: {
            "no-control-regex": "off",
            "@typescript-eslint/no-unused-vars": "off",
        },
    },
]);
