import create from './utils/create';

export default class PageLayout {
  constructor(boardSize) {
    this.boardSize = boardSize;
    this.optionButtons = {};
    this.movesCount = 0;
  }

  init() {
    document.body.prepend(
      this.createHeader(),
      this.createMainContent(),
      this.createFooter(),
    );
  }

  setSize(boardSize = null) {
    if (boardSize) this.boardSize = boardSize;
    this.statisticsFieldSize.textContent = `${this.boardSize} X ${this.boardSize}`;
  }

  createHeader() {
    const statistics = this.createStatistics();

    const options = this.createOptions();

    const headerCaption = create('h1', 'header__caption');
    headerCaption.textContent = 'gem puzzle';

    const headerContainer = create('div', 'header__container', [headerCaption, options, statistics]);
    const header = create('header', 'header', headerContainer);

    return header;
  }

  createMainContent() {
    const container = create('div', 'container');
    const main = create('main', 'main', container);
    this.mainContent = container;

    return main;
  }

  static createFooter() {
    const listItems = [];
    for (let i = 3; i < 9; i++) {
      const btnOptions = [
        ['type', 'button'],
        ['size', i],
      ];
      const btn = create('button', 'field__list--btn', null, null, ...btnOptions);
      btn.textContent = `${i} X ${i}`;
      const li = create('li', 'field__list--element', btn);
      listItems.push(li);
    }
    const fieldList = create('div', 'field__list', listItems);
    const footerContainer = create('div', 'footer__container', fieldList);
    const footer = create('footer', 'footer', footerContainer);

    return footer;
  }

  createOptions() {
    const optionPositions = ['new', 'pause', 'save', 'load', 'results'];
    const optionListElements = optionPositions.map((name) => {
      const btnParams = [['type', 'button'], ['id', name]];
      const btn = create('button', 'field__list--btn', null, null, ...btnParams);
      btn.textContent = name;
      this.optionButtons[name] = btn;
      const li = create('li', 'field__list--element', btn);
      return li;
    });
    const optionsList = create('ul', 'field__list', optionListElements);
    const options = create('div', 'options', optionsList);
    return options;
  }

  createStatistics() {
    const moves = this.createMoves();
    const timer = this.createTimer();

    const rightSide = create('div', 'statistics__right-side', [moves, timer]);

    this.statisticsFieldSize = create('h2', 'field-size');
    const leftSide = create('div', 'statistics__left-side', this.statisticsFieldSize);
    this.setSize();

    const statistics = create('div', 'statistics', [leftSide, rightSide]);

    return statistics;
  }

  createMoves() {
    const movesText = create('span', 'moves__text');
    movesText.textContent = 'moves';
    const movesCount = create('span', 'moves__move-count');
    movesCount.textContent = '00';
    this.movesElement = movesCount;
    const moves = create('div', 'moves', [movesText, movesCount]);

    return moves;
  }

  createTimer() {
    const timeText = create('span', 'time__text');
    timeText.textContent = 'time ';

    const minutes = create('span', 'time__timer--minutes');
    minutes.textContent = '00';
    this.minutesContainer = minutes;
    const seconds = create('span', 'time__timer--seconds');
    seconds.textContent = '00';
    this.secondsContainer = seconds;
    const colon = create('span', 'time__timer--colon');
    colon.textContent = ':';
    const timeTimer = create('div', 'time__timer', [minutes, colon, seconds]);

    const timer = create('div', 'time', [timeText, timeTimer]);

    return timer;
  }

  getMoves() {
    return this.movesCount;
  }

  getTime() {
    return `${this.minutesContainer.textContent}:${this.secondsContainer.textContent}`;
  }

  setTime(time) {
    const { minutes, seconds } = this.createTimeFromSeconds(time);
    this.minutesContainer.textContent = minutes;
    this.secondsContainer.textContent = seconds;
  }

  setMoves(movesCount) {
    this.movesCount = movesCount;
    this.movesElement.textContent = movesCount;
  }

  createTimeFromSeconds(secondsIn) {
    let seconds = parseInt(secondsIn, 10);
    const minutes = Math.floor(seconds / 60);
    seconds %= 60;
    return {
      minutes: this.addZero(minutes),
      seconds: this.addZero(seconds),
    };
  }

  static addZero(val) {
    return parseInt(val, 10) < 10 ? `0${val}` : val;
  }

  increaseMoves() {
    this.movesCount += 1;
    this.movesElement.textContent = this.addZero(this.movesCount);
  }
}
