const MersenneTwister = require('./MersenneTwister');

const name_parts = {
    prefix: ['a', 'aeg', 'ai', 'alf', 'alph', 'amn', 'an', 'and', 'apt', 'arct', 'ard', 'ath', 'aur', 'b', 'bell', 'bet', 'bor', 'c', 'call', 'can', 'canc', 'cap', 'ceph', 'ch', 'chl', 'cr', 'cz', 'delt', 'drac', 'e', 'eps', 'f', 'fom', 'g', 'gamm', 'gall', 'gat', 'gemi', 'gn', 'gr', 'h', 'heph', 'her', 'holl', 'i', 'in', 'ind', 'ir', 'j', 'k', 'kn', 'l', 'lep', 'lin', 'lov', 'm', 'malth', 'mar', 'med', 'mir', 'mirc', 'n', 'nept', 'o', 'or', 'pers', 'p', 'ph', 'plei', 'plut', 'pn', 'poll', 'pr', 'ps', 'pt', 'pyr', 'q', 'qu', 'r', 'rig', 's', 'sag', 'sc', 'sir', 'str', 't', 'taur', 'tell', 'th', 'tn', 'trop', 'ts', 'u', 'ull', 'ult', 'ur', 'v', 'veg', 'vesp', 'vr', 'w', 'wh', 'wr', 'x', 'xz', 'y', 'z', 'z'],
    middle: ['acl', 'ac', 'ad', 'aedr', 'agg', 'al', 'alh', 'alr', 'alt', 'am', 'an', 'apr', 'aqu', 'ar', 'ath', 'cul', 'e', 'ec', 'ed', 'ef', 'egg', 'elg', 'em', 'en', 'eph', 'er', 'et', 'i', 'iat', 'ib', 'ic', 'id', 'ig', 'il', 'ir', 'isc', 'ist', 'itt', 'od', 'of', 'om', 'on', 'oph', 'opt', 'orp', 'om', 'oth', 'ue', 'ulp', 'ulph', 'ur', 'und', 'us', 'ut', 'uu'],
    suffix: ['a', 'ae', 'ai', 'anae', 'ao', 'ar', 'arn', 'aur', 'aut', 'ea', 'ei', 'el', 'eo', 'eon', 'eos', 'es', 'ga', 'ho', 'holm', 'hus', 'i', 'ia', 'iea', 'ii', 'io', 'ion', 'is', 'las', 'o', 'oe', 'oea', 'oi', 'oia', 'on', 'one', 'or', 'orn', 'os', 'ov', 'ova', 'u', 'ua', 'ue', 'ula', 'uo', 'um', 'un', 'us', 'ux', 'z'],
    secondary: ['Major', 'Minor', 'Secundus', 'Tertius', 'Quartus', 'Quintus', 'Septimus', 'Octavus', 'Nonus', 'Decimus']
};

class PRNG {
    constructor(seed) {
        this.mt = new MersenneTwister(seed);
    };

    value() {
        return this.mt.random();
    };

    range(min, max) {
        return Math.floor(this.value() * (max - min + 1) + min);
    };

    realRange(min, max, skew_function) {
        let v = this.value();

        if (typeof skew_function === 'function') {
            v = skew_function(v);
        }

        return v * (max - min) + min;
    };

    gaussrandom(dev = 1.0) {
        let X;
        let context = this.gaussrandom.context;

        if (!context) {
            context = this.gaussrandom.context = {
                phase: 0
            };
        };

        if (context.phase === 0) {
            do {
                context.V1 = this.realRange(-1, 1);
                context.V2 = this.realRange(-1, 1);
                context.S = context.V1 * context.V1 + context.V2 * context.V2;
            }
            while (context.S >= 1 || context.S == 0);

            X = context.V1 * Math.sqrt(-2 * Math.log(context.S) / context.S);

        } else {

            X = context.V2 * Math.sqrt(-2 * Math.log(context.S) / context.S);
        }

        context.phase = 1 - context.phase;

        return X * dev;
    };

    pick(a, weights) {
        let s = 0;
        let idx;

        if (weights !== undefined) {
            for (idx = 0; idx < weights.length; idx++) {
                s += weights[idx];
            }
            s = this.value() * s;
            for (idx = 0; idx < weights.length; idx++) {
                s -= weights[idx];
                if (s < 0) {
                    break;
                }
            }
        } else {
            idx = this.range(0, a.length - 1);
        }
        return a[idx];
    };

    static random_name(PRNG, number_of_syllables, allow_second_name, allow_secondary) {
        let syllables = [];
        let name;
        let suffix;

        syllables.push(PRNG.pick(name_parts.prefix));

        for (var j = 2; j < number_of_syllables; j++) {
            syllables.push(PRNG.pick(name_parts.middle));
        }

        syllables.push(PRNG.pick(name_parts.suffix));

        name = syllables.join('');
        suffix = PRNG.pick(['', 'first-name', 'second-name', 'secondary'], [8, 1, 1, 4]);

        switch (suffix) {
            case 'first-name':
                if (allow_second_name !== false) {
                    name = this.random_name(PRNG, PRNG.range(2, number_of_syllables), false, false).capitalize() + ' ' + name;
                }
                break;
            case 'second-name':
                if (allow_second_name !== false) {
                    name = name + ' ' + this.random_name(PRNG, PRNG.range(2, number_of_syllables), false).capitalize();
                }
                break;
            case 'secondary':
                if (allow_secondary !== false) {
                    name += ' ' + PRNG.pick(name_parts.secondary);
                }
                break;
        }

        return name.capitalize();
    };
}

module.exports = PRNG
