const PRNG = require('./prng');
const utils = require('./utils');

function Planet(name, seed, orbitalRadius, insolation, hasStation) {
  var pseudoRandom = new PRNG(seed),
  template = pseudoRandom.pick(planetTypes, [insolation * 100, 10, 1]);

  this.name = name;
  this.seed = seed;
  this.orbitalRadius = orbitalRadius * 10;
  this.insolation = insolation;
  this.blackbodyK = utils.blackbody(this.insolation);
  this.temperature = this.blackbodyK - 273.15;
  this.classification = template.classification;
  this.radius = pseudoRandom.range(template.radius[0], template.radius[1]) / 2200;
  this.density = pseudoRandom.realRange(template.density[0], template.density[1]);
  this.gravity = utils.gravity(this.radius, this.density);
  this.hydrographics = template.hydrographics(pseudoRandom, this.insolation, this.radius, this.density);
  this.atmosphere = template.atmosphere(pseudoRandom, this.insolation, this.radius, this.density, this.hydrographics);
  this.HI = template.HI(this.insolation, this.radius, this.density, this.hydrographics, this.atmosphere);
  this.habitable = this.HI == 2 && this.temperature > -60 && this.temperature < 60;
  if (pseudoRandom.value() > .9) this.water = {
    color: this.generateWaterColor(this.temperature, pseudoRandom)
  }

  this.color = this.generateColor(this.temperature, this.water, pseudoRandom);


  return this;
}

Planet.prototype.generateStation = function (prng) {
  return {
    size: prng.pick(['small', 'big', 'epic'], [498, 499, 8]),
    economy: prng.pick(['mining', 'agricultural',  'tech', 'industrial', 'residential'], [15, 30, 15, 10, 30])

  }
}

Planet.prototype.generateColor = function (temperature, water, prng) {
  if (temperature < 0 && water) {
    var color = Math.floor(prng.value() * 100) + 155;
    return [color, color, color];
  }
  else {
    return [Math.floor(prng.value() * 100) + 125, Math.floor(prng.value() * 100) + 125, Math.floor(prng.value() * 100) + 125];
  }
}

Planet.prototype.generateWaterColor = function (temperature, prng) {
  if (temperature > 100) return false;
  else {
    return [Math.floor(prng.value() * 60) + 50, Math.floor(prng.value() * 60) + 50, Math.floor(prng.value() * 200) + 55]
  }
}

var planetTypes = [
  {
    classification: "rocky",
    radius: [1000, 15000],
    density: [2, 8],
    hydrographics: function(prng, insolation, radius, density) {
      var g = utils.gravity(radius, density),
          tempK = utils.blackbody(insolation, 0);
      return Math.clamp(prng.realRange(-50, 150 - Math.abs(tempK - 270)) * g - Math.abs(density - 5.5) * 10, 0, 100);
    },
    atmosphere: function(prng, insolation, radius, density, hydrographics) {
      var g = utils.gravity(radius, density);
      if (hydrographics > 0 && insolation > 0.25 && insolation < 2) {
          return prng.pick(['Breathable', 'Filterable', 'Inert', 'Toxic', 'Corrosive', 'Trace'], [1, 2, 2, 1, 1, 1]);
      } else {
          return prng.pick(['Breathable', 'Filterable', 'Inert', 'Toxic', 'Corrosive', 'Trace'], [1, 2, 3, 4, 5, 5]);
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
