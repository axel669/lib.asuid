import crypto from "crypto"
import asuid, { init } from "./core.mjs"

init(crypto)

export default asuid
