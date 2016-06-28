const PRNG = require('./prng');
const utils = require('./utils');

function Planet(name, seed, orbitalRadius, insolation) {
  var pseudoRandom = new PRNG(this.seed);

  this.name = name;
  this.seed = seed;
  this.orbitalRadius = orbitalRadius * 10;
  this.insolation = insolation;
  this.blackbodyK = utils.blackbody(this.insolation);
  this.template = pseudoRandom.pick(planetTypes, [this.insolation * 100, 10, 1]);
  this.classification = this.template.classification;
  this.radius = pseudoRandom.range(this.template.radius[0], this.template.radius[1]) / 2200;
  this.density = pseudoRandom.realRange(this.template.density[0], this.template.density[1]);
  this.gravity = utils.gravity(this.radius, this.density);
  this.hydrographics = this.template.hydrographics(pseudoRandom, this.insolation, this.radius, this.density);
  this.atmosphere = this.template.atmosphere(pseudoRandom, this.insolation, this.radius, this.density, this.hydrographics);
  this.HI = this.template.HI(this.insolation, this.radius, this.density, this.hydrographics, this.atmosphere);

  return this;
}

var planetTypes = [
  {
    classification: "rocky",
    radius: [1000, 15000],
    density: [2, 8],
    hydrographics: function(pnrg, insolation, radius, density) {
      var g = utils.gravity(radius, density),
          tempK = utils.blackbody(insolation, 0);
      return Math.clamp(pnrg.realRange(-50, 150 - Math.abs(tempK - 270)) * g - Math.abs(density - 5.5) * 10, 0, 100);
    },
    atmosphere: function(pnrg, insolation, radius, density, hydrographics) {
      var g = utils.gravity(radius, density);
      if (hydrographics > 0 && insolation > 0.25 && insolation < 2) {
          return pnrg.pick(['Breathable', 'Filterable', 'Inert', 'Toxic', 'Corrosive', 'Trace'], [1, 2, 2, 1, 1, 1]);
      } else {
          return pnrg.pick(['Breathable', 'Filterable', 'Inert', 'Toxic', 'Corrosive', 'Trace'], [1, 2, 3, 4, 5, 5]);
      }
    },
    HI: function(insolation, radius, density, hydrographics, atmosphere) {
      var g = utils.gravity(radius, density),
          tempK = utils.blackbody(insolation, 0);
      if (atmosphere === "Breathable" && hydrographics > 0 && g < 1.25 && tempK > 230 && tempK < 280) {
          return 1;
      } else if ((atmosphere === "Breathable" || atmosphere === 'Filterable') && g < 2 && tempK > 200 && tempK < 310) {
          return 2;
      } else if (atmosphere === "Corrosive" || g > 2 || tempK > 400) {
          return tempK > 1000 ? 5 : 4;
      } else {
          return 3;
      }
    }
},
{
  classification: "gas giant",
  radius: [15000, 120000],
  density: [0.6, 2.0],
  hydrographics: utils.fixed_value(0),
  atmosphere: utils.fixed_value("Crushing"),
  HI: utils.fixed_value(4)
},
{
  classification: "brown dwarf",
  radius: [120000, 250000],
  density: [0.6, 2.0],
  hydrographics: utils.fixed_value(0),
  atmosphere: utils.fixed_value("Crushing"),
  HI: utils.fixed_value(5)
}];


module.exports = Planet;
