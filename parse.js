const fs = require("fs");
const util = require("util");
const parser = require("./aor-parser.js");

const filename = process.argv[2];
console.log(`Processing ${filename}`);
let input = fs.readFileSync(filename, 'UTF-8');
let tree;

try {
  tree = parser.parse(input);
  console.log(`Parsed: ${util.inspect(tree, {depth: 10})}`);
} catch(e) {
  console.log(`Error at line ${e.location.start.line}, column ${e.location.start.column}: ${e.message}`);
}

let sequence = [];
let offset = 0;

tree.music.forEach(note => {
  let cell = Math.floor(offset / 2);
  let subOffset = offset % 2;
  sequence[cell] = sequence[cell] || [];
  sequence[cell][subOffset] = note;
  offset = offset + note.length * 2;
});

console.log(util.inspect(sequence));
