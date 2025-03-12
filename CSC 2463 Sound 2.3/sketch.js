let img;

function preload() {
    img = loadImage("image/dropped-basketball.jpeg");
}

function setup() {
    createCanvas(800, 600);
    image(img, 0, 0, width, height);
}

function mousePressed() {
// Create a synth for the basketball bounce sound
const synth = new Tone.Synth({
    oscillator: { type: "sine" }, // Sine wave for a clean bounce sound
    envelope: { 
        attack: 0.001,  // Quick attack for immediate impact
        decay: 0.2,    // Decay to simulate bounce energy loss
        sustain: 0,    // No sustain needed
        release: 0.1   // Quick release
    }
}).toDestination();

// Add a low-pass filter to simulate ball material
const filter = new Tone.Filter({
    type: "lowpass",
    frequency: 800,
    Q: 1
}).toDestination();
synth.connect(filter);

// Create sequence of bounces with decreasing volume and timing
const now = Tone.now();
const bouncePattern = [
    { time: 0.0, note: "A2", velocity: 1.0 },
    { time: 0.4, note: "A2", velocity: 0.8 },
    { time: 0.8, note: "A2", velocity: 0.6 },
    { time: 1.2, note: "A2", velocity: 0.4 },
    { time: 1.6, note: "A2", velocity: 0.2 }
];

// Play the bounce sequence (total duration ~2 seconds)
bouncePattern.forEach(bounce => {
    synth.triggerAttackRelease(bounce.note, "8n", now + bounce.time, bounce.velocity);
});

// Stop after 2 seconds
setTimeout(() => {
    Tone.Transport.stop();
}, 2000);
}