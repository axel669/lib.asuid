# Almost Sortable Unique IDs
Similar idea to the ksuid, but uses a larger timestamp for millisecond
resolution. Copy-paste friendly, 35 chars long, and lexicographical sorting of
the ids will sort them by time, but if multiple asuids are generated in the
same millisecond (or using the same timestamp) then the random bytes will
prevent ordering them in perfect generated order (hence, almost sortable).

[:package.json : demo.html]: #

## Format

`| 56 bit timestamp | 120 bit id |`

The 56 bit timestamp allows for values in the range
[-8640000000000000, 8640000000000000] with millisecond precision. This means
any valid JS date can become a valid asuid, including dates in the past (for
assigning ids to older records).

## Installation
```bash
npm add @labyrinthos/asuid
```

## Usage

### Imports

Beacuse this library uses the js cryptography api, there is a different import
for node vs non-node envs.

```js
// browser/cloudflare workers
import asuid from "@labyrinthos/asuid"
// node
import asuid from "@labyrinthos/asuid/node"
```

### Generate
```js
//  generate fully random asuid
asuid()

//  generate random id for a timestamp (or date)
asuid(timeStamp)
asuid(new Date(timeStamp))
asuid(BigInt(timeStamp))

//  generate asuid for current time with set id bytes
asuid(null, uint8Array)
asuid(null, idString)

//  regenerate id from parts
asuid(timeStamp, uint8Array)
asuid(timeStamp, idString)
```

### Parse
```js
import asuid from "@labyrinthos/asuid"

const parsed = asuid.parse(id)
{
    // timestamp for the asuid
    time
    // date object from the timestamp
    date
    // the id string (last 15 bytes/24 characters)
    id
    // the asuid that was parsed
    source
}
```
