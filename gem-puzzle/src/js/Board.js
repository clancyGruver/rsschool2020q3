import create from './utils/create';

export default class Board {
  constructor(boardSize, dragOverHandler) {
    this.boardSize = boardSize;
    this.board = create('div', 'board');
    this.movable = [];
    this.empty = {
      row: -1,
      cell: -1,
    };

    this.makeDraggable(dragOverHandler);
  }

  init() {
    this.newGame();
  }

  emptyBoard() {
    this.board.innerHTML = '';
  }

  newGame() {
    this.createBoard();
    this.boardRender();
  }

  boardRender() {
    this.emptyBoard();
    const imgAttrs = [
      ['src', './assets/images/rec.svg'],
      ['alt', 'empty cell'],
    ];
    this.boardArray.forEach((row, rowIndex) => {
      const rowElement = create('div', 'board__row');
      row.forEach((cell, cellIndex) => {
        const cellOptions = [
          ['row', `${rowIndex}`],
          ['cell', `${cellIndex}`],
        ];
        const cellElement = create('div', 'board__cell', null, rowElement, ...cellOptions);
        if (cell === 'icon') {
          cellElement.classList.add('board__cell--disabled');
          this.emptyCell = create('img', 'board__cell--img', null, cellElement, ...imgAttrs);
        } else {
          const pos = `${rowIndex}_${cellIndex}`;
          if (this.movable.includes(pos)) {
            cellElement.classList.add('board__cell--active');
            cellElement.draggable = true;
          }
          cellElement.textContent = cell;
        }
      });
      this.board.append(rowElement);
    });
  }

  createBoard() {
    this.createShuffledArray();
    this.setEmptyCell();
  }

  setEmptyCell() {
    for (let i = 0; i < this.boardSize; i++) {
      for (let j = 0; j < this.boardSize; j++) {
        const value = this.boardArray[i][j];
        if (value === 'icon') {
          this.empty.row = i;
          this.empty.cell = j;
          this.updateMovableElements();
        }
      }
    }
  }

  updateMovableElements() {
    const row = parseInt(this.empty.row, 10);
    const cell = parseInt(this.empty.cell, 10);
    this.movable = [
      `${row - 1}_${cell}`,
      `${row + 1}_${cell}`,
      `${row}_${cell - 1}`,
      `${row}_${cell + 1}`,
    ];
  }

  createShuffledArray() {
    const numberArray = [];
    let currentNumber = 1;
    for (let i = 0; i < this.boardSize; i++) {
      for (let j = 0; j < this.boardSize; j++) {
        if (i === this.boardSize - 1 && j === this.boardSize - 1) {
          numberArray.push('icon');
        } else {
          numberArray.push(currentNumber);
          currentNumber += 1;
        }
      }
    }
    this.victoryArray = numberArray;
    this.boardArray = numberArray;
    do {
      this.shuffle();
    } while (this.isSolvable());

    const arr = [...this.boardArray];
    this.boardArray = [];
    for (let i = 0; i < this.boardSize; i++) {
      const innerArr = [];
      for (let j = 0; j < this.boardSize; j++) {
        innerArr.push(arr[i * 4 + j]);
      }
      this.boardArray.push(innerArr);
    }
  }

  shuffle() {
    const result = [];
    const tempArr = [...this.boardArray];

    while (tempArr.length > 0) {
      const random = Board.getRandomInt(0, tempArr.length - 1);
      const elem = tempArr.splice(random, 1)[0];
      result.push(elem);
    }

    this.boardArray = result;
  }

  static getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  static isIcon(val) {
    return val === 'icon';
  }

  move(row, cell) {
    const val = this.boardArray[row][cell];

    this.boardArray[row][cell] = 'icon';
    this.boardArray[this.empty.row][this.empty.cell] = val;

    this.empty.row = row;
    this.empty.cell = cell;
    this.updateMovableElements();
    this.boardRender();
  }

  setSize(boardSize) {
    this.boardSize = boardSize;
  }

  setBoardArray(boardArray) {
    this.boardArray = boardArray;
    this.setEmptyCell();
    this.boardRender();
  }

  /**
     * return boolean
     */
  isSolvable() {
    let countInversions = 0;
    const size = this.boardSize * this.boardSize;
    const oneDimentionalArray = [].concat(...this.boardArray);
    for (let i = 0; i < size; i++) {
      if (oneDimentionalArray[i] === 'icon') i += 1;
      for (let j = 0; j < i; j++) {
        if (oneDimentionalArray[j] === 'icon') j += 1;
        if (oneDimentionalArray[j] > oneDimentionalArray[i]) countInversions += 1;
      }
    }
    return countInversions % 2 === 0;
  }

  createVictoryArray() {
    this.victoryArray = [];
    for (let i = 0; i < this.boardSize; i++) {
      const innerArr = [];
      for (let j = 0; j < this.boardSize; j++) {
        innerArr.push(i * 4 + j + 1);
      }
      this.victoryArray.push(innerArr);
    }
    this.victoryArray[this.boardSize - 1][this.boardSize - 1] = 'icon';
  }

  /**
     * return boolean
     */
  isSolved() {
    if (!this.victoryArray) this.createVictoryArray();
    const victory = true;
    const va = [].concat(...this.victoryArray);
    const cb = [].concat(...this.boardArray);
    const size = this.boardSize * this.boardSize;
    for (let i = 0; i < size; i++) {
      if (va[i] !== cb[i]) return false;
    }

    return victory;
  }

  makeDraggable(dragOverHandler) {
    this.board.addEventListener('dragstart', (e) => {
      this.draggedCell = e.target;
      setTimeout(() => { e.target.style.fontSize = 0; }, 0);
    });

    this.board.addEventListener('dragend', (e) => {
      setTimeout(() => { e.target.style.fontSize = '3rem'; }, 0);
      if (this.emptyCell === this.dragOverElement) {
        dragOverHandler({ target: this.draggedCell });
      }
      this.draggedCell = null;
    });

    this.board.addEventListener('dragover', (e) => {
      e.preventDefault();
      const currentElement = e.target;
      this.dragOverElement = currentElement;
    });
  }
}
