import PageLayout from './PageLayout';
import Board from './Board';
import { get, set, check } from './utils/storage';
import Modal from './Modal';
import declOfNum from './utils/humanNums';
import LeaderBoard from './LeaderBoard';

export default class GemGame {
  /**
     * @param {int} boardSizes
     */
  constructor(boardSize) {
    const defaultBoardSize = 4;
    let size = parseInt(boardSize, 10) || defaultBoardSize;
    if (size < 3) size = 3;
    if (size > 8) size = 8;
    this.boardSize = size;
  }

  init() {
    this.pageLayout = new PageLayout(this.boardSize);
    this.pageLayout.init();

    this.board = new Board(this.boardSize);
    this.board.init();

    this.pageLayout.mainContent.appendChild(this.board.board);

    this.modal = new Modal();
    this.modal.init();

    if (check('previousGame')) {
      this.modal.confirm(
        'Found saved game',
        'Do you want to load previous game?',
        () => this.loadGame(),
      );
    }

    this.results = new LeaderBoard();
    this.results.init();

    // menu handlers
    this.pageLayout.optionButtons.new.addEventListener('click', () => this.newGame());
    this.pageLayout.optionButtons.save.addEventListener('click', () => this.saveGame());
    this.pageLayout.optionButtons.load.addEventListener('click', () => this.loadGame());
    this.pageLayout.optionButtons.results.addEventListener('click', () => this.showResults());

    this.movableElements();
    this.startTimer();
  }

  newGame() {
    this.board.newGame();
    this.startTimer();
  }

  saveGame() {
    const params = {
      board: this.board.boardArray,
      boardSize: this.boardSize,
      time: this.timer,
      moves: this.pageLayout.movesCount,
    };
    set('previousGame', params);
  }

  loadGame() {
    const loadData = get('previousGame');

    this.boardSize = loadData.boardSize;
    this.board.setSize(this.boardSize);
    this.pageLayout.setSize(this.boardSize);
    this.startTimer(loadData.time);
    this.pageLayout.setMoves(loadData.moves);

    this.board.setBoardArray(loadData.board);
    this.movableElements();
  }

  move(e) {
    const { row, cell } = e.target.dataset;
    this.board.move(row, cell);
    this.movableElements();
    this.pageLayout.increaseMoves();
    if (this.board.isSolved()) this.victory();
  }

  movableElements() {
    this.movable = document.querySelectorAll('.board__cell--active');
    Array.from(this.movable).forEach((el) => el.addEventListener('click', (e) => this.move(e)));
  }

  startTimer(timer) {
    this.timer = timer || 0;
    this.timerClick(0);
    if (this.timerID) {
      clearInterval(this.timerID);
    }
    this.timerID = setInterval(() => this.timerClick(), 1000);
  }

  timerClick(time = null) {
    this.pageLayout.setTime(time || this.timer);
    this.timer += 1;
  }

  victory() {
    const time = this.pageLayout.getTime();
    const movesCount = this.pageLayout.getMoves();
    const movesName = declOfNum(movesCount, ['ход', 'хода', 'ходов']);
    this.modal.show('VICTORY!', `Ура! Вы решили головоломку за ${time} и ${movesCount} ${movesName}`);
    this.saveResults(time, movesCount);
  }

  static saveResults(time, movesCount) {
    let results = [];
    if (check('gemPuzzleResults')) results = get('gemPuzzleResults');
    if (results.length >= 10) results.shift();
    results.push([time, movesCount]);
    set('gemPuzzleResults', results);
  }

  showResults() {
    let results = [];
    if (check('gemPuzzleResults')) results = get('gemPuzzleResults');
    this.results.setResults(results);
    this.modal.show('board of leaders', this.results.getTable());
  }
}
