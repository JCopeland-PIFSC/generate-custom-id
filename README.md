# Generate Custom ID

`generate-custom-id` is a JavaScript library that generates custom unique identifiers with a low probability of collision. It supports various configurations, including custom prefixes and postfix, segment counts, segment lengths, date inclusion, timestamps, delimiters, case sensitivity, a check bit. There are no runtime dependencies.

## Features

- Generates unique IDs with a low probability of collision
- Supports custom prefixes and postfixes
- Configurable segment lengths based on number of segments:
  - 1 segment: 8 to 15 characters
  - 2 segments: 5 to 10 characters each
  - 3 segments: 4 to 8 characters each
  - 4 segments: 3 to 6 characters each
- Option to include date or full timestamp
- Customizable delimiters (-, \_, |, ., #, or null)
- Option to generate lowercase random segments
- Support for multiple segments (1 to 4)
- Optional check bit for validation
- Supports both browser and Node.js environments

## Usage

### Basic Usage

```javascript
import { generateCustomId } from "generate-custom-id";

const generateId = generateCustomId();
const newId = generateId();
console.log(newId); // Example: ID-20250207-7KXG1L89Q2MZ
```

### Custom Prefix and Postfix

```javascript
const generateId = generateCustomId({ prefix: "USER", postfix: "TEST" });
const newId = generateId();
console.log(newId); // Example: USER-20250207-7KXG1L89Q2MZ-TEST
```

### Multiple Segments

```javascript
const generateId = generateCustomId({ numSegments: 2, segmentLength: 5 });
const newId = generateId();
console.log(newId); // Example: ID-20250207-7KXG1-L89Q2
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

### With Check Bit

```javascript
const generateId = generateCustomId({ includeCheckBit: true });
const newId = generateId();
console.log(newId); // Example: ID-20250207-7KXG1L89Q2MZ-5
```

### Full Configuration Example

```javascript
const generateId = generateCustomId({
  prefix: "USER",
  segmentLength: 10,
  numSegments: 2,
  includeDate: true,
  useTimestamp: true,
  delimiter: "_",
  lowercase: true,
  postfix: "TEST",
  includeCheckBit: true,
});
const newId = generateId();
console.log(newId); // Example: USER_20250207T123456_7kxg1l89q2_mz89q2test_5
```

## API

### `generateCustomId(options)`

Creates a function that generates unique IDs with the specified configuration.

#### Parameters

- `options` (Object): Configuration options
  - `prefix` (string|null): Optional prefix (default: "ID"), use null to exclude prefix
  - `segmentLength` (number): Length of each random segment (default: 12)
    - 1 segment: 8 to 15 characters
    - 2 segments: 5 to 10 characters each
    - 3 segments: 4 to 8 characters each
    - 4 segments: 3 to 6 characters each
  - `numSegments` (number): Number of random segments (default: 1, min: 1, max: 4)
  - `includeDate` (boolean): Whether to include the date segment (default: true)
  - `useTwoDigitYear` (boolean): Whether to use a 2-digit year instead of a 4-digit year (default: false)
  - `useTimestamp` (boolean): Whether to use a full timestamp instead of just the date value (default: false)
  - `useLocalTime` (boolean): Whether to use local system time instead of UTC (default: false)
  - `delimiter` (string|null): Delimiter to use between segments (default: "-"), use null for no delimiter
  - `lowercase` (boolean): Whether to use lowercase for the random segments (default: false)
  - `postfix` (string|null): Optional postfix (default: null), use null to exclude postfix
  - `includeCheckBit` (boolean): Whether to include a check bit at the end (default: false)

#### Returns

- `Function`: A function that generates unique IDs with the preset configuration

### Example

```javascript
const generateUserId = generateCustomId({ prefix: "U", useTimestamp: true });
const newUserId = await generateUserId();
console.log(newUserId); // Example: U-20250207T123456-7KXG1L89Q2MZ
```

### Two-Digit Year and Local Time Examples

```javascript
// Generate ID with 2-digit year
const generateShortYearId = generateCustomId({ useTwoDigitYear: true });
const shortYearId = generateShortYearId();
console.log(shortYearId); // Example: ID-240208-7KXG1L89Q2MZ

// Generate ID with local time
const generateLocalTimeId = generateCustomId({
  useTimestamp: true,
  useLocalTime: true,
});
const localTimeId = generateLocalTimeId();
console.log(localTimeId); // Example: ID-20240208-143022-7KXG1L89Q2MZ

// Combine both options
const generateLocalShortId = generateCustomId({
  useTwoDigitYear: true,
  useTimestamp: true,
  useLocalTime: true,
});
const localShortId = generateLocalShortId();
console.log(localShortId); // Example: ID-240208-143022-7KXG1L89Q2MZ
```

### `validateCheckBit(id)`

Validates the check bit of a generated ID.

#### Parameters

- `id` (string): The ID string to validate

#### Returns

- `boolean`: True if the check bit is valid, false otherwise

## Testing

To run the test you will need to run `npm install` to install the necessary test dependencies. `vitest, chai, etc..`

To run the tests, use the following command:

```bash
npm test
```

In addition to functional test, performance and collision test are also included.

### Performance Test

```bash
npm run test:perf
```

This test performs the id generation 1000 times per segment length.

#### Test Results Output

```
» npm run test:perf

> generate-custom-id@1.0.0 test:perf
> node --experimental-vm-modules test/generateCustomIdPerformanceTest.js

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

```bash
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

## Collision Probability

The likelihood of a collision is estimated using the birthday problem formula:

```
P ≈ 1 - exp(-N² / (2M))
```

Where:

- P = Probability of at least one collision
- N = Number of IDs generated
- M = Total possible unique values (36^12 for a 12-character random segment)
- exp = Euler's number (e ≈ 2.718)

Collision probabilities for different segment lengths (single segment):

- Segment Length 8: ~16.2%
- Segment Length 9: ~0.492%
- Segment Length 10: ~0.0136%
- Segment Length 11: ~0.000379%
- Segment Length 12: ~0.0000105%
- Segment Length 13: ~0.000000293%
- Segment Length 14: ~0.00000000814%
- Segment Length 15: ~0.000000000226%

For practical applications, it is recommended to:

- Use segment length ≥ 12 for high volume id generation.
- Use segment length < 10 for short-term IDs, small number of instances, and scenarios where the risk of collision is acceptable.
- Consider using multiple segments for better readability.
- Add check bits for validation when needed.

## Backend Validation Examples (Not Validated!)

If you need to validate IDs with check bits on different backend platforms, here are equivalent implementations of the `validateCheckBit` function:

### node.js

```javascript
import { validateCheckBit } from "./generateCustomId.js";
```

### Java

```java
public class IdValidator {
    public static boolean validateCheckBit(String id) {
        String[] validDelimiters = {"-", "_", "|", ".", "#", ""};
        String detectedDelimiter = "";

        for (String delimiter : validDelimiters) {
            if (delimiter.isEmpty() || id.contains(delimiter)) {
                detectedDelimiter = delimiter;
                break;
            }
        }

        String[] parts;
        if (!detectedDelimiter.isEmpty()) {
            parts = id.split(Pattern.quote(detectedDelimiter));
        } else {
            parts = new String[]{
                id.substring(0, id.length() - 1),
                id.substring(id.length() - 1)
            };
        }

        String checkBit = parts[parts.length - 1];
        String idWithoutCheckBit = String.join(detectedDelimiter,
            Arrays.copyOf(parts, parts.length - 1));

        String calculatedCheckBit = calculateCheckBit(idWithoutCheckBit);
        return checkBit.equals(calculatedCheckBit);
    }

    private static String calculateCheckBit(String id) {
        int sum = id.chars().sum();
        return Integer.toString(sum % 36, 36).toUpperCase();
    }
}
```

### Python

```python
def validate_check_bit(id: str) -> bool:
    valid_delimiters = ["-", "_", "|", ".", "#", ""]
    detected_delimiter = ""

    for delimiter in valid_delimiters:
        if delimiter == "" or delimiter in id:
            detected_delimiter = delimiter
            break

    if detected_delimiter:
        parts = id.split(detected_delimiter)
    else:
        parts = [id[:-1], id[-1]]

    check_bit = parts.pop()
    id_without_check_bit = detected_delimiter.join(parts)
    calculated_check_bit = calculate_check_bit(id_without_check_bit)

    return check_bit == calculated_check_bit

def calculate_check_bit(id: str) -> str:
    sum_chars = sum(ord(c) for c in id)
    return format(sum_chars % 36, '01x').upper()
```

### C

```csharp
public class IdValidator
{
    public static bool ValidateCheckBit(string id)
    {
        string[] validDelimiters = new[] { "-", "_", "|", ".", "#", "" };
        string detectedDelimiter = "";

        foreach (var delimiter in validDelimiters)
        {
            if (string.IsNullOrEmpty(delimiter) || id.Contains(delimiter))
            {
                detectedDelimiter = delimiter;
                break;
            }
        }

        string[] parts;
        if (!string.IsNullOrEmpty(detectedDelimiter))
        {
            parts = id.Split(new[] { detectedDelimiter },
                StringSplitOptions.None);
        }
        else
        {
            parts = new[]
            {
                id.Substring(0, id.Length - 1),
                id.Substring(id.Length - 1)
            };
        }

        string checkBit = parts[^1];
        string idWithoutCheckBit = string.Join(detectedDelimiter,
            parts.Take(parts.Length - 1));

        string calculatedCheckBit = CalculateCheckBit(idWithoutCheckBit);
        return checkBit == calculatedCheckBit;
    }

    private static string CalculateCheckBit(string id)
    {
        int sum = id.Sum(c => (int)c);
        return Convert.ToString(sum % 36, 36).ToUpper();
    }
}
```

Usage examples:

```javascript
// node.js
const isValid = validateCheckBit("USER-20250207-7KXG1L89Q2MZ-5");
```

```java
// Java
boolean isValid = IdValidator.validateCheckBit("USER-20250207-7KXG1L89Q2MZ-5");
```

```python
# Python
is_valid = validate_check_bit("USER-20250207-7KXG1L89Q2MZ-5")
```

```csharp
// C#
bool isValid = IdValidator.ValidateCheckBit("USER-20250207-7KXG1L89Q2MZ-5");
```
