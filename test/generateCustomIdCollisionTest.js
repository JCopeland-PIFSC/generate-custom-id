import { performance } from "perf_hooks";
import readline from "readline";
import generateCustomId from "../generateCustomId.js";

const segmentLength = 12; // You can change this to test different segment lengths
const iterations = 1000000; // You can change this to test different numbers of iterations
const ids = new Set();

let collisions = 0;

console.log(
  `Running collision test for generateCustomId with ${iterations} iterations:`
);

const start = performance.now();

(async () => {
  const generateId = generateCustomId({ prefix: "ID", segmentLength });
  for (let i = 0; i < iterations; i++) {
    const id = await generateId();

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
})();
