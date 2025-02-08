import { performance } from "perf_hooks";
import generateCustomId from "../generateCustomId.js";

const segmentLengths = [8, 9, 10, 11, 12, 13, 14, 15];
const iterations = 1000;

console.log(
  `Performance test for generateCustomId with ${iterations} iterations:`
);

segmentLengths.forEach((length) => {
  const generateId = generateCustomId({ prefix: "ID", segmentLength: length });
  const start = performance.now();
  for (let i = 0; i < iterations; i++) {
    generateId();
  }
  const end = performance.now();
  const duration = end - start;
  console.log(`Segment Length ${length}: ${duration.toFixed(2)}ms`);
});
