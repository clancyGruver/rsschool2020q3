import create from './utils/create.js';

export default class Board{
    constructor (boardSize) {
        this.boardSize = boardSize;
        this.board = create('div', 'board');
        this.movable = [];
        this.empty = {
            row: -1,
            cell: -1,
        };
    }

    init () {
        this.newGame();
    }

    emptyBoard () {
        this.board.innerHTML = '';
    }

    newGame () {
        this.createBoard();
        this.boardRender();
    }

    boardRender () {
        this.emptyBoard();
        const imgAttrs = [
            ['src', './assets/images/rec.svg'],
            ['alt', 'empty cell']
        ];
        this.boardArray.forEach( (row, rowIndex) => {
            const rowElement = create('div', 'board__row');
            row.forEach( (cell,cellIndex) => {
                const cellOptions = [
                    ['row', '' + rowIndex],
                    ['cell', '' + cellIndex],
                ];
                const cellElement = create('div', 'board__cell', null, rowElement, ...cellOptions);
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
                    this.empty.row = i;
                    this.empty.cell = j;
                    this.updateMovableElements();
                }
                row.push(value);
            }
            this.boardArray.push(row);
        }

    }

    updateMovableElements (){
        const row = parseInt(this.empty.row);
        const cell = parseInt(this.empty.cell);
        this.movable = [
            `${row - 1}_${cell}`,
            `${row + 1}_${cell}`,
            `${row}_${cell - 1}`,
            `${row}_${cell + 1}`,
        ];
        console.log(this.movable);
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

    move (row, cell) {
        const val = this.boardArray[row][cell];

        this.boardArray[row][cell] = 'icon';
        this.boardArray[this.empty.row][this.empty.cell] = val;

        this.empty.row = row;
        this.empty.cell = cell;
        this.updateMovableElements();
        this.boardRender();
    }
}