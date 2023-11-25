const intBytes = (bytes) => (
    (bytes[0] * 4294967296)
    + (bytes[1] * 16777216)
    + (bytes[2] * 65536)
    + (bytes[3] * 256)
    + (bytes[4])
)
const encode = (bytes) => intBytes(bytes).toString(32).padStart(8, "0")

const alphabet = "0123456789abcdefghijklmnopqrstuv"
const alphaMap = [...alphabet].reduce(
    (map, ch, index) => {
        map[ch] = BigInt(index)
        return map
    },
    {}
)
const decode = (str) => {
    let value = 0n
    for (let i = 0; i < 11; i += 1) {
        value = (value * 32n) + alphaMap[str.charAt(i)]
    }
    return value
}

export default { encode, decode }
