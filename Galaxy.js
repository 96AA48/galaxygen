const PRNG        = require('./PRNG');
const badwords    = require('./badwords');
const utils       = require('./utils');
const Star        = require('./Star');

const spiral_arms           = 2;
const spiral_angle_degrees  = 360;
const min_radius            = 0.05;
const max_radius            = 0.9;
const thickness             = 0.1;
const scatter_theta         = Math.PI / spiral_arms * 0.2;
const scatter_radius        = min_radius * 0.4;
const spiral_b              = spiral_angle_degrees / Math.PI * min_radius / max_radius;
const names                 = [];
const rejects               = { badwords: 0, duplicates: 0 };

class Galaxy {
    constructor(seed, number_of_stars) {
        this.stars = [];

        let i;
        let position;

        let pseudoRandom = new PRNG(seed);

        for (i = 0; i < number_of_stars; i++) {
            let number_of_syllables = Math.floor(pseudoRandom.value() * 2 + 2);
            let new_name;

            while (true) {
                new_name = PRNG.random_name(pseudoRandom, number_of_syllables);

                if (names.indexOf(new_name) >= 0) {
                    rejects.duplicates++;
                }
                else if (badwords.indexOf(new_name) >= 0 || badwords.indexContains(new_name) >= 0) {
                    rejects.badwords++
                }
                else {
                    break;
                }
            }

            names.push(new_name);

            let r = pseudoRandom.realRange(min_radius, max_radius);
            let theta = spiral_b * Math.log(r / max_radius) + pseudoRandom.gaussrandom(scatter_theta);

            r += pseudoRandom.gaussrandom(scatter_radius);

            theta += pseudoRandom.range(0, spiral_arms - 1) * Math.PI * 2 / spiral_arms;

            position = {
                x: Math.cos(theta) * r,
                y: Math.sin(theta) * r,
                z: pseudoRandom.gaussrandom(thickness * 0.5)
            };

            this.stars.push(new Star(new_name, pseudoRandom.range(1, 100000), position));
        }
    }
}

module.exports = Galaxy;
