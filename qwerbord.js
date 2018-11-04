/*
This Qwerbord --
TODO: Make it possible to 'tune' row by shifting the starting note up/down by
half steps
TODO: Just intonation option
*/

function setup() {

  // Create an array of 12 oscillators
  inactiveVoices = [];
  for (i=0;i<12;i++) {
    inactiveVoices.push(new p5.Oscillator)
    inactiveVoices[i].start();
    inactiveVoices[i].amp(0);
    inactiveVoices[i].setType('sawtooth');
  }

  // Create an empty Map object to store active voices as keyCode/oscillator
  // pairs
  activeVoices = new Map();

  // Create an array of 21 frequencies one half step apart starting at 200 hz
  notes = [200];
  for (i=0;i<21;i++) {
    notes.push(notes[i] * Math.pow(2, 1/12));
  }

  // Create an array of 'rows' where each row is an array of the keycodes for
  // that row
  // Store keycode/note pairs in a map instead?
  fourthRow = [49,50,51,52,53,54,55,56,57,48,189,187];
  thirdRow = [81,87,69,82,84,89,85,73,79,80,219,221];
  secondRow = [65,83,68,70,71,72,74,75,76,186,222];
  firstRow = [90,88,67,86,66,78,77,188,190,191];
  keyBoard = [firstRow, secondRow, thirdRow, fourthRow];

  // Set the interval between rows
  rowOffset = 3;
}

function keyPressed() {
  keyBoard.forEach(function(row, rowNum) {
    if (row.includes(keyCode)) {
      note = notes[row.indexOf(keyCode) + rowOffset * rowNum];
      playNote(keyCode, note);
    }
  });
}

function playNote(keyCode, note) {
  osc = inactiveVoices.pop();
  // If no oscillators are available, do nothing
  if (!osc) {
    return;
  }
  osc.freq(note);
  osc.amp(.3, .01);
  activeVoices.set(keyCode, osc);
  console.log(note);
}

function keyReleased() {
  if (activeVoices.has(keyCode)) {
    osc = activeVoices.get(keyCode);
    osc.amp(0, .01);
    inactiveVoices.push(osc);
    activeVoices.delete(keyCode);
  }
}
