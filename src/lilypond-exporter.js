function translateDuration(l) {
  return 4 / l;
}

function translatePitch(evt) {
  let pitch = [evt.pitch];
  for (let i = 0; i < evt.octave; i++) pitch.push("'");
  return pitch.join("");
}

function countRepeats(music) {
  return music.reduce((acc, evt) => {
    if (evt.jump) acc[evt.jump] = (acc[evt.jump] || 0) + 1;
    return acc;
  }, {});
}

function toLilypond(music) {
  let lastDuration = null;
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
      element += translatePitch(evt);
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
