import { performance } from "perf_hooks";
import readline from "readline";
import { generateCustomId } from "../generateCustomId.js";

/**
 * Valid segment options
 * numSegments: 1, segmentLength: 8-12
 * numSegments: 2, segmentLength: 5-10
 * numSegments: 3, segmentLength: 4-8
 * numSegments: 4, segmentLength: 3-6
 */
const numSegments = 1; //default: 1 You can change this to test different numbers of segments
const segmentLength = 12; //default: 12 You can change this to test different segment lengths
const iterations = 1_000_000; // You can change this to test different numbers of iterations
const ids = new Set(); // !!! The maximum size of a Set in Chrome and node.js is 16,777,216 (2^24) !!!

let collisions = 0;

console.log(
  `Running collision test for generateCustomId with ${iterations} iterations:`
);

const start = performance.now();

const generateId = generateCustomId({
  prefix: "ID",
  segmentLength,
  numSegments,
});
for (let i = 0; i < iterations; i++) {
  const id = generateId();

  // Update the console with the current ID
  readline.cursorTo(process.stdout, 0);
  process.stdout.write(`Current ID: ${id}`);

  if (ids.has(id)) {
    collisions++;
  } else {
    ids.add(id);
  }
}

const end = performance.now();
const duration = end - start;

console.log("\n"); // Move to the next line after the loop
console.log(`Total collisions: ${collisions}`);
console.log(`Collision rate: ${(collisions / iterations) * 100}%`);
console.log(`Time taken: ${duration.toFixed(2)}ms`);
