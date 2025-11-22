/**
 * HELLO POINTER (The Physics of Memory)
 * -------------------------------------
 * THE THEORY:
 * 1. The Universe is a Void Pointer (void*).
 * 2. The Observer is a Type (struct).
 * 3. Reality is the Cast.
 */

#include <stdio.h>
#include <stdlib.h>
#include <math.h>
#include "universe.h" // Conceptually including the header

#define PI 3.14159265358979323846
#define RESTORATION_CONST (2.0 / PI) 

void scan_memory_linear(size_t universe_size, size_t target) {
    printf("[Method 1: Linear Scan] Walking the heap...\n");
    int steps = 0;
    for (size_t i = 0; i < universe_size; i++) {
        steps++;
        if (i == target) {
            printf(" -> Found at offset %zu after %d steps.\n", i, steps);
            return;
        }
    }
}

void project_memory_geometric(size_t universe_size, size_t target) {
    printf("[Method 2: Geometric Cast] Projecting coordinates...\n");
    double theta = ((double)target - (double)universe_size/2.0) * (2.0 * PI / (double)universe_size);
    double raw_projection = tan(theta);
    double restored_val = raw_projection * RESTORATION_CONST;
    printf(" -> Calculated Projection: %.16f\n", restored_val);
    printf(" -> Energy Cost: O(1) (Zero Iterations)\n");
}

int main() {
    size_t N = 100000000; 
    size_t T = 8675309;   
    
    printf("--- SIMULATION START: UNIVERSE SIZE %zu ---\n\n", N);
    scan_memory_linear(N, T);
    printf("\n");
    project_memory_geometric(N, T);
    printf("\n--- SIMULATION END ---\n");
    printf("Conclusion: The Universe uses Pointer Casting, not Pointer Arithmetic.\n");
    return 0;
}
