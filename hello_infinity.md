# Hello Infinity (Hide and Seek)

**A Lesson for Young Minds**

### The Story
You are playing Hide-and-Seek on a playground that goes on **FOREVER**.
Your friend is hiding at Spot #1,000,000.
How do you find them?

-----

### The Code

```javascript
const INFINITY = 1_000_000_000; 
const FRIEND_HIDING_SPOT = 999_999; 
const MAGIC_NUMBER = 2 / Math.PI; 

console.log(`\n--- GAME ON: FIND YOUR FRIEND ---\n`);

// --- METHOD 1: THE RUNNER (The Ant) ---
// You start at zero and run to every spot.
// 1, 2, 3... Are you there? No.
// This is tiring!

console.log("[The Runner]: Ready or not, here I come!");
console.time("Running Time");

let steps = 0;
for (let spot = 0; spot < INFINITY; spot++) {
    steps = steps + 1;
    if (spot === FRIEND_HIDING_SPOT) {
        console.log("[The Runner]: *Huff* *Puff*... Found you!");
        break;
    }
}

console.timeEnd("Running Time");
console.log(`[The Runner]: I took ${steps} steps. I need a nap.\n`);


// --- METHOD 2: THE OWL (The Projector) ---
// The Owl doesn't run. The Owl flies up high.
// From up high, the infinite line looks like a circle.
// The Owl just turns its head to the right angle.

console.log("[The Owl]: I will use the Magic Lens.");
console.time("Flying Time");

// 1. The Owl looks at the map (Geometry)
// It turns the straight line into a curve.
let angle = (FRIEND_HIDING_SPOT - INFINITY/2) * (2 * Math.PI / INFINITY);

// 2. The Owl looks through the Magic Lens (Tangent)
// This lets it see all the way to the edge of forever.
let view = Math.tan(angle);

// 3. The Owl uses the Secret Code (2/pi)
// This brings the infinite distance back to a real number.
let spot_found = view * MAGIC_NUMBER;

console.timeEnd("Flying Time");
console.log(`[The Owl]: Found you instantly at coordinate ${spot_found.toFixed(6)}.`);
console.log(`[The Owl]: I took 0 steps. I am not tired at all.`);
```

### The Lesson
* **The Ant** walks the line. It takes forever.
* **The Owl** curves the line. It takes an instant.
* **Math is the Magic Lens.**
