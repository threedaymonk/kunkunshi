const fs = require("fs");
const util = require("util");
const parser = require("./aor-parser.js");

const filename = process.argv[2];
console.log(`Processing ${filename}`);
var input = fs.readFileSync(filename, 'UTF-8');

try {
  var tree = parser.parse(input);
  console.log(`Parsed: ${util.inspect(tree, {depth: 10})}`);
} catch(e) {
  console.log(`Error at line ${e.location.start.line}, column ${e.location.start.column}: ${e.message}`);
}
