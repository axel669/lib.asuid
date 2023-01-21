import asuid from "../node.mjs"

export const test = async ({Section, Assert}) => {
    const baseTime = Date.now()

    Section `no args`
    asuid()

    Section `unique timestamp`
    const zeros = new Uint8Array(15)
    const first = asuid(baseTime, zeros)
    const second = asuid(baseTime + 1, zeros)

    Assert(typeof first)
        .eq("string")
    Assert(first)
        .neq(second)

    Section `date arg`
    const now = new Date()
    const nowts = now.getTime()
    const nowid = asuid(now)
    Assert(nowid)
        .neq(null)
        (asuid.parse)`time`.eq(nowts)

    Section `supplied id`
    const stringid = "1234567890abcde"
    const third = asuid(null, stringid)

    Assert(first.slice(11))
        .eq(second.slice(11))
        .eq("0".repeat(24))
    Assert(third.slice(11))
        .eq(stringid)

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

    Section `invalid time`
    const nan = asuid(new Date(NaN))
    const overRange = asuid(
        BigInt(Number.MAX_SAFE_INTEGER) + 1n
    )
    const underRange = asuid(
        BigInt(Number.MIN_SAFE_INTEGER) - 1n
    )

    Assert(nan)
        `error`.neq(undefined)
    Assert(overRange)
        `error`.neq(undefined)
    Assert(underRange)
        `error`.neq(undefined)

    Section `invalid argument type`
    Assert(asuid(/time/))
        `error`.neq(undefined)
    Assert(asuid([]))
        `error`.neq(undefined)
    Assert(asuid({}))
        `error`.neq(undefined)
    Assert(asuid(true))
        `error`.neq(undefined)
}
