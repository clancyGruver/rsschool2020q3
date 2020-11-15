import create from './utils/create';
import randomIntFromTo from './utils/random';
import AStar from './solver/AStar';

export default class Board {
  constructor(boardSize, dragOverHandler) {
    this.boardSize = boardSize;
    this.board = create('div', 'board animate');
    this.movable = {};
    this.movableElements = {};
    this.cells = {};
    this.boardHTML = [];
    this.boardArray = [];
    this.empty = {
      row: -1,
      cell: -1,
      val: 'icon',
    };

    this.makeDraggable(dragOverHandler);
  }

  init(img) {
    this.setImage(img);
    this.newGame();
  }

  createSolver() {
    this.solver = new AStar(this.boardArray, this.get2dVictoryArray(), 'icon');
  }

  emptyBoard() {
    this.board.innerHTML = '';
  }

  newGame() {
    this.createBoard();
    this.boardRender();
    this.updateCellBackground();
  }

  updateBoardHTML() {
    for (let i = 0; i < this.boardSize; i++) {
      this.board.append(this.boardHTML[i]);
    }
  }

  initBoardArray() {
    this.boardArray = [];
    const numberArray = [];
    let currentNumber = 1;
    for (let i = 0; i < this.boardSize; i++) {
      const row = [];
      for (let j = 0; j < this.boardSize; j++) {
        if (i === this.boardSize - 1 && j === this.boardSize - 1) {
          row.push('icon');
        } else {
          row.push(currentNumber);
          currentNumber += 1;
        }
      }
      this.boardArray.push(row);
    }
    this.victoryArray = [...numberArray];
  }

  boardRender() {
    this.emptyBoard();
    this.boardArray.forEach((row, rowIndex) => {
      this.boardHTML[rowIndex] = create('div', 'board__row');
      row.forEach((cell, cellIndex) => {
        const cellOptions = [
          ['row', `${rowIndex}`],
          ['cell', `${cellIndex}`],
        ];
        const cellElement = create('div', 'board__cell', null, this.boardHTML[rowIndex], ...cellOptions);
        if (cell === 'icon') {
          cellElement.classList.add('board__cell--disabled');
          this.emptyCell = cellElement;
        } else {
          const pos = `${rowIndex}_${cellIndex}`;
          if (Object.keys(this.movable).includes(pos)) {
            const moveDirection = this.movable[pos];
            cellElement.classList.add('board__cell--active');
            cellElement.dataset.position = this.movable[pos];
            cellElement.dataset.value = cell;
            cellElement.draggable = true;
            this.movableElements[moveDirection] = cellElement;
          }
          cellElement.textContent = cell;
        }
        this.cells[cell] = cellElement;
      });
    });
    this.updateBoardHTML();
  }

  updateBoard() {
    this.movableElements = {};
    this.boardArray.forEach((row, rowIndex) => {
      row.forEach((cell, cellIndex) => {
        const cellElement = this.cells[cell];
        cellElement.style.top = 0;
        cellElement.style.left = 0;
        if (cell === 'icon') {
          this.emptyCell = cellElement;
        } else {
          const pos = `${rowIndex}_${cellIndex}`;
          if (Object.keys(this.movable).includes(pos)) {
            const moveDirection = this.movable[pos];
            cellElement.classList.add('board__cell--active');
            cellElement.dataset.position = moveDirection;
            cellElement.draggable = true;
            this.movableElements[moveDirection] = cellElement;
          } else {
            cellElement.classList.remove('board__cell--active');
            cellElement.draggable = false;
          }
          cellElement.dataset.row = rowIndex;
          cellElement.dataset.cell = cellIndex;
        }
        this.boardHTML[rowIndex].appendChild(cellElement);
      });
    });
    this.updateBoardHTML();
  }

  setImage(imageSrc) {
    this.image = {
      src: imageSrc,
      img: create('img', 'actualImage', null, null, ['src', imageSrc]),
      percent: 100 / this.boardSize,
    };
  }

  updateCellBackground() {
    const maxVal = this.boardSize * this.boardSize;
    for (let i = 0; i < maxVal - 1; i++) {
      const xPos = `${(this.image.percent * (i % this.boardSize))}%`;
      const yPos = `${(this.image.percent * Math.floor(i / this.boardSize))}%`;
      this.cells[i + 1].style.backgroundImage = `url(${this.image.src})`;
      this.cells[i + 1].style.backgroundSize = `${(+this.boardSize + 1) * 5}rem`;
      this.cells[i + 1].style.backgroundPositionX = xPos;
      this.cells[i + 1].style.backgroundPositionY = yPos;
    }
  }

  createBoard() {
    this.initBoardArray();
    this.randomize();
    this.setEmptyCell();
  }

  setEmptyCell() {
    for (let i = 0; i < this.boardSize; i++) {
      for (let j = 0; j < this.boardSize; j++) {
        const value = this.boardArray[i][j];
        if (value === this.empty.val) {
          this.empty.row = i;
          this.empty.cell = j;
          this.updateMovableElements();
        }
      }
    }
  }

  disableMove() {
    this.movable = {};
    this.movableElements = {};
  }

  updateMovableElements() {
    const row = parseInt(this.empty.row, 10);
    const cell = parseInt(this.empty.cell, 10);
    this.movable = {};
    this.movable[`${row - 1}_${cell}`] = 'top';
    this.movable[`${row + 1}_${cell}`] = 'bottom';
    this.movable[`${row}_${cell - 1}`] = 'left';
    this.movable[`${row}_${cell + 1}`] = 'right';
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
    this.victoryArray = [...numberArray];
    this.boardArray = numberArray;
    do {
      this.shuffle();
    } while (!this.isSolvable());

    const arr = [...this.boardArray];
    this.boardArray = [];
    for (let i = 0; i < this.boardSize; i++) {
      const innerArr = [];
      for (let j = 0; j < this.boardSize; j++) {
        innerArr.push(arr[i * this.boardSize + j]);
      }
      this.boardArray.push(innerArr);
    }
  }

  shuffle() {
    const result = [];
    const tempArr = [...this.boardArray];

    while (tempArr.length > 0) {
      const random = randomIntFromTo(0, tempArr.length - 1);
      const elem = tempArr.splice(random, 1)[0];
      result.push(elem);
    }

    this.boardArray = result;
  }

  static isIcon(val) {
    return val === 'icon';
  }

  /**
   * @param {HTMLElement} HTMLElem
   */
  move(HTMLElem) {
    const elem = HTMLElem;
    const { row, cell, position } = elem.dataset;
    const val = this.boardArray[row][cell];

    switch (position) {
      case 'left':
        this.emptyCell.style.left = '-56px';
        elem.style.left = '56px';
        break;
      case 'right':
        this.emptyCell.style.left = '56px';
        elem.style.left = '-56px';
        break;
      case 'top':
        this.emptyCell.style.top = '-56px';
        elem.style.top = '56px';
        break;
      case 'bottom':
        this.emptyCell.style.top = '56px';
        elem.style.top = '-56px';
        break;
      default: break;
    }

    this.boardArray[row][cell] = 'icon';
    this.boardArray[this.empty.row][this.empty.cell] = val;

    this.empty.row = row;
    this.empty.cell = cell;
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
    const oneDimensionalArray = [].concat(...this.boardArray);
    for (let i = 0; i < size; i++) {
      if (oneDimensionalArray[i] === 'icon') {
        countInversions += Math.floor(i / this.boardSize) + 1;
      } else {
        for (let j = 0; j < i; j++) {
          countInversions += oneDimensionalArray[j] > oneDimensionalArray[i] ? 1 : 0;
        }
      }
    }
    return countInversions % 2 === 0;
  }

  get2dVictoryArray() {
    this.victoryArray = [];
    for (let i = 0; i < this.boardSize; i++) {
      const innerArr = [];
      for (let j = 0; j < this.boardSize; j++) {
        innerArr.push(i * this.boardSize + j + 1);
      }
      this.victoryArray.push(innerArr);
    }
    this.victoryArray[this.boardSize - 1][this.boardSize - 1] = 'icon';
    return this.victoryArray;
  }

  createVictoryArray() {
    this.victoryArray = [];
    for (let i = 0; i < this.boardSize; i++) {
      const innerArr = [];
      for (let j = 0; j < this.boardSize; j++) {
        innerArr.push(i * this.boardSize + j + 1);
      }
      this.victoryArray.push(innerArr);
    }
    this.victoryArray[this.boardSize - 1][this.boardSize - 1] = 'icon';
  }

  /**
     * return boolean
     */
  isSolved() {
    if (!this.victoryArray || this.victoryArray.length === 0) this.createVictoryArray();
    const victory = true;
    const va = [].concat(...this.victoryArray);
    const ba = [].concat(...this.boardArray);
    const size = this.boardSize * this.boardSize;

    for (let i = 0; i < size; i++) {
      if (va[i] !== ba[i]) return false;
    }

    return victory;
  }

  makeDraggable(dragOverHandler) {
    this.board.addEventListener('dragstart', (e) => {
      this.draggedCell = e.target;
      setTimeout(() => { e.target.style.fontSize = 0; }, 0);
    });

    this.board.addEventListener('dragend', (e) => {
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

  setBoardSize(newBoardSize) {
    this.boardSize = newBoardSize;
  }

  randomize() {
    const chaosOrder = 3; //
    const movesCount = this.boardSize ** chaosOrder;
    this.empty.row = this.boardSize - 1;
    this.empty.col = this.boardSize - 1;
    let prevMove = null;

    for (let i = 0; i < movesCount; i++) {
      const directions = this.validMoves();
      if (prevMove !== null && directions.includes(prevMove)) {
        directions.splice(directions.indexOf(prevMove), 1);
      }
      const dirNum = randomIntFromTo(0, directions.length - 1);
      let newRow;
      let newCol;
      switch (directions[dirNum]) {
        case 'Up':
          newRow = this.empty.row - 1;
          this.boardArray[this.empty.row][this.empty.col] = this.boardArray[newRow][this.empty.col];
          this.boardArray[newRow][this.empty.col] = this.empty.val;
          this.empty.row = newRow;
          break;
        case 'Down':
          newRow = this.empty.row + 1;
          this.boardArray[this.empty.row][this.empty.col] = this.boardArray[newRow][this.empty.col];
          this.boardArray[newRow][this.empty.col] = this.empty.val;
          this.empty.row = newRow;
          break;
        case 'Left':
          newCol = this.empty.col - 1;
          this.boardArray[this.empty.row][this.empty.col] = this.boardArray[this.empty.row][newCol];
          this.boardArray[this.empty.row][newCol] = this.empty.val;
          this.empty.col = newCol;
          break;
        case 'Right':
          newCol = this.empty.col + 1;
          this.boardArray[this.empty.row][this.empty.col] = this.boardArray[this.empty.row][newCol];
          this.boardArray[this.empty.row][newCol] = this.empty.val;
          this.empty.col = newCol;
          break;
        default: break;
      }
      prevMove = directions[dirNum];
    }
  }

  validMoves() {
    const { row, col } = this.empty;
    const validMoves = [];
    if (col !== 0) {
      validMoves.push('Left');
    }
    if (col < this.boardSize - 1) {
      validMoves.push('Right');
    }
    if (row !== 0) {
      validMoves.push('Up');
    }
    if (row < this.boardSize - 1) {
      validMoves.push('Down');
    }
    return validMoves;
  }
}
