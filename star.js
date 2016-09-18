const PRNG = require('./prng');
const Planet = require('./planet');
const utils = require('./utils');
const data = require('./data.json');

function Star(name, seed, position) {
  var pseudoRandom = new PRNG(seed),
     spectralClass = pseudoRandom.pick(["black hole", "O", "B", "A", "F", "G", "K", "M"], [.5, 0.0001, 0.2, 1, 3, 8, 12, 20]),
     spectralIndex = pseudoRandom.range(0, 9),
     stellarTemplate = data.starTypes[spectralClass];

  this.name = name;
  this.seed = seed;
  this.position = position;
  if (spectralClass != 'black hole')
    this.spectralType = spectralClass + spectralIndex;
  else
    this.spectralType = spectralClass;
  this.luminosity = stellarTemplate.luminosity * (4 / (spectralIndex + 2)) * 50;
  this.radius = Math.sqrt(this.luminosity);
  this.numberOfPlanets = pseudoRandom.range(stellarTemplate.planets[0], stellarTemplate.planets[1]);
  this.numberOfStations = pseudoRandom.range(0, this.numberOfPlanets / 20);
  this.planetSeed = pseudoRandom.range(0, 1000000);
  this.color = stellarTemplate.color;
  this.planets = this.generatePlanets();

  return this;
}

Star.prototype.generatePlanets = function () {
  var planets = [],
     pseudoRandom = new PRNG(this.planetSeed),
     radius_min = 0.4 * pseudoRandom.realRange(0.5, 2),
     radius_max = 50 * pseudoRandom.realRange(0.5, 2),
     total_weight = (Math.pow(this.numberOfPlanets, 2) + this.numberOfPlanets) * 0.5,
     r = radius_min

  for (var i = 0; i < this.numberOfPlanets; i++) {
      r += i / total_weight * pseudoRandom.realRange(0.5, 1) * (radius_max - radius_min);
      planets.push(new Planet(utils.kappatalize(this.name) + "-" + utils.romanNumeral(i + 1), pseudoRandom.range(0, 1000000), r, this.luminosity / Math.pow(r, 2)));
  }

  this.divideStations(planets, this.seed);

  return planets;
}

Star.prototype.divideStations = function (planets, seed) {
  var stations = this.numberOfStations || 0;
  var i = planets.length - 1;
  var pseudoRandom = new PRNG(seed);

  for (i = 0; i < stations; i++) {
    var arr = []
    for (planet of planets) {
      arr.push(100 / planets.length);
    }
    var planet = pseudoRandom.pick(planets, arr);
    planet.station = planet.generateStation(pseudoRandom);
    planet.station.seed = planet.seed;
  }

}

module.exports = Star;
