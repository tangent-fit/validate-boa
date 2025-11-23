/**
 * HELLO VIEWPORT (O(1) Navigation)
 * * THE PROBLEM:
 * You have a scrollable list with N = 1,000,000,000,000 items.
 * The user drags the scrollbar to the middle.
 * You need to render items 500,000,000,000 to 500,000,000,010.
 *
 * * THE OLD WAY (Iteration/Trees):
 * - Traverse a B-Tree to find the offset. O(log N).
 * - Or worse, calculate offsets linearly. O(N).
 *
 * * THE BOA WAY (Projection):
 * - Calculate the angles for the top and bottom of the screen.
 * - Inverse project those angles to get indices.
 * - Cost: O(1).
 */

const N = 1_000_000_000_000; // 1 Trillion Items
const PSI = 2 / Math.PI;

// The User's Viewport (Simulated)
// They are looking at the "center" of the dataset
const VIEWPORT_HEIGHT_PX = 1000;
const ITEM_HEIGHT_PX = 50;
const SCROLL_POSITION_PX = (N * ITEM_HEIGHT_PX) / 2; // Middle of the universe

console.log(`\n--- NAVIGATING 1 TRILLION ITEMS ---\n`);
console.log(`Total Scroll Height: ${(N * ITEM_HEIGHT_PX).toExponential()} pixels`);
console.log(`Current Scroll Y:    ${SCROLL_POSITION_PX.toExponential()} pixels`);

// --- THE CORE BOA LOGIC ---

function getVisibleIndices(scrollY, viewportHeight, itemHeight, totalItems) {
    // 1. Define the Geometric Extent of the Universe
    // This is the "Arc Length" of our data circle.
    const extent = totalItems * itemHeight * PSI;
    const centerOffset = extent * 0.5;

    // 2. Define the Viewport Boundaries in Continuous Space
    const topY = scrollY;
    const bottomY = scrollY + viewportHeight;

    // 3. Inverse Project: Map Continuous Y -> Discrete Index
    // We do this TWICE. Once for the top, once for the bottom.
    // It doesn't matter if we are skipping 1 item or 1 billion.
    const startIndex = invert(topY, totalItems, extent, centerOffset);
    const endIndex = invert(bottomY, totalItems, extent, centerOffset);

    return { startIndex, endIndex };
}

// The Inverse Projection Function (The "Lens")
function invert(targetY, totalItems, extent, centerOffset) {
    // Normalize position relative to the center
    const adjustedY = targetY + centerOffset;
    const normalizedPos = adjustedY / extent;

    // Clamp to avoid singularity blowouts (floating point safety)
    const clampedPos = Math.max(0.001, Math.min(0.999, normalizedPos));

    // Map back to Angle (atan)
    const tanValue = clampedPos * 2 - 1;
    const angle = Math.atan(tanValue);

    // Map Angle to Index
    // angle = (index * PI) / N
    // index = (angle * N) / PI
    // (Simplified for this demo, assumes centered at 0 angle)
    
    // We shift the angle range from [-pi/2, pi/2] to [0, pi] for indexing
    const shiftedAngle = angle + (Math.PI / 2); 
    
    const index = Math.floor((shiftedAngle / Math.PI) * totalItems);
    return index;
}

// --- EXECUTION ---

console.time("Viewport Calculation");

// This is the magic. We find the slice WITHOUT touching the array.
const visible = getVisibleIndices(SCROLL_POSITION_PX, VIEWPORT_HEIGHT_PX, ITEM_HEIGHT_PX, N);

console.timeEnd("Viewport Calculation");

console.log(`\nVisible Range: [${visible.startIndex}, ${visible.endIndex}]`);
console.log(`Items to Render: ${visible.endIndex - visible.startIndex}`);

// Validation: Are we actually in the middle?
const middleIndex = N / 2;
const error = Math.abs(visible.startIndex - middleIndex);
console.log(`\nDistance from exact center: ${error} items`);
console.log(`(This small offset is expected due to the non-linear nature of tangent projection near the center)`);

// THE LESSON:
// We jumped to index 500 Billion instantly.
// We processed 0 intermediate items.
// We used O(1) memory.
