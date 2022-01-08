let currentValue = [0]; /* value currently displayed */
let previousValue = []; /* previous value entered or calculated */
let operator = undefined; /* user's inputed operation. is a function */

const screen = document.querySelector('#display');
const numberButtons = document.querySelectorAll('button#number');
const clearButton = document.querySelector('#clear');
const additionButton = document.querySelector('#addition');
const substractionButton = document.querySelector('#substraction');
const multiplicationButton = document.querySelector('#multiplication');
const divisionButton = document.querySelector('#division');
const equalButton = document.querySelector('#equal');
const commaButton = document.querySelector('#comma');
const errorIndicator = document.querySelector('#error');

function updateDisplay() {
    /* limit number length to 8 */
    let isDecimal = currentValue.includes('.');
    let maxIntegerLength = (isDecimal) ? 7 : 8;
    let integerLength = (isDecimal) ? currentValue.slice(0, currentValue.indexOf('.')).length : currentValue.length;
    let decimalLength = 8 - integerLength;

    let number;
    if(integerLength <= maxIntegerLength) {
        number = parseFloat(parseFloat(currentValue.join('')).toFixed(decimalLength));
    } else {
        let overflowArray = currentValue.filter(n => n != '.');
        overflowArray.splice(1, 0, '.');
        overflowArray = overflowArray.slice(0, 9);
        number = parseFloat(parseFloat(overflowArray.join('')).toFixed(7));
        overflow();
    }

    let display = number.toString();
    display = (currentValue.at(-1) == '.') ? display + '.' : display; /* add comma at the end */
    display = display.replace('.', '<span class="comma">.</span>'); /* add class to comma so it takes less width */

    screen.innerHTML = display;
}

function overflow() {
    errorIndicator.classList.toggle('hidden');
    currentValue = [];
    previousValue = [];
}

function inputNumber(value) {
    if(!errorIndicator.classList.contains('hidden')) errorIndicator.classList.toggle('hidden');
    if (!operator) previousValue = [];

    /* not more than 8 numbers and not multiple 0 at the beginning */
    if (currentValue.length < 8 && !(value == 0 && currentValue.length == 1 && currentValue[0] == 0)) {
        if (currentValue.length == 1 && currentValue[0] == 0) currentValue = []; /* clear 0 if it's the only number */
        currentValue.push(value);
        updateDisplay();
    }
}

function inputComma() {
    if(currentValue.length != 0 && currentValue.length < 8 && !currentValue.includes('.')) {
        currentValue.push('.');
        updateDisplay();
    }
}

function clear() {
    currentValue = [0];
    previousValue = [];
    operator = undefined;
    if(!errorIndicator.classList.contains('hidden')) errorIndicator.classList.toggle('hidden');
    updateDisplay();
}

function executeOperation() {
    if (operator) {
        let previousNumber = parseFloat(previousValue.join(''));
        let currentNumber = parseFloat(currentValue.join(''));
        let result = operator(previousNumber, currentNumber); /* execute function stored in operator */
        currentValue = result.toString().split('');

        updateDisplay();
        operator = undefined; /* reset operator */
        previousValue = currentValue;
        currentValue = [];
    }
}

function newOperation(ope) {
    /* execute the pending operation if there is one */
    if (operator && currentValue.length != 0) {
        executeOperation();
    } else if (currentValue.length != 0) {
        previousValue = currentValue;
        currentValue = [];
    }

    operator = ope;
}

numberButtons.forEach((btn) => {
    btn.addEventListener('mousedown', (e) => inputNumber(e.target.getAttribute('data-value')));
});

clearButton.addEventListener('mousedown', clear);
equalButton.addEventListener('mousedown', executeOperation);
commaButton.addEventListener('mousedown', inputComma);

additionButton.addEventListener('mousedown', () => newOperation((a, b) => a + b));
substractionButton.addEventListener('mousedown', () => newOperation((a, b) => a - b));
multiplicationButton.addEventListener('mousedown', () => newOperation((a, b) => a * b));
divisionButton.addEventListener('mousedown', () => newOperation((a, b) => a / b));

updateDisplay();