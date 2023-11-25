import base32 from "./base32.js"

const offset = BigInt(8640000000000000)
const maxValid = offset * 2n

const formatBytes = (bytes) => {
    const a = base32.encode(bytes.slice(0, 5))
    const b = base32.encode(bytes.slice(5, 10))
    const c = base32.encode(bytes.slice(10))

    return `${a}${b}${c}`
}
const idRegex = /^[a-v0-9]{15}$/
const genID = (id, randomBytes) => {
    if (typeof id === "string" && idRegex.test(id) === true) {
        return id
    }
    if (id?.constructor === Uint8Array && id.length === 15) {
        return formatBytes(id)
    }
    return formatBytes(
        randomBytes()
    )
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
const create = (randomBytes, time, id) => {
    const timePart = genTime(time)
    const idPart = genID(id, randomBytes)

    if (timePart.error !== undefined) {
        return { error: [timePart.error] }
    }

    return `${timePart}${idPart}`
}

const parse = (asuid) => {
    const time = Number(
        base32.decode(asuid) - offset
    )

    return {
        time,
        date: new Date(time),
        id: asuid.slice(11),
        source: asuid
    }
}

export default (crypto) => {
    const asuid = (time = null, id = null) => create(
        () => {
            const bytes = new Uint8Array(15)
            crypto.getRandomValues(bytes)
            return bytes
        },
        time,
        id
    )
    asuid.parse = parse
    return asuid
}
