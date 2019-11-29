const scale = [
  "c", "df", "d", "ef", "e", "f", "gf", "g", "af", "a", "bf", "b"
];

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

function countRepeats(music) {
  return music.reduce((acc, evt) => {
    if (evt.jump) acc[evt.jump] = (acc[evt.jump] || 0) + 1;
    return acc;
  }, {});
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

function referenceOctave(music) {
  let firstNote = music.filter(m => m.type == "note")[0];

  if (!firstNote) return "";

  return relativeOctave(interval("c", 0, firstNote.pitch, firstNote.octave));
}

function toLilypond(music) {
  let lastDuration = null;
  let lastPitch = "c";
  let lastOctave = referenceOctave(music);
  let repeatCounts = countRepeats(music);
  let result = [];

  result.push(`\\relative c${showOctave(lastOctave + 1)} {`);

  music.forEach(evt => {
    let element = "";

    if (evt.mark) {
      for (let i = 0; i < repeatCounts[evt.mark]; i++)
        result.push("\\repeat volta 2 {");
    }

    switch(evt.type) {
    case "note":
      element += evt.pitch;
      element += showOctave(
        relativeOctave(interval(lastPitch, lastOctave, evt.pitch, evt.octave)));
      lastOctave = evt.octave;
      lastPitch = evt.pitch;
      break;
    case "rest":
      element += "r";
      break;
    }

    if (evt.duration != lastDuration) element += translateDuration(evt.duration);
    lastDuration = evt.duration;

    switch (evt.articulation) {
    case "hammer":
      element = `( ${element})`;
      break;
    }

    result.push(element);

    if (evt.jump) result.push("}");
  });

  result.push("}");

  return result.join(" ");
}

module.exports = {
  toLilypond: toLilypond
};
