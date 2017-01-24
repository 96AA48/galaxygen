const { gravity, blackbody, planetTypeData } = require('./Astrophysics');
const PRNG = require('./PRNG');

class Planet {
    constructor(name, seed, orbitalRadius, insolation) {
        this.name           = name;
        this.seed           = seed;
        this.orbitalRadius  = orbitalRadius;
        this.insolation     = insolation;

        this.details        = this.get_details();
    };

    get_details() {
        let pseudoRandom = new PRNG(this.seed);
        let detail       = {};
        let template;

        template              = pseudoRandom.pick(planetTypeData, [this.insolation.toFixed(2) * 100, 10, 1]);
        detail.name           = this.name;
        detail.orbitalRadius  = this.orbitalRadius.toFixed(2);
        detail.insolation     = this.insolation.toFixed(2);
        detail.blackbodyK     = blackbody(detail.insolation);
        detail.classification = template.classification;
        detail.radius         = pseudoRandom.range(template.radius[0], template.radius[1]);
        detail.density        = pseudoRandom.realRange(template.density[0], template.density[1]);
        detail.gravity        = gravity(detail.radius, detail.density);
        detail.hydrographics  = typeof template.hydrographics === 'function' && template.hydrographics(pseudoRandom, detail.insolation, detail.radius, detail.density);
        detail.atmosphere     = typeof template.atmosphere === 'function' && template.atmosphere(pseudoRandom, detail.insolation, detail.radius, detail.density, detail.hydrographics);

        Object.assign(detail, template.HI(detail.insolation, detail.radius, detail.density, detail.hydrographics, detail.atmosphere));

        return detail;
    };
};

module.exports = Planet;
