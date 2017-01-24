const Planet = require('./Planet');
const PRNG   = require('./PRNG');
const { starTypeData } = require('./Astrophysics');

class Star {
    constructor(name, seed, position) {
        this.name     = name;
        this.seed     = seed;
        this.position = position;

        this.position.far_x = (this.position.x * 50000).toFixed(2);
        this.position.far_y = (this.position.y * 50000).toFixed(2);
        this.position.far_z = (this.position.z * 50000).toFixed(2);

        let details   = this.get_details();
        this.radius   = Math.max(Math.min(Math.log(details.luminosity) + 8, 20), 2);
        this.color    = details.template.color;

        this.details  = details;
        this.planets  = this.get_planets();
    };

    romanNumeral(n) {
        const units = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX'];

        if (n == 0) {
            return '';
        } else if (n < 0 || n >= 20) {
            return n;
        } else if (n >= 10) {
            return 'X' + this.romanNumeral(n - 10);
        } else {
            return units[n - 1];
        }
    };

    get_details() {
        let detail          = {};

        let pseudoRandom    = new PRNG(this.seed);
        let spectralClass   = pseudoRandom.pick(['O', 'B', 'A', 'F', 'G', 'K', 'M'], [0.0001, 0.2, 1, 3, 8, 12, 20]);
        let spectralIndex   = pseudoRandom.range(0, 9);
        let stellarTemplate = starTypeData[spectralClass];

        detail.spectralType     = spectralClass + spectralIndex;
        detail.luminosity       = stellarTemplate.luminosity * (4 / (spectralIndex + 2));
        detail.numberOfPlanets  = pseudoRandom.range(stellarTemplate.planets[0], stellarTemplate.planets[1]);
        detail.planetSeed       = pseudoRandom.range(0, 1000000);
        detail.template         = stellarTemplate;

        return detail;
    };

    get_planets() {
        let details         = this.details;
        let planets         = [];
        let pseudoRandom    = new PRNG(details.planetSeed);
        let radius_min      = 0.4 * pseudoRandom.realRange(0.5, 2);
        let radius_max      = 50 * pseudoRandom.realRange(0.5, 2);
        let total_weight    = (Math.pow(details.numberOfPlanets, 2) + details.numberOfPlanets) * 0.5;
        let r               = radius_min;

        for (let i = 0; i < details.numberOfPlanets; i++) {
            r += i / total_weight * pseudoRandom.realRange(0.5, 1) * (radius_max - radius_min);

            planets.push(
                new Planet(this.name.capitalize() + '-' + this.romanNumeral(i + 1), pseudoRandom.range(0, 100000), r, details.luminosity / Math.pow(r, 2))
            );
        }

        return planets;
    };
}

module.exports = Star;
