const tunings = {
  "h":  {offsets: [0, 5, 12], changes: {}},
  "2a": {offsets: [0, 7, 12], changes: {}},
  "3s": {offsets: [0, 5, 10], changes: {"7": 1}}
};

const positions = [
  ["a", "_", "o", "_", "r", "gr"],
  ["4", "_", "z", "_", "t", "s", "_", "gs"],
  ["k", "_", "5", "_", "6", "7", "_", "8", "_", "9"]
];

const scale = [
  "c", "df", "d", "ef", "e", "f", "gf", "g", "af", "a", "bf", "b"
];

function buildPositionMap(offsets) {
  let result = {};
  offsets.forEach((stringOffset, i) => {
    positions[i].forEach((position, offset) => {
      result[position] = stringOffset + offset;
    });
  });
  return result;
}

function processEvent(positionMap, evt) {
  switch (evt.type) {
  case "note":
    return processNote(positionMap, evt);
  case "chord":
    return processChord(positionMap, evt);
  default:
    return evt;
  }
}

function processNote(positionMap, evt) {
  let unprefixedPos = evt.position.replace(/^n/, "");
  let semitones = positionMap[unprefixedPos];
  let pitch = scale[semitones % 12];
  let octave = Math.floor(semitones / 12);
  if (evt.position.match(/^n/)) octave++;

  return Object.assign(evt, {pitch: pitch, octave: octave});
}

function processChord(positionMap, evt) {
  let notes = evt.notes.map(e => processEvent(positionMap, e));
  return Object.assign(evt, {notes: notes});
}

function addPitches(music, options) {
  let tuning = tunings[options.tuning || "h"];
  if (!tuning) throw `Unrecognised tuning: ${options.tuning}`;

  let shaku = options.shaku || "low";
  let positionMap = buildPositionMap(tuning.offsets);

  if (shaku == "high") positionMap["s"] += 1;
  Object.keys(tuning.changes)
    .forEach(k => positionMap[k] += tuning.changes[k]);

  return music.map(e => processEvent(positionMap, e));
}

module.exports = {
  addPitches: addPitches
};
