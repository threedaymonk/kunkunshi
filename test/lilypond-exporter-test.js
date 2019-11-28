const expect = require("chai").expect;
const toLilypond = require("../src/lilypond-exporter").toLilypond;

describe("toLilypond", function() {
  it("exports a single note with duration 4", function() {
    let music = [
      {type: "note", duration: 1, pitch: "c", octave: 0}
    ];
    expect(toLilypond(music)).to.eql("c4");
  });

  it("does not repeat an identical duration", function() {
    let music = [
      {type: "note", duration: 1, pitch: "c", octave: 0},
      {type: "note", duration: 1, pitch: "d", octave: 0}
    ];
    expect(toLilypond(music)).to.eql("c4 d");
  });

  it("translates shorter durations", function() {
    let music = [
      {type: "note", duration: 1, pitch: "c", octave: 0},
      {type: "note", duration: 0.5, pitch: "d", octave: 0},
      {type: "note", duration: 1, pitch: "e", octave: 0}
    ];
    expect(toLilypond(music)).to.eql("c4 d8 e4");
  });

  it("marks changes in octave", function() {
    let music = [
      {type: "note", duration: 1, pitch: "c", octave: 0},
      {type: "note", duration: 1, pitch: "c", octave: 1},
      {type: "note", duration: 1, pitch: "c", octave: 2},
      {type: "note", duration: 1, pitch: "c", octave: 1},
      {type: "note", duration: 1, pitch: "c", octave: 0}
    ];
    expect(toLilypond(music)).to.eql("c4 c' c' c, c,");
  });

  it("exports rests", function() {
    let music = [
      {type: "note", duration: 1, pitch: "c", octave: 0},
      {type: "rest", duration: 1},
      {type: "note", duration: 1, pitch: "d", octave: 0}
    ];
    expect(toLilypond(music)).to.eql("c4 r d");
  });

  it("exports a single repeat", function() {
    let music = [
      {type: "note", duration: 1, pitch: "c", octave: 0, mark: "A"},
      {type: "note", duration: 1, pitch: "d", octave: 0},
      {type: "note", duration: 1, pitch: "e", octave: 0},
      {type: "note", duration: 1, pitch: "f", octave: 0, jump: "A"}
    ];
    expect(toLilypond(music)).to.eql("\\repeat volta 2 { c4 d e f }");
  }); 

  it("exports nested repeats", function() {
    let music = [
      {type: "note", duration: 1, pitch: "c", octave: 0, mark: "A"},
      {type: "note", duration: 1, pitch: "d", octave: 0},
      {type: "note", duration: 1, pitch: "e", octave: 0},
      {type: "note", duration: 1, pitch: "f", octave: 0, jump: "A"},
      {type: "note", duration: 1, pitch: "g", octave: 0},
      {type: "note", duration: 1, pitch: "a", octave: 0},
      {type: "note", duration: 1, pitch: "b", octave: 0},
      {type: "note", duration: 1, pitch: "c", octave: 0, jump: "A"}
    ];
    expect(toLilypond(music))
      .to.eql("\\repeat volta 2 { \\repeat volta 2 { c4 d e f } g a b c }");
  }); 
});
