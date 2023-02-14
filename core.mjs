// let crypto = null
const crypto =
    (typeof window !== "undefined")
    ? window.crypto
    : (await import("node:crypto")).default

const offset = BigInt(8640000000000000)
const maxValid = offset * 2n
const intBytes = (bytes) => (
    (bytes[0] * 4294967296)
    + (bytes[1] * 16777216)
    + (bytes[2] * 65536)
    + (bytes[3] * 256)
    + (bytes[4])
)
const base32 = (bytes) =>
    intBytes(bytes)
    .toString(32)
    .padStart(8, "0")
const formatBytes = (bytes) => {
    const a = base32(bytes.slice(0, 5))
    const b = base32(bytes.slice(5, 10))
    const c = base32(bytes.slice(10))

    return `${a}${b}${c}`
}
const idRegex = /^[a-v0-9]{15}$/
const genID = (id) => {
    if (typeof id === "string" && idRegex.test(id) === true) {
        return id
    }
    if (id?.constructor === Uint8Array && id.length === 15) {
        return formatBytes(id)
    }
    const randomID = new Uint8Array(15)
    crypto.getRandomValues(randomID)
    return formatBytes(randomID)
}
const genTime = (time) => {
    const source = (time ?? Date.now()).valueOf()
    const valid = (
        source.constructor === BigInt
        || (
            source.constructor === Number
            && isNaN(source) === false
        )
    )
    if (valid === false) {
        return { error: "Invalid timestamp" }
    }
    const timestamp = BigInt(source) + offset

    if (timestamp < 0n || timestamp > maxValid) {
        return { error: "timestamp out of valid range" }
    }

    return timestamp.toString(32).padStart(11, "0")
}
const asuid = (time = null, id = null) => {
    const timePart = genTime(time)
    const idPart = genID(id)

    if (timePart.error !== undefined) {
        return { error: [timePart.error] }
    }

    return `${timePart}${idPart}`
}

const alphabet = "0123456789abcdefghijklmnopqrstuv"
const alphaMap = [...alphabet].reduce(
    (map, ch, index) => {
        map[ch] = BigInt(index)
        return map
    },
    {}
)
const parse32 = (str) => {
    let value = 0n
    for (let i = 0; i < 11; i += 1) {
        value = (value * 32n) + alphaMap[str.charAt(i)]
    }
    return value
}
const parse = (asuid) => {
    const time = Number(
        parse32(asuid) - offset
    )

    return {
        time,
        date: new Date(time),
        id: asuid.slice(11),
        source: asuid
    }
}

asuid.parse = parse

// export const init = (crypt) => crypto = crypt
export default asuid
