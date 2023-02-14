#! /usr/bin/env node
import asuid from "./core.mjs"

const count = parseInt(process.argv[2] ?? "1")

for (const _ of Array.from({ length: count })) {
    console.log(asuid())
}
