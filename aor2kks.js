const fs = require("fs");
const oneLineTrim = require("common-tags").oneLineTrim;
const parser = require("./src/aor-parser.js");
const filename = process.argv[2];

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

fs.writeSync(1, JSON.stringify(tree, null, 2));
