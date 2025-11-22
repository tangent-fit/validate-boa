/*
 * UNIVERSE.H
 * The Standard Library for Reality
 * --------------------------------------------------------------------
 * Theory: Bounded Observer Architecture (BOA)
 * Author: Tom Brinkman
 * Date:   2025
 * --------------------------------------------------------------------
 * "You cannot dereference the Infinite. You can only cast it."
 */

#ifndef UNIVERSE_H
#define UNIVERSE_H

#include <math.h>

// 1. THE CONSTANTS
// The Universe is a Cycle (2*PI). The Observer is a Projection (2/PI).
#define UNIVERSE_CYCLE    (2.0 * M_PI)      
#define OBSERVER_LIMIT    (2.0 / M_PI)      

// The fundamental "Size" of a Bounded Observer relative to the Void.
#define SIZEOF_OBSERVER   0.63661977236758  // (2 / PI)

// 2. THE TYPES
// Void Pointer: Infinite potential. Unstructured.
typedef void* Universe_t;

// Bounded Struct: The geometric limit of what can be seen.
typedef struct {
    double capacity;
    double geometry; // = SIZEOF_OBSERVER
} Observer_t;

// 3. THE MACROS
#define PROJECT(infinite_val) (tan((infinite_val)) * SIZEOF_OBSERVER)

#endif // UNIVERSE_H
