const fs = require("fs");
const util = require("util");
const parser = require("./aor-parser.js");

const filename = process.argv[2];
console.log(`Processing ${filename}`);
var input = fs.readFileSync(filename, 'UTF-8');

var tree = parser.parse(input);
console.log("Parsed: "+ util.inspect(tree, {depth: 10}));
