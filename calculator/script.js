class Calculator{
    constructor(previousOperandTextElement, currentOperandTextElement){
        this.previousOperandTextElement = previousOperandTextElement;
        this.currentOperandTextElement = currentOperandTextElement;
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
        this.operation = operation;
        if(this.currentOperand === '') {
            return false;
        }
        if(this.previousOperand !== ''){
            this.compute();
        }
        this.previousOperand = this.currentOperand;
        this.currentOperand = '';
    }

    compute(){
        let computation;
        let prev = parseFloat(this.previousOperand);
        const current = parseFloat(this.currentOperand);

        if( (this.operation == '+' || this.operation == '-') &&  isNaN(prev)) {
            prev = 0;
        }

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
        this.currentOperand = computation;
        this.operation = undefined;
        this.previousOperand = '';
    }

    updateDisplay(){
        this.currentOperandTextElement.innerText = this.getDisplayNumber(this.currentOperand);
        if(this.operation != null){
            this.previousOperandTextElement.innerText = `${this.getDisplayNumber(this.previousOperand)} ${this.operation}`;
        } else {
            this.previousOperandTextElement.innerText = '';
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

numberButtons.forEach( button => {
    button.addEventListener('click', () => {
        calculator.appendNumber(button.innerText);
        calculator.updateDisplay();
    });
});

operationButtons.forEach( button => {
    button.addEventListener('click', () => {
        calculator.chooseOperation(button.innerText);
        calculator.updateDisplay();
    });
});

equalsButton.addEventListener('click', button => {
    calculator.compute();
    calculator.updateDisplay();
});

allClearButton.addEventListener('click', () => {
    calculator.clear();
    calculator.updateDisplay();
});

deleteButton.addEventListener('click', () => {
    calculator.delete();
    calculator.updateDisplay();
});