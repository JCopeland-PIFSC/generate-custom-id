import { expect } from "chai";
import chaiAsPromised from "chai-as-promised";
import { describe, it, beforeAll } from "vitest";
import { performance } from "perf_hooks";
import generateCustomId from "../generateCustomId.js";

beforeAll(() => {
  chai.use(chaiAsPromised);
});

describe("generateCustomId", function () {
  const segmentLengths = [8, 9, 10, 11, 12, 13, 14, 15];
  const delimiters = ["-", "_", "|", ".", "#", "none"];

  segmentLengths.forEach((length) => {
    it(`should generate a unique ID with segment length ${length} and no date`, async function () {
      const generateId = generateCustomId({
        prefix: "ID",
        segmentLength: length,
        includeDate: false,
      });
      const id = await generateId();
      expect(id).to.match(new RegExp(`^ID-[A-Z0-9]{${length}}$`));
    });

    it(`should generate a unique ID with segment length ${length} and date`, async function () {
      const generateId = generateCustomId({
        prefix: "ID",
        segmentLength: length,
        includeDate: true,
      });
      const id = await generateId();
      expect(id).to.match(new RegExp(`^ID-\\d{8}-[A-Z0-9]{${length}}$`));
    });

    it(`should generate a unique ID with segment length ${length} and full timestamp`, async function () {
      const generateId = generateCustomId({
        prefix: "ID",
        segmentLength: length,
        includeDate: true,
        useTimestamp: true,
      });
      const id = await generateId();
      expect(id).to.match(new RegExp(`^ID-\\d{8}T\\d{6}-[A-Z0-9]{${length}}$`));
    });

    delimiters.forEach((delimiter) => {
      it(`should generate a unique ID with segment length ${length}, date, and delimiter "${delimiter}"`, async function () {
        const generateId = generateCustomId({
          prefix: "ID",
          segmentLength: length,
          includeDate: true,
          delimiter,
        });
        const id = await generateId();
        const delimiterChar = delimiter === "none" ? "" : delimiter;
        expect(id).to.match(
          new RegExp(
            `^ID${delimiterChar}\\d{8}${delimiterChar}[A-Z0-9]{${length}}$`
          )
        );
      });
    });

    it(`should generate a unique ID with segment length ${length} and lowercase random segment`, async function () {
      const generateId = generateCustomId({
        prefix: "ID",
        segmentLength: length,
        lowercase: true,
      });
      const id = await generateId();
      expect(id).to.match(new RegExp(`^ID-\\d{8}-[a-z0-9]{${length}}$`));
    });
  });

  it("should generate a unique ID with default parameters", async function () {
    const generateId = generateCustomId();
    const id = await generateId();
    expect(id).to.match(/^ID-\d{8}-[A-Z0-9]{12}$/);
  });

  it("should generate a unique ID with a custom prefix", async function () {
    const generateId = generateCustomId({ prefix: "A" });
    const id = await generateId();
    expect(id).to.match(/^A-\d{8}-[A-Z0-9]{12}$/);
  });

  it("should generate a unique ID with a custom segment length", async function () {
    const generateId = generateCustomId({ segmentLength: 10 });
    const id = await generateId();
    expect(id).to.match(/^ID-\d{8}-[A-Z0-9]{10}$/);
  });

  it("should generate a unique ID with custom options", async function () {
    const generateId = generateCustomId({ delimiter: "|" });
    const id = await generateId();
    expect(id).to.match(/^ID\|\d{8}\|[A-Z0-9]{12}$/);
  });

  it("should generate a unique ID with a custom prefix and segment length", async function () {
    const generateId = generateCustomId({ prefix: "A", segmentLength: 13 });
    const id = await generateId();
    expect(id).to.match(/^A-\d{8}-[A-Z0-9]{13}$/);
  });

  it("should generate a unique ID with a custom prefix and options", async function () {
    const generateId = generateCustomId({ prefix: "B", useTimestamp: true });
    const id = await generateId();
    expect(id).to.match(/^B-\d{8}T\d{6}-[A-Z0-9]{12}$/);
  });

  it("should throw an error for invalid segment length (7)", async function () {
    expect(() => generateCustomId({ prefix: "ID", segmentLength: 7 })).to.throw(
      "Segment length must be an integer between 8 and 15"
    );
  });

  it("should throw an error for invalid segment length (16)", async function () {
    expect(() =>
      generateCustomId({ prefix: "ID", segmentLength: 16 })
    ).to.throw("Segment length must be an integer between 8 and 15");
  });

  it("should throw an error for decimal segment length", async function () {
    expect(() =>
      generateCustomId({ prefix: "ID", segmentLength: 10.5 })
    ).to.throw("Segment length must be an integer between 8 and 15");
  });

  it("should throw an error for string segment length", async function () {
    expect(() =>
      generateCustomId({ prefix: "ID", segmentLength: "12" })
    ).to.throw("Segment length must be an integer between 8 and 15");
  });

  it("should measure the performance of the function", async function () {
    const generateId = generateCustomId();
    const iterations = 1000;
    const start = performance.now();
    for (let i = 0; i < iterations; i++) {
      await generateId();
    }
    const end = performance.now();
    const duration = end - start;
    console.log(`Time taken for ${iterations} iterations: ${duration}ms`);
    expect(duration).to.be.below(1000); // Ensure it runs within 1 second
  });
});
