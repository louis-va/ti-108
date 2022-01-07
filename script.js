let currentValue = [0]; /* value currently displayed */
let previousValue = []; /* previous value entered or calculated */
let operator = undefined; /* user's inputed operation. is a function */

const screen = document.querySelector('#display');
const numberButtons = document.querySelectorAll('button#number');
const clearButton = document.querySelector('#clear')
const additionButton = document.querySelector('#addition')
const substractionButton = document.querySelector('#substraction')
const multiplicationButton = document.querySelector('#multiplication')
const divisionButton = document.querySelector('#division')
const equalButton = document.querySelector('#equal')

function updateDisplay() {
    screen.textContent = currentValue.join('');
}

function clear() {
    currentValue = [0];
    previousValue = [];
    operator = undefined;
    screen.textContent = '0';
}

function inputNumber(value) {
    if(!operator) previousValue = [];

    /* not more than 8 numbers and not multiple 0 at the beginning */
    if (currentValue.length < 8 && !(value == 0 && currentValue.length == 1 && currentValue[0] == 0)) {
        /* clear 0 if it's the only number */
        if (currentValue.length == 1 && currentValue[0] == 0) currentValue = [];
        currentValue.push(value);
        updateDisplay();
    }
}

function executeOperation() {
    if (operator) {
        let previousNumber = parseFloat(previousValue.join(''));
        let currentNumber = parseFloat(currentValue.join(''));
        let result = operator(previousNumber, currentNumber);
        currentValue = result.toString().split('');

        updateDisplay();
        operator = undefined;
        previousValue = currentValue;
        currentValue = [];
    }
}

function newOperation(ope) {
    /* execute the pending operation if there is one */
    if (previousValue.length != 0 && currentValue.length != 0) {
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

additionButton.addEventListener('mousedown', () => newOperation((a, b) => a + b));
substractionButton.addEventListener('mousedown', () => newOperation((a, b) => a - b));
multiplicationButton.addEventListener('mousedown', () => newOperation((a, b) => a * b));
divisionButton.addEventListener('mousedown', () => newOperation((a, b) => a / b));