function translateDuration(l) {
  return 4 / l;
}

function showOctave(past, current) {
  let result = [];
  let indicator = current > past ? "'" : ",";
  let count = Math.abs(past - current);
  for (let i = 0; i < count; i++) result.push(indicator);
  return result.join("");
}

function countRepeats(music) {
  return music.reduce((acc, evt) => {
    if (evt.jump) acc[evt.jump] = (acc[evt.jump] || 0) + 1;
    return acc;
  }, {});
}

function toLilypond(music) {
  let lastDuration = null;
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
      element += showOctave(lastOctave, evt.octave);
      lastOctave = evt.octave;
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
