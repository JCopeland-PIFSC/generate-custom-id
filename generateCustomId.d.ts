interface CustomIdOptions {
  /**
   * Optional prefix (default: "ID"), use null to exclude prefix
   */
  prefix?: string | null;

  /**
   * Length of each random segment (default: 12)
   * - 1 segment: 8 to 15 characters
   * - 2 segments: 5 to 10 characters each
   * - 3 segments: 4 to 8 characters each
   * - 4 segments: 3 to 6 characters each
   */
  segmentLength?: number;

  /**
   * Number of random segments (default: 1, min: 1, max: 4)
   */
  numSegments?: number;

  /**
   * Whether to include the date segment (default: true)
   */
  includeDate?: boolean;

  /**
   * Whether to use a 2-digit year instead of a 4-digit year (default: false)
   */
  useTwoDigitYear?: boolean;

  /**
   * Whether to use a full timestamp instead of just the date value (default: false)
   */
  useTimestamp?: boolean;

  /**
   * Whether to use local system time instead of UTC (default: false)
   */
  useLocalTime?: boolean;

  /**
   * Delimiter to use between segments (default: "-"), use null for no delimiter
   */
  delimiter?: "-" | "_" | "|" | "." | "#" | null;

  /**
   * Whether to use lowercase for the random segments (default: false)
   */
  lowercase?: boolean;

  /**
   * Optional postfix (default: null), use null to exclude postfix
   */
  postfix?: string | null;

  /**
   * Whether to include a check bit at the end (default: false)
   */
  includeCheckBit?: boolean;
}

/**
 * Creates a function that generates unique IDs with the specified configuration.
 * @param options Configuration options for ID generation
 * @returns A function that generates unique IDs with the preset configuration
 */
export function generateCustomId(options?: CustomIdOptions): () => string;

/**
 * Validates the check bit of a generated ID.
 * @param id The ID string to validate
 * @returns True if the check bit is valid, false otherwise
 */
export function validateCheckBit(id: string): boolean;
