# Generate Custom ID

`generate-custom-id` is a JavaScript library that generates custom unique identifiers with a low probability of collision. It supports various configurations, including custom prefixes, segment lengths, date inclusion, timestamps, delimiters, and case sensitivity. There a no runtime dependencies.

## Features

- Generates unique IDs with a low probability of collision.
- Supports custom prefixes.
- Configurable segment lengths (8 to 15 characters).
- Option to include date or full timestamp.
- Customizable delimiters.
- Option to generate lowercase random segments.

## Usage

### Basic Usage

```javascript
import generateCustomId from "generate-custom-id";

const generateId = generateCustomId();
const newId = await generateId();
console.log(newId); // Example: ID-20250207-7KXG1L89Q2MZ
```

### Custom Prefix

```javascript
const generateUserId = generateCustomId({ prefix: "U" });
const newUserId = await generateUserId();
console.log(newUserId); // Example: U-20250207-7KXG1L89Q2MZ
```

### Custom Segment Length

```javascript
const generateShortId = generateCustomId({ segmentLength: 10 });
const newShortId = await generateShortId();
console.log(newShortId); // Example: ID-20250207-7KXG1L89Q
```

### Include Full Timestamp

```javascript
const generateTimestampId = generateCustomId({ useTimestamp: true });
const newTimestampId = await generateTimestampId();
console.log(newTimestampId); // Example: ID-20250207T123456-7KXG1L89Q2MZ
```

### Custom Delimiter

```javascript
const generateCustomDelimiterId = generateCustomId({ delimiter: "|" });
const newCustomDelimiterId = await generateCustomDelimiterId();
console.log(newCustomDelimiterId); // Example: ID|20250207|7KXG1L89Q2MZ
```

### Lowercase Random Segment

```javascript
const generateLowercaseId = generateCustomId({ lowercase: true });
const newLowercaseId = await generateLowercaseId();
console.log(newLowercaseId); // Example: ID-20250207-7kxg1l89q2mz
```

## API

### `generateCustomId(options)`

Creates a function that generates unique IDs with the specified configuration.

#### Parameters

- `options` (Object): Configuration options.
  - `prefix` (string): Optional prefix (default: "ID").
  - `segmentLength` (number): Length of the random segment (default: 12, min: 8, max: 15).
  - `includeDate` (boolean): Whether to include the date segment (default: true).
  - `useTimestamp` (boolean): Whether to use a full timestamp instead of just the date (default: false).
  - `delimiter` (string): Delimiter to use between segments (default: "-"), "none" for no delimiter.
  - `lowercase` (boolean): Whether to use lowercase for the random segment (default: false).

#### Returns

- `Function`: A function that generates unique IDs with the preset configuration.

### Example

```javascript
const generateUserId = generateCustomId({ prefix: "U", useTimestamp: true });
const newUserId = await generateUserId();
console.log(newUserId); // Example: U-20250207T123456-7KXG1L89Q2MZ
```

## Testing

To run the test you will need to run `npm install` to install the nessesary test dependencies. `vitest, chai, etc..`

To run the tests, use the following command:

```sh
npm test
```

In addition to functional test performance and collision test are also included.

### Performance Test

```sh
npm run test:perf
```

This test performs the id generation 1000 times per segment length.

#### Test Results Output

```
» npm run test:perf

> generate-custom-id@1.0.0 test:perf
> node --experimental-vm-modules test/generateCustomIdSpeedTest.js

Performance test for generateCustomId with 1000 iterations:
Segment Length 8: 4.91ms
Segment Length 9: 2.52ms
Segment Length 10: 2.56ms
Segment Length 11: 2.67ms
Segment Length 12: 3.68ms
Segment Length 13: 1.80ms
Segment Length 14: 1.88ms
Segment Length 15: 2.37ms
```

### Collision Test

```sh
npm run test:coll
```

This test performs the id generation with a segment length of 12, 1,000,000 times and will report any collisions and the time to preform the operation.

```
» npm run test:coll

> generate-custom-id@1.0.0 test:coll
> node --experimental-vm-modules test/generateCustomIdCollisionTest.js

Running collision test for generateCustomId with 1000000 iterations:
Current ID: ID-20250208-GC8NHOPHT1FX

Total collisions: 0
Collision rate: 0%
Time taken: 9339.93ms

```
