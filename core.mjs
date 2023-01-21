let crypto = null

const offset = BigInt(8640000000000000)
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
const genID = (id) => {
    if (id?.constructor === Uint8Array && id.length === 15) {
        return formatBytes(id)
    }
    const randomID = new Uint8Array(15)
    crypto.getRandomValues(randomID)
    return formatBytes(randomID)
}
const genTime = (time) =>
    (
        BigInt(time ?? Date.now())
        + offset
    )
    .toString(32)
    .padStart(11, "0")
const asuid = (time = null, id = null) =>
    `${genTime(time)}${genID(id)}`

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

export const init = (crypt) => crypto = crypt
export default asuid
