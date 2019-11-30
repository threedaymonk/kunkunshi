const expect = require("chai").expect;
const load = require("../src/interchange-loader").load;

describe("Interchange loader", function() {
  function minimal() {
    return {title: "Title", music: [], version: 1};
  }

  describe("defaults", function() {
    it("sets documented defaults", function() {
      let metadata = {
        shaku: "low",
        tempo: 100,
        tuning: "h"
      };
      let input = minimal();

      expect(load(input)).to.include(metadata);
    });

    it("does not override supplied values", function() {
      let metadata = {
        shaku: "high",
        tempo: 140,
        tuning: "3s"
      };
      let input = Object.assign(minimal(), metadata);

      expect(load(input)).to.include(metadata);
    });
  });
});
