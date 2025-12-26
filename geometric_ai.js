const tf = require('@tensorflow/tfjs'); // For Node.js. In browser, skip this line.

// --- 1. CONFIGURATION ---
const SEQ_LENGTH = 200;
const HIDDEN_SIZE = 16;
const LEARNING_RATE = 0.02;
const EPOCHS = 100;

// --- 2. THE GEOMETRIC KERNEL ---

/**
 * Bounded Observation Unit (BOU)
 * Applies the BOMA constraint: Signal * |cos(Phase)| * (PI/2)
 */
function boundedObservation(x, phase) {
    return tf.tidy(() => {
        // The Aperture: Blind at PI/2, Open at 0
        const aperture = tf.cos(phase).abs();
        // The Normalization: Restore energy lost to the Gap
        const scale = Math.PI / 2;
        return x.mul(aperture).mul(scale);
    });
}

// --- 3. THE MODEL CLASS ---

class GeometricRNN {
    constructor() {
        // Initialize Weights (The Heap)
        this.w_i2h = tf.variable(tf.randomNormal([1 + HIDDEN_SIZE, HIDDEN_SIZE], 0, 0.1));
        this.b_i2h = tf.variable(tf.zeros([HIDDEN_SIZE]));
        
        this.w_i2o = tf.variable(tf.randomNormal([1 + HIDDEN_SIZE, 1], 0, 0.1));
        this.b_i2o = tf.variable(tf.zeros([1]));

        // The Phase Clock (The Stack)
        // This is the learnable "Time Speed" of the model
        this.phaseStep = tf.variable(tf.scalar(0.1)); 
    }

    /**
     * Forward pass for a single time step
     */
    forwardStep(input, hidden, currentPhase) {
        // 1. Concatenate Input + Hidden
        const combined = tf.concat([input, hidden], 1);

        // 2. Update Foreground (Linear Processing)
        const hiddenNextRaw = combined.matMul(this.w_i2h).add(this.b_i2h);

        // 3. Update Background (Rotate the Clock)
        const nextPhase = currentPhase.add(this.phaseStep);

        // 4. Apply The Gap (Project through Aperture)
        const hiddenProjected = boundedObservation(hiddenNextRaw, nextPhase);

        // 5. Compute Output
        const output = combined.matMul(this.w_i2o).add(this.b_i2o);

        return { output, hidden: hiddenProjected, phase: nextPhase };
    }
}

// --- 4. DATA GENERATION ---

function generateData() {
    const t = tf.linspace(0, 8 * Math.PI, SEQ_LENGTH);
    // Simple Cosine wave to test synchronization
    const data = tf.cos(t);
    
    // Create Inputs (t) and Targets (t+1)
    const inputs = data.slice([0], [SEQ_LENGTH - 1]).reshape([-1, 1]);
    const targets = data.slice([1], [SEQ_LENGTH - 1]).reshape([-1, 1]);
    
    return { inputs, targets };
}

// --- 5. TRAINING LOOP ---

async function train() {
    console.log("--- INITIALIZING GEOMETRIC AI (JS) ---");
    
    const model = new GeometricRNN();
    const optimizer = tf.train.adam(LEARNING_RATE);
    const { inputs, targets } = generateData();

    // Calculate theoretical delta (time step size)
    const theoreticalDelta = (8 * Math.PI) / SEQ_LENGTH;
    console.log(`Target Time Speed: ${theoreticalDelta.toFixed(4)}`);
    console.log(`Initial AI Speed:  ${model.phaseStep.dataSync()[0].toFixed(4)}\n`);

    for (let epoch = 1; epoch <= EPOCHS; epoch++) {
        let totalLoss = 0;

        // Run full sequence inside a tidy block to manage memory
        const loss = tf.tidy(() => {
            let hidden = tf.zeros([1, HIDDEN_SIZE]);
            let phase = tf.randomUniform([1, 1], 0, 2 * Math.PI); // Random start position
            
            let epochLoss = tf.scalar(0);

            // Unroll the RNN loop
            // Note: For large sequences, use truncated BPTT. For this demo, full unroll is fine.
            const inputArr = inputs.unstack();
            const targetArr = targets.unstack();

            for (let i = 0; i < inputArr.length; i++) {
                const x = inputArr[i].reshape([1, 1]);
                const y_true = targetArr[i].reshape([1, 1]);

                const step = model.forwardStep(x, hidden, phase);
                
                hidden = step.hidden;
                phase = step.phase;
                
                const stepLoss = tf.losses.meanSquaredError(y_true, step.output);
                epochLoss = epochLoss.add(stepLoss);
            }
            return epochLoss;
        });

        // Optimization Step
        const gradients = optimizer.computeGradients(() => loss);
        optimizer.applyGradients(gradients.grads);
        
        totalLoss = loss.dataSync()[0];
        loss.dispose(); // Cleanup tensor

        if (epoch % 20 === 0) {
            const currentSpeed = model.phaseStep.dataSync()[0];
            console.log(`Epoch ${epoch}: Loss ${totalLoss.toFixed(4)} | Learned Speed: ${currentSpeed.toFixed(4)}`);
        }
    }

    console.log("\n--- TRAINING COMPLETE ---");
    console.log(`Final Learned Speed: ${model.phaseStep.dataSync()[0].toFixed(4)}`);
    console.log(`(Should be close to ${theoreticalDelta.toFixed(4)})`);
}

// Run the training
train();
