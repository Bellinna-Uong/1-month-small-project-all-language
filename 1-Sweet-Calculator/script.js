const display = document.getElementById('display');

function appendToDisplay(input) {
    display.value += input;
}

function clearDisplay() {
    display.value = "";
}

function deleteLast() {
    display.value = display.value.slice(0, -1);
}

function calculate() {
    try {
        // eval() est utilisé ici pour la simplicité du projet
        display.value = eval(display.value);
    } catch (error) {
        display.value = "Erreur ❤️";
        setTimeout(clearDisplay, 1500);
    }
}