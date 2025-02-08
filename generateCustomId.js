const isNode =
  typeof process !== "undefined" &&
  process.versions != null &&
  process.versions.node != null;

async function getRandomBytes(length) {
  if (isNode) {
    const crypto = await import("crypto");
    return crypto.randomBytes(length);
  } else {
    const array = new Uint8Array(length);
    window.crypto.getRandomValues(array);
    return array;
  }
}

async function getRandomSegment(length, lowercase) {
  const bytes = await getRandomBytes(length);
  let segment = "";
  for (let i = 0; i < length; i++) {
    segment += (bytes[i] % 36).toString(36);
  }
  return lowercase ? segment : segment.toUpperCase();
}

/**
 * Generates a custom unique identifier with a low probability of collision.
 *
 * ID Format: PREFIX-YYYYMMDD-XXXXXXXXXXXX, PREFIX-TIMESTAMP-XXXXXXXXXXXX or PREFIX-XXXXXXXXXXXX
 * Example:   CA-20250207-7KXG1L89Q2MZ, CA-20250207T123456-7KXG1L89Q2MZ or CA-7KXG1L89Q2MZ
 *
 * Collision Probability:
 * The likelihood of a collision is estimated using the **birthday problem** formula:
 *
 *     P ≈ 1 - exp(-N² / (2M))
 *
 * Where:
 * - P = Probability of at least one collision
 * - N = Number of IDs generated
 * - M = Total possible unique values (36^12 for a 12-character random segment)
 * - exp = Euler's number (e ≈ 2.718)
 *
 * In a scenario where:
 * - 1,000 PWA users each generate 1,000 records (N = 1,000,000)
 * - The random segment has 36^12 possible values (≈ 4.7 × 10^18)
 *
 * The probability of a collision is **approximately 0.00001054% (1 in 9.48 million)**.
 * This ensures near-zero risk for practical applications.
 *
 * - Segment Length 8: ~16.2%
 * - Segment Length 9: ~0.492%
 * - Segment Length 10: ~0.0136%
 * - Segment Length 11: ~0.000379%
 * - Segment Length 12: ~0.0000105%
 * - Segment Length 13: ~0.000000293%
 * - Segment Length 14: ~0.00000000814%
 * - Segment Length 15: ~0.000000000226%
 *
 * To ensure a lower probability of collisions, it is advisable to enforce a minimum segment length of 10.
 * Any Segment Length below 12 should only be used for short-lived IDs,
 * very small number of instance, and scenarios where the risk of collision is acceptable.
 *
 * @param {Object} [options={}] - Configuration options
 * @param {string} [options.prefix="ID"] - Optional prefix (default: "ID")
 * @param {number} [options.segmentLength=12] - Length of the random segment (default: 12, min: 8, max: 15)
 * @param {boolean} [options.includeDate=true] - Whether to include the date segment (default: true)
 * @param {boolean} [options.useTimestamp=false] - Whether to use a full timestamp instead of just the date (default: false)
 * @param {string} [options.delimiter="-"] - Delimiter to use between segments (default: "-"), "none" for no delimiter
 * @param {boolean} [options.lowercase=false] - Whether to use lowercase for the random segment (default: false)
 * @returns {Function} - A function that generates unique IDs with the preset configuration
 *
 * @example
 * const generateUserId = generateCustomId({ prefix: "U", useTimestamp: true });
 * const newUserId = await generateUserId();
 */
function generateCustomId(options = {}) {
  const {
    prefix = "ID",
    segmentLength = 12,
    includeDate = true,
    useTimestamp = false,
    delimiter = "-",
    lowercase = false,
  } = options;

  if (typeof prefix !== "string") {
    throw new Error("Prefix must be a string");
  }

  if (
    typeof segmentLength !== "number" ||
    !Number.isInteger(segmentLength) ||
    segmentLength < 8 ||
    segmentLength > 15
  ) {
    throw new Error("Segment length must be an integer between 8 and 15");
  }

  const validDelimiters = ["-", "_", "|", ".", "#", "none"];
  if (!validDelimiters.includes(delimiter.toLowerCase())) {
    throw new Error(
      `Delimiter must be one of the following: ${validDelimiters.join(", ")}`
    );
  }

  return async function () {
    let dateSegment = "";
    if (includeDate) {
      const date = new Date();
      if (useTimestamp) {
        dateSegment = date.toISOString().replace(/[-:.]/g, "").slice(0, 15); // YYYYMMDDTHHMMSS
      } else {
        dateSegment = date.toISOString().split("T")[0].replace(/-/g, ""); // YYYYMMDD
      }
    }

    const randomSegment = await getRandomSegment(segmentLength, lowercase);
    const delimiterChar = delimiter.toLowerCase() === "none" ? "" : delimiter;
    return `${prefix}${
      includeDate ? `${delimiterChar}${dateSegment}` : ""
    }${delimiterChar}${randomSegment}`;
  };
}

export default generateCustomId;
