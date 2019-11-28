const positions = {
  "a":  ["c", 0],
  "o":  ["d", 0],
  "r":  ["e", 0],
  "gr": ["f", 0],

  "4":  ["f", 0],
  "z":  ["g", 0],
  "t":  ["a", 0],
  "s":  ["b", 0],
  "gs": ["c", 1],

  "k":  ["c", 1],
  "5":  ["d", 1],
  "6":  ["e", 1],
  "7":  ["f", 1],
  "8":  ["g", 1],
  "9":  ["a", 1]
};

function processEvent(evt) {
  if (evt.type == "note") {
    let rawPos = evt.position.replace(/^n/, "");
    let [pitch, octave] = positions[rawPos];
    if (evt.position.match(/^n/)) octave++;
    let augment = {pitch: pitch, octave: octave};
    return Object.assign(augment, evt);
  } else {
    return evt;
  }
}

function normalize(music) {
  return music.map(e => processEvent(e));
}

module.exports = {
  normalize: normalize
};
