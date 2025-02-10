import { performance } from "perf_hooks";
import { generateCustomId } from "../generateCustomId.js";

const segmentLengthRanges = {
  1: { min: 8, max: 15 },
  2: { min: 5, max: 10 },
  3: { min: 4, max: 8 },
  4: { min: 3, max: 6 },
};
const iterations = 10_000;

console.log(
  `Performance test for generateCustomId with ${iterations} iterations:`
);

Object.keys(segmentLengthRanges).forEach((numSegments) => {
  const { min, max } = segmentLengthRanges[numSegments];
  for (let length = min; length <= max; length++) {
    const generateId = generateCustomId({
      prefix: "ID",
      segmentLength: length,
      numSegments: parseInt(numSegments),
    });
    const start = performance.now();
    for (let i = 0; i < iterations; i++) {
      generateId();
    }
    const end = performance.now();
    const duration = end - start;
    console.log(
      `Num Segments ${numSegments}, Segment Length ${length}: ${duration.toFixed(
        2
      )}ms`
    );
  }
});
