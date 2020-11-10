import PageLayout from './PageLayout';
import Board from './Board';
import { get, set, check } from './utils/storage';
import Modal from './Modal';
import declOfNum from './utils/humanNums';
import LeaderBoard from './LeaderBoard';
import randomIntFromTo from './utils/random';

export default class GemGame {
  /**
     * @param {int} boardSizes
     */
  constructor(boardSize) {
    const defaultBoardSize = /*4*/ 3;
    let size = parseInt(boardSize, 10) || defaultBoardSize;
    if (size < 3) size = 3;
    if (size > 8) size = 8;
    this.boardSize = size;
    this.movesCount = 0;

    this.moveHandler = (el) => this.move(el);
  }

  init() {
    this.setRandomImage();

    this.pageLayout = new PageLayout(this.boardSize);
    this.pageLayout.init();

    this.board = new Board(this.boardSize, (e) => this.move(e));
    this.board.init(this.image);

    this.pageLayout.mainContent.appendChild(this.board.board);

    this.modal = new Modal();
    this.modal.init();

    this.setScore();

    this.isSoundOn = true;

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
    this.pageLayout.optionButtons.sound.addEventListener('click', () => this.toggleSound());
    this.pageLayout.optionButtons.solve.addEventListener('click', () => this.solve());

    // field size buttons
    const fieldSizeButtons = this.pageLayout.getFieldSizeButtons();
    Object.keys(fieldSizeButtons).forEach((sizeBtnIdx) => {
      fieldSizeButtons[sizeBtnIdx].addEventListener('click', (e) => { this.changeBoardSize(e); });
    });

    this.movableElements();
    this.startTimer();
  }

  setRandomImage() {
    this.image = `./assets/images/box/${randomIntFromTo(1, 150)}.jpg`;
  }

  solve() {
    const start = new Date();
    this.board.createSolver();
    console.log(`Elapsed time: ${(new Date() - start) / 1000}`);
    console.log(this.board.solver.execute());
  }

  newGame() {
    this.setRandomImage();
    this.board.setImage(this.image);
    this.board.newGame();
    this.startTimer();
    this.setMoves(0);
    this.setScore();
    this.pageLayout.setMoves(this.movesCount);
    this.board.updateBoard();
    this.movableElements();
  }

  saveGame() {
    const params = {
      board: this.board.boardArray,
      boardSize: this.boardSize,
      time: this.timer,
      moves: this.movesCount,
      image: this.image,
      score: this.score,
    };
    set('previousGame', params);
  }

  loadGame() {
    const loadData = get('previousGame');

    this.boardSize = loadData.boardSize;
    this.board.setSize(this.boardSize);
    this.board.setImage(loadData.image);
    this.pageLayout.setBoardSize(this.boardSize);
    this.startTimer(loadData.time);
    this.setMoves(loadData.moves);
    this.pageLayout.setMoves(this.movesCount);

    this.score = loadData.score;
    this.pageLayout.setScore(loadData.score);

    this.board.setBoardArray(loadData.board);
    this.movableElements();
    this.board.updateCellBackground();
    this.board.createVictoryArray();
  }

  toggleSound() {
    this.isSoundOn = !this.isSoundOn;
    const iconName = this.isSoundOn ? 'music_note' : 'music_off';
    this.pageLayout.optionButtons.sound.innerHTML = '';
    this.pageLayout.optionButtons.sound.append(PageLayout.createIcon(iconName));
  }

  move(e) {
    if (e.target.closest('board__cell--disabled') || e.target.tagName === 'img') return false;
    this.board.move(e.target);
    if (this.isSoundOn) {
      this.pageLayout.sounds.move.currentTime = 0;
      this.pageLayout.sounds.move.play();
    }
    this.increaseMoves();
    this.pageLayout.setMoves(this.movesCount);

    this.decreaseScore();
    this.pageLayout.setScore(this.score);

    if (this.board.isSolved()) this.victory();
    setTimeout(() => { this.board.updateBoard(); this.movableElements(); }, 250);
    return true;
  }

  movableElements() {
    this.movable = document.querySelectorAll('.board__cell--active');
    Array.from(document.querySelectorAll('.board__cell')).forEach((el) => el.removeEventListener('click', this.moveHandler));
    Array.from(this.movable).forEach((el) => el.addEventListener('click', this.moveHandler));
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
    this.decreaseScore();
    this.pageLayout.setScore(this.score);
    this.timer += 1;
  }

  decreaseScore() {
    if (this.score <= 0) this.score = 0;
    else this.score -= 1;
  }

  victory() {
    const time = this.pageLayout.getTime();
    const { movesCount } = this;
    const movesName = declOfNum(movesCount, ['ход', 'хода', 'ходов']);
    const scoreName = declOfNum(this.score, ['очко', 'очка', 'очков']);
    if (this.isSoundOn) {
      this.pageLayout.sounds.applause.currentTime = 0;
      this.pageLayout.sounds.applause.play();
    }
    this.modal.show('VICTORY!', `Ура! Вы решили головоломку за ${time} и ${movesCount} ${movesName}. Ваш счет ${this.score} ${scoreName}`);
    this.saveResults(time);
  }

  saveResults(time) {
    const leadersCount = 10;
    const comparator = (a, b) => {
      if (a !== null && b !== null) {
        return a.score - b.score;
      }
      return 1;
    };
    const currentResult = {
      time,
      movesCount: this.movesCount,
      score: this.score,
    };
    let results = [];

    if (check('gemPuzzleResults')) results = get('gemPuzzleResults');

    const leaderBoard = results.sort(comparator);
    const position = leaderBoard.findIndex((leader) => {
      if (leader !== null) {
        return leader.score < this.score;
      }
      return true;
    });
    const leaderBoardTmp = [...leaderBoard];
    for (let i = position; i <= leadersCount; i++) {
      leaderBoard[i + 1] = leaderBoardTmp[i];
    }
    if (position >= 0) {
      leaderBoard[position] = currentResult;
    } else {
      results.unshift(currentResult);
    }

    leaderBoard.length = leadersCount;
    set('gemPuzzleResults', results);
  }

  showResults() {
    let results = [];
    if (check('gemPuzzleResults')) results = get('gemPuzzleResults');
    this.results.clearBoard();
    this.results.setResults(results);
    this.modal.show('board of leaders', this.results.getTable());
  }

  changeBoardSize(sizeBtn) {
    const newBoardSize = sizeBtn.target.dataset.size;
    this.boardSize = newBoardSize;
    this.pageLayout.setBoardSize(newBoardSize);
    this.board.setBoardSize(newBoardSize);
    this.newGame();
  }

  setScore() {
    let score = 0;
    switch (+this.boardSize) {
      case 3: score = 200; break;
      case 4: score = 400; break;
      case 5: score = 800; break;
      case 6: score = 1600; break;
      case 7: score = 3200; break;
      case 8: score = 6400; break;
      default: break;
    }
    this.score = score;
    this.pageLayout.setScore(this.score);
  }

  setMoves(movesCount) {
    this.movesCount = movesCount;
  }

  increaseMoves() {
    this.movesCount += 1;
  }
}
