const PRNG = require('./prng');
const Planet = require('./planet');
const utils = require('./utils');
const data = require('./data.json');

function Star(name, seed, position) {
    this.name = name;
    this.seed = seed;
    this.position = position;
    return this;
}
Star.prototype.detail = function() {
    var pseudoRandom = new PRNG(this.seed)
      , detail = {}
      , spectralClass = pseudoRandom.pick(["O", "B", "A", "F", "G", "K", "M"], [0.0001, 0.2, 1, 3, 8, 12, 20])
      , spectralIndex = pseudoRandom.range(0, 9)
      , stellarTemplate = data.starTypes[spectralClass];
    detail.spectralType = spectralClass + spectralIndex;
    detail.luminosity = stellarTemplate.luminosity * (4 / (spectralIndex + 2)) * 50;
    detail.radius = Math.sqrt(detail.luminosity);
    detail.numberOfPlanets = pseudoRandom.range(stellarTemplate.planets[0], stellarTemplate.planets[1]);
    detail.planetSeed = pseudoRandom.range(0, 1000000);
    detail.template = stellarTemplate;
    return detail;
}
Star.prototype.planets = function() {
    var detail = this.detail()
      , planets = []
      , pseudoRandom = new PRNG(detail.planetSeed)
      , radius_min = 0.4 * pseudoRandom.realRange(0.5, 2)
      , radius_max = 50 * pseudoRandom.realRange(0.5, 2)
      , total_weight = (Math.pow(detail.numberOfPlanets, 2) + detail.numberOfPlanets) * 0.5
      , r = radius_min;
    for (var i = 0; i < detail.numberOfPlanets; i++) {
        r += i / total_weight * pseudoRandom.realRange(0.5, 1) * (radius_max - radius_min);
        planets.push(new Planet(utils.kappatalize(this.name) + "-" + utils.romanNumeral(i + 1),pseudoRandom.range(0, 100000),r,detail.luminosity / Math.pow(r, 2)));
    }
    return planets;
}
Star.prototype.description = function() {
    let planets = [];

    for (planet of this.planets()) {
      planet.description = planet.description();
      planets.push(planet);
    }

    return {
      "detail": this.detail(),
      "planets": planets
    }
}

module.exports = Star;
