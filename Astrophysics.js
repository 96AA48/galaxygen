class Astrophysics {
    static gravity(radius, density) {
        return density / 5.56 * radius / 6557;
    }

    static blackbody(insolation, albedo = 0) {
        return Math.pow((1367 * insolation * (1 - albedo)) / (4 * 0.0000000567), 0.25);
    }

    static HI(insolation, radius, density, hydrographics, atmosphere) {
        const g = Astrophysics.gravity(radius, density).toFixed(2);
        const { albedo } = atmosphere ? Astrophysics.atmosphereData[atmosphere] : 0;
        const tempK = Astrophysics.blackbody(insolation, albedo + hydrographics * 0.002).toFixed(1);
        const tempC = (tempK- 275.15).toFixed(1);

        let temperature;

        if (tempC < -150) {
            temperature = 'frigid';
        }
        else if (tempC < -70) {
            temperature = 'very cold';
        }
        else if (tempC < -10) {
            temperature = 'cold';
        }
        else if (tempC < 30) {
            temperature = 'temperate';
        }
        else if (tempC < 60) {
            temperature = 'hot';
        }
        else if (tempC < 120) {
            temperature = 'very hot';
        }
        else {
            temperature = 'inferno';
        }

        let data;

        if (atmosphere === 'Breathable' && hydrographics > 0 && g < 1.25 && ['cold', 'hot', 'temperate'].indexOf(temperature) > -1) {
            data = { HI: 1, description: 'earthlike' };
        }
        else if (['Breathable', 'Filterable'].indexOf(atmosphere) > -1 && g < 2 && ['inferno', 'frigid'].indexOf(temperature) === -1) {
            data = { HI: 2, description: 'survivable' };
        }
        else if (atmosphere === 'Corrosive' || g > 3 || ['inferno', 'frigid'].indexOf(temperature) > -1) {
            data = tempC > 800 ? { HI: 5, description: 'inimical' } : { HI: 1, description: 'robot accessible' };
        }
        else {
            data = { HI: 3, description: 'EVA possible' };
        }

        return Object.assign(data, { g, albedo, tempC, temperature });
    };
};

Astrophysics.starTypeData = {
    'O': {
        luminosity: 50000, color: 0xFFC0FF, planets: [0, 3]
    },
    'B': {
        luminosity: 15000, color: 0xC0A0FF, planets: [1, 5]
    },
    'A': {
        luminosity: 25, color: 0x80C0FF, planets: [1, 7]
    },
    'F': {
        luminosity: 2.5, color: 0xA0FF80, planets: [1, 11]
    },
    'G': {
        luminosity: 1, color: 0xFFFF40, planets: [1, 19]
    },
    'K': {
        luminosity: 0.25, color: 0xFFC040, planets: [1, 9]
    },
    'M': {
        luminosity: 0.05, color: 0xFF4000, planets: [1, 5]
    },
    'black hole': {
        luminosity: 100000, color: 0x800040, planets: [0, 0]
    }
};

Astrophysics.atmosphereData = {
    Breathable: {
        albedo: 0.2, density: 1
    },
    Filterable: {
        albedo: 0.3, density: 1
    },
    Inert: {
        albedo: 0.1, density: 0.5
    },
    Corrosive: {
        albedo: 0.5, density: 2
    },
    Toxic: {
        albedo: 0.4, density: 1.5
    },
    Trace: {
        albedo: 0.05, density: 0.1
    },
    Crushing: {
        albedo: 0.8, density: 100
    }
};

Astrophysics.planetTypeData = [
    {
        classification:'rocky',
        radius: [1000,15000],
        density: [2,8],
        hydrographics: function(pnrg, insolation, radius, density) {
            let g = Astrophysics.gravity(radius, density),
            tempK = Astrophysics.blackbody(insolation, 0);
            return Math.clamp(pnrg.realRange(-50, 150 - Math.abs(tempK - 270)) * g - Math.abs(density - 5.5) * 10, 0, 100).toFixed(0);
        },
        atmosphere: function(pnrg, insolation, radius, density, hydrographics) {
            let g = Astrophysics.gravity(radius, density);
            if (hydrographics > 0 && insolation > 0.25 && insolation < 2) {
                return pnrg.pick(['Breathable', 'Filterable', 'Inert', 'Toxic', 'Corrosive', 'Trace'], [1, 2, 2, 1, 1, 1]);
            }
            else {
                return pnrg.pick(['Breathable', 'Filterable', 'Inert', 'Toxic', 'Corrosive', 'Trace'], [1, 2, 3, 4, 5, 5]);
            }
        },
        HI: Astrophysics.HI
    },
    {
        classification: 'gas giant', radius: [15000, 120000], density: [0.6, 2.0], hydrographics: 0, atmosphere: 'Crushing', HI: Astrophysics.HI
    },
    {
        classification: 'brown dwarf', radius: [120000, 250000], density: [0.6, 2.0], hydrographics: 0, atmosphere: 'Crushing', HI: Astrophysics.HI
    }
];

module.exports = Astrophysics;
