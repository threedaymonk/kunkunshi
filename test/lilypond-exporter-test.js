const expect = require("chai").expect;
const toLilypond = require("../src/lilypond-exporter").toLilypond;

describe("toLilypond", function() {
  it("exports a single note with duration 4", function() {
    let music = [
      {type: "note", duration: 1, pitch: "c", octave: 0}
    ];
    expect(toLilypond(music)).to.have.string("c4 ");
  });

  it("does not repeat an identical duration", function() {
    let music = [
      {type: "note", duration: 1, pitch: "c", octave: 0},
      {type: "note", duration: 1, pitch: "d", octave: 0}
    ];
    expect(toLilypond(music)).to.have.string("c4 d ");
  });

  it("translates shorter durations", function() {
    let music = [
      {type: "note", duration: 1, pitch: "c", octave: 0},
      {type: "note", duration: 0.5, pitch: "d", octave: 0},
      {type: "note", duration: 1, pitch: "e", octave: 0}
    ];
    expect(toLilypond(music)).to.have.string("c4 d8 e4 ");
  });

  it("does not mark changes in octave for small intervals", function() {
    let music = [
      {type: "note", duration: 1, pitch: "c", octave: 0},
      {type: "note", duration: 1, pitch: "d", octave: 0},
      {type: "note", duration: 1, pitch: "e", octave: 0},
      {type: "note", duration: 1, pitch: "f", octave: 0},
      {type: "note", duration: 1, pitch: "g", octave: 0},
      {type: "note", duration: 1, pitch: "a", octave: 0},
      {type: "note", duration: 1, pitch: "b", octave: 0},
      {type: "note", duration: 1, pitch: "c", octave: 1},
      {type: "note", duration: 1, pitch: "d", octave: 1},
      {type: "note", duration: 1, pitch: "e", octave: 1},
      {type: "note", duration: 1, pitch: "f", octave: 1},
      {type: "note", duration: 1, pitch: "g", octave: 1}
    ];
    expect(toLilypond(music)).to.have.string("c4 d e f g a b c d e f g ");
  });

  it("marks changes in octave for large intervals", function() {
    let music = [
      {type: "note", duration: 1, pitch: "c", octave: 2},
      {type: "note", duration: 1, pitch: "g", octave: 1},
      {type: "note", duration: 1, pitch: "c", octave: 2},
      {type: "note", duration: 1, pitch: "f", octave: 1},
      {type: "note", duration: 1, pitch: "c", octave: 2},
      {type: "note", duration: 1, pitch: "a", octave: 0},
      {type: "note", duration: 1, pitch: "e", octave: 2},
      {type: "note", duration: 1, pitch: "c", octave: 2}
    ];
    expect(toLilypond(music)).to.have.string("c4 g c f, c' a, e'' c ");
  });

  it("is relative to middle c when first note is middle c", function() {
    let music = [
      {type: "note", duration: 1, pitch: "c", octave: 0}
    ];
    expect(toLilypond(music)).to.eql(
      "\\relative c' { c4 }"
    );
  });

  it("increases the octave when first note is higher", function() {
    let music = [
      {type: "note", duration: 1, pitch: "c", octave: 1}
    ];
    expect(toLilypond(music)).to.eql("\\relative c'' { c4 }");
  });

  it("exports rests", function() {
    let music = [
      {type: "note", duration: 1, pitch: "c", octave: 0},
      {type: "rest", duration: 1},
      {type: "note", duration: 1, pitch: "d", octave: 0}
    ];
    expect(toLilypond(music)).to.have.string("c4 r d");
  });

  it("exports a single repeat", function() {
    let music = [
      {type: "mark", identifier: "A"},
      {type: "note", duration: 1, pitch: "c", octave: 0},
      {type: "note", duration: 1, pitch: "d", octave: 0},
      {type: "note", duration: 1, pitch: "e", octave: 0},
      {type: "note", duration: 1, pitch: "f", octave: 0},
      {type: "jump", identifier: "A"}
    ];
    expect(toLilypond(music)).to.have.string(
      "\\repeat volta 2 { c4 d e f }"
    );
  });

  it("exports nested repeats", function() {
    let music = [
      {type: "mark", identifier: "A"},
      {type: "note", duration: 1, pitch: "c", octave: 0},
      {type: "note", duration: 1, pitch: "c", octave: 0},
      {type: "note", duration: 1, pitch: "d", octave: 0},
      {type: "note", duration: 1, pitch: "d", octave: 0},
      {type: "jump", identifier: "A"},
      {type: "note", duration: 1, pitch: "e", octave: 0},
      {type: "note", duration: 1, pitch: "e", octave: 0},
      {type: "note", duration: 1, pitch: "f", octave: 0},
      {type: "note", duration: 1, pitch: "f", octave: 0},
      {type: "jump", identifier: "A"}
    ];
    expect(toLilypond(music)).to.have.string(
      "\\repeat volta 2 { \\repeat volta 2 { c4 c d d } e e f f }"
    );
  });

  it("turns hammer-ons into ties", function() {
    let music = [
      {type: "note", duration: 1, pitch: "c", octave: 1},
      {type: "note", duration: 1, pitch: "b", octave: 0, articulation: "hammer"}
    ];
    expect(toLilypond(music)).to.have.string("c4( b)");
  });

  it("turns upstrokes into upbows", function() {
    let music = [
      {type: "note", duration: 1, pitch: "c", octave: 1},
      {type: "note", duration: 1, pitch: "c", octave: 1, articulation: "upstroke"}
    ];
    expect(toLilypond(music)).to.have.string("c4 c \\upbow");
  });

  it("exports chords", function() {
    let music = [{
      type: "chord",
      duration: 1,
      notes: [
        {type: "note", pitch: "f", octave: 0},
        {type: "note", pitch: "d", octave: 1}
      ]
    }];
    expect(toLilypond(music)).to.have.string("<f d'>4");
  });

  it("uses first note in chord as relative reference", function() {
    let music = [{
      type: "chord",
      duration: 1,
      notes: [
        {type: "note", pitch: "f", octave: 0},
        {type: "note", pitch: "d", octave: 1}
      ]
    }];
    music = music.concat(music);
    expect(toLilypond(music)).to.have.string("<f d'>4 <f d'>");
  });

  it("applies hammer-ons to chords", function() {
    let music = [
      {
        type: "chord",
        duration: 1,
        notes: [
          {type: "note", pitch: "f", octave: 0},
          {type: "note", pitch: "c", octave: 1}
        ]
      },
      {
        type: "chord",
        articulation: "hammer",
        duration: 1,
        notes: [
          {type: "note", pitch: "g", octave: 0},
          {type: "note", pitch: "d", octave: 1}
        ]
      }
    ];
    expect(toLilypond(music)).to.have.string("<f c'>4( <g d'>)");
  });

  it("applies upstrokes to chords", function() {
    let music = [{
      type: "chord",
      articulation: "upstroke",
      duration: 1,
      notes: [
        {type: "note", pitch: "f", octave: 0},
        {type: "note", pitch: "d", octave: 1}
      ]
    }];
    expect(toLilypond(music)).to.have.string("<f d'>4 \\upbow");
  });

});
