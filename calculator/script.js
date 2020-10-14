class Calculator{
    constructor(previousOperandTextElement, currentOperandTextElement){
        this.previousOperandTextElement = previousOperandTextElement;
        this.currentOperandTextElement = currentOperandTextElement;
        this.readyToReset = false;
        this.clear();
        this.showMantissa = true;
    }

    clear(){
        this.currentOperand = '';
        this.previousOperand = '';
        this.operation = undefined;
    }

    delete(){
        if(this.currentOperand){
            this.currentOperand = this.currentOperand.toString().slice(0, -1);
        } else {
            return false;
        }
    }

    appendNumber(number){
        if (number === '.' && this.currentOperand.length == 0){
            this.currentOperand = '0.';
        }
        if (number === '.' && this.currentOperand.includes('.')){
            return false;
        }
        this.currentOperand = this.currentOperand.toString() + number.toString();
    }

    chooseOperation(operation){
        if(operation == '√' && (this.currentOperand || this.previousOperand)){
            this.operation = operation;
            this.compute();
            return false;
        }
        if(this.currentOperand === '') {
            return false;
        }
        if(this.previousOperand !== ''){
            this.compute();
        }
        this.operation = operation;
        this.previousOperand = this.currentOperand;
        this.currentOperand = '';
    }

    compute(){
        this.showMantissa = !this.showMantissa;
        let computation;
        let prev = parseFloat(this.previousOperand);
        const current = parseFloat(this.currentOperand);

        if(this.operation !== '√' && (isNaN(prev) || isNaN(current))) return false;

        switch(this.operation){
            case '+': computation = prev + current; break;
            case '-': computation = prev - current; break;
            case '÷': computation = prev / current; break;
            case '*': computation = prev * current; break;
            case '^': computation = prev ** current; break;
            case '√': computation = Math.sqrt(prev || current); break;
            default: return false;
        }
        this.readyToReset = true;
        this.currentOperand = computation;
        this.operation = undefined;
        this.previousOperand = '';
    }

    updateDisplay(){
        if (isNaN(this.currentOperand)){
            this.showError();
            return;
        }
        this.currentOperandTextElement.innerText = this.getDisplayNumber(this.currentOperand);
        if(this.operation != null){
            this.previousOperandTextElement.innerText = `${this.getDisplayNumber(this.previousOperand)} ${this.operation}`;
        } else {
            this.previousOperandTextElement.innerText = this.getDisplayNumber(this.previousOperand);
        }
    }

    showError(){
        this.previousOperand = '';
        this.previousOperandTextElement.innerText = '';
        this.currentOperandTextElement.innerText = 'You broke it';
    }

    getDisplayNumber(number){
        const stringNumber = this.showMantissa ? number.toString() : this.toFixed(number) ;
        const digitsArray = stringNumber.split('.');
        const integerDigits = parseFloat(digitsArray[0]);
        const decimalDigits = digitsArray[1];
        let integerDisplay;

        this.showMantissa = !this.showMantissa ? !this.showMantissa : this.showMantissa;

        if (isNaN(integerDigits)){
            integerDisplay = '';
        } else {
            integerDisplay = integerDigits.toLocaleString('ru', {maximumFractionDigits: 0});
        }

        if (decimalDigits != null){
            return `${integerDisplay}.${decimalDigits}`;
        } else {
            return `${integerDisplay}`;
        }
    }

    negative(){
        if (!this.currentOperand) return false;
        this.currentOperand = this.currentOperand < 0
                            ? Math.abs(this.currentOperand)
                            : this.currentOperand - 2 * this.currentOperand;
    }

    toFixed(value){
        const power = 10 ** 14;
        return String(Math.round(value * power) / power);
    }
}

const numberButtons = document.querySelectorAll('[data-number');
const operationButtons = document.querySelectorAll('[data-operation');
const equalsButton = document.querySelector('[data-equals');
const deleteButton = document.querySelector('[data-delete');
const allClearButton = document.querySelector('[data-all-clear');
const negativeButton = document.querySelector('[data-negative');
const previousOperandTextElement = document.querySelector('[data-previous-operand');
const currentOperandTextElement = document.querySelector('[data-current-operand');

const calculator = new Calculator(previousOperandTextElement, currentOperandTextElement);

const addNUmber = (number) => {
    if (
        calculator.previousOperand === ''
        && calculator.currentOperand !== ""
        && calculator.readyToReset
    ){
        calculator.currentOperand = "";
        calculator.readyToReset = false;
    }
    calculator.appendNumber(number);
    calculator.updateDisplay();
};
const addOperation = (operation) => {
    calculator.chooseOperation(operation);
    calculator.updateDisplay();
};
const compute = () => {
    calculator.compute();
    calculator.updateDisplay();
};
const deleteOperation = () => {
    calculator.delete();
    calculator.updateDisplay();
};
const clearAll = () => {
    calculator.clear();
    calculator.updateDisplay();
}

numberButtons.forEach( button => {
    button.addEventListener('click', () => {
        addNUmber(button.innerText);
    });
});

operationButtons.forEach( button => {
    button.addEventListener('click', () => {
        addOperation(button.innerText);
    });
});

equalsButton.addEventListener('click', () => {
    compute();
});

allClearButton.addEventListener('click', () => {
    clearAll();
});

deleteButton.addEventListener('click', () => {
    deleteOperation();
});

negativeButton.addEventListener('click', () => {
    calculator.negative();
    calculator.updateDisplay();
});

document.addEventListener('keydown', event => {
    const key = event.key.toString().toLowerCase();
    const digit = /\d{1}/;
    const operation = /[/,*,-,+]{1}/;
    if(key === 'enter'){
        compute();
    }
    if(key === 'delete' || key === 'backspace'){
        deleteOperation();
    }
    if(key === 'escape'){
        clearAll();
    }
    if(key.match(digit) !== null){
        addNUmber(key);
    }
    if(key.match(operation) !== null){
        addOperation(key);
    }
});