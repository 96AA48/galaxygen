const fs = require('fs');
const Planet = require('./planet');
const PRNG = require('./prng');
const Star = require('./star');
const MersenneTwister = require('./twister');
const utils = require('./utils');
const data = require('./data.json');

var names = [];
var stars = [];
var planets = [];

function generate() {
    var spiral_arms = 2, spiral_angle_degrees = 360, min_radius = 0.05, max_radius = 0.9, thickness = 0.1, scatter_theta = Math.PI / spiral_arms * 0.2, scatter_radius = min_radius * 0.4, spiral_b = spiral_angle_degrees / Math.PI * min_radius / max_radius, start = (new Date()).getTime(), names = [], rejects = {
        badwords: 0,
        duplicates: 0
    }, totalCount = 1000, i, position;

    pseudoRandom = new PRNG('96aa48');

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
            x: Math.cos(theta) * r * 100,
            y: Math.sin(theta) * r * 100,
            z: pseudoRandom.gaussrandom(thickness * 0.5)
        };
        stars.push(new Star(new_name,pseudoRandom.range(1, 100000),position));
    }
    stars.sort(function(a, b) {
        return a.name > b.name ? 1 : (a.name < b.name ? -1 : 0);
    });

    let temp = stars.pop()

    Object.assign(temp, temp.description());

    for (star of stars) {
      Object.assign(star, star.description());
    }

    fs.writeFileSync(__dirname + '/galaxy.json', JSON.stringify(stars, null, 2))


    console.log('names rejected', rejects);
    console.log('generate elapsed', (((new Date()).getTime() - start) * 0.001).toFixed(3) + "s");
}

generate();
