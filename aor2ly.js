const fs = require("fs");
const stripIndent = require("common-tags").stripIndent;
const oneLineTrim = require("common-tags").oneLineTrim;
const parser = require("./src/aor-parser.js");
const addPitches = require("./src/pitch-adder").addPitches;
const toLilypond = require("./src/lilypond-exporter").toLilypond;
const filename = process.argv[2];

const tunings = {
  "h":  ["honchoushi", "本調子"],
  "2a": ["niage", "ニ揚げ"],
  "3s": ["sansage", "三下げ"]
};

fs.writeSync(2, `Processing ${filename}\n`);
let input = fs.readFileSync(filename, "UTF-8");
let tree;

try {
  tree = parser.parse(input);
} catch(e) {
  throw oneLineTrim`
    Error at line ${e.location.start.line},
    column ${e.location.start.column}: ${e.message}
  `;
}

let options = {
  tuning: tree.metadata.Tuning,
  shaku: tree.metadata.Shaku
};

let key = tree.metadata.Shaku == "high" ? "c \\major" : "d \\minor";

let music = addPitches(tree.music, options);
let [tuningCode, tuningName] = tunings[tree.metadata.Tuning || "h"];
let melody = toLilypond(music);

fs.writeSync(1, stripIndent`
  \\version "2.18.2"
  \\include "kunkunshi.ly"
  \\language "english"

  \\paper{
    #(set-paper-size "a4")
    #(define fonts
      (set-global-fonts
       #:roman "IPAexGothic"
       #:factor (/ staff-height pt 20) ; unnecessary if the staff size is default
      ))
  }

  \\header {
    title = "${tree.metadata.Title}"
    meter = "${tuningName}"
  }

  global = {
    \\time 2/4
    \\key ${key}
  }

  melody = {
    \\global

    ${melody}
  }

  \\score {
    <<
      \\new Staff { \\melody }
      \\new TabStaff {
        \\set TabStaff.stringTunings = #sanshin-${tuningCode}-tuning
        \\kunkunshiNotation
        \\melody
      }
    >>
    \\layout { }
    \\midi { }
  }
`);
