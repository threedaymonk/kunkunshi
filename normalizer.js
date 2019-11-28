const tunings = {
  h: {
    offsets: [0, 5, 12],
    positions: [
      ["a", "_", "o", "_", "r", "gr"],
      ["4", "_", "z", "_", "t", "s", "_", "gs"],
      ["k", "_", "5", "_", "6", "7", "_", "8", "_", "9"]
    ]
  }
};

const scale = [
  "c", "cs", "d", "ds", "e", "f", "fs", "g", "gs", "a", "as", "b"
];

function buildPositionMap(offsets, positions) {
  let result = {};
  offsets.forEach((stringOffset, i) => {
    positions[i].forEach((position, offset) => {
      result[position] = stringOffset + offset;
    });
  });
  return result;
}

function processEvent(positions, evt) {
  if (evt.type == "note") {
    let unprefixedPos = evt.position.replace(/^n/, "");
    let semitones = positions[unprefixedPos];
    let pitch = scale[semitones % 12];
    let octave = Math.floor(semitones / 12);
    if (evt.position.match(/^n/)) octave++;
    let augment = {pitch: pitch, octave: octave};
    return Object.assign(augment, evt);
  } else {
    return evt;
  }
}

function normalize(music, options) {
  let tuning = tunings[options.tuning || "h"];
  let shaku = options.shaku || "h";

  let positions = buildPositionMap(tuning.offsets, tuning.positions);
  if (shaku == "h") positions["s"] += 1;
  return music.map(e => processEvent(positions, e));
}

module.exports = {
  normalize: normalize
};
