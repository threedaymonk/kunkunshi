const expect = require("chai").expect;
const stripIndent = require("common-tags").stripIndent;
const parser = require("../src/aor-parser");

describe("Parser", function() {
  describe("metadata", function() {
    it("reports itself as version 1", function() {
      let input = stripIndent`
        Title: Test

        a
      `;

      expect(parser.parse(input).version).to.eql(1);
    });

    it("extracts multiple headers", function() {
      let input = stripIndent`
        Title: Hello World
        Info: I am an example string

        a
      `;

      expect(parser.parse(input)).to.include({
        title: "Hello World",
        info: "I am an example string"
      });
    });
  });

  describe("music", function() {
    it("parses notes", function() {
      let input = stripIndent`
        Title: Test

        a o r
      `;

      expect(parser.parse(input).music).to.eql([
        {type: "note", position: "a", duration: 1},
        {type: "note", position: "o", duration: 1},
        {type: "note", position: "r", duration: 1},
      ]);
    });

    it("parses basic positions", function() {
      let input = stripIndent`
        Title: Test

        a o r
        4 z t s
        k 5 6 7 8 9
      `;

      expect(parser.parse(input).music.map(n => n.position)).to.eql([
        "a", "o", "r",
        "4", "z", "t", "s",
        "k", "5", "6", "7", "8", "9"
      ]);
    });

    it("parses 下-prefixed positions (g = ge)", function() {
      let input = stripIndent`
        Title: Test

        gs gr
      `;

      expect(parser.parse(input).music.map(n => n.position)).to.eql([
        "gs", "gr"
      ]);
    });

    it("parses 亻-prefixed positions (n = ninben)", function() {
      let input = stripIndent`
        Title: Test

        na no
        nr n4 nz nt
        ns nk n5 n6 n7
      `;

      expect(parser.parse(input).music.map(n => n.position)).to.eql([
        "na", "no",
        "nr", "n4", "nz", "nt",
        "ns", "nk", "n5", "n6", "n7"
      ]);
    });

    it("parses 下- and 亻-prefixed positions", function() {
      let input = stripIndent`
        Title: Test

        gns gnr
      `;

      expect(parser.parse(input).music.map(n => n.position)).to.eql([
        "gns", "gnr"
      ]);
    });

    it("parses note durations", function() {
      let input = stripIndent`
        Title: Test

        a a/ a/2 a1/2 a/4 a3/2 a2
      `;

      expect(parser.parse(input).music.map(n => n.duration)).to.eql([
        1, 0.5, 0.5, 0.5, 0.25, 1.5, 2
      ]);
    });

    it("parses rests", function() {
      let input = stripIndent`
        Title: Test

        0 0/2 03/4
      `;

      expect(parser.parse(input).music).to.eql([
        {type: "rest", duration: 1},
        {type: "rest", duration: 0.5},
        {type: "rest", duration: 0.75}
      ]);
    });

    it("applies repetition start marker to next note", function() {
      let input = stripIndent`
        Title: Test

        a -> a A> a B> a C> a a
      `;

      expect(parser.parse(input).music.map(n => n.mark)).to.eql([
        undefined, "A", "A", "B", "C", undefined
      ]);
    });

    it("applies repetition end marker to preceding note", function() {
      let input = stripIndent`
        Title: Test

        a a <- a <A a <B a <C a
      `;

      expect(parser.parse(input).music.map(n => n.jump)).to.eql([
        undefined, "A", "A", "B", "C", undefined
      ]);
    });

    it("applies articulations to notes", function() {
      let input = stripIndent`
        Title: Test

        a a' a1/2' a^ a/^
      `;

      expect(parser.parse(input).music.map(n => n.articulation)).to.eql([
        undefined, "hammer", "hammer", "upstroke", "upstroke"
      ]);
    });

    it("combines notes in chords", function() {
      let input = stripIndent`
        Title: Test

        [4 5]
      `;

      expect(parser.parse(input).music).to.eql([{
        type: "chord",
        music: [
          {type: "note", position: "4", duration: 1},
          {type: "note", position: "5", duration: 1},
        ]
      }]);
    });

    it("applies marks to chords", function() {
      let input = stripIndent`
        Title: Test

        a -> [4 5] a
      `;

      expect(parser.parse(input).music.map(n => n.mark)).to.eql([
        undefined, "A", undefined
      ]);
    });

    it("applies jumps to chords", function() {
      let input = stripIndent`
        Title: Test

        a [4 5] <- a
      `;

      expect(parser.parse(input).music.map(n => n.jump)).to.eql([
        undefined, "A", undefined
      ]);
    });
  });
});
