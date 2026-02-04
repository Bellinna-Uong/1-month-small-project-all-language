// Unit definitions and their conversions
const unitDefinitions = {
    distance: {
        name: "Distance",
        emoji: "📏",
        units: {
            m: { name: "Meter (m)", toBase: 1 },
            km: { name: "Kilometer (km)", toBase: 1000 },
            cm: { name: "Centimeter (cm)", toBase: 0.01 },
            mm: { name: "Millimeter (mm)", toBase: 0.001 },
            mi: { name: "Mile (mi)", toBase: 1609.344 },
            yd: { name: "Yard (yd)", toBase: 0.9144 },
            ft: { name: "Foot (ft)", toBase: 0.3048 },
            in: { name: "Inch (in)", toBase: 0.0254 },
            nm: { name: "Nautical mile (nm)", toBase: 1852 }
        }
    },
    weight: {
        name: "Weight",
        emoji: "⚖️",
        units: {
            kg: { name: "Kilogram (kg)", toBase: 1 },
            g: { name: "Gram (g)", toBase: 0.001 },
            mg: { name: "Milligram (mg)", toBase: 0.000001 },
            t: { name: "Tonne (t)", toBase: 1000 },
            lb: { name: "Pound (lb)", toBase: 0.453592 },
            oz: { name: "Ounce (oz)", toBase: 0.0283495 },
            st: { name: "Stone (st)", toBase: 6.35029 }
        }
    },
    volume: {
        name: "Volume",
        emoji: "🧪",
        units: {
            l: { name: "Liter (L)", toBase: 1 },
            ml: { name: "Milliliter (mL)", toBase: 0.001 },
            m3: { name: "Cubic meter (m³)", toBase: 1000 },
            cm3: { name: "Cubic centimeter (cm³)", toBase: 0.001 },
            gal: { name: "US Gallon (gal)", toBase: 3.78541 },
            qt: { name: "US Quart (qt)", toBase: 0.946353 },
            pt: { name: "US Pint (pt)", toBase: 0.473176 },
            cup: { name: "US Cup (cup)", toBase: 0.236588 },
            floz: { name: "US Fluid ounce (fl oz)", toBase: 0.0295735 },
            tbsp: { name: "Tablespoon (tbsp)", toBase: 0.0147868 },
            tsp: { name: "Teaspoon (tsp)", toBase: 0.00492892 }
        }
    },
    temperature: {
        name: "Temperature",
        emoji: "🌡️",
        units: {
            c: { name: "Celsius (°C)" },
            f: { name: "Fahrenheit (°F)" },
            k: { name: "Kelvin (K)" }
        }
    }
};

// Conversion class
class UnitConverter {
    constructor() {
        this.currentCategory = 'distance';
    }

    // Standard conversion (distance, weight, volume)
    convertStandard(value, fromUnit, toUnit, category) {
        const units = unitDefinitions[category].units;
        
        // Convert to base unit
        const baseValue = value * units[fromUnit].toBase;
        
        // Convert from base unit to target unit
        const result = baseValue / units[toUnit].toBase;
        
        return result;
    }

    // Temperature conversion (special formulas)
    convertTemperature(value, fromUnit, toUnit) {
        let celsius;

        // Convert to Celsius first
        switch (fromUnit) {
            case 'c':
                celsius = value;
                break;
            case 'f':
                celsius = (value - 32) * 5/9;
                break;
            case 'k':
                celsius = value - 273.15;
                break;
        }

        // Convert from Celsius to target unit
        switch (toUnit) {
            case 'c':
                return celsius;
            case 'f':
                return (celsius * 9/5) + 32;
            case 'k':
                return celsius + 273.15;
        }
    }

    // Main conversion function
    convert(value, fromUnit, toUnit, category) {
        if (value === '' || value === null || value === undefined) {
            return 0;
        }

        const numValue = parseFloat(value);
        
        if (isNaN(numValue)) {
            return 0;
        }

        if (fromUnit === toUnit) {
            return numValue;
        }

        let result;

        if (category === 'temperature') {
            result = this.convertTemperature(numValue, fromUnit, toUnit);
        } else {
            result = this.convertStandard(numValue, fromUnit, toUnit, category);
        }

        // Round to maximum 6 decimal places
        return Math.round(result * 1000000) / 1000000;
    }

    // Get units for a category
    getUnits(category) {
        return unitDefinitions[category].units;
    }

    // Get all categories
    getCategories() {
        return Object.keys(unitDefinitions);
    }

    // Get category information
    getCategoryInfo(category) {
        return unitDefinitions[category];
    }

    // Format result with useful information
    formatResult(value, fromValue, fromUnit, toUnit, category) {
        const categoryInfo = this.getCategoryInfo(category);
        const units = categoryInfo.units;
        
        if (category === 'temperature') {
            return `${fromValue}${this.getTempSymbol(fromUnit)} = ${value}${this.getTempSymbol(toUnit)}`;
        } else {
            return `${fromValue} ${units[fromUnit].name.split('(')[1].replace(')', '')} = ${value} ${units[toUnit].name.split('(')[1].replace(')', '')}`;
        }
    }

    getTempSymbol(unit) {
        switch(unit) {
            case 'c': return '°C';
            case 'f': return '°F';
            case 'k': return 'K';
            default: return '';
        }
    }
}

// Export for use
const converter = new UnitConverter();
