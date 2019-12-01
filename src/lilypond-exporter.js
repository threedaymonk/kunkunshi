const scale = [
  "c", "df", "d", "ef", "e", "f", "gf", "g", "af", "a", "bf", "b"
];

function octaveIndicator(rel) {
  let indicator = rel > 0 ? "'" : ",";
  return indicator.repeat(Math.abs(rel));
}

function relativeOctave(noteA, octaveA, noteB, octaveB) {
  let interval = absolutePitch(noteB, octaveB) - absolutePitch(noteA, octaveA);
  let result = 0;
  let abs = Math.abs(interval);
  let delta = interval > 0 ? 1 : -1;
  for (let i = abs; i > 5; i -= 12) result += delta;
  return result;
}

function countRepeats(sequence) {
  return sequence
    .filter(e => e.type == "jump")
    .map(e => e.label)
    .reduce((a, e) => { a[e] = (a[e] || 0) + 1; return a; }, {});
}

function absolutePitch(note, octave) {
  return scale.indexOf(note) + octave * 12;
}

function referenceOctave(sequence) {
  let firstNote = sequence.filter(m => m.type == "note")[0];

  if (!firstNote) return "";

  return relativeOctave("c", 0, firstNote.pitch, firstNote.octave);
}

function emitArticulationsBefore(state, evt) {
  if (evt.articulation == "hammer") {
    state.result.push("CONSUME");
    state.result.push("(");
  }
}

function emitArticulationsAfter(state, evt) {
  if (evt.articulation == "upstroke")
    state.result.push("\\upbow");
  if (evt.articulation == "hammer") {
    state.result.push("CONSUME");
    state.result.push(")");
  }
}

function emitPitch(state, evt) {
  state.result.push(evt.pitch);
}

function emitDuration(state, evt) {
  if (evt.duration == state.duration) return;

  state.duration = evt.duration;
  state.result.push("CONSUME");
  state.result.push(`${4 / evt.duration}`);
}

function emitOctave(state, evt) {
  let rel = relativeOctave(state.pitch, state.octave, evt.pitch, evt.octave);

  state.octave = evt.octave;
  state.pitch = evt.pitch;

  if (rel == 0) return;

  state.result.push("CONSUME");
  state.result.push(octaveIndicator(rel));
}

function emitChord(state, evt) {
  emitArticulationsBefore(state, evt);
  state.result.push("<");
  state.result.push("CONSUME");
  evt.notes.forEach(note => {
    emitPitch(state, note);
    emitOctave(state, note);
  });
  state.pitch = evt.notes[0].pitch;
  state.octave = evt.notes[0].octave;
  state.result.push("CONSUME");
  state.result.push(">");
  emitDuration(state, evt);
  emitArticulationsAfter(state, evt);
}

function emitJump(state) {
  state.result.push("}");
}

function emitMark(state, evt) {
  for (let i = 0; i < state.repeats[evt.label]; i++)
    state.result.push("\\repeat volta 2 {");
}

function emitNote(state, evt) {
  emitArticulationsBefore(state, evt);
  emitPitch(state, evt);
  emitOctave(state, evt);
  emitDuration(state, evt);
  emitArticulationsAfter(state, evt);
}

function emitRest(state, evt) {
  state.result.push("r");
  emitDuration(state, evt);
}

const emit = {
  chord: emitChord,
  jump: emitJump,
  mark: emitMark,
  note: emitNote,
  rest: emitRest
};

function toLilypond(sequence) {
  let state = {
    duration: null,
    pitch: "c",
    octave: referenceOctave(sequence),
    repeats: countRepeats(sequence),
    result: []
  };

  state.result.push(`\\relative c${octaveIndicator(state.octave + 1)} {`);
  sequence.forEach(evt => emit[evt.type](state, evt));
  state.result.push("}");

  return state.result.join(" ").replace(/\s*CONSUME\s*/g, "");
}

module.exports = {
  toLilypond: toLilypond
};
