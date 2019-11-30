const scale = [
  "c", "df", "d", "ef", "e", "f", "gf", "g", "af", "a", "bf", "b"
];

function makeSequence(events) {
  let sequence = [];
  events.forEach(evt => {
    if (evt.mark) sequence.push({type: "mark", identifier: evt.mark});
    switch (evt.type) {
    case "chord":
      sequence.push({type: "begin_chord"});
      sequence = sequence.concat(makeSequence(evt.music));
      sequence.push({type: "end_chord"});
      break;
    case "note":
    case "rest":
      sequence.push(evt);
      break;
    }
    if (evt.jump) sequence.push({type: "jump", identifier: evt.jump});
  });

  return sequence;
}

function translateDuration(l) {
  return 4 / l;
}

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

function toLilypond(music) {
  let sequence = makeSequence(music);
  let lastDuration = null;
  let lastPitch = "c";
  let lastOctave = referenceOctave(sequence);
  let repeatCounts = countRepeats(sequence);
  let result = [];

  result.push(`\\relative c${showOctave(lastOctave + 1)} {`);

  sequence.forEach(evt => {
    let element;
    switch(evt.type) {
    case "begin_chord":
      result.push("<<");
      result.push("CONSUME");
      break;
    case "end_chord":
      result.push("CONSUME");
      result.push(">>");
      break;
    case "mark":
      for (let i = 0; i < repeatCounts[evt.identifier]; i++)
        result.push("\\repeat volta 2 {");
      break;
    case "jump":
      result.push("}");
      break;
    case "note":
      element = evt.pitch;
      element += showOctave(relativeOctave(
        interval(lastPitch, lastOctave, evt.pitch, evt.octave)));
      if (evt.duration != lastDuration)
        element += translateDuration(evt.duration);
      lastDuration = evt.duration;
      lastOctave = evt.octave;
      lastPitch = evt.pitch;
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
      break;
    case "rest":
      element = "r";
      if (evt.duration != lastDuration)
        element += translateDuration(evt.duration);
      lastDuration = evt.duration;
      result.push(element);
      break;
    }
  });

  result.push("}");

  return result.join(" ").replace(/\s*CONSUME\s*/g, "");
}

module.exports = {
  toLilypond: toLilypond
};
