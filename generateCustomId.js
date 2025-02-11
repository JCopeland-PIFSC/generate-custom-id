const isNode =
  typeof process !== "undefined" &&
  process.versions != null &&
  process.versions.node != null;

let crypto;
if (isNode) {
  crypto = await import("crypto").then((module) => module.default || module);
}

function getRandomBytes(length) {
  if (isNode) {
    return crypto.randomBytes(length);
  } else {
    const array = new Uint8Array(length);
    window.crypto.getRandomValues(array);
    return array;
  }
}

function getRandomSegment(length, lowercase) {
  const bytes = getRandomBytes(length);
  let segment = "";
  for (let i = 0; i < length; i++) {
    segment += (bytes[i] % 36).toString(36);
  }
  return lowercase ? segment : segment.toUpperCase();
}

/**
 * Calculates a check bit for the given ID string.
 *
 * @param {string} id - The ID string to calculate the check bit for.
 * @returns {string} - The calculated check bit.
 */
function calculateCheckBit(id) {
  const sum = id.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return (sum % 36).toString(36).toUpperCase();
}

/**
 * Generates a custom unique identifier with a low probability of collision.
 *
 * ID Format: PREFIX-YYYYMMDD-XXXXXXXXXXXX-CHECKBIT, PREFIX-TIMESTAMP-XXXXXXXXXXXX-CHECKBIT or PREFIX-XXXXXXXXXXXX-CHECKBIT
 * Example:   CA-20250207-7KXG1L89Q2MZ-5, CA-20250207T123456-7KXG1L89Q2MZ-5 or CA-7KXG1L89Q2MZ-5
 *
 * For multiple segments:
 * - 1 segments: Minimum segment length of 8, maximum segment length of 15
 * - 2 segments: Minimum segment length of 5, maximum segment length of 10
 * - 3 segments: Minimum segment length of 4, maximum segment length of 8
 * - 4 segments: Minimum segment length of 3, maximum segment length of 6
 *
 * @param {Object} [options={}] - Configuration options
 * @param {string|null} [options.prefix="ID"] - Optional prefix (default: "ID"), use null to exclude prefix
 * @param {number} [options.segmentLength=12] - Length of each random segment (default: 12)
 * @param {number} [options.numSegments=1] - Number of random segments (default: 1, min: 1, max: 4)
 * @param {boolean} [options.includeDate=true] - Whether to include the date segment (default: true)
 * @param {boolean} [options.useTwoDigitYear=false] - Whether to use a 2-digit year instead of a 4-digit year (default: false)
 * @param {boolean} [options.useTimestamp=false] - Whether to use a full timestamp instead of just the date value (default: false)
 * @param {boolean} [options.useLocalTime=false] - Whether to use local system time instead of UTC (default: false)
 * @param {string|null} [options.delimiter="-"] - Delimiter to use between segments (default: "-"), use null for no delimiter
 * @param {boolean} [options.lowercase=false] - Whether to use lowercase for the random segment (default: false)
 * @param {string|null} [options.postfix=null] - Optional postfix (default: null), use null to exclude postfix
 * @param {boolean} [options.includeCheckBit=false] - Whether to include a check bit at the end (default: false)
 * @returns {Function} - A function that generates unique IDs with the preset configuration
 *
 * @example
 * const generateUserId = generateCustomId({ prefix: "U", useTimestamp: true, postfix: "POST", includeCheckBit: true });
 * const newUserId = generateUserId();
 */
function generateCustomId(options = {}) {
  const {
    prefix = "ID",
    segmentLength = 12,
    numSegments = 1,
    includeDate = true,
    useTwoDigitYear = false,
    useTimestamp = false,
    useLocalTime = false,
    delimiter = "-",
    lowercase = false,
    postfix = null,
    includeCheckBit = false,
  } = options;

  if (prefix !== null && typeof prefix !== "string") {
    throw new Error("Prefix must be a string or null");
  }

  if (typeof segmentLength !== "number" || !Number.isInteger(segmentLength)) {
    throw new Error("Segment length must be an integer");
  }

  if (
    typeof numSegments !== "number" ||
    !Number.isInteger(numSegments) ||
    numSegments < 1 ||
    numSegments > 4
  ) {
    throw new Error("Number of segments must be an integer between 1 and 4");
  }

  // Validate segment length based on the number of segments
  const segmentLengthRanges = {
    1: { min: 8, max: 15 },
    2: { min: 5, max: 10 },
    3: { min: 4, max: 8 },
    4: { min: 3, max: 6 },
  };

  const { min: minSegmentLength, max: maxSegmentLength } =
    segmentLengthRanges[numSegments];

  if (segmentLength < minSegmentLength || segmentLength > maxSegmentLength) {
    throw new Error(
      `Segment length for ${numSegments} segments must be between ${minSegmentLength} and ${maxSegmentLength}`
    );
  }

  const validDelimiters = ["-", "_", "|", ".", "#", null];
  if (!validDelimiters.includes(delimiter)) {
    throw new Error(
      `Delimiter must be one of the following: ${validDelimiters.join(", ")}`
    );
  }

  if (postfix !== null && typeof postfix !== "string") {
    throw new Error("Postfix must be a string or null");
  }

  const delimiterChar = delimiter === null ? "" : delimiter;

  return function () {
    let dateSegment = "";
    if (includeDate) {
      const date = new Date();
      if (useTimestamp) {
        const datePart = useLocalTime
          ? date.toLocaleDateString("en-CA").replace(/-/g, "")
          : date.toISOString().split("T")[0].replace(/-/g, "");
        const formattedDatePart = useTwoDigitYear
          ? datePart.slice(2) // Use last two digits of the year
          : datePart;
        let timePart = useLocalTime
          ? date
              .toLocaleTimeString("en-GB", { hour12: false }) // en-GB ensures the time format is HH:MM:SS in 24-hour format
              .replace(/:/g, "")
          : date.toISOString().split("T")[1].replace(/[:.Z]/g, "").slice(0, 6);
        dateSegment = `${formattedDatePart}${delimiterChar}${timePart}`; // YYMMDD-HHMM or YYYYMMDD-HHMMSS
      } else {
        dateSegment = useLocalTime
          ? date.toLocaleDateString("en-CA").replace(/-/g, "")
          : date.toISOString().split("T")[0].replace(/-/g, "");
        const formattedDateSegment = useTwoDigitYear
          ? dateSegment.slice(2) // Use last two digits of the year
          : dateSegment;
        dateSegment = formattedDateSegment;
      }
    }

    let randomSegments = [];
    for (let i = 0; i < numSegments; i++) {
      const randomSegment = getRandomSegment(segmentLength, lowercase);
      randomSegments.push(randomSegment);
    }

    const prefixSegment = prefix === null ? "" : prefix;
    const delimiterPrefix = prefix === null ? "" : delimiterChar;
    const postfixSegment = postfix === null ? "" : postfix;
    const randomSegmentString = randomSegments.join(delimiterChar);

    let id = `${prefixSegment}${delimiterPrefix}${
      includeDate ? `${dateSegment}${delimiterChar}` : ""
    }${randomSegmentString}${
      postfixSegment ? `${delimiterChar}${postfixSegment}` : ""
    }`;

    if (includeCheckBit) {
      const checkBit = calculateCheckBit(id);
      id += `${delimiterChar}${checkBit}`;
    }

    return id;
  };
}

/**
 * Validates the check bit of the given ID string.
 *
 * @param {string} id - The ID string to validate.
 * @returns {boolean} - True if the check bit is valid, false otherwise.
 */
function validateCheckBit(id) {
  const validDelimiters = ["-", "_", "|", ".", "#", ""];
  let detectedDelimiter = "";

  for (const delimiter of validDelimiters) {
    if (delimiter === "" || id.includes(delimiter)) {
      detectedDelimiter = delimiter;
      break;
    }
  }

  const parts = detectedDelimiter
    ? id.split(detectedDelimiter)
    : [id.slice(0, -1), id.slice(-1)];
  const checkBit = parts.pop(); // Remove the check bit
  const idWithoutCheckBit = parts.join(detectedDelimiter);
  const calculatedCheckBit = calculateCheckBit(idWithoutCheckBit);
  return checkBit === calculatedCheckBit;
}

export { generateCustomId, validateCheckBit };
