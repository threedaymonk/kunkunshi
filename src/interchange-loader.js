function defaults() {
  return {
    shaku: "low",
    tempo: 100,
    tuning: "h"
  };
}

function load(obj) {
  return Object.assign(defaults(), obj);
}

module.exports = {
  load: load
};
