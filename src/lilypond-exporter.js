const scale = [
  "c", "df", "d", "ef", "e", "f", "gf", "g", "af", "a", "bf", "b"
];

function showOctave(rel) {
  let indicator = rel > 0 ? "'" : ",";
  return indicator.repeat(Math.abs(rel));
}

function relativeOctave(interval) {
  let result = 0;
  let abs = Math.abs(interval);
  let delta = interval > 0 ? 1 : -1;
  for (let i = abs; i > 5; i -= 12) result += delta;
  return result;
}

function countRepeats(sequence) {
  return sequence
    .filter(e => e.type == "jump")
    .map(e => e.identifier)
    .reduce((a, e) => { a[e] = (a[e] || 0) + 1; return a; }, {});
}

function absolutePitch(note, octave) {
  return scale.indexOf(note) + octave * 12;
}

function interval(lastNote, lastOctave, currentNote, currentOctave) {
  if (!lastNote) return null;

  let lastAbs = absolutePitch(lastNote, lastOctave);
  let currentAbs = absolutePitch(currentNote, currentOctave);

  return currentAbs - lastAbs;
}

function referenceOctave(sequence) {
  let firstNote = sequence.filter(m => m.type == "note")[0];

  if (!firstNote) return "";

  return relativeOctave(interval("c", 0, firstNote.pitch, firstNote.octave));
}

function markDuration(state, evt) {
  if (!evt.duration) return "";
  if (evt.duration == state.duration) return "";

  state.duration = evt.duration;
  return `${4 / evt.duration}`;
}

function markOctave(state, evt) {
  if (!evt.pitch) return "";
  let result = showOctave(relativeOctave(
    interval(state.pitch, state.octave, evt.pitch, evt.octave)));
  state.octave = evt.octave;
  state.pitch = evt.pitch;
  return result;
}

const emit = {
  chord: (result, state, evt) => {
    if (evt.articulation == "hammer") {
      result.push("CONSUME");
      result.push("(");
    }
    result.push("<");
    result.push("CONSUME");
    evt.notes.forEach(note => {
      result.push([
        note.pitch,
        markOctave(state, note)
      ].join(""));
    });
    state.pitch = evt.notes[0].pitch;
    state.octave = evt.notes[0].octave;
    result.push("CONSUME");
    result.push([
      ">",
      markDuration(state, evt)
    ].join(""));
    if (evt.articulation == "upstroke")
      result.push("\\upbow");
    if (evt.articulation == "hammer") {
      result.push("CONSUME");
      result.push(")");
    }
  },

  mark: (result, state, evt) => {
    for (let i = 0; i < state.repeats[evt.identifier]; i++)
      result.push("\\repeat volta 2 {");
  },

  jump: (result) => result.push("}"),

  note: (result, state, evt) => {
    let element = [
      evt.pitch,
      markOctave(state, evt),
      markDuration(state, evt)
    ].join("");
    switch (evt.articulation) {
    case "hammer":
      result.push("CONSUME");
      element = `( ${element})`;
      break;
    case "upstroke":
      element += " \\upbow";
      break;
    }
    result.push(element);
  },

  rest: (result, state, evt) => {
    result.push([
      "r",
      markDuration(state, evt)
    ].join(""));
  }
};

function toLilypond(sequence) {
  let state = {
    duration: null,
    pitch: "c",
    octave: referenceOctave(sequence),
    repeats: countRepeats(sequence)
  };
  let result = [];

  result.push(`\\relative c${showOctave(state.octave + 1)} {`);
  sequence.forEach(evt => emit[evt.type](result, state, evt));
  result.push("}");

  return result.join(" ").replace(/\s*CONSUME\s*/g, "");
}

module.exports = {
  toLilypond: toLilypond
};
