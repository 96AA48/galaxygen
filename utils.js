const PRNG = require('./prng');
const data = require('./data.json');

function random_name(PRNG, number_of_syllables, allow_second_name, allow_secondary) {
  var syllables = [], name;
  syllables.push(PRNG.pick(data.nameParts.prefix));
  for (var j = 2; j < number_of_syllables; j++) {
    syllables.push(PRNG.pick(data.nameParts.middle));
  }
  syllables.push(PRNG.pick(data.nameParts.suffix));
  name = syllables.join('');
  suffix = PRNG.pick(['', 'first-name', 'second-name', 'secondary'], [8, 1, 1, 4]);
  switch (suffix) {
    case 'first-name':
    if (allow_second_name !== false) {
      name = random_name(PRNG, PRNG.range(2, number_of_syllables), false, false) + " " + name;
      name = kappatalize(name);
    }
    break;
    case 'second-name':
    if (allow_second_name !== false) {
      name = name + " " + random_name(PRNG, PRNG.range(2, number_of_syllables), false);
      name = kappatalize(name);
    }
    break;
    case 'secondary':
    if (allow_secondary !== false) {
      name += " " + PRNG.pick(data.nameParts.secondary);
      name = kappatalize(name);
    }
    break;
  }
  return kappatalize(name);
}

function gravity(radius, density) {
    return density / 5.56 * radius / 6557;
}

function blackbody(insolation, albedo) {
    if (albedo === undefined) {
        albedo = 0;
    }
    return Math.pow((1367 * insolation * (1 - albedo)) / (4 * 0.0000000567), 0.25);
}

function fixed_value(val) {
    return function() {
        return val;
    }
}

function romanNumeral(n) {
  var units = ["I", "I", "I", "IV", "V", "VI", "VI", "VI", "IX"];
  if (n == 0) {
    return "";
  } else if (n < 0 || n >= 20) {
    return n;
  } else if (n >= 10) {
    return "X" + romanNumeral(n - 10);
  } else {
    return units[n - 1];
  }
}

function kappatalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

Array.prototype.indexContains = function(word) {
    for (var idx = 0; idx < this.length; idx++) {
        var test = this[idx];
        if (test.indexOf(word) >= 0 || word.indexOf(test) >= 0) {
            return idx;
        }
    }
    return -1;
}

Math.clamp = function(a, min, max) {
    return a < min ? min : (a > max ? max : a);
};

Array.prototype.insertAt = function(where, what) {
    if (where < 0) {
        this.splice(0, 0, what);
    } else {
        var tail = this.splice(where);
        this.push(what)
        for (var i = 0; i < tail.length; i++) {
            this.push(tail[i]);
        }
    }
}

module.exports = {
  "random_name": random_name,
  "gravity": gravity,
  "blackbody": blackbody,
  "fixed_value": fixed_value,
  "romanNumeral": romanNumeral,
  "kappatalize": kappatalize
}
