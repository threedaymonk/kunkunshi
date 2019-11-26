const expect = require("chai").expect;
const stripIndent = require("common-tags").stripIndent;
const parser = require("../aor-parser.js");

describe("Parser", () => {
  describe("headers", () => {
    it("extracts multiple headers", () => {
      let input = stripIndent`
        Title: Hello World
        Info: I am an example string

        a
      `
      let expected = { "Title": "Hello World", "Info": "I am an example string" }

      expect(parser.parse(input).metadata)
        .to.eql(expected)
    });
  });

  describe("notes", () => {
    it("parses notes", () => {
      let input = stripIndent`
        Title: Test

        a o r
      `
      let expected = [
        {type: "note", position: "a", length: 1},
        {type: "note", position: "o", length: 1},
        {type: "note", position: "r", length: 1},
      ];

      expect(parser.parse(input).music).to.eql(expected)
    });

    it("parses basic positions", () => {
      let input = stripIndent`
        Title: Test

        a o r
        4 z t s
        k 5 6 7 8 9
      `
      let expected = [
        "a", "o", "r",
        "4", "z", "t", "s",
        "k", "5", "6", "7", "8", "9"
      ];

      expect(parser.parse(input).music.map((n) => n.position))
        .to.eql(expected)
    });

    it("parses 下-prefixed positions (g = ge)", () => {
      let input = stripIndent`
        Title: Test

        gs gr
      `
      let expected = ["gs", "gr"];

      expect(parser.parse(input).music.map((n) => n.position))
        .to.eql(expected)
    });

    it("parses fractional note lengths", () => {
      let input = stripIndent`
        Title: Test

        a a/ a/2 a1/2 a/4 a3/2
      `
      let expected = [1, 0.5, 0.5, 0.5, 0.25, 1.5];

      expect(parser.parse(input).music.map((n) => n.length))
        .to.eql(expected)
    });

    it("parses rests", () => {
      let input = stripIndent`
        Title: Test

        0 0/2 03/4
      `
      let expected = [
        {type: "rest", length: 1},
        {type: "rest", length: 0.5},
        {type: "rest", length: 0.75}
      ]

      expect(parser.parse(input).music).to.eql(expected)
    });

    it("applies repetition start marker to next note", () => {
      let input = stripIndent`
        Title: Test

        a -> a A> a B> a C> a a
      `

      let expected = [undefined, "A", "A", "B", "C", undefined]

      expect(parser.parse(input).music.map((n) => n.mark)).to.eql(expected)
    });

    it("applies repetition end marker to preceding note", () => {
      let input = stripIndent`
        Title: Test

        a a <- a <A a <B a <C a
      `

      let expected = [undefined, "A", "A", "B", "C", undefined]

      expect(parser.parse(input).music.map((n) => n.jump)).to.eql(expected)
    });
  });
});
