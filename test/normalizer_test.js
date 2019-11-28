const expect = require("chai").expect;
const normalizer = require("../normalizer");

describe("Normalizer", function() {
  function generateMusic(positions) {
    return positions.map(p => ({type: "note", position: p, length: 1}));
  }

  describe("in honchōshi tuning", function() {
    describe("with high shaku", function() {
      const options = {tuning: "h", shaku: "h"};

      it("reports the pitch of basic positions", function() {
        let input = generateMusic([
          "a", "o", "r",
          "4", "z", "t", "s",
          "k", "5", "6", "7", "8", "9"
        ]);
        expect(normalizer.normalize(input, options).map(n => n.pitch))
          .to.eql([
            "c", "d", "e",
            "f", "g", "a", "b",
            "c", "d", "e", "f", "g", "a"
          ]);
      });

      it("reports the pitch of g-prefixed positions", function() {
        let input = generateMusic(["gr", "gs"]);
        expect(normalizer.normalize(input, options).map(n => n.pitch))
          .to.eql(["f", "c"]);
      });

      it("reports the pitch of n-prefixed positions", function() {
        let input = generateMusic([
          "na", "no",
          "nr", "n4", "nz", "nt",
          "ns", "nk", "n5", "n6", "n7"
        ]);
        expect(normalizer.normalize(input, options).map(n => n.pitch))
          .to.eql([
            "c", "d",
            "e", "f", "g", "a",
            "b", "c", "d", "e", "f"
          ]);
      });

      it("reports the octave of basic positions", function() {
        let input = generateMusic([
          "a", "o", "r",
          "4", "z", "t", "s",
          "k", "5", "6", "7", "8", "9"
        ]);
        expect(normalizer.normalize(input, options).map(n => n.octave))
          .to.eql([
            0, 0, 0,
            0, 0, 0, 0,
            1, 1, 1, 1, 1, 1,
          ]);
      });

      it("reports the octave of g-prefixed positions", function() {
        let input = generateMusic(["gr", "gs"]);
        expect(normalizer.normalize(input, options).map(n => n.octave))
          .to.eql([0, 1]);
      });

      it("reports the octave of n-prefixed positions", function() {
        let input = generateMusic([
          "na", "no",
          "nr", "n4", "nz", "nt",
          "ns", "nk", "n5", "n6", "n7"
        ]);
        expect(normalizer.normalize(input, options).map(n => n.octave))
          .to.eql([
            1, 1,
            1, 1, 1, 1,
            1, 2, 2, 2, 2
          ]);
      });
    });

    describe("with low shaku", function() {
      const options = {tuning: "h", shaku: "l"};

      it("reports the pitch of basic positions", function() {
        let input = generateMusic([
          "a", "o", "r",
          "4", "z", "t", "s",
          "k", "5", "6", "7", "8", "9"
        ]);
        expect(normalizer.normalize(input, options).map(n => n.pitch))
          .to.eql([
            "c", "d", "e",
            "f", "g", "a", "as",
            "c", "d", "e", "f", "g", "a"
          ]);
      });

      it("reports the pitch of n-prefixed positions", function() {
        let input = generateMusic([
          "na", "no",
          "nr", "n4", "nz", "nt",
          "ns", "nk", "n5", "n6", "n7"
        ]);
        expect(normalizer.normalize(input, options).map(n => n.pitch))
          .to.eql([
            "c", "d",
            "e", "f", "g", "a",
            "as", "c", "d", "e", "f"
          ]);
      });
    });
  });
});
