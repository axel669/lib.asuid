export default [
    {
        input: "lib/browser.js",
        output: {
            file: "dist/browser.cjs",
            format: "iife",
            name: "asuid"
        }
    },
    {
        input: "lib/browser.js",
        output: {
            file: "dist/browser.js",
            format: "esm"
        }
    },
    {
        input: "lib/node.js",
        output: {
            file: "dist/node.js",
            format: "esm"
        },
        external: ["node:crypto"]
    },
]
