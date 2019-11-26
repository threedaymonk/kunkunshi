const expect = require("chai").expect;
const stripIndent = require("common-tags").stripIndent;
const parser = require("../aor-parser.js");

describe("Parser", () => {
  describe("metadata", () => {
    it("extracts multiple headers", () => {
      let input = stripIndent`
        Title: Hello World
        Info: I am an example string

        a
      `;

      expect(parser.parse(input).metadata)
        .to.eql({
          "Title": "Hello World",
          "Info": "I am an example string"
        });
    });
  });

  describe("music", () => {
    it("parses notes", () => {
      let input = stripIndent`
        Title: Test

        a o r
      `;

      expect(parser.parse(input).music)
        .to.eql([
          {type: "note", position: "a", length: 1},
          {type: "note", position: "o", length: 1},
          {type: "note", position: "r", length: 1},
        ]);
    });

    it("parses basic positions", () => {
      let input = stripIndent`
        Title: Test

        a o r
        4 z t s
        k 5 6 7 8 9
      `;

      expect(parser.parse(input).music.map((n) => n.position))
        .to.eql([
          "a", "o", "r",
          "4", "z", "t", "s",
          "k", "5", "6", "7", "8", "9"
        ]);
    });

    it("parses 下-prefixed positions (g = ge)", () => {
      let input = stripIndent`
        Title: Test

        gs gr
      `;

      expect(parser.parse(input).music.map((n) => n.position))
        .to.eql(["gs", "gr"]);
    });

    it("parses 亻-prefixed positions (n = ninben)", () => {
      let input = stripIndent`
        Title: Test

        na no
        nr n4 nz nt
        ns nk n5 n6 n7
      `;

      expect(parser.parse(input).music.map((n) => n.position))
        .to.eql([
          "na", "no",
          "nr", "n4", "nz", "nt",
          "ns", "nk", "n5", "n6", "n7"
        ]);
    });

    it("parses 下- and 亻-prefixed positions", () => {
      let input = stripIndent`
        Title: Test

        gns gnr
      `;

      expect(parser.parse(input).music.map((n) => n.position))
        .to.eql(["gns", "gnr"]);
    });

    it("parses note lengths", () => {
      let input = stripIndent`
        Title: Test

        a a/ a/2 a1/2 a/4 a3/2 a2
      `;

      expect(parser.parse(input).music.map((n) => n.length))
        .to.eql([1, 0.5, 0.5, 0.5, 0.25, 1.5, 2]);
    });

    it("parses rests", () => {
      let input = stripIndent`
        Title: Test

        0 0/2 03/4
      `;

      expect(parser.parse(input).music)
        .to.eql([
          {type: "rest", length: 1},
          {type: "rest", length: 0.5},
          {type: "rest", length: 0.75}
        ]);
    });

    it("applies repetition start marker to next note", () => {
      let input = stripIndent`
        Title: Test

        a -> a A> a B> a C> a a
      `;

      expect(parser.parse(input).music.map((n) => n.mark))
        .to.eql([undefined, "A", "A", "B", "C", undefined]);
    });

    it("applies repetition end marker to preceding note", () => {
      let input = stripIndent`
        Title: Test

        a a <- a <A a <B a <C a
      `;


      expect(parser.parse(input).music.map((n) => n.jump))
        .to.eql([undefined, "A", "A", "B", "C", undefined]);
    });

    it("applies articulations to notes", () => {
      let input = stripIndent`
        Title: Test

        a a' a1/2' a^ a/^
      `;


      expect(parser.parse(input).music.map((n) => n.articulation))
        .to.eql([undefined, "hammer", "hammer", "upstroke", "upstroke"]);
    });
  });
});
