class Calculator{
    constructor(previousOperandTextElement, currentOperandTextElement){
        this.previousOperandTextElement = previousOperandTextElement;
        this.currentOperandTextElement = currentOperandTextElement;
        this.readyToReset = false;
        this.clear();
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
        if(number === '.' && this.currentOperand.includes('.')){
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
        this.currentOperandTextElement.innerText = this.getDisplayNumber(this.currentOperand);
        if(this.operation != null){
            this.previousOperandTextElement.innerText = `${this.getDisplayNumber(this.previousOperand)} ${this.operation}`;
        } else {
            this.previousOperandTextElement.innerText = this.getDisplayNumber(this.previousOperand);
        }
    }

    getDisplayNumber(number){
        const stringNumber = number.toString();
        const digitsArray = stringNumber.split('.');
        const integerDigits = parseFloat(digitsArray[0]);
        const decimalDigits = digitsArray[1];
        let integerDisplay;

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
}

const numberButtons = document.querySelectorAll('[data-number');
const operationButtons = document.querySelectorAll('[data-operation');
const equalsButton = document.querySelector('[data-equals');
const deleteButton = document.querySelector('[data-delete');
const allClearButton = document.querySelector('[data-all-clear');
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
    calculator.clear();
    calculator.updateDisplay();
});

deleteButton.addEventListener('click', () => {
    calculator.delete();
    calculator.updateDisplay();
});

document.addEventListener('keypress', event => {
    const key = event.key.toString().toLowerCase();
    const digit = /\d{1}/;
    const operation = /[/,*,-,+]{1}/;
    if(key === 'enter'){
        compute();
    }
    if(key.match(digit) !== null){
        addNUmber(key);
    }
    if(key.match(operation) !== null){
        addOperation(key);
    }
});