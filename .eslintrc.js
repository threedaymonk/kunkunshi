module.exports = {
  "env": {
    "commonjs": true,
    "es6": true,
    "mocha": true,
    "node": true
  },
  "extends": [
    "eslint:recommended",
    "plugin:mocha/recommended"
  ],
  "ignorePatterns": ["aor-parser.js"],
  "globals": {
    "Atomics": "readonly",
    "SharedArrayBuffer": "readonly"
  },
  "parserOptions": {
    "ecmaVersion": 2018
  },
  "plugins": [
    "mocha"
  ],
  "rules": {
    "indent": [
      "error",
      2
    ],
    "linebreak-style": [
      "error",
      "unix"
    ],
    "quotes": [
      "error",
      "double"
    ],
    "semi": [
      "error",
      "always"
    ]
  }
};
