const scale = [
  "c", "df", "d", "ef", "e", "f", "gf", "g", "af", "a", "bf", "b"
];

function translateDuration(l) {
  return 4 / l;
}

function showOctave(interval) {
  let result = [];
  let abs = Math.abs(interval);
  let indicator = interval > 0 ? "'" : ",";
  for (let i = abs; i > 5; i -= 12) result.push(indicator);

  return result.join("");
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

function toLilypond(music) {
  let lastDuration = null;
  let lastPitch = null;
  let lastOctave = 0;
  let repeatCounts = countRepeats(music);
  let result = [];

  music.forEach(evt => {
    let element = "";

    if (evt.mark) {
      for (let i = 0; i < repeatCounts[evt.mark]; i++)
        result.push("\\repeat volta 2 {");
    }

    switch(evt.type) {
    case "note":
      element += evt.pitch;
      element += showOctave(interval(lastPitch, lastOctave, evt.pitch, evt.octave));
      lastOctave = evt.octave;
      lastPitch = evt.pitch;
      break;
    case "rest":
      element += "r";
      break;
    }

    if (evt.duration != lastDuration) element += translateDuration(evt.duration);
    lastDuration = evt.duration;

    result.push(element);

    if (evt.jump) result.push("}");
  });

  return result.join(" ");
}

module.exports = {
  toLilypond: toLilypond
};
