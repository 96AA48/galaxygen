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

  var spiral_arms = 2, spiral_angle_degrees = 360, min_radius = 0.05, max_radius = 0.9, thickness = 0.1, scatter_theta = Math.PI / spiral_arms * 0.2, scatter_radius = min_radius * 0.4, spiral_b = spiral_angle_degrees / Math.PI * min_radius / max_radius, start = (new Date()).getTime(), names = [], rejects = {
      badwords: 0,
      duplicates: 0
  }, totalCount = amount, i, position;

  pseudoRandom = new PRNG(seed);

  for (i = 0; i < totalCount; i++) {
      var number_of_syllables = Math.floor(pseudoRandom.value() * 2 + 2), new_name;
      while (true) {
          new_name = utils.random_name(pseudoRandom, number_of_syllables);
          if (names.indexOf(new_name) >= 0) {
              rejects.duplicates++;
          } else if (data.badwords.indexOf(new_name) >= 0 || data.badwords.indexContains(new_name) >= 0) {
              rejects.badwords++
          } else {
              break;
          }
      }
      names.push(new_name);
      var r = pseudoRandom.realRange(min_radius, max_radius);
      var theta = spiral_b * Math.log(r / max_radius) + pseudoRandom.gaussrandom(scatter_theta);
      r += pseudoRandom.gaussrandom(scatter_radius);
      // assign to a spiral arm
      theta += pseudoRandom.range(0, spiral_arms - 1) * Math.PI * 2 / spiral_arms;
      position = {
          x: (Math.cos(theta) * r) * 100,
          y: (Math.sin(theta) * r) * 100,
          z: pseudoRandom.gaussrandom(thickness * 0.5) * 100
      };
      stars.push(new Star(new_name,pseudoRandom.range(1, 100000),position));
  }

  return stars;
}

module.exports = {
  "generate": generate
}
