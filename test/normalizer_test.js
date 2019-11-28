const expect = require("chai").expect;
const normalizer = require("../normalizer");

describe("Normalizer", function() {
  function generateMusic(positions) {
    return positions.map(p => ({type: "note", position: p, length: 1}));
  }

  describe("in honchōshi tuning", function() {
    describe("with high shaku", function() {
      const options = {tuning: "h", shaku: "high"};

      it("reports the pitch of basic positions on lowest string", function() {
        let input = generateMusic(["a", "o", "r"]);
        expect(normalizer.normalize(input, options).map(n => n.pitch))
          .to.eql(["c", "d", "e"]);
      });

      it("reports the pitch of basic positions on middle string", function() {
        let input = generateMusic(["4", "z", "t", "s"]);
        expect(normalizer.normalize(input, options).map(n => n.pitch))
          .to.eql(["f", "g", "a", "b"]);
      });

      it("reports the pitch of basic positions on highest string", function() {
        let input = generateMusic(["k", "5", "6", "7", "8", "9"]);
        expect(normalizer.normalize(input, options).map(n => n.pitch))
          .to.eql(["c", "d", "e", "f", "g", "a"]);
      });

      it("reports the octave of basic positions on lowest string", function() {
        let input = generateMusic(["a", "o", "r"]);
        expect(normalizer.normalize(input, options).map(n => n.octave))
          .to.eql([0, 0, 0]);
      });

      it("reports the octave of basic positions on middle string", function() {
        let input = generateMusic(["4", "z", "t", "s"]);
        expect(normalizer.normalize(input, options).map(n => n.octave))
          .to.eql([0, 0, 0, 0]);
      });

      it("reports the octave of basic positions on highest string", function() {
        let input = generateMusic(["k", "5", "6", "7", "8", "9"]);
        expect(normalizer.normalize(input, options).map(n => n.octave))
          .to.eql([1, 1, 1, 1, 1, 1]);
      });

      it("reports the pitch of g-prefixed positions", function() {
        let input = generateMusic(["gr", "gs"]);
        expect(normalizer.normalize(input, options).map(n => n.pitch))
          .to.eql(["f", "c"]);
      });

      it("reports the octave of g-prefixed positions", function() {
        let input = generateMusic(["gr", "gs"]);
        expect(normalizer.normalize(input, options).map(n => n.octave))
          .to.eql([0, 1]);
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
      const options = {tuning: "h", shaku: "low"};

      it("reports the pitch of basic positions on lowest string", function() {
        let input = generateMusic(["a", "o", "r"]);
        expect(normalizer.normalize(input, options).map(n => n.pitch))
          .to.eql(["c", "d", "e"]);
      });

      it("reports the pitch of basic positions on middle string", function() {
        let input = generateMusic(["4", "z", "t", "s"]);
        expect(normalizer.normalize(input, options).map(n => n.pitch))
          .to.eql(["f", "g", "a", "as"]);
      });

      it("reports the pitch of basic positions on highest string", function() {
        let input = generateMusic(["k", "5", "6", "7", "8", "9"]);
        expect(normalizer.normalize(input, options).map(n => n.pitch))
          .to.eql(["c", "d", "e", "f", "g", "a"]);
      });

      it("reports the octave of basic positions on lowest string", function() {
        let input = generateMusic(["a", "o", "r"]);
        expect(normalizer.normalize(input, options).map(n => n.octave))
          .to.eql([0, 0, 0]);
      });

      it("reports the octave of basic positions on middle string", function() {
        let input = generateMusic(["4", "z", "t", "s"]);
        expect(normalizer.normalize(input, options).map(n => n.octave))
          .to.eql([0, 0, 0, 0]);
      });

      it("reports the octave of basic positions on highest string", function() {
        let input = generateMusic(["k", "5", "6", "7", "8", "9"]);
        expect(normalizer.normalize(input, options).map(n => n.octave))
          .to.eql([1, 1, 1, 1, 1, 1]);
      });

      it("reports the pitch of g-prefixed positions", function() {
        let input = generateMusic(["gr", "gs"]);
        expect(normalizer.normalize(input, options).map(n => n.pitch))
          .to.eql(["f", "c"]);
      });

      it("reports the octave of g-prefixed positions", function() {
        let input = generateMusic(["gr", "gs"]);
        expect(normalizer.normalize(input, options).map(n => n.octave))
          .to.eql([0, 1]);
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
  });

  describe("in niage tuning", function() {
    const options = {tuning: "2a"};

    it("reports the pitch of basic positions on lowest string", function() {
      let input = generateMusic(["a", "o", "r"]);
      expect(normalizer.normalize(input, options).map(n => n.pitch))
        .to.eql(["c", "d", "e"]);
    });

    it("reports the pitch of basic positions on middle string", function() {
      let input = generateMusic(["4", "z", "t", "s"]);
      expect(normalizer.normalize(input, options).map(n => n.pitch))
        .to.eql(["g", "a", "b", "c"]);
    });

    it("reports the pitch of basic positions on highest string", function() {
      let input = generateMusic(["k", "5", "6", "7", "8", "9"]);
      expect(normalizer.normalize(input, options).map(n => n.pitch))
        .to.eql(["c", "d", "e", "f", "g", "a"]);
    });

    it("reports the octave of basic positions on lowest string", function() {
      let input = generateMusic(["a", "o", "r"]);
      expect(normalizer.normalize(input, options).map(n => n.octave))
        .to.eql([0, 0, 0]);
    });

    it("reports the octave of basic positions on middle string", function() {
      let input = generateMusic(["4", "z", "t", "s"]);
      expect(normalizer.normalize(input, options).map(n => n.octave))
        .to.eql([0, 0, 0, 1]);
    });

    it("reports the octave of basic positions on highest string", function() {
      let input = generateMusic(["k", "5", "6", "7", "8", "9"]);
      expect(normalizer.normalize(input, options).map(n => n.octave))
        .to.eql([1, 1, 1, 1, 1, 1]);
    });

    it("reports the pitch of g-prefixed positions", function() {
      let input = generateMusic(["gr", "gs"]);
      expect(normalizer.normalize(input, options).map(n => n.pitch))
        .to.eql(["f", "d"]);
    });

    it("reports the octave of g-prefixed positions", function() {
      let input = generateMusic(["gr", "gs"]);
      expect(normalizer.normalize(input, options).map(n => n.octave))
        .to.eql([0, 1]);
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
          "e", "g", "a", "b",
          "c", "c", "d", "e", "f"
        ]);
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
          2, 2, 2, 2, 2
        ]);
    });
  });

  describe("in sansage tuning", function() {
    const options = {tuning: "3s"};

    it("reports the pitch of basic positions on lowest string", function() {
      let input = generateMusic(["a", "o", "r"]);
      expect(normalizer.normalize(input, options).map(n => n.pitch))
        .to.eql(["c", "d", "e"]);
    });

    it("reports the pitch of basic positions on middle string", function() {
      let input = generateMusic(["4", "z", "t", "s"]);
      expect(normalizer.normalize(input, options).map(n => n.pitch))
        .to.eql(["f", "g", "a", "as"]);
    });

    it("reports the pitch of basic positions on highest string", function() {
      let input = generateMusic(["k", "5", "6", "7", "8", "9"]);
      expect(normalizer.normalize(input, options).map(n => n.pitch))
        .to.eql(["as", "c", "d", "e", "f", "g"]);
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
          "as", "as", "c", "d", "e"
        ]);
    });
  });

  describe("with unrecognised tuning", function() {
    const options = {tuning: "???"};

    it("throws an exception", function() {
      expect(function() { normalizer.normalize([], options); })
        .to.throw("tuning");
    });
  });
});
