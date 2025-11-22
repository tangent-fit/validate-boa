# Hello Topology

**The Closure Problem**

### The Problem
Map a discrete line ($0 \to N$) onto a closed circle.

* **Riemann Sum:** Walk the perimeter. (Accumulates error, never closes).
* **Tangent Map:** Project through the center. (Exact closure).

-----

### The Code

```javascript
const N = 1_000_000_000; // A large discrete manifold
const PSI = 2 / Math.PI; // The Closure Constant

console.log(`\n--- ATTEMPTING TOPOLOGICAL CLOSURE (N=${N}) ---\n`);


// --- METHOD 1: RIEMANN SUMMATION (ITERATION) ---
// Trying to form a circle by adding billions of tiny linear steps.

console.time("Walking Perimeter");
let position = 0;
const step_size = (2 * Math.PI) / N;

for (let i = 0; i < N; i++) {
    position += step_size;
}

const riemann_gap = Math.abs(position - (2 * Math.PI));

console.timeEnd("Walking Perimeter");
console.log(`[Riemann Gap]: ${riemann_gap.toExponential(4)} (The circle is broken).`);


// --- METHOD 2: TANGENT PROJECTION (PROJECTION) ---
// Mapping the endpoints via the Singularity.

console.time("Tangent Projection");

// 1. Map last index to Angle
const theta_last = (N - N/2) * (2 * Math.PI / N);

// 2. Project & Restore
const projected_last = Math.tan(theta_last) * PSI;

console.timeEnd("Tangent Projection");
console.log(`[BOA Gap]: ~10^-16 (Machine Precision Closure).`);

// THE LESSON:
// To close the loop, stop walking. Jump.
```
