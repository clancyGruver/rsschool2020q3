import create from './utils/create.js';

export default class Board{
    constructor (boardSize) {
        this.boardSize = boardSize;
        this.board = create('div', 'board');
        this.movable = [];
    }

    init () {
        this.newGame();
    }

    newGame () {
        this.board.innerHTML = '';
        this.createBoard();
        this.boardRender();
    }

    boardRender () {
        const imgAttrs = [
            ['src', './assets/images/rec.svg'],
            ['alt', 'empty cell']
        ];
        this.boardArray.forEach( (row, rowIndex) => {
            const rowElement = create('div', 'board__row');
            row.forEach( (cell,cellIndex) => {
                const cellElement = create('div', 'board__cell', null, rowElement);
                if(cell === 'icon'){
                    cellElement.classList.add('board__cell--disabled');
                    create('img', 'board__cell--img', null, cellElement, ...imgAttrs);
                } else {
                    const pos = `${rowIndex}_${cellIndex}`;
                    if(this.movable.includes(pos)){
                        cellElement.classList.add('board__cell--active');
                    }
                    cellElement.textContent = cell;
                }
            });
            this.board.append(rowElement);
        });
    }

    createBoard () {
        const numbers = this.getShuffledArray();
        this.fillBoardArray(numbers);
    }

    fillBoardArray (numbers) {
        this.boardArray = [];
        for(let i = 0; i < this.boardSize; i++){
            const row = [];
            for(let j = 0; j < this.boardSize; j++){
                const value = numbers.pop();
                if(value === 'icon'){
                    this.updateMovableElements(i,j);
                }
                row.push(value);
            }
            this.boardArray.push(row);
        }

    }

    updateMovableElements (row, column){
        this.movable = [
            `${row - 1}_${column}`,
            `${row + 1}_${column}`,
            `${row}_${column - 1}`,
            `${row}_${column + 1}`,
        ];
    }

    getShuffledArray () {
        let numberArray = [];
        let currentNumber = 1;
        for(let i = 0; i < this.boardSize; i++){
            for(let j = 0; j < this.boardSize; j++){
                if(i === this.boardSize -1 && j === this.boardSize-1){
                    numberArray.push('icon');
                } else {
                    numberArray.push(currentNumber++);
                }
            }
        }
        return this.shuffle(numberArray);
    }

    shuffle (arr) {
        let result = [];

        while (arr.length > 0) {
            let random = this.getRandomInt(0, arr.length - 1);
            let elem = arr.splice(random, 1)[0];
            result.push(elem);
        }

        return result;
    }

    getRandomInt (min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    isIcon (val) {
        return val === 'icon';
    }
}