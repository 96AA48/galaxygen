const fs = require('fs');
const PRNG = require('./prng');
const Star = require('./star');
const utils = require('./utils');
const data = require('./data.json');

var names = [];
var stars = [];
var planets = [];

function generate(seed, amount) {
  if (!amount) amount = 1000;
  if (!seed) seed = 1234;

  var spiral_arms = 2,
      spiral_angle_degrees = 360,
      min_radius = 0.05,
      max_radius = 0.9,
      thickness = 0.1,
      scatter_theta = Math.PI / spiral_arms * 0.2,
      scatter_radius = min_radius * 0.4,
      spiral_b = spiral_angle_degrees / Math.PI * min_radius / max_radius,

      start = (new Date()).getTime(),
      names = [],

      rejects = {
        badwords: 0,
        duplicates: 0
      },

      totalCount = amount,
      i,
      position,
      lastSeed;

  prng = new PRNG(seed);

  for (i = 0; i < totalCount; i++) {
      var number_of_syllables = Math.floor(prng.value() * 2 + 2), new_name;
      while (true) {
          new_name = utils.random_name(prng, number_of_syllables);
          if (names.indexOf(new_name) >= 0) {
              rejects.duplicates++;
          } else if (data.badwords.indexOf(new_name) >= 0 || data.badwords.indexContains(new_name) >= 0) {
              rejects.badwords++
          } else {
              break;
          }
      }
      names.push(new_name);
      var r = prng.realRange(min_radius, max_radius);
      var theta = spiral_b * Math.log(r / max_radius) + prng.gaussrandom(scatter_theta);
      r += prng.gaussrandom(scatter_radius);
      // assign to a spiral arm
      theta += prng.range(0, spiral_arms - 1) * Math.PI * 2 / spiral_arms;
      position = {
          x: (Math.cos(theta) * r) * 100,
          y: (Math.sin(theta) * r) * 100,
          z: prng.gaussrandom(thickness * 0.5) * 100
      };

      //FIXME: For some fucking reason the code only works if I call a prng value right here.
      prng.value()

      stars.push(new Star(new_name, Math.floor(prng.value() * 100000), position));
  }

  return stars;
}

module.exports = {
  "generate": generate
}
