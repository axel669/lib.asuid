import asuid from "../node.mjs"

export const test = async ({Section, Assert}) => {
    const baseTime = Date.now()

    Section `no args`
    asuid()

    Section `unique timestamp`
    const zeros = new Uint8Array(15)
    const first = asuid(baseTime, zeros)
    const second = asuid(baseTime + 1, zeros)

    Assert(first)
        .neq(second)

    Section `sortable`
    const times = [
        asuid(baseTime),
        asuid(baseTime + 1),
        asuid(baseTime - 420),
        asuid(baseTime + 69),
    ]
    times.sort()
    const sorted = times.map(asuid.parse)

    Assert(sorted)
        `0.time`.eq(baseTime - 420)
        `1.time`.eq(baseTime)
        `2.time`.eq(baseTime + 1)
        `3.time`.eq(baseTime + 69)
}
