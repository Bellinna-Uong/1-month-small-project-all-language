// Application state
let currentCategory = 'distance';

// DOM elements
const categoryButtons = document.querySelectorAll('.category-btn');
const fromValueInput = document.getElementById('fromValue');
const toValueInput = document.getElementById('toValue');
const fromUnitSelect = document.getElementById('fromUnit');
const toUnitSelect = document.getElementById('toUnit');
const swapBtn = document.getElementById('swapBtn');
const resultInfo = document.getElementById('resultInfo');

// Initialize NeutralinoJS
function initNeutralinoJS() {
    Neutralino.init();

    // Handle NeutralinoJS events
    Neutralino.events.on("windowClose", () => {
        Neutralino.app.exit();
    });

    console.log('NeutralinoJS initialized ✅');
}

// Update unit selectors
function updateUnitSelectors() {
    const units = converter.getUnits(currentCategory);
    const unitKeys = Object.keys(units);

    // Clear selectors
    fromUnitSelect.innerHTML = '';
    toUnitSelect.innerHTML = '';

    // Add options
    unitKeys.forEach(key => {
        const option1 = document.createElement('option');
        option1.value = key;
        option1.textContent = units[key].name;
        fromUnitSelect.appendChild(option1);

        const option2 = document.createElement('option');
        option2.value = key;
        option2.textContent = units[key].name;
        toUnitSelect.appendChild(option2);
    });

    // Select different default units
    if (unitKeys.length > 1) {
        fromUnitSelect.value = unitKeys[0];
        toUnitSelect.value = unitKeys[1];
    }
}

// Perform conversion
function performConversion() {
    const fromValue = fromValueInput.value;
    const fromUnit = fromUnitSelect.value;
    const toUnit = toUnitSelect.value;

    const result = converter.convert(fromValue, fromUnit, toUnit, currentCategory);
    
    // Add animation
    toValueInput.classList.add('converting');
    setTimeout(() => {
        toValueInput.classList.remove('converting');
    }, 300);

    toValueInput.value = result;

    // Display information
    if (fromValue && fromValue !== '0' && fromValue !== '') {
        const info = converter.formatResult(result, fromValue, fromUnit, toUnit, currentCategory);
        resultInfo.textContent = `✨ ${info}`;
    } else {
        resultInfo.textContent = 'Enter a value to convert 🎯';
    }
}

// Swap units
function swapUnits() {
    const tempValue = fromUnitSelect.value;
    fromUnitSelect.value = toUnitSelect.value;
    toUnitSelect.value = tempValue;

    // Also swap values
    const tempInputValue = fromValueInput.value;
    fromValueInput.value = toValueInput.value;

    performConversion();
}

// Change category
function changeCategory(category) {
    currentCategory = category;

    // Update active buttons
    categoryButtons.forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.category === category) {
            btn.classList.add('active');
        }
    });

    // Update selectors
    updateUnitSelectors();

    // Reset values
    fromValueInput.value = '0';
    performConversion();
}

// Event handlers
categoryButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        changeCategory(btn.dataset.category);
    });
});

fromValueInput.addEventListener('input', performConversion);
fromUnitSelect.addEventListener('change', performConversion);
toUnitSelect.addEventListener('change', performConversion);
swapBtn.addEventListener('click', swapUnits);

// Allow editing output value for reverse conversion
toValueInput.addEventListener('focus', () => {
    toValueInput.removeAttribute('readonly');
});

toValueInput.addEventListener('blur', () => {
    toValueInput.setAttribute('readonly', 'readonly');
});

toValueInput.addEventListener('input', () => {
    const toValue = toValueInput.value;
    const fromUnit = fromUnitSelect.value;
    const toUnit = toUnitSelect.value;

    const result = converter.convert(toValue, toUnit, fromUnit, currentCategory);
    fromValueInput.value = result;

    if (toValue && toValue !== '0' && toValue !== '') {
        const info = converter.formatResult(result, toValue, toUnit, fromUnit, currentCategory);
        resultInfo.textContent = `✨ ${info}`;
    }
});

// Keyboard handling
fromValueInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        performConversion();
    }
});

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
    initNeutralinoJS();
    updateUnitSelectors();
    performConversion();
    
    // Welcome message
    setTimeout(() => {
        resultInfo.textContent = 'Ready to convert! 🚀';
    }, 500);
});

// Error handling
window.addEventListener('error', (e) => {
    console.error('Error:', e.error);
});

// Development log
console.log('Conversion application initialized 🎨');
