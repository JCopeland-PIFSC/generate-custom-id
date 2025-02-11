import { describe, it, beforeAll } from "vitest";
import { performance } from "perf_hooks";
import { generateCustomId, validateCheckBit } from "../generateCustomId.js";

let expect;

beforeAll(async () => {
  const chai = await import("chai");
  expect = chai.expect;
});

describe("generateCustomId", function () {
  const segmentLengthRanges = {
    1: { min: 8, max: 15 },
    2: { min: 5, max: 10 },
    3: { min: 4, max: 8 },
    4: { min: 3, max: 6 },
  };
  const delimiters = ["-", "_", "|", ".", "#", null];

  Object.keys(segmentLengthRanges).forEach((numSegments) => {
    const { min, max } = segmentLengthRanges[numSegments];
    for (let length = min; length <= max; length++) {
      it(`should generate a unique ID with ${numSegments} segment(s), segment length ${length}, and no date`, function () {
        const generateId = generateCustomId({
          prefix: "ID",
          segmentLength: length,
          numSegments: parseInt(numSegments),
          includeDate: false,
        });
        const id = generateId();
        const regex = new RegExp(
          `^ID-${Array(parseInt(numSegments))
            .fill(`[A-Z0-9]{${length}}`)
            .join("-")}$`
        );
        expect(id).to.match(regex);
      });

      it(`should generate a unique ID with ${numSegments} segment(s), segment length ${length}, and date`, function () {
        const generateId = generateCustomId({
          prefix: "ID",
          segmentLength: length,
          numSegments: parseInt(numSegments),
          includeDate: true,
        });
        const id = generateId();
        const regex = new RegExp(
          `^ID-\\d{8}-${Array(parseInt(numSegments))
            .fill(`[A-Z0-9]{${length}}`)
            .join("-")}$`
        );
        expect(id).to.match(regex);
      });

      it(`should generate a unique ID with ${numSegments} segment(s), segment length ${length}, and full timestamp`, function () {
        const generateId = generateCustomId({
          prefix: "ID",
          segmentLength: length,
          numSegments: parseInt(numSegments),
          includeDate: true,
          useTimestamp: true,
        });
        const id = generateId();
        const regex = new RegExp(
          `^ID-\\d{8}-\\d{6}-${Array(parseInt(numSegments))
            .fill(`[A-Z0-9]{${length}}`)
            .join("-")}$`
        );
        expect(id).to.match(regex);
      });

      it(`should generate a unique ID with ${numSegments} segment(s), segment length ${length}, and 2-digit year`, function () {
        const generateId = generateCustomId({
          prefix: "ID",
          segmentLength: length,
          numSegments: parseInt(numSegments),
          includeDate: true,
          useTwoDigitYear: true,
        });
        const id = generateId();
        const regex = new RegExp(
          `^ID-\\d{6}-${Array(parseInt(numSegments))
            .fill(`[A-Z0-9]{${length}}`)
            .join("-")}$`
        );
        expect(id).to.match(regex);
      });

      it(`should generate a unique ID with ${numSegments} segment(s), segment length ${length}, full timestamp, and 2-digit year`, function () {
        const generateId = generateCustomId({
          prefix: "ID",
          segmentLength: length,
          numSegments: parseInt(numSegments),
          includeDate: true,
          useTimestamp: true,
          useTwoDigitYear: true,
        });
        const id = generateId();
        const regex = new RegExp(
          `^ID-\\d{6}-\\d{6}-${Array(parseInt(numSegments))
            .fill(`[A-Z0-9]{${length}}`)
            .join("-")}$`
        );
        expect(id).to.match(regex);
      });

      it(`should generate a unique ID with ${numSegments} segment(s), segment length ${length}, local time, and 2-digit year`, function () {
        const generateId = generateCustomId({
          prefix: "ID",
          segmentLength: length,
          numSegments: parseInt(numSegments),
          includeDate: true,
          useTimestamp: true,
          useLocalTime: true,
          useTwoDigitYear: true,
        });
        const id = generateId();
        const regex = new RegExp(
          `^ID-\\d{6}-\\d{6}-${Array(parseInt(numSegments))
            .fill(`[A-Z0-9]{${length}}`)
            .join("-")}$`
        );
        expect(id).to.match(regex);
      });

      it(`should generate a unique ID with ${numSegments} segment(s), segment length ${length}, full year, and local time`, function () {
        const generateId = generateCustomId({
          prefix: "ID",
          segmentLength: length,
          numSegments: parseInt(numSegments),
          includeDate: true,
          useTimestamp: true,
          useLocalTime: true,
          useTwoDigitYear: false,
        });
        const id = generateId();
        const regex = new RegExp(
          `^ID-\\d{8}-\\d{6}-${Array(parseInt(numSegments))
            .fill(`[A-Z0-9]{${length}}`)
            .join("-")}$`
        );
        expect(id).to.match(regex);
      });

      delimiters.forEach((delimiter) => {
        it(`should generate a unique ID with ${numSegments} segment(s), segment length ${length}, date, and delimiter "${delimiter}"`, function () {
          const generateId = generateCustomId({
            prefix: "ID",
            segmentLength: length,
            numSegments: parseInt(numSegments),
            includeDate: true,
            delimiter: delimiter,
          });
          const id = generateId();
          const delimiterChar = delimiter === null ? "" : delimiter;
          const regex = new RegExp(
            `^ID${delimiterChar}\\d{8}${delimiterChar}${Array(
              parseInt(numSegments)
            )
              .fill(`[A-Z0-9]{${length}}`)
              .join(delimiterChar)}$`
          );
          expect(id).to.match(regex);
        });
      });

      it(`should generate a unique ID with ${numSegments} segment(s), segment length ${length}, and lowercase random segment`, function () {
        const generateId = generateCustomId({
          prefix: "ID",
          segmentLength: length,
          numSegments: parseInt(numSegments),
          lowercase: true,
        });
        const id = generateId();
        const regex = new RegExp(
          `^ID-\\d{8}-${Array(parseInt(numSegments))
            .fill(`[a-z0-9]{${length}}`)
            .join("-")}$`
        );
        expect(id).to.match(regex);
      });

      it(`should generate a unique ID with ${numSegments} segment(s), segment length ${length}, postfix, and check bit`, function () {
        const generateId = generateCustomId({
          prefix: "ID",
          segmentLength: length,
          numSegments: parseInt(numSegments),
          postfix: "POST",
          includeCheckBit: true,
        });
        const id = generateId();
        const regex = new RegExp(
          `^ID-\\d{8}-${Array(parseInt(numSegments))
            .fill(`[A-Z0-9]{${length}}`)
            .join("-")}-POST-[A-Z0-9]$`
        );
        expect(id).to.match(regex);
        const isValid = validateCheckBit(id);
        expect(isValid).to.be.true;
      });

      it(`should generate a unique ID with ${numSegments} segment(s), segment length ${length}, no delimiter, and check bit`, function () {
        const generateId = generateCustomId({
          prefix: "ID",
          segmentLength: length,
          numSegments: parseInt(numSegments),
          delimiter: null,
          includeCheckBit: true,
        });
        const id = generateId();
        const regex = new RegExp(
          `^ID\\d{8}${Array(parseInt(numSegments))
            .fill(`[A-Z0-9]{${length}}`)
            .join("")}[A-Z0-9]$`
        );
        expect(id).to.match(regex);
        const isValid = validateCheckBit(id);
        expect(isValid).to.be.true;
      });
    }
  });

  it("should generate a unique ID with default parameters", function () {
    const generateId = generateCustomId();
    const id = generateId();
    expect(id).to.match(/^ID-\d{8}-[A-Z0-9]{12}$/);
  });

  it("should generate a unique ID with a custom prefix", function () {
    const generateId = generateCustomId({ prefix: "A" });
    const id = generateId();
    expect(id).to.match(/^A-\d{8}-[A-Z0-9]{12}$/);
  });

  it("should generate a unique ID with a custom segment length", function () {
    const generateId = generateCustomId({ segmentLength: 10 });
    const id = generateId();
    expect(id).to.match(/^ID-\d{8}-[A-Z0-9]{10}$/);
  });

  it("should generate a unique ID with custom options", function () {
    const generateId = generateCustomId({ delimiter: "|" });
    const id = generateId();
    expect(id).to.match(/^ID\|\d{8}\|[A-Z0-9]{12}$/);
  });

  it("should generate a unique ID with a custom prefix and segment length", function () {
    const generateId = generateCustomId({ prefix: "A", segmentLength: 13 });
    const id = generateId();
    expect(id).to.match(/^A-\d{8}-[A-Z0-9]{13}$/);
  });

  it("should generate a unique ID with a custom prefix and options", function () {
    const generateId = generateCustomId({ prefix: "B", useTimestamp: true });
    const id = generateId();
    expect(id).to.match(/^B-\d{8}-\d{6}-[A-Z0-9]{12}$/);
  });

  it("should generate a unique ID with a custom prefix and delimiter", function () {
    const generateId = generateCustomId({
      prefix: "B",
      useTimestamp: true,
      delimiter: "_",
    });
    const id = generateId();
    expect(id).to.match(/^B_\d{8}_\d{6}_[A-Z0-9]{12}$/);
  });

  it("should generate a unique ID with multiple segments", function () {
    const generateId = generateCustomId({ numSegments: 2, segmentLength: 5 });
    const id = generateId();
    expect(id).to.match(/^ID-\d{8}-[A-Z0-9]{5}-[A-Z0-9]{5}$/);
  });

  it("should generate a unique ID with no prefix", function () {
    const generateId = generateCustomId({ prefix: null });
    const id = generateId();
    expect(id).to.match(/^\d{8}-[A-Z0-9]{12}$/);
  });

  it("should throw an error for invalid segment length (7)", function () {
    expect(() => generateCustomId({ prefix: "ID", segmentLength: 7 })).to.throw(
      "Segment length for 1 segments must be between 8 and 15"
    );
  });

  it("should throw an error for invalid segment length (16)", function () {
    expect(() =>
      generateCustomId({ prefix: "ID", segmentLength: 16 })
    ).to.throw("Segment length for 1 segments must be between 8 and 15");
  });

  it("should throw an error for decimal segment length", function () {
    expect(() =>
      generateCustomId({ prefix: "ID", segmentLength: 10.5 })
    ).to.throw("Segment length must be an integer");
  });

  it("should throw an error for string segment length", function () {
    expect(() =>
      generateCustomId({ prefix: "ID", segmentLength: "12" })
    ).to.throw("Segment length must be an integer");
  });

  it("should measure the performance of the function", function () {
    const generateId = generateCustomId();
    const iterations = 1000;
    const start = performance.now();
    for (let i = 0; i < iterations; i++) {
      generateId();
    }
    const end = performance.now();
    const duration = end - start;
    console.log(`Time taken for ${iterations} iterations: ${duration}ms`);
    expect(duration).to.be.below(1000); // Ensure it runs within 1 second
  });
});
