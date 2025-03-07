let synth1, filt, rev;
let activeKey = null;

let keyNotes = {
  'a': 'A4',
  's': 'B4',
  'd': 'C5',
  'f': 'D5',
  'g': 'E5',
  'h': 'F5',
  'i': 'G5',
  'j': 'A5',
};

let reverbToggle = false;

function setup() {
  createCanvas(400, 400);

  filt = new Tone.Filter(1000, "lowpass").toDestination();
  rev = new Tone.Reverb(3).toDestination();  // Default decay of 3 seconds
  synth1 = new Tone.PluckSynth({
    envelope: {
      attack: 0.1,
      decay: 0.2,
      sustain: 0.9,
      release: 0.3
    }
  });

  synth1.connect(rev); // Connect to reverb by default

  let reverbButton = createButton('Toggle Reverb');
  reverbButton.position(140, 250);
  reverbButton.mousePressed(toggleReverb);
}

function draw() {
  background(220);
  textSize(16);
  text('Use keys A-J', 140, 100);
  text('Reverb: ' + (reverbToggle ? 'ON' : 'OFF'), 140, 230);
}

function keyPressed() {
  let keyLower = key.toLowerCase(); // Convert to lowercase
  let pitch = keyNotes[keyLower];

  if (pitch && keyLower !== activeKey) {
    activeKey = keyLower;
    synth1.triggerAttackRelease(pitch, 0.5); // PluckSynth prefers attack-release
  }
}

function keyReleased() {
  if (key.toLowerCase() === activeKey) {
    activeKey = null;
  }
}

function toggleReverb() {
  reverbToggle = !reverbToggle;

  if (reverbToggle) {
    synth1.connect(rev);
  } else {
    synth1.disconnect(rev);
    synth1.connect(Tone.Destination); // Connect directly to output
  }
}
